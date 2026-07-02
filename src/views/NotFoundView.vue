<template>
  <div class="page">
    <div class="container">
      <div class="error-code">{{ $t('notFound.code') }}</div>
      <h1 class="error-title">{{ $t('notFound.title') }}</h1>
      <p class="error-desc">
        {{ $t('notFound.description') }}
      </p>
      <div class="error-actions">
        <RouterLink to="/" class="btn-primary">{{ $t('notFound.goHome') }}</RouterLink>
        <RouterLink to="/products" class="btn-secondary">{{ $t('notFound.browseShop') }}</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: #FAF8F5;
}
.container {
  text-align: center;
  max-width: 28rem;
}
.error-code {
  font-size: 7.5rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 16px;
  font-family: var(--font-heading);
  background: linear-gradient(135deg, #B88A44, #C9A96E);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.error-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #222222;
  font-family: var(--font-heading);
  margin-bottom: 12px;
}
.error-desc {
  font-size: 0.875rem;
  color: #6F6F6F;
  margin-bottom: 32px;
}
.error-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 18px;
  background: #B88A44;
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #A7772F;
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 18px;
  background: transparent;
  color: #B88A44;
  border: 1px solid #B88A44;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.btn-secondary:hover {
  background: #B88A44;
  color: #FFFFFF;
}
</style>
