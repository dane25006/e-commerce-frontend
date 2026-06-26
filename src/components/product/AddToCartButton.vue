<template>
  <div class="flex flex-col items-start gap-1">
    <RouterLink
      v-if="!auth.isLoggedIn"
      to="/login"
      class="btn-outline flex items-center justify-center gap-1.5"
      :class="size === 'lg' ? 'text-sm px-5 py-3 w-full' : 'text-xs px-3 py-2'"
    >
      <i class="ti ti-lock" aria-hidden="true" />
      Sign in to buy
    </RouterLink>

    <span v-else-if="product.stock === 0" class="text-xs text-red-500 font-semibold flex items-center gap-1">
      <i class="ti ti-circle-x" aria-hidden="true" />
      Out of stock
    </span>

    <button
      v-else
      @click="handleAdd"
      :disabled="adding"
      class="btn-primary flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      :class="size === 'lg' ? 'text-sm px-6 py-3 w-full' : 'text-xs px-3 py-2'"
    >
      <i
        :class="adding ? 'ti ti-loader-2 animate-spin' : 'ti ti-shopping-bag'"
        aria-hidden="true"
      />
      {{ adding ? 'Adding...' : size === 'lg' ? 'Add to Cart' : 'Add' }}
    </button>

    <Transition name="fade">
      <p v-if="added" class="text-xs text-green-600 font-semibold flex items-center gap-1">
        <i class="ti ti-circle-check" aria-hidden="true" /> Added to cart!
      </p>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import type { Product, RelatedProduct } from '@/types/product'

const props = withDefaults(defineProps<{
  product: Product | RelatedProduct
  size?: 'sm' | 'lg'
}>(), { size: 'sm' })

const auth = useAuthStore()
const cartStore = useCartStore()
const adding = ref(false)
const added = ref(false)

async function handleAdd() {
  adding.value = true
  added.value = false
  try {
    await cartStore.addToCart(props.product.id)
    added.value = true
    setTimeout(() => { added.value = false }, 2500)
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
