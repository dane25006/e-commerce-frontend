<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="overlay"
      @click="$emit('update:modelValue', false)"
    />
  </Transition>

  <Transition name="drawer">
    <div
      v-if="modelValue"
      class="drawer"
    >
      <div class="drawer-header">
        <div class="drawer-header-left">
          <div class="drawer-icon-box">
            <i class="ti ti-shopping-bag" aria-hidden="true" />
          </div>
          <div>
            <h2 class="drawer-title">Your Cart</h2>
            <p class="drawer-count">{{ cartStore.itemCount }} item{{ cartStore.itemCount !== 1 ? 's' : '' }}</p>
          </div>
        </div>
        <button
          @click="$emit('update:modelValue', false)"
          class="drawer-close"
          aria-label="Close cart"
        >
          <i class="ti ti-x" aria-hidden="true" />
        </button>
      </div>

      <div class="drawer-body">
        <div v-if="cartStore.loading" class="loading-items">
          <div v-for="n in 3" :key="n" class="skeleton-item">
            <div class="skeleton-img" />
            <div class="skeleton-text">
              <div class="skeleton-line w-3-4" />
              <div class="skeleton-line w-1-2" />
              <div class="skeleton-line w-1-3" />
            </div>
          </div>
        </div>

        <div v-else-if="!cartStore.items.length" class="empty-cart">
          <div class="empty-icon">
            <i class="ti ti-shopping-bag" aria-hidden="true" />
          </div>
          <h3 class="empty-title">Your cart is empty</h3>
          <p class="empty-desc">Discover our luxury fragrances</p>
          <RouterLink
            to="/products"
            @click="$emit('update:modelValue', false)"
            class="btn-primary"
          >
            Shop Now
          </RouterLink>
        </div>

        <div v-else>
          <TransitionGroup name="cart-item" tag="div" class="items-list">
            <div
              v-for="item in cartStore.items"
              :key="item.cart_id"
              class="drawer-item"
            >
              <RouterLink
                :to="`/products/${item.product.id}`"
                @click="$emit('update:modelValue', false)"
                class="drawer-item-img-wrap"
              >
                <div class="drawer-item-img-box">
                  <img
                    v-if="item.product.image_url"
                    :src="imageUrl(item.product.image_url)"
                    :alt="item.product.name"
                    class="drawer-item-img"
                  />
                  <div v-else class="drawer-item-img-ph">
                    <i class="ti ti-photo" aria-hidden="true" />
                  </div>
                </div>
              </RouterLink>

              <div class="drawer-item-details">
                <RouterLink
                  :to="`/products/${item.product.id}`"
                  @click="$emit('update:modelValue', false)"
                >
                  <h4 class="drawer-item-name">{{ item.product.name }}</h4>
                </RouterLink>
                <p class="drawer-item-price">${{ item.product.price.toFixed(2) }} each</p>

                <div class="drawer-item-actions">
                  <div class="drawer-qty">
                    <button
                      @click="updateQty(item, item.quantity - 1)"
                      :disabled="updatingId === item.cart_id"
                      class="qty-btn"
                      aria-label="Decrease quantity"
                    >
                      <i class="ti ti-minus" aria-hidden="true" />
                    </button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button
                      @click="updateQty(item, item.quantity + 1)"
                      :disabled="updatingId === item.cart_id || item.quantity >= item.product.stock"
                      class="qty-btn"
                      aria-label="Increase quantity"
                    >
                      <i class="ti ti-plus" aria-hidden="true" />
                    </button>
                  </div>

                  <div class="drawer-item-total">
                    <span class="drawer-subtotal">${{ item.subtotal.toFixed(2) }}</span>
                    <button
                      @click="removeItem(item)"
                      :disabled="removingId === item.cart_id"
                      class="remove-btn"
                      aria-label="Remove item"
                    >
                      <i class="ti ti-trash" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <div v-if="cartStore.items.length" class="drawer-footer">
        <div class="coupon-row">
          <input
            id="drawer-coupon"
            name="coupon_code"
            v-model="couponCode"
            type="text"
            placeholder="Coupon code"
            class="input-field"
            :disabled="!!cartStore.coupon"
          />
          <button
            v-if="!cartStore.coupon"
            class="btn-secondary"
            @click="handleApplyCoupon"
          >
            Apply
          </button>
          <button
            v-else
            class="btn-cancel"
            @click="handleRemoveCoupon"
          >
            Remove
          </button>
        </div>
        <p
          v-if="cartStore.couponMsg"
          class="coupon-msg"
          :class="cartStore.couponErr ? 'coupon-err' : 'coupon-ok'"
        >
          {{ cartStore.couponMsg }}
        </p>

        <div class="drawer-totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>${{ cartStore.subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="cartStore.discount > 0" class="totals-row discount">
            <span>Discount</span>
            <span class="discount-val">-${{ cartStore.discount.toFixed(2) }}</span>
          </div>
          <div class="totals-row">
            <span>Shipping</span>
            <span class="free-badge">{{ cartStore.subtotal >= 100 ? 'Free' : '$9.99' }}</span>
          </div>
          <div class="totals-divider" />
          <div class="totals-row total-final">
            <span>Total</span>
            <span class="total-amount">${{ (cartStore.total >= 100 ? cartStore.total : cartStore.total + 9.99).toFixed(2) }}</span>
          </div>
        </div>

        <RouterLink
          v-if="auth.isLoggedIn"
          to="/checkout"
          @click="$emit('update:modelValue', false)"
          class="checkout-link"
        >
          <i class="ti ti-lock" aria-hidden="true" />
          Secure Checkout
        </RouterLink>
        <RouterLink
          v-else
          to="/login?redirect=/checkout"
          @click="$emit('update:modelValue', false)"
          class="checkout-link signin-link"
        >
          <i class="ti ti-lock" aria-hidden="true" />
          Sign in to Checkout
        </RouterLink>

        <button
          @click="$emit('update:modelValue', false)"
          class="continue-link"
        >
          Continue Shopping &rarr;
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
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(58,50,42,0.45);
  backdrop-filter: blur(6px);
}

