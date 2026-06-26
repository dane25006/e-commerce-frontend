<template>
  <section class="py-14 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <span class="section-label">Why Choose Scentique?</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="flex flex-col items-center text-center p-4 md:p-5 rounded-2xl hover:bg-purple-50 transition-all duration-300 group cursor-default"
        >
          <div class="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-purple-200/50">
            <i :class="`ti ${feature.icon} text-xl md:text-2xl text-purple-600`" aria-hidden="true" />
          </div>
          <h3 class="text-xs md:text-sm font-bold text-gray-900 mb-1 leading-tight">{{ feature.title }}</h3>
          <p class="text-[11px] md:text-xs text-gray-500 leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  { icon: 'ti-diamond', title: 'Premium Quality', desc: 'Finest ingredients from around the world' },
  { icon: 'ti-clock', title: 'Long Lasting', desc: 'Scents that stay with you all day' },
  { icon: 'ti-leaf', title: 'Cruelty Free', desc: 'We never test on animals' },
  { icon: 'ti-shield-lock', title: 'Secure Payment', desc: '100% secure & safe checkout' },
  { icon: 'ti-refresh', title: 'Easy Returns', desc: 'Hassle-free return within 30 days' },
  { icon: 'ti-world', title: 'Worldwide Shipping', desc: 'Fast delivery to your doorstep' },
]
</script>
