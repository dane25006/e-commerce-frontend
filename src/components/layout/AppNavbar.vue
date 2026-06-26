<template>
  <nav
    ref="navRef"
    class="sticky top-0 z-50 transition-all duration-300"
    :class="[
      navVisible ? 'translate-y-0' : '-translate-y-full',
      scrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-purple-100/30 border-b border-purple-100/50'
        : 'bg-white/95 backdrop-blur-md border-b border-purple-100/30'
    ]"
  >
    <!-- Scroll Progress Bar -->
    <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-100/50">
      <div
        class="h-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-150 ease-linear"
        :style="{ width: `${scrollProgress}%` }"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Mobile Menu Trigger -->
        <button
          @click="mobileOpen = true"
          class="lg:hidden p-2 -ml-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
          aria-label="Open menu"
        >
          <i class="ti ti-menu-2 text-xl" aria-hidden="true" />
        </button>

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 flex-shrink-0 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md shadow-purple-300/40 group-hover:shadow-lg group-hover:shadow-purple-300/50 transition-shadow">
            <i class="ti ti-sparkles text-white text-base" aria-hidden="true" />
          </div>
          <div class="leading-none">
            <div class="text-sm font-bold text-gray-900 tracking-wide">SCENTIQUE</div>
            <div class="text-[9px] text-purple-500 tracking-[0.18em] font-semibold uppercase">Perfumes</div>
          </div>
        </RouterLink>

        <!-- Desktop Nav with Mega Menu -->
        <div class="hidden lg:flex items-center gap-1">
          <div
            v-for="link in navLinks"
            :key="link.to"
            class="relative"
            @mouseenter="hoveredMenu = link.label"
            @mouseleave="hoveredMenu = null"
          >
            <RouterLink
              :to="link.to"
              class="px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-1"
              :class="isActive(link.to)
                ? 'text-purple-700 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50/50'"
            >
              {{ link.label }}
              <i v-if="link.children" class="ti ti-chevron-down text-[10px] transition-transform duration-200" :class="{ 'rotate-180': hoveredMenu === link.label }" aria-hidden="true" />
            </RouterLink>

            <!-- Mega Menu Dropdown -->
            <Transition name="mega">
              <div
                v-if="link.children && hoveredMenu === link.label"
                class="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl shadow-purple-200/30 border border-purple-100/80 p-3 z-50"
              >
                <RouterLink
                  v-for="child in link.children"
                  :key="child.to"
                  :to="child.to"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition"
                >
                  <i :class="child.icon" class="text-purple-400 text-base w-5 text-center" aria-hidden="true" />
                  <div>
                    <p class="font-medium">{{ child.label }}</p>
                    <p v-if="child.desc" class="text-[11px] text-gray-400">{{ child.desc }}</p>
                  </div>
                </RouterLink>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-0.5">

          <!-- Inline Search -->
          <div class="hidden sm:flex items-center relative" :class="searchExpanded ? 'w-64' : 'w-9'">
            <Transition name="search-expand">
              <input
                v-if="searchExpanded"
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full pl-10 pr-4 py-2 text-sm bg-purple-50/60 border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all placeholder:text-gray-400"
                @blur="collapseSearch"
                @keydown.escape="collapseSearch"
                @keydown.enter="doSearch"
              />
            </Transition>
            <button
              v-if="!searchExpanded"
              @click="expandSearch"
              class="p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
              aria-label="Search"
            >
              <i class="ti ti-search text-lg" aria-hidden="true" />
            </button>
            <i
              v-if="searchExpanded"
              class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 text-sm pointer-events-none"
              aria-hidden="true"
            />
            <button
              v-if="searchQuery && searchExpanded"
              @click="searchQuery = ''"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              aria-label="Clear search"
            >
              <i class="ti ti-x text-sm" aria-hidden="true" />
            </button>
          </div>

          <!-- Mobile Search Trigger -->
          <button
            @click="$emit('openSearch')"
            class="sm:hidden p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition"
            aria-label="Search"
          >
            <i class="ti ti-search text-lg" aria-hidden="true" />
          </button>

          <!-- Wishlist — always visible -->
          <RouterLink
            to="/wishlist"
            class="relative p-2.5 text-gray-500 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all duration-200 group"
            aria-label="Wishlist"
          >
            <i class="ti ti-heart text-lg group-hover:animate-heartbeat" aria-hidden="true" />
            <span
              v-if="wishlistCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in"
            >
              {{ wishlistCount > 9 ? '9+' : wishlistCount }}
            </span>
          </RouterLink>

          <!-- Cart — always visible -->
          <button
            @click="$emit('openCart')"
            class="relative p-2.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 group"
            :class="{ 'cart-animate': cartAnimating }"
            aria-label="Cart"
          >
            <i class="ti ti-shopping-bag text-lg" aria-hidden="true" />
            <span
              v-if="cartCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 animate-scale-in"
            >
              {{ cartCount > 9 ? '9+' : cartCount }}
            </span>
          </button>

          <!-- Auth -->
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

          <!-- User Dropdown (logged in) -->
          <template v-else>
            <div class="relative" ref="dropdownRef">
              <button
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-purple-50 transition text-sm text-gray-700 group"
              >
                <div class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-purple-200 group-hover:ring-purple-300 transition-all">
                  {{ initials }}
                </div>
                <span class="hidden sm:block font-medium max-w-[80px] truncate">{{ auth.userName }}</span>
                <i class="ti ti-chevron-down text-gray-400 text-xs transition-transform duration-200" :class="{ 'rotate-180': dropdownOpen }" aria-hidden="true" />
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
        </div>
      </div>
    </div>

    <!-- Mobile Drawer (right side) -->
    <Transition name="drawer-backdrop">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
        @click="mobileOpen = false"
      />
    </Transition>

    <Transition name="drawer-slide">
      <div
        v-if="mobileOpen"
        class="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden flex flex-col"
      >
        <!-- Drawer Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-purple-100">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md">
              <i class="ti ti-sparkles text-white text-sm" aria-hidden="true" />
            </div>
            <div class="leading-none">
              <div class="text-xs font-bold text-gray-900 tracking-wide">SCENTIQUE</div>
              <div class="text-[8px] text-purple-500 tracking-[0.18em] font-semibold uppercase">Perfumes</div>
            </div>
          </div>
          <button
            @click="mobileOpen = false"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition"
            aria-label="Close menu"
          >
            <i class="ti ti-x text-lg" aria-hidden="true" />
          </button>
        </div>

        <!-- Drawer Nav Links -->
        <div class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div v-for="link in navLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              @click="mobileOpen = false"
              class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition"
              :class="isActive(link.to) ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'"
            >
              {{ link.label }}
              <i v-if="link.children" class="ti ti-chevron-right text-gray-400 text-xs" aria-hidden="true" />
            </RouterLink>

            <!-- Mobile sub-links -->
            <div v-if="link.children" class="ml-4 mt-1 space-y-0.5">
              <RouterLink
                v-for="child in link.children"
                :key="child.to"
                :to="child.to"
                @click="mobileOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-purple-700 hover:bg-purple-50/50 transition"
              >
                <i :class="child.icon" class="text-purple-400 text-sm w-4 text-center" aria-hidden="true" />
                <span>{{ child.label }}</span>
              </RouterLink>
            </div>
          </div>

          <div v-if="!auth.isLoggedIn" class="pt-4 mt-4 border-t border-purple-100 space-y-2 px-2">
            <RouterLink to="/login" @click="mobileOpen = false" class="block w-full text-center btn-outline text-sm py-2.5">
              Sign in
            </RouterLink>
            <RouterLink to="/register" @click="mobileOpen = false" class="block w-full text-center btn-primary text-sm py-2.5">
              Register
            </RouterLink>
          </div>

          <!-- Mobile auth links (logged in) -->
          <template v-if="auth.isLoggedIn">
            <div class="pt-4 mt-4 border-t border-purple-100 px-2">
              <div class="flex items-center gap-3 px-2 py-2 mb-2">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                  {{ initials }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ auth.userName }}</p>
                  <p class="text-xs text-gray-400">{{ auth.user?.email }}</p>
                </div>
              </div>
            </div>
            <RouterLink
              to="/profile"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition"
            >
              <i class="ti ti-user text-purple-400 text-sm w-5 text-center" aria-hidden="true" />
              My Profile
            </RouterLink>
            <RouterLink
              to="/orders"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition"
            >
              <i class="ti ti-package text-purple-400 text-sm w-5 text-center" aria-hidden="true" />
              My Orders
            </RouterLink>
            <RouterLink
              to="/wishlist"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition"
            >
              <i class="ti ti-heart text-purple-400 text-sm w-5 text-center" aria-hidden="true" />
              Wishlist
            </RouterLink>
            <div class="border-t border-purple-100 my-2 mx-2" />
            <button
              @click="handleLogout"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition w-full mx-2"
            >
              <i class="ti ti-logout text-red-400 text-sm w-5 text-center" aria-hidden="true" />
              Sign out
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

