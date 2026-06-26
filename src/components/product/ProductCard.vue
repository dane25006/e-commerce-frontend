<template>
  <div
    class="card-luxury group flex flex-col overflow-hidden"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Image -->
    <RouterLink :to="`/products/${product.id}`" class="block relative overflow-hidden bg-purple-50/40" style="aspect-ratio: 3/4; max-height: 280px;">
      <img
        v-if="product.image_url"
        :src="imageUrl(product.image_url)"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-500"
        :class="{ 'scale-108': hovered }"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <i class="ti ti-bottle text-5xl text-purple-200" aria-hidden="true" />
      </div>

      <!-- Wishlist Button -->
      <div class="absolute top-3 right-3">
        <WishlistButton :product-id="product.id" size="sm" />
      </div>

      <!-- Category Badge -->
      <div v-if="product.category" class="absolute top-3 left-3">
        <span class="text-[10px] font-semibold text-purple-700 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-purple-100">
          {{ product.category.name }}
        </span>
      </div>

      <!-- Quick View Overlay -->
      <Transition name="fade">
        <div v-if="hovered" class="absolute inset-x-0 bottom-0 p-3">
          <button
            @click.prevent="$emit('quickView', product)"
            class="w-full py-2 text-xs font-semibold text-purple-700 bg-white/90 backdrop-blur-sm rounded-xl border border-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-200"
          >
            <i class="ti ti-eye mr-1.5" aria-hidden="true" />Quick View
          </button>
        </div>
      </Transition>

      <!-- Out of stock overlay -->
      <div
        v-if="product.stock === 0"
        class="absolute inset-0 bg-white/60 flex items-center justify-center"
      >
        <span class="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
          Out of Stock
        </span>
      </div>
    </RouterLink>

    <!-- Body -->
    <div class="p-4 flex flex-col flex-1">
      <RouterLink :to="`/products/${product.id}`">
        <h3 class="text-sm font-bold text-gray-900 hover:text-purple-700 transition line-clamp-2 leading-snug mb-1">
          {{ product.name }}
        </h3>
      </RouterLink>

      <!-- Rating -->
      <div v-if="product.rating_avg" class="flex items-center gap-1.5 mb-3">
        <div class="flex">
          <i
            v-for="n in 5"
            :key="n"
            class="ti ti-star-filled text-xs"
            :class="n <= Math.round(product.rating_avg!) ? 'text-amber-400' : 'text-gray-200'"
            aria-hidden="true"
          />
        </div>
        <span class="text-xs text-gray-400">({{ product.rating_count }})</span>
      </div>
      <div v-else class="mb-3" />

      <!-- Price + Cart -->
      <div class="mt-auto flex items-center justify-between gap-2">
        <span class="text-lg font-bold text-gray-900">
          ${{ product.price.toFixed(2) }}
        </span>

        <button
          v-if="product.stock > 0"
          @click.prevent="handleAddToCart"
          :disabled="adding || !auth.isLoggedIn"
          class="flex items-center gap-1.5 btn-primary text-xs px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          :title="!auth.isLoggedIn ? 'Sign in to add to cart' : ''"
        >
          <i v-if="adding" class="ti ti-loader-2 animate-spin text-sm" aria-hidden="true" />
          <i v-else class="ti ti-shopping-bag text-sm" aria-hidden="true" />
          {{ adding ? '...' : 'Add' }}
        </button>
      </div>

      <p v-if="!auth.isLoggedIn" class="text-[10px] text-gray-400 mt-2 text-center">
        <RouterLink to="/login" class="text-purple-500 hover:underline font-medium">Sign in</RouterLink> to shop
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { imageUrl } from '@/utils/image'
import type { Product } from '@/types/product'
import WishlistButton from './WishlistButton.vue'

const props = defineProps<{ product: Product }>()
defineEmits<{ quickView: [product: Product] }>()

const auth = useAuthStore()
const cartStore = useCartStore()
const adding = ref(false)
const hovered = ref(false)

async function handleAddToCart() {
  if (!auth.isLoggedIn) return
  adding.value = true
  try {
    await cartStore.addToCart(props.product.id)
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.scale-108 { transform: scale(1.08); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
