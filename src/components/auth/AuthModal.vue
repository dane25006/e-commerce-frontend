<template>
  <div class="relative min-h-screen">
    <HomeView />

    <button
      type="button"
      class="fixed inset-0 z-40"
      :style="{ background: 'rgba(34,34,34,0.5)', backdropFilter: 'blur(8px)' }"
      :aria-label="$t('authModal.close')"
      @click="emit('close')"
    />

    <div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
      <Transition name="modal" appear>
        <section
          class="relative my-auto grid w-full max-w-4xl overflow-hidden"
          :style="{
            borderRadius: 'var(--radius)',
            background: 'var(--surface)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
          }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
        >
          <button
            type="button"
            class="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full transition"
            :style="{ color: 'var(--text-muted)' }"
            :aria-label="$t('authModal.closeLabel')"
            @click="emit('close')"
          >
            <i class="ti ti-x text-lg" aria-hidden="true" />
          </button>

          <aside
            class="hidden md:flex md:flex-col md:justify-between p-10"
            :style="{
              background: 'linear-gradient(160deg, #2C2C2C, #1A1A1A)',
              color: '#FFFFFF',
            }"
          >
            <div>
              <div
                class="mb-6 flex h-12 w-12 items-center justify-center"
                :style="{
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                  borderRadius: 'var(--radius-sm)',
                }"
              >
                <i class="ti ti-sparkles text-xl text-white" aria-hidden="true" />
              </div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em]" :style="{ color: 'rgba(255,255,255,0.5)' }">
                {{ eyebrow }}
              </p>
              <h2 :id="titleId" class="mt-4 text-3xl font-bold leading-tight" style="font-family: var(--font-heading);">
                {{ title }}
              </h2>
              <p class="mt-4 text-sm leading-relaxed" :style="{ color: 'rgba(255,255,255,0.6)' }">
                {{ subtitle }}
              </p>
            </div>

            <!-- Gold accent line -->
            <div class="my-8 h-px w-16" :style="{ background: 'var(--primary)' }" />

            <div class="grid gap-4 text-sm" :style="{ color: 'rgba(255,255,255,0.55)' }">
              <div class="flex items-center gap-3">
                <i class="ti ti-shield-check" :style="{ color: 'var(--primary)' }" aria-hidden="true" />
                <span>{{ $t('authModal.feature1') }}</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="ti ti-truck-delivery" :style="{ color: 'var(--primary)' }" aria-hidden="true" />
                <span>{{ $t('authModal.feature2') }}</span>
              </div>
            </div>
          </aside>

          <div class="p-8 sm:p-10">
            <header class="mb-8 pr-8">
              <div
                class="mb-4 flex h-10 w-10 items-center justify-center md:hidden"
                :style="{
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                  borderRadius: 'var(--radius-sm)',
                }"
              >
                <i class="ti ti-sparkles text-sm text-white" aria-hidden="true" />
              </div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em]" :style="{ color: 'var(--primary)' }">{{ eyebrow }}</p>
              <h1 :id="titleId" class="mt-2 text-2xl font-bold" :style="{ fontFamily: '\'Playfair Display\', serif', color: 'var(--text)' }">{{ title }}</h1>
              <!-- Gold accent line -->
              <div class="mt-3 h-0.5 w-10" :style="{ background: 'var(--primary)' }" />
              <p class="mt-3 text-sm" :style="{ color: 'var(--text-muted)' }">{{ subtitle }}</p>
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
.modal-enter-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-leave-active {
  transition: all 0.2s ease-in;
}
.modal-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.96);
}
.modal-leave-to {
  opacity: 0;
  transform: translateY(15px) scale(0.96);
}
</style>
