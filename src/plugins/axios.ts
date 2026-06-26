import axios from 'axios'
import config from '@/config/app'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem('scentique_auth_token')

  if (token && token !== 'undefined' && token !== 'null') {
    requestConfig.headers.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('scentique_auth_token')
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
      localStorage.removeItem('scentique_auth_token')
      localStorage.removeItem('scentique_has_session')

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
