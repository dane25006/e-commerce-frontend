import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'
import type { CartItem, CartResponse } from '@/types/cart'

export const useCartStore = defineStore('cart', () => {
  const items   = ref<CartItem[]>([])
  const total   = ref(0)
  const loading = ref(false)

  const itemCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  async function fetchCart() {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) {
      items.value = []
      total.value = 0
      return
    }

    loading.value = true
    try {
      const { data } = await api.get<CartResponse>('/cart')
      items.value = data.cart
      total.value = data.total
    } catch {
      items.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  async function addToCart(product_id: number, quantity = 1) {
    await api.post('/cart', { product_id, quantity })
    await fetchCart()
  }

  async function clearCart() {
    await api.delete('/cart')
    items.value = []
    total.value = 0
  }

  return { items, total, loading, itemCount, fetchCart, addToCart, clearCart }
})