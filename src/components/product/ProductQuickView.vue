<template>
  <Transition name="fade">
    <div
      v-if="product"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div class="flex flex-col md:flex-row">
          <!-- Image -->
          <div class="md:w-2/5 relative bg-purple-50/40 overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none" style="min-height:300px">
            <img
              v-if="product.image_url"
              :src="imageUrl(product.image_url)"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center p-8">
              <i class="ti ti-bottle text-8xl text-purple-200" aria-hidden="true" />
            </div>
            <button
              @click="$emit('close')"
              class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 text-gray-600 hover:text-gray-900 flex items-center justify-center shadow-md transition"
              aria-label="Close"
            >
              <i class="ti ti-x text-lg" aria-hidden="true" />
            </button>
          </div>

          <!-- Info -->
          <div class="md:w-3/5 p-6 md:p-8 flex flex-col">
            <span v-if="product.category" class="section-label mb-2">{{ product.category.name }}</span>
            <h2 class="text-2xl font-bold text-gray-900 mb-2 leading-tight">{{ product.name }}</h2>

            <div v-if="product.rating_avg" class="flex items-center gap-2 mb-4">
              <div class="flex">
                <i v-for="n in 5" :key="n" class="ti ti-star-filled text-sm"
                  :class="n <= Math.round(product.rating_avg!) ? 'text-amber-400' : 'text-gray-200'" aria-hidden="true" />
              </div>
              <span class="text-sm font-semibold text-gray-700">{{ product.rating_avg.toFixed(1) }}</span>
              <span class="text-sm text-gray-400">({{ product.rating_count }} reviews)</span>
            </div>

            <div class="flex items-baseline gap-2 mb-4">
              <span class="text-3xl font-black text-gray-900">${{ product.price.toFixed(2) }}</span>
            </div>

            <span class="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full w-fit mb-4"
              :class="product.stock > 0 ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'">
              <i :class="product.stock > 0 ? 'ti ti-circle-check' : 'ti ti-circle-x'" aria-hidden="true" />
              {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
            </span>

            <p class="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-4">{{ product.description }}</p>

            <div class="flex items-center gap-3 mt-auto flex-wrap">
              <button
                v-if="product.stock > 0 && auth.isLoggedIn"
                @click="handleAddToCart"
                :disabled="adding"
                class="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
              >
                <i v-if="adding" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
                <i v-else class="ti ti-shopping-bag" aria-hidden="true" />
                {{ adding ? 'Adding...' : 'Add to Cart' }}
              </button>

              <WishlistButton v-if="auth.isLoggedIn" :product-id="product.id" size="lg" />

              <RouterLink :to="`/products/${product.id}`" @click="$emit('close')"
                class="text-sm font-semibold text-purple-600 hover:text-purple-700 transition flex items-center gap-1">
                Details <i class="ti ti-arrow-right" aria-hidden="true" />
              </RouterLink>
            </div>

            <p v-if="!auth.isLoggedIn" class="text-xs text-gray-400 mt-3">
              <RouterLink to="/login" class="text-purple-500 hover:underline font-medium">Sign in</RouterLink>
              to shop
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { imageUrl } from '@/utils/image'
import type { Product } from '@/types/product'
import WishlistButton from './WishlistButton.vue'

const props = defineProps<{ product: Product | null }>()
defineEmits<{ close: [] }>()

const auth = useAuthStore()
const cartStore = useCartStore()
const adding = ref(false)

async function handleAddToCart() {
  if (!props.product || !auth.isLoggedIn) return
  adding.value = true
  try {
    await cartStore.addToCart(props.product.id)
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
