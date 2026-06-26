<template>
  <div class="min-h-screen bg-[#F8F5FF]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <!-- Header -->
    <div class="bg-gradient-to-br from-pink-500 via-purple-600 to-violet-700 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-pink-200 text-xs font-bold uppercase tracking-widest block mb-1">Your</span>
        <h1 class="text-3xl font-black text-white flex items-center gap-3">
          <i class="ti ti-heart-filled" aria-hidden="true" />
          Wishlist
        </h1>
        <p class="text-pink-200 text-sm mt-1">{{ wishlist.items.length }} saved item{{ wishlist.items.length !== 1 ? 's' : '' }}</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="n in 8" :key="n" class="card-luxury overflow-hidden animate-pulse">
          <div class="skeleton" style="aspect-ratio: 3/4; max-height: 240px" />
          <div class="p-4 space-y-2">
            <div class="h-3 skeleton w-3/4" />
            <div class="h-3 skeleton w-1/2" />
            <div class="h-8 skeleton mt-2" />
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!wishlist.items.length" class="text-center py-24">
        <div class="w-24 h-24 rounded-3xl bg-pink-50 flex items-center justify-center mx-auto mb-6">
          <i class="ti ti-heart text-5xl text-pink-300" aria-hidden="true" />
        </div>
        <h2 class="text-xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
        <p class="text-gray-400 text-sm mb-8">Save your favorite fragrances here for easy access.</p>
        <RouterLink to="/products" class="btn-primary py-3 px-8 text-sm">Discover Fragrances</RouterLink>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="item in wishlist.items"
          :key="item.wishlist_id"
          class="card-luxury overflow-hidden group relative"
        >
          <!-- Remove button -->
          <button
            @click="removeFromWishlist(item.wishlist_id)"
            :disabled="removingId === item.wishlist_id"
            class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 text-pink-500 hover:bg-pink-500 hover:text-white flex items-center justify-center shadow-md transition"
            aria-label="Remove from wishlist"
          >
            <i :class="removingId === item.wishlist_id ? 'ti ti-loader-2 animate-spin text-xs' : 'ti ti-heart-filled text-sm'" aria-hidden="true" />
          </button>

          <!-- Product image -->
          <RouterLink :to="`/products/${item.product.id}`" class="block relative overflow-hidden" style="aspect-ratio: 3/4; max-height: 240px">
            <img
              v-if="item.product.image_url"
              :src="imageUrl(item.product.image_url)"
              :alt="item.product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-purple-50 flex items-center justify-center">
              <i class="ti ti-photo text-4xl text-purple-200" aria-hidden="true" />
            </div>
          </RouterLink>

          <div class="p-4">
            <RouterLink :to="`/products/${item.product.id}`">
              <h3 class="text-sm font-bold text-gray-900 hover:text-purple-700 transition line-clamp-2 leading-snug mb-2">
                {{ item.product.name }}
              </h3>
            </RouterLink>
            <div class="flex items-center justify-between">
              <span class="text-base font-black text-gray-900">${{ item.product.price.toFixed(2) }}</span>
              <button
                @click="addToCart(item.product.id)"
                :disabled="addingId === item.product.id"
                class="btn-primary text-xs px-3 py-2 flex items-center gap-1 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
              >
                <i :class="addingId === item.product.id ? 'ti ti-loader-2 animate-spin' : 'ti ti-shopping-bag'" class="text-sm" aria-hidden="true" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { imageUrl } from '@/utils/image'
import api from '@/plugins/axios'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

const wishlist = useWishlistStore()
const cartStore = useCartStore()
const searchOpen = ref(false)
const cartOpen = ref(false)
const loading = ref(false)
const removingId = ref<number | null>(null)
const addingId = ref<number | null>(null)

async function removeFromWishlist(id: number) {
  removingId.value = id
  try {
    await api.delete(`/wishlist/${id}`)
    await wishlist.fetchWishlist()
  } finally {
    removingId.value = null
  }
}

async function addToCart(productId: number) {
  addingId.value = productId
  try {
    await cartStore.addToCart(productId)
    cartOpen.value = true
  } finally {
    addingId.value = null
  }
}

onMounted(async () => {
  loading.value = true
  await wishlist.fetchWishlist()
  loading.value = false
})
</script>
