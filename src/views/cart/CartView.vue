<template>
  <div class="min-h-screen bg-[#F8F5FF]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="() => {}" />

    <!-- Header -->
    <div class="bg-gradient-to-br from-purple-600 to-violet-700 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-purple-200 text-xs font-bold uppercase tracking-widest block mb-1">Your</span>
        <h1 class="text-3xl font-black text-white">Shopping Cart</h1>
        <p class="text-purple-200 text-sm mt-1">{{ cartStore.itemCount }} item{{ cartStore.itemCount !== 1 ? 's' : '' }}</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading -->
      <div v-if="cartStore.loading" class="grid md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-4">
          <div v-for="n in 3" :key="n" class="card-luxury p-5 flex gap-4 animate-pulse">
            <div class="w-24 h-24 skeleton rounded-xl flex-shrink-0" />
            <div class="flex-1 space-y-2">
              <div class="h-4 skeleton w-1/2" />
              <div class="h-3 skeleton w-1/3" />
              <div class="h-8 skeleton w-1/4 mt-4" />
            </div>
          </div>
        </div>
        <div class="h-64 skeleton rounded-2xl" />
      </div>

      <!-- Empty -->
      <div v-else-if="!cartStore.items.length" class="text-center py-24">
        <div class="w-24 h-24 rounded-3xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
          <i class="ti ti-shopping-bag text-5xl text-purple-300" aria-hidden="true" />
        </div>
        <h2 class="text-xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p class="text-gray-400 text-sm mb-8">Add some luxury fragrances to get started.</p>
        <RouterLink to="/products" class="btn-primary py-3 px-8 text-sm">
          Browse Fragrances
        </RouterLink>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid md:grid-cols-3 gap-8">
        <!-- Items list -->
        <div class="md:col-span-2 space-y-4">
          <TransitionGroup name="list" tag="div" class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.cart_id"
              class="card-luxury p-5 flex gap-4"
            >
              <!-- Image -->
              <RouterLink :to="`/products/${item.product.id}`" class="flex-shrink-0">
                <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-purple-50 border border-purple-100">
                  <img
                    v-if="item.product.image_url"
                    :src="imageUrl(item.product.image_url)"
                    :alt="item.product.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <i class="ti ti-photo text-3xl text-purple-200" aria-hidden="true" />
                  </div>
                </div>
              </RouterLink>

              <!-- Info -->
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <span v-if="item.product.category" class="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    {{ item.product.category.name }}
                  </span>
                  <RouterLink :to="`/products/${item.product.id}`">
                    <h3 class="text-sm font-bold text-gray-900 hover:text-purple-700 transition mt-1 line-clamp-1">
                      {{ item.product.name }}
                    </h3>
                  </RouterLink>
                  <p class="text-xs text-purple-500 font-semibold mt-0.5">
                    ${{ item.product.price.toFixed(2) }} each
                  </p>
                </div>

                <div class="flex items-center justify-between gap-3 mt-3">
                  <!-- Qty -->
                  <div class="flex items-center gap-1 bg-purple-50 border border-purple-100 rounded-xl px-1 py-0.5">
                    <button
                      @click="updateQty(item, item.quantity - 1)"
                      :disabled="updatingId === item.cart_id"
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:text-purple-600 transition disabled:opacity-40"
                      aria-label="Decrease"
                    >
                      <i class="ti ti-minus text-xs" aria-hidden="true" />
                    </button>
                    <span class="w-8 text-center text-sm font-bold text-gray-900">{{ item.quantity }}</span>
                    <button
                      @click="updateQty(item, item.quantity + 1)"
                      :disabled="updatingId === item.cart_id || item.quantity >= item.product.stock"
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-white hover:text-purple-600 transition disabled:opacity-40"
                      aria-label="Increase"
                    >
                      <i class="ti ti-plus text-xs" aria-hidden="true" />
                    </button>
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-base font-black text-gray-900">${{ item.subtotal.toFixed(2) }}</span>
                    <button
                      @click="removeItem(item)"
                      :disabled="removingId === item.cart_id"
                      class="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition"
                      aria-label="Remove item"
                    >
                      <i class="ti ti-trash text-sm" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Continue shopping + clear -->
          <div class="flex items-center justify-between pt-2">
            <RouterLink to="/products" class="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition">
              <i class="ti ti-arrow-left" aria-hidden="true" />
              Continue Shopping
            </RouterLink>
            <button
              @click="clearCart"
              class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition font-medium"
            >
              <i class="ti ti-trash" aria-hidden="true" />
              Clear Cart
            </button>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="space-y-4">
          <!-- Coupon -->
          <div class="card-luxury p-5">
            <h3 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i class="ti ti-discount text-purple-500" aria-hidden="true" />
              Promo Code
            </h3>
            <div class="flex gap-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="e.g. WELCOME15"
                class="flex-1 px-3.5 py-2.5 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20"
              />
              <button class="btn-primary text-xs px-4 py-2.5 flex-shrink-0">Apply</button>
            </div>
          </div>

          <!-- Summary Card -->
          <div class="card-luxury p-5 sticky top-24">
            <h3 class="text-sm font-bold text-gray-900 mb-5">Order Summary</h3>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ cartStore.itemCount }} items)</span>
                <span class="font-semibold">${{ cartStore.total.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span class="font-semibold" :class="cartStore.total >= 100 ? 'text-green-600' : ''">
                  {{ cartStore.total >= 100 ? 'Free' : '$9.99' }}
                </span>
              </div>
              <div v-if="cartStore.total < 100" class="text-xs text-purple-600 bg-purple-50 rounded-xl px-3 py-2 flex items-center gap-1.5">
                <i class="ti ti-truck" aria-hidden="true" />
                Add ${{ (100 - cartStore.total).toFixed(2) }} more for free shipping
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tax (est.)</span>
                <span class="font-semibold">${{ (cartStore.total * 0.08).toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-black text-gray-900 text-lg border-t border-purple-100 pt-3 mt-3">
                <span>Total</span>
                <span class="text-purple-700">${{ orderTotal.toFixed(2) }}</span>
              </div>
            </div>

            <RouterLink
              to="/checkout"
              class="w-full btn-primary py-3.5 text-sm text-center block mt-5 flex items-center justify-center gap-2"
            >
              <i class="ti ti-lock text-sm" aria-hidden="true" />
              Proceed to Checkout
            </RouterLink>

            <!-- Trust badges -->
            <div class="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-purple-50">
              <div v-for="b in trustBadges" :key="b.text" class="flex items-center gap-1 text-gray-400">
                <i :class="`ti ${b.icon} text-purple-400 text-sm`" aria-hidden="true" />
                <span class="text-[10px] font-medium">{{ b.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { imageUrl } from '@/utils/image'
import api from '@/plugins/axios'
import type { CartItem } from '@/types/cart'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'

const cartStore = useCartStore()
const searchOpen = ref(false)
const couponCode = ref('')
const updatingId = ref<number | null>(null)
const removingId = ref<number | null>(null)

const shipping = computed(() => cartStore.total >= 100 ? 0 : 9.99)
const tax = computed(() => cartStore.total * 0.08)
const orderTotal = computed(() => cartStore.total + shipping.value + tax.value)

const trustBadges = [
  { icon: 'ti-shield-lock', text: 'Secure' },
  { icon: 'ti-refresh', text: 'Easy Returns' },
  { icon: 'ti-truck', text: 'Fast Ship' },
]

async function updateQty(item: CartItem, qty: number) {
  if (qty < 1) return removeItem(item)
  if (qty > item.product.stock) return
  updatingId.value = item.cart_id
  try {
    await api.put(`/cart/${item.cart_id}`, { quantity: qty })
    await cartStore.fetchCart()
  } finally {
    updatingId.value = null
  }
}

async function removeItem(item: CartItem) {
  removingId.value = item.cart_id
  try {
    await api.delete(`/cart/${item.cart_id}`)
    await cartStore.fetchCart()
  } finally {
    removingId.value = null
  }
}

async function clearCart() {
  if (!confirm('Remove all items from cart?')) return
  await cartStore.clearCart()
}

onMounted(() => cartStore.fetchCart())
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
