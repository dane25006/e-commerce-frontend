<template>
  <div class="min-h-screen bg-[#F8F5FF]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <!-- Page Header -->
    <div class="bg-gradient-to-br from-purple-600 to-violet-700 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-purple-200 text-xs font-bold uppercase tracking-widest block mb-2">Our Collection</span>
        <h1 class="text-3xl md:text-4xl font-black text-white mb-2">All Fragrances</h1>
        <p v-if="store.meta" class="text-purple-200 text-sm">
          {{ store.meta.total }} premium scents available
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Top bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div v-if="store.meta" class="text-sm text-gray-500">
          Showing <span class="font-semibold text-gray-900">{{ store.products.length }}</span>
          of <span class="font-semibold text-gray-900">{{ store.meta.total }}</span> results
          <span v-if="filters.search"> for "<span class="text-purple-700">{{ filters.search }}</span>"</span>
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <select
            v-model="filters.sort"
            @change="onFilterChange"
            class="text-sm border border-purple-200 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A–Z</option>
          </select>

          <div class="flex border border-purple-200 rounded-xl overflow-hidden bg-white">
            <button
              @click="viewMode = 'grid'"
              class="p-2.5 transition"
              :class="viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-purple-50'"
              aria-label="Grid view"
            >
              <i class="ti ti-layout-grid text-sm" aria-hidden="true" />
            </button>
            <button
              @click="viewMode = 'list'"
              class="p-2.5 transition"
              :class="viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-purple-50'"
              aria-label="List view"
            >
              <i class="ti ti-list text-sm" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-6">
        <!-- Sidebar Filters -->
        <aside class="hidden lg:block w-60 flex-shrink-0">
          <div class="card-luxury p-5 sticky top-24">
            <h3 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i class="ti ti-filter text-purple-500" aria-hidden="true" />
              Filters
              <span v-if="activeFilterCount" class="ml-auto text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                {{ activeFilterCount }}
              </span>
            </h3>

            <!-- Search -->
            <div class="mb-5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Search</label>
              <div class="relative">
                <i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm" aria-hidden="true" />
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Search fragrances..."
                  class="w-full pl-9 pr-3 py-2.5 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/30"
                />
              </div>
            </div>

            <!-- Categories -->
            <div class="mb-5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Category</label>
              <div class="space-y-1">
                <button
                  @click="filters.category_id = undefined; filters.page = 1; onFilterChange()"
                  class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition"
                  :class="!filters.category_id ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'"
                >
                  <span>All Categories</span>
                  <span class="text-xs text-gray-400">{{ store.meta?.total ?? 0 }}</span>
                </button>
                <button
                  v-for="cat in store.categories"
                  :key="cat.id"
                  @click="filters.category_id = cat.id; filters.page = 1; onFilterChange()"
                  class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-xl transition"
                  :class="filters.category_id === cat.id ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'"
                >
                  <span>{{ cat.name }}</span>
                  <span class="text-xs text-gray-400">{{ cat.products_count }}</span>
                </button>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-5">
              <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Price Range</label>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="filters.min_price"
                  type="number"
                  min="0"
                  placeholder="Min"
                  @change="filters.page = 1; onFilterChange()"
                  class="w-full px-3 py-2.5 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/30"
                />
                <span class="text-gray-300 flex-shrink-0">—</span>
                <input
                  v-model.number="filters.max_price"
                  type="number"
                  min="0"
                  placeholder="Max"
                  @change="filters.page = 1; onFilterChange()"
                  class="w-full px-3 py-2.5 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/30"
                />
              </div>
            </div>

            <button
              @click="handleReset"
              class="w-full text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-xl py-2.5 transition flex items-center justify-center gap-1.5"
            >
              <i class="ti ti-refresh text-sm" aria-hidden="true" />
              Reset Filters
            </button>
          </div>
        </aside>

        <!-- Main content -->
        <div class="flex-1 min-w-0">
          <!-- Mobile filter button -->
          <div class="lg:hidden flex gap-2 mb-4">
            <button
              @click="showMobileFilters = !showMobileFilters"
              class="flex items-center gap-1.5 text-sm border border-purple-200 bg-white px-4 py-2.5 rounded-xl text-gray-700 hover:bg-purple-50 transition font-medium"
            >
              <i class="ti ti-filter text-purple-500 text-sm" aria-hidden="true" />
              Filters
              <span v-if="activeFilterCount" class="bg-purple-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {{ activeFilterCount }}
              </span>
            </button>
          </div>

          <!-- Mobile filters panel -->
          <Transition name="collapse">
            <div v-if="showMobileFilters" class="lg:hidden card-luxury p-5 mb-4">
              <!-- Search -->
              <div class="mb-4">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Search</label>
                <div class="relative">
                  <i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm" aria-hidden="true" />
                  <input v-model="filters.search" type="text" placeholder="Search fragrances..."
                    class="w-full pl-9 pr-3 py-2.5 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/30" />
                </div>
              </div>
              <!-- Price -->
              <div class="mb-4">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Price Range</label>
                <div class="flex gap-2">
                  <input v-model.number="filters.min_price" type="number" placeholder="Min"
                    class="flex-1 px-3 py-2.5 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/30" />
                  <input v-model.number="filters.max_price" type="number" placeholder="Max"
                    class="flex-1 px-3 py-2.5 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/30" />
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="onFilterChange(); showMobileFilters = false" class="flex-1 btn-primary text-sm py-2.5">Apply</button>
                <button @click="handleReset" class="flex-1 btn-outline text-sm py-2.5">Reset</button>
              </div>
            </div>
          </Transition>

          <!-- Skeleton -->
          <div
            v-if="store.loading"
            :class="viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'"
          >
            <div v-for="n in 12" :key="n" class="card-luxury overflow-hidden animate-pulse"
              :class="viewMode === 'list' ? 'flex gap-4 p-4' : ''">
              <div :class="viewMode === 'grid' ? 'skeleton' : 'w-24 h-24 skeleton rounded-xl flex-shrink-0'"
                :style="viewMode === 'grid' ? 'aspect-ratio:3/4; max-height:200px' : ''" />
              <div class="p-4 space-y-2 flex-1" :class="viewMode === 'list' ? 'p-0' : ''">
                <div class="h-3 skeleton w-1/4" />
                <div class="h-4 skeleton w-3/4" />
                <div class="h-3 skeleton w-1/2" />
                <div class="h-8 skeleton mt-2" />
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="store.error" class="text-center py-20 text-gray-400">
            <i class="ti ti-alert-circle text-4xl block mb-3 text-purple-200" aria-hidden="true" />
            <p class="text-sm">{{ store.error }}</p>
            <button @click="loadProducts" class="mt-4 btn-primary text-sm py-2 px-5">Try again</button>
          </div>

          <!-- Empty -->
          <div v-else-if="!store.products.length" class="text-center py-20 text-gray-400">
            <i class="ti ti-search-off text-4xl block mb-3 text-purple-200" aria-hidden="true" />
            <p class="text-sm font-bold text-gray-600 mb-1">No products found</p>
            <p class="text-sm">Try adjusting your search or filters.</p>
            <button @click="handleReset" class="mt-5 btn-outline text-sm py-2.5 px-6">Clear Filters</button>
          </div>

          <!-- Grid -->
          <div
            v-else-if="viewMode === 'grid'"
            class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <ProductCard
              v-for="p in store.products"
              :key="p.id"
              :product="p"
              @quick-view="quickViewProduct = p"
            />
          </div>

          <!-- List -->
          <div v-else class="space-y-3">
            <div
              v-for="product in store.products"
              :key="product.id"
              class="card-luxury p-4 flex gap-4"
            >
              <RouterLink :to="`/products/${product.id}`" class="flex-shrink-0">
                <div class="w-24 h-24 rounded-xl bg-purple-50 overflow-hidden border border-purple-100">
                  <img v-if="product.image_url" :src="imageUrl(product.image_url)" :alt="product.name"
                    class="w-full h-full object-cover" loading="lazy" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <i class="ti ti-photo text-2xl text-purple-200" aria-hidden="true" />
                  </div>
                </div>
              </RouterLink>
              <div class="flex-1 min-w-0">
                <span v-if="product.category" class="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                  {{ product.category.name }}
                </span>
                <RouterLink :to="`/products/${product.id}`">
                  <h3 class="text-sm font-bold text-gray-900 hover:text-purple-700 transition mt-1 line-clamp-1">
                    {{ product.name }}
                  </h3>
                </RouterLink>
                <p class="text-xs text-gray-400 mt-1 line-clamp-2">{{ product.description }}</p>
                <div v-if="product.rating_avg" class="flex items-center gap-1 mt-1">
                  <i v-for="n in 5" :key="n" class="ti ti-star-filled text-xs"
                    :class="n <= Math.round(product.rating_avg!) ? 'text-amber-400' : 'text-gray-200'" aria-hidden="true" />
                  <span class="text-xs text-gray-400">({{ product.rating_count }})</span>
                </div>
              </div>
              <div class="flex flex-col items-end justify-between flex-shrink-0">
                <span class="text-base font-black text-gray-900">${{ product.price.toFixed(2) }}</span>
                <AddToCartButton :product="product" size="sm" />
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="store.meta && store.meta.last_page > 1" class="mt-10 flex items-center justify-center gap-1.5">
            <button
              @click="goToPage(store.meta.current_page - 1)"
              :disabled="store.meta.current_page === 1"
              class="w-9 h-9 rounded-xl border border-purple-200 text-gray-500 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              <i class="ti ti-chevron-left text-sm" aria-hidden="true" />
            </button>

            <template v-for="page in paginationPages" :key="page">
              <span v-if="page === '...'" class="px-2 text-gray-400 text-sm">…</span>
              <button
                v-else
                @click="goToPage(Number(page))"
                class="w-9 h-9 rounded-xl text-sm border transition font-semibold"
                :class="page === store.meta.current_page
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'border-purple-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700'"
              >
                {{ page }}
              </button>
            </template>

            <button
              @click="goToPage(store.meta.current_page + 1)"
              :disabled="store.meta.current_page === store.meta.last_page"
              class="w-9 h-9 rounded-xl border border-purple-200 text-gray-500 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              <i class="ti ti-chevron-right text-sm" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
    <ProductQuickView :product="quickViewProduct" @close="quickViewProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { imageUrl } from '@/utils/image'
