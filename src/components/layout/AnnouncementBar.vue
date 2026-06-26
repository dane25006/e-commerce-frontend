<template>
  <div
    v-if="visible"
    class="relative bg-gradient-to-r from-purple-600 via-purple-500 to-violet-600 text-white overflow-hidden"
  >
    <!-- Animated background shimmer -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style="background-size: 200% 100%" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-10 sm:h-9">

        <!-- Left: rotating messages -->
        <div class="flex-1 flex items-center justify-center sm:justify-start min-w-0">
          <div class="relative h-5 w-full overflow-hidden">
            <Transition name="message-slide" mode="out-in">
              <div
                :key="currentIndex"
                class="absolute inset-0 flex items-center justify-center sm:justify-start text-xs font-medium"
              >
                <span class="flex items-center gap-1.5 truncate">
                  <i :class="currentMessage?.icon" class="flex-shrink-0 text-purple-200" aria-hidden="true" />
                  <span class="truncate">{{ currentMessage?.text }}</span>
                </span>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Right links (hidden on small screens) -->
        <div class="hidden md:flex items-center gap-4 text-xs font-medium flex-shrink-0">
          <RouterLink to="/orders" class="flex items-center gap-1 hover:text-purple-200 transition">
            <i class="ti ti-map-pin text-xs" aria-hidden="true" />
            Track Order
          </RouterLink>
          <span class="text-purple-400">|</span>
          <a href="#" class="flex items-center gap-1 hover:text-purple-200 transition">
            <i class="ti ti-headset text-xs" aria-hidden="true" />
            Help Center
          </a>
        </div>

        <!-- Close button -->
        <button
          @click="dismiss"
          class="ml-3 p-1 text-purple-200 hover:text-white hover:bg-white/10 rounded-lg transition flex-shrink-0"
          aria-label="Close announcement"
        >
          <i class="ti ti-x text-sm" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'scentique_announcement_dismissed'

interface Message {
  icon: string
  text: string
}

const messages: Message[] = [
  { icon: 'ti ti-truck', text: 'Free Shipping on Orders Over $100' },
  { icon: 'ti ti-tag', text: 'Enjoy 10% Off on Your First Order — Use Code: WELCOME10' },
  { icon: 'ti ti-gift', text: 'New Arrivals: Fresh Scents Just Landed!' },
  { icon: 'ti ti-star', text: 'Join Our Loyalty Program & Earn Points on Every Purchase' },
]

const dismissed = ref(localStorage.getItem(STORAGE_KEY) === 'true')
const currentIndex = ref(0)
let messageTimer: ReturnType<typeof setInterval> | null = null

const visible = computed(() => !dismissed.value)
const currentMessage = computed(() => messages[currentIndex.value] ?? messages[0])

function dismiss() {
  dismissed.value = true
  localStorage.setItem(STORAGE_KEY, 'true')
}

function advanceMessage() {
  currentIndex.value = (currentIndex.value + 1) % messages.length
}

onMounted(() => {
  messageTimer = setInterval(advanceMessage, 4000)
})

onUnmounted(() => {
  if (messageTimer) clearInterval(messageTimer)
})
</script>

<style scoped>
.message-slide-enter-active,
.message-slide-leave-active {
  transition: all 0.35s ease;
}
.message-slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.message-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
