import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getGuestToken } from '@/utils/guest'
import { wishlistService } from '@/services/wishlistService'

export interface WishlistItem {
  wishlist_id: number
  status: string
  product: {
    id: number
    name: string
    slug: string
    description: string
    price: number
    sale_price: number | null
    stock: number
    is_new: boolean
    image_url: string | null
    category: { id: number; name: string; slug: string } | null
    created_at: string
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<WishlistItem[]>([])

  const itemIds = computed(() => new Set(items.value.map(w => w.product.id)))

  function guestToken(): string | undefined {
    const auth = useAuthStore()
    return auth.isLoggedIn ? undefined : getGuestToken()
  }

  function isWishlisted(productId: number): boolean {
    return itemIds.value.has(productId)
  }

  async function fetchWishlist() {
    try {
      const { data } = await wishlistService.get(guestToken())
      items.value = data.wishlist
    } catch {
      items.value = []
    }
  }

  async function toggle(productId: number) {
    await wishlistService.toggle(productId, getGuestToken())
    await fetchWishlist()
  }

  return { items, itemIds, isWishlisted, fetchWishlist, toggle }
})
