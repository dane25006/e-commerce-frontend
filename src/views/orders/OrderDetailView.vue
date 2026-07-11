<template>
  <div class="order-detail-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <div class="page-body">
      <RouterLink to="/orders" class="back-link">
        <i class="ti ti-arrow-left" aria-hidden="true" />
        {{ $t('orders.backToOrders') }}
      </RouterLink>

      <div v-if="loading" class="loading-state">
        <div class="skeleton-line w-1-3" />
        <div class="skeleton-line w-1-4" />
        <div class="skeleton-block-lg" />
        <div class="skeleton-block-xl" />
      </div>

      <div v-else-if="!order" class="not-found">
        <i class="ti ti-package-off" aria-hidden="true" />
        <p class="not-found-title">{{ $t('orders.notFound') }}</p>
        <RouterLink to="/orders" class="back-link">&larr; {{ $t('orders.backToOrders') }}</RouterLink>
      </div>

      <template v-else>
        <!-- "Pay Now" banner shown when pending + bakong but payment section hasn't triggered -->
        <div v-if="order.status === 'pending' && order.payment_method === 'bakong' && !showPaymentSection" class="pay-now-banner">
          <div class="pay-now-content">
            <div class="pay-now-icon"><i class="ti ti-qrcode" /></div>
            <div class="pay-now-text">
              <h3>{{ $t('orders.paymentPending') }}</h3>
              <p>{{ $t('orders.payNowDescription') }}</p>
            </div>
            <button @click="startPayment" class="pay-now-btn">
              <i class="ti ti-credit-card" />
              {{ $t('orders.payNow') }}
            </button>
          </div>
        </div>

        <!-- Premium Payment Card (shown when pending + bakong + not paid) -->
        <div v-if="showPaymentSection" class="premium-payment-wrap">
          <div class="premium-card">
            <PaymentHeader />

            <PaymentAmount
              :product-name="'Order #' + order.id"
              :amount="order.total"
              currency="USD"
            />

            <div class="divider-line" />

            <!-- Loading skeleton -->
            <div v-if="premiumStatus === 'loading'" class="skeleton-box">
              <div class="skeleton sqr" />
              <div class="skeleton pill" />
              <div class="skeleton text" />
            </div>

            <template v-else>
              <QRCodeCard
                :qr-string="payment?.qr_string ?? null"
                :qr-image="null"
                :expired="qrExpired"
                @error="onQrError"
              />

              <CountdownTimer
                ref="timerRef"
                :expires-in="1800"
                @expired="onTimerExpired"
              />

              <p class="instruction-text">
                Scan with ABA Mobile or any KHQR-supported banking application.
              </p>

              <div v-if="!qrExpired && premiumStatus === 'waiting'" class="status-indicator-area">
                <div class="pulse-dot" />
                <span>{{ $t('payment.waitingForPayment') }}</span>
              </div>

              <div class="action-row">
                <button v-if="!qrExpired && premiumStatus === 'waiting'" @click="checkPaymentNow" class="check-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {{ $t('payment.checkPayment') }}
                </button>

                <button v-if="qrExpired" @click="generatePayment" class="generate-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                  </svg>
                  {{ $t('payment.generateNewQR') }}
                </button>
              </div>
            </template>

            <PaymentStatus
              v-if="premiumStatus === 'success' || premiumStatus === 'error'"
              :status="premiumStatus"
              :error-message="premiumError"
              @retry="generatePayment"
              @done="onPaymentDone"
            />
          </div>

          <!-- Items & Summary shown below payment card -->
          <div class="detail-layout" style="margin-top:20px">
            <div class="detail-card">
              <h2 class="section-title">{{ $t('orders.orderItems') }}</h2>
              <div class="items-list">
                <div v-for="item in order.items" :key="item.id" class="item-row">
                  <div class="item-img-box">
                    <img v-if="item.product?.image_url" :src="imageUrl(item.product.image_url)" :alt="item.product?.name" class="item-img" />
                    <div v-else class="item-img-placeholder"><i class="ti ti-photo" aria-hidden="true" /></div>
                  </div>
                  <div class="item-info">
                    <p class="item-name">{{ item.product?.name ?? $t('orders.orderItemFallback') }}</p>
                    <p class="item-meta">{{ $t('orders.qty') }}: {{ item.quantity }} &times; ${{ Number(item.price).toFixed(2) }}</p>
                  </div>
                  <p class="item-price">${{ item.subtotal.toFixed(2) }}</p>
                </div>
              </div>
            </div>
            <div class="detail-card">
              <h2 class="section-title">{{ $t('orders.orderSummary') }}</h2>
              <div class="summary-rows">
                <div class="summary-row"><span>{{ $t('orders.subtotal') }}</span><span>${{ order.total.toFixed(2) }}</span></div>
                <div class="summary-row"><span>{{ $t('orders.shipping') }}</span><span :class="shippingBadgeClass">{{ shippingLabel }}</span></div>
                <div class="summary-divider" />
                <div class="summary-row summary-final"><span>{{ $t('orders.total') }}</span><span class="total-amount">${{ order.total.toFixed(2) }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Normal order detail (shown when not in payment flow) -->
        <div v-if="!showPaymentSection" class="detail-layout">
          <div class="detail-card">
            <div class="detail-header">
              <div>
                <h1 class="detail-order-id">{{ $t('orders.order') }} #{{ order.id }}</h1>
                <p class="detail-date">{{ $t('orders.placedOn') }} {{ formatDate(order.created_at) }}</p>
              </div>
              <div class="detail-actions">
                <span class="badge-dark" :style="statusStyle(order.status)">
                  {{ capitalize(order.status) }}
                </span>
                <button
                  v-if="order.status === 'pending'"
                  @click="cancelModal?.open()"
                  :disabled="cancelling"
                  class="cancel-btn"
                >
                  <i :class="cancelling ? 'ti ti-loader-2 animate-spin' : 'ti ti-x'" aria-hidden="true" />
                  {{ $t('orders.cancel') }}
                </button>
              </div>
            </div>

            <div class="timeline">
              <div v-for="(step, i) in orderSteps" :key="step.status" class="timeline-step">
                <div class="timeline-dot-wrap">
                  <div class="timeline-dot" :class="isStepDone(order.status, step.status) ? 'done' : ''">
                    <i :class="`ti ${step.icon}`" aria-hidden="true" />
                  </div>
                  <span class="timeline-label" :class="isStepDone(order.status, step.status) ? 'done' : ''">
                    {{ step.label }}
                  </span>
                </div>
                <div v-if="i < orderSteps.length - 1" class="timeline-line" :class="isStepDone(order.status, nextStepStatus(i)) ? 'done' : ''" />
              </div>
            </div>
          </div>

          <div class="detail-card">
            <h2 class="section-title">{{ $t('orders.orderItems') }}</h2>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="item-row">
                <div class="item-img-box">
                  <img v-if="item.product?.image_url" :src="imageUrl(item.product.image_url)" :alt="item.product?.name" class="item-img" />
                  <div v-else class="item-img-placeholder"><i class="ti ti-photo" aria-hidden="true" /></div>
                </div>
                <div class="item-info">
                  <p class="item-name">{{ item.product?.name ?? $t('orders.orderItemFallback') }}</p>
                  <p class="item-meta">{{ $t('orders.qty') }}: {{ item.quantity }} &times; ${{ Number(item.price).toFixed(2) }}</p>
                </div>
                <p class="item-price">${{ item.subtotal.toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div class="detail-card">
            <h2 class="section-title">{{ $t('orders.orderSummary') }}</h2>
            <div class="summary-rows">
              <div class="summary-row"><span>{{ $t('orders.subtotal') }}</span><span>${{ order.total.toFixed(2) }}</span></div>
              <div class="summary-row"><span>{{ $t('orders.shipping') }}</span><span :class="shippingBadgeClass">{{ shippingLabel }}</span></div>
              <div class="summary-divider" />
              <div class="summary-row summary-final"><span>{{ $t('orders.total') }}</span><span class="total-amount">${{ order.total.toFixed(2) }}</span></div>
            </div>
          </div>

        </div>
      </template>
    </div>

    <ConfirmModal
      ref="cancelModal"
      :title="$t('orders.cancelDetailTitle')"
      :message="$t('orders.cancelDetailMessage')"
      :confirm-text="$t('orders.confirmCancel')"
      :cancel-text="$t('orders.keepOrder')"
      @confirm="confirmCancel"
    />
    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { orderService } from '@/services/orderService'
import { paymentService } from '@/services/paymentService'
import { imageUrl } from '@/utils/image'

import PaymentHeader from '@/views/payment/components/PaymentHeader.vue'
import PaymentAmount from '@/views/payment/components/PaymentAmount.vue'
import QRCodeCard from '@/views/payment/components/QRCodeCard.vue'
import CountdownTimer from '@/views/payment/components/CountdownTimer.vue'
import PaymentStatus from '@/views/payment/components/PaymentStatus.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const searchOpen = ref(false)
const cartOpen = ref(false)
const loading = ref(true)
const cancelModal = ref<InstanceType<typeof ConfirmModal> | null>(null)
const cancelling = ref(false)

// Premium payment state
const premiumStatus = ref<'loading' | 'waiting' | 'success' | 'error'>('loading')
const premiumError = ref('')
const qrExpired = ref(false)
const confirming = ref(false)
const timerRef = ref<InstanceType<typeof CountdownTimer> | null>(null)

let pollTimer: ReturnType<typeof setInterval> | null = null

interface PaymentInfo {
  id: number
  order_id: number
  amount: number
  currency: string
  status: string
  deeplink: string | null
  qr_string: string | null
  transaction_hash: string | null
  created_at: string
}

interface OrderItem {
  id: number
  quantity: number
  price: number
  subtotal: number
  product?: { id: number; name: string; image_url: string | null }
}

interface OrderData {
  id: number
  status: string
  total: number
  shipping_fee: number
  payment_method: string
  payment: PaymentInfo | null
  shipping_address: string
  created_at: string
  items: OrderItem[]
}

const order = ref<OrderData | null>(null)
const payment = ref<PaymentInfo | null>(null)

const showPaymentSection = computed(() => {
  return order.value?.status === 'pending' && order.value?.payment_method === 'bakong' && payment.value?.status !== 'paid'
})

const shippingLabel = computed(() => {
  if (!order.value) return ''
  return order.value.shipping_fee > 0 ? `$${order.value.shipping_fee.toFixed(2)}` : 'Free'
})

const shippingBadgeClass = computed(() => {
  return order.value?.shipping_fee ? 'shipping-fee' : 'free-badge'
})

const orderSteps = computed(() => [
  { status: 'pending', icon: 'ti-clock', label: t('orders.placed') },
  { status: 'processing', icon: 'ti-settings', label: t('orders.processing') },
  { status: 'shipped', icon: 'ti-truck', label: t('orders.shipped') },
  { status: 'delivered', icon: 'ti-circle-check', label: t('orders.delivered') },
])

const statusOrder = ['pending', 'processing', 'shipped', 'delivered']

function isStepDone(orderStatus: string, stepStatus: string) {
  if (orderStatus === 'cancelled') return stepStatus === 'pending'
  return statusOrder.indexOf(orderStatus) >= statusOrder.indexOf(stepStatus)
}

function nextStepStatus(index: number) {
  return orderSteps.value[index + 1]?.status ?? ''
}

function statusStyle(status: string) {
  const map: Record<string, Record<string, string>> = {
    pending: { background: 'rgba(184,138,68,0.12)', color: '#B88A44', borderColor: '#B88A44' },
    processing: { background: 'rgba(184,138,68,0.12)', color: '#B88A44', borderColor: '#B88A44' },
    shipped: { background: 'rgba(76,175,80,0.12)', color: '#2E7D32', borderColor: '#4CAF50' },
    delivered: { background: 'rgba(76,175,80,0.12)', color: '#2E7D32', borderColor: '#4CAF50' },
    cancelled: { background: 'rgba(244,67,54,0.1)', color: '#C62828', borderColor: '#F44336' },
  }
  return map[status] ?? { background: 'transparent', color: '#777777', borderColor: 'var(--border)' }
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function generatePayment() {
  if (!order.value) return
  premiumStatus.value = 'loading'
  premiumError.value = ''
  qrExpired.value = false
  confirming.value = false
  try {
    const { data } = await paymentService.generate(order.value.id)
    payment.value = data.payment
    await nextTick()
    timerRef.value?.reset()
    premiumStatus.value = 'waiting'
    startPolling()
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    premiumStatus.value = 'error'
    premiumError.value = e.response?.data?.message || t('payment.errorGenerate')
  }
}

function startPolling() {
  stopPolling()
  pollTimer = setInterval(async () => {
    if (premiumStatus.value === 'success' || qrExpired.value || !order.value) return
    try {
      const { data } = await paymentService.confirm(order.value!.id)
      if (data.payment.status === 'paid') {
        payment.value!.status = 'paid'
        premiumStatus.value = 'success'
        stopPolling()
        timerRef.value?.stop()
        await loadOrder()
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
  if (!order.value) return
  confirming.value = true
  premiumError.value = ''
  try {
    const { data } = await paymentService.confirm(order.value.id)
    if (data.payment.status === 'paid') {
      premiumStatus.value = 'success'
      stopPolling()
      timerRef.value?.stop()
      await loadOrder()
    } else {
      premiumStatus.value = 'error'
      premiumError.value = t('payment.paymentNotReceived')
    }
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    premiumStatus.value = 'error'
    premiumError.value = e.response?.data?.message || t('payment.errorConfirm')
  } finally {
    confirming.value = false
  }
}

function onTimerExpired() {
  qrExpired.value = true
  stopPolling()
}

async function checkPaymentNow() {
  if (!order.value) return
  try {
    const { data } = await paymentService.confirm(order.value.id)
    if (data.payment.status === 'paid') {
      premiumStatus.value = 'success'
      stopPolling()
      timerRef.value?.stop()
      await loadOrder()
    }
  } catch {
    // silent
  }
}

function onQrError() {
  premiumStatus.value = 'error'
  premiumError.value = 'Failed to render QR code.'
}

function onPaymentDone() {
  router.push(`/orders/${order.value?.id}`)
}

async function confirmCancel() {
  cancelling.value = true
  try {
    await orderService.cancel(Number(route.params.id))
    await loadOrder()
    cancelModal.value?.close()
  } catch {
    cancelModal.value?.close()
  } finally {
    cancelling.value = false
  }
}

function startPayment() {
  payment.value = order.value?.payment ?? null
  generatePayment()
}

function goToOrders() {
  router.push('/orders')
}

async function loadOrder() {
  loading.value = true
  try {
    const { data } = await orderService.getOne(Number(route.params.id))
    order.value = data.order
    payment.value = data.order.payment ?? null

    if (order.value?.status === 'pending' && order.value?.payment_method === 'bakong') {
      if (data.order.payment && data.order.payment.status === 'paid') {
        payment.value = data.order.payment
      } else if (!data.order.payment || data.order.payment.status !== 'paid') {
        setTimeout(() => generatePayment(), 100)
      }
    }
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadOrder)

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background: var(--background);
}

.page-body {
  max-width: 896px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  margin-bottom: 24px;
  transition: opacity 0.2s;
}
.back-link:hover { opacity: 0.8; }

/* Loading & Not Found */
.loading-state { padding: 32px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); display: flex; flex-direction: column; gap: 12px; }
.skeleton-line { height: 16px; border-radius: 8px; background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.w-1-3 { width: 33.33%; }
.w-1-4 { width: 25%; }
.skeleton-block-lg { height: 80px; border-radius: 10px; background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-top: 12px; }
.skeleton-block-xl { height: 120px; border-radius: 10px; background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-top: 12px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.not-found { text-align: center; padding: 80px 0; color: var(--text-muted); }
.not-found i { font-size: 48px; display: block; margin-bottom: 12px; color: rgba(184,138,68,0.2); }
.not-found-title { font-weight: 700; color: var(--text); margin-bottom: 16px; }

/* Payment Section */
.payment-section {
  margin-top: 8px;
}

.payment-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;
}

.payment-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.info-label { color: var(--text-muted); font-weight: 600; }
.info-value { font-weight: 700; color: var(--text); }
.info-value.amount { color: var(--primary); font-size: 20px; }
.info-value.amount small { font-size: 13px; font-weight: 600; }

.badge-khqr {
  padding: 3px 10px;
  border-radius: 100px;
  background: rgba(184,138,68,0.1);
  font-size: 11px;
  font-weight: 700;
}

.qr-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
  text-align: center;
}

.qr-loading, .qr-error, .qr-expired {
  padding: 40px 0;
  text-align: center;
}

.qr-loading i, .qr-error i, .qr-expired i {
  font-size: 36px;
  margin-bottom: 12px;
}

.qr-loading i { color: var(--primary); }
.qr-error i { color: #dc2626; }
.qr-error p { color: #dc2626; font-size: 13px; margin-bottom: 16px; }
.qr-expired i { color: var(--text-muted); }
.qr-expired h3 { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.qr-expired p { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; }

.qr-display {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  border: 2px solid var(--border);
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.qr-display canvas {
  display: block;
  width: 220px;
  height: 220px;
  image-rendering: pixelated;
}

.banks { margin-bottom: 16px; }
.banks-label { display: block; font-size: 10px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.banks-list { display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; }
.bank-badge { padding: 4px 10px; border-radius: 100px; background: rgba(184,138,68,0.08); color: var(--primary); font-size: 10px; font-weight: 700; }

.countdown-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
  margin-bottom: 12px;
}

.countdown-bar.expired { color: #dc2626; }

.scan-instruction {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  padding: 10px 16px;
  background: rgba(184,138,68,0.06);
  border-radius: 10px;
}

/* Sidebar */
.payment-sidebar {
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

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.status-item i { font-size: 32px; }
.status-item.waiting { color: var(--primary); }
.status-item.waiting i { animation: pulse 2s infinite; }
.status-item.verifying { color: var(--primary); }
.status-item.success { color: #16a34a; }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.poll-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 12px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-primary {
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

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(184,138,68,0.3);
  transform: translateY(-1px);
}

.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-retry {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  background: rgba(184,138,68,0.08);
  color: var(--primary);
  font-weight: 600;
  font-size: 13px;
  border: 1px solid rgba(184,138,68,0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-retry:hover { background: rgba(184,138,68,0.15); }

.btn-ghost {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  background: transparent;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 13px;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost:hover { border-color: var(--primary); color: var(--primary); }

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover { box-shadow: 0 4px 16px rgba(184,138,68,0.25); transform: translateY(-1px); }

.error-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #dc2626;
  padding: 10px 14px;
  background: rgba(220,38,38,0.06);
  border-radius: 10px;
}

/* Premium Payment Card */
.premium-payment-wrap {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.premium-card {
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

.divider-line {
  height: 1px;
  background: #E5E7EB;
  margin: 0 24px;
}

/* Status indicator */
.status-indicator-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 4px 24px 20px;
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
  animation: pulseAnim 1.5s ease-in-out infinite;
}

@keyframes pulseAnim {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
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

.instruction-text {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #94A3B8;
  text-align: center;
  margin: 0;
  padding: 0 24px 20px;
  line-height: 1.5;
}

.action-row {
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

.btn-spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.generate-btn:hover {
  background: #334155;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(30, 41, 59, 0.2);
}

/* Order detail */
.detail-layout { display: flex; flex-direction: column; gap: 20px; }

.detail-card { padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }

.detail-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 24px; }
.detail-order-id { font-size: 24px; font-weight: 900; color: var(--text); font-family: var(--font-heading); }
.detail-date { font-size: 14px; color: var(--text-muted); margin-top: 2px; }
.detail-actions { display: flex; align-items: center; gap: 8px; }

.badge-dark { padding: 4px 12px; border-radius: 100px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid; }

.cancel-btn { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 10px; color: var(--text-muted); border: 1px solid rgba(184,138,68,0.2); background: none; cursor: pointer; transition: all 0.2s; }
.cancel-btn:hover:not(:disabled) { color: var(--text); border-color: rgba(184,138,68,0.4); }
.cancel-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.timeline { display: flex; align-items: center; overflow-x: auto; scrollbar-width: none; }
.timeline::-webkit-scrollbar { display: none; }
.timeline-step { display: flex; align-items: center; }
.timeline-dot-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.timeline-dot { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #E7E1D8; background: var(--surface); color: var(--text-muted); transition: all 0.3s; }
.timeline-dot i { font-size: 14px; }
.timeline-dot.done { background: var(--primary); border-color: var(--primary); color: #fff; box-shadow: 0 0 0 4px rgba(184,138,68,0.15); }
.timeline-label { font-size: 10px; margin-top: 6px; font-weight: 700; white-space: nowrap; color: var(--text-muted); }
.timeline-label.done { color: var(--primary); }
.timeline-line { width: 48px; height: 3px; flex-shrink: 0; margin: 0 6px; border-radius: 99px; background: #E7E1D8; transition: background 0.3s; }
.timeline-line.done { background: var(--primary); }

.section-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 16px; }

.items-list { display: flex; flex-direction: column; }
.item-row { display: flex; gap: 16px; padding: 12px 0; border-bottom: 1px solid rgba(231,225,216,0.4); }
.item-row:last-child { border-bottom: none; }
.item-img-box { width: 64px; height: 64px; border-radius: 10px; overflow: hidden; flex-shrink: 0; background: var(--background); border: 1px solid var(--border); }
.item-img { width: 100%; height: 100%; object-fit: cover; }
.item-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.item-img-placeholder i { font-size: 20px; color: rgba(184,138,68,0.15); }
.item-info { flex: 1; min-width: 0; }
.item-name { font-size: 14px; font-weight: 700; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.item-price { font-size: 14px; font-weight: 900; color: var(--text); flex-shrink: 0; }

.summary-rows { display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
.summary-row { display: flex; justify-content: space-between; color: var(--text-muted); }
.free-badge { font-weight: 600; color: var(--primary); }
.summary-divider { height: 1px; background: var(--border); margin: 4px 0; }
.summary-final { font-weight: 900; font-size: 18px; color: var(--text); padding-top: 8px; border-top: 1px solid var(--border); }
.total-amount { color: var(--primary); }

/* Pay Now Banner */
.pay-now-banner {
  background: linear-gradient(135deg, rgba(184,138,68,0.08), rgba(201,169,110,0.04));
  border: 1px solid rgba(184,138,68,0.2);
  border-radius: var(--radius);
  padding: 20px 24px;
}

.pay-now-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.pay-now-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(184,138,68,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pay-now-icon i {
  font-size: 20px;
  color: var(--primary);
}

.pay-now-text {
  flex: 1;
  min-width: 200px;
}

.pay-now-text h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 2px;
}

.pay-now-text p {
  font-size: 12px;
  color: var(--text-muted);
}

.pay-now-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.pay-now-btn:hover {
  box-shadow: 0 4px 16px rgba(184,138,68,0.25);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .payment-layout { grid-template-columns: 1fr; }
  .page-body { padding: 24px 16px 48px; }
  .detail-order-id { font-size: 20px; }
  .detail-card { padding: 16px; }
}
</style>
