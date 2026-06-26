<template>
  <div class="min-h-screen bg-[#F8F5FF]">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <!-- Header -->
    <div class="bg-gradient-to-br from-purple-600 to-violet-700 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <span class="text-purple-200 text-xs font-bold uppercase tracking-widest block mb-1">Your</span>
        <h1 class="text-3xl font-black text-white">Orders</h1>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Loading -->
      <div v-if="loading" class="space-y-4">
        <div v-for="n in 4" :key="n" class="card-luxury p-6 animate-pulse">
          <div class="flex justify-between mb-4">
            <div class="space-y-2">
              <div class="h-4 skeleton w-32" />
              <div class="h-3 skeleton w-24" />
            </div>
            <div class="h-6 skeleton w-20 rounded-full" />
          </div>
          <div class="h-16 skeleton rounded-xl" />
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!orders.length" class="text-center py-24">
        <div class="w-24 h-24 rounded-3xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
          <i class="ti ti-package text-5xl text-purple-300" aria-hidden="true" />
        </div>
        <h2 class="text-xl font-black text-gray-900 mb-2">No orders yet</h2>
        <p class="text-gray-400 text-sm mb-8">Your order history will appear here.</p>
        <RouterLink to="/products" class="btn-primary py-3 px-8 text-sm">Start Shopping</RouterLink>
      </div>

      <!-- Orders list -->
      <div v-else class="space-y-5">
        <div
          v-for="order in orders"
          :key="order.id"
          class="card-luxury overflow-hidden"
        >
          <!-- Order Header -->
          <div class="flex flex-wrap items-start justify-between gap-3 p-5 border-b border-purple-100">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-black text-gray-900">Order #{{ order.id }}</span>
                <span
                  class="text-xs font-bold px-2.5 py-1 rounded-full border"
                  :class="statusStyle(order.status)"
                >
                  {{ capitalize(order.status) }}
                </span>
              </div>
              <p class="text-xs text-gray-400">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-black text-gray-900">${{ order.total.toFixed(2) }}</p>
              <p class="text-xs text-gray-400">{{ order.items_count ?? '—' }} item{{ (order.items_count ?? 0) !== 1 ? 's' : '' }}</p>
            </div>
          </div>

          <!-- Order Items preview -->
          <div class="p-5">
            <!-- Timeline -->
            <div class="flex items-center gap-0 mb-5 overflow-x-auto scrollbar-hide pb-1">
              <div
                v-for="(step, i) in orderSteps"
                :key="step.status"
                class="flex items-center"
              >
                <div class="flex flex-col items-center flex-shrink-0">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition"
                    :class="isStepDone(order.status, step.status)
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-white border-gray-200 text-gray-300'"
                  >
                    <i :class="`ti ${step.icon} text-xs`" aria-hidden="true" />
                  </div>
                  <span class="text-[9px] mt-1 font-semibold whitespace-nowrap"
                    :class="isStepDone(order.status, step.status) ? 'text-purple-600' : 'text-gray-400'">
                    {{ step.label }}
                  </span>
                </div>
                <div
                  v-if="i < orderSteps.length - 1"
                  class="w-10 sm:w-14 h-0.5 flex-shrink-0 mx-1 rounded-full"
                  :class="isStepDone(order.status, nextStepStatus(i)) ? 'bg-purple-400' : 'bg-gray-200'"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <RouterLink
                :to="`/orders/${order.id}`"
                class="text-sm font-semibold text-purple-600 hover:text-purple-800 transition flex items-center gap-1"
              >
                View Details <i class="ti ti-arrow-right" aria-hidden="true" />
              </RouterLink>

              <button
                v-if="order.status === 'pending'"
                @click="cancelOrder(order.id)"
                :disabled="cancellingId === order.id"
                class="text-xs text-red-400 hover:text-red-600 font-semibold flex items-center gap-1 transition disabled:opacity-50"
              >
                <i :class="cancellingId === order.id ? 'ti ti-loader-2 animate-spin' : 'ti ti-x'" aria-hidden="true" />
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

interface Order {
  id: number
  status: string
  total: number
  items_count: number
  created_at: string
}

const orders = ref<Order[]>([])
const loading = ref(false)
const searchOpen = ref(false)
const cartOpen = ref(false)
const cancellingId = ref<number | null>(null)

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

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function cancelOrder(id: number) {
  if (!confirm('Cancel this order?')) return
  cancellingId.value = id
  try {
    await api.put(`/orders/${id}/cancel`)
    await loadOrders()
  } finally {
    cancellingId.value = null
  }
}

async function loadOrders() {
  loading.value = true
  try {
    const { data } = await api.get<{ orders: Order[] }>('/orders')
    orders.value = data.orders
  } catch {
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadOrders)
</script>
