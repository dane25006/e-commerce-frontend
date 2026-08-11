import { ref, computed, onUnmounted } from 'vue'
import { topUpService } from '@/services/topUpService'

export type TopUpStep = 'form' | 'qr'
export type PageStatus = 'loading' | 'waiting' | 'success' | 'error'

interface TimerHandle { start: () => void; stop: () => void; reset: () => void }

const POLL_INTERVAL = 4000

export function useTopUp() {
  const step = ref<TopUpStep>('form')
  const currency = ref('USD')
  const selectedAmount = ref(0)
  const customAmount = ref('')
  const generating = ref(false)

  const amount = ref(0)
  const qrString = ref<string | null>(null)
  const expiresIn = ref(1800)
  const pageStatus = ref<PageStatus>('loading')
  const errorMessage = ref('')
  const expired = ref(false)
  const confirming = ref(false)
  const timerRef = ref<TimerHandle | null>(null)
  const currentPaymentId = ref<number | null>(null)

  let pollTimer: ReturnType<typeof setTimeout> | null = null
  let polling = false
  let consecutiveErrors = 0

  const quickAmounts = computed(() =>
    currency.value === 'KHR' ? [1000, 2000, 5000, 10000, 20000] : [5, 10, 20, 50, 100]
  )

  const validAmount = computed(() => {
    const amt = selectedAmount.value > 0 ? selectedAmount.value : parseFloat(customAmount.value)
    if (!amt || isNaN(amt)) return false
    return currency.value === 'KHR'
      ? amt >= 100 && amt <= 99999999
      : amt >= 0.01 && amt <= 999999.99
  })

  function getAmount(): number {
    return selectedAmount.value > 0 ? selectedAmount.value : parseFloat(customAmount.value)
  }

  async function generatePayment(): Promise<void> {
    generating.value = true
    step.value = 'form'
    expired.value = false
    pageStatus.value = 'loading'
    errorMessage.value = ''

    const amt = getAmount()

    try {
      const { data } = await topUpService.generate(amt, currency.value)
      amount.value = data.payment.amount
      currency.value = data.payment.currency
      qrString.value = data.payment.qr_string
      currentPaymentId.value = data.payment.id
      consecutiveErrors = 0

      step.value = 'qr'
      pageStatus.value = 'waiting'
      startPolling()
    } catch {
      pageStatus.value = 'error'
      errorMessage.value = 'Failed to generate QR code. Please try again.'
    } finally {
      generating.value = false
    }
  }

  function startPolling(): void {
    stopPolling()
    polling = true
    schedulePoll()
  }

  function schedulePoll(): void {
    if (!polling) return
    pollTimer = setTimeout(pollOnce, POLL_INTERVAL)
  }

  async function pollOnce(): Promise<void> {
    if (!polling) return
    if (pageStatus.value === 'success' || expired.value || !currentPaymentId.value) {
      polling = false
      return
    }
    if (typeof document !== 'undefined' && document.hidden) {
      schedulePoll()
      return
    }
    try {
      const { data } = await topUpService.status(currentPaymentId.value)
      consecutiveErrors = 0
      if (data.payment?.status === 'paid') {
        pageStatus.value = 'success'
        stopPolling()
        timerRef.value?.stop?.()
        return
      }
    } catch {
      consecutiveErrors++
      if (consecutiveErrors >= 5) {
        stopPolling()
      }
    }
    schedulePoll()
  }

  function stopPolling(): void {
    polling = false
    if (pollTimer) { clearTimeout(pollTimer); pollTimer = null }
  }

  function resumeIfVisible(): void {
    if (typeof document !== 'undefined' && !document.hidden && polling && !pollTimer && pageStatus.value === 'waiting' && !expired.value) {
      schedulePoll()
    }
  }

  async function confirmPayment(): Promise<void> {
    if (!currentPaymentId.value) return
    confirming.value = true
    try {
      const { data } = await topUpService.confirm(currentPaymentId.value)
      if (data.payment?.status === 'paid') {
        pageStatus.value = 'success'
        stopPolling()
        timerRef.value?.stop?.()
      } else {
        pageStatus.value = 'error'
        errorMessage.value = 'Payment not yet received. Please try again after paying.'
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      pageStatus.value = 'error'
      errorMessage.value = e.response?.data?.message || 'Payment verification failed. Please try again.'
    } finally {
      confirming.value = false
    }
  }

  function regenerate(): void {
    if (!currentPaymentId.value) {
      void generatePayment()
      return
    }
    stopPolling()
    expired.value = false
    pageStatus.value = 'loading'
    errorMessage.value = ''
    step.value = 'form'
  }

  function onExpired(): void {
    expired.value = true
    stopPolling()
  }

  function onQrError(): void {
    pageStatus.value = 'error'
    errorMessage.value = 'Failed to render QR code.'
  }

  function backToForm(): void {
    step.value = 'form'
    expired.value = false
    pageStatus.value = 'loading'
    errorMessage.value = ''
    stopPolling()
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', resumeIfVisible)
  }

  onUnmounted(() => {
    stopPolling()
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', resumeIfVisible)
    }
  })

  return {
    step, currency, selectedAmount, customAmount, generating,
    amount, qrString, expiresIn, pageStatus, errorMessage,
    expired, confirming, timerRef, currentPaymentId,
    quickAmounts, validAmount,
    getAmount, generatePayment, confirmPayment, regenerate,
    onExpired, onQrError, backToForm,
  }
}