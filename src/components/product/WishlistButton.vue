<template>
  <button
    @click.prevent="handleToggle"
    :disabled="toggling"
    class="wishlist-btn"
    :class="[
      sizeClasses,
      isWishlisted ? 'wishlisted' : '',
      animating ? 'heart-beat' : '',
    ]"
    :aria-label="isWishlisted ? $t('wishlist.removeFrom') : $t('wishlist.addTo')"
  >
    <i
      :class="[
        isWishlisted ? 'ti ti-heart-filled' : 'ti ti-heart',
        iconSizeClass
      ]"
      aria-hidden="true"
    />
    <span class="wishlist-glow"></span>
    <span v-if="animating && isWishlisted" class="sparkle s1" />
    <span v-if="animating && isWishlisted" class="sparkle s2" />
    <span v-if="animating && isWishlisted" class="sparkle s3" />
    <span v-if="animating && isWishlisted" class="sparkle s4" />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWishlistStore } from '@/stores/wishlist'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  productId: number
  size?: 'sm' | 'md' | 'lg'
}>(), { size: 'md' })

const wishlistStore = useWishlistStore()
const toggling = ref(false)
const animating = ref(false)
const { show: showToast } = useToast()

const isWishlisted = computed(() => wishlistStore.isWishlisted(props.productId))

const sizeClasses = computed(() => ({
  sm: 'size-sm',
  md: 'size-md',
  lg: 'size-lg',
}[props.size]))

const iconSizeClass = computed(() => ({
  sm: 'icon-sm',
  md: 'icon-md',
  lg: 'icon-lg',
}[props.size]))

async function handleToggle() {
  if (toggling.value) return
  toggling.value = true
  animating.value = true
  setTimeout(() => { animating.value = false }, 400)
  try {
    const wasWishlisted = isWishlisted.value
    await wishlistStore.toggle(props.productId)
    showToast(wasWishlisted ? t('wishlist.removedToast') : t('wishlist.savedToast'))
  } catch {
    showToast(t('wishlist.errorToast'), 'error')
  } finally {
    toggling.value = false
  }
}
</script>

<style scoped>
.wishlist-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--border, #E7E1D8);
  background: var(--surface, #FFFFFF);
  color: var(--text-muted, #6F6F6F);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: visible;
}

.wishlist-btn:hover {
  border-color: var(--primary, #B88A44);
  color: var(--primary, #B88A44);
  background: rgba(184, 138, 68, 0.06);
  transform: scale(1.05);
}

.wishlist-btn:active {
  transform: scale(0.95);
}

.wishlist-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.wishlist-btn.wishlisted {
  border-color: var(--primary, #B88A44);
  background: rgba(184, 138, 68, 0.1);
  color: var(--primary, #B88A44);
}

.wishlist-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.wishlist-btn.wishlisted .wishlist-glow {
  opacity: 1;
  background: radial-gradient(circle at center, rgba(184, 138, 68, 0.15), transparent 70%);
}

.size-sm {
  width: 32px;
  height: 32px;
}

.size-md {
  width: 40px;
  height: 40px;
}

.size-lg {
  width: 46px;
  height: 46px;
}

.icon-sm {
  font-size: 14px;
}

.icon-md {
  font-size: 17px;
}

.icon-lg {
  font-size: 20px;
}

.heart-beat {
  animation: heartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes heartPop {
  0% { transform: scale(1); }
  30% { transform: scale(1.35); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
}

.wishlisted i {
  animation: heartFill 0.4s ease;
}

@keyframes heartFill {
  0% { transform: scale(1); }
  40% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* ── Sparkle particles ── */
.sparkle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary, #B88A44);
  pointer-events: none;
  animation: sparkleBurst 0.5s ease-out forwards;
}

.s1 { top: -4px; left: 50%; margin-left: -3px; }
.s2 { right: -4px; top: 50%; margin-top: -3px; }
.s3 { bottom: -4px; left: 50%; margin-left: -3px; }
.s4 { left: -4px; top: 50%; margin-top: -3px; }

@keyframes sparkleBurst {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}
</style>
