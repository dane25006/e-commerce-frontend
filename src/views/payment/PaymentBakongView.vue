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

      <div v-if="status === 'loading' && !qrString" class="skeleton-area">
        <div class="skeleton qr-sk" />
        <div class="skeleton timer-sk" />
        <div class="skeleton text-sk" />
      </div>

      <template v-else-if="status === 'waiting' || status === 'success' || status === 'error'">
        <QRCodeCard
          v-if="qrString"
          :qr-string="qrString"
          :qr-image="null"
          :expired="expired"
          :show-retry="expired"
          retry-text="Generate New QR"
          :hint="$t('payment.scanInstruction')"
          @error="onQrError"
          @retry="generatePayment"
        />

        <CountdownTimer
          v-if="qrString && !expired && status === 'waiting'"
          ref="timerRef"
          :expires-in="1800"
          @expired="onExpired"
        />

        <div class="status-area">
          <div v-if="status === 'waiting' && !expired && qrString" class="waiting-indicator">
            <div class="pulse-dot" />
            <span>{{ $t('payment.waitingForPayment') }}</span>
          </div>
        </div>

        <PaymentStatus
          v-if="status === 'success' || status === 'error'"
          :status="status === 'success' ? 'success' : 'error'"
          :error-message="errorMessage"
          @retry="generatePayment"
          @done="onDone"
        />
      </template>

      <div v-else class="error-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3>{{ $t('payment.orderNotFound') }}</h3>
        <button @click="$router.push('/orders')" class="back-orders-btn">{{ $t('payment.backToOrders') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePayment } from '@/composables/usePayment'

import PaymentHeader from '@/components/payment/PaymentHeader.vue'
import PaymentAmount from '@/components/payment/PaymentAmount.vue'
import QRCodeCard from '@/components/payment/QRCodeCard.vue'
import CountdownTimer from '@/components/payment/CountdownTimer.vue'
import PaymentStatus from '@/components/payment/PaymentStatus.vue'

const router = useRouter()
const {
  orderId, status, qrString, amount, currency, productName, errorMessage,
  expired, timerRef,
  loadOrder, generatePayment, onExpired, onQrError,
} = usePayment()

function onDone() {
  router.push(`/orders/${orderId.value}`)
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

.skeleton.qr-sk { width: 240px; height: 240px; }
.skeleton.timer-sk { width: 160px; height: 36px; border-radius: 100px; }
.skeleton.text-sk { width: 220px; height: 14px; border-radius: 8px; }

.status-area {
  display: flex;
  justify-content: center;
  padding: 4px 24px 16px;
}

.waiting-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
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
  .skeleton-area { padding: 24px 16px; }
  .skeleton.qr-sk { width: 220px; height: 220px; }
  .payment-amount { padding: 20px 16px 16px; }
}

@media (max-width: 360px) {
  .skeleton.qr-sk { width: 200px; height: 200px; }
}
</style>
