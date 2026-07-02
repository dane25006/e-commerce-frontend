import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import km from './locales/km.json'

const savedLocale = localStorage.getItem('locale') || 'en'

function applyLocale(locale: string) {
  document.documentElement.lang = locale
  const body = document.body
  body.classList.remove('font-en', 'font-km')
  body.classList.add(`font-${locale}`)
  localStorage.setItem('locale', locale)
}

applyLocale(savedLocale)

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: { en, km },
})

export default i18n
