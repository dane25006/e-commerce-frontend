<template>
  <section class="hero-section">
    <div class="hero-bg-layer">
      <div class="bg-grid" />
      <div class="bg-blob blob-1" />
      <div class="bg-blob blob-2" />
      <div class="bg-blob blob-3" />
      <div class="bg-blob blob-4" />
      <div class="bg-blob blob-5" />
      <div class="bg-glow-orb orb-1" />
      <div class="bg-glow-orb orb-2" />
      <div class="bg-glow-orb orb-3" />
      <div class="bg-glow-orb orb-4" />
      <div class="bg-bottle-silhouette silhouette-1" />
      <div class="bg-bottle-silhouette silhouette-2" />
      <div class="bg-botanical botanical-1" />
      <div class="bg-botanical botanical-2" />
      <div class="bg-botanical botanical-3" />
      <div class="bg-botanical botanical-4" />
      <div class="sparkle sparkle-1" />
      <div class="sparkle sparkle-2" />
      <div class="sparkle sparkle-3" />
      <div class="sparkle sparkle-4" />
      <div class="sparkle sparkle-5" />
      <div class="sparkle sparkle-6" />
      <div class="sparkle sparkle-7" />
      <div class="sparkle sparkle-8" />
    </div>

    <div class="hero-container">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="content-inner">
            <span class="hero-badge fade-in-left">
              <i class="ti ti-sparkles" aria-hidden="true" />
              {{ $t('hero.newCollection') }}
            </span>

            <h1 class="hero-title fade-in-left" style="animation-delay: 0.1s;">
              {{ $t('hero.headline') }}<br />
              <span class="hero-title-accent">{{ $t('hero.headlineAccent') }}</span>
            </h1>

            <p class="hero-desc fade-in-left" style="animation-delay: 0.2s;">
              {{ $t('hero.description') }}
            </p>

            <div class="hero-cta fade-in-left" style="animation-delay: 0.3s;">
              <RouterLink to="/products" class="btn-primary hero-btn-primary">
                <i class="ti ti-shopping-bag" aria-hidden="true" />
                {{ $t('hero.shopNow') }}
              </RouterLink>
              <RouterLink to="/collections" class="hero-btn-secondary">
                <span class="btn-secondary-ring">
                  <i class="ti ti-layout-grid" aria-hidden="true" />
                </span>
                {{ $t('hero.exploreCollection') }}
              </RouterLink>
            </div>

            <div class="hero-search fade-in-left" style="animation-delay: 0.35s;">
              <div class="search-box">
                <i class="ti ti-search search-icon" aria-hidden="true" />
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  type="text"
                  :placeholder="$t('hero.searchPlaceholder')"
                  class="search-input"
                  @keydown.enter="handleSearch"
                />
                <button class="search-btn" @click="handleSearch" :aria-label="$t('hero.searchButton')">
                  <i class="ti ti-arrow-right" aria-hidden="true" />
                </button>
              </div>
              <div class="popular-tags">
                <span class="tags-label">{{ $t('hero.popularSearches') }}:</span>
                <button
                  v-for="tag in popularTags"
                  :key="tag.label"
                  class="tag-chip"
                  @click="handleTagClick(tag.query)"
                >
                  {{ tag.label }}
                </button>
              </div>
            </div>

            <div class="hero-trust fade-in-left" style="animation-delay: 0.45s;">
              <div v-for="item in trustItems" :key="item.key" class="trust-item">
                <i :class="item.icon" class="trust-icon" aria-hidden="true" />
                <span class="trust-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="visual-wrapper fade-in-right" style="animation-delay: 0.2s;">
            <div class="visual-glow-bg" />
            <div class="visual-glow-bg visual-glow-secondary" />

            <div class="visual-frame">
              <div class="visual-bottle">
                <div class="bottle-glow" />
                <div class="bottle-inner">
                  <span class="bottle-brand">SCENTIQUE</span>
                  <div class="bottle-liquid" />
                </div>
              </div>
              <div class="particle particle-1" />
              <div class="particle particle-2" />
              <div class="particle particle-3" />
              <div class="particle particle-4" />
              <div class="particle particle-5" />
            </div>

            <div class="float-card card-rating">
              <div class="float-card-icon rating-stars">
                <i class="ti ti-star-filled" aria-hidden="true" />
              </div>
              <div class="float-card-text">
                <p class="float-card-value">{{ $t('hero.rating') }}</p>
                <p class="float-card-label">{{ $t('hero.ratingLabel') }}</p>
              </div>
            </div>

            <div class="float-card card-sales">
              <div class="float-card-icon sales-icon">
                <i class="ti ti-flame" aria-hidden="true" />
              </div>
              <div class="float-card-text">
                <p class="float-card-value">{{ $t('hero.salesValue') }}</p>
                <p class="float-card-label">{{ $t('hero.salesLabel') }}</p>
              </div>
            </div>

            <div class="float-card card-delivery">
              <div class="float-card-icon delivery-icon">
                <i class="ti ti-truck" aria-hidden="true" />
              </div>
              <div class="float-card-text">
                <p class="float-card-value">{{ $t('hero.deliveryLabel') }}</p>
                <p class="float-card-label">{{ $t('hero.deliverySub') }}</p>
              </div>
            </div>

            <div class="float-card card-authentic">
              <div class="float-card-icon authentic-icon">
                <i class="ti ti-shield-check" aria-hidden="true" />
              </div>
              <div class="float-card-text">
                <p class="float-card-value">{{ $t('hero.authenticBadge') }}</p>
                <p class="float-card-label">{{ $t('hero.authenticSub') }}</p>
              </div>
            </div>

            <div class="float-badge badge-discount">
              <span class="discount-pct">{{ $t('hero.discountBadge') }}</span>
              <span class="discount-sub">{{ $t('hero.discountSub') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const popularTags = [
  { label: t('hero.tagDior'), query: 'Dior' },
  { label: t('hero.tagChanel'), query: 'Chanel' },
  { label: t('hero.tagVersace'), query: 'Versace' },
  { label: t('hero.tagTomFord'), query: 'Tom Ford' },
  { label: t('hero.tagGucci'), query: 'Gucci' },
  { label: t('hero.tagFloral'), query: 'Floral' },
  { label: t('hero.tagWoody'), query: 'Woody' },
  { label: t('hero.tagFresh'), query: 'Fresh' },
  { label: t('hero.tagUnisex'), query: 'Unisex' },
]

const trustItems = [
  { icon: 'ti ti-shield-check', key: 'trustAuthentic', label: t('hero.trustAuthentic') },
  { icon: 'ti ti-truck', key: 'trustShipping', label: t('hero.trustShipping') },
  { icon: 'ti ti-lock', key: 'trustPayment', label: t('hero.trustPayment') },
  { icon: 'ti ti-refresh', key: 'trustReturns', label: t('hero.trustReturns') },
  { icon: 'ti ti-star', key: 'trustReviews', label: t('hero.trustReviews') },
]

function handleSearch() {
  const q = searchQuery.value.trim()
  if (q) {
    router.push(`/products?search=${encodeURIComponent(q)}`)
  }
}

function handleTagClick(query: string) {
  router.push(`/products?search=${encodeURIComponent(query)}`)
}
</script>

<style scoped>
/* ========== Section ========== */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 620px;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, #FFFDF8 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 80% 80%, #F6E7C1 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 20% 90%, #EFD9C6 0%, transparent 50%),
    linear-gradient(175deg, #FFFDF8 0%, #FCF8F2 25%, #F8F4ED 50%, #F5F1EA 75%, #FAF7F2 100%);
}

/* ========== Background Layer ========== */
.hero-bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

/* --- Grid Texture --- */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(184,138,68,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184,138,68,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* --- Blurred Circles --- */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.blob-1 {
  top: -180px;
  right: -120px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(184,138,68,0.12), transparent 70%);
  animation: blobFloat 18s ease-in-out infinite;
}

.blob-2 {
  bottom: -200px;
  left: -150px;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(196,154,90,0.08), transparent 70%);
  animation: blobFloat 22s ease-in-out infinite reverse;
}

.blob-3 {
  top: 30%;
  left: 60%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(239,217,198,0.1), transparent 70%);
  animation: blobFloat 15s ease-in-out infinite;
  animation-delay: -5s;
}

