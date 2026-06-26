<template>
  <div class="flex items-center gap-0.5">
    <i
      v-for="n in 5" :key="n"
      class="ti ti-star"
      :class="[
        n <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200',
        sizeClass,
      ]"
      aria-hidden="true"
    />
    <span v-if="showCount && count !== undefined" class="text-xs text-gray-400 ml-1">
      ({{ count }})
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  rating:     number
  count?:     number
  showCount?: boolean
  size?:      'sm' | 'md' | 'lg'
}>(), {
  showCount: false,
  size:      'sm',
})

const sizeClass = computed(() => ({
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}[props.size]))
</script>