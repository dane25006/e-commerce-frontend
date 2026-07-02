<template>
  <div class="page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">{{ $t('about.ourStory') }}</span>
        <h1 class="hero-title">{{ $t('about.aboutScentique') }}</h1>
        <p class="hero-count">{{ $t('about.heroDesc') }}</p>
      </div>
    </section>

    <div class="content">

      <div class="story-section">
        <div class="story-img-col">
          <div class="story-img-wrap">
            <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80" :alt="$t('about.alt')" class="story-img" loading="lazy" />
          </div>
        </div>
        <div class="story-text-col">
          <span class="section-label">{{ $t('about.since') }}</span>
          <h2 class="story-title">{{ $t('about.passionTitle') }}</h2>
          <div class="story-paragraphs">
            <p>{{ $t('about.passionP1') }}</p>
            <p>{{ $t('about.passionP2') }}</p>
            <p>{{ $t('about.passionP3') }}</p>
          </div>
        </div>
      </div>

      <div class="values-section">
        <span class="section-label">{{ $t('about.valuesLabel') }}</span>
        <h2 class="values-title">{{ $t('about.valuesTitle') }}</h2>
        <div class="values-grid">
          <div v-for="value in values" :key="value.title" class="card">
            <div class="value-icon-wrap">
              <i :class="`ti ${value.icon}`" aria-hidden="true" />
            </div>
            <h3 class="value-card-title">{{ value.title }}</h3>
            <p class="value-card-desc">{{ value.description }}</p>
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

const { t } = useI18n()
const values = computed(() => [
  {
    icon: 'ti-diamond',
    title: t('about.craftsmanship'),
    description: t('about.craftsmanshipDesc'),
  },
  {
    icon: 'ti-leaf',
    title: t('about.sustainability'),
    description: t('about.sustainabilityDesc'),
  },
  {
    icon: 'ti-heart',
    title: t('about.authenticity'),
    description: t('about.authenticityDesc'),
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

.content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.story-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
@media (min-width: 1024px) {
  .story-section {
    flex-direction: row;
    gap: 64px;
  }
}
.story-img-col {
  width: 100%;
}
@media (min-width: 1024px) {
  .story-img-col { width: 50%; }
}
.story-img-wrap {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(176,141,87,0.15);
}
.story-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 4/5;
  max-height: 480px;
  display: block;
}
.story-text-col {
  width: 100%;
}
@media (min-width: 1024px) {
  .story-text-col { width: 50%; }
}
.story-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: #222222;
  font-family: var(--font-heading);
  margin-bottom: 20px;
}
@media (min-width: 768px) {
  .story-title { font-size: 2.25rem; }
}
.story-paragraphs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 0.875rem;
  line-height: 1.7;
  color: #6F6F6F;
}
.values-section {
  text-align: center;
}
.values-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: #222222;
  font-family: var(--font-heading);
  margin-bottom: 40px;
}
@media (min-width: 768px) {
  .values-title { font-size: 2.25rem; }
}
.values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 768px) {
  .values-grid { grid-template-columns: repeat(3, 1fr); }
}
.card {
  padding: 32px;
  border-radius: 18px;
  background: #FFFFFF;
  border: 1px solid #E7E1D8;
  text-align: center;
  transition: box-shadow 0.3s, transform 0.3s;
}
.card:hover {
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  transform: translateY(-2px);
}
.value-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: rgba(184,138,68,0.1);
  font-size: 1.5rem;
  color: #B88A44;
}
.value-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #222222;
  font-family: var(--font-heading);
  margin-bottom: 8px;
}
.value-card-desc {
  font-size: 0.875rem;
  line-height: 1.7;
  color: #6F6F6F;
}
</style>
