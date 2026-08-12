<template>
  <section class="page-banner-section">
    <!-- Background Image Layer -->
    <div
      class="banner-bg-image"
      :style="bgStyle"
    />

    <!-- Dark Overlay Layer -->
    <div
      class="banner-overlay"
      :style="{ opacity: overlayOpacity }"
    />

    <!-- Ambient Luxury Gold Aura -->
    <div class="banner-gold-aura" />

    <!-- Content Container -->
    <div class="banner-container" :class="`align-${textAlign}`">
      <!-- Badge -->
      <div v-if="displayBadge" class="banner-badge-wrap fade-in-up">
        <span class="banner-badge">
          <i class="ti ti-sparkles" aria-hidden="true" />
          {{ displayBadge }}
        </span>
      </div>

      <!-- Title -->
      <h1 class="banner-title fade-in-up" style="animation-delay: 0.1s;">
        {{ displayTitle }}
      </h1>

      <!-- Subtitle or Count -->
      <p v-if="displaySubtitle" class="banner-subtitle fade-in-up" style="animation-delay: 0.18s;">
        {{ displaySubtitle }}
      </p>
      <p v-else-if="count !== undefined && count !== null" class="banner-count fade-in-up" style="animation-delay: 0.18s;">
        {{ countLabel || `${count} premium scents available` }}
      </p>

      <!-- Optional CTA -->
      <div v-if="banner?.cta_text && banner?.cta_link" class="banner-cta fade-in-up" style="animation-delay: 0.25s;">
        <RouterLink :to="banner.cta_link" class="banner-btn">
          {{ banner.cta_text }}
          <i class="ti ti-arrow-right" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useBannerStore } from '@/stores/banner'
import type { Banner } from '@/types/banner'

const props = withDefaults(
  defineProps<{
    placement: string
    defaultTitle: string
    defaultBadge?: string
    defaultSubtitle?: string
    count?: number | null
    countLabel?: string
  }>(),
  {
    defaultBadge: 'EXCLUSIVE COLLECTION',
    defaultSubtitle: '',
    count: null,
    countLabel: '',
  }
)

const bannerStore = useBannerStore()
const banner = ref<Banner | null>(null)

onMounted(async () => {
  banner.value = await bannerStore.fetchBannerByPlacement(props.placement)
})

const displayTitle = computed(() => {
  return banner.value?.title || props.defaultTitle
})

const displayBadge = computed(() => {
  if (banner.value) {
    return banner.value.badge || ''
  }
  return props.defaultBadge
})

const displaySubtitle = computed(() => {
  if (banner.value?.subtitle) {
    return banner.value.subtitle
  }
  if (props.defaultSubtitle) {
    return props.defaultSubtitle
  }
  return ''
})

const textAlign = computed(() => {
  return banner.value?.text_align || 'center'
})

const overlayOpacity = computed(() => {
  return banner.value?.overlay_opacity ?? 0.65
})

const bgStyle = computed(() => {
  if (banner.value?.image) {
    return {
      backgroundImage: `url('${banner.value.image}')`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }
  }
  return {
    background: 'radial-gradient(ellipse 70% 50% at 50% 50%, #2A211C 0%, #191412 100%)',
  }
})
</script>

<style scoped>
.page-banner-section {
  position: relative;
  overflow: hidden;
  padding: 4.5rem 1.5rem;
  background-color: #171311;
  border-bottom: 1px solid rgba(184, 138, 68, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}

@media (min-width: 768px) {
  .page-banner-section {
    padding: 5.5rem 2rem;
    min-height: 260px;
  }
}

/* Background Image */
.banner-bg-image {
  position: absolute;
  inset: 0;
  z-index: 0;
  transition: transform 0.6s ease;
}

.page-banner-section:hover .banner-bg-image {
  transform: scale(1.02);
}

/* Dark Gradient Vignette Overlay */
.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 12, 10, 0.85) 0%,
    rgba(20, 16, 14, 0.65) 50%,
    rgba(15, 12, 10, 0.9) 100%
  );
  z-index: 1;
  transition: opacity 0.3s ease;
}

/* Subtle Gold Ambient Spotlight */
.banner-gold-aura {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 45%, rgba(212, 175, 55, 0.12) 0%, transparent 65%);
  pointer-events: none;
  z-index: 1;
}

/* Content */
.banner-container {
  position: relative;
  z-index: 2;
  max-width: 800px;
  width: 100%;
}

.banner-container.align-center {
  text-align: center;
  margin: 0 auto;
}

.banner-container.align-left {
  text-align: left;
  margin-right: auto;
}

.banner-container.align-right {
  text-align: right;
  margin-left: auto;
}

/* Badge */
.banner-badge-wrap {
  margin-bottom: 0.875rem;
}

.banner-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  background: rgba(184, 138, 68, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #E6CA85;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.banner-badge i {
  font-size: 0.75rem;
}

/* Title */
.banner-title {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1.15;
  margin: 0 0 0.625rem;
  letter-spacing: -0.01em;
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
}

/* Subtitle & Count */
.banner-subtitle {
  font-size: clamp(0.85rem, 1.8vw, 1rem);
  color: rgba(240, 235, 227, 0.85);
  font-weight: 300;
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.align-center .banner-subtitle {
  margin-left: auto;
  margin-right: auto;
}

.banner-count {
  font-size: 0.875rem;
  color: rgba(212, 175, 55, 0.9);
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

/* Optional CTA */
.banner-cta {
  margin-top: 1.25rem;
}

.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #B88A44, #D4AF37);
  color: #FFFFFF;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(184, 138, 68, 0.4);
  transition: all 0.25s ease;
}

.banner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(184, 138, 68, 0.55);
}

/* Animations */
.fade-in-up {
  opacity: 0;
  transform: translateY(14px);
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
