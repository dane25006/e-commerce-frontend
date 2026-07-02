<template>
  <aside class="space-y-6">

    <!-- search -->
    <div>
      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        {{ $t('products.search') }}
      </label>
      <div class="relative">
        <i class="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
           aria-hidden="true" />
        <input
          id="filter-search"
          name="search"
          :value="modelValue.search"
          @input="emit('update:modelValue', {
            ...modelValue,
            search: ($event.target as HTMLInputElement).value,
            page: 1
          })"
          type="text"
          :placeholder="$t('products.searchPlaceholder')"
          class="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        />
      </div>
    </div>

    <!-- categories -->
    <div>
      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        {{ $t('products.categories') }}
      </label>
      <div class="space-y-1">
        <button
          @click="emit('update:modelValue', { ...modelValue, category_id: undefined, page: 1 })"
          class="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition"
          :class="!modelValue.category_id
            ? 'bg-indigo-50 text-indigo-700 font-medium'
            : 'text-gray-600 hover:bg-gray-50'"
        >
          <span>{{ $t('products.allCategories') }}</span>
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
    <div class="border-t border-gray-100 pt-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-900">{{ $t('products.priceRange') }}</h3>
        <i class="ti ti-chevron-up text-gray-400 text-sm" aria-hidden="true" />
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="r in priceRanges"
          :key="r.label"
          @click="emit('update:modelValue', { ...modelValue, min_price: r.min, max_price: r.max, page: 1 })"
          class="px-4 py-2 text-sm font-medium rounded-md border transition duration-300"
          :class="isActive(r)
            ? 'bg-purple-600 text-white border-purple-600'
            : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:bg-purple-50'"
        >
          {{ r.label }}
        </button>
      </div>
    </div>

    <!-- reset -->
    <button
      @click="emit('reset')"
      class="w-full text-sm text-gray-500 hover:text-red-500 border border-gray-200
             hover:border-red-200 rounded-lg py-2 transition flex items-center justify-center gap-1.5"
    >
      <i class="ti ti-refresh text-sm" aria-hidden="true" />
      {{ $t('products.resetFilters') }}
    </button>

  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ProductParams } from '@/services/productService'
import type { Category } from '@/types/product'

const { t } = useI18n()

const props = defineProps<{
  modelValue:    ProductParams
  categories:    Category[]
  totalProducts: number
}>()

const emit = defineEmits<{
  'update:modelValue': [val: ProductParams]
  'reset':             []
}>()

const priceRanges = [
  { label: t('products.under10'),  min: 0,   max: 10 },
  { label: t('products.between10and25'),  min: 10,  max: 25 },
  { label: t('products.between25and50'),  min: 25,  max: 50 },
  { label: t('products.over50'),       min: 50,  max: undefined },
]

function isActive(r: typeof priceRanges[number]): boolean {
  return props.modelValue.min_price === r.min && props.modelValue.max_price === r.max
}
</script>