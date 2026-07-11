import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationService } from '@/services/notificationService'
import type { Notification, NotificationFilters } from '@/types/notification'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const recentNotifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 20,
  })

  const hasUnread = computed(() => unreadCount.value > 0)

  async function fetchNotifications(filters: NotificationFilters = {}) {
    loading.value = true
    try {
      const { data } = await notificationService.getAll(filters)
      notifications.value = data.data
      pagination.value = {
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        per_page: data.per_page,
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchRecent() {
    try {
      const { data } = await notificationService.getRecent(5)
      recentNotifications.value = data.notifications
    } catch {
      // silent
    }
  }

  async function fetchUnreadCount() {
    try {
      const { data } = await notificationService.getUnreadCount()
      unreadCount.value = data.unread_count
    } catch {
      // silent
    }
  }

  async function markAsRead(id: number) {
    await notificationService.markAsRead(id)
    const idx = notifications.value.findIndex((n) => n.id === id)
    if (idx !== -1) {
      notifications.value[idx].is_read = true
      notifications.value[idx].read_at = new Date().toISOString()
    }
    const recentIdx = recentNotifications.value.findIndex((n) => n.id === id)
    if (recentIdx !== -1) {
      recentNotifications.value[recentIdx].is_read = true
    }
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  async function markAllAsRead() {
    await notificationService.markAllAsRead()
    notifications.value.forEach((n) => {
      n.is_read = true
      n.read_at = new Date().toISOString()
    })
    recentNotifications.value.forEach((n) => {
      n.is_read = true
    })
    unreadCount.value = 0
  }

  async function archive(id: number) {
    await notificationService.archive(id)
    const removed = notifications.value.find((n) => n.id === id)
    if (removed && !removed.is_read) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
    notifications.value = notifications.value.filter((n) => n.id !== id)
    recentNotifications.value = recentNotifications.value.filter((n) => n.id !== id)
  }

  async function deleteNotification(id: number) {
    await notificationService.delete(id)
    const removed = notifications.value.find((n) => n.id === id)
    if (removed && !removed.is_read) {
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
    notifications.value = notifications.value.filter((n) => n.id !== id)
    recentNotifications.value = recentNotifications.value.filter((n) => n.id !== id)
  }

  let pollingInterval: ReturnType<typeof setInterval> | null = null

  function startPolling(intervalMs = 30000) {
    stopPolling()
    fetchUnreadCount()
    pollingInterval = setInterval(() => {
      fetchUnreadCount()
      fetchRecent()
    }, intervalMs)
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  function reset() {
    notifications.value = []
    recentNotifications.value = []
    unreadCount.value = 0
    stopPolling()
  }

  return {
    notifications,
    recentNotifications,
    unreadCount,
    loading,
    pagination,
    hasUnread,
    fetchNotifications,
    fetchRecent,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    archive,
    delete: deleteNotification,
    startPolling,
    stopPolling,
    reset,
  }
})
