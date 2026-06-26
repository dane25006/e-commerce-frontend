<template>
  <div class="min-h-screen bg-[#F8F5FF]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <HeroBanner />
    <CategorySection
      :categories="productStore.categories"
      :selected-id="selectedCategory"
      @select="onCategorySelect"
    />

    <!-- Featured Products -->
    <section id="featured-products" class="py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-8">
          <div>
            <span class="section-label block mb-2">Our Favorite Picks</span>
            <h2 class="text-3xl md:text-4xl font-black text-gray-900">
              Explore Our Most<br class="hidden sm:block" /> Loved Scents
            </h2>
          </div>
          <RouterLink
            to="/products"
            class="btn-outline text-sm py-2 px-5 hidden sm:flex items-center gap-1.5"
          >
            View All
            <i class="ti ti-arrow-right text-sm" aria-hidden="true" />
          </RouterLink>
        </div>

        <!-- Skeleton -->
        <div v-if="productStore.loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div v-for="n in 10" :key="n" class="card-luxury overflow-hidden">
            <div class="skeleton" style="aspect-ratio:3/4;max-height:200px" />
            <div class="p-4 space-y-3">
              <div class="h-3 skeleton w-3/4" />
              <div class="h-3 skeleton w-1/2" />
              <div class="h-8 skeleton mt-2" />
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="productStore.error" class="text-center py-16 text-gray-400">
          <i class="ti ti-alert-circle text-4xl block mb-3 text-purple-300" aria-hidden="true" />
          <p class="text-sm">{{ productStore.error }}</p>
        </div>

        <!-- Products Grid -->
        <div
          v-else-if="productStore.products.length"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <ProductCard
            v-for="product in productStore.products"
            :key="product.id"
            :product="product"
            @quick-view="openQuickView"
          />
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-16 text-gray-400">
          <i class="ti ti-mood-empty text-4xl block mb-3 text-purple-200" aria-hidden="true" />
          <p class="text-sm">No products found.</p>
        </div>

        <div class="text-center mt-6 sm:hidden">
          <RouterLink to="/products" class="btn-outline text-sm py-2.5 px-6">
            View All Products
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- New Arrivals — horizontal scroll -->
    <section class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-6">
          <div>
            <span class="section-label block mb-1">Fresh drops just landed</span>
            <h2 class="text-2xl md:text-3xl font-black text-gray-900">New Arrivals</h2>
          </div>
          <RouterLink to="/products?sort=newest" class="btn-outline text-sm py-2 px-4 hidden sm:flex items-center gap-1.5">
            View All
            <i class="ti ti-arrow-right text-sm" aria-hidden="true" />
          </RouterLink>
        </div>
        <div
          class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style="-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory"
        >
          <div v-if="newArrivalsLoading" class="flex gap-4">
            <div v-for="n in 5" :key="n" class="w-52 shrink-0 card-luxury overflow-hidden animate-pulse">
              <div class="skeleton" style="aspect-ratio:3/4" />
              <div class="p-3 space-y-2">
                <div class="h-3 skeleton w-2/3" />
                <div class="h-3 skeleton w-1/2" />
              </div>
            </div>
          </div>
          <ProductCard
            v-for="product in newArrivals"
            :key="product.id"
            :product="product"
            class="w-52 shrink-0 snap-start"
            @quick-view="openQuickView"
          />
        </div>
        <div class="text-center mt-4 sm:hidden">
          <RouterLink to="/products?sort=newest" class="btn-outline text-sm py-2 px-5">View All New Arrivals</RouterLink>
        </div>
      </div>
    </section>

    <!-- Best Sellers — horizontal scroll -->
    <section class="py-10 bg-white/40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-6">
          <div>
            <span class="section-label block mb-1">Most loved by customers</span>
            <h2 class="text-2xl md:text-3xl font-black text-gray-900">Best Sellers</h2>
          </div>
          <RouterLink to="/products?sort=rating" class="btn-outline text-sm py-2 px-4 hidden sm:flex items-center gap-1.5">
            View All
            <i class="ti ti-arrow-right text-sm" aria-hidden="true" />
          </RouterLink>
        </div>
        <div
          class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
          style="-webkit-overflow-scrolling:touch;scroll-snap-type:x mandatory"
        >
          <div v-if="bestSellersLoading" class="flex gap-4">
            <div v-for="n in 5" :key="n" class="w-52 shrink-0 card-luxury overflow-hidden animate-pulse">
              <div class="skeleton" style="aspect-ratio:3/4" />
              <div class="p-3 space-y-2">
                <div class="h-3 skeleton w-2/3" />
                <div class="h-3 skeleton w-1/2" />
              </div>
            </div>
          </div>
          <ProductCard
            v-for="product in bestSellers"
            :key="product.id"
            :product="product"
            class="w-52 shrink-0 snap-start"
            @quick-view="openQuickView"
          />
        </div>
        <div class="text-center mt-4 sm:hidden">
          <RouterLink to="/products?sort=rating" class="btn-outline text-sm py-2 px-5">View All Best Sellers</RouterLink>
        </div>
      </div>
    </section>

    <PromotionSection :promotions="promotions" />
    <BannerSlider />
    <WhyChooseUs />
    <TestimonialsSection />
    <BlogSection />

    <!-- Guest CTA -->
    <section v-if="!auth.isLoggedIn" class="py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-purple-800 p-10 md:p-14 text-center relative overflow-hidden">
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div class="absolute -bottom-8 -right-8 w-56 h-56 bg-purple-400/20 rounded-full blur-2xl" />
          </div>
          <div class="relative">
            <span class="text-purple-200 text-xs font-bold uppercase tracking-widest block mb-4">Join Scentique</span>
            <h2 class="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Find Your<br />Signature Scent?
            </h2>
            <p class="text-purple-200 text-base mb-8 max-w-md mx-auto">
              Create a free account to save favourites, track orders, and get exclusive member offers.
            </p>
            <div class="flex items-center gap-4 justify-center">
              <RouterLink
                to="/register"
                class="bg-white text-purple-700 font-bold px-8 py-3 rounded-xl hover:bg-purple-50 transition text-sm shadow-xl"
              >
                Create Account
              </RouterLink>
              <RouterLink
                to="/login"
                class="text-white border-2 border-white/40 hover:border-white font-semibold px-8 py-3 rounded-xl transition text-sm"
              >
                Sign In
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />

    <!-- Modals -->
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
    <ProductQuickView :product="quickViewProduct" @close="quickViewProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { productService } from '@/services/productService'
