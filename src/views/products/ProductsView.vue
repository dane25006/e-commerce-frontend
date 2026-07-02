<template>
  <div class="products-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">{{ $t('products.exclusiveCollection') }}</span>
        <h1 class="hero-title">{{ $t('products.allFragrances') }}</h1>
        <p v-if="store.meta" class="hero-count">{{ $t('products.count', { count: store.meta.total }) }}</p>
      </div>
    </section>

    <div class="page-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <div class="search-wrapper">
            <i class="ti ti-search search-icon" aria-hidden="true" />
            <input
              id="products-search"
              name="search"
              v-model="filters.search"
              type="text"
              :placeholder="$t('search.placeholderProducts')"
              class="search-input"
            />
          </div>
        </div>
        <div class="toolbar-right">
          <span class="product-count">{{ $t('products.count', { count: filteredCount }) }}</span>
          <select
            id="products-sort"
            name="sort"
            v-model="filters.sort"
            @change="onFilterChange"
            class="sort-select"
          >
            <option value="newest">{{ $t('products.sortFeatured') }}</option>
            <option value="price_asc">{{ $t('products.sortPriceLow') }}</option>
            <option value="price_desc">{{ $t('products.sortPriceHigh') }}</option>
            <option value="name_asc">{{ $t('products.sortNameAZ') }}</option>
            <option value="rating">{{ $t('products.sortTopRated') }}</option>
          </select>
          <button
            @click="showMobileFilters = !showMobileFilters"
            class="mobile-filter-btn"
            :aria-label="$t('products.filters')"
          >
            <i class="ti ti-filter text-lg" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div v-if="activeChips.length" class="chips-row">
        <span
          v-for="chip in activeChips"
          :key="chip.key + ':' + chip.value"
          class="chip"
          @click="chip.remove"
        >
          {{ chip.label }}
          <i class="ti ti-x chip-x" aria-hidden="true" />
        </span>
        <button @click="handleReset" class="chip-clear">{{ $t('products.clearAll') }}</button>
      </div>

      <Transition name="collapse">
        <div v-if="showMobileFilters" class="mobile-filters-drawer">
          <div class="mobile-filters-header">
            <span class="mobile-filters-title">{{ $t('products.filters') }}</span>
            <button @click="showMobileFilters = false" class="mobile-filters-close"><i class="ti ti-x" /></button>
          </div>
          <div class="mobile-filters-body">
            <div class="mobile-filter-group">
              <button @click="filterOpen.gender = !filterOpen.gender" class="mobile-filter-toggle">
                {{ $t('products.gender') }}
                <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.gender }" aria-hidden="true" />
              </button>
              <Transition name="filter-collapse">
                <div v-if="filterOpen.gender" class="mobile-filter-options">
                  <div v-for="g in filterOptions.genders" :key="g" class="filter-checkbox">
                    <input :id="'mg-'+g" type="checkbox" :checked="filters.gender?.includes(g)" @change="toggleFilter('gender', g)" class="checkbox-input" />
                    <label :for="'mg-'+g" class="checkbox-label">{{ g }}</label>
                  </div>
                </div>
              </Transition>
            </div>
            <div class="mobile-filter-group">
              <button @click="filterOpen.categories = !filterOpen.categories" class="mobile-filter-toggle">
                {{ $t('products.categories') }}
                <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.categories }" aria-hidden="true" />
              </button>
              <Transition name="filter-collapse">
                <div v-if="filterOpen.categories" class="mobile-filter-options">
                  <CategoryFilter active-slug="" />
                </div>
              </Transition>
            </div>
            <div class="mobile-filter-group">
              <button @click="filterOpen.brand = !filterOpen.brand" class="mobile-filter-toggle">
                {{ $t('products.brand') }}
                <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.brand }" aria-hidden="true" />
              </button>
              <Transition name="filter-collapse">
                <div v-if="filterOpen.brand" class="mobile-filter-options">
                  <div v-for="b in filterOptions.brands" :key="b" class="filter-checkbox">
                    <input :id="'mb-'+b" type="checkbox" :checked="filters.brand?.includes(b)" @change="toggleFilter('brand', b)" class="checkbox-input" />
                    <label :for="'mb-'+b" class="checkbox-label">{{ b }}</label>
                  </div>
                </div>
              </Transition>
            </div>
            <div class="mobile-filter-group">
              <button @click="filterOpen.type = !filterOpen.type" class="mobile-filter-toggle">
                {{ $t('products.type') }}
                <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.type }" aria-hidden="true" />
              </button>
              <Transition name="filter-collapse">
                <div v-if="filterOpen.type" class="mobile-filter-options">
                  <div v-for="t in filterOptions.types" :key="t" class="filter-checkbox">
                    <input :id="'mt-'+t" type="checkbox" :checked="filters.type?.includes(t)" @change="toggleFilter('type', t)" class="checkbox-input" />
                    <label :for="'mt-'+t" class="checkbox-label">{{ t }}</label>
                  </div>
                </div>
              </Transition>
            </div>
            <div class="mobile-filter-group">
              <button @click="filterOpen.department = !filterOpen.department" class="mobile-filter-toggle">
                {{ $t('products.department') }}
                <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.department }" aria-hidden="true" />
              </button>
              <Transition name="filter-collapse">
                <div v-if="filterOpen.department" class="mobile-filter-options">
                  <div v-for="d in filterOptions.departments" :key="d" class="filter-checkbox">
                    <input :id="'md-'+d" type="checkbox" :checked="filters.department?.includes(d)" @change="toggleFilter('department', d)" class="checkbox-input" />
                    <label :for="'md-'+d" class="checkbox-label">{{ d }}</label>
                  </div>
                </div>
              </Transition>
            </div>
            <div class="mobile-filter-group">
              <button @click="filterOpen.price = !filterOpen.price" class="mobile-filter-toggle">
                {{ $t('products.priceRange') }}
                <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.price }" aria-hidden="true" />
              </button>
              <Transition name="filter-collapse">
                <div v-if="filterOpen.price" class="mobile-filter-options">
                  <input id="products-price-mobile" name="price" type="range" :min="0" :max="maxPrice" :value="maxPrice" step="5" @input="onPriceInput" class="price-range" />
                  <div class="price-labels">
                    <span>$0</span>
                    <span>up to ${{ currentPrice }}</span>
                  </div>
                </div>
              </Transition>
            </div>
            <div class="mobile-filter-group">
              <button @click="filterOpen.availability = !filterOpen.availability" class="mobile-filter-toggle">
                {{ $t('products.availability') }}
                <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.availability }" aria-hidden="true" />
              </button>
              <Transition name="filter-collapse">
                <div v-if="filterOpen.availability" class="mobile-filter-options">
                  <div class="availability-row">
                    <span>{{ $t('products.inStockOnly') }}</span>
                    <button type="button" role="switch" :aria-checked="filters.in_stock !== false" @click="filters.in_stock = filters.in_stock === false ? undefined : false; onFilterChange()"
                      class="toggle" :class="filters.in_stock !== false ? 'toggle-active' : 'toggle-inactive'">
                      <span class="toggle-knob" :class="filters.in_stock !== false ? 'toggle-knob-active' : ''" />
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          <div class="mobile-filters-actions">
            <button @click="showMobileFilters = false; loadProducts()" class="btn-primary flex-1">{{ $t('products.apply') }}</button>
            <button @click="handleReset" class="btn-secondary flex-1">{{ $t('products.reset') }}</button>
          </div>
        </div>
      </Transition>

      <div class="layout">
        <aside class="sidebar">
          <div class="card filter-card">
            <button @click="filterOpen.gender = !filterOpen.gender" class="filter-header">
              {{ $t('products.gender') }}
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.gender }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.gender" class="filter-body">
                <div v-for="g in filterOptions.genders" :key="g" class="filter-checkbox" @click="toggleFilter('gender', g)">
                  <input :id="'ps-g-'+g" name="gender" type="checkbox" :checked="filters.gender?.includes(g)" class="checkbox-input" />
                  <label class="checkbox-label">{{ g }}</label>
                  <span class="filter-count">{{ countsBy('gender', g) }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.categories = !filterOpen.categories" class="filter-header">
              {{ $t('products.categories') }}
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.categories }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.categories" class="filter-body">
                <CategoryFilter active-slug="" />
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.brand = !filterOpen.brand" class="filter-header">
              {{ $t('products.brand') }}
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.brand }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.brand" class="filter-body">
                <div v-for="b in filterOptions.brands" :key="b" class="filter-checkbox" @click="toggleFilter('brand', b)">
                  <input :id="'ps-b-'+b" name="brand" type="checkbox" :checked="filters.brand?.includes(b)" class="checkbox-input" />
                  <label class="checkbox-label">{{ b }}</label>
                  <span class="filter-count">{{ countsBy('brand', b) }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.type = !filterOpen.type" class="filter-header">
              {{ $t('products.type') }}
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.type }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.type" class="filter-body">
                <div v-for="t in filterOptions.types" :key="t" class="filter-checkbox" @click="toggleFilter('type', t)">
                  <input :id="'ps-t-'+t" name="type" type="checkbox" :checked="filters.type?.includes(t)" class="checkbox-input" />
                  <label class="checkbox-label">{{ t }}</label>
                  <span class="filter-count">{{ countsBy('type', t) }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.department = !filterOpen.department" class="filter-header">
              {{ $t('products.department') }}
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.department }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.department" class="filter-body">
                <div v-for="d in filterOptions.departments" :key="d" class="filter-checkbox" @click="toggleFilter('department', d)">
                  <input :id="'ps-d-'+d" name="department" type="checkbox" :checked="filters.department?.includes(d)" class="checkbox-input" />
                  <label class="checkbox-label">{{ d }}</label>
                  <span class="filter-count">{{ countsBy('department', d) }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.price = !filterOpen.price" class="filter-header">
              {{ $t('products.priceRange') }}
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.price }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.price" class="filter-body">
                <input id="products-price-desktop" name="price" type="range" :min="0" :max="maxPrice" :value="currentPrice" step="5" @input="onPriceInput" class="price-range" />
                <div class="price-labels">
                  <span>$0</span>
                  <span>up to ${{ currentPrice }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.availability = !filterOpen.availability" class="filter-header">
              {{ $t('products.availability') }}
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.availability }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.availability" class="filter-body">
                <div class="availability-row">
                  <span>{{ $t('products.inStockOnly') }}</span>
                  <button type="button" role="switch" :aria-checked="filters.in_stock !== false" @click="filters.in_stock = filters.in_stock === false ? undefined : false; onFilterChange()"
                    class="toggle" :class="filters.in_stock !== false ? 'toggle-active' : 'toggle-inactive'">
                    <span class="toggle-knob" :class="filters.in_stock !== false ? 'toggle-knob-active' : ''" />
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </aside>

        <div class="main-content">
          <div v-if="store.loading" class="product-grid">
            <div v-for="n in 12" :key="n" class="card skeleton-card">
              <div class="skeleton skeleton-img" />
              <div class="skeleton-content">
                <div class="skeleton skeleton-badge" />
                <div class="skeleton skeleton-title" />
                <div class="skeleton skeleton-subtitle" />
                <div class="skeleton skeleton-rating" />
                <div class="skeleton skeleton-footer" />
              </div>
            </div>
          </div>

          <div v-else-if="store.error" class="state-card">
            <i class="ti ti-alert-circle state-icon" aria-hidden="true" />
            <p class="state-text">{{ $t('products.errorLoading') }}</p>
            <button @click="loadProducts" class="btn-primary">{{ $t('products.tryAgain') }}</button>
          </div>

          <div v-else-if="!store.products.length" class="state-card">
            <i class="ti ti-mood-empty state-icon" aria-hidden="true" />
            <p class="state-text">{{ $t('products.emptyFilters') }}</p>
            <button @click="handleReset" class="btn-secondary">{{ $t('products.clearFilters') }}</button>
          </div>

          <div v-else class="product-grid">
            <ProductCard
              v-for="p in store.products"
              :key="p.id"
              :product="p"
              @quick-view="openQuickView"
            />
          </div>

          <div v-if="store.meta && store.meta.last_page > 1" class="pagination">
            <button
              @click="goToPage(store.meta.current_page - 1)"
              :disabled="store.meta.current_page === 1"
              class="page-btn"
            >
              <i class="ti ti-chevron-left" aria-hidden="true" />
            </button>
            <template v-for="page in paginationPages" :key="page">
              <span v-if="page === '...'" class="page-dots">&hellip;</span>
              <button
                v-else
                @click="goToPage(Number(page))"
                class="page-btn"
                :class="page === store.meta.current_page ? 'page-btn-active' : ''"
              >
                {{ page }}
              </button>
            </template>
            <button
              @click="goToPage(store.meta.current_page + 1)"
              :disabled="store.meta.current_page === store.meta.last_page"
              class="page-btn"
            >
              <i class="ti ti-chevron-right" aria-hidden="true" />
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
import { useI18n } from 'vue-i18n'
import { useProductStore } from '@/stores/product'
import { productService, type ProductParams } from '@/services/productService'
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
import { CategoryFilter } from '@/features/categories'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductQuickView from '@/components/product/ProductQuickView.vue'

