import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// モックを先に定義
vi.mock('../../api/interceptor', () => ({
  apiClient: {
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}))

import { setAuthToken, saveAuthToken, clearAuthToken } from '../../services/authUtils'
import { apiClient } from '../../api/interceptor'

// localStorageのモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

describe('authUtils.js ロジックテスト', () => {
  beforeEach(() => {
    // localStorageをモック
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
    
    // モックをリセット
    vi.clearAllMocks()
    apiClient.defaults.headers.common = {}
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('setAuthToken: トークンが存在する場合、Authorizationヘッダーが設定される', () => {
    const token = 'test-token'
    localStorageMock.getItem.mockReturnValue(token)
    
    setAuthToken()
    
    expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`)
  })

  it('setAuthToken: トークンが存在しない場合、Authorizationヘッダーが削除される', () => {
    localStorageMock.getItem.mockReturnValue(null)
    apiClient.defaults.headers.common['Authorization'] = 'Bearer old-token'
    
    setAuthToken()
    
    expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined()
  })

  it('saveAuthToken: トークンが保存され、ヘッダーが更新される', () => {
    const token = 'new-token'
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.getItem.mockReturnValue(token)
    
    saveAuthToken(token)
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', token)
    expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`)
  })

  it('saveAuthToken: トークンがnullの場合、何も実行されない', () => {
    saveAuthToken(null)
    
    expect(localStorageMock.setItem).not.toHaveBeenCalled()
  })

  it('clearAuthToken: トークンが削除され、ヘッダーがクリアされる', () => {
    localStorageMock.removeItem.mockImplementation(() => {})
    
    clearAuthToken()
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined()
  })
})
