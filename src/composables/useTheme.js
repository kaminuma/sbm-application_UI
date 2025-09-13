import { computed } from 'vue'
import { useStore } from 'vuex'
import { THEME_CONFIG, isThemeEnabled } from '../config/theme'

/**
 * テーマ管理用のComposable
 * テーマの切り替えや状態管理を提供
 */
export function useTheme() {
  const store = useStore()
  
  // 現在のテーマ
  const currentTheme = computed(() => store.getters.getTheme)
  
  // ダークモードかどうか
  const isDark = computed(() => currentTheme.value === 'dark')
  
  // テーマ名（日本語）
  const themeName = computed(() => {
    const themeConfig = THEME_CONFIG.THEMES[currentTheme.value]
    return themeConfig ? themeConfig.name : 'Unknown'
  })
  
  // テーマの切り替え
  const toggleTheme = () => {
    return store.dispatch('toggleTheme')
  }
  // (no change)
  
  // 特定のテーマを設定
  const setTheme = (theme) => {
    if (isThemeEnabled(theme)) {
      store.dispatch('setTheme', theme)
      return true
    }
    return false
  }
  
  // システムの設定を取得
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }
  
  // システム設定に合わせる
  const setSystemTheme = () => {
    const systemTheme = getSystemTheme()
    return setTheme(systemTheme)
  }
  
  // 利用可能なテーマ一覧
  const availableThemes = computed(() => {
    return Object.keys(THEME_CONFIG.THEMES)
  })
  
  return {
    // 状態
    currentTheme,
    isDark,
    themeName,
    availableThemes,
    
    // アクション
    toggleTheme,
    setTheme,
    setSystemTheme,
    getSystemTheme,
  }
}