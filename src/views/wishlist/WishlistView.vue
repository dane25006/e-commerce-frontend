<template>
  <div class="min-h-screen bg-[#F8F7FC]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-pink-500 via-purple-600 to-violet-700 py-20 md:py-24">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div class="max-w-xl">
          <span class="text-pink-200 text-sm font-bold uppercase tracking-[0.12em] block mb-3">Your</span>
          <h1 class="text-5xl md:text-6xl font-black text-white flex items-center gap-4 mb-4">
            <i class="ti ti-heart-filled" aria-hidden="true" />
            Wishlist
          </h1>
          <p class="text-pink-200/90 text-lg font-medium">
            {{ wishlist.items.length }} {{ wishlist.items.length === 1 ? 'Saved Item' : 'Saved Items' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <section class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-6">
          <div>
            <span class="section-label block mb-1">Your saved items</span>
            <h2 class="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
              <i class="ti ti-heart-filled text-pink-500" aria-hidden="true" />
              Wishlist ({{ wishlist.items.length }})
            </h2>
          </div>
          <RouterLink to="/products" class="btn-outline text-sm py-2 px-4 hidden sm:flex items-center gap-1.5">
            Discover More
            <i class="ti ti-arrow-right text-sm" aria-hidden="true" />
          </RouterLink>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div v-for="n in 5" :key="n" class="w-52 shrink-0 card-luxury overflow-hidden animate-pulse">
            <div class="skeleton" style="aspect-ratio:3/4" />
            <div class="p-3 space-y-2">
              <div class="h-3 skeleton w-2/3" />
              <div class="h-3 skeleton w-1/2" />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!wishlist.items.length" class="text-center py-24 fade-in">
          <div class="w-28 h-28 rounded-3xl bg-pink-50 flex items-center justify-center mx-auto mb-6">
            <i class="ti ti-heart-off text-6xl text-pink-300" aria-hidden="true" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p class="text-gray-500 text-base mb-8 max-w-md mx-auto">
            Save your favorite products and they'll appear here.
          </p>
          <RouterLink to="/products" class="btn-primary py-3.5 px-10 text-base inline-flex items-center gap-2">
            <i class="ti ti-shopping-bag text-lg" aria-hidden="true" />
            Start Shopping
          </RouterLink>
        </div>

        <!-- Horizontal Scroll -->
        <div
          v-else
          class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style="-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory"
        >
          <ProductCard
            v-for="item in wishlist.items"
            :key="item.wishlist_id"
            :product="item.product"
            class="w-52 shrink-0 snap-start"
          />
        </div>

        <div class="text-center mt-4 sm:hidden">
          <RouterLink to="/products" class="btn-outline text-sm py-2 px-5">Discover More</RouterLink>
        </div>
      </div>
    </section>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishlist'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const wishlist = useWishlistStore()
const searchOpen = ref(false)
const cartOpen = ref(false)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await wishlist.fetchWishlist()
  loading.value = false
})
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.6s ease forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
