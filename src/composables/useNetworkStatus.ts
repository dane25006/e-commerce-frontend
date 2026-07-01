import { ref, onMounted, onUnmounted } from 'vue'

export function useNetworkStatus() {
  const isOnline = ref(navigator.onLine)
  const justConnected = ref(false)
  let wasOffline = false
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  function showOnline() {
    justConnected.value = true
    if (hideTimer) clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      justConnected.value = false
    }, 3000)
  }

  function onOnline() {
    isOnline.value = true
    if (wasOffline) {
      showOnline()
    }
    wasOffline = false
  }

  function onOffline() {
    isOnline.value = false
    wasOffline = true
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    justConnected.value = false
  }

  onMounted(() => {
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
    if (hideTimer) clearTimeout(hideTimer)
  })

  return { isOnline, justConnected }
}
