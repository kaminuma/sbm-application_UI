// オフライン時のデータ管理
export class OfflineManager {
  static async saveMoodRecord(moodData) {
    try {
      // ローカルストレージに保存
      const localMoods = this.getLocalMoodRecords()
      const existingIndex = localMoods.findIndex(mood => mood.date === moodData.date)
      
      if (existingIndex >= 0) {
        localMoods[existingIndex] = { ...moodData, synced: false }
      } else {
        localMoods.push({ ...moodData, synced: false })
      }
      
      localStorage.setItem('localMoodRecords', JSON.stringify(localMoods))
      
      // オンライン時に同期を試行
      if (navigator.onLine) {
        await this.syncToServer()
      }
      
      return { success: true, message: '気分記録を保存しました' }
    } catch (error) {
      console.error('オフライン保存エラー:', error)
      return { success: false, message: '保存に失敗しました' }
    }
  }
  
  static getLocalMoodRecords() {
    try {
      const localData = localStorage.getItem('localMoodRecords')
      return localData ? JSON.parse(localData) : []
    } catch (error) {
      console.error('ローカルデータ取得エラー:', error)
      return []
    }
  }
  
  static async syncToServer() {
    try {
      const localMoods = this.getLocalMoodRecords()
      const unsyncedMoods = localMoods.filter(mood => !mood.synced)
      
      for (const mood of unsyncedMoods) {
        try {
          // APIファサードを使用してサーバーに同期
          const { createMoodRecord } = await import('./apiFacade.js')
          await createMoodRecord(mood)
          
          // 同期済みマーク
          mood.synced = true
        } catch (error) {
          console.error('同期エラー:', error)
        }
      }
      
      // 同期済みデータを更新
      localStorage.setItem('localMoodRecords', JSON.stringify(localMoods))
      
      return { success: true, syncedCount: unsyncedMoods.length }
    } catch (error) {
      console.error('同期処理エラー:', error)
      return { success: false, error: error.message }
    }
  }
  
  static isOnline() {
    return navigator.onLine
  }
  
  static addOnlineListener(callback) {
    window.addEventListener('online', callback)
  }
  
  static addOfflineListener(callback) {
    window.addEventListener('offline', callback)
  }
} 