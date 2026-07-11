import api from '@/plugins/axios'
import type { Notification, NotificationFilters } from '@/types/notification'

export const notificationService = {
  getAll(filters: NotificationFilters = {}) {
    const params: Record<string, string | number | boolean> = {}
    if (filters.status && filters.status !== 'all') params.status = filters.status
    if (filters.type) params.type = filters.type
    if (filters.search) params.search = filters.search
    if (filters.archived !== undefined) params.archived = filters.archived
    if (filters.page) params.page = filters.page
    if (filters.per_page) params.per_page = filters.per_page
    return api.get<{
      data: Notification[]
      current_page: number
      last_page: number
      total: number
      per_page: number
    }>('/notifications', { params })
  },

  getRecent(limit = 5) {
    return api.get<{ success: boolean; notifications: Notification[] }>('/notifications/recent', {
      params: { limit },
    })
  },

  getUnreadCount() {
    return api.get<{ success: boolean; unread_count: number }>('/notifications/unread-count')
  },

  markAsRead(id: number) {
    return api.put(`/notifications/${id}/read`)
  },

  markAllAsRead() {
    return api.put('/notifications/read-all')
  },

  archive(id: number) {
    return api.put(`/notifications/${id}/archive`)
  },

  delete(id: number) {
    return api.delete(`/notifications/${id}`)
  },
}
