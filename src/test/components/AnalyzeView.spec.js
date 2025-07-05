import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'
import { shallowMount } from '@vue/test-utils'
import AnalyzeView from '../../components/AnalyzeView.vue'

// APIモック
vi.mock('../../services/apiFacade', () => ({
  default: {
    getAnalysisData: vi.fn()
  }
}))

const store = createStore({
  state: {
    userId: 'test-user-id'
  },
  getters: {
    getUserId: (state) => state.userId
  }
})

describe('AnalyzeView.vue ロジックテスト', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AnalyzeView, {
      global: {
        plugins: [store],
        stubs: ['VueDatePicker', 'DoughnutChart']
      }
    })
  })

  it('初期状態ではデータが空', () => {
    expect(wrapper.vm.activities).toEqual([])
    expect(wrapper.vm.totalTimePerCategory).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('fetchData: 正常なデータ取得', async () => {
    const mockData = {
      activities: [
        { date: '2024-01-01', category: '仕事', name: 'テスト', contents: '内容', duration_seconds: 3600 }
      ],
      total_time_per_category: [
        { category: '仕事', total_time: '1時間' }
      ]
    }

    // APIモックの設定
    const { default: apiFacade } = await import('../../services/apiFacade')
    apiFacade.getAnalysisData.mockResolvedValue(mockData)

    await wrapper.vm.fetchData()

    expect(apiFacade.getAnalysisData).toHaveBeenCalledWith({
      userId: 'test-user-id',
      startDate: expect.any(String),
      endDate: expect.any(String)
    })
    expect(wrapper.vm.activities).toEqual(mockData.activities)
    expect(wrapper.vm.totalTimePerCategory).toEqual(mockData.total_time_per_category)
    expect(wrapper.vm.loading).toBe(false)
  })

  it('fetchData: エラー時の処理', async () => {
    // 初期データを設定
    wrapper.vm.activities = [{ id: 1, name: 'テスト' }]
    wrapper.vm.totalTimePerCategory = [{ category: '仕事', total_time: '1時間' }]

    // APIモックの設定
    const { default: apiFacade } = await import('../../services/apiFacade')
    apiFacade.getAnalysisData.mockRejectedValue(new Error('API Error'))

    await wrapper.vm.fetchData()

    // エラー時はデータが変更されない（実際の実装に合わせる）
    expect(wrapper.vm.activities).toEqual([{ id: 1, name: 'テスト' }])
    expect(wrapper.vm.totalTimePerCategory).toEqual([{ category: '仕事', total_time: '1時間' }])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('fetchData: ローディング状態の管理', async () => {
    // APIモックの設定
    const { default: apiFacade } = await import('../../services/apiFacade')
    apiFacade.getAnalysisData.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ activities: [], total_time_per_category: [] }), 100))
    )

    const fetchPromise = wrapper.vm.fetchData()
    
    // ローディング中
    expect(wrapper.vm.loading).toBe(true)
    
    await fetchPromise
    
    // ローディング完了
    expect(wrapper.vm.loading).toBe(false)
  })

  it('formatToISODate: 日付のフォーマット', () => {
    const date = new Date('2024-01-01')
    const formatted = wrapper.vm.formatToISODate(date)
    expect(formatted).toBe('2024-01-01')
  })

  it('formatToISODate: 無効な日付の場合は空文字', () => {
    const formatted = wrapper.vm.formatToISODate('invalid-date')
    expect(formatted).toBe('')
  })

  it('formatDate: 日付文字列のフォーマット', () => {
    const formatted = wrapper.vm.formatDate('2024-01-01T00:00:00')
    expect(formatted).toBe('2024-01-01')
  })

  it('convertToHoursMinutes: 秒数を時間・分に変換', () => {
    const seconds = 3661 // 1時間1分1秒
    const converted = wrapper.vm.convertToHoursMinutes(seconds)
    expect(converted).toBe('1時間1分')
  })

  it('convertToHoursMinutes: 0秒の場合は空文字', () => {
    const converted = wrapper.vm.convertToHoursMinutes(0)
    expect(converted).toBe('')
  })

  it('convertToHoursMinutes: 無効な値の場合は空文字', () => {
    const converted = wrapper.vm.convertToHoursMinutes(null)
    expect(converted).toBe('')
  })
})
