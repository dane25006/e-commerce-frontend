<template>
  <div class="relative" ref="bellRef">
    <button
      @click="toggleDropdown"
      class="relative p-2.5 rounded-lg transition-all duration-300 icon-btn"
      :class="{ 'bell-ring': store.hasUnread }"
      style="color: var(--secondary);"
      :aria-label="$t('notifications.title')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="text-lg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      <span
        v-if="store.unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center px-1 text-[8px] font-bold rounded-full text-white animate-scale-in"
        style="background: var(--primary);"
      >
        {{ store.unreadCount > 9 ? '9+' : store.unreadCount }}
      </span>
    </button>

    <Teleport to="body">
      <Transition name="dropdown">
        <div
          v-if="dropdownOpen"
          class="fixed inset-0 z-[100]"
          @click="closeDropdown"
        >
          <div
            class="absolute top-16 right-4 sm:right-8 mt-0 w-[360px] max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-2xl z-[101] overflow-hidden"
            style="border: 1px solid var(--border); max-height: 480px;"
            @click.stop
          >
            <div class="flex items-center justify-between px-4 py-3 border-b" style="border-color: var(--border);">
              <h3 class="text-sm font-bold" style="color: var(--secondary);">{{ $t('notifications.title') }}</h3>
              <button
                v-if="store.unreadCount > 0"
                @click="handleMarkAllRead"
                class="text-[10px] font-semibold tracking-wide uppercase transition-colors"
                style="color: var(--primary);"
              >
                {{ $t('notifications.markAllRead') }}
              </button>
            </div>

            <div class="overflow-y-auto" style="max-height: 380px;">
              <div v-if="store.recentNotifications.length === 0" class="flex flex-col items-center justify-center py-10 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-10 h-10 mb-3"
                  style="color: #d1d5db;"
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
                <p class="text-sm font-medium" style="color: #9ca3af;">{{ $t('notifications.empty') }}</p>
              </div>

              <div v-for="item in store.recentNotifications" :key="item.id">
                <div
                  class="flex items-start gap-3 px-4 py-3.5 transition-all duration-200 cursor-pointer hover:bg-slate-50"
                  :class="{ 'bg-amber-50/40': !item.is_read }"
                  @click="handleClick(item)"
                >
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm"
                    :style="{ background: getTypeColor(item.type) }"
                  >
                    <i :class="getTypeIcon(item.type)" class="text-sm" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <p
                        class="text-xs font-semibold truncate"
                        :class="item.is_read ? 'text-slate-600' : 'text-slate-900'"
                      >
                        {{ item.title }}
                      </p>
                      <div class="flex items-center gap-1 flex-shrink-0">
                        <span v-if="!item.is_read" class="w-2 h-2 rounded-full" style="background: var(--primary);" />
                      </div>
                    </div>
                    <p
                      v-if="item.message"
                      class="text-[11px] mt-0.5 line-clamp-2"
                      :class="item.is_read ? 'text-slate-400' : 'text-slate-500'"
                    >
                      {{ item.message }}
                    </p>
                    <p class="text-[10px] mt-1" style="color: #9ca3af;">{{ timeAgo(item.sent_at) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <RouterLink
              to="/notifications"
              @click="closeDropdown"
              class="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold transition-colors border-t"
              style="color: var(--primary); border-color: var(--border); background: #fafafa;"
            >
              {{ $t('notifications.viewAll') }}
              <i class="ti ti-chevron-right text-[10px]" />
            </RouterLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import { notificationTypeIcons, notificationTypeColors } from '@/types/notification'
import type { Notification, NotificationType } from '@/types/notification'

const store = useNotificationStore()
const router = useRouter()

const dropdownOpen = ref(false)
const bellRef = ref<HTMLElement | null>(null)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    store.fetchRecent()
  }
}

function closeDropdown() {
  dropdownOpen.value = false
}

function getTypeIcon(type: string): string {
  return notificationTypeIcons[type as NotificationType] || 'ti ti-bell'
}

function getTypeColor(type: string): string {
  return notificationTypeColors[type as NotificationType] || '#64748B'
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

async function handleClick(item: Notification) {
  if (!item.is_read) {
    await store.markAsRead(item.id)
  }
  if (item.button_url) {
    router.push(item.button_url)
  }
  closeDropdown()
}

async function handleMarkAllRead() {
  await store.markAllAsRead()
}

function handleClickOutside(e: MouseEvent) {
  if (bellRef.value && !bellRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.icon-btn:hover {
  color: var(--primary) !important;
}

.animate-scale-in {
  animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.bell-ring svg {
  animation: ring 0.3s ease;
}

@keyframes ring {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-8deg); }
  75% { transform: rotate(8deg); }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
</style>
