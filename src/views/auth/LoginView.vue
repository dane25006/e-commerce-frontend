<template>
  <div class="min-h-screen relative">
    <!-- Background with home content -->
    <HomeView />

    <!-- Blur overlay backdrop -->
    <div class="fixed inset-0 bg-black/40 backdrop-blur-md z-40" @click="goHome" />

    <!-- Glass modal card -->
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <Transition name="slide-up" appear>
        <div
          class="w-full max-w-md rounded-2xl shadow-2xl p-8 relative my-auto bg-white/80 backdrop-blur-md border border-white/30 ring-1 ring-black/5"
        >
          <!-- close -->
          <button
            @click="goHome"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg p-1.5 transition"
            aria-label="Close"
          >
            <i class="ti ti-x text-lg" aria-hidden="true" />
          </button>

          <!-- header -->
          <div class="text-center mb-6">
            <div
              class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <i class="ti ti-shopping-bag text-white text-base" aria-hidden="true" />
            </div>
            <h1 class="text-xl font-semibold text-gray-900">Welcome back</h1>
            <p class="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>

          <!-- api error -->
          <div
            v-if="auth.error"
            class="mb-5 flex items-start gap-2 bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3"
          >
            <i class="ti ti-alert-circle mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{{ auth.error }}</span>
          </div>

          <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
            <!-- email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                autocomplete="email"
                placeholder="Enter your email"
                class="w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm"
                :class="
                  errors.email
                    ? 'border-red-400 bg-red-50/70 text-red-900 placeholder-red-300'
                    : 'border-gray-300 bg-white/70 text-gray-900 placeholder-gray-400'
                "
                @blur="validateField('email')"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
            </div>

            <!-- password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPw ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Enter your password"
                  class="w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm"
                  :class="
                    errors.password
                      ? 'border-red-400 bg-red-50/70 text-red-900'
                      : 'border-gray-300 bg-white/70 text-gray-900'
                  "
                  @blur="validateField('password')"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  @click="showPw = !showPw"
                >
                  <i
                    :class="showPw ? 'ti ti-eye-off' : 'ti ti-eye'"
                    class="text-lg"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
            </div>

            <!-- submit -->
            <button
              type="submit"
              :disabled="auth.loading"
              class="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2.5 transition mt-2"
            >
              <i v-if="auth.loading" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
              <span>{{ auth.loading ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </form>

          <!-- divider -->
          <div class="flex items-center gap-3 my-5">
            <div class="flex-1 h-px bg-gray-200/60" />
            <span class="text-xs text-gray-400">or</span>
            <div class="flex-1 h-px bg-gray-200/60" />
          </div>

          <!-- Google login -->
          <a
            :href="googleUrl"
            class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg px-4 py-2.5 border border-gray-300 transition shadow-sm"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </a>

          <!-- switch to register -->
          <p class="text-center text-sm text-gray-500 mt-5">
            Don't have an account?
            <RouterLink to="/register" class="text-indigo-600 font-medium hover:underline">
              Create one
            </RouterLink>
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/home/HomeView.vue'

import config from '@/config/app'

const auth = useAuthStore()
const router = useRouter()
const showPw = ref(false)
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

const googleUrl = `${config.apiBaseUrl}/auth/google/redirect`

function goHome() {
  router.push('/')
}

function validateField(field: 'email' | 'password') {
  if (field === 'email') {
    if (!form.email) errors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = 'Enter a valid email address.'
    else errors.email = ''
  }
  if (field === 'password') {
    if (!form.password) errors.password = 'Password is required.'
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
    else errors.password = ''
  }
}

function validateAll(): boolean {
  validateField('email')
  validateField('password')
  return !errors.email && !errors.password
}

async function handleSubmit() {
  if (!validateAll()) return
  try {
    await auth.login({ email: form.email, password: form.password })
  } catch {
    /* error set in store */
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') goHome()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-leave-active {
  transition: all 0.2s ease-in;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(32px) scale(0.97);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}
</style>
