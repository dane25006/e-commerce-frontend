<template>
  <div
    class="card-luxury overflow-hidden group flex flex-col"
    style="background: var(--surface); border-radius: var(--radius); box-shadow: var(--shadow-sm);"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Image -->
    <RouterLink :to="`/products/${product.id}`" class="block relative overflow-hidden image-wrap" style="background: #F8F5F0; aspect-ratio: 3/4; max-height: 360px;">
      <img
        v-if="product.image_url"
        :src="imageUrl(product.image_url)"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700"
        :class="{ 'scale-108': hovered }"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <i class="ti ti-bottle text-5xl" style="color: rgba(184,138,68,0.15);" aria-hidden="true" />
      </div>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-1.5">
        <span v-if="bestSeller" class="badge-gold">🔥 Best Seller</span>
        <span v-if="newArrival" class="badge-gold">✨ New Arrival</span>
        <span v-if="product.is_new && !newArrival" class="badge-gold">✨ New</span>
        <span v-if="product.sale_price" class="badge-dark">
          -{{ Math.round((1 - product.sale_price / product.price) * 100) }}%
        </span>
      </div>

      <!-- Wishlist -->
      <div class="absolute top-3 right-3 z-10">
        <WishlistButton :product-id="product.id" size="sm" />
      </div>

      <!-- Brand badge -->
      <div v-if="product.brand" class="absolute bottom-14 left-3">
        <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm" style="background: rgba(255,255,255,0.92); color: var(--primary); backdrop-filter: blur(6px); border: 1px solid rgba(184,138,68,0.15);">
          {{ product.brand }}
        </span>
      </div>

      <!-- Quick View -->
      <Transition name="fade">
        <div v-if="hovered" class="absolute inset-x-0 bottom-0 p-3 quick-view-overlay">
          <button
            @click.prevent="$emit('quickView', product)"
            class="w-full py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 quick-view-btn"
          >
            <i class="ti ti-eye mr-1.5" aria-hidden="true" />Quick View
          </button>
        </div>
      </Transition>

      <!-- Out of stock -->
      <div
        v-if="product.stock === 0"
        class="absolute inset-0 flex items-center justify-center" style="background: rgba(255,255,255,0.55); backdrop-filter: blur(2px);"
      >
        <span class="text-xs font-bold px-4 py-1.5 rounded-full" style="background: var(--surface); color: var(--text-muted); border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
          Out of Stock
        </span>
      </div>
    </RouterLink>

    <!-- Body -->
    <div class="p-4 flex flex-col flex-1">
      <div class="flex items-center gap-1.5 mb-1">
        <span v-if="product.type" class="text-[10px] font-medium uppercase tracking-wider" style="color: var(--primary);">{{ product.type }}</span>
        <span v-if="product.type && product.gender" class="text-[10px]" style="color: var(--border);">|</span>
        <span v-if="product.gender" class="text-[10px] font-medium" style="color: var(--text-muted);">{{ product.gender }}</span>
      </div>
      <RouterLink :to="`/products/${product.id}`">
        <h3 class="text-sm font-bold line-clamp-2 leading-snug mb-1 transition" style="color: var(--text); font-family: 'Playfair Display', serif;">
          {{ product.name }}
        </h3>
      </RouterLink>

      <!-- Rating -->
      <div v-if="product.rating_avg" class="flex items-center gap-1.5 mb-3">
        <div class="flex">
          <i v-for="n in 5" :key="n" class="ti ti-star-filled text-xs"
            :class="n <= Math.round(product.rating_avg!) ? 'text-[var(--primary)]' : 'text-[#E7E1D8]'"
            aria-hidden="true" />
        </div>
        <span class="text-xs" style="color: var(--text-muted);">({{ product.rating_count }})</span>
      </div>
      <div v-else class="mb-3" />

      <!-- Price + Cart -->
      <div class="mt-auto flex items-end justify-between gap-1.5">
        <div class="min-w-0 flex-1">
          <div v-if="product.sale_price" class="flex flex-wrap items-baseline gap-x-1.5">
            <span class="text-base sm:text-lg font-bold truncate" style="color: var(--primary);">
              {{ formatPrice(product.sale_price) }}
            </span>
            <span class="text-xs sm:text-sm line-through truncate" style="color: var(--text-muted);">
              {{ formatPrice(product.price) }}
            </span>
          </div>
          <span v-else class="text-base sm:text-lg font-bold truncate block" style="color: var(--text);">
            {{ formatPrice(product.price) }}
          </span>
        </div>

        <AddToCartButton :product="product" size="sm" class="shrink-0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { imageUrl } from '@/utils/image'
import { formatPrice } from '@/utils/price'
import type { Product } from '@/types/product'
import WishlistButton from './WishlistButton.vue'
import AddToCartButton from './AddToCartButton.vue'

defineProps<{ product: Product; bestSeller?: boolean; newArrival?: boolean }>()
defineEmits<{ quickView: [product: Product] }>()

const hovered = ref(false)
</script>

<style scoped>
.card-luxury {
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.35s ease;
}
.card-luxury:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}
.image-wrap {
  border-radius: var(--radius) var(--radius) 0 0;
}
.scale-108 {
  transform: scale(1.08);
}
.quick-view-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.quick-view-btn {
  background: var(--primary);
  color: #fff;
}
.quick-view-btn:hover {
  background: var(--primary-hover);
}
</style>
