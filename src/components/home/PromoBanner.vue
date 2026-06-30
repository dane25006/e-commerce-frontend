<template>
  <section class="promo-banner-section">
    <div class="section-container">
      <div class="promo-banner-card">
        <div class="promo-banner-glow" />
        <div class="promo-banner-glow promo-banner-glow--secondary" />

        <div class="promo-banner-inner">
          <div class="promo-banner-visual">
            <div class="promo-visual-wrapper">
              <div class="promo-visual-glow" />
              <div class="promo-visual-bottle-wrap">
                <div class="promo-visual-bottle">
                  <span class="promo-visual-brand">SCENTIQUE</span>
                </div>
              </div>
              <div class="promo-visual-floral promo-visual-floral--right" aria-hidden="true">&#127800;</div>
              <div class="promo-visual-floral promo-visual-floral--left" aria-hidden="true">&#10024;</div>
              <div class="promo-visual-floral promo-visual-floral--center" aria-hidden="true">&#127800;</div>
            </div>
          </div>

          <div class="promo-banner-content">
            <span class="section-label">Limited Time Offer</span>

            <h2 class="promo-banner-title">
              Get <span class="promo-banner-highlight">15% Off</span><br />
              On Your First Order
            </h2>

            <p class="promo-banner-code-text">
              Use code <span class="promo-code">WELCOME15</span> at checkout
            </p>

            <div class="promo-countdown">
              <div v-for="(unit, i) in countdown" :key="unit.label" class="countdown-unit">
                <div class="countdown-value">{{ unit.value }}</div>
                <p class="countdown-label">{{ unit.label }}</p>
                <span v-if="i < countdown.length - 1" class="countdown-sep">:</span>
              </div>
            </div>

            <button class="btn-primary promo-banner-cta">
              Claim Offer
              <i class="ti ti-arrow-right" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const getTimeLeft = () => {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const diff = midnight.getTime() - now.getTime()
  return {
    h: Math.floor((diff / 1000 / 60 / 60) % 24),
    m: Math.floor((diff / 1000 / 60) % 60),
    s: Math.floor((diff / 1000) % 60),
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

const countdown = ref([
  { label: 'Hours', value: '00' },
  { label: 'Mins', value: '00' },
  { label: 'Secs', value: '00' },
])

let timer: ReturnType<typeof setInterval>

function tick() {
  const { h, m, s } = getTimeLeft()
  countdown.value = [
    { label: 'Hours', value: pad(h) },
    { label: 'Mins', value: pad(m) },
    { label: 'Secs', value: pad(s) },
  ]
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.promo-banner-section {
  padding: 32px 24px;
}

.section-container {
  max-width: 1280px;
  margin: 0 auto;
}

.promo-banner-card {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  background: linear-gradient(135deg, #F8F5F0, #F2EDE6, #EDE7DE);
  border: 1px solid var(--border);
}

.promo-banner-glow {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.promo-banner-glow::before {
  content: '';
  position: absolute;
  top: -48px;
  left: -48px;
  width: 192px;
  height: 192px;
  border-radius: 50%;
  background: rgba(184,138,68,0.12);
  filter: blur(48px);
}

.promo-banner-glow--secondary::before {
  top: auto;
  left: auto;
  bottom: -32px;
  right: 25%;
  width: 256px;
  height: 256px;
  background: rgba(196,154,90,0.08);
}

.promo-banner-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 32px 24px;
}

@media (min-width: 768px) {
  .promo-banner-inner {
    flex-direction: row;
    padding: 48px 56px;
  }
}

.promo-banner-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}

.promo-visual-wrapper {
  position: relative;
  width: 192px;
  height: 256px;
}

@media (min-width: 768px) {
  .promo-visual-wrapper {
    width: 240px;
    height: 320px;
  }
}

.promo-visual-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(to bottom, rgba(184,138,68,0.15), rgba(196,154,90,0.1));
  filter: blur(48px);
  transform: scale(1.1);
}

.promo-visual-bottle-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.promo-visual-bottle {
  width: 96px;
  height: 160px;
  border-top-left-radius: 100%;
  border-top-right-radius: 100%;
  border-bottom-left-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
  box-shadow: 0 16px 40px rgba(184,138,68,0.3);
  background: linear-gradient(to bottom, #C49A5A, var(--primary), #8E6F3E);
}

@media (min-width: 768px) {
  .promo-visual-bottle {
    width: 128px;
    height: 208px;
  }
}

.promo-visual-brand {
  color: rgba(255,255,255,0.5);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.promo-visual-floral {
  position: absolute;
  font-size: 24px;
  opacity: 0.5;
}

.promo-visual-floral--right {
  top: 16px;
  right: 8px;
}

.promo-visual-floral--left {
  bottom: 32px;
  left: 8px;
  font-size: 20px;
}

.promo-visual-floral--center {
  top: 50%;
  left: 0;
  font-size: 18px;
}

.promo-banner-content {
  text-align: center;
}

@media (min-width: 768px) {
  .promo-banner-content {
    text-align: left;
  }
}

.promo-banner-title {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--text);
  margin: 12px 0 8px;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .promo-banner-title {
    font-size: 40px;
  }
}

@media (min-width: 1024px) {
  .promo-banner-title {
    font-size: 48px;
  }
}

.promo-banner-highlight {
  color: var(--primary);
}

.promo-banner-code-text {
  font-size: 15px;
  color: var(--text-muted);
  margin: 0 0 28px;
}

.promo-code {
  font-weight: 900;
  color: var(--primary);
  background: rgba(184,138,68,0.1);
  padding: 3px 10px;
  border-radius: 8px;
}

.promo-countdown {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .promo-countdown {
    justify-content: flex-start;
  }
}

.countdown-unit {
  display: flex;
  align-items: center;
  gap: 12px;
}

.countdown-value {
  width: 56px;
  height: 56px;
  background: var(--surface);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 12px rgba(184,138,68,0.1);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 900;
  color: var(--primary);
}

.countdown-label {
  font-size: 10px;
  color: var(--text-muted);
  margin: 6px 0 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
}

.countdown-sep {
  color: rgba(184,138,68,0.4);
  font-weight: 700;
  font-size: 20px;
  align-self: flex-start;
  margin-top: 4px;
}

.promo-banner-cta {
  margin: 0 auto;
}

@media (min-width: 768px) {
  .promo-banner-cta {
    margin: 0;
  }
}
</style>
