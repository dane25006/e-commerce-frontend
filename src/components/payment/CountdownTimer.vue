<template>
  <div class="countdown-wrapper">
    <div class="timer-pill" :class="{ expired: isExpired }">
      <span class="dot" :class="{ green: !isExpired, red: isExpired }" />
      <span v-if="!isExpired" class="timer-text">Expires in {{ formatted }}</span>
      <span v-else class="timer-text">QR Code Expired</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  expiresIn?: number
}>()

const emit = defineEmits<{
  expired: []
}>()

const remaining = ref(props.expiresIn ?? 1800)
const isExpired = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const formatted = computed(() => {
  const total = Math.max(0, remaining.value)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

function start() {
  stop()
  remaining.value = props.expiresIn ?? 1800
  isExpired.value = false
  timer = setInterval(() => {
    remaining.value--
    if (remaining.value <= 0) {
      isExpired.value = true
      emit('expired')
      stop()
    }
  }, 1000)
}

function stop() {
  if (timer) { clearInterval(timer); timer = null }
}

function reset() { start() }

defineExpose({ start, stop, reset })

onMounted(start)
onUnmounted(stop)
</script>

<style scoped>
.countdown-wrapper {
  display: flex;
  justify-content: center;
  padding: 4px 24px 16px;
}

.timer-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 100px;
  background: #F1F5F9;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1E293B;
  transition: all 0.3s;
}

.timer-pill.expired {
  background: #FEF2F2;
  color: #DC2626;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot.green {
  background: #22C55E;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}

.dot.red {
  background: #DC2626;
  box-shadow: 0 0 6px rgba(220, 38, 38, 0.4);
}

.timer-text {
  font-variant-numeric: tabular-nums;
}
</style>
