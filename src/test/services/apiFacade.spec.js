import { describe, it, expect, beforeEach, vi } from 'vitest'

// モックを先に定義
vi.mock('../../api/interceptor', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      response: {
        use: vi.fn()
      }
    },
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}))

vi.mock('../../router', () => ({
  default: {
    push: vi.fn()
  }
}))

vi.mock('../../services/authUtils', () => ({
  saveAuthToken: vi.fn(),
  saveAuthTokens: vi.fn(),
  setAuthToken: vi.fn()
}))

import apiFacade from '../../services/apiFacade'
import { apiClient } from '../../api/interceptor'
import { saveAuthToken, saveAuthTokens } from '../../services/authUtils'

describe('apiFacade.js ロジックテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('register: 正しいパラメータでAPIが呼ばれる', async () => {
    const username = 'testuser'
    const email = 'test@example.com'
    const password = 'password123'
    
    apiClient.post.mockResolvedValue({ data: { success: true } })
    
    await apiFacade.register(username, email, password)
    
    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
      username,
      password,
      email
    })
  })

  it('login: 成功時にトークンが保存される', async () => {
    const username = 'testuser'
    const password = 'password123'
    const responseData = { token: 'test-token', refreshToken: 'refresh-token', userId: 'user123' }
    
    apiClient.post.mockResolvedValue({ 
      status: 200, 
      data: responseData 
    })
    
    const result = await apiFacade.login({ username, password })
    
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      username,
      password
    })
    expect(saveAuthTokens).toHaveBeenCalledWith('test-token', 'refresh-token')
    expect(saveAuthToken).not.toHaveBeenCalled()
    expect(result).toEqual('user123')
  })

  it('uploadExcelFile: FormDataでアップロードが実行される', async () => {
    const formData = new FormData()
    formData.append('file', 'test.xlsx')
    
    apiClient.post.mockResolvedValue({ data: { success: true } })
    
    await apiFacade.uploadExcelFile(formData)
    
    expect(apiClient.post).toHaveBeenCalledWith('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  })

  it('getActivities: ユーザーIDでアクティビティを取得', async () => {
    const userId = 'user123'
    const activities = [{ id: 1, title: 'テスト' }]
    
    apiClient.get.mockResolvedValue({ 
      status: 200, 
      data: activities 
    })
    
    const result = await apiFacade.getActivities(userId)
    
    expect(apiClient.get).toHaveBeenCalledWith('/activities', {
      params: { userId }
    })
    expect(result).toEqual(activities)
  })

  it('createActivity: アクティビティが作成される', async () => {
    const activity = {
      userId: 'user123',
      title: 'テストイベント',
      date: '2024-01-01'
    }
    
    apiClient.post.mockResolvedValue({ data: { id: 1, ...activity } })
    
    await apiFacade.createActivity(activity)
    
    expect(apiClient.post).toHaveBeenCalledWith('/activities', activity)
  })

  it('updateActivity: アクティビティが更新される', async () => {
    const activity = {
      activityId: 1,
      userId: 'user123',
      title: '更新されたイベント'
    }
    
    apiClient.put.mockResolvedValue({ data: { success: true } })
    
    await apiFacade.updateActivity(activity)
    
    expect(apiClient.put).toHaveBeenCalledWith('/activities/1', activity)
  })

  it('deleteActivity: アクティビティが削除される', async () => {
    const activityId = 1
    
    apiClient.delete.mockResolvedValue({ data: { success: true } })
    
    await apiFacade.deleteActivity(activityId)
    
    expect(apiClient.delete).toHaveBeenCalledWith('/activities/1')
  })

  it('getAnalysisData: 分析データが取得される', async () => {
    const params = {
      userId: 'user123',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    }
    const analysisData = {
      activities: [],
      total_time_per_category: []
    }
    
    apiClient.get.mockResolvedValue({ 
      status: 200, 
      data: analysisData 
    })
    
    const result = await apiFacade.getAnalysisData(params)
    
    expect(apiClient.get).toHaveBeenCalledWith('/analyze', {
      params
    })
    expect(result).toEqual(analysisData)
  })

  describe('気分記録関連のAPI', () => {
    it('getMoodRecords: ユーザーIDで気分記録を取得', async () => {
      const userId = 'user123'
      const moodRecords = {
        moodRecords: [
          { date: '2024-01-01', mood: 4, note: '良い一日でした' },
          { date: '2024-01-02', mood: 3, note: '普通の一日' }
        ]
      }
      
      apiClient.get.mockResolvedValue({ 
        status: 200, 
        data: moodRecords 
      })
      
      const result = await apiFacade.getMoodRecords(userId)
      
      expect(apiClient.get).toHaveBeenCalledWith('/mood', {
        params: { userId }
      })
      expect(result).toEqual(moodRecords)
    })

    it('createMoodRecord: 新しい気分記録を作成', async () => {
      const moodData = {
        date: '2024-01-01',
        mood: 4,
        note: '良い一日でした',
        userId: 'user123'
      }
      const createdMood = { id: 1, ...moodData }
      
      apiClient.post.mockResolvedValue({ data: createdMood })
      
      const result = await apiFacade.createMoodRecord(moodData)
      
      expect(apiClient.post).toHaveBeenCalledWith('/mood', moodData)
      expect(result).toEqual(createdMood)
    })

    it('updateMoodRecord: 既存の気分記録を更新', async () => {
      const moodData = {
        date: '2024-01-01',
        mood: 5,
        note: 'とても良い一日でした',
        userId: 'user123'
      }
      const updatedMood = { id: 1, ...moodData }
      
      apiClient.put.mockResolvedValue({ data: updatedMood })
      
      const result = await apiFacade.updateMoodRecord(moodData)
      
      expect(apiClient.put).toHaveBeenCalledWith('/mood/2024-01-01', moodData)
      expect(result).toEqual(updatedMood)
    })

    it('deleteMoodRecord: 指定された日付の気分記録を削除', async () => {
      const date = '2024-01-01'
      const userId = 'user123' // userIdを追加
      
      apiClient.delete.mockResolvedValue({ data: { success: true } })
      
      const result = await apiFacade.deleteMoodRecord(date, userId)
      
      expect(apiClient.delete).toHaveBeenCalledWith('/mood/2024-01-01', {
        params: { userId }
      })
      expect(result).toEqual({ success: true })
    })

    it('getMoodAnalysis: 気分分析データを取得', async () => {
      const userId = 'user123'
      const startDate = '2024-01-01'
      const endDate = '2024-01-31'
      const analysisData = {
        averageMood: 4.2,
        moodDistribution: [
          { mood: 4, count: 5 },
          { mood: 5, count: 3 }
        ]
      }
      
      apiClient.get.mockResolvedValue({ 
        status: 200, 
        data: analysisData 
      })
      
      const result = await apiFacade.getMoodAnalysis(userId, startDate, endDate)
      
      expect(apiClient.get).toHaveBeenCalledWith('/mood/analysis', {
        params: { userId, startDate, endDate }
      })
      expect(result).toEqual(analysisData)
    })

    it('getMoodRecords: APIエラー時に例外がスローされる', async () => {
      const userId = 'user123'
      
      // mockResolvedValueではなくmockRejectedValueを使用してエラーを返す
      apiClient.get.mockRejectedValue({ 
        response: {
          status: 500, 
          data: { error: 'Internal Server Error' } 
        }
      })
      
      await expect(apiFacade.getMoodRecords(userId)).rejects.toThrow('気分記録の取得に失敗しました')
    })

    it('getMoodAnalysis: APIエラー時に例外がスローされる', async () => {
      const userId = 'user123'
      const startDate = '2024-01-01'
      const endDate = '2024-01-31'
      
      // mockResolvedValueではなくmockRejectedValueを使用してエラーを返す
      apiClient.get.mockRejectedValue({ 
        response: {
          status: 500, 
          data: { error: 'Internal Server Error' } 
        }
      })
      
      await expect(apiFacade.getMoodAnalysis(userId, startDate, endDate)).rejects.toThrow('気分分析の取得に失敗しました')
    })
  })
})
