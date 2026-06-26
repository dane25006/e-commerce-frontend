<template>
  <div class="min-h-screen" style="background:#F8F5FF">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <!-- Page Header -->
    <div class="bg-gradient-to-br from-purple-600 to-violet-700 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-purple-200 text-xs font-bold uppercase tracking-widest block mb-2">Our Collection</span>
        <h1 class="text-3xl md:text-4xl font-black text-white mb-2">All Fragrances</h1>
        <p v-if="store.meta" class="text-purple-200 text-sm">{{ store.meta.total }} premium scents available</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Top Bar -->
      <div class="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <div class="relative flex-1 min-w-[180px] max-w-xs">
            <i class="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" aria-hidden="true" />
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search perfumes..."
              class="w-full pl-8 pr-3 py-1.5 text-sm border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/40"
            />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 shrink-0">{{ filteredCount }} product{{ filteredCount !== 1 ? 's' : '' }}</span>
          <select
            v-model="filters.sort"
            @change="onFilterChange"
            class="sort-select"
          >
            <option value="newest">Sort: featured</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name_asc">Name A–Z</option>
            <option value="rating">Top rated</option>
          </select>
          <button
            @click="showMobileFilters = !showMobileFilters"
            class="lg:hidden p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
            aria-label="Filters"
          >
            <i class="ti ti-filter text-lg" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Active Filter Chips -->
      <div v-if="activeChips.length" class="flex flex-wrap gap-1.5 mb-3">
        <span
          v-for="chip in activeChips"
          :key="chip.key + ':' + chip.value"
          class="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium cursor-pointer"
          @click="chip.remove"
        >
          {{ chip.label }}
          <i class="ti ti-x text-sm" aria-hidden="true" />
        </span>
        <button @click="handleReset" class="text-xs text-gray-400 hover:text-red-500 px-2 py-1">Clear all</button>
      </div>

      <!-- Mobile Filters Panel -->
      <Transition name="collapse">
        <div v-if="showMobileFilters" class="lg:hidden bg-white border border-purple-200 rounded-xl p-4 mb-4 space-y-4">
          <div>
            <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Gender</div>
            <div v-for="g in filterOptions.genders" :key="g" class="flex items-center gap-2 py-0.5">
              <input :id="'mg-'+g" type="checkbox" :checked="filters.gender?.includes(g)" @change="toggleFilter('gender', g)" class="w-3.5 h-3.5 accent-purple-600" />
              <label :for="'mg-'+g" class="text-sm text-gray-700 cursor-pointer select-none">{{ g }}</label>
            </div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Brand</div>
            <div v-for="b in filterOptions.brands" :key="b" class="flex items-center gap-2 py-0.5">
              <input :id="'mb-'+b" type="checkbox" :checked="filters.brand?.includes(b)" @change="toggleFilter('brand', b)" class="w-3.5 h-3.5 accent-purple-600" />
              <label :for="'mb-'+b" class="text-sm text-gray-700 cursor-pointer select-none">{{ b }}</label>
            </div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</div>
            <div v-for="t in filterOptions.types" :key="t" class="flex items-center gap-2 py-0.5">
              <input :id="'mt-'+t" type="checkbox" :checked="filters.type?.includes(t)" @change="toggleFilter('type', t)" class="w-3.5 h-3.5 accent-purple-600" />
              <label :for="'mt-'+t" class="text-sm text-gray-700 cursor-pointer select-none">{{ t }}</label>
            </div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Department</div>
            <div v-for="d in filterOptions.departments" :key="d" class="flex items-center gap-2 py-0.5">
              <input :id="'md-'+d" type="checkbox" :checked="filters.department?.includes(d)" @change="toggleFilter('department', d)" class="w-3.5 h-3.5 accent-purple-600" />
              <label :for="'md-'+d" class="text-sm text-gray-700 cursor-pointer select-none">{{ d }}</label>
            </div>
          </div>
          <div>
            <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price range</div>
            <input type="range" :min="0" :max="maxPrice" :value="maxPrice" step="5" @input="onPriceInput" class="w-full accent-purple-600" />
            <div class="flex items-center justify-between text-xs text-gray-400 mt-1">
              <span>$0</span>
              <span>up to ${{ currentPrice }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-700">In stock only</span>
            <button type="button" role="switch" :aria-checked="filters.in_stock !== false" @click="filters.in_stock = filters.in_stock === false ? undefined : false; onFilterChange()"
              class="relative inline-flex h-4.5 w-8 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200"
              :class="filters.in_stock !== false ? 'bg-purple-600' : 'bg-gray-300'">
              <span class="pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200"
                :class="filters.in_stock !== false ? 'translate-x-[14px]' : 'translate-x-0'" />
            </button>
          </div>
          <div class="flex gap-2 pt-2">
            <button @click="showMobileFilters = false; loadProducts()" class="flex-1 btn-primary text-sm py-2">Apply</button>
            <button @click="handleReset" class="flex-1 btn-outline text-sm py-2">Reset</button>
          </div>
        </div>
      </Transition>

      <!-- Desktop Layout -->
      <div class="flex gap-4 items-start">
        <!-- Sidebar -->
        <aside class="hidden lg:block w-[200px] shrink-0">
          <div class="space-y-3">
            <!-- Gender -->
            <div class="bg-white border border-purple-200/60 rounded-xl p-3">
              <div class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Gender</div>
              <div v-for="g in filterOptions.genders" :key="g" class="flex items-center justify-between py-0.5 cursor-pointer select-none" @click="toggleFilter('gender', g)">
                <label class="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" :checked="filters.gender?.includes(g)" @click.stop="toggleFilter('gender', g)" class="w-3.5 h-3.5 accent-purple-600 cursor-pointer" />
                  {{ g }}
                </label>
                <span class="text-[11px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{{ countsBy('gender', g) }}</span>
              </div>
            </div>

            <!-- Brand -->
            <div class="bg-white border border-purple-200/60 rounded-xl p-3">
              <div class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Brand</div>
              <div v-for="b in filterOptions.brands" :key="b" class="flex items-center justify-between py-0.5 cursor-pointer select-none" @click="toggleFilter('brand', b)">
                <label class="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" :checked="filters.brand?.includes(b)" @click.stop="toggleFilter('brand', b)" class="w-3.5 h-3.5 accent-purple-600 cursor-pointer" />
                  {{ b }}
                </label>
                <span class="text-[11px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{{ countsBy('brand', b) }}</span>
              </div>
            </div>

            <!-- Type -->
            <div class="bg-white border border-purple-200/60 rounded-xl p-3">
              <div class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Type</div>
              <div v-for="t in filterOptions.types" :key="t" class="flex items-center justify-between py-0.5 cursor-pointer select-none" @click="toggleFilter('type', t)">
                <label class="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" :checked="filters.type?.includes(t)" @click.stop="toggleFilter('type', t)" class="w-3.5 h-3.5 accent-purple-600 cursor-pointer" />
                  {{ t }}
                </label>
                <span class="text-[11px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{{ countsBy('type', t) }}</span>
              </div>
            </div>

            <!-- Department -->
            <div class="bg-white border border-purple-200/60 rounded-xl p-3">
              <div class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Department</div>
              <div v-for="d in filterOptions.departments" :key="d" class="flex items-center justify-between py-0.5 cursor-pointer select-none" @click="toggleFilter('department', d)">
                <label class="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" :checked="filters.department?.includes(d)" @click.stop="toggleFilter('department', d)" class="w-3.5 h-3.5 accent-purple-600 cursor-pointer" />
                  {{ d }}
                </label>
                <span class="text-[11px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{{ countsBy('department', d) }}</span>
              </div>
            </div>

            <!-- Price range -->
            <div class="bg-white border border-purple-200/60 rounded-xl p-3">
              <div class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Price range</div>
              <input type="range" :min="0" :max="maxPrice" :value="currentPrice" step="5" @input="onPriceInput" class="w-full accent-purple-600" />
              <div class="flex items-center justify-between text-xs text-gray-400 mt-1">
                <span>$0</span>
                <span>up to ${{ currentPrice }}</span>
              </div>
            </div>

            <!-- Availability -->
            <div class="bg-white border border-purple-200/60 rounded-xl p-3">
              <div class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Availability</div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700">In stock only</span>
                <button type="button" role="switch" :aria-checked="filters.in_stock !== false" @click="filters.in_stock = filters.in_stock === false ? undefined : false; onFilterChange()"
                  class="relative inline-flex h-4.5 w-8 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200"
                  :class="filters.in_stock !== false ? 'bg-purple-600' : 'bg-gray-300'">
                  <span class="pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200"
                    :class="filters.in_stock !== false ? 'translate-x-[14px]' : 'translate-x-0'" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Products -->
        <div class="flex-1 min-w-0">
          <!-- Loading -->
          <div v-if="store.loading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            <div v-for="n in 12" :key="n" class="bg-white border border-purple-200/60 rounded-xl overflow-hidden animate-pulse">
              <div class="aspect-square skeleton" />
              <div class="p-3 space-y-2">
                <div class="h-3 skeleton w-2/3" />
                <div class="h-4 skeleton w-3/4" />
                <div class="h-3 skeleton w-1/2" />
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-else-if="store.error" class="text-center py-16 text-gray-400">
            <i class="ti ti-alert-circle text-4xl block mb-3 text-purple-200" aria-hidden="true" />
            <p class="text-sm">{{ store.error }}</p>
            <button @click="loadProducts" class="mt-4 btn-primary text-sm py-2 px-5">Try again</button>
          </div>

          <!-- Empty -->
          <div v-else-if="!store.products.length" class="text-center py-16 text-gray-400">
            <i class="ti ti-mood-empty text-4xl block mb-2 text-purple-200" aria-hidden="true" />
            <p class="text-sm">No products match your filters</p>
            <button @click="handleReset" class="mt-4 btn-outline text-sm py-2 px-5">Clear filters</button>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            <div
              v-for="p in store.products"
              :key="p.id"
              class="product-card"
            >
              <RouterLink :to="`/products/${p.id}`" class="block">
                <div class="relative aspect-square bg-purple-50/60 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="p.image_url"
                    :src="imageUrl(p.image_url)"
                    :alt="p.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <i v-else class="ti ti-sparkles text-4xl text-purple-200" aria-hidden="true" />
                  <span
                    class="absolute top-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded"
                    :class="p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ p.stock > 0 ? 'In stock' : 'Out of stock' }}
                  </span>
                  <button
                    @click.prevent="toggleWishlist(p.id)"
                    class="absolute top-1.5 right-1.5 text-lg p-1 leading-none"
                    :class="wishlistStore.isWishlisted(p.id) ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'"
                    aria-label="Toggle wishlist"
                  >
                    <i class="ti ti-heart" aria-hidden="true" />
                  </button>
                </div>
              </RouterLink>
              <div class="p-2.5">
                <div class="text-[11px] text-gray-400 mb-0.5">{{ p.brand || p.category?.name || '' }}</div>
                <RouterLink :to="`/products/${p.id}`">
                  <div class="text-sm font-medium text-gray-900 leading-tight mb-0.5 line-clamp-1">{{ p.name }}</div>
                </RouterLink>
                <div class="text-[11px] text-gray-500 mb-2">
                  {{ p.type || '' }}{{ p.type && p.gender ? ' · ' : '' }}{{ p.gender || '' }}{{ p.rating_avg ? ' · ★ ' + p.rating_avg : '' }}
                </div>
                <div class="flex items-center justify-between gap-1">
                  <span class="text-sm font-medium text-gray-900">{{ formatPrice(p.price) }}</span>
                  <AddToCartButton :product="p" size="sm" />
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="store.meta && store.meta.last_page > 1" class="mt-8 flex items-center justify-center gap-1.5">
            <button
              @click="goToPage(store.meta.current_page - 1)"
              :disabled="store.meta.current_page === 1"
              class="w-8 h-8 rounded-lg border border-purple-200 text-gray-500 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              <i class="ti ti-chevron-left text-sm" aria-hidden="true" />
            </button>
            <template v-for="page in paginationPages" :key="page">
              <span v-if="page === '...'" class="px-1.5 text-gray-400 text-sm">&hellip;</span>
              <button
                v-else
                @click="goToPage(Number(page))"
                class="w-8 h-8 rounded-lg text-sm border transition font-semibold"
                :class="page === store.meta.current_page ? 'bg-purple-600 text-white border-purple-600' : 'border-purple-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700'"
              >
                {{ page }}
              </button>
            </template>
            <button
              @click="goToPage(store.meta.current_page + 1)"
              :disabled="store.meta.current_page === store.meta.last_page"
              class="w-8 h-8 rounded-lg border border-purple-200 text-gray-500 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center"
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
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useWishlistStore } from '@/stores/wishlist'
import { productService } from '@/services/productService'
import { imageUrl } from '@/utils/image'
import { formatPrice } from '@/utils/price'
import type { ProductParams } from '@/services/productService'
import type { Product, FilterValues } from '@/types/product'

