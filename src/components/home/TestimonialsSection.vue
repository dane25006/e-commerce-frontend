<template>
  <section class="py-16 bg-gradient-to-br from-purple-50 to-violet-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <span class="section-label block mb-2">What Our Customers Say</span>
        <h2 class="text-3xl md:text-4xl font-black text-gray-900">Loved by Thousands</h2>
      </div>

      <div class="relative overflow-hidden">
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
        >
          <div
            v-for="(group, gi) in testimonialGroups"
            :key="gi"
            class="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6 px-1"
          >
            <div
              v-for="t in group"
              :key="t.name"
              class="card-luxury p-6 relative"
            >
              <!-- Quote icon -->
              <div class="absolute top-5 right-5 w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                <i class="ti ti-quote text-purple-400 text-sm" aria-hidden="true" />
              </div>

              <!-- Stars -->
              <div class="flex mb-3">
                <i v-for="n in 5" :key="n" class="ti ti-star-filled text-sm text-amber-400" aria-hidden="true" />
              </div>

              <p class="text-sm text-gray-700 leading-relaxed mb-4 italic">"{{ t.text }}"</p>

              <!-- Author -->
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {{ t.name.charAt(0) }}
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">{{ t.name }}</p>
                  <p class="text-xs text-purple-500">{{ t.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination dots -->
      <div class="flex items-center justify-center gap-2 mt-8">
        <button
          v-for="(_, i) in testimonialGroups"
          :key="i"
          @click="activeIndex = i"
          class="rounded-full transition-all duration-300"
          :class="activeIndex === i ? 'w-8 h-2.5 bg-purple-600' : 'w-2.5 h-2.5 bg-purple-200 hover:bg-purple-400'"
          :aria-label="`Go to slide ${i + 1}`"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const testimonials = [
  { name: 'Olivia M.', title: 'Verified Buyer', text: 'The best perfumes I\'ve ever used! Long-lasting and absolutely worth it.' },
  { name: 'James T.', title: 'Verified Buyer', text: 'Elegant packaging and amazing fragrance. Highly recommended!' },
  { name: 'Sophia L.', title: 'Verified Buyer', text: 'Scentique has become my go-to brand for every occasion.' },
  { name: 'Emma R.', title: 'Verified Buyer', text: 'I\'ve tried many luxury fragrances but Scentique is by far the best value.' },
  { name: 'Daniel K.', title: 'Verified Buyer', text: 'Fast shipping, beautiful bottle, and the scent lasts all day. 5 stars!' },
  { name: 'Amara P.', title: 'Verified Buyer', text: 'I gifted this to my friend and she absolutely loved it. Will order again.' },
]

// Group into sets of 3
const testimonialGroups = [
  testimonials.slice(0, 3),
  testimonials.slice(3, 6),
]

const activeIndex = ref(0)
let autoplay: ReturnType<typeof setInterval>

onMounted(() => {
  autoplay = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % testimonialGroups.length
  }, 5000)
})
onUnmounted(() => clearInterval(autoplay))
</script>
