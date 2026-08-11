<template>
  <section class="hero-section" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
    <!-- Ambient Background Elements -->
    <div class="hero-bg-layer">
      <div class="bg-grid" />
      <div class="bg-blob blob-1" />
      <div class="bg-blob blob-2" />
      <div class="bg-blob blob-3" />
      <div class="bg-glow-orb orb-1" />
      <div class="bg-glow-orb orb-2" />
      <div class="sparkle sparkle-1" />
      <div class="sparkle sparkle-2" />
      <div class="sparkle sparkle-3" />
      <div class="sparkle sparkle-4" />
      <div class="sparkle sparkle-5" />
      <div class="sparkle sparkle-6" />
    </div>

    <div class="hero-container">
      <div class="hero-inner">
        <!-- Left Content -->
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

            <!-- Action Buttons -->
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

            <!-- Search Bar -->
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

              <!-- Popular Tags -->
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

            <!-- Trust Indicators -->
            <div class="hero-trust fade-in-left" style="animation-delay: 0.45s;">
              <div v-for="item in trustItems" :key="item.key" class="trust-item">
                <i :class="item.icon" class="trust-icon" aria-hidden="true" />
                <span class="trust-label">{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Visual Showcase -->
        <div class="hero-visual">
          <div
            class="visual-wrapper fade-in-right"
            :style="{
              transform: `perspective(1000px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)`,
            }"
          >
            <!-- Glowing Background Aura -->
            <div class="visual-glow-bg" />
            <div class="visual-glow-secondary" />

            <!-- Pedestal & Perfume Showcase -->
            <div class="perfume-showcase-card">
              <!-- Halo ring -->
              <div class="showcase-ring" />

              <!-- High-definition Perfume Bottle Image -->
              <div class="bottle-image-wrap">
                <img
                  src="/images/luxury_perfume_hero.png"
                  alt="Scentique Luxury Fragrance"
                  class="bottle-hero-img"
                />
                <!-- Subtle light flare on the glass -->
                <div class="glass-light-flare" />
              </div>

              <!-- Illuminated Pedestal Base -->
              <div class="pedestal-platform">
                <div class="pedestal-glass" />
                <div class="pedestal-glow" />
              </div>
            </div>

            <!-- Floating Card: Top Right - Rating -->
            <div class="float-card card-rating">
              <div class="float-card-icon rating-stars">
                <i class="ti ti-star-filled" aria-hidden="true" />
              </div>
              <div class="float-card-text">
                <p class="float-card-value">{{ $t('hero.rating') }}</p>
                <p class="float-card-label">{{ $t('hero.ratingLabel') }}</p>
              </div>
            </div>

            <!-- Floating Card: Top Left - Sales -->
            <div class="float-card card-sales">
              <div class="float-card-icon sales-icon">
                <i class="ti ti-flame" aria-hidden="true" />
              </div>
              <div class="float-card-text">
                <p class="float-card-value">{{ $t('hero.salesValue') }}</p>
                <p class="float-card-label">{{ $t('hero.salesLabel') }}</p>
              </div>
            </div>

            <!-- Floating Badge: Discount -->
            <div class="float-badge badge-discount">
              <span class="discount-pct">{{ $t('hero.discountBadge') }}</span>
              <span class="discount-sub">{{ $t('hero.discountSub') }}</span>
            </div>

            <!-- Floating Card: Bottom Right - Delivery -->
            <div class="float-card card-delivery">
              <div class="float-card-icon delivery-icon">
                <i class="ti ti-truck" aria-hidden="true" />
              </div>
              <div class="float-card-text">
                <p class="float-card-value">{{ $t('hero.deliveryLabel') }}</p>
                <p class="float-card-label">{{ $t('hero.deliverySub') }}</p>
              </div>
            </div>

            <!-- Floating Card: Bottom Left - Authentic -->
            <div class="float-card card-authentic">
              <div class="float-card-icon authentic-icon">
                <i class="ti ti-shield-check" aria-hidden="true" />
              </div>
              <div class="float-card-text">
                <p class="float-card-value">{{ $t('hero.authenticBadge') }}</p>
                <p class="float-card-label">{{ $t('hero.authenticSub') }}</p>
              </div>
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

