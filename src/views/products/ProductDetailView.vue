<template>
  <div class="min-h-screen bg-[#F8F5FF]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <!-- Loading -->
    <div v-if="store.detailLoading" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="card-luxury p-8 animate-pulse">
        <div class="flex gap-8">
          <div class="w-96 aspect-square skeleton rounded-2xl flex-shrink-0" />
          <div class="flex-1 space-y-4">
            <div class="h-4 skeleton w-1/4" />
            <div class="h-8 skeleton w-3/4" />
            <div class="h-4 skeleton w-1/3" />
            <div class="h-20 skeleton" />
            <div class="h-12 skeleton w-1/3 mt-6" />
          </div>
        </div>
      </div>
    </div>

    <!-- Not found -->
    <div v-else-if="!store.detail" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-400">
      <i class="ti ti-package-off text-5xl block mb-4 text-purple-200" aria-hidden="true" />
      <p class="font-bold text-gray-600 mb-1">Product not found</p>
      <RouterLink to="/products" class="text-sm text-purple-600 hover:underline mt-3 inline-block">
        ← Back to Shop
      </RouterLink>
    </div>

    <template v-else>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-sm text-gray-400">
          <RouterLink to="/" class="hover:text-purple-600 transition">Home</RouterLink>
          <i class="ti ti-chevron-right text-xs" aria-hidden="true" />
          <RouterLink to="/products" class="hover:text-purple-600 transition">Shop</RouterLink>
          <i class="ti ti-chevron-right text-xs" aria-hidden="true" />
          <span class="text-gray-700 font-semibold line-clamp-1">{{ store.detail.name }}</span>
        </nav>

        <!-- Product Main -->
        <div class="card-luxury p-6 md:p-10">
          <div class="flex flex-col md:flex-row gap-8 lg:gap-12">

            <!-- Image Gallery -->
            <div class="md:w-2/5 flex-shrink-0">
              <div class="aspect-square rounded-2xl overflow-hidden bg-purple-50/50 border border-purple-100 relative group">
                <img
                  v-if="store.detail.image_url"
                  :src="imageUrl(store.detail.image_url)"
                  :alt="store.detail.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3">
                  <i class="ti ti-bottle text-8xl text-purple-200" aria-hidden="true" />
                </div>

                <!-- Wishlist on image -->
                <div class="absolute top-4 right-4">
                  <WishlistButton v-if="auth.isLoggedIn" :product-id="store.detail.id" size="lg" />
                </div>
              </div>
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <span v-if="store.detail.category" class="section-label block mb-3">
                {{ store.detail.category.name }}
              </span>

              <h1 class="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
                {{ store.detail.name }}
              </h1>

              <!-- Rating -->
              <div v-if="store.detail.rating_avg" class="flex items-center gap-3 mb-5">
                <div class="flex">
                  <i v-for="n in 5" :key="n" class="ti ti-star-filled text-sm"
                    :class="n <= Math.round(store.detail.rating_avg!) ? 'text-amber-400' : 'text-gray-200'" aria-hidden="true" />
                </div>
                <span class="text-sm font-bold text-gray-700">{{ store.detail.rating_avg.toFixed(1) }}</span>
                <span class="text-sm text-gray-400">({{ store.detail.rating_count }} reviews)</span>
              </div>

              <!-- Price -->
              <div class="flex items-baseline gap-3 mb-5">
                <span class="text-4xl font-black text-gray-900">${{ store.detail.price.toFixed(2) }}</span>
              </div>

              <!-- Stock -->
              <div class="mb-6">
                <span
                  class="inline-flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full"
                  :class="store.detail.stock > 0 ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-600 bg-red-50 border border-red-200'"
                >
                  <i :class="store.detail.stock > 0 ? 'ti ti-circle-check' : 'ti ti-circle-x'" aria-hidden="true" />
                  {{ store.detail.stock > 0 ? `${store.detail.stock} in stock` : 'Out of stock' }}
                </span>
              </div>

              <!-- Description -->
              <p class="text-sm text-gray-600 leading-relaxed mb-8 border-l-2 border-purple-200 pl-4">
                {{ store.detail.description }}
              </p>

              <!-- Actions -->
              <div class="flex items-center gap-3 flex-wrap">
                <AddToCartButton :product="store.detail" size="lg" class="flex-1 sm:flex-none" />

                <button
                  v-if="auth.isLoggedIn"
                  @click="toggleWishlist"
                  class="flex items-center gap-2 px-5 py-3 border-2 rounded-xl text-sm font-bold transition"
                  :class="isWishlisted
                    ? 'border-pink-300 text-pink-600 bg-pink-50 hover:bg-pink-100'
                    : 'border-purple-200 text-gray-600 hover:border-pink-300 hover:text-pink-600'"
                >
                  <i :class="isWishlisted ? 'ti ti-heart-filled' : 'ti ti-heart'" aria-hidden="true" />
                  {{ isWishlisted ? 'Saved' : 'Save' }}
                </button>

                <button class="p-3 border-2 border-purple-200 rounded-xl text-gray-600 hover:border-purple-400 hover:text-purple-600 transition" aria-label="Share">
                  <i class="ti ti-share text-lg" aria-hidden="true" />
                </button>
              </div>

              <!-- Feature bullets -->
              <div class="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-purple-100">
                <div v-for="f in productFeatures" :key="f.text" class="flex items-center gap-2">
                  <i :class="`ti ${f.icon} text-purple-500`" aria-hidden="true" />
                  <span class="text-xs text-gray-600 font-medium">{{ f.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div class="card-luxury p-6 md:p-8">
          <h2 class="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <i class="ti ti-message-circle text-purple-500" aria-hidden="true" />
            Customer Reviews
            <span class="text-gray-400 font-normal text-base ml-1">({{ store.detail.reviews?.length ?? 0 }})</span>
          </h2>

          <!-- Write Review -->
          <div v-if="auth.isLoggedIn && !userReview" class="mb-8 pb-8 border-b border-purple-100">
            <h3 class="text-sm font-bold text-gray-700 mb-4">Write a Review</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-1">
                <button
                  v-for="n in 5" :key="n"
                  @click="reviewForm.rating = n"
                  type="button"
                  class="text-2xl transition"
                  :class="n <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'"
                  :aria-label="`Rate ${n} stars`"
                >
                  <i class="ti ti-star" aria-hidden="true" />
                </button>
              </div>
              <textarea
                v-model="reviewForm.comment"
                rows="3"
                placeholder="Share your experience with this fragrance..."
                class="w-full px-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none bg-purple-50/20"
              />
              <div class="flex items-center gap-3">
                <button
                  @click="submitReview"
                  :disabled="!reviewForm.rating || submittingReview"
                  class="btn-primary text-sm py-2.5 px-6 flex items-center gap-1.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                >
                  <i v-if="submittingReview" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
                  {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
                </button>
                <p v-if="reviewError" class="text-xs text-red-500">{{ reviewError }}</p>
              </div>
            </div>
          </div>

          <!-- Reviews list -->
          <div v-if="store.detail.reviews?.length" class="space-y-6">
            <div v-for="review in store.detail.reviews" :key="review.id" class="flex gap-4 pb-6 border-b border-purple-50 last:border-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {{ review.user_name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-bold text-gray-900">{{ review.user_name }}</p>
                  <span class="text-xs text-gray-400">{{ formatDate(review.created_at) }}</span>
                </div>
                <div class="flex mb-2">
                  <i v-for="n in 5" :key="n" class="ti ti-star-filled text-xs"
                    :class="n <= review.rating ? 'text-amber-400' : 'text-gray-200'" aria-hidden="true" />
                </div>
                <p v-if="review.comment" class="text-sm text-gray-600 leading-relaxed">{{ review.comment }}</p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10 text-gray-400">
            <i class="ti ti-message-circle text-4xl block mb-3 text-purple-200" aria-hidden="true" />
            <p class="text-sm font-medium text-gray-600">No reviews yet. Be the first!</p>
          </div>

          <div v-if="!auth.isLoggedIn" class="mt-5 text-sm text-gray-400 text-center">
            <RouterLink to="/login" class="text-purple-600 hover:underline font-semibold">Sign in</RouterLink>
            to leave a review
          </div>
        </div>

        <!-- Related Products -->
        <div v-if="store.detail.related?.length">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-black text-gray-900">You May Also Like</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RouterLink
              v-for="p in store.detail.related"
              :key="p.id"
              :to="`/products/${p.id}`"
              class="card-luxury overflow-hidden group"
            >
              <div class="aspect-square bg-purple-50/40 overflow-hidden">
                <img v-if="p.image_url" :src="imageUrl(p.image_url)" :alt="p.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="ti ti-photo text-3xl text-purple-200" aria-hidden="true" />
                </div>
              </div>
              <div class="p-3">
                <p class="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-purple-700 transition">{{ p.name }}</p>
                <p class="text-sm font-black text-purple-700 mt-0.5">${{ p.price.toFixed(2) }}</p>
              </div>
            </RouterLink>
          </div>
        </div>

      </div>
    </template>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { imageUrl } from '@/utils/image'
import api from '@/plugins/axios'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import AddToCartButton from '@/components/product/AddToCartButton.vue'
import WishlistButton from '@/components/product/WishlistButton.vue'

const route = useRoute()
const store = useProductStore()
const auth = useAuthStore()
const cartStore = useCartStore()
const wishlist = useWishlistStore()

const searchOpen = ref(false)
const cartOpen = ref(false)
const submittingReview = ref(false)
const reviewError = ref('')
const reviewForm = reactive({ rating: 0, comment: '' })

const userReview = computed(() => store.detail?.reviews?.find(r => r.user_id === auth.user?.id))
const isWishlisted = computed(() => wishlist.isWishlisted(Number(route.params.id)))

const productFeatures = [
  { icon: 'ti-diamond', text: 'Premium Quality' },
  { icon: 'ti-leaf', text: 'Cruelty Free' },
  { icon: 'ti-truck', text: 'Free Shipping $100+' },
  { icon: 'ti-refresh', text: '30-Day Returns' },
]

async function submitReview() {
  if (!reviewForm.rating) return
  submittingReview.value = true
  reviewError.value = ''
  try {
    await api.post(`/products/${route.params.id}/reviews`, {
      rating: reviewForm.rating,
      comment: reviewForm.comment || null,
    })
    reviewForm.rating = 0
    reviewForm.comment = ''
    await store.fetchProduct(Number(route.params.id))
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    reviewError.value = e.response?.data?.message ?? 'Failed to submit review.'
  } finally {
    submittingReview.value = false
  }
}

async function toggleWishlist() {
  await wishlist.toggle(Number(route.params.id))
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function load() {
  const id = Number(route.params.id)
  await Promise.all([
    store.fetchProduct(id),
    cartStore.fetchCart(),
    wishlist.fetchWishlist(),
  ])
}

watch(() => route.params.id, load)
onMounted(load)
</script>
