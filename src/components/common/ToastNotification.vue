<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto flex items-center gap-3 px-5 py-3 text-sm font-semibold shadow-lg"
          :style="{
            borderRadius: 'var(--radius-sm)',
            ...bgStyle(t.type),
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }"
        >
          <i :class="iconClass(t.type)" aria-hidden="true" />
          {{ t.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts } = useToast()

function bgStyle(type: string) {
  if (type === 'success') return { background: '#B88A44', color: '#FFFFFF' }
  if (type === 'error') return { background: '#E53935', color: '#FFFFFF' }
  return { background: '#222222', color: '#FFFFFF' }
}

function iconClass(type: string) {
  if (type === 'success') return 'ti ti-circle-check text-lg'
  if (type === 'error') return 'ti ti-alert-circle text-lg'
  return 'ti ti-info-circle text-lg'
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
