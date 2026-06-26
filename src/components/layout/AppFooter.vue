<template>
  <footer class="bg-gray-900 text-white">
    <!-- Main footer -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        <!-- Brand -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <i class="ti ti-sparkles text-white text-lg" aria-hidden="true" />
            </div>
            <div>
              <div class="text-base font-black tracking-wide">SCENTIQUE</div>
              <div class="text-[9px] text-purple-400 tracking-[0.2em] font-semibold">PERFUMES</div>
            </div>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
            Luxury fragrances crafted with the finest ingredients from around the world. Elevate every moment.
          </p>
          <!-- Social Icons -->
          <div class="flex items-center gap-3">
            <a
              v-for="social in socials"
              :key="social.label"
              href="#"
              :aria-label="social.label"
              class="w-9 h-9 rounded-xl bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-200"
            >
              <i :class="`ti ${social.icon} text-sm`" aria-hidden="true" />
            </a>
          </div>
        </div>

        <!-- Shop Links -->
        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Shop</h4>
          <ul class="space-y-2.5">
            <li v-for="link in shopLinks" :key="link.label">
              <RouterLink :to="link.to" class="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Customer Care</h4>
          <ul class="space-y-2.5">
            <li v-for="link in serviceLinks" :key="link.label">
              <a href="#" class="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-200">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Contact</h4>
          <ul class="space-y-3">
            <li v-for="c in contacts" :key="c.text" class="flex items-start gap-2.5">
              <i :class="`ti ${c.icon} text-purple-400 text-sm mt-0.5 flex-shrink-0`" aria-hidden="true" />
              <span class="text-sm text-gray-400">{{ c.text }}</span>
            </li>
          </ul>

          <!-- Newsletter -->
          <div class="mt-6">
            <p class="text-xs font-semibold text-gray-300 mb-2">Stay in the loop</p>
            <div class="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                class="flex-1 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 px-3.5 py-2.5 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button class="btn-primary text-xs px-3 py-2.5 flex-shrink-0">
                <i class="ti ti-send" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-gray-800 py-5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-gray-500">
          © {{ new Date().getFullYear() }} Scentique Perfumes. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <a href="#" class="text-xs text-gray-500 hover:text-purple-400 transition">Privacy Policy</a>
          <a href="#" class="text-xs text-gray-500 hover:text-purple-400 transition">Terms of Service</a>
          <a href="#" class="text-xs text-gray-500 hover:text-purple-400 transition">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socials = [
  { label: 'Instagram', icon: 'ti-brand-instagram' },
  { label: 'Facebook', icon: 'ti-brand-facebook' },
  { label: 'Twitter', icon: 'ti-brand-twitter' },
  { label: 'Pinterest', icon: 'ti-brand-pinterest' },
]

const shopLinks = [
  { label: 'All Products', to: '/products' },
  { label: 'New Arrivals', to: '/products?sort=newest' },
  { label: 'Best Sellers', to: '/products?sort=price_desc' },
  { label: 'Gift Sets', to: '/products' },
  { label: 'Travel Size', to: '/products' },
]

const serviceLinks = [
  { label: 'Track Your Order' },
  { label: 'Returns & Exchanges' },
  { label: 'Shipping Information' },
  { label: 'Size Guide' },
  { label: 'FAQ' },
]

const contacts = [
  { icon: 'ti-map-pin', text: '123 Luxury Lane, Paris, France' },
  { icon: 'ti-phone', text: '+1 (800) 555-0199' },
  { icon: 'ti-mail', text: 'hello@scentique.com' },
  { icon: 'ti-clock', text: 'Mon–Fri, 9am–6pm EST' },
]
</script>
