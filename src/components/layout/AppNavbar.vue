<template>
  <nav
    class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100/60"
    :class="{ 'shadow-md shadow-purple-100/40': scrolled }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 flex-shrink-0">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md shadow-purple-300/40">
            <i class="ti ti-sparkles text-white text-base" aria-hidden="true" />
          </div>
          <div class="leading-none">
            <div class="text-sm font-bold text-gray-900 tracking-wide">SCENTIQUE</div>
            <div class="text-[9px] text-purple-500 tracking-[0.18em] font-semibold uppercase">Perfumes</div>
          </div>
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center gap-6">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm font-medium transition-colors duration-200 relative group"
            :class="isActive(link.to) ? 'text-purple-600' : 'text-gray-600 hover:text-purple-600'"
          >
            {{ link.label }}
            <span
              class="absolute -bottom-0.5 left-0 h-0.5 bg-purple-500 rounded-full transition-all duration-300"
              :class="isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full'"
            />
          </RouterLink>
        </div>

        <!-- Right Icons -->
        <div class="flex items-center gap-1">

          <!-- Search -->
          <button
            @click="$emit('openSearch')"
            class="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
            aria-label="Search"
          >
            <i class="ti ti-search text-lg" aria-hidden="true" />
          </button>

          <!-- Guest -->
          <template v-if="!auth.isLoggedIn">
            <RouterLink
              to="/login"
              class="hidden sm:block text-sm font-medium text-gray-600 hover:text-purple-600 px-3 py-2 rounded-xl hover:bg-purple-50 transition"
            >
              Sign in
            </RouterLink>
            <RouterLink
              to="/register"
              class="btn-primary text-sm px-4 py-2 hidden sm:block"
            >
              Register
            </RouterLink>
          </template>

          <!-- Logged In -->
          <template v-else>

            <!-- Wishlist -->
            <RouterLink
              to="/wishlist"
              class="relative p-2.5 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all duration-200"
              aria-label="Wishlist"
            >
              <i class="ti ti-heart text-lg" aria-hidden="true" />
              <span
                v-if="wishlistCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1"
              >
                {{ wishlistCount > 9 ? '9+' : wishlistCount }}
              </span>
            </RouterLink>

            <!-- Cart -->
            <button
              @click="$emit('openCart')"
              class="relative p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
              :class="{ 'cart-animate': cartAnimating }"
              aria-label="Cart"
            >
              <i class="ti ti-shopping-bag text-lg" aria-hidden="true" />
              <span
                v-if="cartCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1"
              >
                {{ cartCount > 9 ? '9+' : cartCount }}
              </span>
            </button>

            <!-- User Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-purple-50 transition text-sm text-gray-700"
              >
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  {{ initials }}
                </div>
                <span class="hidden sm:block font-medium max-w-[80px] truncate">{{ auth.userName }}</span>
                <i class="ti ti-chevron-down text-gray-400 text-xs" :class="{ 'rotate-180': dropdownOpen }" style="transition: transform 0.2s" aria-hidden="true" />
              </button>

              <Transition name="dropdown">
                <div
                  v-if="dropdownOpen"
                  class="absolute right-0 mt-2 w-52 bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-100/50 py-2 z-50"
                >
                  <div class="px-4 py-2 border-b border-purple-50 mb-1">
                    <p class="text-xs font-semibold text-gray-900 truncate">{{ auth.userName }}</p>
                    <p class="text-[11px] text-gray-400 truncate">{{ auth.user?.email }}</p>
                  </div>
                  <RouterLink
                    to="/profile"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                  >
                    <i class="ti ti-user text-purple-400 text-sm" aria-hidden="true" />
                    My Profile
                  </RouterLink>
                  <RouterLink
                    to="/orders"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                  >
                    <i class="ti ti-package text-purple-400 text-sm" aria-hidden="true" />
                    My Orders
                  </RouterLink>
                  <RouterLink
                    to="/wishlist"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                  >
                    <i class="ti ti-heart text-purple-400 text-sm" aria-hidden="true" />
                    Wishlist
                  </RouterLink>
                  <div class="border-t border-purple-50 my-1" />
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <i class="ti ti-logout text-red-400 text-sm" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </Transition>
            </div>

          </template>

          <!-- Mobile Menu -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition ml-1"
            aria-label="Menu"
          >
            <i :class="mobileMenuOpen ? 'ti ti-x' : 'ti ti-menu-2'" class="text-lg" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t border-purple-100 px-4 py-4 space-y-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="mobileMenuOpen = false"
          class="block px-4 py-2.5 rounded-xl text-sm font-medium transition"
          :class="isActive(link.to) ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'"
        >
          {{ link.label }}
        </RouterLink>
        <div v-if="!auth.isLoggedIn" class="flex gap-3 pt-3 border-t border-purple-50 mt-3">
          <RouterLink to="/login" @click="mobileMenuOpen = false" class="flex-1 text-center btn-outline text-sm py-2.5">Sign in</RouterLink>
          <RouterLink to="/register" @click="mobileMenuOpen = false" class="flex-1 text-center btn-primary text-sm py-2.5">Register</RouterLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

defineEmits<{ openSearch: []; openCart: [] }>()

const auth = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const route = useRoute()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const cartAnimating = ref(false)

const cartCount = computed(() => cartStore.itemCount)
const wishlistCount = computed(() => wishlistStore.items.length)
const initials = computed(() =>
  auth.userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
)

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/products?sort=newest', label: 'New Arrivals' },
  { to: '/products?sort=price_asc', label: 'Best Sellers' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to.split('?')[0] ?? '')
}

async function handleLogout() {
  dropdownOpen.value = false
  await auth.logout()
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

function handleScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.25s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
