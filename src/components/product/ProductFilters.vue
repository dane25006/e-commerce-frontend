<template>
  <aside class="space-y-6">

    <!-- search -->
    <div>
      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Search
      </label>
      <div class="relative">
        <i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
           aria-hidden="true" />
        <input
          :value="modelValue.search"
          @input="emit('update:modelValue', {
            ...modelValue,
            search: ($event.target as HTMLInputElement).value,
            page: 1
          })"
          type="text"
          placeholder="Search products..."
          class="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        />
      </div>
    </div>

    <!-- categories -->
    <div>
      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Category
      </label>
      <div class="space-y-1">
        <button
          @click="emit('update:modelValue', { ...modelValue, category_id: undefined, page: 1 })"
          class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition"
          :class="!modelValue.category_id
            ? 'bg-indigo-50 text-indigo-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50'"
        >
          <span>All categories</span>
          <span class="text-xs text-gray-400">{{ totalProducts }}</span>
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="emit('update:modelValue', { ...modelValue, category_id: cat.id, page: 1 })"
          class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition"
          :class="modelValue.category_id === cat.id
            ? 'bg-indigo-50 text-indigo-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50'"
        >
          <span>{{ cat.name }}</span>
          <span class="text-xs text-gray-400">{{ cat.products_count }}</span>
        </button>
      </div>
    </div>

    <!-- price range -->
    <div>
      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        Price range
      </label>
      <div class="flex items-center gap-2">
        <input
          :value="modelValue.min_price"
          @input="emit('update:modelValue', {
            ...modelValue,
            min_price: Number(($event.target as HTMLInputElement).value) || undefined,
            page: 1,
          })"
          type="number"
          min="0"
          placeholder="Min"
          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        />
        <span class="text-gray-300 flex-shrink-0">—</span>
        <input
          :value="modelValue.max_price"
          @input="emit('update:modelValue', {
            ...modelValue,
            max_price: Number(($event.target as HTMLInputElement).value) || undefined,
            page: 1,
          })"
          type="number"
          min="0"
          placeholder="Max"
          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        />
      </div>
    </div>

    <!-- reset -->
    <button
      @click="emit('reset')"
      class="w-full text-sm text-gray-500 hover:text-red-500 border border-gray-200
             hover:border-red-200 rounded-lg py-2 transition flex items-center justify-center gap-1.5"
    >
      <i class="ti ti-refresh text-sm" aria-hidden="true" />
      Reset filters
    </button>

  </aside>
</template>

<script setup lang="ts">
import type { ProductParams } from '@/services/productService'
import type { Category } from '@/types/product'

defineProps<{
  modelValue:    ProductParams
  categories:    Category[]
  totalProducts: number
}>()

const emit = defineEmits<{
  'update:modelValue': [val: ProductParams]
  'reset':             []
}>()
</script>