import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getGuestToken } from '@/utils/guest'
import { cartService } from '@/services/cartService'
import { promotionService } from '@/services/promotionService'
import type { CartItem, CartResponse } from '@/types/cart'
import type { Promotion } from '@/types/promotion'

export const useCartStore = defineStore('cart', () => {
  const items      = ref<CartItem[]>([])
  const loading    = ref(false)
  const coupon     = ref<Promotion | null>(null)
  const couponMsg  = ref('')
  const couponErr  = ref(false)

  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.subtotal, 0)
  )

  const discount = computed(() => {
    if (!coupon.value) return 0
    const p = coupon.value
    return p.discount_type === 'percentage'
      ? subtotal.value * (p.discount_value / 100)
      : p.discount_value
  })

  const total = computed(() => Math.max(0, subtotal.value - discount.value))

  const itemCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  function guestToken(): string | undefined {
    const auth = useAuthStore()
    return auth.isLoggedIn ? undefined : getGuestToken()
  }

  async function fetchCart() {
    loading.value = true
    try {
      const { data } = await cartService.get(guestToken())
      items.value = data.cart
    } catch (e) {
      console.error('[CartStore] fetchCart failed:', e)
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function addToCart(product_id: number, quantity = 1) {
    const { data } = await cartService.add(product_id, quantity, getGuestToken())
    if (data.item) {
      const idx = items.value.findIndex(i => i.cart_id === data.item.cart_id)
      if (idx !== -1) {
        items.value[idx] = data.item
      } else {
        items.value.push(data.item)
      }
    }
    fetchCart()
  }

  async function updateQty(cartId: number, quantity: number) {
    const item = items.value.find(i => i.cart_id === cartId)
    if (!item) return

    const prevQty = item.quantity
    const prevSubtotal = item.subtotal

    item.quantity = quantity
    item.subtotal = item.product.price * quantity

    try {
      const { data } = await cartService.update(cartId, quantity, getGuestToken())
      const idx = items.value.findIndex(i => i.cart_id === cartId)
      if (idx !== -1 && data.item) items.value[idx] = data.item
    } catch {
      const revert = items.value.find(i => i.cart_id === cartId)
      if (revert) {
        revert.quantity = prevQty
        revert.subtotal = prevSubtotal
      }
    }
  }

  async function removeItem(cartId: number) {
    const idx = items.value.findIndex(i => i.cart_id === cartId)
    if (idx === -1) return
    const removed = items.value.splice(idx, 1)[0]

    try {
      await cartService.remove(cartId, getGuestToken())
    } catch {
      if (removed !== undefined) items.value.splice(idx, 0, removed)
    }
  }

  async function clearCart() {
    const snapshot = items.value.slice()
    items.value = []
    try {
      await cartService.clear(getGuestToken())
    } catch {
      items.value = snapshot
    }
  }

  async function applyCoupon(code: string) {
    couponMsg.value = ''
    couponErr.value = false
    try {
      const { data } = await promotionService.validate(code)
      if (data.valid && data.promotion) {
        coupon.value = data.promotion
        couponMsg.value = data.message ?? 'Coupon applied!'
      }
    } catch {
      coupon.value = null
      couponMsg.value = 'Invalid or expired coupon code.'
      couponErr.value = true
    }
  }

  function removeCoupon() {
    coupon.value = null
    couponMsg.value = ''
    couponErr.value = false
  }

  return {
    items, total, subtotal, discount, loading, itemCount, coupon, couponMsg, couponErr,
    fetchCart, addToCart, updateQty, removeItem, clearCart, applyCoupon, removeCoupon,
  }
})
