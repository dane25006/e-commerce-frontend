<template>
  <div class="payment-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="() => {}" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">{{ $t('payment.bakong') }}</span>
        <h1 class="hero-title">
          <i class="ti ti-qrcode" aria-hidden="true" />
          {{ $t('payment.scanToPay') }}
        </h1>
      </div>
    </section>

    <div class="page-body">
      <div v-if="loading" class="loading-state">
        <i class="ti ti-loader-2 animate-spin loading-icon" />
        <p>{{ $t('payment.generating') }}</p>
      </div>

      <div v-else-if="error" class="error-state">
        <i class="ti ti-alert-circle error-icon" />
        <h2>{{ $t('payment.errorTitle') }}</h2>
        <p>{{ error }}</p>
        <button @click="generateQR" class="btn-primary">{{ $t('payment.tryAgain') }}</button>
      </div>

      <template v-else-if="payment">
        <div class="payment-layout">
          <div class="qr-section">
            <div class="order-info-card">
              <div class="order-info-row">
                <span class="order-info-label">{{ $t('payment.orderNumber') }}</span>
                <span class="order-info-value">#{{ payment.order_id }}</span>
              </div>
              <div class="order-info-row">
                <span class="order-info-label">{{ $t('payment.customerName') }}</span>
                <span class="order-info-value">{{ customerName }}</span>
              </div>
              <div class="order-info-row">
                <span class="order-info-label">{{ $t('payment.amount') }}</span>
                <span class="order-info-value amount">${{ payment.amount.toFixed(2) }}</span>
              </div>
              <div class="order-info-row">
                <span class="order-info-label">{{ $t('payment.currency') }}</span>
                <span class="order-info-value">{{ payment.currency }}</span>
              </div>
            </div>

            <div class="qr-card">
              <div class="qr-header">
                <i class="ti ti-building-bank" />
                <span>{{ $t('payment.bakongKHQR') }}</span>
              </div>

              <div class="qr-code-display" ref="qrContainer">
                <canvas ref="qrCanvas"></canvas>
              </div>

              <div class="payment-acceptance">
                <span class="acceptance-label">{{ $t('payment.acceptedBy') }}</span>
                <div class="bank-icons">
                  <span class="bank-chip">Bakong</span>
                  <span class="bank-chip">ABA</span>
                  <span class="bank-chip">ACLEDA</span>
                  <span class="bank-chip">Wing</span>
                </div>
              </div>

              <div v-if="countdown > 0" class="countdown">
                <i class="ti ti-clock" />
                <span>{{ $t('payment.expiresIn') }} {{ formattedCountdown }}</span>
              </div>
            </div>

            <div class="instructions-card">
              <h3 class="instructions-title">
                <i class="ti ti-info-circle" />
                {{ $t('payment.howToPay') }}
              </h3>
              <ol class="instructions-list">
                <li>{{ $t('payment.step1') }}</li>
                <li>{{ $t('payment.step2') }}</li>
                <li>{{ $t('payment.step3') }}</li>
                <li>{{ $t('payment.step4') }}</li>
              </ol>
            </div>
          </div>

          <div class="actions-section">
            <div class="status-card">
              <div v-if="payment.status === 'paid'" class="status-indicator paid">
                <i class="ti ti-circle-check" />
                <span>{{ $t('payment.paid') }}</span>
              </div>
              <div v-else class="status-indicator pending">
                <i class="ti ti-clock" />
                <span>{{ $t('payment.waitingForPayment') }}</span>
              </div>
            </div>

            <div v-if="payment.status !== 'paid'" class="auto-refresh-indicator">
              <i class="ti ti-refresh" :class="{ 'animate-spin': autoRefreshing }" />
              <span>{{ $t('payment.autoRefresh') }}</span>
            </div>

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

            <p v-if="payment.status !== 'paid'" class="confirm-hint">{{ $t('payment.confirmHint') }}</p>

            <RouterLink
              :to="`/orders/${payment.order_id}`"
              class="btn-secondary"
            >
              <i class="ti ti-eye" />
              {{ $t('payment.viewOrder') }}
            </RouterLink>
          </div>
        </div>
      </template>
    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { paymentService } from '@/services/paymentService'
import QRCode from 'qrcode'
import type { Payment } from '@/types/payment'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'

const props = defineProps<{
  orderId: number
}>()

const emit = defineEmits<{
  paid: [orderId: number]
}>()

const { t } = useI18n()
const auth = useAuthStore()

