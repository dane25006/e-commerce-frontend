<template>
  <div>
    <div class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{{ $t('products.categories') }}</div>
    <div class="space-y-1">
      <button
        v-for="cat in staticCategories"
        :key="cat.label"
        @click="$emit('select', cat.label)"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition text-left"
        :class="selectedLabel === cat.label
          ? 'bg-purple-100 text-purple-700 font-semibold'
          : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'"
      >
        <i :class="`ti ${cat.icon} text-sm`" :class="selectedLabel === cat.label ? 'text-purple-600' : 'text-purple-400'" aria-hidden="true" />
        {{ cat.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { staticCategories } from '@/features/categories'

defineProps<{
  selectedLabel: string | null
}>()

defineEmits<{ select: [label: string] }>()
</script>
