<template>
  <div class="topup-page">
    <div class="card">
      <PaymentHeader />

      <template v-if="step === 'form'">
        <div class="header-section">
          <h1 class="title">Top Up Balance</h1>
          <p class="subtitle">Enter the amount you want to deposit</p>
        </div>

        <div class="currency-toggle">
          <button
            :class="['curr-btn', { active: currency === 'USD' }]"
            @click="currency = 'USD'"
          >$ USD</button>
          <button
            :class="['curr-btn', { active: currency === 'KHR' }]"
            @click="currency = 'KHR'"
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

      <template v-else-if="step === 'qr'">
        <PaymentInfo
          product-name="Account Top-Up"
          :amount="amount"
          :currency="currency"
        />

        <div class="divider" />

        <QRCodeCard
          :qr-string="qrString"
          :qr-image="null"
          :expired="expired"
          @error="onQrError"
        />

        <CountdownTimer
          ref="timerRef"
          :expires-in="expiresIn"
          @expired="onExpired"
        />

        <PaymentStatus
          :status="pageStatus"
          :error-message="errorMessage"
          @retry="generatePayment"
          @done="onDone"
        />

        <div v-if="pageStatus !== 'success' && !expired" class="confirm-section">
          <button
            :disabled="confirming"
            class="confirm-btn"
            @click="confirmPayment"
          >
            <i v-if="confirming" class="ti ti-loader-2 animate-spin" />
            <i v-else class="ti ti-check" />
            {{ confirming ? 'Verifying...' : 'I Have Paid' }}
          </button>
        </div>

        <div v-if="expired" class="expired-actions">
          <button class="back-btn" @click="backToForm">
            <i class="ti ti-arrow-left" /> Try Again
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { topUpService } from '@/services/topUpService'
import PaymentHeader from './components/PaymentHeader.vue'
import PaymentInfo from './components/PaymentInfo.vue'
import QRCodeCard from './components/QRCodeCard.vue'
import CountdownTimer from './components/CountdownTimer.vue'
import PaymentStatus from './components/PaymentStatus.vue'

type Step = 'form' | 'qr'
type PageStatus = 'loading' | 'waiting' | 'success' | 'error'

const router = useRouter()

const step = ref<Step>('form')
const currency = ref('USD')
const quickAmounts = computed(() => currency.value === 'KHR' ? [1000, 2000, 5000, 10000, 20000] : [5, 10, 20, 50, 100])
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
const timerRef = ref<InstanceType<typeof CountdownTimer> | null>(null)
let currentPaymentId = ref<number | null>(null)

let pollTimer: ReturnType<typeof setInterval> | null = null

const validAmount = computed(() => {
  const amt = selectedAmount.value > 0
    ? selectedAmount.value
    : parseFloat(customAmount.value)
  if (!amt || isNaN(amt)) return false
  return currency.value === 'KHR'
    ? amt >= 100 && amt <= 99999999
    : amt >= 0.01 && amt <= 999999.99
})

function getAmount(): number {
  return selectedAmount.value > 0
    ? selectedAmount.value
    : parseFloat(customAmount.value)
}

async function generatePayment() {
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

function startPolling() {
  stopPolling()
  pollTimer = setInterval(async () => {
    if (pageStatus.value === 'success' || expired.value || !currentPaymentId.value) return
    try {
      const { data } = await topUpService.status(currentPaymentId.value)
      if (data.payment?.status === 'paid') {
        pageStatus.value = 'success'
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
  if (!currentPaymentId.value) return
  confirming.value = true
  try {
    const { data } = await topUpService.status(currentPaymentId.value)
    if (data.payment?.status === 'paid') {
      pageStatus.value = 'success'
      stopPolling()
      timerRef.value?.stop()
    } else {
      pageStatus.value = 'error'
      errorMessage.value = 'Payment not yet received. Please try again.'
    }
  } catch {
    pageStatus.value = 'error'
    errorMessage.value = 'Verification failed. Please try again.'
  } finally {
    confirming.value = false
  }
}

function onExpired() {
  expired.value = true
  stopPolling()
}

function onQrError() {
  pageStatus.value = 'error'
  errorMessage.value = 'Failed to render QR code.'
}

function onDone() {
  router.push('/profile')
}

function backToForm() {
  step.value = 'form'
  expired.value = false
  pageStatus.value = 'loading'
  errorMessage.value = ''
  stopPolling()
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

.curr-btn:hover {
  border-color: #EE1C25;
  color: #EE1C25;
}

.curr-btn.active {
  border-color: #EE1C25;
  background: #FEF2F2;
  color: #EE1C25;
}

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

.amount-btn:hover {
  border-color: #EE1C25;
  color: #EE1C25;
}

.amount-btn.active {
  border-color: #EE1C25;
  background: #FEF2F2;
  color: #EE1C25;
}

.custom-input {
  display: flex;
  align-items: center;
  margin: 0 24px 20px;
  padding: 12px 16px;
  border: 2px solid #E5E7EB;
  border-radius: 14px;
  transition: border-color 0.2s;
}

.custom-input:focus-within {
  border-color: #EE1C25;
}

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

.custom-input input::placeholder {
  color: #D1D5DB;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.actions {
  padding: 0 24px 24px;
}

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

.pay-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  height: 1px;
  background: #E5E7EB;
  margin: 0 24px;
}

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

.expired-actions {
  padding: 0 24px 24px;
}

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
}
</style>
