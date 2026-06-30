<template>
  <div
    v-if="visible"
    class="announcement-bar"
  >
    <div class="announcement-shimmer" />

    <div class="announcement-container">
      <div class="announcement-row">
        <div class="announcement-message-wrap">
          <div class="announcement-message-inner">
            <Transition name="message-slide" mode="out-in">
              <div
                :key="currentIndex"
                class="announcement-message"
              >
                <span class="announcement-text">
                  <i :class="currentMessage?.icon" class="announcement-icon" aria-hidden="true" />
                  <span class="announcement-label">{{ currentMessage?.text }}</span>
                </span>
              </div>
            </Transition>
          </div>
        </div>

        <div class="announcement-links">
          <RouterLink to="/orders" class="announcement-link">
            <i class="ti ti-map-pin" aria-hidden="true" />
            Track Order
          </RouterLink>
          <span class="announcement-divider">|</span>
          <a href="#" class="announcement-link">
            <i class="ti ti-headset" aria-hidden="true" />
            Help Center
          </a>
        </div>

        <button
          @click="dismiss"
          class="announcement-close"
          aria-label="Close announcement"
        >
          <i class="ti ti-x" aria-hidden="true" />
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
.announcement-bar {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #3D352E, #2B241E);
}

.announcement-shimmer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.announcement-shimmer::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(184,138,68,0.08), transparent);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.announcement-container {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.announcement-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
}

@media (min-width: 640px) {
  .announcement-row {
    height: 36px;
  }
}

.announcement-message-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

@media (min-width: 640px) {
  .announcement-message-wrap {
    justify-content: flex-start;
  }
}

.announcement-message-inner {
  position: relative;
  height: 20px;
  width: 100%;
  overflow: hidden;
}

.announcement-message {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
  .announcement-message {
    justify-content: flex-start;
  }
}

.announcement-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.announcement-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.announcement-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.announcement-links {
  display: none;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .announcement-links {
    display: flex;
  }
}

.announcement-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: color 0.2s;
}

.announcement-link:hover {
  color: rgba(255,255,255,0.9);
}

.announcement-divider {
  color: rgba(255,255,255,0.15);
  font-size: 12px;
}

.announcement-close {
  margin-left: 12px;
  padding: 4px;
  border-radius: 8px;
  border: none;
  background: none;
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  transition: color 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.announcement-close:hover {
  color: rgba(255,255,255,0.7);
}

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
