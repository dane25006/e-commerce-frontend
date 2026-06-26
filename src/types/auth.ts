export interface User {
  id: number
  name: string
  email: string
  role: 'customer' | 'admin'
  created_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ChangePasswordPayload {
  current_password: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  message: string
  user: User
  token?: string
}
