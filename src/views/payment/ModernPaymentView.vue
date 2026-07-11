<template>
  <div class="modern-payment-page">
    <div class="payment-card">
      <PaymentHeader />

      <PaymentInfo
        :product-name="productName"
        :amount="amount"
        :currency="currency"
      />

      <div class="divider" />

      <div v-if="status === 'loading'" class="loading-skeleton">
        <div class="skeleton sqr skeleton-qr" />
        <div class="skeleton skeleton-timer" />
        <div class="skeleton skeleton-text" />
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

        <PaymentStatus
          :status="status"
          :error-message="errorMessage"
          @retry="generatePayment"
          @done="onDone"
        />
      </template>

      <div v-if="status !== 'success' && !expired" class="confirm-section">
        <button
          @click="confirmPayment"
          :disabled="confirming"
          class="confirm-btn"
        >
          <i v-if="confirming" class="ti ti-loader-2 animate-spin" />
          <i v-else class="ti ti-check" />
          {{ confirming ? $t('payment.verifying') : $t('payment.iHavePaid') }}
        </button>
      </div>

      <div v-if="expired" class="expired-actions">
        <button @click="generatePayment" class="generate-btn">
          <i class="ti ti-refresh" />
          {{ $t('payment.generateNewQR') }}
        </button>
      </div>
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
import PaymentInfo from './components/PaymentInfo.vue'
import QRCodeCard from './components/QRCodeCard.vue'
import CountdownTimer from './components/CountdownTimer.vue'
import PaymentStatus from './components/PaymentStatus.vue'

type PaymentPageStatus = 'loading' | 'waiting' | 'success' | 'error'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const productName = ref('')
const amount = ref(0)
const currency = ref('USD')
const qrString = ref<string | null>(null)
const qrImage = ref<string | null>(null)
const expiresIn = ref(1800)
const status = ref<PaymentPageStatus>('loading')
const errorMessage = ref('')
const expired = ref(false)
const confirming = ref(false)
const timerRef = ref<InstanceType<typeof CountdownTimer> | null>(null)

const orderId = computed(() => Number(route.params.orderId))

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
    errorMessage.value = t('payment.orderNotFound')
    return null
  }
}

async function generatePayment() {
  status.value = 'loading'
  expired.value = false
  errorMessage.value = ''
  confirming.value = false

  try {
    const { data } = await paymentService.generate(orderId.value)
    qrString.value = data.payment.qr_string
    qrImage.value = null

    await nextTick()
    timerRef.value?.start()
    status.value = 'waiting'
    startPolling()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    status.value = 'error'
    errorMessage.value = e.response?.data?.message || t('payment.errorGenerate')
  }
}

let pollTimer: ReturnType<typeof setInterval> | null = null

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
      errorMessage.value = t('payment.paymentNotReceived')
    }
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    status.value = 'error'
    errorMessage.value = e.response?.data?.message || t('payment.errorConfirm')
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
  errorMessage.value = t('payment.errorGenerate')
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
.modern-payment-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  padding: 20px;
}

.payment-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.divider {
  height: 1px;
  background: #E5E7EB;
  margin: 0 24px;
}

/* Loading skeleton */
.loading-skeleton {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.skeleton-qr {
  width: 260px;
  height: 260px;
  border-radius: 20px;
}

.skeleton-timer {
  width: 160px;
  height: 36px;
  border-radius: 100px;
}

.skeleton-text {
  width: 200px;
  height: 16px;
  border-radius: 8px;
}

/* Confirm section */
.confirm-section {
  padding: 0 24px 24px;
}

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: #EE1C25;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn:hover:not(:disabled) {
  background: #D9161F;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(238, 28, 37, 0.3);
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Expired actions */
.expired-actions {
  padding: 0 24px 24px;
}

.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  background: #111827;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn:hover {
  background: #374151;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 480px) {
  .modern-payment-page {
    padding: 12px;
  }

  .payment-card {
    border-radius: 24px;
  }
}
</style>
