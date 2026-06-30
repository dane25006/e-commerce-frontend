<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-inner">

        <!-- Left Content -->
        <div class="hero-content">
          <div class="fade-up">
            <span class="hero-badge">
              <i class="ti ti-sparkles" aria-hidden="true" />
              New Collection 2026
            </span>

            <h1 class="hero-title">
              Discover Your<br />
              <span class="hero-title-accent">Signature Scent</span>
            </h1>

            <p class="hero-description">
              Luxury fragrances crafted with the finest ingredients from around the world. Elevate every moment with our exclusive collection.
            </p>

            <div class="hero-actions">
              <RouterLink to="/products" class="btn-primary hero-btn-primary">
                Shop Now
                <i class="ti ti-arrow-right" aria-hidden="true" />
              </RouterLink>

              <RouterLink to="/products?sort=newest" class="hero-btn-secondary">
                <span class="hero-btn-circle">
                  <i class="ti ti-eye" aria-hidden="true" />
                </span>
                Explore Collection
              </RouterLink>
            </div>

            <!-- Trust badges -->
            <div class="hero-badges">
              <div v-for="badge in badges" :key="badge.label" class="hero-badge-item">
                <div class="hero-badge-icon">
                  <i :class="badge.icon" aria-hidden="true" />
                </div>
                <span class="hero-badge-label">{{ badge.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Image -->
        <div class="hero-visual">
          <div class="hero-image-wrapper fade-up" style="animation-delay: 0.2s;">
            <div class="hero-image-glow" />

            <div class="hero-image-frame">
              <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80"
                alt="Luxury perfume collection"
                class="hero-image"
                loading="eager"
              />

              <!-- Glass overlay -->
              <div class="hero-image-overlay" />

              <!-- Rating badge -->
              <div class="hero-rating-badge fade-up" style="animation-delay: 0.5s;">
                <div class="hero-rating-icon">
                  <i class="ti ti-star-filled" aria-hidden="true" />
                </div>
                <div>
                  <p class="hero-rating-value">4.9/5</p>
                  <p class="hero-rating-reviews">2k+ reviews</p>
                </div>
              </div>

              <!-- Shipping badge -->
              <div class="hero-shipping-badge fade-up" style="animation-delay: 0.7s;">
                <i class="ti ti-truck" aria-hidden="true" />
                <div>
                  <p class="hero-shipping-title">Free Shipping</p>
                  <p class="hero-shipping-sub">On orders $100+</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const badges = [
  { icon: 'ti ti-award', label: 'Premium Quality' },
  { icon: 'ti ti-leaf', label: 'Authentic Products' },
  { icon: 'ti ti-truck', label: 'Free Shipping' },
]
</script>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 600px;
  background: linear-gradient(135deg, var(--background) 0%, #F5F0EB 50%, var(--surface) 100%);
}

.hero-container {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .hero-container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 1024px) {
  .hero-container {
    padding: 0 2rem;
  }
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 600px;
  gap: 2.5rem;
  padding: 4rem 0;
}

@media (min-width: 1024px) {
  .hero-inner {
    flex-direction: row;
    gap: 4rem;
    padding: 0;
  }
}

/* ---------- Left Content ---------- */
.hero-content {
  width: 100%;
  text-align: center;
}

@media (min-width: 1024px) {
  .hero-content {
    width: 50%;
    text-align: left;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
  background: rgba(184, 138, 68, 0.1);
  color: var(--primary);
}

.hero-title {
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  color: var(--text);
  font-family: 'Playfair Display', serif;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.75rem;
  }
}

@media (min-width: 1280px) {
  .hero-title {
    font-size: 4.5rem;
  }
}

.hero-title-accent {
  color: var(--primary);
}

.hero-description {
  font-size: 1rem;
  line-height: 1.75;
  margin-bottom: 2rem;
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
  color: var(--text-muted);
  font-family: 'Inter', sans-serif;
  font-weight: 300;
}

@media (min-width: 1024px) {
  .hero-description {
    margin-left: 0;
    margin-right: 0;
  }
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

@media (min-width: 1024px) {
  .hero-actions {
    justify-content: flex-start;
  }
}

.hero-btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius);
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(184, 138, 68, 0.35);
}

.hero-btn-primary:hover {
  background: var(--primary-hover);
  box-shadow: 0 6px 28px rgba(184, 138, 68, 0.45);
  transform: translateY(-1px);
}

.hero-btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
}

.hero-btn-secondary:hover {
  color: var(--primary);
}

.hero-btn-circle {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border);
  transition: all 0.3s ease;
}

.hero-btn-secondary:hover .hero-btn-circle {
  border-color: var(--primary);
  background: rgba(184, 138, 68, 0.08);
}

.hero-btn-circle i {
  font-size: 0.875rem;
  color: var(--primary);
  transition: color 0.3s ease;
}

/* ---------- Trust Badges ---------- */
.hero-badges {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (min-width: 1024px) {
  .hero-badges {
    justify-content: flex-start;
  }
}

.hero-badge-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.hero-badge-icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(184, 138, 68, 0.1);
}

.hero-badge-icon i {
  font-size: 0.875rem;
  color: var(--primary);
}

.hero-badge-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
}

/* ---------- Right Visual ---------- */
.hero-visual {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

@media (min-width: 1024px) {
  .hero-visual {
    width: 50%;
    padding: 0;
  }
}

.hero-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 32rem;
}

.hero-image-glow {
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  background: radial-gradient(circle, rgba(184, 138, 68, 0.1), transparent 70%);
  transform: scale(1.05);
  pointer-events: none;
}

.hero-image-frame {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 0 8px 40px rgba(184, 138, 68, 0.1);
  animation: float 6s ease-in-out infinite;
}

.hero-image {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4/5;
  max-height: 540px;
  object-fit: cover;
}

.hero-image-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(184, 138, 68, 0.05) 60%, rgba(255,255,255,0.06) 100%);
}

/* ---------- Badge Overlays ---------- */
.hero-rating-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(184, 138, 68, 0.06);
}

.hero-rating-icon {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(184, 138, 68, 0.1);
  margin-bottom: 0.25rem;
}

.hero-rating-icon i {
  font-size: 0.875rem;
  color: var(--primary);
}

.hero-rating-value {
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--text);
  line-height: 1.2;
}

.hero-rating-reviews {
  font-size: 0.5625rem;
  color: var(--text-muted);
  line-height: 1.2;
}

.hero-shipping-badge {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.625rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 12px rgba(184, 138, 68, 0.06);
}

.hero-shipping-badge i {
  font-size: 0.875rem;
  color: var(--primary);
}

.hero-shipping-title {
  font-size: 0.5625rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}

.hero-shipping-sub {
  font-size: 0.5rem;
  color: var(--text-muted);
  line-height: 1.2;
}

/* ---------- Animations ---------- */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.fade-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.8s ease forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
