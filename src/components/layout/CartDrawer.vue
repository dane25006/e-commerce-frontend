<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      @click="$emit('update:modelValue', false)"
    />
  </Transition>

  <!-- Drawer -->
  <Transition name="drawer">
    <div
      v-if="modelValue"
      class="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl shadow-purple-200/30"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-purple-100">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
            <i class="ti ti-shopping-bag text-purple-600 text-lg" aria-hidden="true" />
          </div>
          <div>
            <h2 class="font-bold text-gray-900 text-base">Your Cart</h2>
            <p class="text-xs text-gray-400">{{ cartStore.itemCount }} item{{ cartStore.itemCount !== 1 ? 's' : '' }}</p>
          </div>
        </div>
        <button
          @click="$emit('update:modelValue', false)"
          class="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          aria-label="Close cart"
        >
          <i class="ti ti-x text-lg" aria-hidden="true" />
        </button>
      </div>

      <!-- Items -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <!-- Loading -->
        <div v-if="cartStore.loading" class="space-y-4">
          <div v-for="n in 3" :key="n" class="flex gap-3 animate-pulse">
            <div class="w-20 h-20 rounded-xl skeleton flex-shrink-0" />
            <div class="flex-1 space-y-2 pt-1">
              <div class="h-3 skeleton w-3/4" />
              <div class="h-3 skeleton w-1/2" />
              <div class="h-3 skeleton w-1/3" />
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="!cartStore.items.length" class="flex flex-col items-center justify-center py-16 text-center">
          <div class="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
            <i class="ti ti-shopping-bag text-4xl text-purple-300" aria-hidden="true" />
          </div>
          <h3 class="font-semibold text-gray-900 mb-1">Your cart is empty</h3>
          <p class="text-sm text-gray-400 mb-6">Discover our luxury fragrances</p>
          <RouterLink
            to="/products"
            @click="$emit('update:modelValue', false)"
            class="btn-primary"
          >
            Shop Now
          </RouterLink>
        </div>

        <!-- Cart Items -->
        <div v-else>
          <TransitionGroup name="cart-item" tag="div" class="space-y-4">
            <div
              v-for="item in cartStore.items"
              :key="item.cart_id"
              class="flex gap-3 p-3 rounded-2xl bg-purple-50/40 border border-purple-100/60 hover:border-purple-200 transition"
            >
              <!-- Image -->
              <RouterLink
                :to="`/products/${item.product.id}`"
                @click="$emit('update:modelValue', false)"
                class="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white border border-purple-100"
              >
                <img
                  v-if="item.product.image_url"
                  :src="imageUrl(item.product.image_url)"
                  :alt="item.product.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="ti ti-photo text-2xl text-purple-200" aria-hidden="true" />
                </div>
              </RouterLink>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <RouterLink
                  :to="`/products/${item.product.id}`"
                  @click="$emit('update:modelValue', false)"
                >
                  <h4 class="text-sm font-semibold text-gray-900 line-clamp-1 hover:text-purple-600 transition">
                    {{ item.product.name }}
                  </h4>
                </RouterLink>
                <p class="text-xs text-purple-500 mt-0.5 font-medium">
                  ${{ item.product.price.toFixed(2) }} each
                </p>

                <div class="flex items-center justify-between mt-2">
                  <!-- Qty Controls -->
                  <div class="flex items-center gap-1.5 bg-white rounded-xl border border-purple-100 px-1 py-0.5">
                    <button
                      @click="updateQty(item, item.quantity - 1)"
                      :disabled="updatingId === item.cart_id"
                      class="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <i class="ti ti-minus text-xs" aria-hidden="true" />
                    </button>
                    <span class="text-sm font-bold text-gray-800 w-5 text-center">
                      {{ item.quantity }}
                    </span>
                    <button
                      @click="updateQty(item, item.quantity + 1)"
                      :disabled="updatingId === item.cart_id || item.quantity >= item.product.stock"
                      class="w-6 h-6 rounded-lg flex items-center justify-center text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <i class="ti ti-plus text-xs" aria-hidden="true" />
                    </button>
                  </div>

                  <!-- Subtotal + Remove -->
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-gray-900">${{ item.subtotal.toFixed(2) }}</span>
                    <button
                      @click="removeItem(item)"
                      :disabled="removingId === item.cart_id"
                      class="p-1 text-gray-300 hover:text-red-400 transition"
                      aria-label="Remove item"
                    >
                      <i class="ti ti-trash text-sm" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Footer Summary -->
      <div v-if="cartStore.items.length" class="border-t border-purple-100 px-6 py-5 space-y-4">
        <!-- Coupon -->
        <div class="flex gap-2">
          <input
            v-model="couponCode"
            type="text"
            placeholder="Coupon code"
            class="flex-1 px-3.5 py-2 text-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/30"
            :disabled="!!cartStore.coupon"
          />
          <button
            v-if="!cartStore.coupon"
            class="btn-outline text-sm px-4 py-2"
            @click="handleApplyCoupon"
          >
            Apply
          </button>
          <button
            v-else
            class="text-sm px-4 py-2 text-red-500 hover:text-red-700 font-medium"
            @click="handleRemoveCoupon"
          >
            Remove
          </button>
        </div>
        <p
          v-if="cartStore.couponMsg"
          class="text-xs mt-1"
          :class="cartStore.couponErr ? 'text-red-500' : 'text-green-600'"
        >
          {{ cartStore.couponMsg }}
        </p>

        <!-- Summary -->
        <div class="space-y-1.5 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.discount > 0" class="flex justify-between text-green-600">
            <span>Discount</span>
            <span class="font-semibold">-${{ cartStore.discount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span class="text-green-600 font-medium">{{ cartStore.subtotal >= 100 ? 'Free' : '$9.99' }}</span>
          </div>
          <div class="flex justify-between font-bold text-gray-900 text-base border-t border-purple-100 pt-2 mt-2">
            <span>Total</span>
            <span class="text-purple-600">${{ (cartStore.total >= 100 ? cartStore.total : cartStore.total + 9.99).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Checkout Button -->
        <RouterLink
          v-if="auth.isLoggedIn"
          to="/checkout"
          @click="$emit('update:modelValue', false)"
          class="w-full btn-primary text-center block text-sm py-3"
        >
          <i class="ti ti-lock mr-2" aria-hidden="true" />
          Secure Checkout
        </RouterLink>
        <RouterLink
          v-else
          to="/login?redirect=/checkout"
          @click="$emit('update:modelValue', false)"
          class="w-full flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-xl px-4 py-3 transition"
        >
          <i class="ti ti-lock" aria-hidden="true" />
          Sign in to Checkout
        </RouterLink>

        <button
          @click="$emit('update:modelValue', false)"
          class="w-full text-sm text-purple-600 hover:text-purple-700 font-medium text-center py-1"
        >
          Continue Shopping →
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { imageUrl } from '@/utils/image'
import type { CartItem } from '@/types/cart'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [val: boolean] }>()

const auth = useAuthStore()
const cartStore = useCartStore()
const couponCode = ref('')
const updatingId = ref<number | null>(null)
const removingId = ref<number | null>(null)

function handleApplyCoupon() {
  if (!couponCode.value.trim()) return
  cartStore.applyCoupon(couponCode.value.trim())
}

function handleRemoveCoupon() {
  couponCode.value = ''
  cartStore.removeCoupon()
}

async function updateQty(item: CartItem, newQty: number) {
  if (newQty < 1) return removeItem(item)
  if (newQty > item.product.stock) return
  updatingId.value = item.cart_id
  try {
    await cartStore.updateQty(item.cart_id, newQty)
  } finally {
    updatingId.value = null
  }
}

async function removeItem(item: CartItem) {
  removingId.value = item.cart_id
  try {
    await cartStore.removeItem(item.cart_id)
  } finally {
    removingId.value = null
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.drawer-enter-active, .drawer-leave-active { transition: transform 0.3s ease; }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }

.cart-item-enter-active { transition: all 0.3s ease; }
.cart-item-leave-active { transition: all 0.2s ease; }
.cart-item-enter-from { opacity: 0; transform: translateX(20px); }
.cart-item-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