// 3D Parallax Tilt
const tiltX = ref(0)
const tiltY = ref(0)

function handleMouseMove(e: MouseEvent) {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  tiltX.value = +(x * 8).toFixed(2)
  tiltY.value = +(-y * 8).toFixed(2)
}

function handleMouseLeave() {
  tiltX.value = 0
  tiltY.value = 0
}

const popularTags = [
  { label: 'Dior', query: 'Dior' },
  { label: 'Chanel', query: 'Chanel' },
  { label: 'Versace', query: 'Versace' },
  { label: 'Tom Ford', query: 'Tom Ford' },
  { label: 'Gucci', query: 'Gucci' },
  { label: 'Floral', query: 'Floral' },
  { label: 'Woody', query: 'Woody' },
  { label: 'Fresh', query: 'Fresh' },
  { label: 'Unisex', query: 'Unisex' },
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
  min-height: 640px;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, #FFFDF8 0%, transparent 70%),
    radial-gradient(ellipse 60% 50% at 85% 75%, rgba(246, 231, 193, 0.45) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 15% 85%, rgba(239, 217, 198, 0.35) 0%, transparent 50%),
    linear-gradient(175deg, #FFFDF8 0%, #FCF8F2 30%, #F8F4ED 65%, #FAF7F2 100%);
}

/* ========== Background Layer ========== */
.hero-bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(184, 138, 68, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(184, 138, 68, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.blob-1 {
  top: -150px;
  right: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(184, 138, 68, 0.15), transparent 70%);
  animation: blobFloat 20s ease-in-out infinite;
}

.blob-2 {
  bottom: -180px;
  left: -120px;
  width: 650px;
  height: 650px;
  background: radial-gradient(circle, rgba(201, 169, 110, 0.12), transparent 70%);
  animation: blobFloat 24s ease-in-out infinite reverse;
}

.blob-3 {
  top: 35%;
  left: 55%;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(239, 217, 198, 0.15), transparent 70%);
  animation: blobFloat 18s ease-in-out infinite;
  animation-delay: -5s;
}

@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(25px, -30px) scale(1.06); }
  66% { transform: translate(-20px, 20px) scale(0.96); }
}

.bg-glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;
  animation: orbPulse 6s ease-in-out infinite;
}

.orb-1 {
  width: 450px;
  height: 450px;
  top: 10%;
  right: 15%;
  background: radial-gradient(circle, rgba(246, 231, 193, 0.4), transparent 70%);
}

.orb-2 {
  width: 380px;
  height: 380px;
  bottom: 5%;
  left: 10%;
  background: radial-gradient(circle, rgba(184, 138, 68, 0.15), transparent 70%);
  animation-delay: -3s;
}

@keyframes orbPulse {
  0%, 100% { opacity: 0.25; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(1.08); }
}

/* Sparkles */
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
  font-size: 11px;
  color: var(--primary);
}

.sparkle-1 { top: 12%; left: 8%; animation-delay: 0s; }
.sparkle-2 { top: 22%; right: 18%; animation-delay: 0.9s; }
.sparkle-3 { bottom: 25%; left: 25%; animation-delay: 1.8s; }
.sparkle-4 { bottom: 15%; right: 30%; animation-delay: 2.7s; }
.sparkle-5 { top: 50%; left: 4%; animation-delay: 3.6s; }
.sparkle-6 { top: 65%; right: 6%; animation-delay: 0.5s; }

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  30% { opacity: 0.7; transform: scale(1) rotate(180deg); }
  60% { opacity: 0; transform: scale(0) rotate(360deg); }
}

/* ========== Container ========== */
.hero-container {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.25rem;
  z-index: 1;
}

@media (min-width: 640px) {
  .hero-container { padding: 0 2rem; }
}

@media (min-width: 1024px) {
  .hero-container { padding: 0 2.5rem; }
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 640px;
  gap: 3rem;
  padding: 3.5rem 0 4.5rem;
}

@media (min-width: 1024px) {
  .hero-inner {
    flex-direction: row;
    gap: 3.5rem;
    padding: 2.5rem 0;
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
    padding: 3rem 0;
  }
}

