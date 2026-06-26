import { defineStore } from 'pinia'
import axios from 'axios'
import { ref, computed } from 'vue'
import api from '@/plugins/axios'
import config from '@/config/app'
import router from '@/router'
import { getGuestToken } from '@/utils/guest'
import type {
  User,
  LoginPayload,
  RegisterPayload,
  ChangePasswordPayload,
  AuthResponse,
} from '@/types/auth'

const AUTH_TOKEN_KEY = 'scentique_auth_token'
const AUTH_SESSION_KEY = 'scentique_has_session'

export const useAuthStore = defineStore('auth', () => {
  if (['undefined', 'null', ''].includes(localStorage.getItem(AUTH_TOKEN_KEY) ?? '')) {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  const user = ref<User | null>(null)
  const hasSession = ref(localStorage.getItem(AUTH_SESSION_KEY) === 'true')
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  let bootPromise: Promise<void> | null = null

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name ?? '')

  async function getCsrfCookie(): Promise<void> {
    try {
      await axios.get(`${config.apiBaseUrl}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      })
    } catch {
      // Bearer-token APIs do not need Sanctum's CSRF cookie.
    }
  }

  function setSession(data: AuthResponse): void {
    user.value = data.user
    hasSession.value = true
    localStorage.setItem(AUTH_SESSION_KEY, 'true')

    if (data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }

  function clearSession(): void {
    user.value = null
    hasSession.value = false
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_SESSION_KEY)
  }

  // ── POST /api/register ──────────────────────────────────────────────────
  async function register(payload: RegisterPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await getCsrfCookie()
      const { data } = await api.post<AuthResponse>('/register', payload)
      setSession(data)

      const token = getGuestToken()
      await Promise.allSettled([
        api.post('/cart/merge', { guest_token: token, _token: '' }),
        api.post('/wishlist/merge', { guest_token: token, _token: '' }),
      ])

      await router.push('/')
    } catch (err: unknown) {
      error.value = extractMessage(err, 'Registration failed.')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── POST /api/login ─────────────────────────────────────────────────────
  async function login(payload: LoginPayload): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await getCsrfCookie()

      const { data } = await api.post<AuthResponse>('/login', payload)

      setSession(data)

      const token = getGuestToken()
      await Promise.allSettled([
        api.post('/cart/merge', { guest_token: token, _token: '' }),
        api.post('/wishlist/merge', { guest_token: token, _token: '' }),
      ])

      const redirect = router.currentRoute.value.query.redirect as string

      await router.push(redirect || '/')
    } catch (err: unknown) {
      error.value = extractMessage(err, 'Login failed.')
      throw err
    } finally {
      loading.value = false
    }
  }

  // ── POST /api/logout ────────────────────────────────────────────────────
  async function logout(): Promise<void> {
    try {
      await api.post('/logout')
    } finally {
      clearSession()
      await router.push('/login')
    }
  }

  // ── boot: restore session on page refresh ───────────────────────────────
  // Cookie is sent automatically — just call /profile to check if valid
  async function boot(): Promise<void> {
    if (initialized.value) return
    if (bootPromise) return bootPromise

    if (!hasSession.value) {
      initialized.value = true
      return
    }

    bootPromise = (async () => {
      try {
        const { data } = await api.get<{ user: User }>('/profile', {
          skipAuthRedirect: true,
        })
        user.value = data.user
      } catch {
        clearSession()
      } finally {
        initialized.value = true
        bootPromise = null
      }
    })()

    return bootPromise
  }

  // ── PUT /api/profile ────────────────────────────────────────────────────
  async function updateProfile(name: string, email: string): Promise<void> {
    const { data } = await api.put<{ message: string; user: User }>('/profile', { name, email })
    user.value = data.user
  }

  // ── PUT /api/password ───────────────────────────────────────────────────
  async function changePassword(payload: ChangePasswordPayload): Promise<void> {
    await api.put('/password', payload)
    clearSession()
    await router.push('/login')
  }

  return {
    user,
    hasSession,
    loading,
    error,
    initialized,
    isLoggedIn,
    isAdmin,
    userName,
    register,
    login,
    logout,
    boot,
    updateProfile,
    changePassword,
  }
})

function extractMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    (err as { response?: { data?: { message?: string } } }).response?.data?.message
  ) {
    return String((err as { response: { data: { message: string } } }).response.data.message)
  }
  return fallback
}
