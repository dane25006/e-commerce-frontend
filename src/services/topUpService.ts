import api from '@/plugins/axios'
import type { Payment } from '@/types/payment'

interface TopUpGenerateResponse {
  payment: Payment
}

interface TopUpStatusResponse {
  payment: Payment | null
}

export const topUpService = {
  generate(amount: number, currency?: string, description?: string) {
    return api.post<TopUpGenerateResponse>('/top-up/generate', { amount, currency, description })
  },

  regenerate(paymentId: number, amount: number, currency?: string, description?: string) {
    return api.post<TopUpGenerateResponse>('/top-up/regenerate', { payment_id: paymentId, amount, currency, description })
  },

  status(paymentId: number) {
    return api.get<TopUpStatusResponse>(`/top-up/${paymentId}/status`)
  },
}
