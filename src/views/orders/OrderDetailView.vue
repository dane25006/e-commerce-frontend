<template>
  <div class="min-h-screen bg-[#F8F5FF]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Back -->
      <RouterLink to="/orders" class="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold mb-6 transition">
        <i class="ti ti-arrow-left" aria-hidden="true" />
        Back to Orders
      </RouterLink>

      <!-- Loading -->
      <div v-if="loading" class="card-luxury p-8 animate-pulse space-y-4">
        <div class="h-6 skeleton w-1/3" />
        <div class="h-4 skeleton w-1/4" />
        <div class="h-32 skeleton rounded-xl mt-6" />
        <div class="h-48 skeleton rounded-xl" />
      </div>

      <!-- Not found -->
      <div v-else-if="!order" class="text-center py-20 text-gray-400">
        <i class="ti ti-package-off text-5xl block mb-4 text-purple-200" aria-hidden="true" />
        <p class="font-bold text-gray-600">Order not found</p>
        <RouterLink to="/orders" class="text-purple-600 hover:underline text-sm mt-3 inline-block">← Back to Orders</RouterLink>
      </div>

      <template v-else>
        <div class="space-y-5">
          <!-- Header card -->
          <div class="card-luxury p-6">
            <div class="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <h1 class="text-2xl font-black text-gray-900">Order #{{ order.id }}</h1>
                <p class="text-sm text-gray-400 mt-0.5">Placed on {{ formatDate(order.created_at) }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold px-3 py-1.5 rounded-full border" :class="statusStyle(order.status)">
                  {{ capitalize(order.status) }}
                </span>
                <button
                  v-if="order.status === 'pending'"
                  @click="cancelOrder"
                  :disabled="cancelling"
                  class="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-xl font-semibold transition disabled:opacity-50"
                >
                  <i :class="cancelling ? 'ti ti-loader-2 animate-spin' : 'ti ti-x'" class="text-sm" aria-hidden="true" />
                  Cancel
                </button>
              </div>
            </div>

            <!-- Progress timeline -->
            <div class="flex items-center overflow-x-auto scrollbar-hide pb-2">
              <div v-for="(step, i) in orderSteps" :key="step.status" class="flex items-center">
                <div class="flex flex-col items-center flex-shrink-0">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition"
                    :class="isStepDone(order.status, step.status)
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-300/40'
                      : 'bg-white border-gray-200 text-gray-300'">
                    <i :class="`ti ${step.icon} text-sm`" aria-hidden="true" />
                  </div>
                  <span class="text-[10px] mt-1.5 font-semibold whitespace-nowrap"
                    :class="isStepDone(order.status, step.status) ? 'text-purple-600' : 'text-gray-400'">
                    {{ step.label }}
                  </span>
                </div>
                <div v-if="i < orderSteps.length - 1"
                  class="w-12 sm:w-20 h-0.5 flex-shrink-0 mx-1 rounded-full"
                  :class="isStepDone(order.status, nextStepStatus(i)) ? 'bg-purple-400' : 'bg-gray-200'" />
              </div>
            </div>
          </div>

          <!-- Items -->
          <div class="card-luxury p-6">
            <h2 class="text-base font-bold text-gray-900 mb-4">Order Items</h2>
            <div class="space-y-4">
              <div v-for="item in order.items" :key="item.id" class="flex gap-4 py-3 border-b border-purple-50 last:border-0">
                <div class="w-16 h-16 rounded-xl bg-purple-50 border border-purple-100 overflow-hidden flex-shrink-0">
                  <img v-if="item.product?.image_url" :src="imageUrl(item.product.image_url)" :alt="item.product?.name"
                    class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <i class="ti ti-photo text-xl text-purple-200" aria-hidden="true" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-900 line-clamp-1">{{ item.product?.name ?? 'Product' }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">Qty: {{ item.quantity }} × ${{ Number(item.price).toFixed(2) }}</p>
                </div>
                <p class="text-sm font-black text-gray-900 flex-shrink-0">${{ item.subtotal.toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="card-luxury p-6">
            <h2 class="text-base font-bold text-gray-900 mb-4">Order Summary</h2>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ order.total.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span class="text-green-600 font-semibold">Free</span>
              </div>
              <div class="flex justify-between font-black text-gray-900 text-base border-t border-purple-100 pt-3 mt-3">
                <span>Total</span>
                <span class="text-purple-700">${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/plugins/axios'
import { imageUrl } from '@/utils/image'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

const route = useRoute()
const searchOpen = ref(false)
const cartOpen = ref(false)
const loading = ref(false)
const cancelling = ref(false)

interface OrderItem {
  id: number
  quantity: number
  price: number
  subtotal: number
  product?: { id: number; name: string; image_url: string | null }
}

interface Order {
  id: number
  status: string
  total: number
  created_at: string
  items: OrderItem[]
}

const order = ref<Order | null>(null)

const orderSteps = [
  { status: 'pending', icon: 'ti-clock', label: 'Placed' },
  { status: 'processing', icon: 'ti-settings', label: 'Processing' },
  { status: 'shipped', icon: 'ti-truck', label: 'Shipped' },
  { status: 'delivered', icon: 'ti-circle-check', label: 'Delivered' },
]

const statusOrder = ['pending', 'processing', 'shipped', 'delivered']

function isStepDone(orderStatus: string, stepStatus: string) {
  if (orderStatus === 'cancelled') return stepStatus === 'pending'
  return statusOrder.indexOf(orderStatus) >= statusOrder.indexOf(stepStatus)
}

function nextStepStatus(index: number) {
  return orderSteps[index + 1]?.status ?? ''
}

function statusStyle(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }
  return map[status] ?? 'bg-gray-50 text-gray-700 border-gray-200'
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function cancelOrder() {
  if (!confirm('Cancel this order?')) return
  cancelling.value = true
  try {
    await api.put(`/orders/${route.params.id}/cancel`)
    await loadOrder()
  } finally {
    cancelling.value = false
  }
}

async function loadOrder() {
  loading.value = true
  try {
    const { data } = await api.get<{ order: Order }>(`/orders/${route.params.id}`)
    order.value = data.order
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
}

onMounted(loadOrder)
</script>
