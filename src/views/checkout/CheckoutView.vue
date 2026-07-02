<template>
  <div class="checkout-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="() => {}" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">{{ $t('checkout.secure') }}</span>
        <h1 class="hero-title">
          <i class="ti ti-lock" aria-hidden="true" />
          {{ $t('checkout.checkout') }}
        </h1>
      </div>
    </section>

    <div class="page-body">
      <div v-if="!cartStore.items.length && !orderSuccess" class="empty-state">
        <i class="ti ti-shopping-bag empty-icon" aria-hidden="true" />
        <h2 class="empty-title">{{ $t('checkout.emptyTitle') }}</h2>
        <p class="empty-desc" style="margin-bottom:16px;font-size:14px;color:var(--text-muted);">{{ $t('checkout.emptyDesc') }}</p>
        <RouterLink to="/products" class="btn-primary">{{ $t('checkout.browseFragrances') }}</RouterLink>
      </div>

      <Transition name="fade">
        <div v-if="orderSuccess" class="success-state">
          <div class="success-icon">
            <i class="ti ti-circle-check" aria-hidden="true" />
          </div>
          <h2 class="success-title">{{ $t('checkout.thankYou') }}</h2>
          <p class="success-desc">{{ $t('checkout.successDesc') }}</p>
          <p v-if="placedOrderId" class="success-order-id">Order #{{ placedOrderId }}</p>
          <div class="success-actions">
            <RouterLink to="/orders" class="btn-primary">{{ $t('checkout.viewOrders') }}</RouterLink>
            <RouterLink to="/products" class="btn-secondary">{{ $t('checkout.continueShopping') }}</RouterLink>
          </div>
        </div>
      </Transition>

      <div v-if="cartStore.items.length && !orderSuccess" class="checkout-layout">
        <div class="checkout-form-col">
          <div class="form-section">
            <h2 class="form-section-title">
              <i class="ti ti-truck" aria-hidden="true" />
              {{ $t('checkout.shippingInfo') }}
            </h2>
            <div class="form-grid">
              <div class="form-group half">
                <label class="form-label">{{ $t('checkout.firstName') }}</label>
                <input id="checkout-first-name" name="first_name" v-model="form.first_name" type="text" required class="input-field" />
              </div>
              <div class="form-group half">
                <label class="form-label">{{ $t('checkout.lastName') }}</label>
                <input id="checkout-last-name" name="last_name" v-model="form.last_name" type="text" required class="input-field" />
              </div>
              <div class="form-group full">
                <label class="form-label">{{ $t('checkout.email') }}</label>
                <div class="input-icon-wrap">
                  <i class="ti ti-mail input-icon" aria-hidden="true" />
                  <input id="checkout-email" name="email" v-model="form.email" type="email" required class="input-field has-icon" />
                </div>
              </div>
              <div class="form-group full">
                <label class="form-label">{{ $t('checkout.streetAddress') }}</label>
                <div class="input-icon-wrap">
                  <i class="ti ti-map-pin input-icon" aria-hidden="true" />
                  <input id="checkout-address" name="address" v-model="form.address" type="text" required :placeholder="$t('checkout.streetPlaceholder')" class="input-field has-icon" />
                </div>
              </div>
              <div class="form-group half">
                <label class="form-label">{{ $t('checkout.city') }}</label>
                <input id="checkout-city" name="city" v-model="form.city" type="text" required class="input-field" />
              </div>
              <div class="form-group half">
                <label class="form-label">{{ $t('checkout.zipCode') }}</label>
                <input id="checkout-zip" name="zip" v-model="form.zip" type="text" required class="input-field" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2 class="form-section-title">
              <i class="ti ti-credit-card" aria-hidden="true" />
              {{ $t('checkout.paymentMethod') }}
            </h2>
            <div class="payment-methods">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="payment-option"
                :class="{ active: form.payment_method === method.value }"
              >
                <input :id="'pm-' + method.value" name="payment_method" v-model="form.payment_method" type="radio" :value="method.value" class="payment-radio" />
                <i :class="`ti ${method.icon}`" :style="{ color: method.color }" aria-hidden="true" />
                <span class="payment-label">{{ $t(method.labelKey) }}</span>
              </label>
            </div>
          </div>

          <div v-if="checkoutError" class="error-banner">
            <i class="ti ti-alert-circle" aria-hidden="true" />
            {{ checkoutError }}
          </div>
        </div>

        <div class="checkout-summary-col">
          <div class="summary-card">
            <h3 class="summary-title">{{ $t('checkout.orderSummary') }}</h3>

            <div class="summary-items">
              <div v-for="item in cartStore.items" :key="item.cart_id" class="summary-item">
                <div class="summary-item-img">
                  <img v-if="item.product.image_url" :src="imageUrl(item.product.image_url)" :alt="item.product.name" class="summary-img" />
                  <div v-else class="summary-img-placeholder">
                    <i class="ti ti-photo" aria-hidden="true" />
                  </div>
                </div>
                <div class="summary-item-info">
                  <p class="summary-item-name">{{ item.product.name }}</p>
                  <p class="summary-item-qty">Qty: {{ item.quantity }}</p>
                </div>
                <p class="summary-item-price">${{ item.subtotal.toFixed(2) }}</p>
              </div>
            </div>

            <div class="summary-totals">
              <div class="totals-row">
                <span>{{ $t('checkout.subtotal') }}</span>
                <span>${{ cartStore.total.toFixed(2) }}</span>
              </div>
              <div class="totals-row">
                <span>{{ $t('checkout.shipping') }}</span>
                <span class="free-badge">{{ cartStore.total >= 100 ? $t('checkout.free') : '$9.99' }}</span>
              </div>
              <div class="totals-divider" />
              <div class="totals-row total-row-final">
                <span>{{ $t('checkout.total') }}</span>
                <span class="total-amount">${{ (cartStore.total + (cartStore.total >= 100 ? 0 : 9.99)).toFixed(2) }}</span>
              </div>
            </div>

            <button
              @click="placeOrder"
              :disabled="placing"
              class="place-order-btn"
            >
              <i v-if="placing" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
              <i v-else class="ti ti-lock" aria-hidden="true" />
              {{ placing ? $t('checkout.placingOrder') : $t('checkout.placeOrder') }}
            </button>

            <div class="ssl-badge">
              <i class="ti ti-shield-lock" aria-hidden="true" />
              {{ $t('checkout.sslBadge') }}
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
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { imageUrl } from '@/utils/image'
import { orderService } from '@/services/orderService'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'