interface Filters {
  search:      string
  category_id: number | undefined
  gender:      string[] | undefined
  brand:       string[] | undefined
  type:        string[] | undefined
  department:  string[] | undefined
  min_price:   number | undefined
  max_price:   number | undefined
  in_stock:    boolean | undefined
  sort:        ProductParams['sort']
  per_page:    number
  page:        number
}

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductQuickView from '@/components/product/ProductQuickView.vue'
import AddToCartButton from '@/components/product/AddToCartButton.vue'

const store = useProductStore()
const wishlistStore = useWishlistStore()
const route = useRoute()
const router = useRouter()

const showMobileFilters = ref(false)
const searchOpen = ref(false)
const cartOpen = ref(false)
const quickViewProduct = ref<Product | null>(null)
const currentPrice = ref(300)

const filterOptions = reactive<FilterValues>({
  genders: [],
  brands: [],
  types: [],
  departments: [],
})

function parseArr(key: string): string[] | undefined {
  const v = route.query[key] as string | undefined
  if (!v) return undefined
  return v.split(',')
}

const filters = ref<Filters>({
  search: (route.query.search as string) || '',
  category_id: route.query.category_id ? Number(route.query.category_id) : undefined,
  gender: parseArr('gender'),
  brand: parseArr('brand'),
  type: parseArr('type'),
  department: parseArr('department'),
  min_price: undefined,
  max_price: route.query.max_price ? Number(route.query.max_price) : undefined,
  in_stock: route.query.in_stock !== undefined ? route.query.in_stock !== 'false' : undefined,
  sort: (route.query.sort as ProductParams['sort']) || 'newest',
  per_page: 12,
  page: route.query.page ? Number(route.query.page) : 1,
})

