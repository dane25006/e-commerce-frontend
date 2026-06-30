<template>
  <div class="products-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">Top Rated</span>
        <h1 class="hero-title">Best Sellers</h1>
        <p v-if="meta" class="hero-count">{{ meta.total }} best seller{{ meta.total !== 1 ? 's' : '' }}</p>
      </div>
    </section>

    <div class="page-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <div class="search-wrapper">
            <i class="ti ti-search search-icon" aria-hidden="true" />
            <input
              id="bestsellers-search"
              name="search"
              v-model="filters.search"
              type="text"
              placeholder="Search best sellers..."
              class="search-input"
            />
          </div>
        </div>
        <div class="toolbar-right">
          <span class="product-count">{{ filteredCount }} product{{ filteredCount !== 1 ? 's' : '' }}</span>
          <select
            id="bestsellers-sort"
            name="sort"
            v-model="filters.sort"
            @change="onFilterChange"
            class="sort-select"
          >
            <option value="rating">Sort: top rated</option>
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name_asc">Name A–Z</option>
          </select>
          <button
            @click="showMobileFilters = !showMobileFilters"
            class="mobile-filter-btn"
            aria-label="Filters"
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
        <button @click="handleReset" class="chip-clear">Clear all</button>
      </div>

      <Transition name="collapse">
        <div v-if="showMobileFilters" class="mobile-filters-drawer">
          <div class="mobile-filters-header">
            <span class="mobile-filters-title">Filters</span>
            <button @click="showMobileFilters = false" class="mobile-filters-close"><i class="ti ti-x" /></button>
          </div>
          <div class="mobile-filters-body">
            <div class="mobile-filter-group">
              <button @click="filterOpen.gender = !filterOpen.gender" class="mobile-filter-toggle">
                Gender
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
                Categories
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
                Brand
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
                Type
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
                Department
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
                Price range
                <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.price }" aria-hidden="true" />
              </button>
              <Transition name="filter-collapse">
                <div v-if="filterOpen.price" class="mobile-filter-options">
                  <input id="bs-price-mobile" name="price" type="range" :min="0" :max="maxPrice" :value="currentPrice" step="5" @input="onPriceInput" class="price-range" />
                  <div class="price-labels">
                    <span>$0</span>
                    <span>up to ${{ currentPrice }}</span>
                  </div>
                </div>
              </Transition>
            </div>
            <div class="mobile-filter-group">
              <button @click="filterOpen.availability = !filterOpen.availability" class="mobile-filter-toggle">
                Availability
                <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.availability }" aria-hidden="true" />
              </button>
              <Transition name="filter-collapse">
                <div v-if="filterOpen.availability" class="mobile-filter-options">
                  <div class="availability-row">
                    <span>In stock only</span>
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
            <button @click="showMobileFilters = false; loadProducts()" class="btn-primary flex-1">Apply</button>
            <button @click="handleReset" class="btn-secondary flex-1">Reset</button>
          </div>
        </div>
      </Transition>

      <div class="layout">
        <aside class="sidebar">
          <div class="card filter-card">
            <button @click="filterOpen.gender = !filterOpen.gender" class="filter-header">
              Gender
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.gender }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.gender" class="filter-body">
                <div v-for="g in filterOptions.genders" :key="g" class="filter-checkbox" @click="toggleFilter('gender', g)">
                  <input :id="'bs-g-'+g" name="gender" type="checkbox" :checked="filters.gender?.includes(g)" class="checkbox-input" />
                  <label class="checkbox-label">{{ g }}</label>
                  <span class="filter-count">{{ countsBy('gender', g) }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.categories = !filterOpen.categories" class="filter-header">
              Categories
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
              Brand
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.brand }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.brand" class="filter-body">
                <div v-for="b in filterOptions.brands" :key="b" class="filter-checkbox" @click="toggleFilter('brand', b)">
                  <input :id="'bs-b-'+b" name="brand" type="checkbox" :checked="filters.brand?.includes(b)" class="checkbox-input" />
                  <label class="checkbox-label">{{ b }}</label>
                  <span class="filter-count">{{ countsBy('brand', b) }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.type = !filterOpen.type" class="filter-header">
              Type
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.type }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.type" class="filter-body">
                <div v-for="t in filterOptions.types" :key="t" class="filter-checkbox" @click="toggleFilter('type', t)">
                  <input :id="'bs-t-'+t" name="type" type="checkbox" :checked="filters.type?.includes(t)" class="checkbox-input" />
                  <label class="checkbox-label">{{ t }}</label>
                  <span class="filter-count">{{ countsBy('type', t) }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.department = !filterOpen.department" class="filter-header">
              Department
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.department }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.department" class="filter-body">
                <div v-for="d in filterOptions.departments" :key="d" class="filter-checkbox" @click="toggleFilter('department', d)">
                  <input :id="'bs-d-'+d" name="department" type="checkbox" :checked="filters.department?.includes(d)" class="checkbox-input" />
                  <label class="checkbox-label">{{ d }}</label>
                  <span class="filter-count">{{ countsBy('department', d) }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.price = !filterOpen.price" class="filter-header">
              Price range
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.price }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.price" class="filter-body">
                <input id="bs-price-desktop" name="price" type="range" :min="0" :max="maxPrice" :value="currentPrice" step="5" @input="onPriceInput" class="price-range" />
                <div class="price-labels">
                  <span>$0</span>
                  <span>up to ${{ currentPrice }}</span>
                </div>
              </div>
            </Transition>
          </div>

          <div class="card filter-card">
            <button @click="filterOpen.availability = !filterOpen.availability" class="filter-header">
              Availability
              <i class="ti ti-chevron-down chevron" :class="{ 'is-open': filterOpen.availability }" aria-hidden="true" />
            </button>
            <Transition name="filter-collapse">
              <div v-if="filterOpen.availability" class="filter-body">
                <div class="availability-row">
                  <span>In stock only</span>
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
          <div v-if="loading" class="product-grid">
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

          <div v-else-if="error" class="state-card">
            <i class="ti ti-alert-circle state-icon" aria-hidden="true" />
            <p class="state-text">Something went wrong while loading best sellers. Please try again.</p>
            <button @click="loadProducts" class="btn-primary">Try again</button>
          </div>

          <div v-else-if="!products.length" class="state-card">
            <i class="ti ti-mood-empty state-icon" aria-hidden="true" />
            <p class="state-text">No best sellers match your current filters. Try adjusting them to discover our most-loved scents.</p>
            <button @click="handleReset" class="btn-secondary">Clear filters</button>
          </div>

          <div v-else class="product-grid">
            <ProductCard
              v-for="p in products"
              :key="p.id"
              :product="p"
              @quick-view="openQuickView"
            />
          </div>

          <div v-if="meta && meta.last_page > 1" class="pagination">
            <button
              @click="goToPage(meta.current_page - 1)"
              :disabled="meta.current_page === 1"
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
                :class="page === meta.current_page ? 'page-btn-active' : ''"
              >
                {{ page }}
              </button>
            </template>
            <button
              @click="goToPage(meta.current_page + 1)"
              :disabled="meta.current_page === meta.last_page"
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
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import { CategoryFilter } from '@/features/categories'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductQuickView from '@/components/product/ProductQuickView.vue'
import { useProductFilters } from '@/composables/useProductFilters'

const {
  products, loading, error, meta, searchOpen, cartOpen, quickViewProduct,
  showMobileFilters, currentPrice, filters, filterOptions, filterOpen,
  maxPrice, filteredCount, activeChips, paginationPages,
  openQuickView, toggleFilter, onPriceInput, onFilterChange, countsBy,
  loadProducts, goToPage, handleReset,
} = useProductFilters({ defaultSort: 'rating' })
</script>

<style scoped>
.products-page {
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
