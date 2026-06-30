<template>
  <section class="why-section">
    <div class="section-container">
      <div class="section-header">
        <span class="section-label">Why Scentique?</span>
        <h2 class="section-title">The Luxury Difference</h2>
      </div>

      <div class="features-grid">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="card feature-card"
        >
          <div class="feature-icon-wrap">
            <i :class="`ti ${feature.icon}`" aria-hidden="true" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  { icon: 'ti-diamond', title: '100% Authentic', desc: 'Guaranteed genuine luxury perfumes' },
  { icon: 'ti-truck', title: 'Fast Delivery', desc: 'Free shipping on orders over $100' },
  { icon: 'ti-shield-lock', title: 'Secure Payment', desc: '100% safe & secure checkout' },
  { icon: 'ti-refresh', title: 'Easy Returns', desc: 'Hassle-free return within 30 days' },
]
</script>

<style scoped>
.why-section {
  padding: 80px 24px;
  background: var(--background);
}

.section-container {
  max-width: 1280px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 900;
  color: var(--text);
  margin: 8px 0 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.feature-card {
  text-align: center;
  padding: 40px 24px;
  cursor: default;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.feature-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  background: rgba(184, 138, 68, 0.1);
  font-size: 24px;
  color: var(--primary);
  transition: all 0.4s ease;
}

.feature-card:hover .feature-icon-wrap {
  background: var(--primary);
  color: var(--surface);
  transform: scale(1.05);
}

.feature-title {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 6px;
}

.feature-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}
</style>
