import api from '@/plugins/axios'
import type { WishlistItem } from '@/stores/wishlist'

export const wishlistService = {
  get(guestToken?: string) {
    const params: Record<string, string> = {}
    if (guestToken) params.guest_token = guestToken
    return api.get<{ wishlist: WishlistItem[]; count: number }>('/wishlist', { params })
  },

  toggle(productId: number, guestToken: string) {
    return api.post('/wishlist/toggle', {
      product_id: productId,
      guest_token: guestToken,
    })
  },

  merge(guestToken: string) {
    return api.post('/wishlist/merge', { guest_token: guestToken })
  },
}
