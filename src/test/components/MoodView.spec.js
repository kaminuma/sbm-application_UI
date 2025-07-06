import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createStore } from 'vuex'
import { shallowMount } from '@vue/test-utils'
import MoodView from '../../components/MoodView.vue'

// シンプルなモック
vi.mock('../../services/apiFacade', () => ({
  default: {
    getMoodRecords: vi.fn(),
    createMoodRecord: vi.fn(),
    updateMoodRecord: vi.fn(),
    deleteMoodRecord: vi.fn(),
    getMoodAnalysis: vi.fn()
  }
}))

// EChartsモック
vi.mock('vue-echarts', () => ({
  default: {
    name: 'VChart',
    template: '<div class="v-chart-mock"></div>'
  }
}))

// VueDatePickerモック
vi.mock('@vuepic/vue-datepicker', () => ({
  default: {
    name: 'VueDatePicker',
    template: '<div class="vue-datepicker-mock"></div>'
  }
}))

const store = createStore({
  state: {
    userId: 'test-user-id'
  }
})

describe('MoodView.vue', () => {
  let wrapper

  beforeEach(() => {
    // モックをリセット
    vi.clearAllMocks()
    
    wrapper = shallowMount(MoodView, {
      global: {
        plugins: [store],
        stubs: {
          'v-dialog': true,
          'v-card': true,
          'v-card-title': true,
          'v-card-text': true,
          'v-card-actions': true,
          'v-form': true,
          'v-textarea': true,
          'v-btn': true,
          'v-spacer': true,
          'v-progress-circular': true,
          'v-icon': true,
          'v-chart': true,
          'VueDatePicker': true
        }
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('初期化', () => {
    it('コンポーネントが正しくマウントされる', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('初期状態が正しく設定される', () => {
      expect(wrapper.vm.showMoodDialog).toBe(false)
      expect(wrapper.vm.selectedMood).toBe(null)
      expect(wrapper.vm.moodNote).toBe('')
      expect(wrapper.vm.recentMoods).toEqual([])
      expect(wrapper.vm.loading).toBe(false)
    })

    it('気分オプションが正しく設定される', () => {
      const expectedOptions = [
        { value: 1, emoji: '😢', label: 'とても悪い' },
        { value: 2, emoji: '😕', label: '悪い' },
        { value: 3, emoji: '😐', label: '普通' },
        { value: 4, emoji: '🙂', label: '良い' },
        { value: 5, emoji: '😄', label: 'とても良い' }
      ]
      expect(wrapper.vm.moodOptions).toEqual(expectedOptions)
    })
  })

  describe('フォームバリデーション', () => {
    it('必須項目が揃っていない場合は無効', () => {
      wrapper.vm.selectedDate = ''
      wrapper.vm.selectedMood = null
      expect(wrapper.vm.isMoodFormValid).toBeFalsy()
    })

    it('必須項目が揃っている場合は有効', () => {
      wrapper.vm.selectedDate = '2024-01-01'
      wrapper.vm.selectedMood = 4
      expect(wrapper.vm.isMoodFormValid).toBe(true)
    })
  })

  describe('ユーティリティメソッド', () => {
    it('getMoodEmojiが正しい絵文字を返す', () => {
      expect(wrapper.vm.getMoodEmoji(1)).toBe('😢')
      expect(wrapper.vm.getMoodEmoji(2)).toBe('😕')
      expect(wrapper.vm.getMoodEmoji(3)).toBe('😐')
      expect(wrapper.vm.getMoodEmoji(4)).toBe('🙂')
      expect(wrapper.vm.getMoodEmoji(5)).toBe('😄')
      expect(wrapper.vm.getMoodEmoji(999)).toBe('😐') // 存在しない値
    })

    it('getMoodLabelが正しいラベルを返す', () => {
      expect(wrapper.vm.getMoodLabel(1)).toBe('とても悪い')
      expect(wrapper.vm.getMoodLabel(2)).toBe('悪い')
      expect(wrapper.vm.getMoodLabel(3)).toBe('普通')
      expect(wrapper.vm.getMoodLabel(4)).toBe('良い')
      expect(wrapper.vm.getMoodLabel(5)).toBe('とても良い')
      expect(wrapper.vm.getMoodLabel(999)).toBe('不明') // 存在しない値
    })

    it('formatDateが正しい形式で日付をフォーマットする', () => {
      const result = wrapper.vm.formatDate('2024-01-01')
      // 日本語ロケールでのフォーマット結果をチェック（スペース有無を許容）
      expect(result).toMatch(/1月\s*1日/)
    })

    it('closeMoodDialogが正しく動作する', () => {
      wrapper.vm.showMoodDialog = true
      wrapper.vm.selectedMood = 4
      wrapper.vm.moodNote = 'テストメモ'

      wrapper.vm.closeMoodDialog()

      expect(wrapper.vm.showMoodDialog).toBe(false)
      expect(wrapper.vm.selectedMood).toBe(null)
      expect(wrapper.vm.moodNote).toBe('')
    })
  })

  describe('計算プロパティ', () => {
    it('averageMoodが正しく計算される', () => {
      wrapper.vm.recentMoods = [
        { mood: 4 },
        { mood: 3 },
        { mood: 5 }
      ]
      expect(wrapper.vm.averageMood).toBe('4.0')
    })

    it('averageMoodが空配列の場合0を返す', () => {
      wrapper.vm.recentMoods = []
      expect(wrapper.vm.averageMood).toBe(0)
    })

    it('moodDistributionが正しく計算される', () => {
      wrapper.vm.recentMoods = [
        { mood: 4 },
        { mood: 3 },
        { mood: 4 },
        { mood: 5 }
      ]
      
      const distribution = wrapper.vm.moodDistribution
      expect(distribution).toHaveLength(5)
      expect(distribution.find(d => d.mood === 3).count).toBe(1)
      expect(distribution.find(d => d.mood === 4).count).toBe(2)
      expect(distribution.find(d => d.mood === 5).count).toBe(1)
    })

    it('moodDistributionが降順（5→1）でソートされる', () => {
      wrapper.vm.recentMoods = [
        { mood: 1 },
        { mood: 3 },
        { mood: 5 },
        { mood: 2 },
        { mood: 4 }
      ]
      
      const distribution = wrapper.vm.moodDistribution
      
      // ソート順序をチェック（5→4→3→2→1）
      expect(distribution[0].mood).toBe(5) // 最初が5
      expect(distribution[1].mood).toBe(4) // 2番目が4
      expect(distribution[2].mood).toBe(3) // 3番目が3
      expect(distribution[3].mood).toBe(2) // 4番目が2
      expect(distribution[4].mood).toBe(1) // 最後が1
      
      // カウント数も確認
      expect(distribution[0].count).toBe(1) // 5が1回
      expect(distribution[1].count).toBe(1) // 4が1回
      expect(distribution[2].count).toBe(1) // 3が1回
      expect(distribution[3].count).toBe(1) // 2が1回
      expect(distribution[4].count).toBe(1) // 1が1回
    })
  })

  describe('気分記録の編集', () => {
    it('気分記録の編集が正しく設定される', () => {
      const mood = {
        date: '2024-01-01',
        mood: 4,
        note: '編集前のメモ'
      }

      wrapper.vm.editMood(mood)

      expect(wrapper.vm.selectedDate).toBe('2024-01-01')
      expect(wrapper.vm.selectedMood).toBe(4)
      expect(wrapper.vm.moodNote).toBe('編集前のメモ')
      expect(wrapper.vm.showMoodDialog).toBe(true)
    })

    it('メモがない場合の編集処理', () => {
      const mood = {
        date: '2024-01-01',
        mood: 4,
        note: null
      }

      wrapper.vm.editMood(mood)

      expect(wrapper.vm.moodNote).toBe('')
    })
  })

  describe('グラフ期間設定', () => {
    it('setDefaultChartPeriodが正しく設定される', () => {
      const today = new Date()
      const weekAgo = new Date()
      weekAgo.setDate(today.getDate() - 6)

      wrapper.vm.setDefaultChartPeriod()

      expect(wrapper.vm.chartDateRange).toHaveLength(2)
      expect(wrapper.vm.chartDateRange[0]).toBe(weekAgo.toISOString().split('T')[0])
      expect(wrapper.vm.chartDateRange[1]).toBe(today.toISOString().split('T')[0])
    })
  })
}) 