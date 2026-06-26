<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 flex items-center justify-center px-4 py-12">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl" />
    </div>

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <RouterLink to="/" class="inline-flex items-center gap-2.5">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-300/40">
            <i class="ti ti-sparkles text-white text-xl" aria-hidden="true" />
          </div>
          <div class="text-left">
            <div class="text-lg font-black text-gray-900 tracking-wide">SCENTIQUE</div>
            <div class="text-[9px] text-purple-500 tracking-[0.2em] font-bold">PERFUMES</div>
          </div>
        </RouterLink>
      </div>

      <!-- Card -->
      <div class="card-luxury p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-black text-gray-900">Welcome Back</h1>
          <p class="text-sm text-gray-500 mt-1">Sign in to your Scentique account</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
            <div class="relative">
              <i class="ti ti-mail absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" aria-hidden="true" />
              <input
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                placeholder="you@example.com"
                class="w-full pl-10 pr-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20 transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <i class="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" aria-hidden="true" />
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full pl-10 pr-11 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20 transition"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="auth.error" class="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <i class="ti ti-alert-circle flex-shrink-0" aria-hidden="true" />
            {{ auth.error }}
          </div>

          <button
            type="submit"
            :disabled="auth.loading"
            class="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:transform-none disabled:shadow-none"
          >
            <i v-if="auth.loading" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
            {{ auth.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <RouterLink to="/register" class="text-purple-600 hover:text-purple-800 font-bold ml-1">
            Create one
          </RouterLink>
        </p>
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">
        <RouterLink to="/" class="hover:text-purple-600 transition">← Back to home</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const showPassword = ref(false)
const form = reactive({ email: '', password: '' })

async function handleLogin() {
  try {
    await auth.login(form)
  } catch { /* handled by store */ }
}
</script>
