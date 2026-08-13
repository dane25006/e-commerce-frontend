<template>
  <div class="profile-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">{{ $t('profile.account') }}</span>
        <h1 class="hero-title">{{ $t('profile.myProfile') }}</h1>
      </div>
    </section>

    <div class="page-body">
      <!-- Profile Card & Header -->
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-wrapper" @click="triggerFileSelect" :title="$t('profile.changeAvatar')">
            <div class="avatar">
              <img
                v-if="effectiveAvatar && !headerAvatarErr"
                :src="effectiveAvatar"
                referrerpolicy="no-referrer"
                class="avatar-img"
                @error="headerAvatarErr = true"
                alt="Profile Avatar"
              />
              <span v-else class="avatar-initials">{{ initials }}</span>
            </div>
            <div class="avatar-overlay">
              <i class="ti ti-camera" aria-hidden="true" />
            </div>
          </div>

          <div class="profile-meta">
            <h2 class="profile-name">{{ auth.userName }}</h2>
            <p class="profile-email">{{ auth.user?.email }}</p>
            <div class="badges-row">
              <span class="badge-gold profile-role">
                <i class="ti ti-award" aria-hidden="true" />
                {{ auth.user?.role }}
              </span>
              <span v-if="isGoogleUser" class="badge-google">
                <svg class="google-badge-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                {{ $t('profile.connectedWithGoogle') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Google Account Status Banner -->
        <div v-if="isGoogleUser" class="google-status-banner">
          <div class="google-status-left">
            <div class="google-icon-circle">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div>
              <p class="google-status-title">{{ $t('profile.googleAccount') }}</p>
              <p class="google-status-desc">{{ $t('profile.googleConnectedDesc') }}</p>
            </div>
          </div>
        </div>

        <div v-else class="google-connect-banner">
          <div class="google-status-left">
            <div class="google-icon-circle">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <div>
              <p class="google-status-title">{{ $t('profile.notLinkedWithGoogle') }}</p>
              <p class="google-status-desc">{{ $t('profile.linkGoogleDesc') }}</p>
            </div>
          </div>
          <a :href="googleUrl" class="btn-google-link">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            {{ $t('profile.linkGoogle') }}
          </a>
        </div>

        <!-- Profile Form -->
        <div class="profile-section">
          <h3 class="section-label-title">
            <i class="ti ti-user" aria-hidden="true" />
            {{ $t('profile.profileInfo') }}
          </h3>

          <form @submit.prevent="handleUpdateProfile" class="profile-form">
            <div class="form-group">
              <label class="form-label">{{ $t('profile.fullName') }}</label>
              <div class="input-icon-wrap">
                <i class="ti ti-user input-icon" aria-hidden="true" />
                <input id="profile-name" name="name" v-model="profileForm.name" type="text" required class="input-field has-icon" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t('profile.emailAddress') }}</label>
              <div class="input-icon-wrap">
                <i class="ti ti-mail input-icon" aria-hidden="true" />
                <input id="profile-email" name="email" v-model="profileForm.email" type="email" required class="input-field has-icon" />
              </div>
            </div>

            <!-- Avatar Field -->
            <div class="form-group">
              <label class="form-label">{{ $t('profile.avatarUrl') }}</label>
              
              <!-- Hidden File Input -->
              <input
                ref="fileInput"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                class="hidden"
                style="display: none;"
                @change="handleFileChange"
              />

              <div class="avatar-input-controls">
                <button
                  type="button"
                  @click="triggerFileSelect"
                  class="btn-upload-avatar"
                >
                  <i class="ti ti-upload" aria-hidden="true" />
                  {{ selectedFile ? selectedFile.name : $t('profile.uploadPhoto') }}
                </button>

                <button
                  v-if="selectedFile || profileForm.avatar"
                  type="button"
                  @click="clearAvatar"
                  class="btn-remove-avatar"
                  :title="$t('profile.removeAvatar')"
                >
                  <i class="ti ti-trash" aria-hidden="true" />
                  {{ $t('profile.removeAvatar') }}
                </button>
              </div>

              <div class="input-icon-wrap mt-2">
                <i class="ti ti-link input-icon" aria-hidden="true" />
                <input
                  id="profile-avatar"
                  name="avatar"
                  v-model="profileForm.avatar"
                  type="url"
                  :placeholder="$t('profile.avatarPlaceholder')"
                  class="input-field has-icon"
                  @input="handleUrlInput"
                />
              </div>

              <!-- Preview thumbnail -->
              <div v-if="effectiveAvatar" class="avatar-preview-container">
                <img
                  :src="effectiveAvatar"
                  referrerpolicy="no-referrer"
                  class="avatar-preview"
                  :alt="$t('profile.avatarPreview')"
                  @error="previewError = true"
                />
                <span class="preview-text">{{ $t('profile.avatarPreview') }}</span>
              </div>
            </div>

            <Transition name="fade">
              <div v-if="profileSuccess" class="msg-banner success">
                <i class="ti ti-circle-check" aria-hidden="true" />
                {{ $t('profile.updatedSuccess') }}
              </div>
              <div v-else-if="profileError" class="msg-banner error">
                <i class="ti ti-alert-circle" aria-hidden="true" />
                {{ profileError }}
              </div>
            </Transition>

            <button type="submit" :disabled="savingProfile" class="btn-primary save-btn">
              <i v-if="savingProfile" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
              {{ savingProfile ? $t('profile.saving') : $t('profile.saveChanges') }}
            </button>
          </form>
        </div>
      </div>

      <!-- Password Card -->
      <div class="profile-card">
        <h3 class="section-label-title">
          <i class="ti ti-lock" aria-hidden="true" />
          {{ isGoogleUser ? $t('profile.setPasswordForGoogle') : $t('profile.changePassword') }}
        </h3>

        <div v-if="isGoogleUser" class="google-pw-notice">
          <i class="ti ti-info-circle" aria-hidden="true" />
          <p>{{ $t('profile.setPasswordForGoogleDesc') }}</p>
        </div>

        <form @submit.prevent="handleChangePassword" class="profile-form">
          <!-- Current Password (only required for non-Google accounts) -->
          <div v-if="!isGoogleUser" class="form-group">
            <label class="form-label">{{ $t('profile.currentPassword') }}</label>
            <div class="input-icon-wrap">
              <i class="ti ti-lock input-icon" aria-hidden="true" />
              <input
                id="profile-current-password"
                name="current_password"
                v-model="passwordForm.current_password"
                :type="showCurrentPw ? 'text' : 'password'"
                required
                class="input-field has-icon"
              />
              <button
                type="button"
                @click="showCurrentPw = !showCurrentPw"
                class="toggle-pw"
                :aria-label="showCurrentPw ? $t('profile.hide') : $t('profile.show')"
              >
                <i :class="showCurrentPw ? 'ti ti-eye-off' : 'ti ti-eye'" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ isGoogleUser ? $t('profile.newPassword') : $t('profile.newPassword') }}</label>
            <div class="input-icon-wrap">
              <i class="ti ti-lock-check input-icon" aria-hidden="true" />
              <input
                id="profile-new-password"
                name="password"
                v-model="passwordForm.password"
                :type="showNewPw ? 'text' : 'password'"
                required
                minlength="8"
                class="input-field has-icon"
              />
              <button
                type="button"
                @click="showNewPw = !showNewPw"
                class="toggle-pw"
                :aria-label="showNewPw ? $t('profile.hide') : $t('profile.show')"
              >
                <i :class="showNewPw ? 'ti ti-eye-off' : 'ti ti-eye'" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ $t('profile.confirmNewPassword') }}</label>
            <div class="input-icon-wrap">
              <i class="ti ti-lock input-icon" aria-hidden="true" />
              <input
                id="profile-confirm-password"
                name="password_confirmation"
                v-model="passwordForm.password_confirmation"
                :type="showNewPw ? 'text' : 'password'"
                required
                class="input-field has-icon"
              />
            </div>
            <p v-if="pwMismatch" class="pw-hint">{{ $t('profile.passwordMismatch') }}</p>
          </div>

          <Transition name="fade">
            <div v-if="passwordSuccess" class="msg-banner success">
              <i class="ti ti-circle-check" aria-hidden="true" />
              {{ $t('profile.passwordChanged') }}
            </div>
            <div v-else-if="passwordError" class="msg-banner error">
              <i class="ti ti-alert-circle" aria-hidden="true" />
              {{ passwordError }}
            </div>
          </Transition>

          <button
            type="submit"
            :disabled="savingPassword || pwMismatch || !passwordForm.password"
            class="btn-primary save-btn"
          >
            <i v-if="savingPassword" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
            {{ savingPassword ? $t('profile.updating') : (isGoogleUser ? $t('profile.createNewPassword') : $t('profile.updatePassword')) }}
          </button>
        </form>
      </div>

      <!-- Quick Links -->
      <div class="quick-links">
        <RouterLink v-for="link in quickLinks" :key="link.to" :to="link.to" class="quick-link-card">
          <div class="quick-link-icon">
            <i :class="`ti ${link.icon}`" aria-hidden="true" />
          </div>
          <p class="quick-link-label">{{ link.label }}</p>
        </RouterLink>
      </div>

      <!-- Sign Out Card -->
      <div class="signout-card">
        <h3 class="section-label-title">
          <i class="ti ti-logout" aria-hidden="true" />
          {{ $t('profile.accountActions') }}
        </h3>
        <p class="signout-desc">{{ $t('profile.signOutDesc') }}</p>
        <button @click="confirmModal?.open()" class="btn-cancel signout-btn">
          <i class="ti ti-logout" aria-hidden="true" />
          {{ $t('profile.signOut') }}
        </button>
      </div>
    </div>

    <ConfirmModal
      ref="confirmModal"
      :title="$t('profile.signOutTitle')"
      :message="$t('profile.signOutConfirm')"
      :confirm-text="$t('profile.signOut')"
      :cancel-text="$t('profile.cancel')"
      @confirm="auth.logout()"
    />

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import config from '@/config/app'
import type { ChangePasswordPayload } from '@/types/auth'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import { imageUrl } from '@/utils/image'