.blob-4 {
  top: 60%;
  left: 10%;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(184,138,68,0.06), transparent 70%);
  animation: blobFloat 20s ease-in-out infinite;
  animation-delay: -8s;
}

.blob-5 {
  top: 15%;
  left: 35%;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(246,231,193,0.1), transparent 70%);
  animation: blobFloat 12s ease-in-out infinite;
  animation-delay: -3s;
}

@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -30px) scale(1.05); }
  66% { transform: translate(-15px, 20px) scale(0.95); }
}

/* --- Glow Orbs --- */
.bg-glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.3;
  animation: orbPulse 6s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  top: -100px;
  left: -100px;
  background: radial-gradient(circle, rgba(246,231,193,0.25), transparent 70%);
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  bottom: -80px;
  right: -80px;
  background: radial-gradient(circle, rgba(239,217,198,0.2), transparent 70%);
  animation-delay: -2s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  top: 40%;
  right: 30%;
  background: radial-gradient(circle, rgba(184,138,68,0.12), transparent 70%);
  animation-delay: -4s;
}

.orb-4 {
  width: 350px;
  height: 350px;
  bottom: 20%;
  left: 20%;
  background: radial-gradient(circle, rgba(201,169,110,0.1), transparent 70%);
  animation-delay: -1s;
}

