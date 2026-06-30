<template>
  <div class="min-h-screen" style="background: var(--background);">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <HeroBanner />
    <CategorySection />

    <!-- Featured Products -->
    <section id="featured-products" class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="section-label block mb-3">Our Favorite Picks</span>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-black" style="color: var(--text);">
            Explore Our Most Loved Scents
          </h2>
          <p class="text-sm mt-4 max-w-lg mx-auto" style="color: var(--text-muted);">Discover the fragrances that have captured the hearts of our customers worldwide.</p>
        </div>

        <!-- Skeleton -->
        <div v-if="productStore.loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          <div v-for="n in 10" :key="n" class="card overflow-hidden">
            <div class="skeleton" style="aspect-ratio:3/4" />
            <div class="p-4 space-y-3">
              <div class="flex gap-2">
                <div class="h-2.5 skeleton w-12 rounded-full" />
                <div class="h-2.5 skeleton w-8 rounded-full" />
              </div>
              <div class="h-4 skeleton w-full rounded-md" />
              <div class="h-3 skeleton w-3/4 rounded-md" />
              <div class="flex gap-1">
                <div v-for="s in 5" :key="s" class="w-3 h-3 skeleton rounded-sm" />
                <div class="w-6 h-3 skeleton rounded-sm ml-1" />
              </div>
              <div class="flex items-center justify-between pt-1">
                <div class="h-5 skeleton w-16 rounded-md" />
                <div class="h-8 skeleton w-16 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="productStore.error" class="text-center py-16" style="color: var(--text-muted);">
          <i class="ti ti-alert-circle text-4xl block mb-3" style="color: rgba(184,138,68,0.3);" aria-hidden="true" />
          <p class="text-sm">Something went wrong while loading your featured products. Please try again.</p>
        </div>

        <!-- Products Grid -->
        <div
          v-else-if="productStore.products.length"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5"
        >
          <ProductCard
            v-for="product in productStore.products"
            :key="product.id"
            :product="product"
            @quick-view="openQuickView"
          />
        </div>

        <div v-else class="text-center py-16" style="color: var(--text-muted);">
          <i class="ti ti-mood-empty text-4xl block mb-3" style="color: rgba(184,138,68,0.2);" aria-hidden="true" />
          <p class="text-sm">We couldn&rsquo;t find any products to feature right now. Check back soon for new arrivals.</p>
        </div>

        <div class="text-center mt-10">
          <RouterLink to="/products" class="btn-secondary text-sm px-8">
            View All Products
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Brands Showcase -->
    <section class="section-padding" style="background: var(--surface);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="section-label block mb-3">Luxury Brands</span>
          <h2 class="text-3xl md:text-4xl font-black" style="color: var(--text);">Featured Houses</h2>
        </div>
        <div class="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
          <div
            v-for="brand in brands"
            :key="brand.name"
            class="flex items-center justify-center h-20 rounded-[var(--radius)] transition-all duration-300 cursor-default card"
          >
            <span class="text-sm font-bold tracking-wider" style="color: var(--text-muted); font-family: 'Playfair Display', serif;">{{ brand.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-8">
          <div>
            <span class="section-label block mb-1">Fresh drops just landed</span>
            <h2 class="text-3xl md:text-4xl font-black" style="color: #2E2E2E;">New Arrivals</h2>
          </div>
          <RouterLink to="/products?sort=newest" class="btn-outline text-sm py-2 px-4 hidden sm:flex items-center gap-1.5">
            View All
            <i class="ti ti-arrow-right text-sm" aria-hidden="true" />
          </RouterLink>
        </div>

        <div class="relative group">
          <button @click="scrollLeft('newArrivalsScroll')" class="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full items-center justify-center shadow-lg transition opacity-0 group-hover:opacity-100 hover:scale-110" style="background: #FFFFFF; color: #4A403A;" aria-label="Scroll left">
            <i class="ti ti-chevron-left" aria-hidden="true" />
          </button>
          <button @click="scrollRight('newArrivalsScroll')" class="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full items-center justify-center shadow-lg transition opacity-0 group-hover:opacity-100 hover:scale-110" style="background: #FFFFFF; color: #4A403A;" aria-label="Scroll right">
            <i class="ti ti-chevron-right" aria-hidden="true" />
          </button>

          <div
            ref="newArrivalsScroll"
            class="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 hide-scrollbar"
          >
            <template v-if="newArrivalsLoading">
              <div v-for="n in 8" :key="n" class="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] snap-start rounded-2xl overflow-hidden" style="background: #FFFFFF; border: 1px solid var(--border);">
                <div class="skeleton" style="aspect-ratio:3/4;max-height:280px" />
                <div class="p-4 space-y-3">
                  <div class="flex gap-2">
                    <div class="h-2.5 skeleton w-12 rounded-full" />
                    <div class="h-2.5 skeleton w-8 rounded-full" />
                  </div>
                  <div class="h-4 skeleton w-full rounded-md" />
                  <div class="h-3 skeleton w-3/4 rounded-md" />
                  <div class="flex gap-1">
                    <div v-for="s in 5" :key="s" class="w-3 h-3 skeleton rounded-sm" />
                    <div class="w-6 h-3 skeleton rounded-sm ml-1" />
                  </div>
                  <div class="flex items-center justify-between pt-1">
                    <div class="h-5 skeleton w-16 rounded-md" />
                    <div class="h-8 skeleton w-16 rounded-lg" />
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <ProductCard
                v-for="product in newArrivals"
                :key="product.id"
                :product="product"
                :new-arrival="true"
                class="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] snap-start shrink-0"
                @quick-view="openQuickView"
              />
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Best Sellers -->
    <section class="section-padding" style="background: var(--surface);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-8">
          <div>
            <span class="section-label block mb-1">Most loved by customers</span>
            <h2 class="text-3xl md:text-4xl font-black" style="color: #2E2E2E;">Best Sellers</h2>
          </div>
          <RouterLink to="/products?sort=rating" class="btn-outline text-sm py-2 px-4 hidden sm:flex items-center gap-1.5">
            View All
            <i class="ti ti-arrow-right text-sm" aria-hidden="true" />
          </RouterLink>
        </div>

        <div class="relative group">
          <button @click="scrollLeft('bestSellersScroll')" class="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full items-center justify-center shadow-lg transition opacity-0 group-hover:opacity-100 hover:scale-110" style="background: #FFFFFF; color: #4A403A;" aria-label="Scroll left">
            <i class="ti ti-chevron-left" aria-hidden="true" />
          </button>
          <button @click="scrollRight('bestSellersScroll')" class="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full items-center justify-center shadow-lg transition opacity-0 group-hover:opacity-100 hover:scale-110" style="background: #FFFFFF; color: #4A403A;" aria-label="Scroll right">
            <i class="ti ti-chevron-right" aria-hidden="true" />
          </button>

          <div
            ref="bestSellersScroll"
            class="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 hide-scrollbar"
          >
            <template v-if="bestSellersLoading">
              <div v-for="n in 8" :key="n" class="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] snap-start rounded-2xl overflow-hidden" style="background: #FFFFFF; border: 1px solid var(--border);">
                <div class="skeleton" style="aspect-ratio:3/4;max-height:280px" />
                <div class="p-4 space-y-3">
                  <div class="flex gap-2">
                    <div class="h-2.5 skeleton w-12 rounded-full" />
                    <div class="h-2.5 skeleton w-8 rounded-full" />
                  </div>
                  <div class="h-4 skeleton w-full rounded-md" />
                  <div class="h-3 skeleton w-3/4 rounded-md" />
                  <div class="flex gap-1">
                    <div v-for="s in 5" :key="s" class="w-3 h-3 skeleton rounded-sm" />
                    <div class="w-6 h-3 skeleton rounded-sm ml-1" />
                  </div>
                  <div class="flex items-center justify-between pt-1">
                    <div class="h-5 skeleton w-16 rounded-md" />
                    <div class="h-8 skeleton w-16 rounded-lg" />
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <ProductCard
                v-for="product in bestSellers"
                :key="product.id"
                :product="product"
                :best-seller="true"
                class="min-w-[160px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] snap-start shrink-0"
                @quick-view="openQuickView"
              />
            </template>
          </div>
        </div>
      </div>
    </section>

    <PromotionSection :promotions="promotions" />
    <BannerSlider />
    <WhyChooseUs />
    <TestimonialsSection />
    <BlogSection />

    <!-- Newsletter -->
    <section class="section-padding" style="background: var(--secondary);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="section-label block mb-3" style="color: var(--primary);">Stay Connected</span>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
          Join Our World of Fragrance
        </h2>
        <p class="text-sm mb-8 max-w-md mx-auto" style="color: rgba(255,255,255,0.5);">
          Subscribe to receive exclusive offers, new arrivals, and insider tips straight to your inbox.
        </p>
        <div class="flex items-center gap-3 justify-center max-w-md mx-auto">
          <input
            id="home-email"
            name="email"
            type="email"
            placeholder="Your email address"
            class="flex-1 px-5 py-3 rounded-full text-sm outline-none"
            style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #FFFFFF;"
          />
          <button class="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </div>
      </div>
    </section>

    <!-- Guest CTA -->
    <section v-if="!auth.isLoggedIn" class="section-padding">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="rounded-[var(--radius)] p-12 md:p-16 text-center relative overflow-hidden" style="background: var(--primary);">
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-12 -left-12 w-48 h-48 rounded-full" style="background: rgba(255,255,255,0.08);" />
            <div class="absolute -bottom-8 -right-8 w-56 h-56 rounded-full" style="background: rgba(255,255,255,0.05);" />
          </div>
          <div class="relative">
            <span class="section-label block mb-4" style="color: rgba(255,255,255,0.7);">Join Scentique</span>
            <h2 class="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Find Your<br />Signature Scent?
            </h2>
            <p class="text-base mb-8 max-w-md mx-auto" style="color: rgba(255,255,255,0.7);">
              Create a free account to save favourites, track orders, and get exclusive member offers.
            </p>
            <div class="flex items-center gap-4 justify-center">
              <RouterLink
                to="/register"
                class="inline-flex items-center justify-center font-bold px-8 py-3 rounded-full transition text-sm shadow-lg"
                style="background: #FFFFFF; color: var(--primary);"
              >
                Create Account
              </RouterLink>
              <RouterLink
                to="/login"
                class="inline-flex items-center justify-center text-white border-2 px-8 py-3 rounded-full transition text-sm font-semibold"
                style="border-color: rgba(255,255,255,0.4);"
              >
                Sign In
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />

    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
    <ProductQuickView :product="quickViewProduct" @close="quickViewProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

const brands = [
  { name: 'Dior' },
  { name: 'Chanel' },
  { name: 'Versace' },
  { name: 'Gucci' },
  { name: 'YSL' },
  { name: 'Tom Ford' },
]

const auth = useAuthStore()
const productStore = useProductStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const searchOpen = ref(false)
const cartOpen = ref(false)
const quickViewProduct = ref<Product | null>(null)
const newArrivals = ref<Product[]>([])
const bestSellers = ref<Product[]>([])
const promotions = ref<Promotion[]>([])
const newArrivalsLoading = ref(false)
const bestSellersLoading = ref(false)

function openQuickView(product: Product) {
  quickViewProduct.value = product
}

const newArrivalsScroll = ref<HTMLElement | null>(null)
const bestSellersScroll = ref<HTMLElement | null>(null)

function scrollLeft(refName: 'newArrivalsScroll' | 'bestSellersScroll') {
  const el = refName === 'newArrivalsScroll' ? newArrivalsScroll.value : bestSellersScroll.value
  if (!el) return
  const cardWidth = el.querySelector(':scope > *')?.clientWidth ?? 220
  el.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' })
}

function scrollRight(refName: 'newArrivalsScroll' | 'bestSellersScroll') {
  const el = refName === 'newArrivalsScroll' ? newArrivalsScroll.value : bestSellersScroll.value
  if (!el) return
  const cardWidth = el.querySelector(':scope > *')?.clientWidth ?? 220
  el.scrollBy({ left: cardWidth * 2, behavior: 'smooth' })
}

onMounted(async () => {
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

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
