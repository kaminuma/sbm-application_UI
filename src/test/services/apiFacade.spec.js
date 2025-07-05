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
  setAuthToken: vi.fn()
}))

import apiFacade from '../../services/apiFacade'
import { apiClient } from '../../api/interceptor'
import { saveAuthToken } from '../../services/authUtils'

describe('apiFacade.js ロジックテスト', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registerUser: 正しいパラメータでAPIが呼ばれる', async () => {
    const username = 'testuser'
    const email = 'test@example.com'
    const password = 'password123'
    
    apiClient.post.mockResolvedValue({ data: { success: true } })
    
    await apiFacade.registerUser(username, email, password)
    
    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
      username,
      password,
      email
    })
  })

  it('loginUser: 成功時にトークンが保存される', async () => {
    const username = 'testuser'
    const password = 'password123'
    const responseData = { token: 'test-token', userId: 'user123' }
    
    apiClient.post.mockResolvedValue({ 
      status: 200, 
      data: responseData 
    })
    
    const result = await apiFacade.loginUser(username, password)
    
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      username,
      password
    })
    expect(saveAuthToken).toHaveBeenCalledWith('test-token')
    expect(result).toEqual(responseData)
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
})
