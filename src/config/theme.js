/**
 * テーマ設定ファイル
 * アプリケーション全体のテーマを一箇所で管理
 */

// テーマ設定オブジェクト
export const THEME_CONFIG = {
  // デフォルトテーマ
  DEFAULT_THEME: 'light',
  
  // 利用可能なテーマ定義
  THEMES: {
    light: {
      name: 'ライトモード',
      colors: {
        primary: '#00bfa5',
        secondary: '#00acc1',
        accent: '#2196f3',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3',
        success: '#4caf50',
        background: '#f0f4f8',
        surface: '#ffffff',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-accent': '#ffffff',
        'on-error': '#ffffff',
        'on-warning': '#000000',
        'on-info': '#ffffff',
        'on-success': '#ffffff',
        'on-background': '#333333',
        'on-surface': '#333333'
      }
    },
    dark: {
      name: 'ダークモード',
      colors: {
        primary: '#00bfa5',
        secondary: '#00acc1',
        accent: '#64b5f6',
        error: '#f44336',
        warning: '#ff9800',
        info: '#64b5f6',
        success: '#4caf50',
        background: '#121212',
        surface: '#1e1e1e',
        'surface-variant': '#2d2d2d',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-accent': '#000000',
        'on-error': '#ffffff',
        'on-warning': '#000000',
        'on-info': '#000000',
        'on-success': '#ffffff',
        'on-background': '#ffffff',
        'on-surface': '#ffffff'
      }
    }
  }
}

// テーマが有効かどうかをチェックする関数
export const isThemeEnabled = (theme) => {
  return Object.keys(THEME_CONFIG.THEMES).includes(theme);
}

// Vuetifyテーマオブジェクトを生成する関数
export const generateVuetifyThemes = () => {
  return {
    light: {
      dark: false,
      colors: THEME_CONFIG.THEMES.light.colors
    },
    dark: {
      dark: true,
      colors: THEME_CONFIG.THEMES.dark.colors
    }
  }
}

