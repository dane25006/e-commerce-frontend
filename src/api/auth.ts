import api from '@/plugins/axios'
import type { User, AuthResponse } from '@/types/auth'

export const authApi = {
  register(payload: { name: string; email: string; password: string; password_confirmation: string }) {
    return api.post<AuthResponse>('/register', payload)
  },

  login(payload: { email: string; password: string }) {
    return api.post<AuthResponse>('/login', payload)
  },

  logout() {
    return api.post('/logout')
  },

  profile() {
    return api.get<{ success: boolean; user: User }>('/profile')
  },

  updateProfile(payload: { name: string; email: string }) {
    return api.put<{ success: boolean; message: string; user: User }>('/profile', payload)
  },

  changePassword(payload: { current_password: string; password: string; password_confirmation: string }) {
    return api.put('/password', payload)
  },
}
