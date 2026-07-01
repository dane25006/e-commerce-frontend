import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import config from '@/config/app'
import router from '@/router'
import { authService } from '@/services/authService'
import { getGuestToken, clearGuestToken } from '@/utils/guest'
import { cartService } from '@/services/cartService'
import { wishlistService } from '@/services/wishlistService'
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
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)
  let bootPromise: Promise<void> | null = null

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userName = computed(() => user.value?.name ?? '')

  async function getCsrfCookie(): Promise<void> {
    try {
      const { default: axios } = await import('axios')
      await axios.get(`${config.apiBaseUrl}/sanctum/csrf-cookie`, {
        withCredentials: true,
        headers: { Accept: 'application/json' },
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

  async function mergeGuestCart(): Promise<void> {
    const token = getGuestToken()
    await Promise.allSettled([
      cartService.merge(token),
      wishlistService.merge(token),
    ])
    clearGuestToken()
  }

  async function refetchCartAndWishlist(): Promise<void> {
    const { useCartStore } = await import('@/stores/cart')
    const { useWishlistStore } = await import('@/stores/wishlist')
    await Promise.allSettled([
      useCartStore().fetchCart(),
      useWishlistStore().fetchWishlist(),
    ])
  }

  async function register(payload: RegisterPayload): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await getCsrfCookie()
      const { data } = await authService.register(payload)
      setSession(data)
      await mergeGuestCart()
      await router.push('/')
    } catch (err: unknown) {
      error.value = extractMessage(err, 'Registration failed.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(payload: LoginPayload): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await getCsrfCookie()
      const { data } = await authService.login(payload)
      setSession(data)
      await mergeGuestCart()
      await refetchCartAndWishlist()

      const redirect = router.currentRoute.value.query.redirect as string
      await router.push(redirect || '/')
    } catch (err: unknown) {
      error.value = extractMessage(err, 'Login failed.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } finally {
      clearSession()
      await router.push('/login')
    }
  }

  async function socialLogin(token: string): Promise<void> {
    loading.value = true
    error.value = null

    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem(AUTH_SESSION_KEY, 'true')

    try {
      const { data } = await authService.profile({ skipAuthRedirect: true } as any)
      user.value = data.user
      hasSession.value = true
      initialized.value = true

      await mergeGuestCart()
      await refetchCartAndWishlist()

      const redirect = sessionStorage.getItem('scentique_redirect')
      sessionStorage.removeItem('scentique_redirect')
      await router.push(redirect || '/')
    } catch (err: unknown) {
      clearSession()
      error.value = extractMessage(err, 'Social login failed.')
      await router.push('/login')
    } finally {
      loading.value = false
    }
  }

  async function boot(): Promise<void> {
    if (initialized.value) return
    if (bootPromise) return bootPromise

    if (!hasSession.value) {
      initialized.value = true
      return
    }

    bootPromise = (async () => {
      try {
        const { data } = await authService.profile({ skipAuthRedirect: true } as any)
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

  async function updateProfile(name: string, email: string, avatar?: string | null): Promise<void> {
    const { data } = await authService.updateProfile({ name, email, avatar })
    user.value = data.user
  }

  async function changePassword(payload: ChangePasswordPayload): Promise<void> {
    await authService.changePassword(payload)
    clearSession()
    await router.push('/login')
  }

  return {
    user, hasSession, loading, error, initialized,
    isLoggedIn, isAdmin, userName,
    register, login, logout, socialLogin, boot,
    updateProfile, changePassword,
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
