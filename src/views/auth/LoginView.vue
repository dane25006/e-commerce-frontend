<template>
  <div class="split-layout" :style="{ background: 'var(--background)' }">
    <!-- Left: Form -->
    <div class="form-panel">
      <div class="form-container">
        <!-- Close / Back -->
        <RouterLink to="/" class="back-link" :style="{ color: 'var(--primary)' }">
          <i class="ti ti-arrow-left text-sm" aria-hidden="true" />
          {{ $t('auth.backToHome') }}
        </RouterLink>

        <div class="form-card">
          <div class="form-header">
            <h1 class="form-title" :style="{ fontFamily: '\'Playfair Display\', serif', color: 'var(--text)' }">{{ $t('auth.welcomeBack') }}</h1>
            <div class="gold-accent" :style="{ background: 'var(--primary)' }" />
            <p class="form-subtitle" :style="{ color: 'var(--text-muted)' }">{{ $t('auth.signInSubtitle') }}</p>
          </div>

          <!-- API Error -->
          <Transition name="fade">
            <div
              v-if="auth.error"
              class="api-error"
              :style="{
                background: 'rgba(184,138,68,0.08)',
                color: '#8E6F3E',
                border: '1px solid rgba(184,138,68,0.2)',
                borderRadius: 'var(--radius-sm)',
              }"
            >
              <i class="ti ti-alert-circle mt-0.5 flex-shrink-0 text-base" aria-hidden="true" />
              <span>{{ auth.error }}</span>
            </div>
          </Transition>

          <form @submit.prevent="handleSubmit" novalidate class="auth-form">
            <!-- Email -->
            <div class="field-group">
                <label for="email" class="field-inline-label" :style="{ color: 'var(--text-muted)' }">{{ $t('auth.emailLabel') }}</label>
              <div
                class="field-box"
                :class="{ 'field-box-error': errors.email }"
                :style="{
                  borderRadius: 'var(--radius-sm)',
                  border: errors.email ? '1px solid #E53935' : '1px solid var(--border)',
                  background: errors.email ? '#FFF5F5' : 'var(--surface)',
                }"
              >
                <input
                  id="email"
                  v-model.trim="form.email"
                  type="email"
                  autocomplete="email"
                  placeholder=" "
                  class="field-input"
                  :style="{ color: 'var(--text)' }"
                  @blur="validateField('email')"
                />
                <label for="email" class="field-label" :style="{ color: errors.email ? '#E53935' : 'var(--text-muted)' }">{{ $t('auth.emailLabel') }}</label>
              </div>
              <Transition name="fade">
                <p v-if="errors.email" class="field-msg-error">{{ errors.email }}</p>
              </Transition>
            </div>

            <!-- Password -->
            <div class="field-group">
              <div class="flex items-center justify-between mb-1.5 px-1">
                <label for="password" class="field-inline-label" :style="{ color: 'var(--text-muted)' }">{{ $t('auth.passwordLabel') }}</label>
                <a href="#" class="forgot-link" :style="{ color: 'var(--primary)' }">{{ $t('auth.forgot') }}</a>
              </div>
              <div
                class="field-box"
                :class="{ 'field-box-error': errors.password }"
                :style="{
                  borderRadius: 'var(--radius-sm)',
                  border: errors.password ? '1px solid #E53935' : '1px solid var(--border)',
                  background: errors.password ? '#FFF5F5' : 'var(--surface)',
                }"
              >
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPw ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder=" "
                  class="field-input"
                  :style="{ color: 'var(--text)', paddingRight: '44px' }"
                  @blur="validateField('password')"
                />
                <label for="password" class="field-label" :style="{ color: errors.password ? '#E53935' : 'var(--text-muted)' }">{{ $t('auth.enterPassword') }}</label>
                <button
                  type="button"
                  class="pw-toggle"
                  :style="{ color: 'var(--primary)' }"
                  @click="showPw = !showPw"
                >
                  <i :class="showPw ? 'ti ti-eye-off' : 'ti ti-eye'" class="text-lg" aria-hidden="true" />
                </button>
              </div>
              <Transition name="fade">
                <p v-if="errors.password" class="field-msg-error">{{ errors.password }}</p>
              </Transition>
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="auth.loading"
              class="submit-btn"
              :style="{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                borderRadius: 'var(--radius-sm)',
                boxShadow: '0 4px 16px rgba(184,138,68,0.3)',
              }"
            >
              <i v-if="auth.loading" class="ti ti-loader-2 animate-spin text-base" aria-hidden="true" />
              <span>{{ auth.loading ? $t('auth.signingIn') : $t('auth.signIn') }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <div class="divider-line" :style="{ background: 'var(--border)' }" />
            <span class="divider-text" :style="{ color: 'var(--text-muted)' }">{{ $t('auth.orContinueWith') }}</span>
            <div class="divider-line" :style="{ background: 'var(--border)' }" />
          </div>

          <!-- Google Login -->
          <GoogleButton :url="googleUrl" />

          <!-- Switch to Register -->
          <p class="switch-text" :style="{ color: 'var(--text-muted)' }">
            {{ $t('auth.dontHaveAccount') }}
            <RouterLink to="/register" class="switch-link" :style="{ color: 'var(--primary)' }">
              {{ $t('auth.createOne') }}
            </RouterLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Right: Branding -->
    <div class="brand-panel">
      <div class="brand-overlay" :style="{ background: 'linear-gradient(135deg, #2C2C2C, #1A1A1A)' }">
        <img
          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=900&q=85"
          :alt="$t('auth.altPerfume')"
          class="brand-image"
        />
      </div>
      <div class="brand-gradient" :style="{ background: 'linear-gradient(45deg, rgba(44,44,44,0.6), transparent, rgba(184,138,68,0.15))' }" />
      <div class="brand-content">
        <div class="brand-card">
          <div class="brand-icon-wrapper">
            <i class="ti ti-sparkles text-white text-xl" aria-hidden="true" />
          </div>
          <h3 class="brand-title" :style="{ fontFamily: '\'Playfair Display\', serif' }">{{ $t('auth.discoverSignature') }}</h3>
          <p class="brand-description">{{ $t('auth.discoverDesc') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import config from '@/config/app'
import GoogleButton from '@/components/GoogleButton.vue'

const { t } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const showPw = ref(false)
const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })

const googleUrl = `${config.apiUrl}/auth/google/redirect`

function validateField(field: 'email' | 'password') {
  if (field === 'email') {
    if (!form.email) errors.email = t('auth.validationEmailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = t('auth.validationEmailInvalid')
    else errors.email = ''
  }
  if (field === 'password') {
    if (!form.password) errors.password = t('auth.validationPasswordRequired')
    else if (form.password.length < 8) errors.password = t('auth.validationPasswordMin')
    else errors.password = ''
  }
}

function validateAll(): boolean {
  validateField('email')
  validateField('password')
  return !errors.email && !errors.password
}

async function handleSubmit() {
  if (!validateAll()) return
  try {
    await auth.login({ email: form.email, password: form.password })
  } catch {
    /* error set in store */
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') goHome()
}

function goHome() {
  router.push('/')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.body.style.overflow = ''

  const errorParam = new URLSearchParams(window.location.search).get('error')
  if (errorParam) {
    auth.error = decodeURIComponent(errorParam)
  }

  const redirectParam = new URLSearchParams(window.location.search).get('redirect')
  if (redirectParam) {
    sessionStorage.setItem('scentique_redirect', redirectParam)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.split-layout {
  min-height: 100vh;
  display: flex;
}

/* Left Panel */
.form-panel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

@media (min-width: 1024px) {
  .form-panel {
    width: 50%;
  }
}

.form-container {
  width: 100%;
  max-width: 420px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  margin-bottom: 36px;
  transition: opacity 0.2s;
  text-decoration: none;
}
.back-link:hover {
  opacity: 0.7;
}

.form-card {
  padding: 40px 36px;
  border-radius: var(--radius);
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.9);
  box-shadow: 0 8px 48px rgba(0,0,0,0.06);
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 4px;
}

.gold-accent {
  width: 36px;
  height: 3px;
  margin-top: 10px;
  margin-bottom: 12px;
}

.form-subtitle {
  font-size: 14px;
}

/* API Error */
.api-error {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  padding: 12px 16px;
  margin-bottom: 24px;
}

/* Form Fields */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field-group {
  width: 100%;
}

.field-inline-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.forgot-link {
  font-size: 12px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.forgot-link:hover {
  opacity: 0.7;
  text-decoration: underline;
}

.field-box {
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.field-box:focus-within {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(184, 138, 68, 0.12);
  background: var(--surface);
}

.field-box.field-box-error:focus-within {
  border-color: #E53935 !important;
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
}

.field-input {
  width: 100%;
  padding: 22px 14px 6px;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  line-height: 1.5;
  font-family: inherit;
}

.field-input::placeholder {
  color: transparent;
}

.field-label {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: left center;
  font-weight: 400;
}

.field-input:focus ~ .field-label,
.field-input:not(:placeholder-shown) ~ .field-label {
  top: 10px;
  transform: translateY(0);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.field-input:focus ~ .field-label {
  color: var(--primary) !important;
}

.field-box-error .field-input:focus ~ .field-label {
  color: #E53935 !important;
}

.pw-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: opacity 0.2s;
}
.pw-toggle:hover {
  opacity: 0.7;
}

.field-msg-error {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 500;
  padding-left: 4px;
  color: #E53935;
}

/* Submit */
.submit-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  padding: 14px 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(184,138,68,0.35) !important;
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 28px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
}

.divider-text {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}



/* Switch */
.switch-text {
  text-align: center;
  font-size: 13px;
  margin-top: 32px;
}

.switch-link {
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}
.switch-link:hover {
  opacity: 0.7;
  text-decoration: underline;
}

/* Right Panel */
.brand-panel {
  display: none;
  position: relative;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .brand-panel {
    display: block;
    width: 50%;
  }
}

.brand-overlay {
  position: absolute;
  inset: 0;
}

.brand-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.65;
  mix-blend-mode: overlay;
}

.brand-gradient {
  position: absolute;
  inset: 0;
}

.brand-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 48px;
}

.brand-card {
  padding: 40px 36px;
  border-radius: var(--radius);
  max-width: 340px;
  backdrop-filter: blur(16px);
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
}

.brand-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
}

.brand-title {
  font-size: 22px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 10px;
  line-height: 1.3;
}

.brand-description {
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  line-height: 1.7;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