import type { ProductParams } from '@/services/productService'
import type { Product } from '@/types/product'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductQuickView from '@/components/product/ProductQuickView.vue'
import AddToCartButton from '@/components/product/AddToCartButton.vue'

const store = useProductStore()
const route = useRoute()
const router = useRouter()

const viewMode = ref<'grid' | 'list'>('grid')
const showMobileFilters = ref(false)
const searchOpen = ref(false)
const cartOpen = ref(false)
const quickViewProduct = ref<Product | null>(null)

const filters = ref<ProductParams>({
  search: (route.query.search as string) || '',
  category_id: route.query.category_id ? Number(route.query.category_id) : undefined,
  min_price: route.query.min_price ? Number(route.query.min_price) : undefined,
  max_price: route.query.max_price ? Number(route.query.max_price) : undefined,
  sort: (route.query.sort as ProductParams['sort']) || 'newest',
  per_page: 12,
  page: route.query.page ? Number(route.query.page) : 1,
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.search) count++
  if (filters.value.category_id) count++
  if (filters.value.min_price) count++
  if (filters.value.max_price) count++
  return count
})

const paginationPages = computed(() => {
  if (!store.meta) return []
  const { current_page, last_page } = store.meta
  const pages: (number | string)[] = []
  if (last_page <= 7) {
    for (let i = 1; i <= last_page; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current_page > 3) pages.push('...')
    for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) pages.push(i)
    if (current_page < last_page - 2) pages.push('...')
    pages.push(last_page)
  }
  return pages
})