const auth = useAuthStore()
const searchOpen = ref(false)
const cartOpen = ref(false)
const confirmModal = ref<InstanceType<typeof ConfirmModal> | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const filePreviewUrl = ref<string | null>(null)
const headerAvatarErr = ref(false)
const previewError = ref(false)

const savingProfile = ref(false)
const profileSuccess = ref(false)
const profileError = ref('')
const savingPassword = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')
const showCurrentPw = ref(false)
const showNewPw = ref(false)

const googleUrl = `${config.apiUrl}/auth/google/redirect`

const profileForm = reactive({
  name: '',
  email: '',
  avatar: '',
})

const passwordForm = reactive<ChangePasswordPayload>({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const isGoogleUser = computed(() => Boolean(auth.user?.google_id || auth.user?.is_google_user))

const initials = computed(() =>
  auth.userName
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U'
)

const effectiveAvatar = computed(() => {
  if (filePreviewUrl.value) return filePreviewUrl.value
  if (profileForm.avatar.trim()) return imageUrl(profileForm.avatar.trim())
  return auth.user?.avatar ? imageUrl(auth.user.avatar) : null
})

const pwMismatch = computed(() =>
  passwordForm.password_confirmation.length > 0 &&
  passwordForm.password !== passwordForm.password_confirmation
)

const { t } = useI18n()

const quickLinks = computed(() => [
  { to: '/orders', icon: 'ti-package', label: t('profile.myOrders') },
  { to: '/wishlist', icon: 'ti-heart', label: t('profile.wishlist') },
  { to: '/cart', icon: 'ti-shopping-bag', label: t('profile.cart') },
  { to: '/products', icon: 'ti-sparkles', label: t('profile.shop') },
])

function triggerFileSelect() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    filePreviewUrl.value = URL.createObjectURL(file)
    headerAvatarErr.value = false
    previewError.value = false
  }
}

