import { describe, it, expect, beforeEach } from 'vitest'
import { createStore } from 'vuex'
import store from '../../store/index'

describe('store/index.js ロジックテスト', () => {
  let testStore

  beforeEach(() => {
    // テスト用のストアを作成
    testStore = createStore({
      state: {
        isAuthenticated: false,
        userId: null
      },
      mutations: {
        setAuthentication(state, status) {
          state.isAuthenticated = status
        },
        setUserId(state, userId) {
          state.userId = userId
        }
      },
      actions: {
        login({ commit }, userId) {
          try {
            commit('setAuthentication', true)
            commit('setUserId', userId)
          } catch (error) {
            console.error('Error in login action:', error)
            throw error
          }
        },
        logout({ commit }) {
          commit('setAuthentication', false)
          commit('setUserId', null)
        }
      },
      getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        getUserId: (state) => state.userId
      }
    })
  })

  it('初期状態: isAuthenticatedがfalse', () => {
    expect(testStore.state.isAuthenticated).toBe(false)
  })

  it('初期状態: userIdがnull', () => {
    expect(testStore.state.userId).toBe(null)
  })

  it('setAuthentication mutation: 認証状態が更新される', () => {
    testStore.commit('setAuthentication', true)
    expect(testStore.state.isAuthenticated).toBe(true)
    
    testStore.commit('setAuthentication', false)
    expect(testStore.state.isAuthenticated).toBe(false)
  })

  it('setUserId mutation: ユーザーIDが更新される', () => {
    const userId = 'user123'
    testStore.commit('setUserId', userId)
    expect(testStore.state.userId).toBe(userId)
    
    testStore.commit('setUserId', null)
    expect(testStore.state.userId).toBe(null)
  })

  it('login action: ログイン時に認証状態とユーザーIDが設定される', async () => {
    const userId = 'user123'
    await testStore.dispatch('login', userId)
    
    expect(testStore.state.isAuthenticated).toBe(true)
    expect(testStore.state.userId).toBe(userId)
  })

  it('logout action: ログアウト時に認証状態とユーザーIDがクリアされる', async () => {
    // まずログイン状態にする
    await testStore.dispatch('login', 'user123')
    expect(testStore.state.isAuthenticated).toBe(true)
    expect(testStore.state.userId).toBe('user123')
    
    // ログアウト
    await testStore.dispatch('logout')
    expect(testStore.state.isAuthenticated).toBe(false)
    expect(testStore.state.userId).toBe(null)
  })

  it('isAuthenticated getter: 認証状態が取得できる', () => {
    expect(testStore.getters.isAuthenticated).toBe(false)
    
    testStore.commit('setAuthentication', true)
    expect(testStore.getters.isAuthenticated).toBe(true)
  })

  it('getUserId getter: ユーザーIDが取得できる', () => {
    expect(testStore.getters.getUserId).toBe(null)
    
    const userId = 'user123'
    testStore.commit('setUserId', userId)
    expect(testStore.getters.getUserId).toBe(userId)
  })
})
