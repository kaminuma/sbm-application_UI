import { createI18n } from 'vue-i18n'
import ja from './locales/ja.json'
import en from './locales/en.json'

// Safely get locale from localStorage, fallback to 'ja'
function getUserLocale() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const locale = window.localStorage.getItem('user-locale');
      return locale || 'ja';
    }
  } catch (e) {
    // localStorage not available or error occurred
  }
  return 'ja';
}

const i18n = createI18n({
  legacy: false,
  locale: getUserLocale(),
  fallbackLocale: 'ja',
  messages: { ja, en }
})

export default i18n