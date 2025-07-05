import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import { shallowMount } from '@vue/test-utils'
import Auth from '../../components/Auth.vue'

// APIモック
vi.mock('../../services/apiFacade', () => ({
  default: {
    loginUser: vi.fn(),
    registerUser: vi.fn()
  }
}))

// window.alertをモック
globalThis.alert = vi.fn()

const store = createStore({
  state: {
    userId: null
  },
  mutations: {
    setUserId: vi.fn()
  },
  actions: {
    login: vi.fn()
  }
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/schedule', name: 'Schedule' }
  ]
})

describe('Auth.vue ロジックテスト', () => {
  let wrapper

  beforeEach(() => {
    process.env.NODE_ENV = 'test'
    vi.spyOn(store, 'dispatch')
    wrapper = shallowMount(Auth, {
      global: {
        plugins: [store, router],
        stubs: ['Header']
      }
    })
  })

  it('初期状態ではログインモード', () => {
    expect(wrapper.vm.isLogin).toBe(true)
    expect(wrapper.vm.username).toBe('')
    expect(wrapper.vm.email).toBe('')
    expect(wrapper.vm.password).toBe('')
    expect(wrapper.vm.confirmPassword).toBe('')
    expect(wrapper.vm.valid).toBe(false)
  })

  it('toggleLogin: ログイン/登録モードの切り替え', () => {
    expect(wrapper.vm.isLogin).toBe(true)
    
    wrapper.vm.toggleLogin()
    expect(wrapper.vm.isLogin).toBe(false)
    
    wrapper.vm.toggleLogin()
    expect(wrapper.vm.isLogin).toBe(true)
  })

  it('resetFields: フィールドのリセット', () => {
    wrapper.vm.username = 'testuser'
    wrapper.vm.email = 'test@example.com'
    wrapper.vm.password = 'password123'
    wrapper.vm.confirmPassword = 'password123'

    wrapper.vm.resetFields()

    expect(wrapper.vm.username).toBe('')
    expect(wrapper.vm.email).toBe('')
    expect(wrapper.vm.password).toBe('')
    expect(wrapper.vm.confirmPassword).toBe('')
  })

  it('toggleLogin: モード切り替え時にフィールドがリセットされる', () => {
    wrapper.vm.username = 'testuser'
    wrapper.vm.password = 'password123'

    wrapper.vm.toggleLogin()

    expect(wrapper.vm.username).toBe('')
    expect(wrapper.vm.password).toBe('')
  })

  it('submit: ログインモードでの正常なログイン', async () => {
    wrapper.vm.username = 'testuser'
    wrapper.vm.password = 'password123'
    wrapper.vm.valid = true
    // APIモックの設定
    const { default: apiFacade } = await import('../../services/apiFacade')
    apiFacade.loginUser.mockResolvedValue({ userId: 'user123' })
    await wrapper.vm.submit()
    expect(apiFacade.loginUser).toHaveBeenCalledWith('testuser', 'password123')
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('login', 'user123')
  })

  it('submit: 登録モードでの正常な登録', async () => {
    wrapper.vm.isLogin = false
    wrapper.vm.username = 'newuser'
    wrapper.vm.email = 'new@example.com'
    wrapper.vm.password = 'password123'
    wrapper.vm.confirmPassword = 'password123'
    wrapper.vm.valid = true
    // APIモックの設定
    const { default: apiFacade } = await import('../../services/apiFacade')
    apiFacade.registerUser.mockResolvedValue({ success: true })
    await wrapper.vm.submit()
    expect(apiFacade.registerUser).toHaveBeenCalledWith('newuser', 'new@example.com', 'password123')
  })

  it('submit: パスワード不一致時の処理', async () => {
    wrapper.vm.isLogin = false
    wrapper.vm.password = 'password123'
    wrapper.vm.confirmPassword = 'differentpassword'
    wrapper.vm.valid = true
    await wrapper.vm.submit()
    expect(globalThis.alert).toHaveBeenCalledWith('パスワードが一致しません。')
  })

  it('submit: ログインエラーの処理', async () => {
    wrapper.vm.username = 'testuser'
    wrapper.vm.password = 'wrongpassword'
    wrapper.vm.valid = true
    // APIモックの設定
    const { default: apiFacade } = await import('../../services/apiFacade')
    apiFacade.loginUser.mockRejectedValue(new Error('Invalid credentials'))
    await wrapper.vm.submit()
    expect(globalThis.alert).toHaveBeenCalledWith('無効な認証情報です')
  })

  it('submit: 登録エラーの処理', async () => {
    wrapper.vm.isLogin = false
    wrapper.vm.username = 'existinguser'
    wrapper.vm.email = 'existing@example.com'
    wrapper.vm.password = 'password123'
    wrapper.vm.confirmPassword = 'password123'
    wrapper.vm.valid = true
    // APIモックの設定
    const { default: apiFacade } = await import('../../services/apiFacade')
    apiFacade.registerUser.mockRejectedValue(new Error('User already exists'))
    await wrapper.vm.submit()
    expect(globalThis.alert).toHaveBeenCalledWith('登録に失敗しました。\n別のIDをお試しいただくか、もう一度お試しください。')
  })

  it('submit: フォームバリデーション失敗時は処理しない', async () => {
    wrapper.vm.username = 'testuser'
    wrapper.vm.password = 'password123'
    wrapper.vm.valid = false
    await wrapper.vm.submit()
    // APIが呼ばれないことを確認
    const { default: apiFacade } = await import('../../services/apiFacade')
    expect(apiFacade.loginUser).not.toHaveBeenCalled()
  })

  it('バリデーションルール: 必須項目', () => {
    const requiredRule = wrapper.vm.rules.required
    expect(requiredRule('')).toBe('必須項目です。')
    expect(requiredRule('test')).toBe(true)
  })

  it('バリデーションルール: ユーザー名最小文字数', () => {
    const usernameMinRule = wrapper.vm.rules.usernameMin
    expect(usernameMinRule('a')).toBe('最低2文字以上で入力してください。')
    expect(usernameMinRule('ab')).toBe(true)
  })

  it('バリデーションルール: ユーザー名英数字のみ', () => {
    const usernameAlphaNumRule = wrapper.vm.rules.usernameAlphaNum
    expect(usernameAlphaNumRule('test@user')).toBe('ユーザー名は英数字のみで入力してください。')
    expect(usernameAlphaNumRule('testuser123')).toBe(true)
  })

  it('バリデーションルール: メールアドレス形式', () => {
    const emailFormatRule = wrapper.vm.rules.emailFormat
    expect(emailFormatRule('invalid-email')).toBe('有効なメールアドレスを入力してください。')
    expect(emailFormatRule('test@example.com')).toBe(true)
  })

  it('バリデーションルール: パスワード最小文字数', () => {
    const passwordMinRule = wrapper.vm.rules.passwordMin
    expect(passwordMinRule('1234567')).toBe('パスワードは最低8文字以上で入力してください。')
    expect(passwordMinRule('12345678')).toBe(true)
  })

  it('バリデーションルール: パスワード一致', () => {
    wrapper.vm.password = 'password123'
    const matchPasswordRule = wrapper.vm.rules.matchPassword
    expect(matchPasswordRule('different')).toBe('パスワードが一致しません。')
    expect(matchPasswordRule('password123')).toBe(true)
  })
})
