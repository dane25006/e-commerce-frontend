<template>
  <div class="page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">{{ $t('contact.getInTouch') }}</span>
        <h1 class="hero-title">{{ $t('contact.contactUs') }}</h1>
        <p class="hero-count">{{ $t('contact.heroDesc') }}</p>
      </div>
    </section>

    <div class="contact-layout">
      <div class="contact-grid">

        <div class="info-col">
          <h2 class="info-heading">{{ $t('contact.infoHeading') }}</h2>
          <div class="info-list">
            <div v-for="info in contactInfo" :key="info.label" class="info-item">
              <div class="info-icon-wrap">
                <i :class="`ti ${info.icon}`" aria-hidden="true" />
              </div>
              <div>
                <h4 class="info-label">{{ info.label }}</h4>
                <p class="info-value">{{ info.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="form-col">
          <h2 class="form-heading">{{ $t('contact.sendMessage') }}</h2>
          <form @submit.prevent="handleSubmit" class="form">
            <div class="form-row">
              <div>
                <label class="form-label">{{ $t('contact.firstName') }}</label>
                <input id="contact-first-name" name="firstName" v-model="form.firstName" type="text" required class="input-field" />
              </div>
              <div>
                <label class="form-label">{{ $t('contact.lastName') }}</label>
                <input id="contact-last-name" name="lastName" v-model="form.lastName" type="text" required class="input-field" />
              </div>
            </div>
            <div>
              <label class="form-label">{{ $t('contact.email') }}</label>
              <input id="contact-email" name="email" v-model="form.email" type="email" required class="input-field" />
            </div>
            <div>
              <label class="form-label">{{ $t('contact.subject') }}</label>
              <input id="contact-subject" name="subject" v-model="form.subject" type="text" required class="input-field" />
            </div>
            <div>
              <label class="form-label">{{ $t('contact.message') }}</label>
              <textarea id="contact-message" name="message" v-model="form.message" rows="5" required class="input-field input-textarea"></textarea>
            </div>

            <Transition name="fade">
              <div v-if="submitted" class="success-msg">
                <i class="ti ti-circle-check" aria-hidden="true" />
                {{ $t('contact.successMessage') }}
              </div>
            </Transition>

            <button
              type="submit"
              :disabled="submitting"
              class="btn-primary"
            >
              <i v-if="submitting" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
              {{ submitting ? $t('contact.sending') : $t('contact.send') }}
            </button>
          </form>
        </div>

      </div>
    </div>

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'

const { t } = useI18n()
const contactInfo = computed(() => [
  { icon: 'ti-map-pin', label: t('contact.address'), value: t('contact.addressValue') },
  { icon: 'ti-phone', label: t('contact.phone'), value: t('contact.phoneValue') },
  { icon: 'ti-mail', label: t('contact.email'), value: t('contact.emailValue', { at: '@' }) },
  { icon: 'ti-clock', label: t('contact.hours'), value: t('contact.hoursValue') },
])

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
})

const submitting = ref(false)
const submitted = ref(false)

async function handleSubmit() {
  submitting.value = true
  await new Promise(r => setTimeout(r, 1000))
  submitting.value = false
  submitted.value = true
  form.firstName = ''
  form.lastName = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  setTimeout(() => { submitted.value = false }, 5000)
}

const searchOpen = ref(false)
const cartOpen = ref(false)
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #FAF8F5;
}
.hero-section {
  background: linear-gradient(135deg, #2B241E, #1A1614);
  padding: 80px 24px;
  text-align: center;
  position: relative;
}
.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
}
.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 16px;
  border-radius: 100px;
  background: rgba(184,138,68,0.12);
  color: var(--primary);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.hero-title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 800;
  color: var(--surface);
  margin: 0 0 12px;
  letter-spacing: 0.01em;
  line-height: 1.15;
}
.hero-count {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  margin: 0;
  font-weight: 400;
}

.contact-layout {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px;
}
.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}
@media (min-width: 1024px) {
  .contact-grid { grid-template-columns: 1fr 1fr; gap: 64px; }
}
.info-heading {
  font-size: 1.5rem;
  font-weight: 900;
  color: #222222;
  font-family: var(--font-heading);
  margin-bottom: 24px;
}
.info-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.info-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(184,138,68,0.1);
  font-size: 1.25rem;
  color: #B88A44;
}
.info-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #222222;
  margin-bottom: 4px;
}
.info-value {
  font-size: 0.875rem;
  color: #6F6F6F;
}
.form-heading {
  font-size: 1.5rem;
  font-weight: 900;
  color: #222222;
  font-family: var(--font-heading);
  margin-bottom: 24px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6F6F6F;
  margin-bottom: 6px;
}
.input-field {
  width: 100%;
  padding: 12px 16px;
  font-size: 0.875rem;
  border-radius: 18px;
  outline: none;
  background: #FFFFFF;
  border: 1px solid #E7E1D8;
  color: #222222;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.input-field:focus {
  border-color: #B88A44;
}
.input-textarea {
  resize: none;
}
.success-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  border-radius: 18px;
  padding: 12px 16px;
  background: rgba(184,138,68,0.1);
  color: #A7772F;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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
.btn-primary:disabled {
  opacity: 0.6;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
