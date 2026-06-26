<template>
  <div class="min-h-screen bg-[#F8F5FF]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <!-- Header -->
    <div class="bg-gradient-to-br from-purple-600 to-violet-700 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-purple-200 text-xs font-bold uppercase tracking-widest block mb-1">Account</span>
        <h1 class="text-3xl font-black text-white">My Profile</h1>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

      <!-- Profile Card -->
      <div class="card-luxury p-6 sm:p-8">
        <!-- User header -->
        <div class="flex items-center gap-5 mb-8 pb-6 border-b border-purple-100">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-lg shadow-purple-200/50">
            {{ initials }}
          </div>
          <div>
            <h2 class="text-xl font-black text-gray-900">{{ auth.userName }}</h2>
            <p class="text-sm text-gray-400">{{ auth.user?.email }}</p>
            <span class="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full capitalize">
              <i class="ti ti-award text-xs" aria-hidden="true" />
              {{ auth.user?.role }}
            </span>
          </div>
        </div>

        <!-- Update Profile Form -->
        <div>
          <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="ti ti-user text-purple-500" aria-hidden="true" />
            Profile Information
          </h3>
          <form @submit.prevent="handleUpdateProfile" class="space-y-4 max-w-lg">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
              <div class="relative">
                <i class="ti ti-user absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-sm" aria-hidden="true" />
                <input
                  v-model="profileForm.name"
                  type="text"
                  required
                  class="w-full pl-10 pr-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
              <div class="relative">
                <i class="ti ti-mail absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-sm" aria-hidden="true" />
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="w-full pl-10 pr-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20"
                />
              </div>
            </div>

            <Transition name="fade">
              <div v-if="profileSuccess" class="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <i class="ti ti-circle-check" aria-hidden="true" />
                Profile updated successfully!
              </div>
              <div v-else-if="profileError" class="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <i class="ti ti-alert-circle" aria-hidden="true" />
                {{ profileError }}
              </div>
            </Transition>

            <button
              type="submit"
              :disabled="savingProfile"
              class="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 disabled:opacity-60 disabled:transform-none disabled:shadow-none"
            >
              <i v-if="savingProfile" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
              {{ savingProfile ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Change Password -->
      <div class="card-luxury p-6 sm:p-8">
        <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i class="ti ti-lock text-purple-500" aria-hidden="true" />
          Change Password
        </h3>
        <form @submit.prevent="handleChangePassword" class="space-y-4 max-w-lg">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">Current Password</label>
            <div class="relative">
              <i class="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-sm" aria-hidden="true" />
              <input
                v-model="passwordForm.current_password"
                :type="showCurrentPw ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-11 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20"
              />
              <button type="button" @click="showCurrentPw = !showCurrentPw"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                :aria-label="showCurrentPw ? 'Hide' : 'Show'">
                <i :class="showCurrentPw ? 'ti ti-eye-off' : 'ti ti-eye'" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">New Password</label>
            <div class="relative">
              <i class="ti ti-lock-check absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-sm" aria-hidden="true" />
              <input
                v-model="passwordForm.password"
                :type="showNewPw ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-11 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20"
              />
              <button type="button" @click="showNewPw = !showNewPw"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition"
                :aria-label="showNewPw ? 'Hide' : 'Show'">
                <i :class="showNewPw ? 'ti ti-eye-off' : 'ti ti-eye'" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">Confirm New Password</label>
            <div class="relative">
              <i class="ti ti-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-sm" aria-hidden="true" />
              <input
                v-model="passwordForm.password_confirmation"
                :type="showNewPw ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20"
                :class="pwMismatch ? 'border-red-300' : ''"
              />
            </div>
            <p v-if="pwMismatch" class="text-xs text-red-500 mt-1">Passwords don't match</p>
          </div>

          <Transition name="fade">
            <div v-if="passwordError" class="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <i class="ti ti-alert-circle" aria-hidden="true" />
              {{ passwordError }}
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="savingPassword || pwMismatch"
            class="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 disabled:opacity-60 disabled:transform-none disabled:shadow-none"
          >
            <i v-if="savingPassword" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
            {{ savingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>

      <!-- Quick links -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="card-luxury p-5 text-center hover:bg-purple-50 transition group"
        >
          <div class="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mx-auto mb-3 transition">
            <i :class="`ti ${link.icon} text-xl text-purple-600`" aria-hidden="true" />
          </div>
          <p class="text-xs font-bold text-gray-700 group-hover:text-purple-700 transition">{{ link.label }}</p>
        </RouterLink>
      </div>

      <!-- Danger zone -->
      <div class="card-luxury p-6 border border-red-100">
        <h3 class="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
          <i class="ti ti-logout text-red-400" aria-hidden="true" />
          Account Actions
        </h3>
        <p class="text-xs text-gray-400 mb-4">Sign out of your Scentique account.</p>
        <button
          @click="auth.logout()"
          class="flex items-center gap-2 text-sm text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2.5 rounded-xl transition font-semibold"
        >
          <i class="ti ti-logout" aria-hidden="true" />
          Sign Out
        </button>
      </div>

    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { ChangePasswordPayload } from '@/types/auth'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

const auth = useAuthStore()
const searchOpen = ref(false)
const cartOpen = ref(false)

const savingProfile = ref(false)
const profileSuccess = ref(false)
const profileError = ref('')
const savingPassword = ref(false)
const passwordError = ref('')
const showCurrentPw = ref(false)
const showNewPw = ref(false)

const profileForm = reactive({ name: '', email: '' })
const passwordForm = reactive<ChangePasswordPayload>({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const initials = computed(() =>
  auth.userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
)

const pwMismatch = computed(() =>
  passwordForm.password_confirmation.length > 0 &&
  passwordForm.password !== passwordForm.password_confirmation
)

const quickLinks = [
  { to: '/orders', icon: 'ti-package', label: 'My Orders' },
  { to: '/wishlist', icon: 'ti-heart', label: 'Wishlist' },
  { to: '/cart', icon: 'ti-shopping-bag', label: 'Cart' },
  { to: '/products', icon: 'ti-sparkles', label: 'Shop' },
]

async function handleUpdateProfile() {
  savingProfile.value = true
  profileSuccess.value = false
  profileError.value = ''
  try {
    await auth.updateProfile(profileForm.name, profileForm.email)
    profileSuccess.value = true
    setTimeout(() => { profileSuccess.value = false }, 3000)
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    profileError.value = e.response?.data?.message ?? 'Failed to update profile.'
  } finally {
    savingProfile.value = false
  }
}

async function handleChangePassword() {
  if (pwMismatch.value) return
  savingPassword.value = true
  passwordError.value = ''
  try {
    await auth.changePassword(passwordForm)
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    passwordError.value = e.response?.data?.message ?? 'Failed to change password.'
    savingPassword.value = false
  }
}

onMounted(() => {
  if (auth.user) {
    profileForm.name = auth.user.name
    profileForm.email = auth.user.email
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
