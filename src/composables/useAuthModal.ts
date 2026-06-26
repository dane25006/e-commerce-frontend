import { ref } from 'vue'

const isOpen = ref(false)
const mode = ref<'login' | 'register'>('login')

export function useAuthModal() {
  function open(initialMode: 'login' | 'register' = 'login') {
    mode.value = initialMode
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    mode.value = mode.value === 'login' ? 'register' : 'login'
  }

  return { isOpen, mode, open, close, toggle }
}