@keyframes orbPulse {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(1.1); }
}

/* --- Bottle Silhouettes --- */
.bg-bottle-silhouette {
  position: absolute;
  opacity: 0.04;
  filter: blur(2px);
  color: var(--primary);
  font-size: 220px;
  font-weight: 900;
  transform: rotate(-20deg);
}

.silhouette-1 {
  top: 5%;
  right: 3%;
  font-size: 280px;
  animation: silhouetteDrift 20s ease-in-out infinite;
}

.silhouette-2 {
  bottom: 3%;
  left: 2%;
  font-size: 200px;
  animation: silhouetteDrift 25s ease-in-out infinite reverse;
}

@keyframes silhouetteDrift {
  0%, 100% { transform: rotate(-20deg) translateY(0); }
  50% { transform: rotate(-20deg) translateY(-25px); }
}

/* --- Botanical Decorations --- */
.bg-botanical {
  position: absolute;
  opacity: 0.06;
  font-size: 60px;
  pointer-events: none;
}

.botanical-1 {
  top: 8%;
  left: 4%;
  font-size: 50px;
  animation: botanicalSway 12s ease-in-out infinite;
}

.botanical-2 {
  bottom: 12%;
  right: 6%;
  font-size: 45px;
  animation: botanicalSway 14s ease-in-out infinite reverse;
}

.botanical-3 {
  top: 50%;
  left: 1%;
  font-size: 35px;
  animation: botanicalSway 10s ease-in-out infinite;
  animation-delay: -4s;
}

.botanical-4 {
  top: 20%;
  right: 2%;
  font-size: 40px;
  animation: botanicalSway 16s ease-in-out infinite;
  animation-delay: -7s;
}

@keyframes botanicalSway {
  0%, 100% { transform: rotate(-5deg) translateY(0); }
  50% { transform: rotate(5deg) translateY(-10px); }
}

/* --- Sparkles --- */
.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  opacity: 0;
  animation: sparkle 5s ease-in-out infinite;
}

.sparkle::before {
  content: '✦';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  color: var(--primary);
}

