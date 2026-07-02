<template>
  <div class="page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">{{ $t('brands.luxuryHouses') }}</span>
        <h1 class="hero-title">{{ $t('brands.featuredBrands') }}</h1>
        <p class="hero-count">{{ $t('brands.heroDesc') }}</p>
      </div>
    </section>

    <div class="brands-grid">

      <div
        v-for="brand in brands"
        :key="brand.name"
        class="brand-card"
      >
        <div class="brand-banner" :style="{ background: brand.gradient }">
          <div class="brand-banner-overlay">
            <span class="brand-initial">{{ brand.name.charAt(0) }}</span>
          </div>
        </div>
        <div class="brand-body">
          <h3 class="brand-name">{{ brand.name }}</h3>
          <p class="brand-desc">{{ brand.description }}</p>
          <div class="brand-signatures">
            <span v-for="note in brand.signatures" :key="note" class="badge-gold">{{ note }}</span>
          </div>
          <RouterLink to="/products" class="shop-link">
            {{ $t('brands.shopBrand', { brand: brand.name }) }}
            <i class="ti ti-arrow-right" aria-hidden="true" />
          </RouterLink>
        </div>
      </div>

    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

interface Brand {
  name: string
  description: string
  signatures: string[]
  gradient: string
}

const brands: Brand[] = [
  {
    name: 'Dior',
    description: 'Synonymous with timeless elegance, Dior fragrances capture the spirit of haute couture with bold floral and oriental compositions.',
    signatures: ['Miss Dior', 'Sauvage', 'J\'adore'],
    gradient: 'linear-gradient(135deg, #2D2D2D, #4A4A4A)',
  },
  {
    name: 'Chanel',
    description: 'The epitome of French luxury, Chanel creates iconic scents that have defined generations with their sophisticated and complex blends.',
    signatures: ['Chanel No. 5', 'Coco Mademoiselle', 'Bleu'],
    gradient: 'linear-gradient(135deg, #1A1A1A, #333333)',
  },
  {
    name: 'Versace',
    description: 'Bold, vibrant, and unapologetically glamorous — Versace fragrances embody the spirit of Mediterranean luxury and confidence.',
    signatures: ['Eros', 'Bright Crystal', 'Dylan Blue'],
    gradient: 'linear-gradient(135deg, #8B0000, #B22222)',
  },
  {
    name: 'Gucci',
    description: 'Eclectic and visionary, Gucci perfumes blend unexpected notes to create modern classics that push the boundaries of traditional perfumery.',
    signatures: ['Bloom', 'Guilty', 'Mémoire d\'une Odeur'],
    gradient: 'linear-gradient(135deg, #4A403A, #5C5248)',
  },
  {
    name: 'YSL',
    description: 'Saint Laurent fragrances are an ode to audacity — sensual, daring, and unforgettable, just like the maison itself.',
    signatures: ['Black Opium', 'Libre', 'L\'Homme'],
    gradient: 'linear-gradient(135deg, #1C1C1C, #3D3D3D)',
  },
  {
    name: 'Tom Ford',
    description: 'Luxury redefined — Tom Ford creates provocative, gender-defying scents that are as bold and unapologetic as the man behind the brand.',
    signatures: ['Black Orchid', 'Tobacco Vanille', 'Oud Wood'],
    gradient: 'linear-gradient(135deg, #0D0D0D, #2A2A2A)',
  },
]

const searchOpen = ref(false)
const cartOpen = ref(false)
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #FAF8F5;
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
.hero-count {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  margin: 0;
  font-weight: 400;
}

.brands-grid {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 768px) {
  .brands-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .brands-grid { grid-template-columns: repeat(3, 1fr); }
}
.brand-card {
  border-radius: 18px;
  overflow: hidden;
  background: #FFFFFF;
  border: 1px solid #E7E1D8;
  transition: all 0.3s;
}
.brand-card:hover {
  border-color: #B88A44;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  transform: translateY(-4px);
}
.brand-banner {
  aspect-ratio: 16/9;
  overflow: hidden;
  position: relative;
}
.brand-banner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-initial {
  font-size: 3rem;
  font-weight: 900;
  color: rgba(255,255,255,0.15);
  font-family: var(--font-heading);
}
@media (min-width: 768px) {
  .brand-initial { font-size: 3.75rem; }
}
.brand-body {
  padding: 24px;
  text-align: center;
}
.brand-name {
  font-size: 1.25rem;
  font-weight: 900;
  color: #222222;
  font-family: var(--font-heading);
  margin-bottom: 8px;
}
.brand-desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: #6F6F6F;
  margin-bottom: 16px;
}
.brand-signatures {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-bottom: 16px;
}
.badge-gold {
  font-size: 0.625rem;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(184,138,68,0.1);
  color: #A7772F;
}
.shop-link {
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #B88A44;
  text-decoration: none;
  transition: color 0.2s;
}
.shop-link:hover {
  color: #A7772F;
}
</style>
