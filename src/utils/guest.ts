const GUEST_TOKEN_KEY = 'scentique_guest_token'

function generateToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function getGuestToken(): string {
  let token = localStorage.getItem(GUEST_TOKEN_KEY)
  if (!token) {
    token = generateToken()
    localStorage.setItem(GUEST_TOKEN_KEY, token)
  }
  return token
}

export function clearGuestToken(): void {
  localStorage.removeItem(GUEST_TOKEN_KEY)
}
