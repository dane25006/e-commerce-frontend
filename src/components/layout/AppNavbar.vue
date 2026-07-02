<template>
  <nav
    ref="navRef"
    class="sticky top-0 z-50 transition-all duration-500"
    :class="[
      navVisible ? 'translate-y-0' : '-translate-y-full',
      scrolled ? 'glass shadow-sm' : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-18">

        <!-- Mobile Menu Trigger -->
        <button
          @click="mobileOpen = true"
          class="lg:hidden p-2 -ml-2 rounded-lg transition"
          style="color: var(--secondary);"
          :aria-label="$t('nav.openMenu')"
        >
          <i class="ti ti-menu-2 text-xl" aria-hidden="true" />
        </button>

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3 flex-shrink-0 group">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
            style="background: var(--primary);"
          >
            <span class="text-white text-lg font-bold tracking-tight" style="font-family: var(--font-heading);">S</span>
          </div>
          <div class="leading-none">
            <div class="text-sm tracking-[0.2em] font-semibold" :class="isKhmer ? '' : 'uppercase'" style="color: var(--secondary); font-family: var(--font-heading);">{{ $t('app.name') }}</div>
            <div class="text-[8px] tracking-[0.25em] font-medium" :class="isKhmer ? 'khmer-brand' : 'uppercase'" style="color: var(--primary);">{{ $t('app.tagline') }}</div>
          </div>
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="hidden lg:flex items-center gap-0">
          <div
            v-for="link in navLinks"
            :key="link.to"
            class="relative"
            @mouseenter="hoveredMenu = link.label"
            @mouseleave="hoveredMenu = null"
          >
            <RouterLink
              :to="link.to"
              class="px-3.5 py-2 text-[10px] tracking-[0.15em] font-bold rounded-lg transition-all duration-300 flex items-center gap-1 nav-link"
              :class="[isActive(link.to) ? 'active' : '', isKhmer ? 'khmer-nav' : 'uppercase']"
              style="color: var(--secondary); font-family: var(--font-body);"
            >
              {{ link.label }}
              <i v-if="link.children" class="ti ti-chevron-down text-[9px] transition-transform duration-200" :class="{ 'rotate-180': hoveredMenu === link.label }" aria-hidden="true" />
            </RouterLink>

            <Transition name="mega">
              <div
                v-if="link.children && hoveredMenu === link.label"
                class="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl z-50 p-2"
                style="border: 1px solid var(--border);"
              >
                <RouterLink
                  v-for="child in link.children"
                  :key="child.to"
                  :to="child.to"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all duration-200 hover-lift"
                  style="color: var(--secondary); font-family: var(--font-body);"
                >
                  <i :class="child.icon" class="text-sm w-5 text-center" style="color: var(--primary);" aria-hidden="true" />
                  <div>
                     <p class="font-bold text-[13px]" style="color: var(--secondary); font-family: var(--font-body);">{{ child.label }}</p>
                    <p v-if="child.desc" class="text-[10px] tracking-wide" style="color: #999999; font-family: var(--font-body);">{{ child.desc }}</p>
                  </div>
                </RouterLink>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-0">
          <LanguageSwitcher />

          <!-- Search -->
          <button
            @click="$emit('openSearch')"
            class="p-2.5 rounded-lg transition-all duration-300 icon-btn"
            style="color: var(--secondary);"
            :aria-label="$t('nav.search')"
          >
            <i class="ti ti-search text-lg" aria-hidden="true" />
          </button>

          <!-- Wishlist -->
          <RouterLink
            to="/wishlist"
            class="relative p-2.5 rounded-lg transition-all duration-300 icon-btn"
            style="color: var(--secondary);"
            :aria-label="$t('nav.wishlist')"
          >
            <i class="ti ti-heart text-lg" aria-hidden="true" />
            <span
              v-if="wishlistCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center px-1 text-[8px] font-bold rounded-full text-white animate-scale-in"
              style="background: var(--primary);"
            >
              {{ wishlistCount > 9 ? '9+' : wishlistCount }}
            </span>
          </RouterLink>

          <!-- Cart -->
          <button
            @click="$emit('openCart')"
            class="relative p-2.5 rounded-lg transition-all duration-300 icon-btn"
            :class="{ 'cart-animate': cartAnimating }"
            style="color: var(--secondary);"
            :aria-label="$t('nav.cart')"
          >
            <i class="ti ti-shopping-bag text-lg" aria-hidden="true" />
            <span
              v-if="cartCount > 0"
              class="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center px-1 text-[8px] font-bold rounded-full text-white animate-scale-in"
              style="background: var(--primary);"
            >
              {{ cartCount > 9 ? '9+' : cartCount }}
            </span>
          </button>

          <!-- Auth -->
          <template v-if="!auth.isLoggedIn">
            <RouterLink
              to="/login"
              class="hidden sm:block text-[10px] tracking-[0.1em] uppercase font-medium px-3 py-2 rounded-lg transition-all duration-300"
              style="color: var(--secondary);"
            >
              {{ $t('nav.login') }}
            </RouterLink>
            <RouterLink
              to="/register"
              class="hidden sm:block text-[10px] tracking-[0.1em] uppercase font-medium px-4 py-2 rounded-lg transition-all duration-300"
              style="background: var(--primary); color: white;"
            >
              {{ $t('nav.register') }}
            </RouterLink>
          </template>

          <template v-else>
            <div class="relative" ref="dropdownRef">
              <button
                @click="dropdownOpen = !dropdownOpen"
                class="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg transition-all duration-300 text-xs group"
                style="color: var(--secondary);"
              >
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-2 transition-all duration-300"
                  style="background: var(--primary);">
                  {{ initials }}
                </div>
                <span class="hidden sm:block font-medium max-w-[80px] truncate text-[12px]">{{ auth.userName }}</span>
                <i class="ti ti-chevron-down text-[10px] transition-transform duration-200"
                  :class="{ 'rotate-180': dropdownOpen }" style="color: var(--primary);" aria-hidden="true" />
              </button>

              <Transition name="dropdown">
                <div
                  v-if="dropdownOpen"
                  class="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl py-2 z-50"
                  style="border: 1px solid var(--border);"
                >
                  <div class="px-4 py-2 border-b mb-1 min-w-0" style="border-color: var(--border);">
                    <p class="text-[12px] font-semibold truncate" style="color: var(--secondary);" :title="auth.userName">{{ auth.userName }}</p>
                    <p class="text-[10px] truncate" style="color: #999999;" :title="auth.user?.email">{{ auth.user?.email }}</p>
                  </div>
                  <RouterLink
                    to="/profile"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-2.5 px-4 py-2 text-xs transition-all duration-200"
                    style="color: var(--secondary);"
                  >
                    <i class="ti ti-user text-sm" style="color: var(--primary);" aria-hidden="true" />
                    {{ $t('nav.myProfile') }}
                  </RouterLink>
                  <RouterLink
                    to="/orders"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-2.5 px-4 py-2 text-xs transition-all duration-200"
                    style="color: var(--secondary);"
                  >
                    <i class="ti ti-package text-sm" style="color: var(--primary);" aria-hidden="true" />
                    {{ $t('nav.myOrders') }}
                  </RouterLink>
                  <RouterLink
                    to="/wishlist"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-2.5 px-4 py-2 text-xs transition-all duration-200"
                    style="color: var(--secondary);"
                  >
                    <i class="ti ti-heart text-sm" style="color: var(--primary);" aria-hidden="true" />
                    {{ $t('nav.wishlist') }}
                  </RouterLink>
                  <RouterLink
                    to="/settings/telegram"
                    @click="dropdownOpen = false"
                    class="flex items-center gap-2.5 px-4 py-2 text-xs transition-all duration-200"
                    style="color: var(--secondary);"
                  >
                    <i class="ti ti-brand-telegram text-sm" style="color: var(--primary);" aria-hidden="true" />
                    {{ $t('nav.telegram') }}
                  </RouterLink>
                  <div class="border-t my-1" style="border-color: var(--border);" />
                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold transition-all duration-200"
                  >
                    <i class="ti ti-logout text-sm" aria-hidden="true" />
                    {{ $t('nav.logout') }}
                  </button>
                </div>
              </Transition>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Backdrop -->
    <Transition name="drawer-backdrop">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-40 lg:hidden"
        style="background: rgba(43,43,43,0.5); backdrop-filter: blur(4px);"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- Mobile Drawer -->
    <Transition name="drawer-slide">
      <div
        v-if="mobileOpen"
        class="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden flex flex-col"
      >
        <div class="flex items-center justify-between px-5 py-4" style="border-bottom: 1px solid var(--border);">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--primary);">
              <span class="text-white text-sm font-bold" style="font-family: var(--font-heading);">S</span>
            </div>
            <div class="leading-none">
              <div class="text-xs tracking-[0.2em] font-semibold uppercase" style="color: var(--secondary); font-family: var(--font-heading);">{{ $t('app.name') }}</div>
              <div class="text-[7px] tracking-[0.25em] font-medium uppercase" style="color: var(--primary);">{{ $t('app.tagline') }}</div>
            </div>
          </div>
          <button
            @click="mobileOpen = false"
            class="p-2 rounded-lg transition-all duration-200"
            style="color: var(--secondary);"
            :aria-label="$t('nav.closeMenu')"
          >
            <i class="ti ti-x text-lg" aria-hidden="true" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div v-for="link in navLinks" :key="link.to">
            <RouterLink
              :to="link.to"
              @click="mobileOpen = false"
              class="flex items-center justify-between px-4 py-3 rounded-lg text-xs tracking-[0.1em] font-bold transition-all duration-200"
              :class="[isActive(link.to) ? 'active-mobile' : '', isKhmer ? '' : 'uppercase']"
              style="color: var(--secondary); font-family: var(--font-body);"
            >
              {{ link.label }}
              <i v-if="link.children" class="ti ti-chevron-right text-[10px]" style="color: var(--primary);" aria-hidden="true" />
            </RouterLink>

            <div v-if="link.children" class="ml-4 mt-1 space-y-0.5">
              <RouterLink
                v-for="child in link.children"
                :key="child.to"
                :to="child.to"
                @click="mobileOpen = false"
                class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all duration-200"
                style="color: #999999; font-family: var(--font-body);"
              >
                <i :class="child.icon" class="text-sm w-4 text-center" style="color: var(--primary);" aria-hidden="true" />
                <span>{{ child.label }}</span>
              </RouterLink>
            </div>
          </div>

          <div v-if="!auth.isLoggedIn" class="pt-4 mt-4 space-y-2 px-2" style="border-top: 1px solid var(--border);">
            <RouterLink to="/login" @click="mobileOpen = false" class="block w-full text-center text-[10px] tracking-[0.1em] uppercase font-medium py-2.5 rounded-lg transition-all duration-200" style="border: 1px solid var(--primary); color: var(--primary); font-family: var(--font-body);">
              {{ $t('nav.login') }}
            </RouterLink>
            <RouterLink to="/register" @click="mobileOpen = false" class="block w-full text-center text-[10px] tracking-[0.1em] uppercase font-medium py-2.5 rounded-lg transition-all duration-200" style="background: var(--primary); color: white; font-family: var(--font-body);">
              {{ $t('nav.register') }}
            </RouterLink>
          </div>

          <template v-if="auth.isLoggedIn">
            <div class="pt-4 mt-4 px-2" style="border-top: 1px solid var(--border);">
              <div class="flex items-center gap-3 px-2 py-2 mb-2">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style="background: var(--primary);">
                  {{ initials }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold truncate" style="color: var(--secondary);" :title="auth.userName">{{ auth.userName }}</p>
                  <p class="text-xs truncate" style="color: #999999;" :title="auth.user?.email">{{ auth.user?.email }}</p>
                </div>
              </div>
            </div>
            <RouterLink
              to="/profile"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all duration-200"
              style="color: var(--secondary); font-family: var(--font-body);"
            >
              <i class="ti ti-user text-sm w-5 text-center" style="color: var(--primary);" aria-hidden="true" />
              {{ $t('nav.myProfile') }}
            </RouterLink>
            <RouterLink
              to="/orders"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all duration-200"
              style="color: var(--secondary); font-family: var(--font-body);"
            >
              <i class="ti ti-package text-sm w-5 text-center" style="color: var(--primary);" aria-hidden="true" />
              {{ $t('nav.myOrders') }}
            </RouterLink>
            <RouterLink
              to="/wishlist"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all duration-200"
              style="color: var(--secondary); font-family: var(--font-body);"
            >
              <i class="ti ti-heart text-sm w-5 text-center" style="color: var(--primary);" aria-hidden="true" />
              {{ $t('nav.wishlist') }}
            </RouterLink>
            <RouterLink
              to="/settings/telegram"
              @click="mobileOpen = false"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs transition-all duration-200"
              style="color: var(--secondary); font-family: var(--font-body);"
            >
              <i class="ti ti-brand-telegram text-sm w-5 text-center" style="color: var(--primary);" aria-hidden="true" />
              {{ $t('nav.telegram') }}
            </RouterLink>
            <div class="border-t my-2 mx-2" style="border-color: var(--border);" />
            <button
              @click="handleLogout"
              class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold transition-all duration-200 w-full mx-2"
            >
              <i class="ti ti-logout text-sm w-5 text-center" aria-hidden="true" />
              {{ $t('nav.logout') }}
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </nav>

  <ConfirmModal
    ref="logoutModal"
    :title="$t('logout.title')"
    :message="$t('logout.message')"
    :confirm-text="$t('logout.confirm')"
    :cancel-text="$t('logout.cancel')"
    @confirm="confirmLogout"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'

defineEmits<{ openSearch: []; openCart: [] }>()

const auth = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const route = useRoute()
const router = useRouter()

const { t, locale } = useI18n()
const isKhmer = computed(() => locale.value === 'km')

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const mobileOpen = ref(false)
const scrolled = ref(false)
const navVisible = ref(true)
const navRef = ref<HTMLElement | null>(null)
const cartAnimating = ref(false)
const hoveredMenu = ref<string | null>(null)
const logoutModal = ref<InstanceType<typeof ConfirmModal> | null>(null)

const cartCount = computed(() => cartStore.itemCount)
const wishlistCount = computed(() => wishlistStore.items.length)
const initials = computed(() =>
  auth.userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
)

const navLinks = computed(() => [
  { to: '/', label: t('nav.home') },
  {
    to: '/products',
    label: t('nav.shop'),
    children: [
      { to: '/products', label: t('nav.allProducts'), icon: 'ti ti-bottle', desc: t('nav.allProductsDesc') },
      { to: '/new-arrivals', label: t('nav.newArrivals'), icon: 'ti ti-sparkles', desc: t('nav.newArrivalsDesc') },
      { to: '/best-sellers', label: t('nav.bestSellers'), icon: 'ti ti-star', desc: t('nav.bestSellersDesc') },
      { to: '/products?sort=price_desc', label: t('nav.luxuryCollection'), icon: 'ti ti-crown', desc: t('nav.luxuryCollectionDesc') },
    ],
  },
  { to: '/collections', label: t('nav.collections') },
  { to: '/brands', label: t('nav.brands') },
  { to: '/about', label: t('nav.about') },
  { to: '/contact', label: t('nav.contact') },
  { to: '/orders', label: t('nav.myOrders') },
])

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to.split('?')[0] ?? '')
}