function handleUrlInput() {
  selectedFile.value = null
  filePreviewUrl.value = null
  headerAvatarErr.value = false
  previewError.value = false
}

function clearAvatar() {
  selectedFile.value = null
  filePreviewUrl.value = null
  profileForm.avatar = ''
  if (fileInput.value) fileInput.value.value = ''
}

async function handleUpdateProfile() {
  savingProfile.value = true
  profileSuccess.value = false
  profileError.value = ''

  try {
    const avatarPayload = selectedFile.value || (profileForm.avatar.trim() ? profileForm.avatar.trim() : null)
    await auth.updateProfile(profileForm.name, profileForm.email, avatarPayload)
    profileSuccess.value = true
    selectedFile.value = null
    filePreviewUrl.value = null
    headerAvatarErr.value = false
    setTimeout(() => { profileSuccess.value = false }, 3500)
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    profileError.value = e.response?.data?.message ?? t('profile.errorUpdate')
  } finally {
    savingProfile.value = false
  }
}

async function handleChangePassword() {
  if (pwMismatch.value) return
  if (!passwordForm.password || passwordForm.password.length < 8) return
  if (!isGoogleUser.value && !passwordForm.current_password) return

  savingPassword.value = true
  passwordError.value = ''
  passwordSuccess.value = false

  try {
    await auth.changePassword({
      current_password: passwordForm.current_password || undefined,
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation,
    })
    passwordSuccess.value = true
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
    setTimeout(() => { passwordSuccess.value = false }, 3500)
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    passwordError.value = e.response?.data?.message ?? t('profile.errorPassword')
  } finally {
    savingPassword.value = false
  }
}