const maxPrice = computed(() => {
  const prices = store.products.map(p => Number(p.price))
  return prices.length ? Math.max(...prices, 300) : 300
})

function toggleFilter(key: 'gender' | 'brand' | 'type' | 'department', value: string) {
  const arr = filters.value[key]
  if (!arr) {
    filters.value[key] = [value]
  } else {
    const idx = arr.indexOf(value)
    if (idx >= 0) {
      arr.splice(idx, 1)
      if (arr.length === 0) filters.value[key] = undefined
    } else {
      arr.push(value)
    }
  }
  filters.value.page = 1
  onFilterChange()
}

function onPriceInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  currentPrice.value = val
  filters.value.max_price = val >= maxPrice.value ? undefined : val
  filters.value.page = 1
  onFilterChange()
}

function countsBy(field: string, value: string): number {
  return store.products.filter((p: Record<string, unknown>) => String(p[field] ?? '') === value).length
}

const activeChips = computed(() => {
  const chips: { key: string; value: string; label: string; remove: () => void }[] = []
  const fields = ['gender', 'brand', 'type', 'department'] as const
  for (const f of fields) {
    const arr = filters.value[f]
    if (arr) {
      for (const v of arr) {
        chips.push({
          key: f,
          value: v,
          label: v,
          remove: () => toggleFilter(f, v),
        })
      }
    }
  }
  if (filters.value.in_stock === false) {
    chips.push({
      key: 'in_stock',
      value: 'false',
      label: 'In stock',
      remove: () => { filters.value.in_stock = undefined; onFilterChange() },
    })
  }
  return chips
})

