<template>
  <div class="min-h-screen" style="background: #f8f7f4">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-xl font-bold" style="color: var(--secondary)">
            {{ $t('notifications.title') }}
          </h1>
          <p class="text-sm mt-1" style="color: #999999">
            {{ $t('notifications.total', { count: pagination.total }) }}
          </p>
        </div>
        <button
          v-if="unreadItems.length > 0"
          @click="handleMarkAllRead"
          class="text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-lg transition-colors"
          style="color: var(--primary); border: 1px solid var(--primary)"
        >
          {{ $t('notifications.markAllRead') }}
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="handleTabClick(tab.key)"
          class="px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 tracking-wide"
          :class="activeTab === tab.key ? 'text-white shadow-sm' : 'hover:bg-white/50'"
          :style="
            activeTab === tab.key
              ? { background: 'var(--primary)' }
              : {
                  color: 'var(--secondary)',
                  border: '1px solid var(--border)',
                  background: 'white',
                }
          "
        >
          {{ tab.label }}
          <span
            v-if="tab.key === 'unread' && store.unreadCount > 0"
            class="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/20"
          >
            {{ store.unreadCount }}
          </span>
        </button>

        <!-- Type filter -->
        <select
          v-model="typeFilter"
          @change="handleTypeChange()"
          class="px-4 py-2 text-xs font-medium rounded-lg border transition-colors"
          style="color: var(--secondary); border-color: var(--border); background: white"
        >
          <option value="">{{ $t('notifications.allTypes') }}</option>
          <option v-for="t in notificationTypes" :key="t" :value="t">
            {{ ucfirst(t) }}
          </option>
        </select>

        <!-- Search -->
        <div class="relative flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            :placeholder="$t('notifications.search')"
            class="w-full px-4 py-2 text-xs rounded-lg border transition-colors"
            style="color: var(--secondary); border-color: var(--border); background: white"
          />
          <i
            class="ti ti-search absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style="color: #999999"
          />
        </div>
      </div>

      <!-- Notifications List -->
      <div class="space-y-2">
        <div v-if="loading" class="flex justify-center py-12">
          <div
            class="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
            style="border-color: var(--primary); border-top-color: transparent"
          />
        </div>

        <template v-else-if="items.length === 0">
          <div
            class="flex flex-col items-center justify-center py-16 bg-white rounded-xl border"
            style="border-color: var(--border)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12 mb-4"
              style="color: #d1d5db"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <p class="text-sm font-medium" style="color: #9ca3af">
              {{ $t('notifications.empty') }}
            </p>
          </div>
        </template>

        <div
          v-for="item in items"
          :key="item.id"
          class="group bg-white rounded-xl border transition-all duration-200 hover:shadow-sm"
          :class="[item.is_read ? '' : 'border-l-4']"
          :style="{
            borderColor: item.is_read ? 'var(--border)' : getTypeColor(item.type),
            borderLeftColor: item.is_read ? 'var(--border)' : getTypeColor(item.type),
          }"
        >
          <div class="flex items-start gap-4 p-4 sm:p-5">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-base"
              :style="{ background: getTypeColor(item.type) }"
            >
              <i :class="getTypeIcon(item.type)" />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3
                    class="text-sm font-semibold"
                    :class="item.is_read ? 'text-slate-600' : 'text-slate-900'"
                  >
                    {{ item.title }}
                  </h3>
                  <span
                    class="text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
                    :style="{
                      background: getTypeColor(item.type) + '15',
                      color: getTypeColor(item.type),
                    }"
                  >
                    {{ ucfirst(item.type) }}
                  </span>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span
                    v-if="item.priority === 'high'"
                    class="px-1.5 py-0.5 text-[9px] font-bold rounded uppercase"
                    style="background: #fef2f2; color: #dc2626"
                  >
                    High
                  </span>
                  <span class="text-[11px] whitespace-nowrap" style="color: #9ca3af">
                    {{ timeAgo(item.sent_at) }}
                  </span>
                </div>
              </div>

              <p v-if="item.message" class="text-xs mt-2 leading-relaxed" style="color: #64748b">
                {{ item.message }}
              </p>

              <div
                v-if="item.coupon_code"
                class="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold"
                style="background: #fef3c7; color: #92400e; border: 1px dashed #f59e0b"
              >
                <i class="ti ti-ticket" />
                {{ item.coupon_code }}
              </div>

              <div v-if="item.image" class="mt-3">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="max-h-32 rounded-lg object-cover border"
                  style="border-color: var(--border)"
                />
              </div>

              <div class="flex items-center gap-3 mt-3">
                <button
                  v-if="!item.is_read"
                  @click="handleRead(item)"
                  class="text-[10px] font-semibold tracking-wide uppercase transition-colors"
                  style="color: var(--primary)"
                >
                  {{ $t('notifications.markRead') }}
                </button>
                <button
                  @click="handleArchive(item)"
                  class="text-[10px] font-medium transition-colors"
                  style="color: #9ca3af"
                >
                  {{ $t('notifications.archive') }}
                </button>
                <button
                  @click="handleDelete(item)"
                  class="text-[10px] font-medium transition-colors"
                  style="color: #ef4444"
                >
                  {{ $t('notifications.delete') }}
                </button>

                <div class="flex-1" />

                <button
                  v-if="item.button_text && item.button_url"
                  @click="handleButtonClick(item)"
                  class="text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors text-white"
                  :style="{ background: 'var(--primary)' }"
                >
                  {{ item.button_text }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
          :disabled="pagination.current_page <= 1"
          @click="handlePrevPage()"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-30"
          style="border: 1px solid var(--border); color: var(--secondary)"
        >
          <i class="ti ti-chevron-left" />
        </button>

        <span class="text-xs" style="color: #64748b">
          {{ pagination.current_page }} / {{ pagination.last_page }}
        </span>

        <button
          :disabled="pagination.current_page >= pagination.last_page"
          @click="handleNextPage()"
          class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors disabled:opacity-30"
          style="border: 1px solid var(--border); color: var(--secondary)"
        >
          <i class="ti ti-chevron-right" />
        </button>
      </div>
      <SearchModal v-model="searchOpen" />
      <CartDrawer v-model="cartOpen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import { notificationTypeIcons, notificationTypeColors } from '@/types/notification'
import type { Notification, NotificationType } from '@/types/notification'
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

const store = useNotificationStore()
const router = useRouter()

const activeTab = ref<'all' | 'unread' | 'read'>('all')
const typeFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const searchOpen = ref(false)
const cartOpen = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const notificationTypes: string[] = [
  'promotion',
  'coupon',
  'order',
  'payment',
  'wishlist',
  'back_in_stock',
  'new_arrival',
  'announcement',
  'custom',
]

const tabs = [
  { key: 'all' as const, label: 'All' },
  { key: 'unread' as const, label: 'Unread' },
  { key: 'read' as const, label: 'Read' },
]

const items = computed(() => store.notifications)
const loading = computed(() => store.loading)
const pagination = computed(() => store.pagination)
const unreadItems = computed(() => store.notifications.filter((n) => !n.is_read))

function getTypeIcon(type: string): string {
  return notificationTypeIcons[type as NotificationType] || 'ti ti-bell'
}

function getTypeColor(type: string): string {
  return notificationTypeColors[type as NotificationType] || '#64748B'
}

function ucfirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  if (diff < 0) return 'Just now'
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function loadNotifications() {
  const filters: Record<string, string | number | boolean> = {
    page: currentPage.value,
    per_page: 20,
  }
  if (activeTab.value !== 'all') {
    filters.status = activeTab.value
  }
  if (typeFilter.value) {
    filters.type = typeFilter.value
  }
  if (searchQuery.value) {
    filters.search = searchQuery.value
  }
  store.fetchNotifications(filters as any)
}

function debouncedSearch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadNotifications()
  }, 400)
}

async function handleRead(item: Notification) {
  await store.markAsRead(item.id)
}

async function handleMarkAllRead() {
  await store.markAllAsRead()
}

async function handleArchive(item: Notification) {
  await store.archive(item.id)
}

async function handleDelete(item: Notification) {
  await store.delete(item.id)
}

function handleTabClick(key: string) {
  activeTab.value = key as 'all' | 'unread' | 'read'
  currentPage.value = 1
  loadNotifications()
}

function handleTypeChange() {
  currentPage.value = 1
  loadNotifications()
}

function handlePrevPage() {
  if (pagination.value.current_page > 1) {
    currentPage.value = pagination.value.current_page - 1
    loadNotifications()
  }
}

function handleNextPage() {
  if (pagination.value.current_page < pagination.value.last_page) {
    currentPage.value = pagination.value.current_page + 1
    loadNotifications()
  }
}

function handleButtonClick(item: Notification) {
  if (item.button_url) {
    router.push(item.button_url)
  }
}

onMounted(() => {
  loadNotifications()
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>
