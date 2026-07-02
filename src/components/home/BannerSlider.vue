<template>
  <section class="banner-slider">
    <div class="banner-bg-glow" />
    <div class="banner-bg-glow banner-bg-glow--bottom" />

    <div class="banner-container">
      <div class="slider-frame">
        <div
          class="slider-track"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div
            v-for="(slide, idx) in slides"
            :key="idx"
            class="slider-slide"
          >
            <div class="slide-inner" :class="slide.bgClass">
              <div class="slide-decorations">
                <div v-for="(deco, di) in slide.decorations" :key="di" class="slide-deco" :class="deco" />
              </div>

              <div class="slide-content">
                <div class="slide-text">
                  <div
                    class="slide-tag"
                    :class="slide.tagClass"
                  >
                    <i :class="slide.tagIcon" aria-hidden="true" />
                    {{ slide.tag }}
                  </div>

                  <h2 class="slide-title">
                    <template v-for="(part, pi) in slide.titleParts" :key="pi">
                      <span v-if="part.highlight" class="slide-title-highlight">{{ part.text }}</span>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </h2>

                  <p class="slide-desc">{{ slide.description }}</p>

                  <RouterLink
                    :to="slide.ctaTo"
                    class="btn-primary slide-cta"
                  >
                    {{ slide.cta }}
                    <i class="ti ti-arrow-right" aria-hidden="true" />
                  </RouterLink>
                </div>

                <div class="slide-visual">
                  <div class="visual-wrapper">
                    <div class="visual-glow" :class="slide.glowClass" />
                    <div class="visual-bottle-wrap" :class="slide.visualBgClass">
                      <div class="visual-bottle" :class="slide.bottleClass">
                        <span class="visual-brand">{{ $t('banner.brandText') }}</span>
                      </div>
                    </div>

                    <div class="visual-badge">
                      <div class="badge-icon-wrap" :class="slide.badgeIconBgClass">
                        <i :class="slide.badgeIcon" aria-hidden="true" />
                      </div>
                      <div>
                        <p class="badge-title">{{ slide.badgeTitle }}</p>
                        <p class="badge-sub">{{ slide.badgeSub }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="slider-dots">
        <button
          v-for="(_, idx) in slides"
          :key="idx"
          @click="goTo(idx)"
          class="dot"
          :class="{ 'dot-active': idx === currentIndex }"
          :aria-label="$t('banner.goToSlide', { n: idx + 1 })"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface SlidePart {
  text: string
  highlight?: boolean
}

interface Slide {
  tag: string
  tagIcon: string
  tagClass: string
  titleParts: SlidePart[]
  description: string
  cta: string
  ctaTo: string
  ctaClass: string
  bgClass: string
  decorations: string[]
  glowClass?: string
  visualBgClass?: string
  bottleClass?: string
  badgeIconBgClass?: string
  badgeIcon?: string
  badgeTitle?: string
  badgeSub?: string
}

const slides = computed<Slide[]>(() => [
  {
    tag: t('banner.limitedOffer'),
    tagIcon: 'ti ti-tag',
    tagClass: 'tag-gold',
    titleParts: [
      { text: t('banner.get'), highlight: false },
      { text: t('banner.percentOff'), highlight: true },
      { text: t('banner.onFirstOrder'), highlight: false },
    ],
    description: t('banner.slide1Desc'),
    cta: t('banner.claimOffer'),
    ctaTo: '/products',
    ctaClass: 'btn-primary',
    bgClass: 'slide-bg-warm',
    decorations: [
      'deco-top-left',
      'deco-bottom-right',
    ],
    glowClass: 'glow-gold',
    visualBgClass: 'visual-bg-warm',
    bottleClass: 'bottle-gold',
    badgeIconBgClass: 'badge-bg-gold',
    badgeIcon: 'ti ti-star-filled text-gold',
    badgeTitle: t('banner.badgeTitle1'),
    badgeSub: t('banner.badgeSub1'),
  },
  {
    tag: t('banner.newArrivals'),
    tagIcon: 'ti ti-sparkles',
    tagClass: 'tag-gold',
    titleParts: [
      { text: t('banner.freshScents'), highlight: false },
      { text: t('banner.justLanded'), highlight: true },
    ],
    description: t('banner.slide2Desc'),
    cta: t('banner.shopNewArrivals'),
    ctaTo: '/products?sort=newest',
    ctaClass: 'btn-primary',
    bgClass: 'slide-bg-warm',
    decorations: [
      'deco-top-right',
      'deco-bottom-left',
    ],
    glowClass: 'glow-gold-light',
    visualBgClass: 'visual-bg-warm',
    bottleClass: 'bottle-gold',
    badgeIconBgClass: 'badge-bg-gold',
    badgeIcon: 'ti ti-sparkles text-gold',
    badgeTitle: t('banner.badgeTitle2'),
    badgeSub: t('banner.badgeSub2'),
  },
  {
    tag: t('banner.freeShipping'),
    tagIcon: 'ti ti-truck',
    tagClass: 'tag-gold',
    titleParts: [
      { text: t('banner.freeShippingTitle'), highlight: true },
      { text: t('banner.onOrdersOver'), highlight: false },
    ],
    description: t('banner.slide3Desc'),
    cta: t('banner.startShopping'),
    ctaTo: '/products',
    ctaClass: 'btn-primary',
    bgClass: 'slide-bg-warm',
    decorations: [
      'deco-top-left-lg',
      'deco-bottom-center',
    ],
  },
])

const currentIndex = ref(0)
let autoTimer: ReturnType<typeof setInterval> | null = null

function goTo(idx: number) {
  currentIndex.value = idx
  resetAutoPlay()
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
  resetAutoPlay()
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
  resetAutoPlay()
}

function startAutoPlay() {
  autoTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.value.length
  }, 6000)
}

