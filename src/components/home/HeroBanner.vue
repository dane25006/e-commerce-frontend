<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50" style="min-height: 520px;">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-fuchsia-100/20 rounded-full blur-3xl" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div class="flex flex-col md:flex-row items-center gap-12">

        <!-- Left Content -->
        <div class="md:w-1/2 text-center md:text-left slide-up">
          <span class="inline-block section-label mb-4">
            ✦ Dare to be Unforgettable
          </span>

          <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            Fragrance That<br />
            Defines <em class="text-gradient not-italic">You</em>
          </h1>

          <p class="text-base md:text-lg text-gray-500 leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            Discover luxury scents crafted with passion to leave a lasting impression.
          </p>

          <div class="flex items-center gap-4 justify-center md:justify-start">
            <RouterLink to="/products" class="btn-primary flex items-center gap-2 text-sm py-3 px-6">
              Shop Now
              <i class="ti ti-arrow-right" aria-hidden="true" />
            </RouterLink>

            <button
              @click="scrollToFeatured"
              class="flex items-center gap-2.5 text-sm font-semibold text-gray-700 hover:text-purple-700 transition"
            >
              <div class="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-purple-400 flex items-center justify-center transition">
                <i class="ti ti-player-play-filled text-sm text-gray-500" aria-hidden="true" />
              </div>
              Watch Video
            </button>
          </div>

          <!-- Trust badges -->
          <div class="flex items-center gap-6 mt-10 justify-center md:justify-start">
            <div v-for="badge in badges" :key="badge.label" class="flex items-center gap-1.5">
              <i :class="badge.icon" class="text-purple-500" aria-hidden="true" />
              <span class="text-xs text-gray-500 font-medium">{{ badge.label }}</span>
            </div>
          </div>
        </div>

        <!-- Right Image Area -->
        <div class="md:w-1/2 flex items-center justify-center fade-in">
          <div class="relative w-72 h-72 md:w-96 md:h-96">
            <!-- Glow -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-300/40 to-violet-400/30 rounded-full blur-3xl scale-110" />

            <!-- Main circle background -->
            <div class="absolute inset-0 bg-gradient-to-br from-purple-100 to-violet-200 rounded-full" />

            <!-- Decorative circles -->
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-purple-200/60 rounded-full blur-sm" />
            <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-violet-200/60 rounded-full blur-sm" />
            <div class="absolute top-1/4 -left-8 w-12 h-12 bg-fuchsia-200/80 rounded-full" />

            <!-- Perfume bottle placeholder -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-32 h-48 md:w-40 md:h-56 bg-gradient-to-b from-purple-300 via-violet-400 to-purple-600 rounded-t-full rounded-b-2xl mx-auto shadow-2xl shadow-purple-400/40 flex items-end justify-center pb-4">
                  <span class="text-white/80 text-xs font-bold tracking-widest uppercase">Scentique</span>
                </div>
                <!-- Bottle cap -->
                <div class="-mt-2 w-10 h-6 md:w-12 md:h-8 bg-gray-900 rounded-t-lg mx-auto" />
              </div>
            </div>

            <!-- Floating flowers (decorative) -->
            <div class="absolute top-4 right-8 text-2xl" aria-hidden="true">🌸</div>
            <div class="absolute bottom-8 right-4 text-xl" aria-hidden="true">🌺</div>
            <div class="absolute top-1/3 left-2 text-lg" aria-hidden="true">✦</div>

            <!-- Badge -->
            <div class="absolute -right-4 top-1/4 bg-white rounded-2xl shadow-lg shadow-purple-200/40 px-4 py-3 border border-purple-100">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                  <i class="ti ti-star-filled text-amber-400 text-sm" aria-hidden="true" />
                </div>
                <div>
                  <p class="text-xs font-black text-gray-900">4.9/5</p>
                  <p class="text-[10px] text-gray-400">2k+ reviews</p>
                </div>
              </div>
            </div>

            <div class="absolute -left-6 bottom-1/4 bg-white rounded-2xl shadow-lg shadow-purple-200/40 px-3 py-2 border border-purple-100">
              <div class="flex items-center gap-1.5">
                <i class="ti ti-truck text-purple-500 text-sm" aria-hidden="true" />
                <div>
                  <p class="text-[10px] font-bold text-gray-900">Free Ship</p>
                  <p class="text-[9px] text-gray-400">On $100+</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const badges = [
  { icon: 'ti ti-award', label: 'Premium Quality' },
  { icon: 'ti ti-leaf', label: 'Cruelty Free' },
  { icon: 'ti ti-shield-check', label: 'Secure Payment' },
]

function scrollToFeatured() {
  document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
