import api from '@/plugins/axios'

export const orderService = {
  checkout(payload: { shipping_address: string; payment_method: string }) {
    return api.post<{ message: string; order: { id: number } }>('/checkout', payload)
  },

  list() {
    return api.get('/orders')
  },

  getOne(id: number) {
    return api.get(`/orders/${id}`)
  },

  cancel(id: number) {
    return api.put(`/orders/${id}/cancel`)
  },
}