.drawer {
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  z-index: 50;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 40px rgba(58,50,42,0.12);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.drawer-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawer-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(184,138,68,0.1);
}

.drawer-icon-box i {
  font-size: 18px;
  color: var(--primary);
}

.drawer-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.drawer-count {
  font-size: 12px;
  color: var(--text-muted);
}

.drawer-close {
  padding: 8px;
  border-radius: 10px;
  transition: all 0.2s;
  color: var(--text-muted);
  border: none;
  background: none;
  cursor: pointer;
}

.drawer-close:hover {
  background: rgba(184,138,68,0.08);
  color: var(--text);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.loading-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-item {
  display: flex;
  gap: 12px;
}

.skeleton-img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  flex-shrink: 0;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.w-3-4 { width: 75%; }
.w-1-2 { width: 50%; }
.w-1-3 { width: 33.33%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 0;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background: rgba(184,138,68,0.08);
}

.empty-icon i {
  font-size: 36px;
  color: rgba(184,138,68,0.25);
}

.empty-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.empty-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.drawer-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--background);
  border: 1px solid var(--border);
  transition: box-shadow 0.2s;
}

.drawer-item:hover {
  box-shadow: var(--shadow-sm);
}

.drawer-item-img-wrap {
  flex-shrink: 0;
}

.drawer-item-img-box {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
}

.drawer-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer-item-img-ph {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drawer-item-img-ph i {
  font-size: 24px;
  color: rgba(184,138,68,0.15);
}

.drawer-item-details {
  flex: 1;
  min-width: 0;
}

.drawer-item-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.drawer-item-name:hover {
  color: var(--primary);
}

.drawer-item-price {
  font-size: 12px;
  font-weight: 500;
  margin-top: 2px;
  color: var(--primary);
}

.drawer-item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.drawer-qty {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1px 3px;
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
}

.qty-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: var(--text-muted);
  border: none;
  background: none;
  cursor: pointer;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(184,138,68,0.08);
  color: var(--primary);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  font-size: 13px;
  font-weight: 700;
  width: 20px;
  text-align: center;
  color: var(--text);
}

.drawer-item-total {
  display: flex;
  align-items: center;
  gap: 4px;
}

.drawer-subtotal {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.remove-btn {
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  color: var(--border);
  border: none;
  background: none;
  cursor: pointer;
}

.remove-btn:hover:not(:disabled) {
  background: rgba(184,138,68,0.08);
  color: var(--primary);
}

.remove-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.coupon-row {
  display: flex;
  gap: 8px;
}

.coupon-msg {
  font-size: 11px;
  margin-top: -4px;
}

.coupon-ok {
  color: var(--primary);
}

.coupon-err {
  color: #e74c3c;
}

.drawer-totals {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
}

.totals-row.discount {
  color: var(--primary);
}

.discount-val {
  font-weight: 600;
}

.free-badge {
  font-weight: 600;
  color: var(--primary);
}

.totals-divider {
  height: 1px;
  background: var(--border);
  margin: 2px 0;
}

.total-final {
  font-weight: 700;
  font-size: 15px;
  color: var(--text);
}

.total-amount {
  color: var(--primary);
}

.checkout-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.checkout-link:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.signin-link {
  background: var(--text);
}

.continue-link {
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: var(--primary);
  border: none;
  background: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.continue-link:hover {
  opacity: 0.8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.cart-item-enter-active {
  transition: all 0.3s ease;
}

.cart-item-leave-active {
  transition: all 0.2s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
