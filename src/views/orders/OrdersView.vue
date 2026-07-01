<template>
  <div class="orders-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">Your</span>
        <h1 class="hero-title">Orders</h1>
      </div>
    </section>

    <div class="page-body">
      <div v-if="loading" class="loading-list">
        <div v-for="n in 4" :key="n" class="skeleton-card">
          <div class="skeleton-row">
            <div class="skeleton-text-group">
              <div class="skeleton-line w-32" />
              <div class="skeleton-line w-24" />
            </div>
            <div class="skeleton-badge" />
          </div>
          <div class="skeleton-block" />
        </div>
      </div>

      <div v-else-if="!orders.length" class="empty-state">
        <div class="empty-icon">
          <i class="ti ti-package" aria-hidden="true" />
        </div>
        <h2 class="empty-title">No orders yet</h2>
        <p class="empty-desc">You haven&rsquo;t placed any orders yet. When you do, they&rsquo;ll all be here waiting for you.</p>
        <RouterLink to="/products" class="btn-primary">Start Shopping</RouterLink>
      </div>

      <div v-else class="orders-list">
        <div
          v-for="order in orders"
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div>
              <div class="order-id-row">
                <span class="order-id">Order #{{ order.id }}</span>
                <span class="badge-dark" :style="statusStyle(order.status)">
                  {{ capitalize(order.status) }}
                </span>
              </div>
              <p class="order-date">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="order-total-wrap">
              <p class="order-total-amount">${{ order.total.toFixed(2) }}</p>
              <p class="order-count">{{ order.items_count ?? '—' }} item{{ (order.items_count ?? 0) !== 1 ? 's' : '' }}</p>
            </div>
          </div>

          <div class="order-progress">
            <div
              v-for="(step, i) in orderSteps"
              :key="step.status"
              class="progress-step"
            >
              <div class="progress-dot-wrap">
                <div
                  class="progress-dot"
                  :class="isStepDone(order.status, step.status) ? 'done' : ''"
                >
                  <i :class="`ti ${step.icon}`" aria-hidden="true" />
                </div>
                <span
                  class="progress-label"
                  :class="isStepDone(order.status, step.status) ? 'done' : ''"
                >
                  {{ step.label }}
                </span>
              </div>
              <div
                v-if="i < orderSteps.length - 1"
                class="progress-line"
                :class="isStepDone(order.status, nextStepStatus(i)) ? 'done' : ''"
              />
            </div>
          </div>

          <div class="order-footer">
            <RouterLink
              :to="`/orders/${order.id}`"
              class="view-details-link"
            >
              View Details <i class="ti ti-arrow-right" aria-hidden="true" />
            </RouterLink>

            <button
              v-if="order.status === 'pending'"
              @click="promptCancel(order.id)"
              :disabled="cancellingId === order.id"
              class="cancel-order-btn"
            >
              <i :class="cancellingId === order.id ? 'ti ti-loader-2 animate-spin' : 'ti ti-x'" aria-hidden="true" />
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      ref="cancelModal"
      title="Cancel this order?"
      message="Are you sure you&rsquo;d like to cancel? This action cannot be undone, and the items will be returned to stock."
      confirm-text="Yes, Cancel Order"
      cancel-text="Keep Order"
      @confirm="confirmCancel"
    />
    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { orderService } from '@/services/orderService'

import ConfirmModal from '@/components/common/ConfirmModal.vue'
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

interface Order {
  id: number
  status: string
  total: number
  items_count: number
  created_at: string
}

const orders = ref<Order[]>([])
const loading = ref(false)
const searchOpen = ref(false)
const cartOpen = ref(false)
const cancelModal = ref<InstanceType<typeof ConfirmModal> | null>(null)
const cancellingId = ref<number | null>(null)
const pendingCancelId = ref<number | null>(null)

