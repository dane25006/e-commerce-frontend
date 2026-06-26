<template>
  <div class="relative min-h-screen">
    <HomeView />

    <button
      type="button"
      class="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-md"
      aria-label="Close auth dialog"
      @click="emit('close')"
    />

    <div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
      <Transition name="slide-up" appear>
        <section
          class="relative my-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/40 bg-white/90 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl md:grid-cols-[0.9fr_1.1fr]"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <button
            type="button"
            class="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/70 hover:text-slate-700"
            aria-label="Close"
            @click="emit('close')"
          >
            <i class="ti ti-x text-lg" aria-hidden="true" />
          </button>

          <aside class="hidden bg-slate-950 p-8 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <i class="ti ti-shopping-bag text-xl" aria-hidden="true" />
              </div>
              <p class="text-sm font-medium uppercase tracking-[0.18em] text-indigo-200">
                {{ eyebrow }}
              </p>
              <h2 :id="titleId" class="mt-3 text-3xl font-semibold leading-tight">
                {{ title }}
              </h2>
              <p class="mt-4 text-sm leading-6 text-slate-300">
                {{ subtitle }}
              </p>
            </div>

            <div class="grid gap-3 text-sm text-slate-200">
              <div class="flex items-center gap-3">
                <i class="ti ti-shield-check text-indigo-300" aria-hidden="true" />
                <span>Secure customer profile</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="ti ti-truck-delivery text-indigo-300" aria-hidden="true" />
                <span>Order history in one place</span>
              </div>
            </div>
          </aside>

          <div class="p-6 sm:p-8">
            <header class="mb-6 pr-8">
              <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 md:hidden">
                <i class="ti ti-shopping-bag text-base text-white" aria-hidden="true" />
              </div>
              <p class="text-sm font-medium text-indigo-600">{{ eyebrow }}</p>
              <h1 :id="titleId" class="mt-1 text-2xl font-semibold text-slate-950">{{ title }}</h1>
              <p class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>
            </header>

            <slot />
          </div>
        </section>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import HomeView from '@/views/home/HomeView.vue'

defineProps<{
  eyebrow: string
  title: string
  subtitle: string
  titleId?: string
}>()

const emit = defineEmits<{
  close: []
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-leave-active {
  transition: all 0.2s ease-in;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(32px) scale(0.97);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}
</style>
