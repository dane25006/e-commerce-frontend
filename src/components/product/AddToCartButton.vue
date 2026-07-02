<template>
  <div class="add-to-cart-wrapper">
    <span v-if="product.stock === 0" class="out-of-stock">
      <i class="ti ti-circle-x" aria-hidden="true" />
      {{ $t('addToCart.outOfStock') }}
    </span>

    <button
      v-else
      @click="handleAdd"
      :disabled="adding"
      class="btn-cart"
      :class="[
        size === 'lg' ? 'btn-lg' : 'btn-sm',
        iconOnly ? 'btn-icon' : '',
        added ? 'btn-added' : ''
      ]"
      :aria-label="adding ? $t('addToCart.adding') : label"
    >
      <i
        v-if="adding"
        class="ti ti-loader-2 btn-spinner"
        aria-hidden="true"
      />
      <i
        v-else-if="added"
        class="ti ti-circle-check-filled btn-check"
        aria-hidden="true"
      />
      <template v-else>
        <i class="ti ti-plus" aria-hidden="true" />
      </template>
      <span v-if="!iconOnly && !added" class="btn-label">{{ adding ? $t('addToCart.adding') : label }}</span>
      <span v-if="!iconOnly && added" class="btn-label added-label">{{ $t('addToCart.addedLabel') }}</span>

      <span v-if="added" class="success-ring" />
      <span v-if="added" class="success-ring ring-delay" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
import type { Product, RelatedProduct } from '@/types/product'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  product: Product | RelatedProduct
  size?: 'sm' | 'lg'
  label?: string
  addedLabel?: string
  iconOnly?: boolean
}>(), { size: 'sm', label: 'Add', addedLabel: 'Added to cart!' })

const cartStore = useCartStore()
const { show: showToast } = useToast()
const adding = ref(false)
const added = ref(false)

async function handleAdd() {
  adding.value = true
  added.value = false
  try {
    await cartStore.addToCart(props.product.id)
    added.value = true
    showToast(t('addToCart.addedToast'))
    setTimeout(() => { added.value = false }, 2500)
  } catch {
    showToast(t('addToCart.errorToast'), 'error')
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.add-to-cart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.out-of-stock {
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted, #6F6F6F);
  letter-spacing: 0.02em;
  padding: 2px 0;
}

.btn-cart {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: var(--radius-sm, 10px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: var(--primary, #B88A44);
  color: #fff;
  overflow: visible;
}

.btn-cart::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-sm, 10px);
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
  pointer-events: none;
}

.btn-cart:hover:not(:disabled) {
  background: var(--primary-hover, #A7772F);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(184, 138, 68, 0.3);
}

.btn-cart:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(184, 138, 68, 0.2);
}

.btn-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-sm {
  font-size: 12px;
  padding: 8px 16px;
}

.btn-lg {
  font-size: 14px;
  padding: 14px 28px;
  width: 100%;
  letter-spacing: 0.03em;
}

.btn-icon {
  padding: 8px 10px !important;
}

.btn-spinner {
  font-size: 14px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-check {
  font-size: 16px;
  animation: checkPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes checkPop {
  0% { transform: scale(0) rotate(-30deg); opacity: 0; }
  50% { transform: scale(1.3) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.btn-label {
  transition: all 0.3s ease;
}

.added-label {
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.btn-added {
  background: var(--primary, #B88A44) !important;
  pointer-events: none;
}

/* ── Success ring burst ── */
.success-ring {
  position: absolute;
  inset: -4px;
  border-radius: var(--radius-sm, 10px);
  border: 2px solid var(--primary, #B88A44);
  pointer-events: none;
  animation: ringBurst 0.6s ease-out forwards;
}

.ring-delay {
  animation-delay: 0.1s;
}

@keyframes ringBurst {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.25);
    opacity: 0;
  }
}
</style>