.content-inner {
  max-width: 560px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1.15rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
  background: linear-gradient(135deg, rgba(184, 138, 68, 0.12), rgba(201, 169, 110, 0.08));
  color: var(--primary);
  border: 1px solid rgba(184, 138, 68, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 14px rgba(184, 138, 68, 0.08);
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1.12;
  margin-bottom: 1.125rem;
  color: var(--text);
  font-family: var(--font-heading);
  letter-spacing: -0.02em;
}

@media (min-width: 768px) {
  .hero-title { font-size: 2.85rem; }
}

@media (min-width: 1024px) {
  .hero-title { font-size: 3.4rem; }
}

.hero-title-accent {
  background: linear-gradient(135deg, #B88A44 0%, #D4AF37 50%, #9E7431 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 8px rgba(184, 138, 68, 0.15));
}

.hero-desc {
  font-size: 0.95rem;
  line-height: 1.75;
  margin-bottom: 1.85rem;
  max-width: 500px;
  color: var(--text-muted);
  font-weight: 400;
}

/* ========== CTA Buttons ========== */
.hero-cta {
  display: flex;
  align-items: center;
  gap: 1.125rem;
  margin-bottom: 2.25rem;
  flex-wrap: wrap;
}

.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.875rem 2rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #B88A44, #C9A96E);
  color: #fff;
  text-decoration: none;
  box-shadow:
    0 4px 18px rgba(184, 138, 68, 0.35),
    0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 24px rgba(184, 138, 68, 0.45),
    0 2px 6px rgba(0, 0, 0, 0.12);
  background: linear-gradient(135deg, #A7772F, #B88A44);
}

.hero-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--secondary);
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  transition: all 0.25s ease;
}

.hero-btn-secondary:hover {
  color: var(--primary);
  background: rgba(184, 138, 68, 0.06);
}

.btn-secondary-ring {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(184, 138, 68, 0.1);
  color: var(--primary);
  transition: all 0.25s ease;
}

.hero-btn-secondary:hover .btn-secondary-ring {
  background: var(--primary);
  color: #fff;
}

/* ========== Search Bar ========== */
.hero-search {
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.5rem 0.5rem 1.125rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(184, 138, 68, 0.2);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    0 4px 24px rgba(184, 138, 68, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  max-width: 480px;
}

.search-box:focus-within {
  border-color: var(--primary);
  background: #ffffff;
  box-shadow:
    0 0 0 4px rgba(184, 138, 68, 0.12),
    0 6px 28px rgba(184, 138, 68, 0.12);
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
  color: #a0a0a0;
}

.search-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), #C49A5A);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.25s;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(184, 138, 68, 0.25);
}

.search-btn:hover {
  transform: scale(1.06);
  background: linear-gradient(135deg, #A7772F, #B88A44);
  box-shadow: 0 4px 14px rgba(184, 138, 68, 0.35);
}

.popular-tags {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.875rem;
  flex-wrap: wrap;
}

.tags-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.tag-chip {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.25rem 0.8rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  color: var(--secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(184, 138, 68, 0.12);
}

.tag-chip:hover {
  background: rgba(184, 138, 68, 0.12);
  color: var(--primary);
  border-color: rgba(184, 138, 68, 0.28);
  transform: translateY(-1px);
}

/* ========== Trust Items ========== */
.hero-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem 1.5rem;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.trust-icon {
  font-size: 0.875rem;
  color: var(--primary);
}

.trust-label {
  font-size: 0.725rem;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}

/* ========== Right Visual Showcase ========== */
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
    padding: 2rem 0;
  }
}

.visual-wrapper {
  position: relative;
  width: 100%;
  max-width: 440px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
  will-change: transform;
}

.visual-glow-bg {
  position: absolute;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 169, 110, 0.25), rgba(184, 138, 68, 0.1) 45%, transparent 70%);
  animation: pulseGlow 5s ease-in-out infinite;
  filter: blur(30px);
}

.visual-glow-secondary {
  position: absolute;
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(246, 231, 193, 0.35), transparent 65%);
  animation: pulseGlow 5s ease-in-out infinite reverse;
  filter: blur(25px);
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(0.95); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 0.9; }
}