// Keep form in sync reactively whenever auth.user loads or updates
watch(
  () => auth.user,
  (user) => {
    if (user) {
      profileForm.name = user.name || ''
      profileForm.email = user.email || ''
      profileForm.avatar = user.avatar || ''
      headerAvatarErr.value = false
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--background);
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
  background: rgba(184, 138, 68, 0.12);
  color: var(--primary);
  font-size: 0.625rem;
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

.page-body {
  max-width: 896px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.profile-card {
  padding: 28px 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.35s ease;
}

.profile-card:hover {
  box-shadow: var(--shadow);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  box-shadow: 0 4px 16px rgba(184, 138, 68, 0.3);
  border: 3px solid rgba(184, 138, 68, 0.25);
  overflow: hidden;
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  font-family: var(--font-heading);
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.125rem;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.profile-meta {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--text);
  font-family: var(--font-heading);
  margin-bottom: 2px;
}

.profile-email {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.badges-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.profile-role {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-google {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 100px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.google-badge-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Google Status Banner */
.google-status-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(66, 133, 244, 0.05), rgba(52, 168, 83, 0.05));
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
  margin-bottom: 24px;
}

.google-connect-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fdfbf7;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 16px 20px;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.google-status-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.google-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.google-status-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.google-status-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 2px 0 0;
}

.btn-google-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 100px;
  padding: 8px 16px;
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.btn-google-link:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.google-pw-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(184, 138, 68, 0.08);
  border: 1px solid rgba(184, 138, 68, 0.2);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  margin-bottom: 18px;
  color: var(--secondary);
  font-size: 0.8125rem;
  line-height: 1.45;
}

.google-pw-notice i {
  color: var(--primary);
  font-size: 1rem;
  margin-top: 1px;
  flex-shrink: 0;
}

.google-pw-notice p {
  margin: 0;
}

.section-label-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-label-title i {
  color: var(--primary);
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 480px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.input-icon-wrap {
  position: relative;
}

.input-icon-wrap .has-icon {
  padding-left: 40px;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.875rem;
  color: var(--primary);
  pointer-events: none;
}

.toggle-pw {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
  line-height: 1.4;
}

.toggle-pw:hover {
  color: var(--text);
}

.pw-hint {
  font-size: 0.75rem;
  margin-top: 4px;
  color: var(--primary);
}

.avatar-input-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-upload-avatar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(184, 138, 68, 0.1);
  color: var(--primary);
  border: 1px dashed var(--primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-upload-avatar:hover {
  background: var(--primary);
  color: #fff;
}

.btn-remove-avatar {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: transparent;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove-avatar:hover {
  background: #fef2f2;
  border-color: #ef4444;
}

.avatar-preview-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.avatar-preview {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.preview-text {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.msg-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.msg-banner.success {
  background: rgba(46, 139, 87, 0.08);
  color: var(--success);
}

.msg-banner.error {
  background: rgba(184, 138, 68, 0.08);
  color: var(--primary);
}

.save-btn {
  align-self: flex-start;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.quick-link-card {
  padding: 24px 16px;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  text-decoration: none;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: var(--shadow-sm);
}

.quick-link-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: rgba(184, 138, 68, 0.2);
}

.quick-link-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  background: rgba(184, 138, 68, 0.08);
  transition: all 0.3s ease;
}

.quick-link-card:hover .quick-link-icon {
  background: var(--primary);
}

.quick-link-card:hover .quick-link-icon i {
  color: #fff;
}

.quick-link-icon i {
  font-size: 1.25rem;
  color: var(--primary);
  transition: color 0.3s ease;
}

.quick-link-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.2s;
}

.quick-link-card:hover .quick-link-label {
  color: var(--primary);
}

.signout-card {
  padding: 28px 32px;
  background: var(--surface);
  border: 1px solid rgba(184, 138, 68, 0.15);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.35s ease;
}

.signout-card:hover {
  box-shadow: var(--shadow);
}

.signout-desc {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.signout-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .quick-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .profile-card,
  .signout-card {
    padding: 20px;
  }

  .profile-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .page-body {
    gap: 20px;
  }

  .google-status-banner,
  .google-connect-banner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
