<template>
  <div class="qr-inline" :class="{ compact }">
    <div class="qr-section" :class="{ faded: expired || loading }">
      <div class="qr-box" :class="{ loading, compact }">
        <canvas v-if="!qrImage && !loading" ref="qrCanvas" class="qr-canvas" />
        <img v-else-if="qrImage && !loading" :src="qrImage" alt="KHQR" class="qr-img" />
        <div v-else class="qr-skeleton" />

        <div v-if="!loading" class="qr-center-icon">
          <span v-if="centerLabel" class="center-label">{{ centerLabel }}</span>
          <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

        <Transition name="expired-veil">
          <div v-if="expired" class="qr-veil">
            <i class="ti ti-clock-hour-4" />
            <span>{{ $t('payment.qrExpired') }}</span>
          </div>
        </Transition>
      </div>

      <p v-if="expired" class="expired-label">{{ $t('payment.qrExpiredDesc') }}</p>
      <p v-else-if="hint" class="hint">{{ hint }}</p>
    </div>

    <div v-if="!loading && !expired && !hideActions" class="qr-actions">
      <button class="action-btn" type="button" @click="downloadQR">
        <i class="ti ti-download" />
        <span>{{ $t('payment.downloadQR') }}</span>
      </button>
      <button class="action-btn" type="button" @click="copyQR">
        <i :class="['ti', copied ? 'ti-check' : 'ti-copy']" />
        <span>{{ copied ? $t('payment.copied') : $t('payment.copyQR') }}</span>
      </button>
    </div>

    <div v-if="showRetry && expired" class="retry-wrap">
      <button class="retry-btn" type="button" @click="emit('retry')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
        </svg>
        {{ retryText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import QRCode from 'qrcode'

const props = withDefaults(defineProps<{
  qrString?: string | null
  qrImage?: string | null
  expired?: boolean
  loading?: boolean
  showRetry?: boolean
  retryText?: string
  hint?: string
  hideActions?: boolean
  centerLabel?: string
  compact?: boolean
  qrSize?: number
}>(), {
  qrString: null,
  qrImage: null,
  expired: false,
  loading: false,
  showRetry: false,
  retryText: 'Try Again',
  hint: '',
  hideActions: false,
  centerLabel: '',
  compact: false,
  qrSize: 240,
})

const emit = defineEmits<{
  error: []
  retry: []
}>()

const qrCanvas = ref<HTMLCanvasElement | null>(null)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

async function renderQR() {
  if (!qrCanvas.value || !props.qrString) return
  try {
    await QRCode.toCanvas(qrCanvas.value, props.qrString, {
      width: props.qrSize,
      margin: 2,
      color: { dark: '#1E293B', light: '#ffffff' },
    })
  } catch {
    emit('error')
  }
}

function downloadQR() {
  if (!qrCanvas.value) return
  try {
    const url = qrCanvas.value.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `khqr-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch {
    emit('error')
  }
}

async function copyQR() {
  if (!props.qrString) return
  try {
    await navigator.clipboard.writeText(props.qrString)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 2000)
  } catch {
    // clipboard not available
  }
}

watch(() => props.qrString, async () => {
  await nextTick()
  renderQR()
}, { immediate: true })
</script>

<style scoped>
.qr-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 24px 8px;
  gap: 16px;
}

.qr-inline.compact {
  padding: 0;
  gap: 0;
}

.qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.3s;
}

.qr-section.faded { opacity: 0.45; }

.qr-box {
  position: relative;
  display: inline-flex;
  padding: 18px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
  transition: filter 0.3s;
}

.qr-box.compact {
  padding: 10px;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
}

.qr-canvas,
.qr-img {
  display: block;
  width: 240px;
  height: 240px;
  border-radius: 8px;
}

.qr-img { object-fit: contain; }

.compact .qr-canvas,
.compact .qr-img,
.compact .qr-skeleton {
  width: 180px;
  height: 180px;
}

.qr-skeleton {
  width: 240px;
  height: 240px;
  border-radius: 8px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.qr-center-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: #1E293B;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.18);
  border: 2px solid #fff;
}

.compact .qr-center-icon {
  width: 30px;
  height: 30px;
  border-width: 1.5px;
}

.center-label {
  font-size: 1.125rem;
  font-weight: 800;
  color: #fff;
  font-family: var(--font-body);
}

.compact .center-label {
  font-size: 0.875rem;
}

.qr-veil {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.86);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #DC2626;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 12px;
  text-align: center;
}

.qr-veil i { font-size: 1.75rem; }

.expired-veil-enter-active,
.expired-veil-leave-active { transition: opacity 0.25s ease; }
.expired-veil-enter-from,
.expired-veil-leave-to { opacity: 0; }

.expired-label {
  margin-top: 12px;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 600;
  color: #DC2626;
}

.hint {
  margin-top: 12px;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  color: #94A3B8;
  text-align: center;
  line-height: 1.5;
  max-width: 260px;
}

.qr-actions {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 280px;
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 10px;
  border-radius: 12px;
  background: #F1F5F9;
  color: #334155;
  border: 1px solid #E2E8F0;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #E2E8F0;
  border-color: #CBD5E1;
  transform: translateY(-1px);
}

.action-btn i { font-size: 0.9375rem; }

.retry-wrap {
  padding-bottom: 8px;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 14px;
  background: var(--primary, #B88A44);
  color: #fff;
  border: none;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.18);
}

@media (max-width: 430px) {
  .qr-inline { padding: 20px 16px 8px; }
  .qr-inline.compact { padding: 0; }
  .qr-canvas,
  .qr-img,
  .qr-skeleton { width: 220px; height: 220px; }
  .compact .qr-canvas,
  .compact .qr-img,
  .compact .qr-skeleton { width: 160px; height: 160px; }
  .qr-box { padding: 14px; }
  .qr-box.compact { padding: 8px; }
  .action-btn { padding: 10px 8px; font-size: 12.5px; }
}
</style>