const filteredCount = computed(() => store.products.length)

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
  if (filters.value.gender?.length) q.gender = filters.value.gender.join(',')
  if (filters.value.brand?.length) q.brand = filters.value.brand.join(',')
  if (filters.value.type?.length) q.type = filters.value.type.join(',')
  if (filters.value.department?.length) q.department = filters.value.department.join(',')
  if (filters.value.max_price) q.max_price = String(filters.value.max_price)
  if (filters.value.in_stock === false) q.in_stock = 'false'
  if (filters.value.sort) q.sort = filters.value.sort
  if (filters.value.page && filters.value.page > 1) q.page = String(filters.value.page)
  router.replace({ query: q })
}

function loadProducts() {
  const params: ProductParams = {
    search: filters.value.search || undefined,
    category_id: filters.value.category_id,
    gender: filters.value.gender?.join(','),
    brand: filters.value.brand?.join(','),
    type: filters.value.type?.join(','),
    department: filters.value.department?.join(','),
    min_price: undefined,
    max_price: filters.value.max_price,
    in_stock: filters.value.in_stock,
    sort: filters.value.sort,
    per_page: 12,
    page: filters.value.page,
  }
  store.fetchProducts(params)
}

function goToPage(page: number) {
  if (!store.meta) return
  if (page < 1 || page > store.meta.last_page) return
  filters.value.page = page
  syncQueryParams()
  loadProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleWishlist(productId: number) {
  wishlistStore.toggle(productId)
}

function handleReset() {
  filters.value = {
    search: '',
    category_id: undefined,
    gender: undefined,
    brand: undefined,
    type: undefined,
    department: undefined,
    min_price: undefined,
    max_price: undefined,
    in_stock: undefined,
    sort: 'newest',
    per_page: 12,
    page: 1,
  }
  currentPrice.value = 300
  router.replace({ query: {} })
  loadProducts()
}

watch(() => filters.value.search, () => onFilterChange())

onMounted(async () => {
  const maxP = route.query.max_price ? Number(route.query.max_price) : 300
  currentPrice.value = maxP
  await Promise.all([
    store.fetchCategories(),
    productService.getFilters().then(({ data }) => {
      filterOptions.genders = data.genders
      filterOptions.brands = data.brands
      filterOptions.types = data.types
      filterOptions.departments = data.departments
    }).catch(() => {}),
  ])
  loadProducts()
})
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.25s ease;
}
.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.sort-select {
  padding: 5px 26px 5px 10px;
  border: 0.5px solid #ddd6fe;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  outline: none;
}
.sort-select:focus {
  ring: 2px solid #a78bfa;
  border-color: #a78bfa;
}

.product-card {
  background: white;
  border: 0.5px solid #e9ddfe;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.product-card:hover {
  border-color: #c4b5fd;
}
</style>
