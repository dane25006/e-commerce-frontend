<template>
  <Transition name="modal">
    <div
      v-if="product"
      class="modal-overlay"
      @click.self="$emit('close')"
    >
      <div class="modal-card">
        <div class="modal-layout">
          <!-- Image Section -->
          <div class="modal-image-section">
            <img
              v-if="product.image_url"
              :src="imageUrl(product.image_url)"
              :alt="product.name"
              class="modal-image"
            />
            <div v-else class="modal-image-placeholder">
              <i class="ti ti-bottle" aria-hidden="true" />
            </div>

            <div class="modal-badges">
              <span v-if="product.is_new" class="badge badge-new">{{ $t('quickView.new') }}</span>
              <span v-if="product.sale_price" class="badge badge-sale">{{ $t('quickView.sale') }}</span>
            </div>

            <button
              @click="$emit('close')"
              class="modal-close"
              :aria-label="$t('quickView.close')"
            >
              <i class="ti ti-x" aria-hidden="true" />
            </button>
          </div>

          <!-- Details Section -->
          <div class="modal-details">
            <div class="modal-details-inner">
              <div class="modal-meta">
                <span v-if="product.category" class="modal-category">{{ product.category.name }}</span>
                <span v-if="product.brand" class="modal-brand">{{ product.brand }}</span>
              </div>

              <h2 class="modal-title">{{ product.name }}</h2>

              <div v-if="product.type || product.gender" class="modal-tags">
                <span v-if="product.type">{{ product.type }}</span>
                <span v-if="product.type && product.gender" class="tag-divider">|</span>
                <span v-if="product.gender">{{ product.gender }}</span>
              </div>

              <div v-if="product.rating_avg" class="modal-rating">
                <div class="stars">
                  <i
                    v-for="n in 5"
                    :key="n"
                    class="ti ti-star-filled"
                    :class="n <= Math.round(product.rating_avg!) ? 'star-active' : 'star-inactive'"
                    aria-hidden="true"
                  />
                </div>
                <span class="rating-value">{{ product.rating_avg.toFixed(1) }}</span>
                <span class="rating-count">({{ product.rating_count }} reviews)</span>
              </div>

              <div class="modal-price">
                <span v-if="product.sale_price" class="price-sale">{{ formatPrice(product.sale_price) }}</span>
                <span :class="['price-original', product.sale_price ? 'price-strikethrough' : 'price-current']">
                  {{ formatPrice(product.price) }}
                </span>
              </div>

              <span class="modal-stock" :class="product.stock > 0 ? 'stock-available' : 'stock-out'">
                <i :class="product.stock > 0 ? 'ti ti-circle-check-filled' : 'ti ti-circle-x-filled'" aria-hidden="true" />
                {{ product.stock > 0 ? `${product.stock} ${$t('quickView.inStock')}` : $t('quickView.outOfStock') }}
              </span>

              <p class="modal-description">{{ product.description }}</p>

              <div class="modal-actions">
                <button
                  v-if="product.stock > 0"
                  @click="handleAddToCart"
                  :disabled="adding"
                  class="btn-add-cart"
                >
                  <i v-if="adding" class="ti ti-loader-2" aria-hidden="true" />
                  <i v-else class="ti ti-shopping-bag" aria-hidden="true" />
                  {{ adding ? $t('quickView.adding') : $t('quickView.addToCart') }}
                </button>

                <WishlistButton :product-id="product.id" size="lg" />

                <RouterLink
                  :to="`/products/${product.id}`"
                  @click="$emit('close')"
                  class="btn-details"
                >
                  {{ $t('quickView.details') }} <i class="ti ti-arrow-right" aria-hidden="true" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import { imageUrl } from '@/utils/image'
import { formatPrice } from '@/utils/price'
import type { Product } from '@/types/product'
import WishlistButton from './WishlistButton.vue'

const { t } = useI18n()

const props = defineProps<{ product: Product | null }>()
defineEmits<{ close: [] }>()

const cartStore = useCartStore()
const { show: showToast } = useToast()
const adding = ref(false)

