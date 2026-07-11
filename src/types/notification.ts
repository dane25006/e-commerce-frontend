export interface Notification {
  id: number
  title: string
  message: string | null
  type: NotificationType
  image: string | null
  banner: string | null
  coupon_code: string | null
  button_text: string | null
  button_url: string | null
  priority: 'low' | 'medium' | 'high'
  is_read: boolean
  read_at: string | null
  archived: boolean
  sent_at: string
  created_at: string
}

export type NotificationType =
  | 'promotion'
  | 'coupon'
  | 'order'
  | 'payment'
  | 'wishlist'
  | 'back_in_stock'
  | 'new_arrival'
  | 'announcement'
  | 'custom'

export interface NotificationFilters {
  status?: 'unread' | 'read' | 'all'
  type?: NotificationType | ''
  search?: string
  archived?: boolean
  page?: number
  per_page?: number
}

export const notificationTypeIcons: Record<NotificationType, string> = {
  promotion: 'ti ti-discount-2',
  coupon: 'ti ti-ticket',
  order: 'ti ti-package',
  payment: 'ti ti-credit-card',
  wishlist: 'ti ti-heart',
  back_in_stock: 'ti ti-refresh',
  new_arrival: 'ti ti-sparkles',
  announcement: 'ti ti-bullhorn',
  custom: 'ti ti-bell',
}

export const notificationTypeColors: Record<NotificationType, string> = {
  promotion: '#B88A44',
  coupon: '#7C3AED',
  order: '#2563EB',
  payment: '#059669',
  wishlist: '#DB2777',
  back_in_stock: '#D97706',
  new_arrival: '#7C3AED',
  announcement: '#4338CA',
  custom: '#64748B',
}
