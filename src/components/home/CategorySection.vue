<template>
  <section class="category-section">
    <div class="category-container">
      <div class="category-header">
        <span class="section-label block mb-3">{{ $t('categorySection.shopByCategory') }}</span>
        <h2 class="category-title">{{ $t('categorySection.exploreCollections') }}</h2>
        <p class="section-subtitle">{{ $t('categorySection.subtitle') }}</p>
      </div>
      <div class="category-grid">
        <RouterLink
          v-for="cat in staticCategories"
          :key="cat.slug"
          :to="`/category/${cat.slug}`"
          class="category-card"
        >
          <div class="card-icon">
            <i :class="iconMap[cat.label]" class="category-icon" aria-hidden="true" />
          </div>
          <h3 class="card-title">{{ titleMap[cat.label] || cat.label }}</h3>
          <p class="card-desc">{{ descMap[cat.label] }}</p>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { staticCategories } from '@/features/categories'

const { t } = useI18n()

const iconMap: Record<string, string> = {
  'For Her': 'ti ti-gender-female',
  'For Him': 'ti ti-gender-male',
  'Unisex': 'ti ti-user',
  'Best Sellers': 'ti ti-star',
  'New Arrivals': 'ti ti-sparkles',
  'Gift Sets': 'ti ti-gift',
  'Travel Size': 'ti ti-plane',
}

const descMap = computed<Record<string, string>>(() => ({
  'For Her': t('categorySection.forHerDesc'),
  'For Him': t('categorySection.forHimDesc'),
  'Unisex': t('categorySection.unisexDesc'),
  'Best Sellers': t('categorySection.bestSellersDesc'),
  'New Arrivals': t('categorySection.newArrivalsDesc'),
  'Gift Sets': t('categorySection.giftSetsDesc'),
  'Travel Size': t('categorySection.travelSizeDesc'),
}))

const titleMap = computed<Record<string, string>>(() => ({
  'For Her': t('categorySection.forHer'),
  'For Him': t('categorySection.forHim'),
  'Unisex': t('categorySection.unisex'),
  'Best Sellers': t('categorySection.bestSellers'),
  'New Arrivals': t('categorySection.newArrivals'),
  'Gift Sets': t('categorySection.giftSets'),
  'Travel Size': t('categorySection.travelSize'),
}))
</script>

<style scoped>
:root {
  --primary: #B88A44;
  --surface: #FFFFFF;
  --text: #222222;
  --text-muted: #6F6F6F;
  --border: #E7E1D8;
}

.category-section {
  padding: 3rem 0;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.category-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .category-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .category-container {
    padding: 0 2rem;
  }
}

.category-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.category-title {
  font-family: var(--font-body);
  letter-spacing: -0.02em;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.02em;
  margin-bottom: 0.75rem;
}

.section-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

@media (min-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 1.25rem;
  }
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  text-decoration: none;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 32px rgba(184, 138, 68, 0.18);
  border-color: var(--primary);
}

.card-icon {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FBF8F3 0%, #F5EFE6 100%);
  border: 2px solid var(--border);
  margin-bottom: 1rem;
  transition: all 0.35s ease;
}

.category-card:hover .card-icon {
  border-color: var(--primary);
  background: linear-gradient(135deg, #FDF9F2 0%, #F0E5D3 100%);
  transform: scale(1.05);
}

.category-icon {
  font-size: 1.75rem;
  color: var(--primary);
  transition: all 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
  color: var(--primary-hover);
}

@media (min-width: 768px) {
  .card-icon {
    width: 5.5rem;
    height: 5.5rem;
  }

  .category-icon {
    font-size: 2rem;
  }
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 0.375rem;
  transition: color 0.3s ease;
}

.category-card:hover .card-title {
  color: var(--primary);
}

.card-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.4;
}
</style>