async function handleAddToCart() {
  if (!props.product) return
  adding.value = true
  try {
    await cartStore.addToCart(props.product.id)
    showToast(t('quickView.addedToast'))
  } catch {
    showToast(t('quickView.errorToast'), 'error')
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(43, 43, 43, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.modal-card {
  background: var(--surface, #FFFFFF);
  border-radius: var(--radius, 18px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal-layout {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .modal-layout {
    flex-direction: row;
  }
}

/* ── Image Section ── */
.modal-image-section {
  position: relative;
  min-height: 320px;
  overflow: hidden;
  background: #F7F5F2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius, 18px) var(--radius, 18px) 0 0;
}

@media (min-width: 768px) {
  .modal-image-section {
    width: 42%;
    border-radius: var(--radius, 18px) 0 0 var(--radius, 18px);
    min-height: 420px;
  }
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.modal-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: rgba(184, 138, 68, 0.18);
  font-size: 100px;
  width: 100%;
  height: 100%;
}

.modal-badges {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.badge {
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  padding: 4px 12px;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.badge-new {
  background: var(--primary, #B88A44);
  box-shadow: 0 2px 8px rgba(184, 138, 68, 0.25);
}

.badge-sale {
  background: var(--secondary, #2B2B2B);
  box-shadow: 0 2px 8px rgba(43, 43, 43, 0.2);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  color: var(--text-muted, #6F6F6F);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.modal-close:hover {
  background: var(--surface, #FFFFFF);
  color: var(--text, #222222);
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* ── Details Section ── */
.modal-details {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .modal-details {
    width: 58%;
    padding: 36px 32px;
  }
}

.modal-details-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.modal-category {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary, #B88A44);
}

.modal-brand {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(184, 138, 68, 0.08);
  color: var(--primary-hover, #A7772F);
}

.modal-title {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text, #222222);
  margin-bottom: 6px;
}

@media (min-width: 768px) {
  .modal-title {
    font-size: 30px;
  }
}

.modal-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted, #6F6F6F);
  margin-bottom: 14px;
}

.tag-divider {
  color: var(--border, #E7E1D8);
}

/* ── Rating ── */
.modal-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star-active {
  color: var(--primary, #B88A44);
  font-size: 15px;
}

.star-inactive {
  color: #E7E1D8;
  font-size: 15px;
}

.rating-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--text, #222222);
}

.rating-count {
  font-size: 13px;
  color: var(--text-muted, #6F6F6F);
}

/* ── Price ── */
.modal-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}

.price-sale {
  font-size: 30px;
  font-weight: 900;
  color: var(--primary, #B88A44);
  letter-spacing: -0.01em;
}

.price-strikethrough {
  font-size: 18px;
  text-decoration: line-through;
  color: var(--text-muted, #6F6F6F);
  font-weight: 500;
}

.price-current {
  font-size: 30px;
  font-weight: 900;
  color: var(--text, #222222);
}

/* ── Stock ── */
.modal-stock {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 999px;
  width: fit-content;
  margin-bottom: 16px;
}

.stock-available {
  color: var(--primary, #B88A44);
  background: rgba(184, 138, 68, 0.08);
}

.stock-out {
  color: var(--text-muted, #6F6F6F);
  background: rgba(111, 111, 111, 0.08);
}

/* ── Description ── */
.modal-description {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-muted, #6F6F6F);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 24px;
}

/* ── Actions ── */
.modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: auto;
}

.btn-add-cart {
  flex: 1;
  min-width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  border: none;
  border-radius: var(--radius-sm, 10px);
  background: var(--primary, #B88A44);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.btn-add-cart::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%);
  pointer-events: none;
}

.btn-add-cart:hover:not(:disabled) {
  background: var(--primary-hover, #A7772F);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184, 138, 68, 0.3);
}

.btn-add-cart:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(184, 138, 68, 0.2);
}

.btn-add-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-details {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary, #B88A44);
  text-decoration: none;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.btn-details:hover {
  color: var(--primary-hover, #A7772F);
  gap: 10px;
}

/* ── Transition ── */
.modal-enter-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-card {
  transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
}

.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-leave-active .modal-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-card {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-card {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
