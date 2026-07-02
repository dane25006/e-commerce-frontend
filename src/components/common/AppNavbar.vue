<template>
  <nav class="sticky top-0 z-50 bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- brand -->
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i class="ti ti-shopping-bag text-white text-base" aria-hidden="true" />
          </div>
          <span class="text-base font-semibold text-gray-900">{{ $t('app.name') }}</span>
        </RouterLink>

        <!-- desktop nav -->
        <div class="hidden md:flex items-center gap-6">
          <RouterLink
            to="/"
            class="text-sm text-gray-500 hover:text-gray-900 transition"
            :class="{ 'text-gray-900 font-medium': $route.name === 'home' }"
          >
            {{ $t('nav.home') }}
          </RouterLink>
          <RouterLink
            to="/products"
            class="text-sm text-gray-500 hover:text-gray-900 transition"
            :class="{ 'text-gray-900 font-medium': $route.name === 'products' }"
          >
            {{ $t('nav.shop') }}
          </RouterLink>
        </div>

        <!-- right side -->
        <div class="flex items-center gap-2">

          <!-- search -->
          <RouterLink
            to="/products"
            class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
            :aria-label="$t('nav.search')"
          >
            <i class="ti ti-search text-lg" aria-hidden="true" />
          </RouterLink>

          <!-- guest -->
          <template v-if="!auth.isLoggedIn">
            <RouterLink
              to="/login"
              class="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg
                     hover:bg-gray-50 transition"
            >
              {{ $t('nav.login') }}
            </RouterLink>
            <RouterLink
              to="/register"
              class="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5
                     rounded-lg transition font-medium"
            >
              {{ $t('nav.register') }}
            </RouterLink>
          </template>

          <!-- logged in -->
          <template v-else>

            <!-- wishlist -->
            <RouterLink
              to="/wishlist"
              class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
              :aria-label="$t('nav.wishlist')"
            >
              <i class="ti ti-heart text-lg" aria-hidden="true" />
            </RouterLink>

            <!-- cart -->
            <RouterLink
              to="/cart"
              class="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition"
              :aria-label="$t('nav.cart')"
            >
              <i class="ti ti-shopping-cart text-lg" aria-hidden="true" />
              <span
                v-if="cartCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-indigo-600
                       text-white text-[10px] font-medium rounded-full flex items-center
                       justify-center px-1"
              >
                {{ cartCount > 99 ? '99+' : cartCount }}
              </span>
            </RouterLink>

            <!-- user dropdown -->
            <div class="relative" ref="dropdownRef">
              <button
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-50
                       transition text-sm text-gray-700"
              >
                <div class="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center
                            text-indigo-700 text-xs font-medium">
                  {{ initials }}
                </div>
                <span class="hidden sm:block">{{ auth.userName }}</span>
                <i class="ti ti-chevron-down text-gray-400 text-sm" aria-hidden="true" />
              </button>

              <!-- dropdown -->
              <div
                v-if="dropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl
                       shadow-lg py-1 z-50"
              >
                <RouterLink
                  to="/profile"
                  @click="dropdownOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                         hover:bg-gray-50 transition"
                >
                  <i class="ti ti-user text-gray-400" aria-hidden="true" />
                  {{ $t('nav.myProfile') }}
                </RouterLink>
                <RouterLink
                  to="/orders"
                  @click="dropdownOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                         hover:bg-gray-50 transition"
                >
                  <i class="ti ti-package text-gray-400" aria-hidden="true" />
                  {{ $t('nav.myOrders') }}
                </RouterLink>
                <div class="border-t border-gray-100 my-1" />
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600
                         hover:bg-red-50 transition"
                >
                  <i class="ti ti-logout text-red-400" aria-hidden="true" />
                  {{ $t('nav.logout') }}
                </button>
              </div>
            </div>

          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const { t } = useI18n()

const auth        = useAuthStore()
const cartStore   = useCartStore()
const dropdownOpen = ref(false)
const dropdownRef  = ref<HTMLElement | null>(null)

const cartCount = computed(() => cartStore.itemCount)
const initials  = computed(() => {
  return auth.userName
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

async function handleLogout() {
  dropdownOpen.value = false
  await auth.logout()
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>