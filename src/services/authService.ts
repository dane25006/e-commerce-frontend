import api from '@/plugins/axios'
import type { User, AuthResponse } from '@/types/auth'
import type { AxiosRequestConfig } from 'axios'

export const authService = {
  register(payload: { name: string; email: string; password: string; password_confirmation: string }) {
    return api.post<AuthResponse>('/register', payload)
  },

  login(payload: { email: string; password: string }) {
    return api.post<AuthResponse>('/login', payload)
  },

  logout() {
    return api.post('/logout')
  },

  profile(config?: AxiosRequestConfig) {
    return api.get<{ success: boolean; user: User }>('/profile', config)
  },

  updateProfile(payload: { name: string; email: string; avatar?: string | null }) {
    return api.put<{ success: boolean; message: string; user: User }>('/profile', payload)
  },

  changePassword(payload: { current_password: string; password: string; password_confirmation: string }) {
    return api.put('/password', payload)
  },
}
