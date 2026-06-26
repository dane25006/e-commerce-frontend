<template>
  <div v-if="ready">
    <RouterView />
  </div>
  <div v-else class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100">
    <div class="flex flex-col items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-xl shadow-purple-300/40 animate-pulse">
        <i class="ti ti-sparkles text-white text-2xl" aria-hidden="true" />
      </div>
      <div class="text-center">
        <p class="text-sm font-black text-gray-900 tracking-wide">SCENTIQUE</p>
        <p class="text-xs text-purple-400 tracking-widest">Loading...</p>
      </div>
      <div class="flex gap-1.5 mt-2">
        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
        <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 150ms" />
        <div class="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style="animation-delay: 300ms" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/plugins/axios'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const ready = ref(false)

onMounted(async () => {
  const token = route.query.auth_token as string | undefined

  if (token && token !== 'undefined' && token !== 'null') {
    localStorage.setItem('scentique_auth_token', token)
    localStorage.setItem('scentique_has_session', 'true')

    try {
      const { data } = await api.get<{ user: import('@/types/auth').User }>('/profile', {
        skipAuthRedirect: true,
      })
      auth.user = data.user
      auth.hasSession = true
    } catch {
      localStorage.removeItem('scentique_auth_token')
      localStorage.removeItem('scentique_has_session')
    }

    router.replace({ query: {} })
  } else {
    await auth.boot()
  }

  ready.value = true
})
</script>
