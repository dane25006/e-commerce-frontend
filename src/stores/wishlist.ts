import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'

interface WishlistItem {
  wishlist_id: number
  product: { id: number; name: string; price: number; image_url: string | null }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])

  function isWishlisted(productId: number): boolean {
    return items.value.some(w => w.product.id === productId)
  }

  async function fetchWishlist() {
    try {
      const { data } = await api.get<{ wishlist: WishlistItem[] }>('/wishlist')
      items.value = data.wishlist
    } catch {
      items.value = []
    }
  }

  async function toggle(productId: number) {
    await api.post('/wishlist/toggle', { product_id: productId })
    await fetchWishlist()
  }

  return { items, isWishlisted, fetchWishlist, toggle }
})