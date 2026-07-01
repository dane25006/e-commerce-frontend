<template>
  <Transition name="slide-down">
    <div v-if="!isOnline" class="offline-bar">
      <i class="ti ti-wifi-off" aria-hidden="true" />
      <span>You are offline. Some features may be unavailable.</span>
    </div>
    <div v-else-if="justConnected" class="online-bar">
      <i class="ti ti-wifi" aria-hidden="true" />
      <span>Back online</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useNetworkStatus } from '@/composables/useNetworkStatus'

const { isOnline, justConnected } = useNetworkStatus()
</script>

<style scoped>
.offline-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: #FEF2F2;
  color: #991B1B;
  font-size: 0.8125rem;
  font-weight: 500;
}

.offline-bar i {
  font-size: 1rem;
  flex-shrink: 0;
}

.online-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background: #F0FDF4;
  color: #166534;
  font-size: 0.8125rem;
  font-weight: 500;
}

.online-bar i {
  font-size: 1rem;
  flex-shrink: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
