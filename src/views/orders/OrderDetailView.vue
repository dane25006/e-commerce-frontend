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
        <div class="detail-layout">
          <div class="detail-card">
            <div class="detail-header">
              <div>
                <h1 class="detail-order-id">Order #{{ order.id }}</h1>
                <p class="detail-date">Placed on {{ formatDate(order.created_at) }}</p>
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
                  <div
                    class="timeline-dot"
                    :class="isStepDone(order.status, step.status) ? 'done' : ''"
                  >
                    <i :class="`ti ${step.icon}`" aria-hidden="true" />
                  </div>
                  <span
                    class="timeline-label"
                    :class="isStepDone(order.status, step.status) ? 'done' : ''"
                  >
                    {{ step.label }}
                  </span>
                </div>
                <div
                  v-if="i < orderSteps.length - 1"
                  class="timeline-line"
                  :class="isStepDone(order.status, nextStepStatus(i)) ? 'done' : ''"
                />
              </div>
            </div>
          </div>

          <div class="detail-card">
            <h2 class="section-title">{{ $t('orders.orderItems') }}</h2>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="item-row">
                <div class="item-img-box">
                  <img v-if="item.product?.image_url" :src="imageUrl(item.product.image_url)" :alt="item.product?.name" class="item-img" />
                  <div v-else class="item-img-placeholder">
                    <i class="ti ti-photo" aria-hidden="true" />
                  </div>
                </div>
                <div class="item-info">
                  <p class="item-name">{{ item.product?.name ?? $t('orders.orderItemFallback') }}</p>
                  <p class="item-meta">Qty: {{ item.quantity }} &times; ${{ Number(item.price).toFixed(2) }}</p>
                </div>
                <p class="item-price">${{ item.subtotal.toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <div class="detail-card">
            <h2 class="section-title">{{ $t('orders.orderSummary') }}</h2>
            <div class="summary-rows">
              <div class="summary-row">
                <span>{{ $t('orders.subtotal') }}</span>
                <span>${{ order.total.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>{{ $t('orders.shipping') }}</span>
                <span class="free-badge">{{ $t('orders.free') }}</span>
              </div>
              <div class="summary-divider" />
              <div class="summary-row summary-final">
                <span>{{ $t('orders.total') }}</span>
                <span class="total-amount">${{ order.total.toFixed(2) }}</span>
              </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { orderService } from '@/services/orderService'
import { imageUrl } from '@/utils/image'

import ConfirmModal from '@/components/common/ConfirmModal.vue'
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

const route = useRoute()
const searchOpen = ref(false)
const cartOpen = ref(false)
const loading = ref(false)
const cancelModal = ref<InstanceType<typeof ConfirmModal> | null>(null)
const cancelling = ref(false)

interface OrderItem {
  id: number
  quantity: number
  price: number
  subtotal: number
  product?: { id: number; name: string; image_url: string | null }
}

interface Order {
  id: number
  status: string
  total: number
  created_at: string
  items: OrderItem[]
}

const order = ref<Order | null>(null)

const { t } = useI18n()
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

async function loadOrder() {
  loading.value = true
  try {
    const { data } = await orderService.getOne(Number(route.params.id))
    order.value = data.order
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadOrder)
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

.back-link:hover {
  opacity: 0.8;
}

.loading-state {
  padding: 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.w-1-3 { width: 33.33%; }
.w-1-4 { width: 25%; }

.skeleton-block-lg {
  height: 80px;
  border-radius: 10px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-top: 12px;
}

.skeleton-block-xl {
  height: 120px;
  border-radius: 10px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-top: 12px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.not-found {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}

.not-found i {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
  color: rgba(184,138,68,0.2);
}

.not-found-title {
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
}

.detail-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.detail-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.detail-order-id {
  font-size: 24px;
  font-weight: 900;
  color: var(--text);
  font-family: var(--font-heading);
}

.detail-date {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 2px;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cancel-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 10px;
  color: var(--text-muted);
  border: 1px solid rgba(184,138,68,0.2);
  background: none;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  color: var(--text);
  border-color: rgba(184,138,68,0.4);
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.timeline {
  display: flex;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
}

.timeline::-webkit-scrollbar {
  display: none;
}

.timeline-step {
  display: flex;
  align-items: center;
}

.timeline-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.timeline-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #E7E1D8;
  background: var(--surface);
  color: var(--text-muted);
  transition: all 0.3s;
}

.timeline-dot i {
  font-size: 14px;
}

.timeline-dot.done {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 0 0 4px rgba(184,138,68,0.15);
}

.timeline-label {
  font-size: 10px;
  margin-top: 6px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-muted);
}

.timeline-label.done {
  color: var(--primary);
}

.timeline-line {
  width: 48px;
  height: 3px;
  flex-shrink: 0;
  margin: 0 6px;
  border-radius: 99px;
  background: #E7E1D8;
  transition: background 0.3s;
}

.timeline-line.done {
  background: var(--primary);
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
}

.items-list {
  display: flex;
  flex-direction: column;
}

.item-row {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(231,225,216,0.4);
}

.item-row:last-child {
  border-bottom: none;
}

.item-img-box {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--background);
  border: 1px solid var(--border);
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-img-placeholder i {
  font-size: 20px;
  color: rgba(184,138,68,0.15);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.item-price {
  font-size: 14px;
  font-weight: 900;
  color: var(--text);
  flex-shrink: 0;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
}

.free-badge {
  font-weight: 600;
  color: var(--primary);
}

.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.summary-final {
  font-weight: 900;
  font-size: 18px;
  color: var(--text);
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.total-amount {
  color: var(--primary);
}

@media (max-width: 768px) {
  .page-body {
    padding: 24px 16px 48px;
  }

  .detail-order-id {
    font-size: 20px;
  }

  .detail-card {
    padding: 16px;
  }
}
</style>
