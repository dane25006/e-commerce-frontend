import api from '@/plugins/axios'
import type { CartItem, CartResponse } from '@/types/cart'

export const cartService = {
  get(guestToken?: string) {
    const params: Record<string, string> = {}
    if (guestToken) params.guest_token = guestToken
    return api.get<CartResponse>('/cart', { params })
  },

  add(productId: number, quantity: number, guestToken: string) {
    return api.post<{ message: string; item: CartItem }>('/cart', {
      product_id: productId,
      quantity,
      guest_token: guestToken,
    })
  },

  update(cartId: number, quantity: number, guestToken: string) {
    return api.put<{ message: string; item: CartItem }>(`/cart/${cartId}`, {
      quantity,
      guest_token: guestToken,
    })
  },

  remove(cartId: number, guestToken: string) {
    return api.delete(`/cart/${cartId}`, {
      data: { guest_token: guestToken },
    })
  },

  clear(guestToken: string) {
    return api.delete('/cart', {
      data: { guest_token: guestToken },
    })
  },

  merge(guestToken: string) {
    return api.post('/cart/merge', { guest_token: guestToken })
  },
}
