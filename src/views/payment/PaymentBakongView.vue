<template>
  <div class="khqr-page">
    <div class="khqr-card">
      <PaymentHeader />

      <PaymentAmount
        :product-name="productName"
        :amount="amount"
        :currency="currency"
      />

      <div class="divider" />

      <!-- Loading state -->
      <div v-if="status === 'loading'" class="skeleton-area">
        <div class="skeleton qr-sk" />
        <div class="skeleton timer-sk" />
        <div class="skeleton text-sk" />
      </div>

      <!-- Payment content -->
      <template v-else-if="status === 'waiting' || status === 'success' || status === 'error'">
        <QRCodeCard
          :qr-string="qrString"
          :qr-image="null"
          :expired="expired"
          @error="onQrError"
        />

        <CountdownTimer
          ref="timerRef"
          :expires-in="1800"
          @expired="onExpired"
        />

        <div class="status-area">
          <div v-if="status === 'waiting' && !expired" class="waiting-indicator">
            <div class="pulse-dot" />
            <span>{{ $t('payment.waitingForPayment') }}</span>
          </div>
        </div>

        <div v-if="!expired && status === 'waiting'" class="action-wrap">
          <button @click="checkPaymentNow" class="check-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {{ $t('payment.checkPayment') }}
          </button>
        </div>

        <p class="instruction">
          Scan with ABA Mobile or any KHQR-supported banking application.
        </p>

        <!-- Generate New QR button (only when expired) -->
        <div v-if="expired" class="action-wrap">
          <button @click="generatePayment" class="gen-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
            </svg>
            Generate New QR
          </button>
        </div>

        <PaymentStatus
          v-if="status === 'success' || status === 'error'"
          :status="status"
          :error-message="errorMessage"
          @retry="generatePayment"
          @done="onDone"
        />
      </template>

      <!-- Error loading order -->
      <div v-else class="error-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3>Order not found</h3>
        <button @click="$router.push('/orders')" class="back-orders-btn">Back to Orders</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { paymentService } from '@/services/paymentService'
import { orderService } from '@/services/orderService'

import PaymentHeader from './components/PaymentHeader.vue'
import PaymentAmount from './components/PaymentAmount.vue'
import QRCodeCard from './components/QRCodeCard.vue'
import CountdownTimer from './components/CountdownTimer.vue'
import PaymentStatus from './components/PaymentStatus.vue'

type PageStatus = 'loading' | 'waiting' | 'success' | 'error' | 'order-error'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const productName = ref('')
const amount = ref(0)
const currency = ref('USD')
const qrString = ref<string | null>(null)
const status = ref<PageStatus>('loading')
const errorMessage = ref('')
const expired = ref(false)
const timerRef = ref<InstanceType<typeof CountdownTimer> | null>(null)

const orderId = Number(route.params.orderId)

let pollTimer: ReturnType<typeof setInterval> | null = null

async function loadOrder() {
  try {
    const { data } = await orderService.getOne(orderId)
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

async function generatePayment() {
  status.value = 'loading'
  expired.value = false
  errorMessage.value = ''

  try {
    const { data } = await paymentService.generate(orderId)
    qrString.value = data.payment.qr_string
    await nextTick()
    timerRef.value?.reset()
    status.value = 'waiting'
    startAutoVerify()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    status.value = 'error'
    errorMessage.value = e.response?.data?.message || 'Failed to generate payment QR.'
  }
}

function startAutoVerify() {
  stopPolling()
  pollTimer = setInterval(async () => {
    if (status.value === 'success' || expired.value) return
    try {
      const { data } = await paymentService.confirm(orderId)
      if (data.payment.status === 'paid') {
        status.value = 'success'
        stopPolling()
        timerRef.value?.stop()
      }
    } catch {
      // silent retry
    }
  }, 5000)
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
}

function onExpired() {
  expired.value = true
  stopPolling()
}

async function checkPaymentNow() {
  try {
    const { data } = await paymentService.confirm(orderId)
    if (data.payment.status === 'paid') {
      status.value = 'success'
      stopPolling()
      timerRef.value?.stop()
    }
  } catch {
    // silent
  }
}

function onQrError() {
  status.value = 'error'
  errorMessage.value = 'Failed to render QR code.'
}

function onDone() {
  router.push(`/orders/${orderId}`)
}

onMounted(async () => {
  const ok = await loadOrder()
  if (ok) await generatePayment()
})
</script>

<style scoped>
.khqr-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  padding: 20px;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
}

.khqr-card {
  width: 100%;
  max-width: 390px;
  background: #fff;
  border-radius: 32px;
  box-shadow:
    0 4px 24px rgba(15, 23, 42, 0.08),
    0 16px 48px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  animation: cardFade 0.5s ease;
}

@keyframes cardFade {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.divider {
  height: 1px;
  background: #E5E7EB;
  margin: 0 24px;
}

/* Skeleton */
.skeleton-area {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.skeleton {
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 20px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton.qr-sk { width: 260px; height: 260px; }
.skeleton.timer-sk { width: 160px; height: 36px; border-radius: 100px; }
.skeleton.text-sk { width: 220px; height: 14px; border-radius: 8px; }

/* Status area */
.status-area {
  display: flex;
  justify-content: center;
  padding: 4px 24px 12px;
}

.waiting-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22C55E;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

/* Instruction */
.instruction {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #94A3B8;
  text-align: center;
  margin: 0;
  padding: 0 24px 24px;
  line-height: 1.5;
}

/* Action buttons */
.action-wrap {
  padding: 0 24px 20px;
}

.check-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 14px;
  background: #EE1C25;
  color: #fff;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.check-btn:hover {
  background: #D9161F;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(238, 28, 37, 0.25);
}

.gen-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  background: #1E293B;
  color: #fff;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-weight: 600;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.gen-btn:hover {
  background: #334155;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(30, 41, 59, 0.2);
}

/* Error placeholder */
.error-placeholder {
  padding: 48px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.error-placeholder h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
}

.back-orders-btn {
  margin-top: 8px;
  padding: 12px 28px;
  border-radius: 100px;
  background: #1E293B;
  color: #fff;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.back-orders-btn:hover {
  background: #334155;
}

@media (max-width: 430px) {
  .khqr-page {
    padding: 0;
    align-items: flex-start;
  }
  .khqr-card {
    max-width: 100%;
    border-radius: 0;
    min-height: 100vh;
  }
}
</style>
