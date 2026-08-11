export interface User {
  id: number
  name: string
  email: string
  role: 'customer' | 'admin'
  avatar: string | null
  google_id: string | null
  is_google_user?: boolean
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

export interface UpdateProfilePayload {
  name: string
  email: string
  avatar?: string | File | null
}

export interface ChangePasswordPayload {
  current_password?: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user: User
  token?: string
}
