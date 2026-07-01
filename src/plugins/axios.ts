import axios from 'axios'
import config from '@/config/app'
import { useAuthStore } from '@/stores/auth'

const AUTH_TOKEN_KEY = 'scentique_auth_token'
const AUTH_SESSION_KEY = 'scentique_has_session'

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  withXSRFToken: true,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (token && token !== 'undefined' && token !== 'null') {
    requestConfig.headers.Authorization = `Bearer ${token}`
  } else if (token === 'undefined' || token === 'null') {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    delete requestConfig.headers.Authorization
  } else {
    delete requestConfig.headers.Authorization
  }

  return requestConfig
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      const auth = useAuthStore()

      auth.user = null
      auth.hasSession = false
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_SESSION_KEY)

      if (window.location.pathname !== '/login') {
        const { default: router } = await import('@/router')
        router.push('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default api
