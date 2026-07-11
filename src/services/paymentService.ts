import api from '@/plugins/axios'
import type { PaymentGenerateResponse, PaymentConfirmResponse, PaymentStatusResponse } from '@/types/payment'

export const paymentService = {
  generate(orderId: number) {
    return api.post<PaymentGenerateResponse>(`/orders/${orderId}/payment/generate`)
  },

  confirm(orderId: number) {
    return api.post<{ payment: PaymentConfirmResponse['payment']; order_status: string }>(`/orders/${orderId}/payment/confirm`)
  },

  status(orderId: number) {
    return api.get<PaymentStatusResponse>(`/orders/${orderId}/payment/status`)
  },
}