.sparkle-1 { top: 15%; left: 10%; animation-delay: 0s; }
.sparkle-2 { top: 25%; right: 15%; animation-delay: 0.8s; }
.sparkle-3 { bottom: 30%; left: 20%; animation-delay: 1.6s; }
.sparkle-4 { bottom: 15%; right: 25%; animation-delay: 2.4s; }
.sparkle-5 { top: 45%; left: 5%; animation-delay: 3.2s; }
.sparkle-6 { top: 60%; right: 8%; animation-delay: 0.4s; }
.sparkle-7 { bottom: 45%; left: 35%; animation-delay: 1.2s; }
.sparkle-8 { bottom: 55%; right: 5%; animation-delay: 2s; }

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  25% { opacity: 0.6; transform: scale(1) rotate(180deg); }
  50% { opacity: 0; transform: scale(0) rotate(360deg); }
}

/* ========== Container ========== */
.hero-container {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  z-index: 1;
}

@media (min-width: 640px) {
  .hero-container { padding: 0 1.5rem; }
}

@media (min-width: 1024px) {
  .hero-container { padding: 0 2rem; }
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 620px;
  gap: 2.5rem;
  padding: 3rem 0 4rem;
}

@media (min-width: 1024px) {
  .hero-inner {
    flex-direction: row;
    gap: 3rem;
    padding: 0;
  }
}

/* ========== Left Content ========== */
.hero-content {
  width: 100%;
  z-index: 2;
}

@media (min-width: 1024px) {
  .hero-content {
    width: 52%;
    padding: 4rem 0;
  }
}

.content-inner {
  max-width: 560px;
}

@media (min-width: 1024px) {
  .content-inner {
    margin: 0;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, rgba(184,138,68,0.12), rgba(196,154,90,0.08));
  color: var(--primary);
  border: 1px solid rgba(184,138,68,0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 12px rgba(184,138,68,0.06);
}

.hero-title {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1rem;
  color: var(--text);
  font-family: var(--font-body);
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .hero-title { font-size: 2.5rem; }
}

@media (min-width: 1024px) {
  .hero-title { font-size: 3rem; }
}

@media (min-width: 1280px) {
  .hero-title { font-size: 3.5rem; }
}

.hero-title-accent {
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 0.9375rem;
  line-height: 1.7;
  margin-bottom: 1.75rem;
  max-width: 480px;
  color: var(--text-muted);
  font-weight: 400;
}

@media (min-width: 1024px) {
  .hero-desc {
    margin-left: 0;
  }
}

/* ========== CTA ========== */
.hero-cta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.hero-btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.8125rem 1.75rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, var(--primary), #C49A5A);
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-decoration: none;
  box-shadow:
    0 4px 24px rgba(184,138,68,0.35),
    0 1px 3px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
}

.hero-btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent 50%);
  pointer-events: none;
}

.hero-btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.hero-btn-primary:hover::after {
  transform: translateX(100%);
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 32px rgba(184,138,68,0.45),
    0 2px 6px rgba(0,0,0,0.1);
}

.hero-btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  transition: color 0.3s ease;
}

.hero-btn-secondary:hover {
  color: var(--primary);
}

.btn-secondary-ring {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--border);
  transition: all 0.3s ease;
  color: var(--primary);
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.hero-btn-secondary:hover .btn-secondary-ring {
  border-color: var(--primary);
  background: rgba(184,138,68,0.08);
  box-shadow: 0 4px 16px rgba(184,138,68,0.12);
}

/* ========== Search ========== */
.hero-search {
  margin-bottom: 1.75rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1.5px solid rgba(184,138,68,0.12);
  transition: all 0.3s ease;
  max-width: 480px;
  box-shadow:
    0 2px 12px rgba(0,0,0,0.04),
    0 1px 3px rgba(184,138,68,0.03);
}

.search-box:focus-within {
  border-color: var(--primary);
  box-shadow:
    0 0 0 3px rgba(184,138,68,0.1),
    0 4px 20px rgba(184,138,68,0.08);
  background: rgba(255,255,255,0.95);
}

