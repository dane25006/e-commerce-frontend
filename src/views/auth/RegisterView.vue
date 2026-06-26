<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 flex items-center justify-center px-4 py-12">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-20 -left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div class="absolute -bottom-10 -right-10 w-72 h-72 bg-violet-200/40 rounded-full blur-3xl" />
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
          <h1 class="text-2xl font-black text-gray-900">Create Account</h1>
          <p class="text-sm text-gray-500 mt-1">Join Scentique and discover luxury fragrances</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
            <div class="relative">
              <i class="ti ti-user absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" aria-hidden="true" />
              <input
                v-model="form.name"
                type="text"
                required
                autocomplete="name"
                placeholder="Jane Doe"
                class="w-full pl-10 pr-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20 transition"
              />
            </div>
          </div>

          <!-- Email -->
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

          <!-- Password -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
            <div class="relative">
              <i class="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" aria-hidden="true" />
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                placeholder="Min. 8 characters"
                class="w-full pl-10 pr-11 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20 transition"
              />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <i :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">Confirm Password</label>
            <div class="relative">
              <i class="ti ti-lock-check absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" aria-hidden="true" />
              <input
                v-model="form.password_confirmation"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                placeholder="Repeat password"
                class="w-full pl-10 pr-4 py-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20 transition"
                :class="passwordMismatch ? 'border-red-300 focus:ring-red-300' : 'border-purple-200'"
              />
            </div>
            <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1 flex items-center gap-1">
              <i class="ti ti-alert-circle" aria-hidden="true" />
              Passwords don't match
            </p>
          </div>

          <!-- Error -->
          <div v-if="auth.error" class="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <i class="ti ti-alert-circle flex-shrink-0" aria-hidden="true" />
            {{ auth.error }}
          </div>

          <button
            type="submit"
            :disabled="auth.loading || passwordMismatch"
            class="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:transform-none disabled:shadow-none"
          >
            <i v-if="auth.loading" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
            {{ auth.loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-5">
          <div class="flex-1 h-px bg-purple-100" />
          <span class="text-xs text-gray-400 font-medium">or</span>
          <div class="flex-1 h-px bg-purple-100" />
        </div>

        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <RouterLink to="/login" class="text-purple-600 hover:text-purple-800 font-bold ml-1">Sign in</RouterLink>
        </p>
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">
        <RouterLink to="/" class="hover:text-purple-600 transition">← Back to home</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const showPassword = ref(false)
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const passwordMismatch = computed(() =>
  form.password_confirmation.length > 0 && form.password !== form.password_confirmation
)

async function handleRegister() {
  if (passwordMismatch.value) return
  try {
    await auth.register(form)
  } catch { /* handled by store */ }
}
</script>
