<template>
  <div v-if="ready" :class="{ 'locale-fade': fading }" style="transition: opacity 0.15s ease;">
    <NetworkStatusBar />
    <RouterView />
    <ToastNotification />
  </div>
  <div v-else class="loading">
    <div class="loading-inner">
      <div class="logo-box">
        <span class="logo-letter">S</span>
      </div>
      <div class="loading-text">
        <p class="brand-name">{{ $t('app.name') }}</p>
        <p class="loading-label">{{ $t('app.loading') }}</p>
      </div>
      <div class="loading-dots">
        <div class="dot" style="animation-delay: 0ms" />
        <div class="dot" style="animation-delay: 200ms" />
        <div class="dot" style="animation-delay: 400ms" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import ToastNotification from '@/components/common/ToastNotification.vue'
import NetworkStatusBar from '@/components/common/NetworkStatusBar.vue'

const { locale } = useI18n()
const auth = useAuthStore()
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()
const ready = ref(false)
const fading = ref(false)
let fadeTimer: ReturnType<typeof setTimeout>

function applyLocale(lang: string) {
  document.documentElement.lang = lang
  const body = document.body
  body.classList.remove('font-en', 'font-km')
  body.classList.add(`font-${lang}`)
  localStorage.setItem('locale', lang)
}

watch(locale, (lang) => {
  applyLocale(lang)
  clearTimeout(fadeTimer)
  fading.value = true
  fadeTimer = setTimeout(() => { fading.value = false }, 200)
})

onMounted(async () => {
  document.documentElement.lang = locale.value

  const error = route.query.error as string | undefined

  if (error) {
    await router.replace({ path: '/login', query: { error } })
    ready.value = true
    return
  }

  await auth.boot()
  cartStore.fetchCart()
  ready.value = true
})
</script>

<style scoped>
.locale-fade {
  opacity: 0.6;
}
.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAF8F5;
}
.loading-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.logo-box {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #B88A44, #C9A96E);
  box-shadow: 0 8px 24px rgba(184,138,68,0.3);
}
.logo-letter {
  color: #FFFFFF;
  font-size: 1.5rem;
  font-weight: 900;
  font-family: var(--font-heading);
}
.loading-text {
  text-align: center;
}
.brand-name {
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 0.025em;
  color: #222222;
  font-family: var(--font-heading);
  margin: 0;
}
.loading-label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: #B88A44;
  margin: 4px 0 0;
}
.loading-dots {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite;
}
.dot:nth-child(1) { background: #B88A44; }
.dot:nth-child(2) { background: #C9A96E; }
.dot:nth-child(3) { background: #A7772F; }

@keyframes pulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}


</style>
