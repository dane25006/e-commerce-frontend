<template>
  <div>
    <!-- <div class="text-xs font-bold uppercase tracking-wider mb-3" style="color: #B08D57;">Categories</div> -->
    <div class="space-y-1">
      <RouterLink
        v-for="cat in staticCategories"
        :key="cat.slug"
        :to="`/category/${cat.slug}`"
        class="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition text-left"
        :class="activeSlug === cat.slug
          ? 'bg-[#B08D57]/10 text-[#8E6F3E] font-semibold'
          : 'text-[#777777]'"
      >
        <i
          :class="[`ti ${cat.icon} text-sm`, activeSlug === cat.slug ? 'text-[#B08D57]' : 'text-[#B08D57]']"
          aria-hidden="true"
        />
        {{ cat.label }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { staticCategories } from '../types'

defineProps<{
  activeSlug?: string
}>()
</script>
