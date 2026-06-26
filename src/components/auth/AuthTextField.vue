<template>
  <div>
    <label :for="id" class="mb-1 block text-sm font-medium text-slate-700">{{ label }}</label>
    <input
      :id="id"
      v-model.trim="model"
      :type="type"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      class="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
      :class="inputClasses"
      @blur="emit('blur')"
    />
    <p v-if="error" class="mt-1 text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const model = defineModel<string>({ required: true })

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    type?: string
    autocomplete?: string
    placeholder?: string
    error?: string
  }>(),
  {
    type: 'text',
    autocomplete: undefined,
    placeholder: '',
    error: '',
  },
)

const emit = defineEmits<{
  blur: []
}>()

const inputClasses = computed(() =>
  props.error
    ? 'border-red-400 bg-red-50/80 text-red-900 placeholder-red-300'
    : 'border-slate-300 bg-white/80 text-slate-950 placeholder-slate-400',
)
</script>
