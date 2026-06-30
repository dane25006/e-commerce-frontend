<template>
  <div class="category-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">Explore</span>
        <h1 class="hero-title">{{ categoryLabel ?? 'Category' }}</h1>
        <p v-if="store.meta" class="hero-count">{{ store.meta.total }} products</p>
      </div>
    </section>

    <div class="page-container">
      <div class="breadcrumb">
        <RouterLink to="/products" class="breadcrumb-link">
          <i class="ti ti-arrow-left" aria-hidden="true" />
          All Products
        </RouterLink>
      </div>

      <div v-if="store.loading" class="product-grid">
        <div v-for="n in 12" :key="n" class="card skeleton-card">
          <div class="skeleton skeleton-img" />
          <div class="skeleton-content">
            <div class="skeleton skeleton-title" />
            <div class="skeleton skeleton-subtitle" />
            <div class="skeleton skeleton-footer" />
          </div>
        </div>
      </div>

      <div v-else-if="store.error" class="state-card">
        <i class="ti ti-alert-circle state-icon" aria-hidden="true" />
        <p class="state-text">Something went wrong while loading this category. Please try again.</p>
      </div>

      <div v-else-if="!store.products.length" class="state-card">
        <i class="ti ti-mood-empty state-icon" aria-hidden="true" />
        <p class="state-text">We couldn&rsquo;t find any products in this category. Explore our full collection instead.</p>
        <RouterLink to="/products" class="btn-secondary">Browse All</RouterLink>
      </div>

      <div v-else class="product-grid">
        <ProductCard v-for="p in store.products" :key="p.id" :product="p" @quick-view="openQuickView" />
      </div>

      <div v-if="store.meta && store.meta.last_page > 1" class="pagination">
        <button
          @click="goToPage(store.meta.current_page - 1)"
          :disabled="store.meta.current_page <= 1"
          class="page-btn"
        >
          <i class="ti ti-chevron-left" aria-hidden="true" />
        </button>
        <template v-for="page in paginationPages" :key="page">
          <span v-if="page === '...'" class="page-dots">&hellip;</span>
          <button
            v-else
            @click="typeof page === 'number' && goToPage(page as number)"
            class="page-btn"
            :class="page === store.meta.current_page ? 'page-btn-active' : ''"
          >
            {{ page }}
          </button>
        </template>
        <button
          @click="goToPage(store.meta.current_page + 1)"
          :disabled="store.meta.current_page >= store.meta.last_page"
          class="page-btn"
        >
          <i class="ti ti-chevron-right" aria-hidden="true" />
        </button>
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
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { categoryFilterMap } from '@/features/categories'
import type { Product, Category } from '@/types/product'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductQuickView from '@/components/product/ProductQuickView.vue'

const route = useRoute()
const router = useRouter()
const store = useProductStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const searchOpen = ref(false)
const cartOpen = ref(false)
const quickViewProduct = ref<Product | null>(null)
const backendCategory = ref<Category | null>(null)

const categoryLabel = computed(() => {
  const slug = route.params.slug as string
  const map: Record<string, string> = {
    'for-her': 'For Her',
    'for-him': 'For Him',
    'unisex': 'Unisex',
    'best-sellers': 'Best Sellers',
    'new-arrivals': 'New Arrivals',
    'gift-sets': 'Gift Sets',
    'travel-size': 'Travel Size',
  }
  return map[slug] ?? null
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

function goToPage(page: number) {
  if (!store.meta) return
  if (page < 1 || page > store.meta.last_page) return
  router.push({ query: { page } })
  loadProducts(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openQuickView(product: Product) {
  quickViewProduct.value = product
}

function loadProducts(page = 1) {
  const label = categoryLabel.value
  if (!label) return
  const params: Record<string, string | number> = {
    per_page: 12,
    page,
    ...categoryFilterMap[label] ?? {},
  }
  if (backendCategory.value) {
    params.category_id = backendCategory.value.id
  }
  store.fetchProducts(params)
}

async function loadCategory() {
  const slug = route.params.slug as string
  if (!categoryLabel.value) {
    router.replace('/products')
    return
  }
  if (store.categories.length === 0) {
    await store.fetchCategories()
  }
  backendCategory.value = store.categories.find(c => c.slug === slug) ?? null
  const page = route.query.page ? Number(route.query.page) : 1
  loadProducts(page)
}

watch(() => route.params.slug, () => loadCategory())

onMounted(async () => {
  await Promise.all([
    cartStore.fetchCart(),
    wishlistStore.fetchWishlist(),
  ])
  loadCategory()
})
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background: var(--background);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
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
  font-family: 'Playfair Display', serif;
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

.breadcrumb {
  margin-bottom: 24px;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 0.8;
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

.card {
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
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
  aspect-ratio: 1;
  width: 100%;
}

.skeleton-content {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  text-decoration: none;
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
</style>