let searchTimer: ReturnType<typeof setTimeout>

function onFilterChange() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { syncQueryParams(); loadProducts() }, 350)
}

function syncQueryParams() {
  const q: Record<string, string> = {}
  if (filters.value.search) q.search = filters.value.search
  if (filters.value.category_id) q.category_id = String(filters.value.category_id)
  if (filters.value.min_price) q.min_price = String(filters.value.min_price)
  if (filters.value.max_price) q.max_price = String(filters.value.max_price)
  if (filters.value.sort) q.sort = filters.value.sort
  if (filters.value.page && filters.value.page > 1) q.page = String(filters.value.page)
  router.replace({ query: q })
}

function loadProducts() {
  store.fetchProducts({ ...filters.value })
}

function goToPage(page: number) {
  if (!store.meta) return
  if (page < 1 || page > store.meta.last_page) return
  filters.value.page = page
  syncQueryParams()
  loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleReset() {
  filters.value = { search: '', category_id: undefined, min_price: undefined, max_price: undefined, sort: 'newest', per_page: 12, page: 1 }
  router.replace({ query: {} })
  loadProducts()
}

watch(() => filters.value.search, () => onFilterChange())

onMounted(async () => {
  await store.fetchCategories()
  loadProducts()
})
</script>

<style scoped>
.collapse-enter-active, .collapse-leave-active { transition: all 0.25s ease; }
.collapse-enter-from, .collapse-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
