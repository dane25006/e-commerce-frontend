<template>
  <section v-if="promotions.length" class="promo-section">
    <div class="section-container">
      <div class="section-header">
        <div>
          <span class="section-label">{{ $t('promotions.hotDeals') }}</span>
          <h2 class="section-title">{{ $t('promotions.specialPromotions') }}</h2>
        </div>
      </div>

      <div class="promo-grid">
        <div
          v-for="promo in promotions"
          :key="promo.id"
          class="card promo-card"
        >
          <div class="promo-image">
            <div v-if="promo.image_url" class="promo-img-wrap">
              <img
                :src="promo.image_url"
                :alt="promo.title"
                class="promo-img"
              />
            </div>
            <div v-else class="promo-img-placeholder">
              <i class="ti ti-discount promo-placeholder-icon" aria-hidden="true" />
            </div>
            <div class="promo-discount-badge">
              {{ promo.discount_type === 'percentage' ? `${promo.discount_value}${$t('promotions.percentOff')}` : `$${promo.discount_value}${$t('promotions.dollarOff')}` }}
            </div>
            <div v-if="promo.coupon_code" class="promo-coupon">
              {{ $t('promotions.code') }} {{ promo.coupon_code }}
            </div>
          </div>

          <div class="promo-body">
            <h3 class="promo-title">{{ promo.title }}</h3>
            <p v-if="promo.description" class="promo-desc">{{ promo.description }}</p>

            <div v-if="promo.product" class="promo-product">
              <span class="promo-product-name">{{ promo.product.name }}</span>
              <span class="promo-product-price">${{ promo.product.price.toFixed(2) }}</span>
            </div>

            <div v-if="promo.ends_at" class="promo-timer">
              <i class="ti ti-clock promo-timer-icon" aria-hidden="true" />
              <span class="promo-timer-label">{{ $t('promotions.endsIn') }}</span>
              <span class="promo-timer-value">{{ timeLeft(promo.ends_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Promotion } from '@/types/promotion'

const { t } = useI18n()

defineProps<{ promotions: Promotion[] }>()

function timeLeft(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return t('promotions.ended')
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hours}h left`
  const mins = Math.floor((diff % 3600000) / 60000)
  return `${hours}h ${mins}m left`
}
</script>

<style scoped>
.promo-section {
  padding: 80px 24px;
  background: var(--surface);
}

.section-container {
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 40px;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 36px;
  font-weight: 900;
  color: var(--text);
  margin: 8px 0 0;
}

.promo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .promo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .promo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.promo-card {
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.promo-card:hover {
  transform: translateY(-4px);
}

.promo-image {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: linear-gradient(135deg, #EDE7DE, #E3DACF);
}

.promo-img-wrap {
  width: 100%;
  height: 100%;
}

.promo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.promo-card:hover .promo-img {
  transform: scale(1.05);
}

.promo-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.promo-placeholder-icon {
  font-size: 64px;
  color: rgba(184,138,68,0.18);
}

.promo-discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 14px;
  color: var(--surface);
  background: linear-gradient(135deg, var(--primary), #8E6F3E);
  box-shadow: 0 4px 12px rgba(184,138,68,0.3);
}

.promo-coupon {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 100px;
  color: var(--primary);
}

.promo-body {
  padding: 20px 24px 24px;
}

.promo-title {
  font-family: var(--font-heading);
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.promo-desc {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-muted);
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.promo-product {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--border);
}

.promo-product-name {
  font-size: 13px;
  color: var(--text-muted);
}

.promo-product-price {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
}

.promo-timer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--border);
}

.promo-timer-icon {
  font-size: 13px;
  color: var(--primary);
}

.promo-timer-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.promo-timer-value {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
}
</style>
