<template>
  <Transition name="confirm">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center">
      <button
        type="button"
        class="fixed inset-0"
        :style="{ background: 'rgba(34,34,34,0.45)', backdropFilter: 'blur(6px)' }"
        aria-label="Close"
        @click="handleCancel"
      />
      <div
        class="relative w-full max-w-sm mx-4 p-8"
        :style="{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
          border: '1px solid var(--border)',
        }"
        role="dialog"
        aria-modal="true"
      >
        <div class="text-center">
          <div
            class="mx-auto w-14 h-14 flex items-center justify-center mb-5"
            :style="{
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(184,138,68,0.1)',
            }"
          >
            <i class="ti ti-alert-triangle text-2xl" style="color: var(--primary);" aria-hidden="true" />
          </div>
          <h3 class="text-lg font-bold mb-2" :style="{ fontFamily: '\'Playfair Display\', serif', color: 'var(--text)' }">{{ title }}</h3>
          <p class="text-sm mb-7 leading-relaxed" :style="{ color: 'var(--text-muted)' }">{{ message }}</p>
          <div class="flex items-center gap-3">
            <button
              @click="handleCancel"
              class="btn-cancel flex-1 py-2.5 text-sm font-semibold rounded-xl transition"
              :style="{
                background: 'var(--background)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
              :style="{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                boxShadow: '0 4px 16px rgba(184,138,68,0.3)',
              }"
              :disabled="loading"
            >
              <i v-if="loading" class="ti ti-loader-2 animate-spin text-sm" aria-hidden="true" />
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(defineProps<{
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>(), {
  title: 'Confirm',
  message: 'Are you sure?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const show = ref(false)
const loading = ref(false)

function open() {
  show.value = true
  loading.value = false
}

function close() {
  show.value = false
  loading.value = false
}

function handleCancel() {
  if (loading.value) return
  show.value = false
  emit('cancel')
}

async function handleConfirm() {
  loading.value = true
  emit('confirm')
}

defineExpose({ open, close })
</script>

<style scoped>
.confirm-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.confirm-leave-active {
  transition: all 0.18s ease-in;
}
.confirm-enter-from {
  opacity: 0;
}
.confirm-enter-from > div:last-child {
  transform: scale(0.92);
}
.confirm-leave-to {
  opacity: 0;
}

.btn-cancel:hover {
  background: #F0EDE8 !important;
}
</style>
