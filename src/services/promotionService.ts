import api from '@/plugins/axios'
import type { Promotion, PromotionValidateResponse } from '@/types/promotion'

export const promotionService = {
  getAll: () =>
    api.get<{ promotions: Promotion[] }>('/promotions'),

  getOne: (id: number) =>
    api.get<{ promotion: Promotion }>(`/promotions/${id}`),

  validate: (couponCode: string) =>
    api.post<PromotionValidateResponse>('/promotions/validate', { coupon_code: couponCode }),
}