const orderSteps = [
  { status: 'pending', icon: 'ti-clock', label: 'Placed' },
  { status: 'processing', icon: 'ti-settings', label: 'Processing' },
  { status: 'shipped', icon: 'ti-truck', label: 'Shipped' },
  { status: 'delivered', icon: 'ti-circle-check', label: 'Delivered' },
]

const statusOrder = ['pending', 'processing', 'shipped', 'delivered']

function isStepDone(orderStatus: string, stepStatus: string) {
  if (orderStatus === 'cancelled') return stepStatus === 'pending'
  return statusOrder.indexOf(orderStatus) >= statusOrder.indexOf(stepStatus)
}

function nextStepStatus(index: number) {
  return orderSteps[index + 1]?.status ?? ''
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

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function promptCancel(id: number) {
  pendingCancelId.value = id
  cancelModal.value?.open()
}

async function confirmCancel() {
  if (pendingCancelId.value === null) return
  cancellingId.value = pendingCancelId.value
  try {
    await orderService.cancel(pendingCancelId.value)
    await loadOrders()
    cancelModal.value?.close()
  } finally {
    cancellingId.value = null
    pendingCancelId.value = null
  }
}

async function loadOrders() {
  loading.value = true
  try {
    const { data } = await orderService.list()
    orders.value = data.data ?? []
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)
</script>

<style scoped>
.orders-page {
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
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: var(--surface);
  margin: 0 0 12px;
  letter-spacing: 0.01em;
  line-height: 1.15;
}

.page-body {
  max-width: 896px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.loading-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-card {
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.skeleton-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.skeleton-text-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-line {
  height: 14px;
  border-radius: 7px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.w-32 { width: 128px; }
.w-24 { width: 96px; }

.skeleton-badge {
  width: 80px;
  height: 24px;
  border-radius: 999px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-block {
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-state {
  text-align: center;
  padding: 96px 0;
}

.empty-icon {
  width: 96px;
  height: 96px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  background: rgba(184,138,68,0.08);
}

.empty-icon i {
  font-size: 48px;
  color: rgba(184,138,68,0.25);
}

.empty-title {
  font-size: 20px;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.order-card:hover {
  box-shadow: var(--shadow-sm);
}

.order-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.order-id-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.order-id {
  font-size: 14px;
  font-weight: 900;
  color: var(--text);
}

.order-date {
  font-size: 12px;
  color: var(--text-muted);
}

.order-total-wrap {
  text-align: right;
}

.order-total-amount {
  font-size: 20px;
  font-weight: 900;
  color: var(--text);
}

.order-count {
  font-size: 12px;
  color: var(--text-muted);
}

.order-progress {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 20px 24px;
  overflow-x: auto;
  scrollbar-width: none;
}

.order-progress::-webkit-scrollbar {
  display: none;
}

.progress-step {
  display: flex;
  align-items: center;
}

.progress-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.progress-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #E7E1D8;
  background: var(--surface);
  color: var(--text-muted);
  transition: all 0.3s;
}

.progress-dot i {
  font-size: 12px;
}

.progress-dot.done {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.progress-label {
  font-size: 9px;
  margin-top: 4px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-muted);
}

.progress-label.done {
  color: var(--primary);
}

.progress-line {
  width: 40px;
  height: 3px;
  flex-shrink: 0;
  margin: 0 4px;
  border-radius: 99px;
  background: #E7E1D8;
  transition: background 0.3s;
}

.progress-line.done {
  background: var(--primary);
}

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

.view-details-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: opacity 0.2s;
}

.view-details-link:hover {
  opacity: 0.8;
}

.cancel-order-btn {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.2s;
}

.cancel-order-btn:hover:not(:disabled) {
  color: var(--text);
}

.cancel-order-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 24px;
  }

  .page-body {
    padding: 24px 16px 48px;
  }

  .order-header {
    padding: 16px;
  }

  .order-progress {
    padding: 16px;
  }

  .order-footer {
    padding: 12px 16px;
  }
}
</style>
