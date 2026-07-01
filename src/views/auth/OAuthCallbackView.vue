<template>
  <div class="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
    <div class="flex flex-col items-center gap-5">
      <div class="w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#B88A44] to-[#C9A96E] shadow-lg shadow-[rgba(184,138,68,0.3)]">
        <span class="text-white text-2xl font-black font-serif">S</span>
      </div>
      <div class="text-center">
        <p class="text-lg font-bold tracking-wide text-[#222] font-serif m-0">Scentique</p>
        <p class="text-xs tracking-widest text-[#B88A44] mt-1">{{ statusText }}</p>
      </div>
      <div class="flex gap-2 mt-2">
        <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full" :class="dotClass(i)" :style="{ animationDelay: `${(i - 1) * 200}ms` }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const statusText = ref('Signing you in...')

function dotClass(i: number): string {
  return ['bg-[#B88A44]', 'bg-[#C9A96E]', 'bg-[#A7772F]'][i - 1] ?? 'bg-[#B88A44]'
}

onMounted(async () => {
  const token = (route.query.token as string) || (route.query.auth_token as string)
  const error = route.query.error as string | undefined

  if (error) {
    statusText.value = 'Login failed'
    await router.replace({ path: '/login', query: { error } })
    return
  }

  if (!token || token === 'undefined' || token === 'null') {
    statusText.value = 'Invalid token'
    await router.replace('/login')
    return
  }

  window.history.replaceState({}, document.title, window.location.pathname)

  await auth.socialLogin(token)
})
</script>
