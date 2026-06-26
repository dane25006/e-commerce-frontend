<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <!-- Big 404 -->
      <div class="text-[120px] font-black leading-none mb-4 text-gradient">404</div>
      <h1 class="text-2xl font-black text-gray-900 mb-3">Page Not Found</h1>
      <p class="text-gray-500 text-sm mb-8">
        Looks like this scent has evaporated. The page you're looking for doesn't exist.
      </p>
      <div class="flex items-center gap-4 justify-center">
        <RouterLink to="/" class="btn-primary py-3 px-8 text-sm">Go Home</RouterLink>
        <RouterLink to="/products" class="btn-outline py-3 px-8 text-sm">Browse Shop</RouterLink>
      </div>
    </div>
  </div>
</template>
