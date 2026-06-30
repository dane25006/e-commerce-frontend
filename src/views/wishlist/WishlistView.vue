<template>
  <div class="wishlist-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">Your</span>
        <h1 class="hero-title">
          <i class="ti ti-heart-filled" aria-hidden="true" />
          Wishlist
        </h1>
        <p class="hero-count">
          {{ wishlist.items.length }} {{ wishlist.items.length === 1 ? 'Saved Item' : 'Saved Items' }}
        </p>
      </div>
    </section>

    <section class="wishlist-section">
      <div class="section-content">
        <div class="wishlist-header">
          <div>
            <span class="section-label">Your saved items</span>
            <h2 class="wishlist-title">
              <i class="ti ti-heart-filled" aria-hidden="true" />
              Wishlist ({{ wishlist.items.length }})
            </h2>
          </div>
          <RouterLink to="/products" class="btn-secondary discover-btn">
            Discover More
            <i class="ti ti-arrow-right" aria-hidden="true" />
          </RouterLink>
        </div>

        <div v-if="loading" class="loading-grid">
          <div v-for="n in 5" :key="n" class="skeleton-card">
            <div class="skeleton-img" />
            <div class="skeleton-text">
              <div class="skeleton-line w-2-3" />
              <div class="skeleton-line w-1-2" />
            </div>
          </div>
        </div>

        <div v-else-if="!wishlist.items.length" class="empty-state">
          <div class="empty-icon">
            <i class="ti ti-heart-off" aria-hidden="true" />
          </div>
          <h2 class="empty-title">Your wishlist is waiting to be filled</h2>
          <p class="empty-desc">Discover fragrances you&rsquo;ll love and save them here for later.</p>
          <RouterLink to="/products" class="btn-primary">
            <i class="ti ti-shopping-bag" aria-hidden="true" />
            Start Shopping
          </RouterLink>
        </div>

        <div v-else class="products-grid">
          <ProductCard
            v-for="item in wishlist.items"
            :key="item.wishlist_id"
            :product="item.product"
          />
        </div>

        <div class="mobile-discover">
          <RouterLink to="/products" class="btn-secondary">Discover More</RouterLink>
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
.wishlist-page {
  min-height: 100vh;
  background: var(--background);
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

.wishlist-section {
  padding: 40px 0 64px;
}

.section-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.wishlist-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
}

.wishlist-title {
  font-size: 24px;
  font-weight: 900;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
}

.wishlist-title i {
  color: var(--primary);
}

.discover-btn {
  display: none;
}

@media (min-width: 640px) {
  .discover-btn {
    display: inline-flex;
  }
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.skeleton-img {
  aspect-ratio: 3 / 4;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.w-2-3 { width: 66.67%; }
.w-1-2 { width: 50%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-state {
  text-align: center;
  padding: 96px 0;
  animation: fadeIn 0.6s ease forwards;
}

.empty-icon {
  width: 112px;
  height: 112px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  background: rgba(184,138,68,0.08);
}

.empty-icon i {
  font-size: 56px;
  color: rgba(184,138,68,0.25);
}

.empty-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.mobile-discover {
  text-align: center;
  margin-top: 16px;
}

@media (min-width: 640px) {
  .mobile-discover {
    display: none;
  }
}

.fade-in {
  animation: fadeIn 0.6s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 28px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .wishlist-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
