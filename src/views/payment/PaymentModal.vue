<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="onCancel">
      <div class="modal-container">
        <button class="close-btn" @click="onCancel">
          <i class="ti ti-x" />
        </button>

        <div class="modal-header">
          <div class="header-icon">
            <i class="ti ti-qrcode" />
          </div>
          <h2 class="header-title">{{ $t('payment.scanToPay') }}</h2>
        </div>

        <div class="modal-body">
          <!-- Loading -->
          <div v-if="loading" class="loading-state">
            <i class="ti ti-loader-2 animate-spin" />
            <p>{{ $t('payment.generating') }}</p>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="error-state">
            <i class="ti ti-alert-circle" />
            <p>{{ error }}</p>
            <button @click="generateQR" class="retry-btn">{{ $t('payment.tryAgain') }}</button>
          </div>

          <!-- QR -->
          <template v-else-if="payment">
            <!-- Order Info -->
            <div class="order-summary">
              <div class="order-row">
                <span class="order-label">{{ $t('payment.orderNumber') }}</span>
                <span class="order-value">#{{ payment.order_id }}</span>
              </div>
              <div class="order-row">
                <span class="order-label">{{ $t('payment.amount') }}</span>
                <span class="order-value amount">${{ payment.amount.toFixed(2) }} {{ payment.currency }}</span>
              </div>
              <div class="order-row">
                <span class="order-label">{{ $t('payment.paymentMethod') }}</span>
                <span class="order-value">
                  <span class="badge-bakong">🇰🇭 Bakong KHQR</span>
                </span>
              </div>
            </div>

            <div class="divider" />

            <!-- QR Code -->
            <div class="qr-section">
              <div class="qr-frame">
                <canvas ref="qrCanvas"></canvas>
              </div>

              <div class="accepted-by">
                <span class="accepted-label">{{ $t('payment.acceptedBy') }}</span>
                <div class="bank-list">
                  <span class="bank-item">✔ Bakong</span>
                  <span class="bank-item">✔ ABA</span>
                  <span class="bank-item">✔ ACLEDA</span>
                  <span class="bank-item">✔ Wing</span>
                </div>
              </div>
            </div>

            <div class="divider" />

            <!-- Status & Countdown -->
            <div class="status-section">
              <div v-if="payment.status === 'paid'" class="status-paid">
                <i class="ti ti-circle-check" />
                <span>{{ $t('payment.paid') }}</span>
              </div>
              <div v-else class="status-waiting">
                <i class="ti ti-clock" />
                <span>{{ $t('payment.waitingForPayment') }}</span>
              </div>

              <div class="countdown" :class="{ expired: countdown <= 0 }">
                <i class="ti ti-alarm" />
                <span>{{ formattedCountdown }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button
                v-if="payment.status !== 'paid'"
                @click="confirmPayment"
                :disabled="confirming"
                class="confirm-btn"
              >
                <i v-if="confirming" class="ti ti-loader-2 animate-spin" />
                <i v-else class="ti ti-check" />
                {{ confirming ? $t('payment.verifying') : $t('payment.iHavePaid') }}
              </button>

              <button @click="onCancel" class="cancel-btn">
                <i class="ti ti-x" />
                {{ $t('payment.cancelPayment') }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { paymentService } from '@/services/paymentService'
import QRCode from 'qrcode'
import type { Payment } from '@/types/payment'

const props = defineProps<{
  visible: boolean
  orderId: number | null
}>()

const emit = defineEmits<{
  close: []
  success: [orderId: number]
}>()

const { t } = useI18n()
const router = useRouter()

const loading = ref(false)
const confirming = ref(false)
const error = ref('')
const payment = ref<Payment | null>(null)
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const countdown = ref(600)
const countdownFormatted = ref('10:00')
let countdownTimer: ReturnType<typeof setInterval> | null = null
let pollTimer: ReturnType<typeof setInterval> | null = null

const formattedCountdown = computed(() => {
  const total = Math.max(0, countdown.value)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

watch(() => props.visible, (val) => {
  if (val && props.orderId) {
    generateQR()
  } else if (!val) {
    cleanup()
  }
})

async function generateQR() {
  if (!props.orderId) return
  loading.value = true
  error.value = ''
  payment.value = null
  try {
    const { data } = await paymentService.generate(props.orderId)
    payment.value = data.payment
    await nextTick()
    await renderQR()
    startCountdown()
    startPolling()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    error.value = e.response?.data?.message || t('payment.errorGenerate')
  } finally {
    loading.value = false
  }
}

async function renderQR() {
  if (!qrCanvas.value || !payment.value) return
  const qrContent = payment.value.qr_string || payment.value.deeplink || ''
  if (!qrContent) return
  try {
    await QRCode.toCanvas(qrCanvas.value, qrContent, {
      width: 200,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
    })
  } catch {
    error.value = t('payment.errorGenerate')
  }
}

function startCountdown() {
  countdown.value = 600
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      stopCountdown()
    }
  }, 1000)
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

function startPolling() {
  pollTimer = setInterval(async () => {
    if (!payment.value || payment.value.status === 'paid') return
    try {
      const { data } = await paymentService.status(props.orderId!)
      if (data.payment) {
        payment.value = data.payment
        if (data.payment.status === 'paid') {
          stopPolling()
          stopCountdown()
          emit('success', props.orderId!)
        }
      }
    } catch {
      // silent
    }
  }, 5000)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

async function confirmPayment() {
  if (!props.orderId) return
  confirming.value = true
  error.value = ''
  try {
    const { data } = await paymentService.confirm(props.orderId)
    if (data.payment.status === 'paid') {
      payment.value!.status = 'paid'
      stopPolling()
      stopCountdown()
      emit('success', props.orderId)
    } else {
      error.value = t('payment.paymentNotReceived')
    }
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    error.value = e.response?.data?.message || t('payment.errorConfirm')
  } finally {
    confirming.value = false
  }
}

function cleanup() {
  stopCountdown()
  stopPolling()
  payment.value = null
  error.value = ''
  loading.value = false
}

function onCancel() {
  cleanup()
  emit('close')
}

onUnmounted(cleanup)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: var(--surface);
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--background);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  font-size: 16px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--border);
  color: var(--text);
}

