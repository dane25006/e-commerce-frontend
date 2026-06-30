<template>
  <div class="field-wrapper">
    <div
      class="field-inner"
      :class="{ 'field-error': error }"
      :style="{
        borderRadius: 'var(--radius-sm)',
        border: error ? '1px solid #E53935' : '1px solid var(--border)',
        background: error ? '#FFF5F5' : 'var(--surface)',
      }"
    >
      <input
        :id="id"
        v-model.trim="model"
        :type="type"
        :autocomplete="autocomplete"
        :placeholder="placeholder || ' '"
        class="field-input"
        :style="{ color: 'var(--text)' }"
        @blur="emit('blur')"
      />
      <label :for="id" class="field-label" :style="{ color: error ? '#E53935' : 'var(--text-muted)' }">
        {{ label }}
      </label>
    </div>
    <p v-if="error" class="mt-1.5 text-xs font-medium px-1" style="color: #E53935;">{{ error }}</p>
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
</script>

<style scoped>
.field-wrapper {
  width: 100%;
}

.field-inner {
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.field-inner:focus-within {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(184, 138, 68, 0.12);
  background: var(--surface);
}

.field-inner.field-error:focus-within {
  border-color: #E53935 !important;
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
}

.field-input {
  width: 100%;
  padding: 22px 14px 6px;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  line-height: 1.5;
  font-family: inherit;
}

.field-input::placeholder {
  color: transparent;
}

.field-label {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: left center;
  font-weight: 400;
}

.field-input:focus ~ .field-label,
.field-input:not(:placeholder-shown) ~ .field-label {
  top: 10px;
  transform: translateY(0);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.field-input:focus ~ .field-label {
  color: var(--primary) !important;
}

.field-error .field-input:focus ~ .field-label {
  color: #E53935 !important;
}
</style>
