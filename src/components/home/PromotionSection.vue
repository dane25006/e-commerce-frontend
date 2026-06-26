<template>
  <section v-if="promotions.length" class="py-14">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between mb-8">
        <div>
          <span class="section-label block mb-2">Hot Deals</span>
          <h2 class="text-3xl md:text-4xl font-black text-gray-900">
            Special Promotions
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="promo in promotions"
          :key="promo.id"
          class="card-luxury overflow-hidden group relative"
        >
          <!-- Image -->
          <div class="aspect-[16/9] overflow-hidden bg-gradient-to-br from-purple-100 to-violet-200 relative">
            <div v-if="promo.image_url" class="w-full h-full">
              <img
                :src="promo.image_url"
                :alt="promo.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div v-else class="w-full h-full flex items-center justify-center">
              <i class="ti ti-discount text-6xl text-purple-300/60" aria-hidden="true" />
            </div>
            <!-- Badge -->
            <div class="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {{ promo.discount_type === 'percentage' ? `${promo.discount_value}% OFF` : `$${promo.discount_value} OFF` }}
            </div>
            <div v-if="promo.coupon_code" class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full shadow">
              Code: {{ promo.coupon_code }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <h3 class="text-base font-bold text-gray-900 mb-1 line-clamp-1">{{ promo.title }}</h3>
            <p v-if="promo.description" class="text-sm text-gray-500 line-clamp-2 mb-3">{{ promo.description }}</p>

            <div v-if="promo.product" class="flex items-center justify-between mt-3 pt-3 border-t border-purple-100">
              <span class="text-sm text-gray-600">{{ promo.product.name }}</span>
              <span class="text-sm font-bold text-purple-700">${{ promo.product.price.toFixed(2) }}</span>
            </div>

            <!-- Countdown -->
            <div v-if="promo.ends_at" class="mt-3 pt-3 border-t border-purple-100">
              <div class="flex items-center gap-2">
                <i class="ti ti-clock text-purple-400 text-sm" aria-hidden="true" />
                <span class="text-xs text-gray-500 font-medium">Ends in</span>
                <span class="text-xs font-bold text-purple-700">{{ timeLeft(promo.ends_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Promotion } from '@/types/promotion'

defineProps<{ promotions: Promotion[] }>()

function timeLeft(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hours}h left`
  const mins = Math.floor((diff % 3600000) / 60000)
  return `${hours}h ${mins}m left`
}
</script>
