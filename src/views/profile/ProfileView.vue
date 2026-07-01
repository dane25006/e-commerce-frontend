<template>
  <div class="profile-page">
    <AnnouncementBar />
    <AppNavbar @open-search="searchOpen = true" @open-cart="cartOpen = true" />

    <section class="hero-section">
      <div class="hero-bg">
        <span class="hero-label">Account</span>
        <h1 class="hero-title">My Profile</h1>
      </div>
    </section>

    <div class="page-body">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar">{{ initials }}</div>
          <div>
            <h2 class="profile-name">{{ auth.userName }}</h2>
            <p class="profile-email">{{ auth.user?.email }}</p>
            <span class="badge-gold profile-role">
              <i class="ti ti-award" aria-hidden="true" />
              {{ auth.user?.role }}
            </span>
          </div>
        </div>

        <div class="profile-section">
          <h3 class="section-label-title">
            <i class="ti ti-user" aria-hidden="true" />
            Profile Information
          </h3>
          <form @submit.prevent="handleUpdateProfile" class="profile-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <div class="input-icon-wrap">
                <i class="ti ti-user input-icon" aria-hidden="true" />
                <input id="profile-name" name="name" v-model="profileForm.name" type="text" required class="input-field has-icon" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <div class="input-icon-wrap">
                <i class="ti ti-mail input-icon" aria-hidden="true" />
                <input id="profile-email" name="email" v-model="profileForm.email" type="email" required class="input-field has-icon" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Avatar URL</label>
              <div class="input-icon-wrap">
                <i class="ti ti-photo input-icon" aria-hidden="true" />
                <input id="profile-avatar" name="avatar" v-model="profileForm.avatar" type="url" placeholder="https://example.com/avatar.jpg" class="input-field has-icon" />
              </div>
              <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar-preview" alt="Avatar preview" />
            </div>

            <Transition name="fade">
              <div v-if="profileSuccess" class="msg-banner success">
                <i class="ti ti-circle-check" aria-hidden="true" />
                Your profile has been updated.
              </div>
              <div v-else-if="profileError" class="msg-banner error">
                <i class="ti ti-alert-circle" aria-hidden="true" />
                {{ profileError }}
              </div>
            </Transition>

            <button type="submit" :disabled="savingProfile" class="btn-primary save-btn">
              <i v-if="savingProfile" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
              {{ savingProfile ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </div>
      </div>

      <div class="profile-card">
        <h3 class="section-label-title">
          <i class="ti ti-lock" aria-hidden="true" />
          Change Password
        </h3>
        <form @submit.prevent="handleChangePassword" class="profile-form">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <div class="input-icon-wrap">
              <i class="ti ti-lock input-icon" aria-hidden="true" />
              <input id="profile-current-password" name="current_password" v-model="passwordForm.current_password" :type="showCurrentPw ? 'text' : 'password'" required class="input-field has-icon" />
              <button type="button" @click="showCurrentPw = !showCurrentPw" class="toggle-pw" :aria-label="showCurrentPw ? 'Hide' : 'Show'">
                <i :class="showCurrentPw ? 'ti ti-eye-off' : 'ti ti-eye'" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">New Password</label>
            <div class="input-icon-wrap">
              <i class="ti ti-lock-check input-icon" aria-hidden="true" />
              <input id="profile-new-password" name="password" v-model="passwordForm.password" :type="showNewPw ? 'text' : 'password'" required class="input-field has-icon" />
              <button type="button" @click="showNewPw = !showNewPw" class="toggle-pw" :aria-label="showNewPw ? 'Hide' : 'Show'">
                <i :class="showNewPw ? 'ti ti-eye-off' : 'ti ti-eye'" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <div class="input-icon-wrap">
              <i class="ti ti-lock input-icon" aria-hidden="true" />
              <input id="profile-confirm-password" name="password_confirmation" v-model="passwordForm.password_confirmation" :type="showNewPw ? 'text' : 'password'" required class="input-field has-icon" />
            </div>
            <p v-if="pwMismatch" class="pw-hint">Passwords don't match</p>
          </div>

          <Transition name="fade">
            <div v-if="passwordSuccess" class="msg-banner success">
              <i class="ti ti-circle-check" aria-hidden="true" />
              Your password has been changed.
            </div>
            <div v-else-if="passwordError" class="msg-banner error">
              <i class="ti ti-alert-circle" aria-hidden="true" />
              {{ passwordError }}
            </div>
          </Transition>

          <button type="submit" :disabled="savingPassword || pwMismatch" class="btn-primary save-btn">
            <i v-if="savingPassword" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
            {{ savingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>

      <div class="quick-links">
        <RouterLink v-for="link in quickLinks" :key="link.to" :to="link.to" class="quick-link-card">
          <div class="quick-link-icon">
            <i :class="`ti ${link.icon}`" aria-hidden="true" />
          </div>
          <p class="quick-link-label">{{ link.label }}</p>
        </RouterLink>
      </div>

      <div class="signout-card">
        <h3 class="section-label-title">
          <i class="ti ti-logout" aria-hidden="true" />
          Account Actions
        </h3>
        <p class="signout-desc">Ready to leave? Signing out will require you to log in again to access your account.</p>
        <button @click="confirmModal?.open()" class="btn-cancel signout-btn">
          <i class="ti ti-logout" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>

    <ConfirmModal
      ref="confirmModal"
      title="Sign Out"
      message="Are you sure you want to sign out? You&rsquo;ll need to log in again to access your account."
      confirm-text="Sign Out"
      cancel-text="Cancel"
      @confirm="auth.logout()"
    />

    <AppFooter />
    <SearchModal v-model="searchOpen" />
    <CartDrawer v-model="cartOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { ChangePasswordPayload } from '@/types/auth'

import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import SearchModal from '@/components/layout/SearchModal.vue'
import CartDrawer from '@/components/layout/CartDrawer.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const auth = useAuthStore()
const searchOpen = ref(false)
const cartOpen = ref(false)
const confirmModal = ref<InstanceType<typeof ConfirmModal> | null>(null)

const savingProfile = ref(false)
const profileSuccess = ref(false)
const profileError = ref('')
const savingPassword = ref(false)
const passwordSuccess = ref(false)
const passwordError = ref('')
const showCurrentPw = ref(false)
const showNewPw = ref(false)

const profileForm = reactive({ name: '', email: '', avatar: '' })
const passwordForm = reactive<ChangePasswordPayload>({
  current_password: '',
  password: '',
  password_confirmation: '',
})

const initials = computed(() =>
  auth.userName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
)

const pwMismatch = computed(() =>
  passwordForm.password_confirmation.length > 0 &&
  passwordForm.password !== passwordForm.password_confirmation
)

const quickLinks = [
  { to: '/orders', icon: 'ti-package', label: 'My Orders' },
  { to: '/wishlist', icon: 'ti-heart', label: 'Wishlist' },
  { to: '/cart', icon: 'ti-shopping-bag', label: 'Cart' },
  { to: '/products', icon: 'ti-sparkles', label: 'Shop' },
]

async function handleUpdateProfile() {
  savingProfile.value = true
  profileSuccess.value = false
  profileError.value = ''
  try {
    await auth.updateProfile(profileForm.name, profileForm.email, profileForm.avatar || null)
    profileSuccess.value = true
    setTimeout(() => { profileSuccess.value = false }, 3000)
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    profileError.value = e.response?.data?.message ?? 'Something went wrong while updating your profile. Please try again.'
  } finally {
    savingProfile.value = false
  }
}

async function handleChangePassword() {
  if (pwMismatch.value) return
  savingPassword.value = true
  passwordError.value = ''
  passwordSuccess.value = false
  try {
    await auth.changePassword(passwordForm)
    passwordSuccess.value = true
    passwordForm.current_password = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''
    setTimeout(() => { passwordSuccess.value = false }, 3000)
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } } }
    passwordError.value = e.response?.data?.message ?? 'Something went wrong while changing your password. Please try again.'
  } finally {
    savingPassword.value = false
  }
}

onMounted(() => {
  if (auth.user) {
    profileForm.name = auth.user.name
    profileForm.email = auth.user.email
    profileForm.avatar = auth.user.avatar ?? ''
  }
})
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
  background: rgba(184,138,68,0.12);
  color: var(--primary);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.hero-title {
  font-family: 'Playfair Display', serif;
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
  gap: 20px;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--primary), #C9A96E);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(184,138,68,0.25);
}

.profile-name {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--text);
  font-family: 'Playfair Display', serif;
  margin-bottom: 2px;
}

.profile-email {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.profile-role {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
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
  line-height: 1;
}

.toggle-pw:hover {
  color: var(--text);
}

.pw-hint {
  font-size: 0.75rem;
  margin-top: 4px;
  color: var(--primary);
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
  border-color: rgba(184,138,68,0.2);
}

.quick-link-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  background: rgba(184,138,68,0.08);
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
  border: 1px solid rgba(184,138,68,0.15);
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

.avatar-preview {
  margin-top: 8px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
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
}
</style>
