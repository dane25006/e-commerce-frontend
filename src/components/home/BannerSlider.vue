<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50">
    <!-- Background blur decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div class="absolute -bottom-16 -left-16 w-80 h-80 bg-violet-200/40 rounded-full blur-3xl" />
      <div class="absolute top-1/3 left-1/3 w-64 h-64 bg-fuchsia-100/20 rounded-full blur-3xl" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <!-- Slides container -->
      <div class="relative overflow-hidden rounded-3xl">
        <div
          class="flex transition-transform duration-700 ease-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div
            v-for="(slide, idx) in slides"
            :key="idx"
            class="w-full flex-shrink-0"
          >
            <div
              class="rounded-3xl overflow-hidden relative"
              :class="slide.bgClass"
            >
              <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  v-for="(deco, di) in slide.decorations"
                  :key="di"
                  class="absolute rounded-full blur-2xl"
                  :class="deco"
                />
              </div>

              <div class="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-14">
                <!-- Text Content -->
                <div :class="slide.image ? 'md:w-3/5' : 'md:w-full text-center'">
                  <div
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                    :class="slide.tagClass"
                  >
                    <i :class="slide.tagIcon" aria-hidden="true" />
                    {{ slide.tag }}
                  </div>

                  <h2
                    class="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4"
                    :class="slide.titleClass"
                  >
                    <span v-for="(part, pi) in slide.titleParts" :key="pi">
                      <span v-if="part.highlight" class="text-gradient">{{ part.text }}</span>
                      <span v-else>{{ part.text }}</span>
                    </span>
                  </h2>

                  <p class="text-base md:text-lg mb-6 max-w-lg" :class="slide.descClass">
                    {{ slide.description }}
                  </p>

                  <div v-if="slide.code" class="mb-6">
                    <span class="text-sm font-medium" :class="slide.codeLabelClass">
                      Use code
                    </span>
                    <span
                      class="font-black px-3 py-1 rounded-lg ml-1"
                      :class="slide.codeClass"
                    >
                      {{ slide.code }}
                    </span>
                  </div>

                  <RouterLink
                    :to="slide.ctaTo"
                    class="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all"
                    :class="slide.ctaClass"
                  >
                    {{ slide.cta }}
                    <i class="ti ti-arrow-right" aria-hidden="true" />
                  </RouterLink>
                </div>

                <!-- Visual (optional) -->
                <div v-if="slide.image" class="md:w-2/5 flex items-center justify-center">
                  <div class="relative w-48 h-56 md:w-56 md:h-72">
                    <div
                      class="absolute inset-0 rounded-full blur-2xl scale-110"
                      :class="slide.glowClass"
                    />
                    <div
                      class="relative w-full h-full rounded-2xl flex items-end justify-center overflow-hidden"
                      :class="slide.visualBgClass"
                    >
                      <div class="w-24 h-40 md:w-28 md:h-48 rounded-t-full rounded-b-2xl flex items-end justify-center pb-3 shadow-2xl"
                        :class="slide.bottleClass"
                      >
                        <span class="text-white/60 text-[8px] font-bold tracking-widest uppercase">SCENTIQUE</span>
                      </div>
                    </div>

                    <!-- Floating badges -->
                    <div
                      class="absolute -right-3 top-6 bg-white rounded-2xl shadow-lg px-3 py-2 border"
                      :class="slide.badgeBorderClass"
                    >
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-xl flex items-center justify-center" :class="slide.badgeIconBgClass">
                          <i :class="slide.badgeIcon" class="text-sm" aria-hidden="true" />
                        </div>
                        <div>
                          <p class="text-xs font-black text-gray-900">{{ slide.badgeTitle }}</p>
                          <p class="text-[10px] text-gray-400">{{ slide.badgeSub }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicators -->
      <div class="flex items-center justify-center gap-2 mt-6">
        <button
          v-for="(_, idx) in slides"
          :key="idx"
          @click="goTo(idx)"
          class="transition-all duration-300 rounded-full"
          :class="idx === currentIndex
            ? 'w-8 h-2.5 bg-gradient-to-r from-purple-500 to-violet-500'
            : 'w-2.5 h-2.5 bg-purple-200 hover:bg-purple-300'"
          :aria-label="`Go to slide ${idx + 1}`"
        />
      </div>

      <!-- Arrows -->
      <button
        @click="prev"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-purple-100 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <i class="ti ti-chevron-left" aria-hidden="true" />
      </button>
      <button
        @click="next"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-purple-100 flex items-center justify-center text-gray-600 hover:text-purple-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <i class="ti ti-chevron-right" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface SlidePart {
  text: string
  highlight?: boolean
}

interface Slide {
  tag: string
  tagIcon: string
  tagClass: string
  titleParts: SlidePart[]
  titleClass: string
  description: string
  descClass: string
  code?: string
  codeLabelClass?: string
  codeClass?: string
  cta: string
  ctaTo: string
  ctaClass: string
  image?: boolean
  bgClass: string
  decorations: string[]
  glowClass?: string
  visualBgClass?: string
  bottleClass?: string
  badgeBorderClass?: string
  badgeIconBgClass?: string
  badgeIcon?: string
  badgeTitle?: string
  badgeSub?: string
}

const slides: Slide[] = [
  {
    tag: 'Limited Time Offer',
    tagIcon: 'ti ti-tag',
    tagClass: 'bg-amber-100 text-amber-700',
    titleParts: [
      { text: 'Get ', highlight: false },
      { text: '15% Off', highlight: true },
      { text: ' On Your First Order', highlight: false },
    ],
    titleClass: 'text-gray-900',
    description: 'Discover luxury scents crafted with passion. Use the code below and treat yourself to something unforgettable.',
    descClass: 'text-gray-600',
    code: 'WELCOME15',
    codeLabelClass: 'text-gray-500',
    codeClass: 'bg-purple-100 text-purple-700',
    cta: 'Claim Offer',
    ctaTo: '/products',
    ctaClass: 'btn-primary',
    image: true,
    bgClass: 'bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50',
    decorations: [
      '-top-12 -left-12 w-48 h-48 bg-purple-300/20',
      '-bottom-8 right-1/4 w-64 h-64 bg-violet-300/20',
    ],
    glowClass: 'bg-purple-300/40',
    visualBgClass: 'bg-gradient-to-b from-purple-100 to-violet-200',
    bottleClass: 'bg-gradient-to-b from-violet-300 via-purple-400 to-purple-700',
    badgeBorderClass: 'border-purple-100',
    badgeIconBgClass: 'bg-amber-50',
    badgeIcon: 'ti ti-star-filled text-amber-400',
    badgeTitle: '4.9/5',
    badgeSub: '2k+ reviews',
  },
  {
    tag: 'New Arrivals',
    tagIcon: 'ti ti-sparkles',
    tagClass: 'bg-blue-100 text-blue-700',
    titleParts: [
      { text: 'Fresh Scents,', highlight: false },
      { text: ' Just Landed', highlight: true },
    ],
    titleClass: 'text-gray-900',
    description: 'Be the first to experience our newest fragrance collection. Exclusive launches you won\'t find anywhere else.',
    descClass: 'text-gray-600',
    cta: 'Shop New Arrivals',
    ctaTo: '/products?sort=newest',
    ctaClass: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:from-blue-600 hover:to-indigo-600',
    image: true,
    bgClass: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50',
    decorations: [
      '-top-16 -right-16 w-56 h-56 bg-blue-200/30',
      '-bottom-12 -left-12 w-72 h-72 bg-indigo-200/20',
    ],
    glowClass: 'bg-blue-300/30',
    visualBgClass: 'bg-gradient-to-b from-blue-100 to-indigo-200',
    bottleClass: 'bg-gradient-to-b from-sky-300 via-blue-400 to-indigo-700',
    badgeBorderClass: 'border-blue-100',
    badgeIconBgClass: 'bg-blue-50',
    badgeIcon: 'ti ti-sparkles text-blue-400',
    badgeTitle: 'Just In',
    badgeSub: '12 new scents',
  },
  {
    tag: 'Free Shipping',
    tagIcon: 'ti ti-truck',
    tagClass: 'bg-green-100 text-green-700',
    titleParts: [
      { text: 'Free Shipping', highlight: true },
      { text: ' On Orders Over $100', highlight: false },
    ],
    titleClass: 'text-gray-900',
    description: 'Stock up on your favourites and enjoy complimentary shipping. No code needed — it\'s on us.',
    descClass: 'text-gray-600',
    cta: 'Start Shopping',
    ctaTo: '/products',
    ctaClass: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:from-emerald-600 hover:to-green-600',
    image: false,
    bgClass: 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50',
    decorations: [
      '-top-20 -left-20 w-80 h-80 bg-emerald-200/25',
      '-bottom-10 right-1/3 w-60 h-60 bg-teal-200/20',
    ],
  },
]

const currentIndex = ref(0)
let autoTimer: ReturnType<typeof setInterval> | null = null

function goTo(idx: number) {
  currentIndex.value = idx
  resetAutoPlay()
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % slides.length
  resetAutoPlay()
}

function prev() {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
  resetAutoPlay()
}

function startAutoPlay() {
  autoTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % slides.length
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
