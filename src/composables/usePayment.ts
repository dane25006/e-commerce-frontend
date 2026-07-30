import { ref, computed, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { paymentService } from '@/services/paymentService'
import { orderService } from '@/services/orderService'

export type PaymentStatus = 'loading' | 'waiting' | 'success' | 'error' | 'order-error'

interface TimerHandle { start: () => void; stop: () => void; reset: () => void }

const POLL_INTERVAL = 4000

export function usePayment() {
  const route = useRoute()

  const orderId = computed(() => Number(route.params.orderId))

  const status = ref<PaymentStatus>('loading')
  const qrString = ref<string | null>(null)
  const qrImage = ref<string | null>(null)
  const amount = ref(0)
  const currency = ref('USD')
  const productName = ref('')
  const errorMessage = ref('')
  const expired = ref(false)
  const confirming = ref(false)
  const expiresIn = ref(1800)
  const timerRef = ref<TimerHandle | null>(null)

  let pollTimer: ReturnType<typeof setTimeout> | null = null
  let polling = false
  let consecutiveErrors = 0

  async function loadOrder(): Promise<boolean> {
    try {
      const { data } = await orderService.getOne(orderId.value)
      const order = data.order
      amount.value = order.total
      currency.value = 'USD'
      productName.value = `Order #${order.id}`
      return true
    } catch {
      status.value = 'order-error'
      return false
    }
  }

  async function generatePayment(): Promise<void> {
    status.value = 'loading'
    expired.value = false
    errorMessage.value = ''
    confirming.value = false

    try {
      const { data } = await paymentService.generate(orderId.value)
      qrString.value = data.payment.qr_string
      qrImage.value = null
      consecutiveErrors = 0
      await nextTick()
      timerRef.value?.reset?.()
      status.value = 'waiting'
      startPolling()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      status.value = 'error'
      errorMessage.value = e.response?.data?.message || 'Failed to generate payment QR. Please try again.'
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
    if (status.value === 'success' || expired.value) {
      polling = false
      return
    }
    if (typeof document !== 'undefined' && document.hidden) {
      schedulePoll()
      return
    }
    try {
      const { data } = await paymentService.status(orderId.value)
      consecutiveErrors = 0
      if (data.payment?.status === 'paid') {
        status.value = 'success'
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
    if (pollTimer) {
      clearTimeout(pollTimer)
      pollTimer = null
    }
  }

  function resumeIfVisible(): void {
    if (typeof document !== 'undefined' && !document.hidden && polling && !pollTimer && status.value === 'waiting' && !expired.value) {
      schedulePoll()
    }
  }

  async function confirmPayment(): Promise<void> {
    confirming.value = true
    errorMessage.value = ''
    try {
      const { data } = await paymentService.confirm(orderId.value)
      if (data.payment.status === 'paid') {
        status.value = 'success'
        stopPolling()
        timerRef.value?.stop?.()
      } else {
        status.value = 'error'
        errorMessage.value = 'Payment not yet received. Please try again after paying.'
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      status.value = 'error'
      errorMessage.value = e.response?.data?.message || 'Payment verification failed. Please try again.'
    } finally {
      confirming.value = false
    }
  }

  function onExpired(): void {
    expired.value = true
    stopPolling()
  }

  function onQrError(): void {
    status.value = 'error'
    errorMessage.value = 'Failed to render QR code.'
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
    orderId,
    status,
    qrString,
    qrImage,
    amount,
    currency,
    productName,
    errorMessage,
    expired,
    confirming,
    expiresIn,
    timerRef,
    loadOrder,
    generatePayment,
    startPolling,
    stopPolling,
    confirmPayment,
    onExpired,
    onQrError,
  }
}