const searchOpen = ref(false)
const loading = ref(true)
const confirming = ref(false)
const autoRefreshing = ref(false)
const error = ref('')
const payment = ref<Payment | null>(null)
const qrCanvas = ref<HTMLCanvasElement | null>(null)
const qrContainer = ref<HTMLDivElement | null>(null)
const countdown = ref(300)
let countdownTimer: ReturnType<typeof setInterval> | null = null
let autoRefreshTimer: ReturnType<typeof setInterval> | null = null

const customerName = computed(() => auth.user?.name || '')

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

async function generateQR() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await paymentService.generate(props.orderId)
    payment.value = data.payment
    await nextTick()
    await renderQR()
    startCountdown()
    startAutoRefresh()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    error.value = e.response?.data?.message || t('payment.errorGenerate')
  } finally {
    loading.value = false
  }
}

async function renderQR() {
  if (!qrCanvas.value) return

  const qrContent = payment.value?.qr_string || payment.value?.deeplink || ''

  if (!qrContent) return

  try {
    await QRCode.toCanvas(qrCanvas.value, qrContent, {
      width: 220,
      margin: 2,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff',
      },
    })
  } catch {
    error.value = t('payment.errorGenerate')
  }
}

function startCountdown() {
  countdown.value = 300
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

function startAutoRefresh() {
  autoRefreshTimer = setInterval(async () => {
    if (!payment.value || payment.value.status === 'paid') {
      stopAutoRefresh()
      return
    }

    autoRefreshing.value = true
    try {
      const { data } = await paymentService.status(props.orderId)
      if (data.payment) {
        payment.value = data.payment
        if (data.payment.status === 'paid') {
          emit('paid', props.orderId)
          stopAutoRefresh()
          stopCountdown()
        }
      }
    } catch {
      // silent retry
    } finally {
      autoRefreshing.value = false
    }
  }, 5000)
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

async function confirmPayment() {
  confirming.value = true
  error.value = ''
  try {
    const { data } = await paymentService.confirm(props.orderId)
    if (data.payment.status === 'paid') {
      payment.value!.status = 'paid'
      emit('paid', props.orderId)
      stopAutoRefresh()
      stopCountdown()
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

onMounted(generateQR)

onUnmounted(() => {
  stopAutoRefresh()
  stopCountdown()
})
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background: var(--background);
}

.hero-section {
  background: linear-gradient(135deg, #2B241E, #1A1614);
  padding: 80px 24px;
  text-align: center;
  position: relative;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 16px;
  border-radius: 100px;
  background: rgba(184,138,68,0.12);
  color: var(--primary);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: var(--surface);
  margin: 0 0 12px;
  letter-spacing: 0.01em;
  line-height: 1.15;
}

.page-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 80px 0;
}

.loading-icon {
  font-size: 48px;
  color: var(--primary);
  margin-bottom: 16px;
}

.error-icon {
  font-size: 48px;
  color: #dc2626;
  margin-bottom: 16px;
}

.error-state h2 {
  font-size: 18px;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 8px;
}

.error-state p {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.payment-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: start;
}

.qr-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-info-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.order-info-label {
  color: var(--text-muted);
  font-weight: 600;
}

.order-info-value {
  font-weight: 700;
  color: var(--text);
}

.order-info-value.amount {
  color: var(--primary);
  font-size: 16px;
}

.qr-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
  text-align: center;
}

.qr-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.qr-header i {
  color: var(--primary);
  font-size: 16px;
}

.qr-code-display {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  border: 2px solid var(--border);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.qr-code-display canvas {
  display: block;
  width: 220px;
  height: 220px;
  image-rendering: pixelated;
}

.payment-acceptance {
  margin-bottom: 16px;
}

.acceptance-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.bank-icons {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

.bank-chip {
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(184,138,68,0.08);
  color: var(--primary);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: #dc2626;
  font-weight: 600;
}

.countdown i {
  font-size: 14px;
}

.instructions-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
}

.instructions-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.instructions-title i {
  color: var(--primary);
}

.instructions-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.instructions-list li {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 96px;
}

.status-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  text-align: center;
}

.status-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.status-indicator.pending {
  color: var(--primary);
}

.status-indicator.paid {
  color: #16a34a;
}

.status-indicator i {
  font-size: 32px;
}

.status-indicator.pending i {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.auto-refresh-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
}

.confirm-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 24px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
}

.confirm-btn:hover:not(:disabled) {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.confirm-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirm-hint {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  line-height: 1.5;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-primary:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 24px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
  text-align: center;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

@media (max-width: 768px) {
  .payment-layout {
    grid-template-columns: 1fr;
  }
}
</style>