defineEmits<{ openSearch: []; openCart: [] }>()

const auth = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const route = useRoute()
const router = useRouter()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const mobileOpen = ref(false)
const scrolled = ref(false)
const navVisible = ref(true)
const navRef = ref<HTMLElement | null>(null)
const cartAnimating = ref(false)
const hoveredMenu = ref<string | null>(null)
const searchExpanded = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const scrollProgress = ref(0)

const cartCount = computed(() => cartStore.itemCount)
const wishlistCount = computed(() => wishlistStore.items.length)
const initials = computed(() =>
  auth.userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
)

const navLinks = [
  { to: '/', label: 'Home' },
  {
    to: '/products',
    label: 'Shop',
    children: [
      { to: '/products', label: 'All Products', icon: 'ti ti-bottle', desc: 'Browse our full collection' },
      { to: '/products?sort=newest', label: 'New Arrivals', icon: 'ti ti-sparkles', desc: 'Fresh drops just landed' },
      { to: '/products?sort=rating', label: 'Best Sellers', icon: 'ti ti-star', desc: 'Most loved by customers' },
      { to: '/products?sort=price_desc', label: 'Luxury Collection', icon: 'ti ti-crown', desc: 'Premium & exclusive scents' },
    ],
  },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to.split('?')[0] ?? '')
}

