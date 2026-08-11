<template>
  <div class="topup-page">
    <div class="card">
      <PaymentHeader />

      <!-- Step 1: Amount Form -->
      <template v-if="step === 'form'">
        <div class="header-section">
          <h1 class="title">Top Up Balance</h1>
          <p class="subtitle">Enter the amount you want to deposit</p>
        </div>

        <div class="currency-toggle">
          <button
            :class="['curr-btn', { active: currency === 'USD' }]"
            @click="currency = 'USD'; selectedAmount = 0"
          >$ USD</button>
          <button
            :class="['curr-btn', { active: currency === 'KHR' }]"
            @click="currency = 'KHR'; selectedAmount = 0"
          >៛ KHR</button>
        </div>

        <div class="quick-amounts">
          <button
            v-for="amt in quickAmounts"
            :key="amt"
            :class="['amount-btn', { active: selectedAmount === amt }]"
            @click="selectedAmount = amt; customAmount = ''"
          >
            {{ currency === 'KHR' ? '៛' : '$' }}{{ amt.toLocaleString() }}
          </button>
        </div>

        <div class="custom-input">
          <span class="prefix">{{ currency === 'KHR' ? '៛' : '$' }}</span>
          <input
            v-model="customAmount"
            type="number"
            :min="currency === 'KHR' ? 100 : 1"
            :step="currency === 'KHR' ? 100 : 0.01"
            placeholder="Custom amount"
            @focus="selectedAmount = 0"
          />
        </div>

        <div class="actions">
          <button
            :disabled="!validAmount || generating"
            class="pay-btn"
            @click="generatePayment"
          >
            <i v-if="generating" class="ti ti-loader-2 animate-spin" />
            <template v-else>Generate QR Code</template>
          </button>
        </div>
      </template>

      <!-- Step 2: QR Display -->
      <template v-else-if="step === 'qr'">
        <PaymentInfo
          product-name="Account Top-Up"
          :amount="amount"
          :currency="currency"
        />

        <div class="divider" />

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
          v-if="qrString && !expired && pageStatus === 'waiting'"
          ref="timerRef"
          :expires-in="expiresIn"
          @expired="onExpired"
        />

        <div v-if="pageStatus === 'waiting' && !expired && qrString" class="waiting-area">
          <div class="waiting-row">
            <div class="pulse-dot" />
            <span>{{ $t('payment.waitingForPayment') }}</span>
          </div>
          <button
            :disabled="confirming"
            class="confirm-topup-btn"
            @click="confirmPayment"
          >
            <i v-if="confirming" class="ti ti-loader-2 animate-spin" />
            <template v-else>I've Paid / Check Status</template>
          </button>
        </div>

        <PaymentStatus
          v-if="pageStatus === 'success' || pageStatus === 'error'"
          :status="pageStatus === 'success' ? 'success' : 'error'"
          :error-message="errorMessage"
          @retry="generatePayment"
          @done="onDone"
        />

        <div v-if="expired" class="expired-actions">
          <button class="back-btn" @click="backToForm">
            <i class="ti ti-arrow-left" /> {{ $t('payment.tryAgain') }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useTopUp } from '@/composables/useTopUp'

import PaymentHeader from '@/components/payment/PaymentHeader.vue'
import PaymentInfo from '@/components/payment/PaymentInfo.vue'
import QRCodeCard from '@/components/payment/QRCodeCard.vue'
import CountdownTimer from '@/components/payment/CountdownTimer.vue'
import PaymentStatus from '@/components/payment/PaymentStatus.vue'

const router = useRouter()
const {
  step, currency, quickAmounts, selectedAmount, customAmount, generating,
  amount, qrString, expiresIn, pageStatus, errorMessage,
  expired, confirming, timerRef, validAmount,
  generatePayment, confirmPayment, onExpired, onQrError, backToForm,
} = useTopUp()

function onDone() {
  router.push('/profile')
}
</script>

<style scoped>
.topup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  padding: 20px;
}

.card {
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

.header-section {
  text-align: center;
  padding: 8px 24px 16px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
}

.subtitle {
  font-size: 14px;
  color: #6B7280;
  margin: 0;
}

.currency-toggle {
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 0 24px 16px;
}

.curr-btn {
  flex: 1;
  max-width: 100px;
  padding: 10px 0;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  background: #fff;
  font-size: 15px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.curr-btn:hover { border-color: #EE1C25; color: #EE1C25; }
.curr-btn.active { border-color: #EE1C25; background: #FEF2F2; color: #EE1C25; }

.quick-amounts {
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 0 24px 16px;
  flex-wrap: wrap;
}

.amount-btn {
  min-width: 60px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 2px solid #E5E7EB;
  background: #fff;
  font-size: 15px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.amount-btn:hover { border-color: #EE1C25; color: #EE1C25; }
.amount-btn.active { border-color: #EE1C25; background: #FEF2F2; color: #EE1C25; }

.custom-input {
  display: flex;
  align-items: center;
  margin: 0 24px 20px;
  padding: 12px 16px;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  transition: border-color 0.2s;
}

.custom-input:focus-within { border-color: #EE1C25; }

.prefix {
  font-size: 20px;
  font-weight: 700;
  color: #9CA3AF;
  margin-right: 8px;
}

.custom-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  background: transparent;
}

.custom-input input::placeholder { color: #D1D5DB; }

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }

.actions { padding: 0 24px 24px; }

.pay-btn {
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

.pay-btn:hover:not(:disabled) {
  background: #D9161F;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(238, 28, 37, 0.3);
}

.pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.divider { height: 1px; background: #E5E7EB; margin: 0 24px; }

.waiting-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 4px 24px 24px;
}

.waiting-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

.confirm-topup-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  background: #EE1C25;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(238, 28, 37, 0.25);
}

.confirm-topup-btn:hover:not(:disabled) {
  background: #D9161F;
  transform: translateY(-1px);
}

.confirm-topup-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.expired-actions { padding: 0 24px 24px; }

.back-btn {
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

.back-btn:hover {
  background: #374151;
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .topup-page { padding: 12px; }
  .card { border-radius: 24px; }
  .header-section { padding: 8px 16px 16px; }
  .currency-toggle,
  .quick-amounts,
  .custom-input,
  .actions,
  .expired-actions,
  .waiting-row { padding-left: 16px; padding-right: 16px; }
  .custom-input { margin: 0 16px 20px; }
  .divider { margin: 0 16px; }
}

@media (max-width: 360px) {
  .topup-page { padding: 8px; }
  .quick-amounts { gap: 8px; }
  .amount-btn { min-width: 52px; padding: 9px 12px; }
}
</style>
