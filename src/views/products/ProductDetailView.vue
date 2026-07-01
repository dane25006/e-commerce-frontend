<template>
  <div class="min-h-screen" style="background: var(--background);">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <div v-if="store.detailLoading" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="p-8 animate-pulse card">
        <div class="flex gap-8">
          <div class="w-[500px] aspect-square skeleton rounded-2xl flex-shrink-0" />
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

    <div v-else-if="!store.detail" class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center" style="color: var(--text-muted);">
      <i class="ti ti-package-off text-5xl block mb-4" style="color: rgba(184,138,68,0.3);" aria-hidden="true" />
      <p class="font-bold mb-1" style="color: var(--secondary);">We couldn&rsquo;t find this product</p>
      <RouterLink to="/products" class="text-sm inline-block mt-3" style="color: var(--primary);">
        &larr; Back to Shop
      </RouterLink>
    </div>

    <template v-else>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <nav class="flex items-center gap-2 text-sm" style="color: var(--text-muted);">
          <RouterLink to="/" class="transition" style="color: var(--text-muted);">Home</RouterLink>
          <i class="ti ti-chevron-right text-xs" aria-hidden="true" />
          <RouterLink to="/products" class="transition" style="color: var(--text-muted);">Shop</RouterLink>
          <i class="ti ti-chevron-right text-xs" aria-hidden="true" />
          <span class="font-semibold line-clamp-1" style="color: var(--secondary);">{{ store.detail.name }}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div class="lg:col-span-6">
            <div class="relative group">
              <div
                class="aspect-square rounded-[var(--radius)] overflow-hidden relative cursor-crosshair"
                style="background: #F8F5F0; border: 1px solid var(--border);"
                @mousemove="handleMouseMove"
                @mouseenter="showZoom = true"
                @mouseleave="showZoom = false"
              >
                <img
                  v-if="currentImage"
                  :src="imageUrl(currentImage)"
                  :alt="store.detail.name"
                  class="w-full h-full object-cover select-none"
                  draggable="false"
                />
                <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3">
                  <i class="ti ti-bottle text-8xl" style="color: rgba(184,138,68,0.2);" aria-hidden="true" />
                </div>
                <button
                  @click="prevImage"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                  style="background: rgba(255,255,255,0.9); color: var(--secondary); box-shadow: 0 2px 8px rgba(0,0,0,0.08);"
                  aria-label="Previous image"
                >
                  <i class="ti ti-chevron-left" aria-hidden="true" />
                </button>
                <button
                  @click="nextImage"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                  style="background: rgba(255,255,255,0.9); color: var(--secondary); box-shadow: 0 2px 8px rgba(0,0,0,0.08);"
                  aria-label="Next image"
                >
                  <i class="ti ti-chevron-right" aria-hidden="true" />
                </button>
                <div
                  v-if="store.detail.is_new"
                  class="absolute top-4 left-4 text-[10px] font-bold text-white px-3 py-1 rounded-full"
                  style="background: var(--primary); letter-spacing: 0.08em;"
                >NEW</div>
              </div>

              <div
                v-if="showZoom && currentImage"
                class="absolute top-0 left-[calc(100%+16px)] w-[400px] h-[400px] rounded-[var(--radius)] overflow-hidden hidden xl:block z-10"
                style="border: 1px solid var(--border); box-shadow: var(--shadow-lg);"
              >
                <img
                  :src="imageUrl(currentImage)"
                  class="absolute max-w-none"
                  :style="zoomStyle"
                  alt="Zoom"
                  draggable="false"
                />
              </div>
            </div>

            <div v-if="allImages.length > 1" class="flex gap-3 mt-4 pb-1 overflow-x-auto hide-scrollbar">
              <button
                v-for="(img, i) in allImages"
                :key="i"
                @click="selectedImageIndex = i"
                class="w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200"
                :class="selectedImageIndex === i ? 'border-[var(--primary)]' : 'border-transparent'"
                style="background: #F8F5F0;"
              >
                <img :src="imageUrl(img)" alt="Thumbnail" class="w-full h-full object-cover" draggable="false" />
              </button>
            </div>
          </div>

          <div class="lg:col-span-6">
            <div class="space-y-6">
              <div>
                <span v-if="store.detail.brand" class="section-label block mb-2">{{ store.detail.brand }}</span>
                <h1 class="text-3xl md:text-4xl font-black leading-tight" style="color: var(--secondary); font-family: 'Playfair Display', serif;">
                  {{ store.detail.name }}
                </h1>
              </div>

              <div v-if="store.detail.rating_avg" class="flex items-center gap-3">
                <div class="flex gap-0.5">
                  <i v-for="n in 5" :key="n" class="ti ti-star-filled text-sm"
                    :class="n <= Math.round(store.detail.rating_avg!) ? 'text-[var(--primary)]' : 'text-[#ECE7DF]'" aria-hidden="true" />
                </div>
                <span class="text-sm font-bold" style="color: var(--secondary);">{{ store.detail.rating_avg.toFixed(1) }}</span>
                <span class="text-sm" style="color: var(--text-muted);">({{ store.detail.rating_count }} reviews)</span>
              </div>

              <div class="flex items-baseline gap-3">
                <span v-if="store.detail.sale_price" class="text-4xl font-black" style="color: var(--primary);">${{ store.detail.sale_price.toFixed(2) }}</span>
                <span :class="store.detail.sale_price ? 'text-xl line-through' : 'text-4xl font-black'" style="color: var(--text-muted);">${{ store.detail.price.toFixed(2) }}</span>
              </div>

              <p class="text-sm leading-relaxed" style="color: var(--text-muted);">
                {{ store.detail.description }}
              </p>

              <div
                v-if="perfumeNotes.length > 0"
                class="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6"
                style="border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);"
              >
                <div v-for="note in perfumeNotes" :key="note.label" class="text-center">
                  <div class="flex justify-center gap-1.5 mb-3">
                    <span v-for="d in note.dots" :key="d" class="w-2 h-2 rounded-full" style="background: var(--primary);" />
                  </div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style="color: var(--text-muted);">{{ note.label }}</p>
                  <p class="text-sm font-semibold" style="color: var(--secondary);">{{ note.value }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div v-if="store.detail.type" class="flex items-center gap-3 py-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(184,138,68,0.1);">
                    <i class="ti ti-spray text-sm" style="color: var(--primary);" aria-hidden="true" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.1em]" style="color: var(--text-muted);">Type</p>
                    <p class="text-sm font-semibold" style="color: var(--secondary);">{{ store.detail.type }}</p>
                  </div>
                </div>
                <div v-if="store.detail.gender" class="flex items-center gap-3 py-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(184,138,68,0.1);">
                    <i class="ti ti-user text-sm" style="color: var(--primary);" aria-hidden="true" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.1em]" style="color: var(--text-muted);">Gender</p>
                    <p class="text-sm font-semibold" style="color: var(--secondary);">{{ store.detail.gender }}</p>
                  </div>
                </div>
                <div v-if="store.detail.department" class="flex items-center gap-3 py-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(184,138,68,0.1);">
                    <i class="ti ti-category text-sm" style="color: var(--primary);" aria-hidden="true" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.1em]" style="color: var(--text-muted);">Category</p>
                    <p class="text-sm font-semibold" style="color: var(--secondary);">{{ store.detail.department }}</p>
                  </div>
                </div>
                <div v-if="store.detail.category?.name" class="flex items-center gap-3 py-2">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(184,138,68,0.1);">
                    <i class="ti ti-tag text-sm" style="color: var(--primary);" aria-hidden="true" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.1em]" style="color: var(--text-muted);">Collection</p>
                    <p class="text-sm font-semibold" style="color: var(--secondary);">{{ store.detail.category.name }}</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full"
                  :class="store.detail.stock > 0 ? 'text-[var(--success)] bg-[var(--success)]/10' : 'text-[var(--danger)] bg-[var(--danger)]/10'"
                >
                  <i :class="store.detail.stock > 0 ? 'ti ti-circle-check' : 'ti ti-circle-x'" aria-hidden="true" />
                  {{ store.detail.stock > 0 ? `${store.detail.stock} in stock` : 'Out of stock' }}
                </span>
              </div>

              <div class="flex items-center gap-4">
                <div class="flex items-center rounded-full" style="border: 1.5px solid var(--border);">
                  <button
                    @click="decrementQty"
                    class="w-12 h-12 flex items-center justify-center transition-colors duration-150 rounded-l-full hover:bg-[#F8F5F0]"
                    :disabled="quantity <= 1"
                    style="color: var(--text-muted);"
                    aria-label="Decrease quantity"
                  >
                    <i class="ti ti-minus text-sm" aria-hidden="true" />
                  </button>
                  <span class="w-12 h-12 flex items-center justify-center text-sm font-bold select-none" style="color: var(--secondary);">{{ quantity }}</span>
                  <button
                    @click="incrementQty"
                    class="w-12 h-12 flex items-center justify-center transition-colors duration-150 rounded-r-full hover:bg-[#F8F5F0]"
                    :disabled="quantity >= store.detail.stock"
                    style="color: var(--text-muted);"
                    aria-label="Increase quantity"
                  >
                    <i class="ti ti-plus text-sm" aria-hidden="true" />
                  </button>
                </div>

                <AddToCartButton :product="store.detail" size="lg" class="flex-1" />
              </div>

              <div class="flex items-center gap-3">
                <button
                  v-if="auth.isLoggedIn"
                  @click="toggleWishlist"
                  class="flex items-center justify-center gap-2 flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-200"
                  :class="isWishlisted
                    ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                    : 'text-[var(--text-muted)]'"
                  style="border: 1.5px solid var(--border);"
                >
                  <i :class="isWishlisted ? 'ti ti-heart-filled' : 'ti ti-heart'" aria-hidden="true" />
                  {{ isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist' }}
                </button>

                <button
                  @click="shareProduct"
                  class="flex items-center justify-center gap-2 flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-200"
                  style="border: 1.5px solid var(--border); color: var(--text-muted);"
                >
                  <i class="ti ti-share" aria-hidden="true" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(section, idx) in accordionSections"
            :key="idx"
            class="card overflow-hidden"
          >
            <button
              @click="toggleAccordion(idx)"
              class="w-full flex items-center justify-between px-6 md:px-8 py-5 text-left transition-colors duration-200"
              :style="{ background: openAccordion === idx ? 'rgba(184,138,68,0.03)' : 'transparent' }"
            >
              <span class="text-base font-bold flex items-center gap-3" style="color: var(--secondary); font-family: 'Playfair Display', serif;">
                <i :class="section.icon" style="color: var(--primary);" aria-hidden="true" />
                {{ section.title }}
              </span>
              <i
                class="ti transition-transform duration-300"
                :class="openAccordion === idx ? 'ti ti-chevron-up' : 'ti ti-chevron-down'"
                style="color: var(--text-muted);"
                aria-hidden="true"
              />
            </button>
            <div
              class="transition-all duration-300 ease-in-out overflow-hidden"
              :style="{
                maxHeight: openAccordion === idx ? accordionContentHeights[idx] + 'px' : '0',
                opacity: openAccordion === idx ? 1 : 0,
              }"
            >
              <div class="px-6 md:px-8 pb-6" :ref="(el: any) => { if (el) accordionContentRefs[idx] = el as HTMLElement }">
                <div v-if="section.key === 'description'" class="text-sm leading-relaxed" style="color: var(--text-muted);">
                  <p>{{ store.detail.description }}</p>
                </div>
                <div v-else-if="section.key === 'ingredients'" class="text-sm leading-relaxed" style="color: var(--text-muted);">
                  <p>Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Geraniol, Coumarin, Alpha-Isomethyl Ionone.</p>
                </div>
                <div v-else-if="section.key === 'shipping'" class="space-y-3 text-sm" style="color: var(--text-muted);">
                  <p><strong style="color: var(--secondary);">Free Shipping</strong> on orders over $100.</p>
                  <p>Standard delivery: 3–5 business days. Express delivery: 1–2 business days.</p>
                  <p>International shipping available to select countries. Duties and taxes may apply.</p>
                </div>
                <div v-else-if="section.key === 'reviews'">
                  <div v-if="auth.isLoggedIn && !userReview" class="mb-8 pb-8" style="border-bottom: 1px solid var(--border);">
                    <h3 class="text-sm font-bold mb-4" style="color: var(--text-muted);">Write a Review</h3>
                    <div class="space-y-4">
                      <div class="flex items-center gap-1">
                        <button
                          v-for="n in 5" :key="n"
                          @click="reviewForm.rating = n"
                          type="button"
                          class="text-2xl transition"
                          :class="n <= reviewForm.rating ? 'text-[var(--primary)]' : 'text-[#ECE7DF]'"
                          :aria-label="`Rate ${n} stars`"
                        >
                          <i class="ti ti-star" aria-hidden="true" />
                        </button>
                      </div>
                      <textarea
                        id="review-comment"
                        name="comment"
                        v-model="reviewForm.comment"
                        rows="3"
                        placeholder="Share your experience with this fragrance..."
                        class="w-full px-4 py-3 text-sm rounded-xl outline-none resize-none"
                        style="background: var(--background); border: 1px solid var(--border); color: var(--secondary);"
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
                        <p v-if="reviewError" class="text-xs" style="color: var(--danger);">{{ reviewError }}</p>
                      </div>
                    </div>
                  </div>

                  <div v-if="store.detail.reviews?.length" class="space-y-6">
                    <div v-for="review in store.detail.reviews" :key="review.id" class="flex gap-4 pb-6" style="border-bottom: 1px solid rgba(231,225,216,0.5);">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style="background: linear-gradient(135deg, var(--primary), #C9A96E);">
                        {{ review.user_name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center justify-between mb-1">
                          <p class="text-sm font-bold" style="color: var(--secondary);">{{ review.user_name }}</p>
                          <span class="text-xs" style="color: var(--text-muted);">{{ formatDate(review.created_at) }}</span>
                        </div>
                        <div class="flex mb-2">
                          <i v-for="n in 5" :key="n" class="ti ti-star-filled text-xs"
                            :class="n <= review.rating ? 'text-[var(--primary)]' : 'text-[#ECE7DF]'" aria-hidden="true" />
                        </div>
                        <p v-if="review.comment" class="text-sm leading-relaxed" style="color: var(--text-muted);">{{ review.comment }}</p>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-center py-10" style="color: var(--text-muted);">
                    <i class="ti ti-message-circle text-4xl block mb-3" style="color: rgba(184,138,68,0.2);" aria-hidden="true" />
                    <p class="text-sm font-medium" style="color: var(--secondary);">No reviews yet &mdash; be the first to share your thoughts.</p>
                  </div>

                  <div v-if="!auth.isLoggedIn" class="mt-5 text-sm text-center" style="color: var(--text-muted);">
                    <RouterLink to="/login" class="font-semibold" style="color: var(--primary);">Login</RouterLink>
                    to leave a review
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="store.detail.related?.length">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-black" style="color: var(--secondary); font-family: 'Playfair Display', serif;">You May Also Like</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RouterLink
              v-for="p in store.detail.related"
              :key="p.id"
              :to="`/products/${p.id}`"
              class="rounded-[var(--radius)] overflow-hidden group transition-all duration-300 card"
            >
              <div class="aspect-square overflow-hidden" style="background: #F8F5F0;">
                <img v-if="p.image_url" :src="imageUrl(p.image_url)" :alt="p.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="ti ti-photo text-3xl" style="color: rgba(184,138,68,0.2);" aria-hidden="true" />
                </div>
              </div>
              <div class="p-4">
                <p class="text-sm font-bold line-clamp-1 transition" style="color: var(--secondary);">{{ p.name }}</p>
                <p class="text-sm font-black mt-1" style="color: var(--primary);">${{ p.price.toFixed(2) }}</p>
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
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
const selectedImageIndex = ref(0)
const quantity = ref(1)
const showZoom = ref(false)
const zoomPos = reactive({ x: 50, y: 50 })
const openAccordion = ref<number | null>(0)
const accordionContentRefs = ref<HTMLElement[]>([])
const accordionContentHeights = ref<number[]>([])

const allImages = computed(() => {
  const urls: string[] = []
  if (store.detail?.image_url) urls.push(store.detail.image_url)
  if (store.detail?.images?.length) {
    store.detail.images.forEach(img => {
      if (img.image_url) urls.push(img.image_url)
    })
  }
  return urls
})

const currentImage = computed(() => allImages.value[selectedImageIndex.value] ?? null)

const userReview = computed(() => store.detail?.reviews?.find(r => r.user_id === auth.user?.id))
const isWishlisted = computed(() => wishlist.isWishlisted(Number(route.params.id)))

const zoomStyle = computed(() => ({
  width: '200%',
  height: '200%',
  left: `${-zoomPos.x * 2}%`,
  top: `${-zoomPos.y * 2}%`,
}))

const perfumeNotes = computed(() => {
  const notes: { label: string; value: string; dots: number }[] = []
  const d = store.detail
  if (!d) return notes
  const top = (d as any).notes_top
  const middle = (d as any).notes_middle
  const base = (d as any).notes_base
  if (top) notes.push({ label: 'Top Notes', value: top, dots: 1 })
  if (middle) notes.push({ label: 'Middle Notes', value: middle, dots: 2 })
  if (base) notes.push({ label: 'Base Notes', value: base, dots: 3 })
  return notes
})

const accordionSections = [
  { key: 'description', title: 'Description', icon: 'ti ti-file-text' },
  { key: 'ingredients', title: 'Ingredients', icon: 'ti ti-flask' },
  { key: 'shipping', title: 'Shipping & Returns', icon: 'ti ti-truck' },
  { key: 'reviews', title: 'Reviews', icon: 'ti ti-message-circle' },
]

function handleMouseMove(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  zoomPos.x = ((e.clientX - rect.left) / rect.width) * 100
  zoomPos.y = ((e.clientY - rect.top) / rect.height) * 100
}

function prevImage() {
  if (allImages.value.length < 2) return
  selectedImageIndex.value = selectedImageIndex.value === 0 ? allImages.value.length - 1 : selectedImageIndex.value - 1
}

function nextImage() {
  if (allImages.value.length < 2) return
  selectedImageIndex.value = selectedImageIndex.value === allImages.value.length - 1 ? 0 : selectedImageIndex.value + 1
}

function decrementQty() {
  if (quantity.value > 1) quantity.value--
}

function incrementQty() {
  if (quantity.value < store.detail!.stock) quantity.value++
}

function toggleAccordion(idx: number) {
  openAccordion.value = openAccordion.value === idx ? null : idx
}

function shareProduct() {
  if (navigator.share) {
    navigator.share({
      title: store.detail?.name,
      text: store.detail?.description,
      url: window.location.href,
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(window.location.href)
  }
}

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
    reviewError.value = e.response?.data?.message ?? 'Something went wrong while submitting your review. Please try again.'
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
  quantity.value = 1
  selectedImageIndex.value = 0
  openAccordion.value = 0
  const id = Number(route.params.id)
  await Promise.all([
    store.fetchProduct(id),
    cartStore.fetchCart(),
    wishlist.fetchWishlist(),
  ])
  await nextTick()
  accordionContentHeights.value = accordionContentRefs.value.map(el => el?.scrollHeight || 0)
}

watch(() => route.params.id, load)
onMounted(load)
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
