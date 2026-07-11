<template>
  <div class="premium-page">
    <div class="payment-card">
      <PaymentHeader />

      <PaymentAmount
        :product-name="productName"
        :amount="amount"
        :currency="currency"
      />

      <div class="divider" />

      <!-- Loading skeleton -->
      <div v-if="status === 'loading'" class="skeleton-box">
        <div class="skeleton sqr" />
        <div class="skeleton pill" />
        <div class="skeleton text" />
      </div>

      <template v-else>
        <QRCodeCard
          :qr-string="qrString"
          :qr-image="qrImage"
          :expired="expired"
          @error="onQrError"
        />

        <CountdownTimer
          ref="timerRef"
          :expires-in="expiresIn"
          @expired="onExpired"
        />

        <PaymentInstruction />

        <div v-if="!expired && status !== 'success'" class="actions">
          <button
            @click="confirmPayment"
            :disabled="confirming"
            class="pay-btn"
          >
            <svg v-if="confirming" class="btn-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-linecap="round" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {{ confirming ? 'Verifying...' : 'I Have Paid' }}
          </button>
        </div>

        <div v-if="expired" class="expired-actions">
          <button @click="generatePayment" class="generate-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
            </svg>
            Generate New QR
          </button>
        </div>
      </template>

      <PaymentStatus
        v-if="status === 'success' || status === 'error'"
        :status="status"
        :error-message="errorMessage"
        @retry="generatePayment"
        @done="onDone"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { paymentService } from '@/services/paymentService'
import { orderService } from '@/services/orderService'

import PaymentHeader from './components/PaymentHeader.vue'
import PaymentAmount from './components/PaymentAmount.vue'
import QRCodeCard from './components/QRCodeCard.vue'
import CountdownTimer from './components/CountdownTimer.vue'
import PaymentInstruction from './components/PaymentInstruction.vue'
import PaymentStatus from './components/PaymentStatus.vue'

type LoadStatus = 'loading' | 'waiting' | 'success' | 'error'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const productName = ref('')
const amount = ref(0)
const currency = ref('USD')
const qrString = ref<string | null>(null)
const qrImage = ref<string | null>(null)
const expiresIn = ref(1800)
const status = ref<LoadStatus>('loading')
const errorMessage = ref('')
const expired = ref(false)
const confirming = ref(false)
const timerRef = ref<InstanceType<typeof CountdownTimer> | null>(null)

const orderId = computed(() => Number(route.params.orderId))

let pollTimer: ReturnType<typeof setInterval> | null = null

async function loadOrder() {
  try {
    const { data } = await orderService.getOne(orderId.value)
    const order = data.order
    amount.value = order.total
    currency.value = 'USD'
    productName.value = `Order #${order.id}`
    return order
  } catch {
    status.value = 'error'
    internalStatus.value = 'error'
    errorMessage.value = 'Order not found.'
    return null
  }
}

async function generatePayment() {
    expired.value = false
    errorMessage.value = ''
    confirming.value = false

    try {
      const { data } = await paymentService.generate(orderId.value)
      qrString.value = data.payment.qr_string
      qrImage.value = null
      await nextTick()
      timerRef.value?.reset()
      status.value = 'waiting'
      startPolling()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      status.value = 'error'
      errorMessage.value = e.response?.data?.message || 'Failed to generate QR.'
    }
}

function startPolling() {
  stopPolling()
  pollTimer = setInterval(async () => {
    if (status.value === 'success' || expired.value) return
    try {
      const { data } = await paymentService.status(orderId.value)
      if (data.payment?.status === 'paid') {
        status.value = 'success'
        stopPolling()
        timerRef.value?.stop()
      }
    } catch {
      // silent
    }
  }, 5000)
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
}

async function confirmPayment() {
  confirming.value = true
  errorMessage.value = ''
  try {
    const { data } = await paymentService.confirm(orderId.value)
      if (data.payment.status === 'paid') {
        status.value = 'success'
        stopPolling()
        timerRef.value?.stop()
      } else {
        status.value = 'error'
        errorMessage.value = 'Payment not yet received.'
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      status.value = 'error'
      errorMessage.value = e.response?.data?.message || 'Verification failed.'
  } finally {
    confirming.value = false
  }
}

function onExpired() {
  expired.value = true
  stopPolling()
}

function onQrError() {
  status.value = 'error'
  errorMessage.value = 'Failed to render QR code.'
}

function onDone() {
  router.push(`/orders/${orderId.value}`)
}

onMounted(async () => {
  const order = await loadOrder()
  if (order) {
    await generatePayment()
  }
})
</script>

<style scoped>
.premium-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  padding: 20px;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
}

.payment-card {
  width: 100%;
  max-width: 390px;
  background: #fff;
  border-radius: 32px;
  box-shadow:
    0 4px 24px rgba(15, 23, 42, 0.08),
    0 16px 48px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  animation: cardIn 0.5s ease;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Divider */
.divider {
  height: 1px;
  background: #E5E7EB;
  margin: 0 24px;
}

/* Skeleton */
.skeleton-box {
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

.skeleton.sqr {
  width: 260px;
  height: 260px;
}

.skeleton.pill {
  width: 160px;
  height: 36px;
  border-radius: 100px;
}

.skeleton.text {
  width: 220px;
  height: 14px;
  border-radius: 8px;
}

/* Actions */
.actions {
  padding: 0 24px 20px;
}

.pay-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: #EE1C25;
  color: #fff;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.pay-btn:hover:not(:disabled) {
  background: #D9161F;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(238, 28, 37, 0.25);
}

.pay-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Expired actions */
.expired-actions {
  padding: 0 24px 20px;
}

.generate-btn {
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

.generate-btn:hover {
  background: #334155;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(30, 41, 59, 0.2);
}

/* Responsive */
@media (max-width: 430px) {
  .premium-page {
    padding: 0;
    align-items: flex-start;
  }

  .payment-card {
    max-width: 100%;
    border-radius: 0;
    min-height: 100vh;
  }
}
</style>
