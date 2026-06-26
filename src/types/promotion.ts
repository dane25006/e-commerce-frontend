export interface Promotion {
  id: number
  title: string
  slug: string
  description: string | null
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  coupon_code: string | null
  image_url: string | null
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  product: { id: number; name: string; price: number } | null
  created_at: string
}

export interface PromotionValidateResponse {
  valid: boolean
  promotion?: Promotion
  message?: string
}
