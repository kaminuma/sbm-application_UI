// モバイルアプリ用の設定
export const MOBILE_CONFIG = {
  // API設定
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://your-production-api.com/api/v1',
    timeout: 10000
  },
  
  // アプリ設定
  app: {
    name: 'SBM Application',
    version: '1.0.0',
    buildNumber: '1'
  },
  
  // 機能設定
  features: {
    offlineMode: true,
    pushNotifications: true,
    camera: true
  }
}

// 環境別設定
export const getConfig = () => {
  const isProduction = import.meta.env.PROD
  
  return {
    ...MOBILE_CONFIG,
    api: {
      ...MOBILE_CONFIG.api,
      baseURL: isProduction 
        ? 'https://your-production-api.com/api/v1'
        : 'http://localhost:8080/api/v1'
    }
  }
} 