.search-icon {
  font-size: 1.125rem;
  color: var(--primary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.875rem;
  color: var(--text);
  font-family: var(--font-body);
  min-width: 0;
}

.search-input::placeholder {
  color: #b5b5b5;
}

.search-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), #C49A5A);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(184,138,68,0.2);
}

.search-btn:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(184,138,68,0.3);
}

.popular-tags {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.tags-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.tag-chip {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: none;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(4px);
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(184,138,68,0.08);
}

.tag-chip:hover {
  background: rgba(184,138,68,0.15);
  border-color: rgba(184,138,68,0.2);
  transform: translateY(-1px);
}

/* ========== Trust ========== */
.hero-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.trust-icon {
  font-size: 0.75rem;
  color: var(--primary);
}

.trust-label {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}

/* ========== Right Visual ========== */
.hero-visual {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

@media (min-width: 1024px) {
  .hero-visual {
    width: 48%;
    padding: 4rem 0;
  }
}

.visual-wrapper {
  position: relative;
  width: 100%;
  max-width: 420px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* --- Bottle Glow Layers --- */
.visual-glow-bg {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(184,138,68,0.15), rgba(201,169,110,0.08) 40%, transparent 70%);
  animation: pulseGlow 4s ease-in-out infinite;
  filter: blur(20px);
}

.visual-glow-secondary {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  background: radial-gradient(circle, rgba(246,231,193,0.2), rgba(239,217,198,0.08) 40%, transparent 65%);
  animation-delay: 2s;
  filter: blur(30px);
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
}

/* --- Glass Ring Behind Bottle --- */
.visual-frame {
  position: relative;
  width: 200px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-frame::before {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  border: 1px solid rgba(184,138,68,0.08);
  background: radial-gradient(circle, rgba(255,255,255,0.1), transparent 60%);
  backdrop-filter: blur(4px);
  box-shadow:
    0 0 60px rgba(184,138,68,0.06),
    inset 0 0 60px rgba(184,138,68,0.03);
  animation: ringPulse 5s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@media (min-width: 768px) {
  .visual-frame {
    width: 240px;
    height: 340px;
  }
  .visual-frame::before {
    width: 300px;
    height: 300px;
  }
}

/* --- Perfume Bottle --- */
.visual-bottle {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 40% 40% 20% 20% / 50% 50% 20% 20%;
  background: linear-gradient(180deg, #C49A5A 0%, var(--primary) 40%, #8E6F3E 100%);
  box-shadow:
    0 20px 60px rgba(184,138,68,0.3),
    0 8px 20px rgba(0,0,0,0.06),
    inset 0 -20px 40px rgba(0,0,0,0.1),
    inset 0 20px 40px rgba(255,255,255,0.08);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  animation: floatBottle 6s ease-in-out infinite;
  z-index: 1;
}

@keyframes floatBottle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.bottle-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 40%, rgba(184,138,68,0.05) 60%, rgba(255,255,255,0.08) 100%);
  pointer-events: none;
}

.bottle-inner {
  position: relative;
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  background: rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.1);
}

.bottle-brand {
  font-size: 6px;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
}

.bottle-liquid {
  position: absolute;
  top: 40%;
  left: 10%;
  right: 10%;
  bottom: 0;
  background: linear-gradient(180deg, rgba(196,154,90,0.3), rgba(184,138,68,0.15));
  border-radius: 50% 50% 20% 20% / 20% 20% 20% 20%;
  filter: blur(1px);
}

/* --- Particles --- */
.particle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(184,138,68,0.25), transparent 70%);
  animation: particleFloat 8s ease-in-out infinite;
  z-index: 2;
}

.particle-1 {
  width: 8px;
  height: 8px;
  top: 5%;
  right: -25px;
  animation-delay: 0s;
}

.particle-2 {
  width: 5px;
  height: 5px;
  top: 25%;
  left: -20px;
  animation-delay: 2s;
}

