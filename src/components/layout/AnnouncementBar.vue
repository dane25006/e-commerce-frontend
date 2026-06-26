<template>
  <div class="bg-gradient-to-r from-purple-600 via-purple-500 to-violet-600 text-white py-2 px-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium">
      <!-- left: shipping notice -->
      <div class="hidden sm:flex items-center gap-1.5">
        <i class="ti ti-truck text-purple-200" aria-hidden="true" />
        <span>Free Shipping on Orders Over $100</span>
      </div>

      <!-- center: promo -->
      <div class="flex items-center gap-4 mx-auto sm:mx-0">
        <span class="flex items-center gap-1.5">
          <i class="ti ti-tag text-purple-200" aria-hidden="true" />
          Enjoy 10% Off on Your First Order
        </span>
      </div>

      <!-- right: links -->
      <div class="hidden md:flex items-center gap-4">
        <RouterLink to="/orders" class="flex items-center gap-1 hover:text-purple-200 transition">
          <i class="ti ti-map-pin text-xs" aria-hidden="true" />
          Track Order
        </RouterLink>
        <span class="text-purple-400">|</span>
        <a href="#" class="flex items-center gap-1 hover:text-purple-200 transition">
          <i class="ti ti-headset text-xs" aria-hidden="true" />
          Help Center
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
