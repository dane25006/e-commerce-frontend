<template>
  <div class="qr-section" :class="{ faded: expired }">
    <div class="qr-box">
      <canvas v-if="!qrImage" ref="qrCanvas"></canvas>
      <img v-else :src="qrImage" alt="KHQR" class="qr-img" />
      <div class="qr-center-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="17" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="17" width="6" height="6" rx="1" />
          <path d="M7 7h2v2H7z" />
          <path d="M15 7h2v2h-2z" />
          <path d="M7 15h2v2H7z" />
          <path d="M21 12v3a2 2 0 01-2 2h-3" />
          <path d="M5 12H3a2 2 0 012-2h3" />
          <path d="M12 3v2" />
          <path d="M12 19v2" />
        </svg>
      </div>
    </div>
    <p v-if="expired" class="expired-label">QR Code Expired</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import QRCode from 'qrcode'

const props = defineProps<{
  qrString?: string | null
  qrImage?: string | null
  expired?: boolean
}>()

const emit = defineEmits<{
  error: []
}>()

const qrCanvas = ref<HTMLCanvasElement | null>(null)

async function renderQR() {
  if (!qrCanvas.value || !props.qrString) return
  try {
    await QRCode.toCanvas(qrCanvas.value, props.qrString, {
      width: 260,
      margin: 2,
      color: { dark: '#1E293B', light: '#ffffff' },
    })
  } catch {
    emit('error')
  }
}

watch(() => props.qrString, async () => {
  await nextTick()
  renderQR()
}, { immediate: true })
</script>

<style scoped>
.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px 16px;
  transition: opacity 0.4s;
}

.qr-section.faded {
  opacity: 0.4;
  pointer-events: none;
}

.qr-box {
  position: relative;
  display: inline-flex;
  padding: 20px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
}

.qr-box canvas,
.qr-img {
  display: block;
  width: 260px;
  height: 260px;
  border-radius: 8px;
}

.qr-img {
  object-fit: contain;
}

.qr-center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  background: #1E293B;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
}

.expired-label {
  margin-top: 12px;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #DC2626;
}
</style>