.particle-3 {
  width: 6px;
  height: 6px;
  bottom: 15%;
  right: -30px;
  animation-delay: 4s;
}

.particle-4 {
  width: 10px;
  height: 10px;
  bottom: 35%;
  left: -25px;
  animation-delay: 1s;
}

.particle-5 {
  width: 4px;
  height: 4px;
  top: 45%;
  right: 25%;
  animation-delay: 3s;
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-35px) scale(1.8); opacity: 0.7; }
}

/* ========== Floating Info Cards ========== */
.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  border-radius: 14px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow:
    0 8px 32px rgba(0,0,0,0.06),
    0 1px 3px rgba(0,0,0,0.03),
    inset 0 1px 0 rgba(255,255,255,0.6);
  animation: cardFloat 5s ease-in-out infinite;
  white-space: nowrap;
  z-index: 3;
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.float-card-icon {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
}

.float-card-text {
  line-height: 1.2;
}

.float-card-value {
  font-size: 0.6875rem;
  font-weight: 800;
  color: var(--text);
  margin: 0;
}

.float-card-label {
  font-size: 0.5625rem;
  color: var(--text-muted);
  margin: 0;
}

.card-rating {
  top: -5px;
  right: -15px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(20px);
  animation-delay: 0s;
}

.card-rating .float-card-icon {
  background: rgba(184,138,68,0.12);
  color: var(--primary);
}

.card-sales {
  top: 20%;
  left: -55px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(20px);
  animation-delay: 0.8s;
}

.card-sales .float-card-icon {
  background: rgba(231,76,60,0.1);
  color: #E74C3C;
}

.card-delivery {
  bottom: 18%;
  right: -45px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(20px);
  animation-delay: 1.6s;
}

.card-delivery .float-card-icon {
  background: rgba(46,139,87,0.1);
  color: #2E8B57;
}

.card-authentic {
  bottom: 2%;
  left: -40px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(20px);
  animation-delay: 2.4s;
}

.card-authentic .float-card-icon {
  background: rgba(184,138,68,0.12);
  color: var(--primary);
}

@media (max-width: 1023px) {
  .card-sales, .card-authentic {
    display: none;
  }

  .card-rating {
    top: -10px;
    right: 0;
  }

  .card-delivery {
    bottom: 10%;
    right: 0;
  }
}

@media (max-width: 639px) {
  .float-card {
    padding: 0.375rem 0.625rem;
  }

  .float-card-icon {
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.625rem;
  }

  .float-card-value {
    font-size: 0.625rem;
  }

  .float-card-label {
    font-size: 0.5rem;
  }

  .card-rating {
    top: -5px;
    right: 5px;
  }

  .card-delivery {
    display: none;
  }
}

/* --- Discount Badge --- */
.float-badge {
  position: absolute;
  padding: 0.5rem 0.8rem;
  border-radius: 14px;
  text-align: center;
  animation: cardFloat 5s ease-in-out infinite;
  animation-delay: 3.2s;
  z-index: 3;
}

.badge-discount {
  top: 6%;
  left: -50px;
  background: linear-gradient(135deg, var(--primary), #C49A5A);
  box-shadow:
    0 4px 20px rgba(184,138,68,0.3),
    0 1px 3px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.15);
}

.discount-pct {
  display: block;
  font-size: 0.7rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
}

.discount-sub {
  display: block;
  font-size: 0.5rem;
  font-weight: 600;
  color: rgba(255,255,255,0.75);
  line-height: 1.1;
}

@media (max-width: 1023px) {
  .badge-discount {
    display: none;
  }
}

/* ========== Fade In Animations ========== */
.fade-in-left {
  opacity: 0;
  transform: translateX(-20px);
  animation: fadeInLeft 0.7s ease forwards;
}

@keyframes fadeInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in-right {
  opacity: 0;
  transform: translateX(20px);
  animation: fadeInRight 0.7s ease forwards;
}

@keyframes fadeInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
