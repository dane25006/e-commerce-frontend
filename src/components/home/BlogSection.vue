<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between mb-10">
        <div>
          <span class="section-label block mb-2">From Our Blog</span>
          <h2 class="text-3xl md:text-4xl font-black text-gray-900">News, Tips &amp; Inspiration</h2>
        </div>
        <button class="btn-outline text-sm py-2 px-5 hidden sm:block">View All Posts</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="card-luxury overflow-hidden group cursor-pointer"
        >
          <!-- Image -->
          <div class="relative overflow-hidden aspect-video bg-gradient-to-br"
            :class="post.gradient">
            <div class="absolute inset-0 flex items-center justify-center">
              <i :class="`ti ${post.icon} text-5xl text-white/60`" aria-hidden="true" />
            </div>
            <!-- Date badge -->
            <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-purple-700 px-2.5 py-1 rounded-full">
              {{ post.date }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <span class="text-[10px] font-bold text-purple-500 uppercase tracking-wider">{{ post.category }}</span>
            <h3 class="text-sm font-bold text-gray-900 mt-1 mb-2 leading-snug group-hover:text-purple-700 transition line-clamp-2">
              {{ post.title }}
            </h3>
            <p class="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{{ post.excerpt }}</p>
            <div class="flex items-center text-xs font-semibold text-purple-600 hover:text-purple-800 transition">
              Read More <i class="ti ti-arrow-right ml-1" aria-hidden="true" />
            </div>
          </div>
        </article>
      </div>

      <div class="text-center mt-8 sm:hidden">
        <button class="btn-outline text-sm py-2.5 px-6">View All Posts</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const posts = [
  {
    slug: 'top-fragrances-2024',
    date: 'Jun 10, 2025',
    category: 'Trends',
    title: 'The Top 5 Fragrances Taking Over 2025',
    excerpt: 'Discover the scents that have been flying off shelves this season and why experts are raving about them.',
    icon: 'ti-sparkles',
    gradient: 'from-pink-200 to-purple-300',
  },
  {
    slug: 'how-to-choose-perfume',
    date: 'May 28, 2025',
    category: 'Guide',
    title: 'How to Choose the Perfect Perfume for Any Occasion',
    excerpt: 'A fragrance expert\'s guide to matching your scent to your mood, event, and season.',
    icon: 'ti-heart',
    gradient: 'from-violet-200 to-indigo-300',
  },
  {
    slug: 'fragrance-layering',
    date: 'May 15, 2025',
    category: 'Tips',
    title: 'The Art of Fragrance Layering: Make Your Scent Last Longer',
    excerpt: 'Learn the secrets professional perfumers use to create a unique, long-lasting signature scent.',
    icon: 'ti-layers',
    gradient: 'from-fuchsia-200 to-purple-300',
  },
]
</script>
