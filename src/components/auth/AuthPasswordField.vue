<template>
  <div>
    <label :for="id" class="mb-1 block text-sm font-medium text-slate-700">{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :type="visible ? 'text' : 'password'"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        class="w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        :class="inputClasses"
        @blur="emit('blur')"
      />
      <button
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        @click="visible = !visible"
      >
        <i :class="visible ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-lg" aria-hidden="true" />
      </button>
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const model = defineModel<string>({ required: true })

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    autocomplete?: string
    placeholder?: string
    error?: string
  }>(),
  {
    autocomplete: 'new-password',
    placeholder: '',
    error: '',
  },
)

const emit = defineEmits<{
  blur: []
}>()

const visible = ref(false)

const inputClasses = computed(() =>
  props.error
    ? 'border-red-400 bg-red-50/80 text-red-900 placeholder-red-300'
    : 'border-slate-300 bg-white/80 text-slate-950 placeholder-slate-400',
)
</script>