async function handleLogout() {
  dropdownOpen.value = false
  mobileOpen.value = false
  await auth.logout()
}

function expandSearch() {
  searchExpanded.value = true
  nextTick(() => searchInput.value?.focus())
}

function collapseSearch() {
  if (searchQuery.value === '') {
    searchExpanded.value = false
  }
}

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/products?search=${encodeURIComponent(searchQuery.value.trim())}`)
    searchExpanded.value = false
    searchQuery.value = ''
  }
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

let lastScrollY = 0

function handleScroll() {
  const currentScrollY = window.scrollY
  scrolled.value = currentScrollY > 10

  // Scroll progress
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0

  // Smart auto-hide
  if (currentScrollY > 80) {
    navVisible.value = currentScrollY < lastScrollY
  } else {
    navVisible.value = true
  }
  lastScrollY = currentScrollY
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

.mega-enter-active,
.mega-leave-active {
  transition: all 0.15s ease;
}
.mega-enter-from,
.mega-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.drawer-backdrop-enter-active,
.drawer-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-backdrop-enter-from,
.drawer-backdrop-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}

.search-expand-enter-active,
.search-expand-leave-active {
  transition: all 0.2s ease;
}
.search-expand-enter-from,
.search-expand-leave-to {
  opacity: 0;
  width: 0;
}
</style>
