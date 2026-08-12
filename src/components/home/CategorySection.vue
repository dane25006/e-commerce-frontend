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
          class="category-card group"
        >
          <!-- Modern Luxury Icon Container -->
          <div class="card-icon-wrap">
            <div class="card-icon-glow" />
            <div class="card-icon">
              <!-- For Her -->
              <svg v-if="cat.label === 'For Her'" class="luxury-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <!-- Floral Flacon Motif -->
                <path d="M12 7c-2.76 0-5 2.24-5 5 0 3.87 5 9 5 9s5-5.13 5-9c0-2.76-2.24-5-5-5z" />
                <circle cx="12" cy="12" r="2.2" />
                <path d="M12 3v4" />
                <path d="M9 3h6" />
                <path d="M17 7.5c1.2.6 2 1.9 2 3.5" />
                <path d="M7 7.5c-1.2.6-2 1.9-2 3.5" />
              </svg>

              <!-- For Him -->
              <svg v-else-if="cat.label === 'For Him'" class="luxury-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <!-- Chiseled Cologne & Crown Motif -->
                <rect x="6" y="8" width="12" height="13" rx="2" />
                <path d="M9 5h6v3H9z" />
                <path d="M10 2h4" />
                <path d="M10 12h4" />
                <path d="M12 12v5" />
                <path d="M6 11h12" />
              </svg>

              <!-- Unisex -->
              <svg v-else-if="cat.label === 'Unisex'" class="luxury-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <!-- Pure Harmony Essence Droplet -->
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                <path d="M12 2.69v18.62" />
                <path d="M12 10a4 4 0 0 1 4 4" />
              </svg>

              <!-- Best Sellers -->
              <svg v-else-if="cat.label === 'Best Sellers'" class="luxury-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <!-- Prestige Award Crown -->
                <path d="M5 18h14" />
                <path d="M6 14h12" />
                <path d="M18 10l2.5-4-5 2-3.5-5-3.5 5-5-2L6 10z" />
                <circle cx="12" cy="14" r="1" fill="currentColor" />
              </svg>

              <!-- New Arrivals -->
              <svg v-else-if="cat.label === 'New Arrivals'" class="luxury-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <!-- Radiant Diamond Starburst -->
                <path d="M6 3h12l4 6-10 12L2 9z" />
                <path d="M2 9h20" />
                <path d="M10 3l-2 6 4 12 4-12-2-6" />
              </svg>

              <!-- Gift Sets -->
              <svg v-else-if="cat.label === 'Gift Sets'" class="luxury-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <!-- Luxury Satin Wrapped Gift -->
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" rx="1" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>

              <!-- Travel Size -->
              <svg v-else-if="cat.label === 'Travel Size'" class="luxury-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <!-- Travel Spray Atomizer -->
                <rect x="8" y="9" width="8" height="12" rx="2" />
                <path d="M10 5h4v4h-4z" />
                <path d="M12 2v3" />
                <path d="M18 4l2-1" />
                <path d="M19 6l2 1" />
                <path d="M18 8l2 2" />
              </svg>

              <!-- Fallback -->
              <i v-else class="ti ti-sparkles luxury-svg-icon" aria-hidden="true" />
            </div>
          </div>

          <h3 class="card-title">{{ titleMap[cat.label] || cat.label }}</h3>
          <p class="card-desc">{{ descMap[cat.label] }}</p>

          <span class="explore-hint">
            {{ $t('common.explore') || 'Explore' }}
            <i class="ti ti-arrow-right" aria-hidden="true" />
          </span>
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
  padding: 4rem 0 4.5rem;
  background: linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%);
  border-bottom: 1px solid var(--border);
  position: relative;
}

.category-container {
  max-width: 84rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

@media (min-width: 640px) {
  .category-container {
    padding: 0 1.75rem;
  }
}

@media (min-width: 1024px) {
  .category-container {
    padding: 0 2.5rem;
  }
}

.category-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--primary);
}

.category-title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.35rem);
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-style: italic;
  margin: 0;
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
    gap: 1.25rem;
  }
}

@media (min-width: 1100px) {
  .category-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: 1.125rem;
  }
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.25rem 1rem 1.75rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(184, 138, 68, 0.15);
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.03),
    0 1px 3px rgba(184, 138, 68, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  text-decoration: none;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.category-card:hover {
  transform: translateY(-8px);
  background: #ffffff;
  border-color: rgba(184, 138, 68, 0.4);
  box-shadow:
    0 16px 36px rgba(184, 138, 68, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.04);
}

.category-card:hover::before {
  opacity: 1;
}

/* Icon Container & Ambient Glow */
.card-icon-wrap {
  position: relative;
  margin-bottom: 1.25rem;
}

.card-icon-glow {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(184, 138, 68, 0.25), transparent 70%);
  opacity: 0;
  filter: blur(8px);
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.category-card:hover .card-icon-glow {
  opacity: 1;
  transform: scale(1.15);
}

.card-icon {
  width: 4.75rem;
  height: 4.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FCF9F4 0%, #F5EDE0 100%);
  border: 2px solid rgba(184, 138, 68, 0.2);
  box-shadow:
    0 4px 14px rgba(184, 138, 68, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  z-index: 1;
}

.category-card:hover .card-icon {
  border-color: var(--primary);
  background: linear-gradient(135deg, #FFFDF8 0%, #EDE1CE 100%);
  transform: scale(1.08) rotate(3deg);
  box-shadow:
    0 8px 22px rgba(184, 138, 68, 0.22),
    inset 0 1px 0 #fff;
}

.luxury-svg-icon {
  width: 2.25rem;
  height: 2.25rem;
  color: var(--primary);
  transition: all 0.35s ease;
  filter: drop-shadow(0 2px 4px rgba(184, 138, 68, 0.15));
}

.category-card:hover .luxury-svg-icon {
  transform: scale(1.1);
  color: #A7772F;
  filter: drop-shadow(0 4px 8px rgba(184, 138, 68, 0.3));
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 0.35rem;
  transition: color 0.3s ease;
  line-height: 1.25;
}

.category-card:hover .card-title {
  color: var(--primary);
}

.card-desc {
  font-size: 0.725rem;
  color: var(--text-muted);
  margin: 0 0 1rem;
  line-height: 1.45;
  flex: 1;
}

.explore-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--primary);
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.25s ease;
}

.category-card:hover .explore-hint {
  opacity: 1;
  transform: translateY(0);
}

.explore-hint i {
  font-size: 0.625rem;
  transition: transform 0.2s ease;
}

.category-card:hover .explore-hint i {
  transform: translateX(2px);
}
</style>
