<template>
  <section class="testimonials-section">
    <div class="section-container">
      <div class="section-header">
        <span class="section-label">{{ $t('testimonials.label') }}</span>
        <h2 class="section-title">{{ $t('testimonials.title') }}</h2>
      </div>

      <div class="testimonials-grid">
        <div
          v-for="t in testimonials"
          :key="t.name"
          class="card testimonial-card"
        >
          <div class="stars">
            <i v-for="n in 5" :key="n" class="ti ti-star-filled star" aria-hidden="true" />
          </div>

          <p class="testimonial-text">"{{ t.text }}"</p>

          <div class="testimonial-author">
            <div class="avatar">{{ t.name.charAt(0) }}</div>
            <div>
              <p class="author-name">{{ t.name }}</p>
              <p class="author-title">{{ t.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const testimonials = [
  { name: t('testimonials.author1'), title: t('testimonials.verifiedBuyer'), text: t('testimonials.quote1') },
  { name: t('testimonials.author2'), title: t('testimonials.verifiedBuyer'), text: t('testimonials.quote2') },
  { name: t('testimonials.author3'), title: t('testimonials.verifiedBuyer'), text: t('testimonials.quote3') },
]
</script>

<style scoped>
.testimonials-section {
  padding: 80px 24px;
  background: var(--surface);
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
  font-family: var(--font-heading);
  font-size: 36px;
  font-weight: 900;
  color: var(--text);
  margin: 8px 0 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.testimonial-card {
  padding: 36px 28px;
}

.stars {
  display: flex;
  gap: 2px;
  margin-bottom: 16px;
}

.star {
  font-size: 14px;
  color: var(--primary);
}

.testimonial-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-muted);
  margin: 0 0 20px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: var(--surface);
  background: linear-gradient(135deg, var(--primary), #C49A5A);
  flex-shrink: 0;
}

.author-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 2px;
}

.author-title {
  font-size: 12px;
  color: var(--primary);
  margin: 0;
}
</style>
