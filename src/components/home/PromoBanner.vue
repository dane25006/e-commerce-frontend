<template>
  <section class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 via-violet-100 to-fuchsia-100 border border-purple-200/60 relative">
        <!-- Background decoration -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute -top-12 -left-12 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl" />
          <div class="absolute -bottom-8 right-1/4 w-64 h-64 bg-violet-300/20 rounded-full blur-3xl" />
        </div>

        <div class="relative flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
          <!-- Left image area -->
          <div class="md:w-2/5 flex items-center justify-center">
            <div class="relative w-48 h-64 md:w-60 md:h-80">
              <div class="absolute inset-0 bg-gradient-to-b from-purple-300/30 to-violet-400/20 rounded-full blur-2xl scale-110" />
              <div class="relative w-full h-full flex items-end justify-center">
                <!-- Perfume bottle visual -->
                <div class="w-24 h-40 md:w-32 md:h-52 bg-gradient-to-b from-violet-300 via-purple-400 to-purple-700 rounded-t-full rounded-b-2xl shadow-2xl shadow-purple-400/50 flex items-end justify-center pb-3">
                  <span class="text-white/70 text-[8px] font-bold tracking-widest uppercase">SCENTIQUE</span>
                </div>
              </div>
              <!-- Decorative flowers -->
              <div class="absolute top-4 right-2 text-3xl" aria-hidden="true">🌺</div>
              <div class="absolute bottom-8 left-2 text-2xl" aria-hidden="true">💜</div>
              <div class="absolute top-1/2 left-0 text-xl" aria-hidden="true">🌸</div>
            </div>
          </div>

          <!-- Right content -->
          <div class="md:w-3/5 text-center md:text-left">
            <span class="section-label mb-3 block">Limited Time Offer</span>

            <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 leading-tight">
              Get <span class="text-gradient">15% Off</span><br />
              On Your First Order
            </h2>

            <p class="text-gray-600 text-base mb-6">
              Use code <span class="font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-lg">WELCOME15</span> at checkout
            </p>

            <!-- Countdown Timer -->
            <div class="flex items-center gap-3 justify-center md:justify-start mb-8">
              <div v-for="(unit, i) in countdown" :key="unit.label" class="flex items-center gap-3">
                <div class="text-center">
                  <div class="w-14 h-14 bg-white rounded-2xl shadow-md shadow-purple-200/40 flex items-center justify-center border border-purple-100">
                    <span class="text-xl font-black text-purple-700">{{ unit.value }}</span>
                  </div>
                  <p class="text-[10px] text-gray-500 mt-1 font-semibold uppercase tracking-wide">{{ unit.label }}</p>
                </div>
                <span v-if="i < countdown.length - 1" class="text-purple-400 font-bold text-xl mb-4">:</span>
              </div>
            </div>

            <button class="btn-primary py-3 px-8 flex items-center gap-2 mx-auto md:mx-0 w-fit text-sm">
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

// Count down to midnight
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