import { promotionService } from '@/services/promotionService'
import type { Product } from '@/types/product'
import type { Promotion } from '@/types/promotion'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import SearchModal from '@/components/layout/SearchModal.vue'

import HeroBanner from '@/components/home/HeroBanner.vue'
import CategorySection from '@/components/home/CategorySection.vue'
import BannerSlider from '@/components/home/BannerSlider.vue'
import WhyChooseUs from '@/components/home/WhyChooseUs.vue'
import TestimonialsSection from '@/components/home/TestimonialsSection.vue'
import BlogSection from '@/components/home/BlogSection.vue'
import PromotionSection from '@/components/home/PromotionSection.vue'

import ProductCard from '@/components/product/ProductCard.vue'
import ProductQuickView from '@/components/product/ProductQuickView.vue'

const auth = useAuthStore()
const productStore = useProductStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const selectedCategory = ref<number | null>(null)
const searchOpen = ref(false)
const cartOpen = ref(false)
const quickViewProduct = ref<Product | null>(null)
const newArrivals = ref<Product[]>([])
const bestSellers = ref<Product[]>([])
const promotions = ref<Promotion[]>([])
const newArrivalsLoading = ref(false)
const bestSellersLoading = ref(false)

function onCategorySelect(id: number) {
  selectedCategory.value = selectedCategory.value === id ? null : id
}

function openQuickView(product: Product) {
  quickViewProduct.value = product
}

watch(selectedCategory, (catId) => {
  productStore.fetchProducts({ per_page: 10, category_id: catId ?? undefined })
})

onMounted(async () => {
  await productStore.fetchCategories()
  await productStore.fetchProducts({ per_page: 10 })

  newArrivalsLoading.value = true
  bestSellersLoading.value = true

  await Promise.all([
    productService.getAll({ sort: 'newest', per_page: 8, page: 1 }).then(({ data }) => {
      newArrivals.value = data.products.data
    }).catch(() => {}).finally(() => { newArrivalsLoading.value = false }),

    productService.getAll({ sort: 'rating', per_page: 8, page: 1 }).then(({ data }) => {
      bestSellers.value = data.products.data
    }).catch(() => {}).finally(() => { bestSellersLoading.value = false }),
  ])

  promotionService.getAll().then(({ data }) => {
    promotions.value = data.promotions
  }).catch(() => {})

  await Promise.all([
    cartStore.fetchCart(),
    wishlistStore.fetchWishlist(),
  ])
})
</script>
