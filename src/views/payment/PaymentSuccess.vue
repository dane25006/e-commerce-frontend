<template>
  <div class="success-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="() => {}" />

    <div class="success-body">
      <div class="success-card">
        <div class="success-icon">
          <i class="ti ti-circle-check" aria-hidden="true" />
        </div>
        <h1 class="success-title">{{ $t('payment.paymentSuccess') }}</h1>
        <p class="success-desc">{{ $t('payment.successDesc') }}</p>
        <p class="success-amount">${{ amount.toFixed(2) }}</p>

        <div class="success-details">
          <div class="detail-row">
            <span class="detail-label">{{ $t('payment.orderNumber') }}</span>
            <span class="detail-value">#{{ orderId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ $t('payment.paymentMethod') }}</span>
            <span class="detail-value">Bakong (KHQR)</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">{{ $t('payment.status') }}</span>
            <span class="detail-value paid">{{ $t('payment.paid') }}</span>
          </div>
          <div class="detail-row" v-if="paidAt">
            <span class="detail-label">{{ $t('payment.paidAt') }}</span>
            <span class="detail-value">{{ paidAt }}</span>
          </div>
        </div>

        <div class="success-actions">
          <RouterLink :to="`/orders/${orderId}`" class="btn-primary">
            <i class="ti ti-eye" />
            {{ $t('payment.viewOrder') }}
          </RouterLink>
          <RouterLink to="/products" class="btn-secondary">
            <i class="ti ti-shopping-bag" />
            {{ $t('payment.continueShopping') }}
          </RouterLink>
        </div>
      </div>
    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'

defineProps<{
  orderId: number
  amount: number
  paidAt?: string
}>()

const searchOpen = ref(false)
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  background: var(--background);
}

.success-body {
  max-width: 480px;
  margin: 0 auto;
  padding: 80px 24px;
}

.success-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 48px 32px;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  background: rgba(22, 163, 74, 0.08);
}

.success-icon i {
  font-size: 40px;
  color: #16a34a;
}

.success-title {
  font-size: 24px;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 8px;
}

.success-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.success-amount {
  font-size: 36px;
  font-weight: 900;
  color: var(--primary);
  margin-bottom: 32px;
}

.success-details {
  border-top: 1px solid var(--border);
  padding-top: 20px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.detail-label {
  color: var(--text-muted);
}

.detail-value {
  font-weight: 700;
  color: var(--text);
}

.detail-value.paid {
  color: #16a34a;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}
</style>
