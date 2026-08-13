<template>
  <Transition name="popup">
    <div v-if="modelValue" class="popup-overlay" @click.self="onCancel">
      <div class="popup-container" role="dialog" aria-modal="true">

        <!-- Step 1: Checkout -->
        <template v-if="step === 'checkout'">
          <div class="checkout-top">
            <span class="checkout-label">CHECKOUT</span>
            <p class="product-name">{{ productName }}</p>
            <div class="price-row">
              <span class="price-amount">${{ amount.toFixed(2) }}</span>
              <span class="price-currency">USD / mo</span>
            </div>
          </div>

          <div class="checkout-bottom">
            <span class="method-label">SELECT PAYMENT METHOD</span>

            <button class="payment-btn" @click="goToStep2">
              <span class="pay-icon">
                <span class="khqr-badge">KHQR</span>
              </span>
              <span class="pay-info">
                <span class="pay-title">Bakong KHQR</span>
                <span class="pay-desc">Scan with any KHQR member bank</span>
              </span>
              <i class="ti ti-chevron-right pay-arrow" />
            </button>

            <p class="footer-note">
              <i class="ti ti-lock-check" /> Secured payment &middot; No card data stored
            </p>
          </div>
        </template>

        <!-- Step 2: QR Code -->
        <template v-else-if="step === 'qr'">
          <div class="qr-header">
            <button class="back-btn" @click="step = 'checkout'">
              <i class="ti ti-chevron-left" />
            </button>
            <span class="khqr-logo">KHQR</span>
          </div>

          <div class="qr-body">
            <div v-if="loading" class="loading-state">
              <i class="ti ti-loader-2 animate-spin" />
              <p>{{ t('payment.generating') }}</p>
            </div>

            <div v-else-if="error" class="error-state">
              <i class="ti ti-alert-circle" />
              <p>{{ error }}</p>
              <button class="retry-btn" @click="generateQR">{{ t('payment.tryAgain') }}</button>
            </div>

            <template v-else-if="payment && qrString">
              <p class="qr-product">{{ productName }}</p>

              <div class="qr-amount-row">
                <span class="qr-amount">${{ payment.amount.toFixed(2) }}</span>
                <span class="qr-currency">USD</span>
              </div>

              <div class="dashed-divider" />

              <div class="qr-code-wrap">
                <QRCodeCard
                  :qr-string="qrString"
                  :qr-image="null"
                  :expired="expired"
                  :show-retry="expired && !paid"
                  retry-text="Generate New QR"
                  hide-actions
                  center-label="$"
                  compact
                  :qr-size="180"
                  @retry="generateQR"
                />

                <div class="timer-pill" :class="{ expired }">
                  <span class="timer-dot" :class="{ green: !expired, red: expired }" />
                  <span v-if="!expired">Expires in {{ formattedCountdown }}</span>
                  <span v-else>QR Code Expired</span>
                </div>
              </div>

              <p class="qr-footer-text">Scan with ABA Mobile or any KHQR app</p>
            </template>
          </div>
        </template>

        <!-- Step 3: Paid Success -->
        <template v-else-if="step === 'paid'">
          <div class="success-screen">
            <div class="success-icon-wrap">
              <i class="ti ti-circle-check" />
            </div>
            <h2 class="success-title">Payment Successful</h2>
            <p class="success-desc">Your payment has been confirmed.</p>
            <button class="done-btn" @click="onDone">Continue</button>
          </div>
        </template>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { paymentService } from '@/services/paymentService'
import type { Payment } from '@/types/payment'
import QRCodeCard from '@/components/payment/QRCodeCard.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  orderId: number | null
  productName?: string
  amount?: number
  startWithQr?: boolean
}>(), {
  startWithQr: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: [orderId: number]
}>()

const { t } = useI18n()

const step = ref<'checkout' | 'qr' | 'paid'>('checkout')
const loading = ref(false)
const error = ref('')
const payment = ref<Payment | null>(null)
const qrString = ref('')
const expired = ref(false)
const paid = ref(false)
const countdown = ref(1800)
let countdownTimer: ReturnType<typeof setInterval> | null = null
let pollTimer: ReturnType<typeof setTimeout> | null = null
let polling = false
let consecutiveErrors = 0

const POLL_INTERVAL = 3000

const productName = computed(() => props.productName || `Order #${props.orderId}`)
const amount = computed(() => props.amount || 0)