.modal-header {
  text-align: center;
  padding: 32px 24px 16px;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}

.header-icon i {
  font-size: 24px;
  color: #fff;
}

.header-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
}

.modal-body {
  padding: 0 24px 24px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px 0;
}

.loading-state i {
  font-size: 36px;
  color: var(--primary);
  margin-bottom: 12px;
}

.loading-state p {
  font-size: 14px;
  color: var(--text-muted);
}

.error-state i {
  font-size: 36px;
  color: #dc2626;
  margin-bottom: 12px;
}

.error-state p {
  font-size: 13px;
  color: #dc2626;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 24px;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  border: none;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0;
}

.order-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.order-label {
  color: var(--text-muted);
  font-weight: 600;
}

.order-value {
  font-weight: 700;
  color: var(--text);
}

.order-value.amount {
  font-size: 18px;
  color: var(--primary);
}

.badge-bakong {
  padding: 3px 10px;
  border-radius: 100px;
  background: rgba(184, 138, 68, 0.1);
  font-size: 11px;
  font-weight: 700;
}

.divider {
  height: 1px;
  background: var(--border);
  margin: 16px 0;
}

.qr-section {
  text-align: center;
}

.qr-frame {
  display: inline-flex;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
  border: 2px solid var(--border);
  margin-bottom: 12px;
}

.qr-frame canvas {
  display: block;
  width: 200px;
  height: 200px;
  image-rendering: pixelated;
}

.accepted-by {
  margin-top: 8px;
}

.accepted-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.bank-list {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.bank-item {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
}

.status-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.status-waiting,
.status-paid {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}

.status-waiting {
  color: var(--primary);
}

.status-waiting i {
  animation: pulse 2s infinite;
}

.status-paid {
  color: #16a34a;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.countdown {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.countdown.expired {
  color: #dc2626;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 24px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(184, 138, 68, 0.3);
  transform: translateY(-1px);
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px 24px;
  border-radius: 10px;
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 13px;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
}

/* Modal transition */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: translateY(30px) scale(0.95);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-container {
  transform: translateY(30px) scale(0.95);
}
</style>
