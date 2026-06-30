<template>
  <div class="telegram-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">Notifications</span>
        <h1 class="hero-title">Telegram</h1>
      </div>
    </section>

    <div class="page-body">
      <div class="settings-card">
        <h2>Order updates on Telegram</h2>
        <p class="subtitle">
          Connect your Telegram account to get instant order status updates — no need to check email.
        </p>

        <div v-if="linked" class="status-connected">
          <span class="dot" />
          Connected as <strong>@{{ telegramUsername }}</strong>
          <button type="button" class="btn btn-ghost" @click="disconnect">Disconnect</button>
        </div>

        <div v-else class="status-disconnected">
          <button type="button" class="btn btn-primary" :disabled="loading" @click="connect">
            {{ loading ? 'Generating link…' : 'Connect Telegram' }}
          </button>
          <p v-if="deepLink" class="hint">
            If Telegram didn't open automatically,
            <a :href="deepLink" target="_blank" rel="noopener">tap here</a>.
          </p>
        </div>
      </div>
    </div>

    <SearchModal v-if="searchOpen" v-model="searchOpen" />
    <CartDrawer v-if="cartOpen" v-model="cartOpen" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

const searchOpen = ref(false)
const cartOpen = ref(false)
const linked = ref(false)
const telegramUsername = ref<string | null>(null)
const loading = ref(false)
const deepLink = ref<string | null>(null)

onMounted(async () => {
  try {
    const { data } = await api.get('/telegram/status')
    linked.value = data.linked
    telegramUsername.value = data.telegram_username
  } catch {
    // silently fail
  }
})

async function connect() {
  loading.value = true
  try {
    const { data } = await api.post('/telegram/generate')
    deepLink.value = data.deep_link
    window.open(data.deep_link, '_blank')
  } finally {
    loading.value = false
  }
}

async function disconnect() {
  try {
    await api.delete('/telegram/destroy')
    linked.value = false
    telegramUsername.value = null
    deepLink.value = null
  } catch {
    // silently fail
  }
}
</script>

<style scoped>
.telegram-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FAF8F5;
}

.hero-section {
  padding: 60px 24px 0;
}

.hero-bg {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
}

.hero-label {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #B88A44;
  font-weight: 600;
  margin-bottom: 8px;
}

.hero-title {
  font-size: 28px;
  font-weight: 800;
  color: #2B2B2B;
  font-family: 'Georgia', serif;
  margin: 0;
}

.page-body {
  flex: 1;
  padding: 32px 24px 80px;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
}

.settings-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  border: 1px solid #E7E1D8;
}

h2 {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-family: 'Georgia', serif;
  color: #2B2B2B;
}

.subtitle {
  color: #8b8f99;
  font-size: 0.9rem;
  margin: 0 0 20px;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #14161a;
  color: #fff;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-ghost {
  background: #f4f5f7;
  color: #14161a;
  margin-left: 12px;
}
.btn-ghost:hover {
  background: #e5e7eb;
}

.status-connected {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #2B2B2B;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2bb695;
  display: inline-block;
  flex-shrink: 0;
}

.hint {
  font-size: 0.82rem;
  color: #8b8f99;
  margin-top: 10px;
}

.hint a {
  color: #14161a;
}
</style>