const { t } = useI18n()
const store = useProductStore()
const route = useRoute()
const router = useRouter()

const quickViewProduct = ref<Product | null>(null)
const openQuickView = (product: Product) => { quickViewProduct.value = product }

const showMobileFilters = ref(false)
const searchOpen = ref(false)
const cartOpen = ref(false)
const currentPrice = ref(300)
const filterOpen = reactive<Record<string, boolean>>({
  gender: true,
  categories: true,
  brand: true,
  type: true,
  department: true,
  price: true,
  availability: true,
})

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
      label: t('products.inStockOnly'),
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
:root {
  --background: #FAF8F5;
  --surface: #FFFFFF;
  --primary: #B88A44;
  --primary-hover: #A7772F;
  --secondary: #2B2B2B;
  --text: #222222;
  --text-muted: #6F6F6F;
  --border: #E7E1D8;
  --radius: 18px;
  --radius-sm: 10px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,.04);
  --shadow: 0 10px 30px rgba(0,0,0,.08);
}

.products-page {
  min-height: 100vh;
  background: var(--background);
  color: var(--text);
  font-family: var(--font-body);
}

.hero-section {
  background: linear-gradient(135deg, #2B241E, #1A1614);
  padding: 80px 24px;
  text-align: center;
  position: relative;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 16px;
  border-radius: 100px;
  background: rgba(184,138,68,0.12);
  color: var(--primary);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: var(--surface);
  margin: 0 0 12px;
  letter-spacing: 0.01em;
  line-height: 1.15;
}

.hero-count {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  margin: 0;
  font-weight: 400;
}

.page-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.toolbar-left {
  flex: 1;
  min-width: 180px;
  max-width: 360px;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: var(--primary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border-radius: 100px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-count {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.sort-select {
  padding: 10px 16px;
  border-radius: 100px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 13px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: auto;
}

.sort-select:focus {
  border-color: var(--primary);
}

.mobile-filter-btn {
  display: none;
  padding: 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  transition: border-color 0.2s;
}

.mobile-filter-btn:hover {
  border-color: var(--primary);
}

@media (max-width: 1023px) {
  .mobile-filter-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.chips-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
  align-items: center;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(184,138,68,0.12);
  color: var(--primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.chip:hover {
  background: rgba(184,138,68,0.2);
}

.chip-x {
  font-size: 14px;
  line-height: 1;
}

.chip-clear {
  font-size: 12px;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 4px;
}

.chip-clear:hover {
  color: var(--text);
}

.layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.sidebar {
  width: 220px;
  flex-shrink: 0;
  display: none;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 1024px) {
  .sidebar {
    display: flex;
  }
}

.card {
  background: var(--surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.filter-card {
  overflow: hidden;
}

.filter-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
}

.chevron {
  font-size: 10px;
  transition: transform 0.25s ease;
  color: var(--primary);
}

.chevron.is-open {
  transform: rotate(180deg);
}

.filter-body {
  padding: 0 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 0;
  user-select: none;
}

.checkbox-input {
  width: 15px;
  height: 15px;
  accent-color: var(--primary);
  cursor: pointer;
  border-radius: 3px;
}

.checkbox-label {
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  flex: 1;
}

.filter-count {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 100px;
  background: var(--background);
  color: var(--text-muted);
}

.price-range {
  width: 100%;
  accent-color: var(--primary);
  margin: 4px 0;
}

.price-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 4px;
}

.availability-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-muted);
}

.toggle {
  position: relative;
  display: inline-flex;
  height: 20px;
  width: 36px;
  flex-shrink: 0;
  border-radius: 100px;
  border: 2px solid transparent;
  transition: background 0.25s;
  cursor: pointer;
  padding: 0;
}

.toggle-active {
  background: var(--primary);
}

.toggle-inactive {
  background: #D1D1D1;
}

.toggle-knob {
  pointer-events: none;
  display: inline-block;
  height: 16px;
  width: 16px;
  transform: translateX(0);
  border-radius: 50%;
  background: var(--surface);
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  transition: transform 0.25s;
}

.toggle-knob-active {
  transform: translateX(16px);
}

.main-content {
  flex: 1;
  min-width: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.skeleton-card {
  overflow: hidden;
}

.skeleton {
  background: linear-gradient(90deg, #F0EDE8 25%, #E7E1D8 50%, #F0EDE8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-img {
  aspect-ratio: 3/4;
  width: 100%;
}

.skeleton-content {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-badge {
  height: 10px;
  width: 60px;
  border-radius: 100px;
}

.skeleton-title {
  height: 16px;
  width: 100%;
  border-radius: 6px;
}

.skeleton-subtitle {
  height: 12px;
  width: 70%;
  border-radius: 6px;
}

.skeleton-rating {
  height: 12px;
  width: 50%;
  border-radius: 6px;
}

.skeleton-footer {
  height: 20px;
  width: 40%;
  border-radius: 6px;
}

.state-card {
  text-align: center;
  padding: 64px 24px;
}

.state-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
  color: rgba(184,138,68,0.25);
}

.state-text {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0 0 16px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 28px;
  border-radius: 100px;
  background: var(--primary);
  color: var(--surface);
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 28px;
  border-radius: 100px;
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.pagination {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.page-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.page-btn-active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--surface);
}

.page-btn-active:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  color: var(--surface);
}

.page-dots {
  padding: 0 4px;
  font-size: 14px;
  color: var(--text-muted);
}

.mobile-filters-drawer {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 20px;
  margin-bottom: 20px;
}

@media (min-width: 1024px) {
  .mobile-filters-drawer {
    display: none;
  }
}

.mobile-filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.mobile-filters-title {
  font-size: 15px;
  font-weight: 600;
}

.mobile-filters-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
}

.mobile-filters-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-filter-group {
  border-bottom: 1px solid var(--border);
  padding: 8px 0;
}

.mobile-filter-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 0;
}

.mobile-filter-options {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mobile-filters-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.flex-1 {
  flex: 1;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.25s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.filter-collapse-enter-active,
.filter-collapse-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.filter-collapse-enter-from,
.filter-collapse-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}

.filter-collapse-enter-to,
.filter-collapse-leave-from {
  max-height: 300px;
}
</style>