const { t } = useI18n()
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
  { value: 'cash_on_delivery', labelKey: 'checkout.cod', icon: 'ti-cash', color: '#B88A44' },
  { value: 'credit_card', labelKey: 'checkout.creditCard', icon: 'ti-credit-card', color: '#B88A44' },
  { value: 'paypal', labelKey: 'checkout.paypal', icon: 'ti-brand-paypal', color: '#B88A44' },
]

async function placeOrder() {
  if (!form.address || !form.city || !form.zip) {
    checkoutError.value = t('checkout.validationShipping')
    return
  }

  await cartStore.fetchCart()
  if (!cartStore.items.length) {
    checkoutError.value = t('checkout.validationEmptyCart')
    return
  }

  placing.value = true
  checkoutError.value = ''
  try {
    const { data } = await orderService.checkout({
      shipping_address: `${form.first_name} ${form.last_name}, ${form.address}, ${form.city} ${form.zip}`,
      payment_method: form.payment_method,
    })
    placedOrderId.value = data.order.id
    await cartStore.clearCart()
    orderSuccess.value = true
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string; errors?: string[] | Record<string, string[]> } } }
    const res = e.response?.data
    if (res?.message) {
      checkoutError.value = res.message
      if (res.errors) {
        if (Array.isArray(res.errors)) {
          checkoutError.value += ' ' + res.errors.join(' ')
        } else if (typeof res.errors === 'object') {
          const msgs = Object.values(res.errors).flat().join(' ')
          if (msgs) checkoutError.value += ' ' + msgs
        }
      }
    } else {
      checkoutError.value = t('checkout.errorPlacingOrder')
    }
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
.checkout-page {
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

.page-body {
  max-width: 1024px;
  margin: 0 auto;
  padding: 40px 24px 64px;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-state i {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
  color: rgba(184,138,68,0.2);
}

.empty-title {
  font-size: 18px;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 16px;
}

.success-state {
  text-align: center;
  padding: 80px 0;
}

.success-icon {
  width: 96px;
  height: 96px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  background: rgba(184,138,68,0.08);
}

.success-icon i {
  font-size: 48px;
  color: var(--primary);
}

.success-title {
  font-size: 24px;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 8px;
}

.success-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.success-order-id {
  font-weight: 700;
  font-size: 16px;
  color: var(--primary);
  margin-bottom: 32px;
}

.success-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 32px;
}

.form-section {
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 20px;
}

.form-section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-section-title i {
  color: var(--primary);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.input-icon-wrap {
  position: relative;
}

.input-icon-wrap .has-icon {
  padding-left: 40px;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--primary);
  pointer-events: none;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option.active {
  border-color: var(--primary);
  background: rgba(184,138,68,0.04);
}

.payment-radio {
  accent-color: var(--primary);
}

.payment-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(184,138,68,0.08);
  color: var(--primary);
  margin-top: 20px;
}

.summary-card {
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  position: sticky;
  top: 96px;
}

.summary-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 192px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  gap: 12px;
}

.summary-item-img {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--background);
  border: 1px solid var(--border);
}

.summary-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-img-placeholder i {
  color: rgba(184,138,68,0.15);
}

.summary-item-info {
  flex: 1;
  min-width: 0;
}

.summary-item-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-item-qty {
  font-size: 12px;
  color: var(--text-muted);
}

.summary-item-price {
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  flex-shrink: 0;
}

.summary-totals {
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.totals-row {
  display: flex;
  justify-content: space-between;
  color: var(--text-muted);
}

.free-badge {
  font-weight: 600;
  color: var(--primary);
}

.totals-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.total-row-final {
  font-weight: 900;
  font-size: 16px;
  color: var(--text);
}

.total-amount {
  color: var(--primary);
}

.place-order-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 24px;
  margin-top: 20px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
}

.place-order-btn:hover:not(:disabled) {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.place-order-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ssl-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--text-muted);
}

.ssl-badge i {
  color: var(--primary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.half {
    grid-column: 1 / -1;
  }

  .hero-title {
    font-size: 24px;
  }
}
</style>
