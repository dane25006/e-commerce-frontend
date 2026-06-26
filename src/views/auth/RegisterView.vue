<template>
  <AuthModal
    eyebrow="Create profile"
    title="Create account"
    subtitle="Enter your details to start shopping today."
    title-id="register-title"
    @close="goHome"
  >
    <div
      v-if="auth.error"
      class="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700"
    >
      <i class="ti ti-alert-circle mt-0.5 shrink-0" aria-hidden="true" />
      <span>{{ auth.error }}</span>
    </div>

    <form class="space-y-5" novalidate @submit.prevent="handleSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <AuthTextField
          id="name"
          v-model="form.name"
          label="Full name"
          autocomplete="name"
          placeholder="Enter your name"
          :error="errors.name"
          @blur="validateField('name')"
        />

        <AuthTextField
          id="email"
          v-model="form.email"
          label="Email"
          type="email"
          autocomplete="email"
          placeholder="Enter your email"
          :error="errors.email"
          @blur="validateField('email')"
        />
      </div>

      <div class="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-sm font-semibold text-slate-900">Password security</h2>
            <p class="mt-1 text-xs text-slate-500">Use at least 8 characters.</p>
          </div>
          <span class="rounded-full bg-white px-3 py-1 text-xs font-medium" :class="strength.textColor">
            {{ strength.label || 'Empty' }}
          </span>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <AuthPasswordField
            id="password"
            v-model="form.password"
            label="Password"
            placeholder="Enter your password"
            :error="errors.password"
            @blur="validateField('password')"
          >
            <div class="mt-2 flex gap-1">
              <span
                v-for="n in 4"
                :key="n"
                class="h-1 flex-1 rounded-full transition-colors duration-300"
                :class="n <= strength.score ? strength.color : 'bg-slate-200'"
              />
            </div>
          </AuthPasswordField>

          <AuthPasswordField
            id="confirm"
            v-model="form.password_confirmation"
            label="Confirm password"
            placeholder="Confirm your password"
            :error="errors.password_confirmation"
            @blur="validateField('password_confirmation')"
          />
        </div>
      </div>

      <button
        type="submit"
        :disabled="auth.loading"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <i v-if="auth.loading" class="ti ti-loader-2 animate-spin" aria-hidden="true" />
        <span>{{ auth.loading ? 'Creating account...' : 'Create account' }}</span>
      </button>
    </form>

    <div class="my-5 flex items-center gap-3">
      <div class="h-px flex-1 bg-slate-200" />
      <span class="text-xs text-slate-400">or</span>
      <div class="h-px flex-1 bg-slate-200" />
    </div>

    <p class="text-center text-sm text-slate-500">
      Already have an account?
      <RouterLink to="/login" class="font-medium text-indigo-600 hover:underline">Sign in</RouterLink>
    </p>
  </AuthModal>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AuthModal from '@/components/auth/AuthModal.vue'
import AuthPasswordField from '@/components/auth/AuthPasswordField.vue'
import AuthTextField from '@/components/auth/AuthTextField.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const strength = computed(() => {
  const pw = form.password
  if (!pw) return { score: 0, label: '', color: 'bg-slate-200', textColor: 'text-slate-400' }

  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  const strengthMap: Record<number, { label: string; color: string; textColor: string }> = {
    1: { label: 'Weak', color: 'bg-red-400', textColor: 'text-red-500' },
    2: { label: 'Fair', color: 'bg-amber-400', textColor: 'text-amber-600' },
    3: { label: 'Good', color: 'bg-blue-400', textColor: 'text-blue-600' },
    4: { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-600' },
  }

  return { score, ...strengthMap[score] }
})

type Field = keyof typeof form

function goHome() {
  router.push('/')
}

function validateField(field: Field) {
  switch (field) {
    case 'name':
      errors.name = form.name ? '' : 'Full name is required.'
      break
    case 'email':
      if (!form.email) errors.email = 'Email is required.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errors.email = 'Enter a valid email address.'
      else errors.email = ''
      break
    case 'password':
      if (!form.password) errors.password = 'Password is required.'
      else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters.'
      else errors.password = ''
      if (form.password_confirmation) validateField('password_confirmation')
      break
    case 'password_confirmation':
      errors.password_confirmation =
        form.password_confirmation !== form.password ? 'Passwords do not match.' : ''
      break
  }
}

function validateAll(): boolean {
  ;(['name', 'email', 'password', 'password_confirmation'] as Field[]).forEach(validateField)
  return Object.values(errors).every((error) => !error)
}

async function handleSubmit() {
  if (!validateAll()) return

  try {
    await auth.register({ ...form })
  } catch {
    /* error set in store */
  }
}
</script>