const formattedCountdown = computed(() => {
  const total = Math.max(0, countdown.value)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

watch(() => props.modelValue, (val) => {
  if (val && props.orderId) {
    step.value = props.startWithQr ? 'qr' : 'checkout'
    expired.value = false
    paid.value = false
    if (props.startWithQr) {
      generateQR()
    }
  } else if (!val) {
    cleanup()
  }
})

function goToStep2() {
  step.value = 'qr'
  generateQR()
}

async function generateQR() {
  if (!props.orderId) return
  loading.value = true
  error.value = ''
  payment.value = null
  qrString.value = ''
  expired.value = false
  try {
    const { data } = await paymentService.generate(props.orderId)
    payment.value = data.payment
    qrString.value = data.payment.qr_string || data.payment.deeplink || ''
    startCountdown()
    startPolling()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    error.value = e.response?.data?.message || t('payment.errorGenerate')
  } finally {
    loading.value = false
  }
}

function startCountdown() {
  countdown.value = 1800
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      expired.value = true
      stopCountdown()
      stopPolling()
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
  stopPolling()
  polling = true
  schedulePoll()
}

function schedulePoll() {
  if (!polling) return
  pollTimer = setTimeout(pollOnce, POLL_INTERVAL)
}

async function pollOnce() {
  if (!polling) return
  if (!payment.value || paid.value) {
    polling = false
    return
  }
  if (typeof document !== 'undefined' && document.hidden) {
    schedulePoll()
    return
  }
  try {
    const { data } = await paymentService.status(props.orderId!)
    consecutiveErrors = 0
    if (data.payment) {
      payment.value = data.payment
      if (data.payment.status === 'paid') {
        paid.value = true
        stopPolling()
        stopCountdown()
        step.value = 'paid'
        return
      }
    }
  } catch {
    consecutiveErrors++
    if (consecutiveErrors >= 10) {
      stopPolling()
      return
    }
  }
  schedulePoll()
}

function stopPolling() {
  polling = false
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
}

function onDone() {
  cleanup()
  emit('success', props.orderId!)
  emit('update:modelValue', false)
}

function cleanup() {
  stopCountdown()
  stopPolling()
  payment.value = null
  qrString.value = ''
  error.value = ''
  loading.value = false
  expired.value = false
  paid.value = false
  step.value = 'checkout'
}

function onCancel() {
  cleanup()
  emit('update:modelValue', false)
}

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 16px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.popup-container {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: var(--font-body);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* ========== STEP 1: CHECKOUT ========== */

.checkout-top {
  padding: 24px 20px 20px;
  background: #FAFAF9;
  border-bottom: 1px dashed #E2E8F0;
  text-align: center;
}

.checkout-label {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #94A3B8;
  display: block;
  margin-bottom: 4px;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 8px;
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price-amount {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0F172A;
}

.price-currency {
  font-size: 0.75rem;
  color: #64748B;
  font-weight: 500;
}

.checkout-bottom {
  padding: 20px;
}

.method-label {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #94A3B8;
  display: block;
  margin-bottom: 12px;
}

.payment-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.payment-btn:hover {
  border-color: #E6CA85;
  background: #FFFDF9;
  box-shadow: 0 2px 8px rgba(184, 138, 68, 0.1);
}

.pay-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #EE1C25;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.khqr-badge {
  color: #ffffff;
  font-weight: 900;
  font-size: 0.6875rem;
  letter-spacing: 0.05em;
}

.pay-info {
  flex: 1;
  min-width: 0;
}

.pay-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1E293B;
  display: block;
}

.pay-desc {
  font-size: 0.6875rem;
  color: #64748B;
  display: block;
  margin-top: 1px;
}

.pay-arrow {
  color: #94A3B8;
  font-size: 0.875rem;
}

.footer-note {
  font-size: 0.6875rem;
  color: #94A3B8;
  text-align: center;
  margin: 16px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.footer-note i {
  color: #22C55E;
}

/* ========== STEP 2: QR CODE ========== */

.qr-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  border-bottom: 1px solid #F1F5F9;
}

.back-btn {
  position: absolute;
  left: 12px;
  background: none;
  border: none;
  color: #64748B;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.15s;
}

.back-btn:hover {
  background: #F1F5F9;
  color: #1E293B;
}

.khqr-logo {
  font-size: 0.875rem;
  font-weight: 900;
  color: #EE1C25;
  letter-spacing: 0.1em;
}

.qr-body {
  padding: 16px 20px 20px;
  text-align: center;
}

.loading-state,
.error-state {
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #64748B;
  font-size: 0.8125rem;
}

.loading-state i {
  font-size: 1.5rem;
  color: #B88A44;
}

.error-state i {
  font-size: 1.5rem;
  color: #DC2626;
}

.retry-btn {
  margin-top: 8px;
  padding: 6px 16px;
  border-radius: 8px;
  background: #1E293B;
  color: #fff;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
}

.qr-product {
  font-size: 0.8125rem;
  color: #64748B;
  font-weight: 500;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.qr-amount-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 12px;
}

.qr-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0F172A;
}

.qr-currency {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748B;
}

.dashed-divider {
  border-top: 1px dashed #E2E8F0;
  margin: 0 0 14px;
}

.qr-code-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.timer-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  background: #F1F5F9;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #475569;
}

.timer-pill.expired {
  background: #FEE2E2;
  color: #DC2626;
}

.timer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.timer-dot.green {
  background: #22C55E;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
}

.timer-dot.red {
  background: #DC2626;
}

.qr-footer-text {
  font-size: 0.6875rem;
  color: #94A3B8;
  margin: 12px 0 0;
}

/* ========== STEP 3: SUCCESS ========== */

.success-screen {
  padding: 32px 24px;
  text-align: center;
}

.success-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #22C55E;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  animation: scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-icon-wrap i {
  font-size: 1.375rem;
  color: #fff;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.success-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 4px;
}

.success-desc {
  font-size: 0.75rem;
  color: #64748B;
  margin-bottom: 20px;
}

.done-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: #1E293B;
  color: #fff;
  font-weight: 700;
  font-size: 0.8125rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.done-btn:hover {
  background: #334155;
  transform: translateY(-1px);
}

/* ========== TRANSITIONS ========== */

.popup-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.popup-leave-active {
  transition: all 0.2s ease-in;
}
.popup-enter-from {
  opacity: 0;
}
.popup-leave-to {
  opacity: 0;
}
</style>
