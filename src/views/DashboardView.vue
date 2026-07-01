<template>
  <div class="dashboard-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">Dashboard</span>
        <h1 class="hero-title">My Dashboard</h1>
      </div>
    </section>

    <div class="page-body">
      <p class="text-muted">Dashboard content coming soon.</p>
    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

const searchOpen = ref(false)
const cartOpen = ref(false)
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--background);
}
.hero-section {
  background: linear-gradient(135deg, #2B241E, #1A1614);
  padding: 80px 24px;
  text-align: center;
}
.hero-label {
  display: inline-flex;
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
  margin: 0;
}
.page-body {
  max-width: 896px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}
.text-muted {
  color: var(--text-muted);
  font-size: 1rem;
}
</style>