function resetAutoPlay() {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = null
  }
  startAutoPlay()
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
})
</script>

<style scoped>
.banner-slider {
  position: relative;
  overflow: hidden;
  background: var(--background);
}

.banner-bg-glow {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.banner-bg-glow::before {
  content: '';
  position: absolute;
  top: -96px;
  right: -96px;
  width: 384px;
  height: 384px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(184,138,68,0.08), transparent 70%);
}

.banner-bg-glow--bottom::before {
  top: auto;
  right: auto;
  bottom: -64px;
  left: -64px;
  width: 320px;
  height: 320px;
}

.banner-container {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px 56px;
}

@media (min-width: 768px) {
  .banner-container {
    padding: 80px 24px 64px;
  }
}

.slider-frame {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
}

.slider-track {
  display: flex;
  transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slider-slide {
  width: 100%;
  flex-shrink: 0;
}

.slide-inner {
  border-radius: var(--radius);
  overflow: hidden;
  position: relative;
}

.slide-bg-warm {
  background: linear-gradient(135deg, #F8F5F0, #F2EDE6, #EDE7DE);
}

.slide-decorations {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.slide-deco {
  position: absolute;
  border-radius: 50%;
}

.deco-top-left {
  top: -48px;
  left: -48px;
  width: 192px;
  height: 192px;
  background: rgba(184,138,68,0.08);
}

.deco-bottom-right {
  bottom: -32px;
  right: 25%;
  width: 256px;
  height: 256px;
  background: rgba(196,154,90,0.06);
}

.deco-top-right {
  top: -64px;
  right: -64px;
  width: 224px;
  height: 224px;
  background: rgba(184,138,68,0.06);
}

.deco-bottom-left {
  bottom: -48px;
  left: -48px;
  width: 288px;
  height: 288px;
  background: rgba(196,154,90,0.05);
}

.deco-top-left-lg {
  top: -80px;
  left: -80px;
  width: 320px;
  height: 320px;
  background: rgba(184,138,68,0.06);
}

.deco-bottom-center {
  bottom: -40px;
  right: 33%;
  width: 240px;
  height: 240px;
  background: rgba(196,154,90,0.05);
}

.slide-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 32px 24px;
}

@media (min-width: 768px) {
  .slide-content {
    flex-direction: row;
    padding: 56px 56px;
  }
}

.slide-text {
  flex: 1;
}

.slide-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.tag-gold {
  background: rgba(184,138,68,0.1);
  color: var(--primary);
}

.slide-title {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 900;
  line-height: 1.2;
  color: var(--text);
  margin: 0 0 16px;
}

@media (min-width: 768px) {
  .slide-title {
    font-size: 42px;
  }
}

@media (min-width: 1024px) {
  .slide-title {
    font-size: 48px;
  }
}

.slide-title-highlight {
  color: var(--primary);
}

.slide-desc {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0 0 24px;
  max-width: 480px;
}

.slide-cta {
  width: fit-content;
}

.slide-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-wrapper {
  position: relative;
  width: 192px;
  height: 224px;
}

@media (min-width: 768px) {
  .visual-wrapper {
    width: 224px;
    height: 288px;
  }
}

.visual-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  filter: blur(64px);
  transform: scale(1.1);
}

.glow-gold {
  background: rgba(184,138,68,0.15);
}

.glow-gold-light {
  background: rgba(184,138,68,0.1);
}

.visual-bottle-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.visual-bg-warm {
  background: linear-gradient(to bottom, #EDE7DE, #E3DACF);
}

.visual-bottle {
  width: 96px;
  height: 160px;
  border-top-left-radius: 100%;
  border-top-right-radius: 100%;
  border-bottom-left-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.2);
}

@media (min-width: 768px) {
  .visual-bottle {
    width: 112px;
    height: 192px;
  }
}

.bottle-gold {
  background: linear-gradient(to bottom, #C49A5A, var(--primary), #8E6F3E);
}

.visual-brand {
  color: rgba(255,255,255,0.5);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.visual-badge {
  position: absolute;
  right: -12px;
  top: 24px;
  background: var(--surface);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 16px rgba(184,138,68,0.12);
  border: 1px solid var(--border);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-bg-gold {
  background: rgba(184,138,68,0.1);
}

.text-gold {
  color: var(--primary);
}

.badge-title {
  font-size: 12px;
  font-weight: 900;
  color: var(--text);
  margin: 0;
}

.badge-sub {
  font-size: 10px;
  color: var(--text-muted);
  margin: 0;
}

.slider-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.dot {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  border: none;
  cursor: pointer;
  background: var(--primary);
  opacity: 0.35;
  transition: all 0.3s ease;
  padding: 0;
}

.dot:hover {
  opacity: 0.6;
}

.dot-active {
  width: 32px;
  border-radius: 100px;
  opacity: 1;
  background: linear-gradient(90deg, var(--primary), #C49A5A);
}
</style>