function handleLogout() {
  dropdownOpen.value = false
  mobileOpen.value = false
  logoutModal.value?.open()
}

async function confirmLogout() {
  await auth.logout()
  logoutModal.value?.close()
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
:root {
  --primary: #B88A44;
  --secondary: #2B2B2B;
  --text: #222222;
  --border: #E7E1D8;
}

/* Glass effect */
.glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

/* Navigation link underline effect */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  width: 0;
  height: 1.5px;
  background: var(--primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 2px;
}
.nav-link:hover::after,
.nav-link.active::after {
  width: 60%;
}

/* Icon buttons */
.icon-btn:hover {
  color: var(--primary) !important;
}

/* Dropdown hover lift */
.hover-lift:hover {
  background: rgba(184, 138, 68, 0.06);
  transform: translateX(2px);
}

/* Mobile active link */
.active-mobile {
  background: rgba(184, 138, 68, 0.08);
  color: var(--primary) !important;
}

/* Transitions */
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

/* Scale in animation for badges */
.animate-scale-in {
  animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Khmer creative styling */
.khmer-nav {
  font-size: 13px;
  letter-spacing: 0.06em;
  font-weight: 700;
  padding-top: 3px;
  padding-bottom: 3px;
}

.khmer-brand {
  font-size: 11px;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: var(--primary);
}
</style>
