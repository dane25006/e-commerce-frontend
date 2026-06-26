<template>
  <section class="bg-white py-10 border-b border-purple-100/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- API Categories -->
      <div v-if="categories.length" class="flex items-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide pb-2 justify-start md:justify-center">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="$emit('select', cat.id)"
          class="flex-shrink-0 flex flex-col items-center gap-2 group"
          :class="selectedId === cat.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'"
        >
          <div
            class="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 border-2"
            :class="selectedId === cat.id
              ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-300/50 scale-110'
              : 'bg-purple-50 border-purple-100 group-hover:bg-purple-100 group-hover:border-purple-300 group-hover:shadow-md group-hover:shadow-purple-200/50 group-hover:scale-105'"
          >
            <i
              class="ti ti-bottle text-2xl transition-colors"
              :class="selectedId === cat.id ? 'text-white' : 'text-purple-500'"
              aria-hidden="true"
            />
          </div>
          <span
            class="text-xs font-semibold whitespace-nowrap transition-colors"
            :class="selectedId === cat.id ? 'text-purple-700' : 'text-gray-600 group-hover:text-purple-600'"
          >
            {{ cat.name }}
          </span>
          <span class="text-[10px] text-gray-400">{{ cat.products_count }}</span>
        </button>
      </div>

      <!-- Static categories fallback / extra visual categories -->
      <div v-else class="flex items-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide pb-2 justify-start md:justify-center">
        <div
          v-for="cat in staticCategories"
          :key="cat.label"
          class="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer opacity-70 hover:opacity-100"
        >
          <div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-50 border-2 border-purple-100 flex items-center justify-center group-hover:bg-purple-100 group-hover:border-purple-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-purple-200/50 transition-all duration-300">
            <i :class="`ti ${cat.icon} text-2xl text-purple-500`" aria-hidden="true" />
          </div>
          <span class="text-xs font-semibold text-gray-600 group-hover:text-purple-600 transition-colors whitespace-nowrap">
            {{ cat.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Category } from '@/types/product'

defineProps<{
  categories: Category[]
  selectedId: number | null
}>()

defineEmits<{ select: [id: number] }>()

const staticCategories = [
  { label: 'For Her', icon: 'ti-heart' },
  { label: 'For Him', icon: 'ti-user' },
  { label: 'Unisex', icon: 'ti-gender-bigender' },
  { label: 'Best Sellers', icon: 'ti-crown' },
  { label: 'New Arrivals', icon: 'ti-sparkles' },
  { label: 'Gift Sets', icon: 'ti-gift' },
  { label: 'Travel Size', icon: 'ti-plane' },
]
</script>
