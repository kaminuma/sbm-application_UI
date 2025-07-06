// モバイルアプリ用エラーハンドリング
export class MobileErrorHandler {
  static async handleApiError(error) {
    console.error('API Error:', error)
    
    // ネットワークエラー
    if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
      return {
        type: 'network',
        message: 'ネットワーク接続を確認してください',
        action: 'retry'
      }
    }
    
    // 認証エラー
    if (error.response?.status === 401 || error.response?.status === 403) {
      return {
        type: 'auth',
        message: '認証に失敗しました。再ログインしてください',
        action: 'login'
      }
    }
    
    // サーバーエラー
    if (error.response?.status >= 500) {
      return {
        type: 'server',
        message: 'サーバーエラーが発生しました。しばらく時間をおいて再試行してください',
        action: 'retry'
      }
    }
    
    // その他のエラー
    return {
      type: 'unknown',
      message: 'エラーが発生しました',
      action: 'retry'
    }
  }
  
  static showErrorNotification(error) {
    // モバイル用のエラー通知
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast(error.message, 'error')
    } else {
      // フォールバック: アラート
      alert(error.message)
    }
  }
  
  static logError(error, context = '') {
    // エラーログの記録
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
        status: error.response?.status
      },
      userAgent: navigator.userAgent,
      online: navigator.onLine
    }
    
    console.error('Error Log:', errorLog)
    
    // ローカルストレージにエラーログを保存
    try {
      const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]')
      logs.push(errorLog)
      
      // 最新100件のみ保持
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100)
      }
      
      localStorage.setItem('errorLogs', JSON.stringify(logs))
    } catch (e) {
      console.error('Error log save failed:', e)
    }
  }
} 