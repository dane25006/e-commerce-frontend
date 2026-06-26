<template>
  <div class="min-h-screen bg-[#F8F5FF]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="() => {}" />

    <!-- Header -->
    <div class="bg-gradient-to-br from-purple-600 to-violet-700 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-purple-200 text-xs font-bold uppercase tracking-widest block mb-1">Secure</span>
        <h1 class="text-3xl font-black text-white flex items-center gap-3">
          <i class="ti ti-lock" aria-hidden="true" />
          Checkout
        </h1>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Empty cart redirect -->
      <div v-if="!cartStore.items.length && !orderSuccess" class="text-center py-20">
        <i class="ti ti-shopping-bag text-5xl text-purple-200 block mb-4" aria-hidden="true" />
        <h2 class="text-lg font-black text-gray-900 mb-2">Your cart is empty</h2>
        <RouterLink to="/products" class="btn-primary py-3 px-8 text-sm mt-2 inline-block">Browse Fragrances</RouterLink>
      </div>

      <!-- Order Success -->
      <Transition name="fade">
        <div v-if="orderSuccess" class="text-center py-20">
          <div class="w-24 h-24 rounded-3xl bg-green-100 flex items-center justify-center mx-auto mb-6">
            <i class="ti ti-circle-check text-5xl text-green-500" aria-hidden="true" />
          </div>
          <h2 class="text-2xl font-black text-gray-900 mb-2">Order Placed!</h2>
          <p class="text-gray-500 text-sm mb-2">Thank you for your purchase. We'll notify you when it ships.</p>
          <p v-if="placedOrderId" class="text-purple-700 font-bold text-base mb-8">Order #{{ placedOrderId }}</p>
          <div class="flex items-center gap-4 justify-center">
            <RouterLink to="/orders" class="btn-primary py-3 px-8 text-sm">View Orders</RouterLink>
            <RouterLink to="/products" class="btn-outline py-3 px-8 text-sm">Continue Shopping</RouterLink>
          </div>
        </div>
      </Transition>

      <!-- Checkout form -->
      <div v-if="cartStore.items.length && !orderSuccess" class="grid md:grid-cols-5 gap-8">
        <!-- Form -->
        <div class="md:col-span-3 space-y-5">
          <!-- Shipping Info card -->
          <div class="card-luxury p-6">
            <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <i class="ti ti-truck text-purple-500" aria-hidden="true" />
              Shipping Information
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2 sm:col-span-1">
                <label class="block text-xs font-bold text-gray-700 mb-1.5">First Name</label>
                <input v-model="form.first_name" type="text" required
                  class="w-full px-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20" />
              </div>
              <div class="col-span-2 sm:col-span-1">
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Last Name</label>
                <input v-model="form.last_name" type="text" required
                  class="w-full px-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
                <div class="relative">
                  <i class="ti ti-mail absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-sm" aria-hidden="true" />
                  <input v-model="form.email" type="email" required
                    class="w-full pl-10 pr-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20" />
                </div>
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-bold text-gray-700 mb-1.5">Street Address</label>
                <div class="relative">
                  <i class="ti ti-map-pin absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-sm" aria-hidden="true" />
                  <input v-model="form.address" type="text" required placeholder="123 Main Street"
                    class="w-full pl-10 pr-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">City</label>
                <input v-model="form.city" type="text" required
                  class="w-full px-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 mb-1.5">ZIP Code</label>
                <input v-model="form.zip" type="text" required
                  class="w-full px-4 py-3 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/20" />
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div class="card-luxury p-6">
            <h2 class="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
              <i class="ti ti-credit-card text-purple-500" aria-hidden="true" />
              Payment Method
            </h2>
            <div class="space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition"
                :class="form.payment_method === method.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'"
              >
                <input v-model="form.payment_method" type="radio" :value="method.value" class="accent-purple-600" />
                <i :class="`ti ${method.icon} text-xl`" :style="{ color: method.color }" aria-hidden="true" />
                <span class="text-sm font-semibold text-gray-700">{{ method.label }}</span>
              </label>
            </div>
          </div>

          <!-- Error -->
          <div v-if="checkoutError" class="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <i class="ti ti-alert-circle flex-shrink-0" aria-hidden="true" />
            {{ checkoutError }}
          </div>
        </div>

        <!-- Order summary -->
        <div class="md:col-span-2">
          <div class="card-luxury p-5 sticky top-24">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Order Summary</h3>

            <!-- Items preview -->
            <div class="space-y-3 mb-4 max-h-48 overflow-y-auto">
              <div v-for="item in cartStore.items" :key="item.cart_id" class="flex gap-3">
                <div class="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 overflow-hidden flex-shrink-0">
                  <img v-if="item.product.image_url" :src="imageUrl(item.product.image_url)" :alt="item.product.name"
                    class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <i class="ti ti-photo text-purple-200" aria-hidden="true" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-gray-900 line-clamp-1">{{ item.product.name }}</p>
                  <p class="text-xs text-gray-400">Qty: {{ item.quantity }}</p>
                </div>
                <p class="text-xs font-bold text-gray-900 flex-shrink-0">${{ item.subtotal.toFixed(2) }}</p>
              </div>
            </div>

            <div class="border-t border-purple-100 pt-4 space-y-2 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ cartStore.total.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span class="text-green-600 font-semibold">{{ cartStore.total >= 100 ? 'Free' : '$9.99' }}</span>
              </div>
              <div class="flex justify-between font-black text-gray-900 text-base border-t border-purple-100 pt-3 mt-2">
                <span>Total</span>
                <span class="text-purple-700">${{ (cartStore.total + (cartStore.total >= 100 ? 0 : 9.99)).toFixed(2) }}</span>
              </div>
            </div>

            <button
              @click="placeOrder"
              :disabled="placing"
              class="w-full btn-primary py-4 text-sm mt-5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:transform-none disabled:shadow-none"
            >
              <i v-if="placing" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
              <i v-else class="ti ti-lock" aria-hidden="true" />
              {{ placing ? 'Placing Order...' : 'Place Order' }}
            </button>

            <div class="flex items-center justify-center gap-3 mt-4 text-xs text-gray-400">
              <i class="ti ti-shield-lock text-purple-400" aria-hidden="true" />
              Secured by SSL encryption
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
import { ref, reactive, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { imageUrl } from '@/utils/image'
import api from '@/plugins/axios'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'

const cartStore = useCartStore()
const auth = useAuthStore()
const searchOpen = ref(false)
const placing = ref(false)
const checkoutError = ref('')
const orderSuccess = ref(false)
const placedOrderId = ref<number | null>(null)

const form = reactive({
  first_name: '',
  last_name: '',
  email: auth.user?.email ?? '',
  address: '',
  city: '',
  zip: '',
  payment_method: 'cash_on_delivery',
})

const paymentMethods = [
  { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: 'ti-cash', color: '#22c55e' },
  { value: 'credit_card', label: 'Credit / Debit Card', icon: 'ti-credit-card', color: '#8B5CF6' },
  { value: 'paypal', label: 'PayPal', icon: 'ti-brand-paypal', color: '#0070ba' },
]

async function placeOrder() {
  if (!form.address || !form.city || !form.zip) {
    checkoutError.value = 'Please fill in all required shipping fields.'
    return
  }
  placing.value = true
  checkoutError.value = ''
  try {
    const { data } = await api.post<{ order: { id: number } }>('/checkout', {
      shipping_address: `${form.first_name} ${form.last_name}, ${form.address}, ${form.city} ${form.zip}`,
      payment_method: form.payment_method,
    })
    placedOrderId.value = data.order.id
    await cartStore.clearCart()
    orderSuccess.value = true
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    checkoutError.value = e.response?.data?.message ?? 'Failed to place order. Please try again.'
  } finally {
    placing.value = false
  }
}

onMounted(async () => {
  await cartStore.fetchCart()
  if (auth.user) {
    const nameParts = auth.user.name.split(' ')
    form.first_name = nameParts[0] ?? ''
    form.last_name = nameParts.slice(1).join(' ')
    form.email = auth.user.email
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
