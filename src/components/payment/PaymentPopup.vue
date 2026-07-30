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

        <!-- Paid Success -->
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
let pollCount = 0

const POLL_INTERVAL = 4000
const CONFIRM_AFTER_POLLS = 3

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
  pollCount = 0
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
  pollCount++
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
    if (pollCount >= CONFIRM_AFTER_POLLS) {
      try {
        await paymentService.confirm(props.orderId!)
      } catch {
        // confirm may fail if not yet paid
      }
    }
  } catch {
    consecutiveErrors++
    if (consecutiveErrors >= 5) {
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

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && polling && !pollTimer && payment.value && !paid.value) {
      schedulePoll()
    }
  })
}

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', () => {})
  }
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
  padding: 12px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.popup-container {
  width: 100%;
  max-width: 340px;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  animation: cardIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ========== STEP 1: CHECKOUT ========== */

.checkout-top {
  background: #0B101A;
  padding: 24px 24px 20px;
  text-align: center;
}

.checkout-label {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 10px;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px;
  line-height: 1.3;
}

.price-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price-amount {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}

.price-currency {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
}

/* Bottom half */
.checkout-bottom {
  background: #fff;
  padding: 18px 24px 16px;
}

.method-label {
  display: block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #94A3B8;
  margin-bottom: 12px;
}

.payment-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  background: #F9FAFB;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.payment-btn:hover {
  background: #F1F5F9;
}

.pay-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #EE1C25;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.khqr-badge {
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
}

.pay-info {
  flex: 1;
  min-width: 0;
}

.pay-title {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 1px;
}

.pay-desc {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #94A3B8;
}

.pay-arrow {
  font-size: 15px;
  color: #94A3B8;
  flex-shrink: 0;
}

.footer-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 14px;
  font-size: 10px;
  font-weight: 500;
  color: #94A3B8;
}

.footer-note i {
  font-size: 11px;
}

/* ========== STEP 2: QR CODE ========== */

.qr-header {
  background: #EE1C25;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(200, 16, 26, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(200, 16, 26, 0.8);
}

.khqr-logo {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
}

.qr-body {
  background: #fff;
  padding: 18px 24px 22px;
  text-align: center;
}

.qr-product {
  font-size: 12px;
  font-weight: 500;
  color: #94A3B8;
  margin-bottom: 4px;
}

.qr-amount-row {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 14px;
}

.qr-amount {
  font-size: 28px;
  font-weight: 800;
  color: #1E293B;
  letter-spacing: -0.5px;
}

.qr-currency {
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
}

.dashed-divider {
  border: none;
  border-top: 1.5px dashed #CBD5E1;
  margin-bottom: 18px;
}

.qr-code-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.timer-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 100px;
  background: #F1F5F9;
  font-size: 12px;
  font-weight: 600;
  color: #1E293B;
  font-variant-numeric: tabular-nums;
  transition: all 0.3s;
}

.timer-pill.expired {
  background: #FEF2F2;
  color: #DC2626;
}

.timer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timer-dot.green {
  background: #22C55E;
  box-shadow: 0 0 4px rgba(34, 197, 94, 0.4);
  animation: pulse-dot 1.5s ease-in-out infinite;
}

.timer-dot.red {
  background: #DC2626;
  box-shadow: 0 0 4px rgba(220, 38, 38, 0.4);
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.qr-footer-text {
  margin-top: 16px;
  font-size: 11px;
  font-weight: 500;
  color: #94A3B8;
}

/* ========== STATES ========== */

.loading-state,
.error-state {
  text-align: center;
  padding: 32px 0;
}

.loading-state i {
  font-size: 28px;
  color: #EE1C25;
  margin-bottom: 10px;
  display: block;
}

.loading-state p {
  font-size: 13px;
  color: #94A3B8;
}

.error-state i {
  font-size: 28px;
  color: #DC2626;
  margin-bottom: 10px;
  display: block;
}

.error-state p {
  font-size: 12px;
  color: #DC2626;
  margin-bottom: 14px;
}

.retry-btn {
  padding: 8px 22px;
  border-radius: 10px;
  background: #EE1C25;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
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
  font-size: 22px;
  color: #fff;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.success-title {
  font-size: 16px;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 4px;
}

.success-desc {
  font-size: 12px;
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
  font-size: 13px;
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