/* Perfume Showcase Card */
.perfume-showcase-card {
  position: relative;
  width: 300px;
  height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

@media (min-width: 640px) {
  .perfume-showcase-card {
    width: 340px;
    height: 420px;
  }
}

.showcase-ring {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  border: 1px solid rgba(184, 138, 68, 0.15);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
  backdrop-filter: blur(4px);
  box-shadow:
    0 0 60px rgba(184, 138, 68, 0.08),
    inset 0 0 40px rgba(184, 138, 68, 0.04);
  animation: ringPulse 6s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

.bottle-image-wrap {
  position: relative;
  width: 250px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bottleFloat 6s ease-in-out infinite;
  z-index: 2;
}

@media (min-width: 640px) {
  .bottle-image-wrap {
    width: 280px;
    height: 360px;
  }
}

@keyframes bottleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.bottle-hero-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 20px 30px rgba(184, 138, 68, 0.25)) drop-shadow(0 8px 12px rgba(0, 0, 0, 0.08));
  border-radius: 20px;
  transition: transform 0.3s ease;
}

.glass-light-flare {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(255,255,255,0.05) 100%);
  pointer-events: none;
}

/* Pedestal Platform */
.pedestal-platform {
  position: absolute;
  bottom: 10px;
  width: 260px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.pedestal-glass {
  width: 100%;
  height: 14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(184, 138, 68, 0.2);
  box-shadow:
    0 10px 25px rgba(184, 138, 68, 0.2),
    0 2px 6px rgba(0, 0, 0, 0.05);
}

.pedestal-glow {
  position: absolute;
  width: 80%;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(184, 138, 68, 0.3), transparent 70%);
  filter: blur(6px);
}

/* ========== Floating Info Cards ========== */
.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.95rem;
  border-radius: 16px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 10px 32px rgba(0, 0, 0, 0.07),
    0 2px 6px rgba(184, 138, 68, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: cardFloat 5s ease-in-out infinite;
  white-space: nowrap;
  z-index: 3;
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.float-card-icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.float-card-text {
  line-height: 1.25;
}

.float-card-value {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text);
  margin: 0;
}

.float-card-label {
  font-size: 0.625rem;
  color: var(--text-muted);
  margin: 1px 0 0;
}

.card-rating {
  top: 10px;
  right: -20px;
  animation-delay: 0s;
}

.card-rating .float-card-icon {
  background: rgba(184, 138, 68, 0.12);
  color: var(--primary);
}

.card-sales {
  top: 22%;
  left: -40px;
  animation-delay: 0.8s;
}

.card-sales .float-card-icon {
  background: rgba(231, 76, 60, 0.1);
  color: #E74C3C;
}

.card-delivery {
  bottom: 12%;
  right: -25px;
  animation-delay: 1.6s;
}

.card-delivery .float-card-icon {
  background: rgba(46, 139, 87, 0.1);
  color: #2E8B57;
}

.card-authentic {
  bottom: 0%;
  left: -30px;
  animation-delay: 2.4s;
}

.card-authentic .float-card-icon {
  background: rgba(184, 138, 68, 0.12);
  color: var(--primary);
}

.float-badge {
  position: absolute;
  padding: 0.55rem 0.95rem;
  border-radius: 14px;
  text-align: center;
  animation: cardFloat 5s ease-in-out infinite;
  animation-delay: 3.2s;
  z-index: 3;
}

.badge-discount {
  top: 6%;
  left: -35px;
  background: linear-gradient(135deg, var(--primary), #C49A5A);
  box-shadow:
    0 6px 20px rgba(184, 138, 68, 0.35),
    0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.discount-pct {
  display: block;
  font-size: 0.75rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
}

.discount-sub {
  display: block;
  font-size: 0.55rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 1023px) {
  .card-sales, .card-authentic {
    display: none;
  }

  .card-rating {
    top: -5px;
    right: 0;
  }

  .card-delivery {
    bottom: 5%;
    right: 0;
  }
}

@media (max-width: 639px) {
  .float-card {
    padding: 0.4rem 0.7rem;
  }

  .float-card-icon {
    width: 1.35rem;
    height: 1.35rem;
    font-size: 0.7rem;
  }

  .card-delivery {
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
