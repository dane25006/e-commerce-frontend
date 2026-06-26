<template>
  <button
    @click.prevent="handleToggle"
    :disabled="!auth.isLoggedIn || toggling"
    class="flex items-center justify-center rounded-full transition-all duration-200"
    :class="[
      sizeClasses,
      isWishlisted
        ? 'bg-pink-100 text-pink-500 hover:bg-pink-200'
        : 'bg-white/80 text-gray-400 hover:bg-pink-50 hover:text-pink-400',
      { 'heart-animate': animating },
      { 'opacity-50 cursor-not-allowed': !auth.isLoggedIn },
    ]"
    :aria-label="isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'"
    :title="!auth.isLoggedIn ? 'Sign in to save to wishlist' : ''"
  >
    <i
      :class="[
        isWishlisted ? 'ti ti-heart-filled' : 'ti ti-heart',
        iconSizeClass
      ]"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'

const props = withDefaults(defineProps<{
  productId: number
  size?: 'sm' | 'md' | 'lg'
}>(), { size: 'md' })

const auth = useAuthStore()
const wishlistStore = useWishlistStore()
const toggling = ref(false)
const animating = ref(false)

const isWishlisted = computed(() => wishlistStore.isWishlisted(props.productId))

const sizeClasses = computed(() => ({
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-10 h-10',
}[props.size]))

const iconSizeClass = computed(() => ({
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}[props.size]))

async function handleToggle() {
  if (!auth.isLoggedIn || toggling.value) return
  toggling.value = true
  animating.value = true
  setTimeout(() => { animating.value = false }, 300)
  try {
    await wishlistStore.toggle(props.productId)
  } finally {
    toggling.value = false
  }
}
</script>
