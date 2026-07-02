<template>
  <div class="page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">{{ $t('collections.curated') }}</span>
        <h1 class="hero-title">{{ $t('collections.ourCollections') }}</h1>
        <p class="hero-count">{{ $t('collections.heroDesc') }}</p>
      </div>
    </section>

    <div class="collections-list">

      <div v-for="collection in collections" :key="collection.title" class="scroll-mt-24">
        <div class="collection-card">
          <div class="collection-img-col">
            <div class="collection-img-wrap">
              <img :src="collection.image" :alt="collection.title" class="collection-img" loading="lazy" />
            </div>
          </div>
          <div class="collection-info">
            <span class="section-label">{{ collection.tag }}</span>
            <h2 class="collection-title">{{ collection.title }}</h2>
            <p class="collection-desc">{{ collection.description }}</p>
            <div class="notes-row">
              <span v-for="note in collection.notes" :key="note" class="badge-gold">{{ note }}</span>
            </div>
            <RouterLink to="/products" class="btn-primary">
              {{ $t('collections.explore') }}
              <i class="ti ti-arrow-right" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>
      </div>

    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

interface Collection {
  tag: string
  title: string
  description: string
  notes: string[]
  image: string
}

const { t } = useI18n()
const collections = computed<Collection[]>(() => [
  {
    tag: t('collections.floralElegance'),
    title: t('collections.bloomCollection'),
    description: t('collections.bloomDesc'),
    notes: ['Rose', 'Jasmine', 'Lavender', 'Peony'],
    image: 'https://images.unsplash.com/photo-1598504776914-5ce1f0d1e73c?w=600&q=80',
  },
  {
    tag: t('collections.woodySensual'),
    title: t('collections.noirCollection'),
    description: t('collections.noirDesc'),
    notes: ['Sandalwood', 'Oud', 'Amber', 'Musk'],
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
  },
  {
    tag: t('collections.freshCitrus'),
    title: t('collections.aquaCollection'),
    description: t('collections.aquaDesc'),
    notes: ['Bergamot', 'Lemon', 'Sea Salt', 'Green Tea'],
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80',
  },
  {
    tag: t('collections.limitedEdition'),
    title: t('collections.reserveCollection'),
    description: t('collections.reserveDesc'),
    notes: ['Saffron', 'Leather', 'Tobacco', 'Vanilla'],
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80',
  },
])

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
.collections-list {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 64px;
}
.collection-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  background: var(--surface, #FFFFFF);
  border: 1px solid #E7E1D8;
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}
@media (min-width: 1024px) {
  .collection-card {
    flex-direction: row;
    gap: 48px;
    padding: 48px;
  }
}
.collection-img-col {
  width: 100%;
}
@media (min-width: 1024px) {
  .collection-img-col { width: 40%; }
}
.collection-img-wrap {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(176,141,87,0.15);
}
.collection-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 4/5;
  max-height: 400px;
  display: block;
}
.collection-info {
  width: 100%;
  text-align: center;
}
@media (min-width: 1024px) {
  .collection-info {
    width: 60%;
    text-align: left;
  }
}
.collection-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: #222222;
  font-family: var(--font-heading);
  margin-bottom: 16px;
}
@media (min-width: 768px) {
  .collection-title { font-size: 2.25rem; }
}
.collection-desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: #6F6F6F;
  margin-bottom: 24px;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 1024px) {
  .collection-desc { margin-left: 0; margin-right: 0; }
}
.notes-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: center;
}
@media (min-width: 1024px) {
  .notes-row { justify-content: flex-start; }
}

.badge-gold {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(184,138,68,0.1);
  color: #A7772F;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 18px;
  background: #B88A44;
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #A7772F;
}
</style>
