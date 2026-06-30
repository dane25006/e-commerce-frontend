<template>
  <section class="blog-section">
    <div class="section-container">
      <div class="section-header">
        <div>
          <span class="section-label">From Our Blog</span>
          <h2 class="section-title">Perfume Journal</h2>
        </div>
        <button class="btn-secondary desktop-btn">View All Posts</button>
      </div>

      <div class="blog-grid">
        <article
          v-for="post in posts"
          :key="post.slug"
          class="card blog-card"
        >
          <div class="blog-image" :style="{ background: post.gradient }">
            <i :class="`ti ${post.icon}`" class="blog-image-icon" aria-hidden="true" />
            <span class="blog-date">{{ post.date }}</span>
          </div>

          <div class="blog-body">
            <span class="blog-category">{{ post.category }}</span>
            <h3 class="blog-title">{{ post.title }}</h3>
            <p class="blog-excerpt">{{ post.excerpt }}</p>
            <div class="blog-read-more">
              Read More <i class="ti ti-arrow-right" aria-hidden="true" />
            </div>
          </div>
        </article>
      </div>

      <div class="mobile-btn-wrap">
        <button class="btn-secondary">View All Posts</button>
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
    gradient: 'linear-gradient(135deg, #C9A96E50, #B08D5740)',
  },
  {
    slug: 'how-to-choose-perfume',
    date: 'May 28, 2025',
    category: 'Guide',
    title: 'How to Choose the Perfect Perfume for Any Occasion',
    excerpt: 'A fragrance expert\'s guide to matching your scent to your mood, event, and season.',
    icon: 'ti-heart',
    gradient: 'linear-gradient(135deg, #B08D5740, #4A403A30)',
  },
  {
    slug: 'fragrance-layering',
    date: 'May 15, 2025',
    category: 'Tips',
    title: 'The Art of Fragrance Layering: Make Your Scent Last Longer',
    excerpt: 'Learn the secrets professional perfumers use to create a unique, long-lasting signature scent.',
    icon: 'ti-layers',
    gradient: 'linear-gradient(135deg, #B08D5730, #C9A96E40)',
  },
]
</script>

<style scoped>
.blog-section {
  padding: 80px 24px;
  background: var(--background);
}

.section-container {
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 48px;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 900;
  color: var(--text);
  margin: 8px 0 0;
}

.desktop-btn {
  display: none;
}

@media (min-width: 640px) {
  .desktop-btn {
    display: inline-flex;
  }
}

.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .blog-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.blog-card {
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.blog-card:hover {
  transform: translateY(-4px);
}

.blog-image {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.blog-image-icon {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.45);
}

.blog-date {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 100px;
  color: var(--primary);
}

.blog-body {
  padding: 24px;
}

.blog-category {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--primary);
}

.blog-title {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 8px 0 10px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-excerpt {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-read-more {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  transition: gap 0.2s;
}

.blog-card:hover .blog-read-more {
  gap: 10px;
}

.mobile-btn-wrap {
  text-align: center;
  margin-top: 32px;
}

@media (min-width: 640px) {
  .mobile-btn-wrap {
    display: none;
  }
}
</style>
