<template>
  <div class="cart-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="() => {}" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">{{ $t('cart.your') }}</span>
        <h1 class="hero-title">
          <i class="ti ti-shopping-bag" aria-hidden="true" />
          {{ $t('cart.shoppingCart') }}
        </h1>
        <p class="hero-count">
          {{ $t('cart.itemCount', { count: cartStore.itemCount }) }}
        </p>
      </div>
    </section>

    <div class="page-body">
      <div v-if="cartStore.loading" class="loading-grid">
        <div class="loading-col">
          <div v-for="n in 2" :key="n" class="skeleton-row">
            <div class="skeleton-img" />
            <div class="skeleton-text">
              <div class="skeleton-line w-1-2" />
              <div class="skeleton-line w-1-3" />
              <div class="skeleton-line w-1-4" />
            </div>
          </div>
        </div>
        <div class="skeleton-card" />
      </div>

      <div v-else-if="!cartStore.items.length" class="empty-state">
        <div class="empty-icon">
          <i class="ti ti-shopping-bag" aria-hidden="true" />
        </div>
        <h2 class="empty-title">{{ $t('cart.emptyTitle') }}</h2>
        <p class="empty-desc">{{ $t('cart.emptyDesc') }}</p>
        <RouterLink to="/products" class="btn-primary">
          <i class="ti ti-shopping-bag" aria-hidden="true" />
          {{ $t('cart.browseFragrances') }}
        </RouterLink>
      </div>

      <div v-else class="cart-layout">
        <div class="cart-items-col">
          <TransitionGroup name="list" tag="div" class="cart-list">
            <div
              v-for="item in cartStore.items"
              :key="item.cart_id"
              class="cart-item"
            >
              <div class="cart-item-inner">
                <RouterLink :to="`/products/${item.product.id}`" class="cart-item-img-wrap">
                  <div class="cart-item-img-box">
                    <img
                      v-if="item.product.image_url"
                      :src="imageUrl(item.product.image_url)"
                      :alt="item.product.name"
                      class="cart-item-img"
                    />
                    <div v-else class="cart-item-img-placeholder">
                      <i class="ti ti-bottle" aria-hidden="true" />
                    </div>
                  </div>
                </RouterLink>

                <div class="cart-item-details">
                  <div>
                    <span v-if="item.product.category" class="badge-gold">
                      {{ item.product.category.name }}
                    </span>
                    <RouterLink :to="`/products/${item.product.id}`">
                      <h3 class="cart-item-name">{{ item.product.name }}</h3>
                    </RouterLink>
                    <p class="cart-item-price">${{ item.product.price.toFixed(2) }} each</p>
                  </div>

                  <div class="cart-item-actions">
                    <div class="qty-control">
                      <button
                        @click="updateQty(item, item.quantity - 1)"
                        :disabled="updatingId === item.cart_id"
                        class="qty-btn"
                        :aria-label="$t('cart.decrease')"
                      >
                        <i class="ti ti-minus" aria-hidden="true" />
                      </button>
                      <span class="qty-value">{{ item.quantity }}</span>
                      <button
                        @click="updateQty(item, item.quantity + 1)"
                        :disabled="updatingId === item.cart_id || item.quantity >= item.product.stock"
                        class="qty-btn"
                        :aria-label="$t('cart.increase')"
                      >
                        <i class="ti ti-plus" aria-hidden="true" />
                      </button>
                    </div>

                    <div class="cart-item-total">
                      <span class="item-subtotal">${{ item.subtotal.toFixed(2) }}</span>
                      <button
                        @click="removeItem(item)"
                        :disabled="removingId === item.cart_id"
                        class="item-remove"
                        :aria-label="$t('cart.removeItem')"
                      >
                        <i class="ti ti-trash" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <div class="cart-footer-links">
            <RouterLink to="/products" class="continue-link">
              <i class="ti ti-arrow-left" aria-hidden="true" />
              {{ $t('cart.continueShopping') }}
            </RouterLink>
            <button @click="clearCart" class="clear-link">
              <i class="ti ti-trash" aria-hidden="true" />
              {{ $t('cart.clearCart') }}
            </button>
          </div>
        </div>

        <div class="cart-sidebar">
          <div class="coupon-card">
            <h3 class="sidebar-label">
              <i class="ti ti-discount" aria-hidden="true" />
              {{ $t('cart.promoCode') }}
            </h3>
            <div class="coupon-row">
              <input
                id="cart-coupon"
                name="coupon_code"
                v-model="couponCode"
                type="text"
                :placeholder="$t('cart.promoPlaceholder')"
                class="input-field"
                :disabled="!!cartStore.coupon"
              />
              <button
                v-if="!cartStore.coupon"
                class="btn-primary"
                @click="handleApplyCoupon"
              >
                {{ $t('cart.apply') }}
              </button>
              <button
                v-else
                class="btn-cancel"
                @click="handleRemoveCoupon"
              >
                {{ $t('cart.remove') }}
              </button>
            </div>
            <p
              v-if="cartStore.couponMsg"
              class="coupon-msg"
              :class="cartStore.couponErr ? 'coupon-err' : 'coupon-ok'"
            >
              {{ cartStore.couponMsg }}
            </p>
          </div>

          <div class="summary-card">
            <h3 class="sidebar-label">{{ $t('cart.orderSummary') }}</h3>

            <div class="summary-rows">
              <div class="summary-row">
                <span>{{ $t('cart.subtotal', { count: cartStore.itemCount }) }}</span>
                <span class="summary-val">${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="cartStore.discount > 0" class="summary-row discount-row">
                <span>{{ $t('cart.discount') }}</span>
                <span class="summary-val">-${{ cartStore.discount.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>{{ $t('cart.shipping') }}</span>
                <span class="summary-val" :class="cartStore.subtotal >= 100 ? 'free-badge' : ''">
                  {{ cartStore.subtotal >= 100 ? $t('cart.free') : '$9.99' }}
                </span>
              </div>
              <div v-if="cartStore.subtotal < 100" class="shipping-hint">
                <i class="ti ti-truck" aria-hidden="true" />
                {{ $t('cart.shippingHint', { amount: (100 - cartStore.subtotal).toFixed(2) }) }}
              </div>
              <div class="summary-row">
                <span>{{ $t('cart.tax') }}</span>
                <span class="summary-val">${{ (cartStore.subtotal * 0.08).toFixed(2) }}</span>
              </div>
              <div class="summary-divider" />
              <div class="summary-row summary-total-row">
                <span>{{ $t('cart.total') }}</span>
                <span class="total-amount">${{ orderTotal.toFixed(2) }}</span>
              </div>
            </div>

            <RouterLink to="/checkout" class="checkout-btn">
              <i class="ti ti-lock" aria-hidden="true" />
              {{ $t('cart.proceedToCheckout') }}
            </RouterLink>

            <div class="trust-badges">
              <div v-for="b in trustBadges" :key="b.key" class="trust-item">
                <i :class="`ti ${b.icon}`" aria-hidden="true" />
                <span>{{ $t(b.key) }}</span>
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
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { imageUrl } from '@/utils/image'
import type { CartItem } from '@/types/cart'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'

const { t } = useI18n()
const cartStore = useCartStore()
const searchOpen = ref(false)
const couponCode = ref('')
const updatingId = ref<number | null>(null)
const removingId = ref<number | null>(null)

const shipping = computed(() => cartStore.subtotal >= 100 ? 0 : 9.99)
const tax = computed(() => cartStore.subtotal * 0.08)
const orderTotal = computed(() => cartStore.total + shipping.value + tax.value)

function handleApplyCoupon() {
  if (!couponCode.value.trim()) return
  cartStore.applyCoupon(couponCode.value.trim())
}

function handleRemoveCoupon() {
  couponCode.value = ''
  cartStore.removeCoupon()
}

const trustBadges = [
  { icon: 'ti-shield-lock', key: 'cart.secure' },
  { icon: 'ti-refresh', key: 'cart.easyReturns' },
  { icon: 'ti-truck', key: 'cart.fastShip' },
]

async function updateQty(item: CartItem, qty: number) {
  if (qty < 1) return removeItem(item)
  if (qty > item.product.stock) return
  updatingId.value = item.cart_id
  await cartStore.updateQty(item.cart_id, qty)
  updatingId.value = null
}

async function removeItem(item: CartItem) {
  removingId.value = item.cart_id
  await cartStore.removeItem(item.cart_id)
  removingId.value = null
}

async function clearCart() {
  if (!confirm(t('cart.confirmClearTitle'))) return
  await cartStore.clearCart()
}

onMounted(() => cartStore.fetchCart())
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: var(--background);
}

.hero-section {
  background: linear-gradient(135deg, #2B241E, #1A1614);
  padding: 80px 24px;
  text-align: center;
  position: relative;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 16px;
  border-radius: 100px;
  background: rgba(184,138,68,0.12);
  color: var(--primary);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: var(--surface);
  margin: 0 0 12px;
  letter-spacing: 0.01em;
  line-height: 1.15;
}

.hero-count {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  margin: 0;
  font-weight: 400;
}

.page-body {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.loading-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.loading-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-row {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.skeleton-img {
  width: 96px;
  height: 96px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.w-1-2 { width: 50%; }
.w-1-3 { width: 33.33%; }
.w-1-4 { width: 25%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-card {
  height: 320px;
  border-radius: var(--radius);
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.empty-state {
  text-align: center;
  padding: 96px 0;
  animation: fadeIn 0.6s ease forwards;
}

.empty-icon {
  width: 112px;
  height: 112px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  background: rgba(184,138,68,0.08);
}

.empty-icon i {
  font-size: 56px;
  color: rgba(184,138,68,0.25);
}

.empty-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.cart-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: var(--shadow-sm);
}

.cart-item-inner {
  display: flex;
  gap: 16px;
  padding: 20px;
}

.cart-item-img-wrap {
  flex-shrink: 0;
}

.cart-item-img-box {
  width: 96px;
  height: 96px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--background);
  border: 1px solid var(--border);
}

.cart-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cart-item:hover .cart-item-img {
  transform: scale(1.05);
}

.cart-item-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-item-img-placeholder i {
  font-size: 28px;
  color: rgba(184,138,68,0.15);
}

.cart-item-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-name {
  font-size: 14px;
  font-weight: 700;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text);
  transition: color 0.2s;
}

.cart-item-name:hover {
  color: var(--primary);
}

.cart-item-price {
  font-size: 12px;
  font-weight: 600;
  margin-top: 2px;
  color: var(--primary);
}

.cart-item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  border-radius: 10px;
  background: var(--background);
  border: 1px solid var(--border);
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
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
  background: rgba(184,138,68,0.1);
  color: var(--primary);
}

.qty-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.qty-value {
  width: 32px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.cart-item-total {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-subtotal {
  font-size: 16px;
  font-weight: 900;
  color: var(--text);
}

.item-remove {
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  color: var(--border);
  border: none;
  background: none;
  cursor: pointer;
}

.item-remove:hover:not(:disabled) {
  background: rgba(184,138,68,0.08);
  color: var(--primary);
}

.item-remove:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cart-footer-links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
}

.continue-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.continue-link:hover {
  opacity: 0.8;
}

.clear-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  border: none;
  background: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.clear-link:hover {
  opacity: 0.7;
}

.cart-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coupon-card {
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.sidebar-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-label i {
  color: var(--primary);
}

.coupon-row {
  display: flex;
  gap: 8px;
}

.coupon-msg {
  font-size: 12px;
  margin-top: 8px;
}

.coupon-ok {
  color: var(--primary);
}

.coupon-err {
  color: #e74c3c;
}

.summary-card {
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  position: sticky;
  top: 96px;
}

.summary-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
}

.summary-val {
  font-weight: 600;
}

.discount-row {
  color: var(--primary);
}

.free-badge {
  color: var(--primary);
}

.shipping-hint {
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(184,138,68,0.08);
  color: var(--primary);
}

.summary-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.summary-total-row {
  font-weight: 900;
  font-size: 18px;
  color: var(--text);
}

.total-amount {
  color: var(--primary);
}

.checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 24px;
  margin-top: 20px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.checkout-btn:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.trust-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 500;
}

.trust-item i {
  color: var(--primary);
  font-size: 13px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-in {
  animation: fadeIn 0.6s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .loading-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 28px;
  }

  .page-body {
    padding: 24px 16px 48px;
  }

  .hero-section {
    padding: 32px 24px;
  }
}
</style>
