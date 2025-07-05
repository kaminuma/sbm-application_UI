import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'
import { shallowMount } from '@vue/test-utils'
import ScheduleView from '../../components/ScheduleView.vue'

// APIモック
vi.mock('../../services/apiFacade', () => ({
  default: {
    getActivities: vi.fn(),
    createActivity: vi.fn(),
    updateActivity: vi.fn(),
    deleteActivity: vi.fn()
  }
}))

const store = createStore({
  state: {
    userId: 'test-user-id'
  }
})

describe('ScheduleView.vue ロジックテスト', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ScheduleView, {
      global: {
        plugins: [store],
        stubs: ['vue-cal', 'VueDatePicker']
      }
    })
  })

  it('フォームバリデーション: 空の状態では無効', () => {
    expect(wrapper.vm.isFormValid()).toBe(false)
  })

  it('フォームバリデーション: 必須項目が揃えば有効', () => {
    wrapper.vm.selectedEventTitle = 'テストイベント'
    wrapper.vm.selectedDate = '2024-01-01'
    wrapper.vm.selectedEventStartTime = '09:00'
    wrapper.vm.selectedEventEndTime = '10:00'
    expect(wrapper.vm.isFormValid()).toBe(true)
  })

  it('フォームバリデーション: 終了時刻が開始時刻より前なら無効', () => {
    wrapper.vm.selectedEventTitle = 'テストイベント'
    wrapper.vm.selectedDate = '2024-01-01'
    wrapper.vm.selectedEventStartTime = '10:00'
    wrapper.vm.selectedEventEndTime = '09:00'
    expect(wrapper.vm.isFormValid()).toBe(false)
  })

  it('フォームバリデーション: オブジェクト形式の時間でも有効', () => {
    wrapper.vm.selectedEventTitle = 'テストイベント'
    wrapper.vm.selectedDate = '2024-01-01'
    wrapper.vm.selectedEventStartTime = { hours: 9, minutes: 0 }
    wrapper.vm.selectedEventEndTime = { hours: 10, minutes: 0 }
    expect(wrapper.vm.isFormValid()).toBe(true)
  })

  it('フォームバリデーション: オブジェクト形式で終了時刻が開始時刻より前なら無効', () => {
    wrapper.vm.selectedEventTitle = 'テストイベント'
    wrapper.vm.selectedDate = '2024-01-01'
    wrapper.vm.selectedEventStartTime = { hours: 10, minutes: 0 }
    wrapper.vm.selectedEventEndTime = { hours: 9, minutes: 0 }
    expect(wrapper.vm.isFormValid()).toBe(false)
  })

  it('フォームバリデーション: 混合形式（文字列とオブジェクト）でも有効', () => {
    wrapper.vm.selectedEventTitle = 'テストイベント'
    wrapper.vm.selectedDate = '2024-01-01'
    wrapper.vm.selectedEventStartTime = '09:00'
    wrapper.vm.selectedEventEndTime = { hours: 10, minutes: 0 }
    expect(wrapper.vm.isFormValid()).toBe(true)
  })

  it('newCreate()で初期化される', () => {
    wrapper.vm.selectedEventTitle = 'aaa'
    wrapper.vm.selectedEventContents = 'bbb'
    wrapper.vm.selectedEventStartTime = '09:00'
    wrapper.vm.selectedEventEndTime = '10:00'
    wrapper.vm.selectedDate = '2024-01-01'
    wrapper.vm.isEdit = true
    wrapper.vm.createDialog = false

    wrapper.vm.newCreate()

    expect(wrapper.vm.selectedEventTitle).toBe('')
    expect(wrapper.vm.selectedEventContents).toBe('')
    expect(wrapper.vm.selectedEventStartTime).toBe('')
    expect(wrapper.vm.selectedEventEndTime).toBe('')
    expect(wrapper.vm.isEdit).toBe(false)
    expect(wrapper.vm.createDialog).toBe(true)
    expect(wrapper.vm.selectedDate).toMatch(/\d{4}-\d{2}-\d{2}/)
  })

  it('handleDateClick(null)で新規作成ダイアログが開く', () => {
    wrapper.vm.handleDateClick(null)
    expect(wrapper.vm.createDialog).toBe(true)
    expect(wrapper.vm.isEdit).toBe(false)
  })

  it('handleDateClick(イベント)で編集ダイアログが開く', () => {
    const event = {
      title: 'タイトル',
      contents: '内容',
      activityId: 1,
      start: '2024-01-01T09:00:00',
      end: '2024-01-01T10:00:00'
    }
    wrapper.vm.handleDateClick(event)
    expect(wrapper.vm.editDialog).toBe(true)
    expect(wrapper.vm.isEdit).toBe(true)
    expect(wrapper.vm.selectedEventTitle).toBe('タイトル')
    expect(wrapper.vm.selectedEventContents).toBe('内容')
    expect(wrapper.vm.selectedEventId).toBe(1)
    expect(wrapper.vm.selectedDate).toBe('2024-01-01')
    expect(wrapper.vm.selectedEventStartTime).toBe('09:00')
    expect(wrapper.vm.selectedEventEndTime).toBe('10:00')
  })

  it('formatTime: オブジェクト形式の時間を文字列に変換', () => {
    const timeObj = { hours: 9, minutes: 30 }
    wrapper.vm.formatTime(timeObj, 'start')
    expect(wrapper.vm.selectedAddEventStartTime).toBe('09:30')
  })

  it('formatTime: オブジェクト形式の時間を終了時間として設定', () => {
    const timeObj = { hours: 18, minutes: 45 }
    wrapper.vm.formatTime(timeObj, 'end')
    expect(wrapper.vm.selectedAddEventEndTime).toBe('18:45')
  })

  it('formatTime: minutesが不足している場合はundefinedが含まれる', () => {
    const invalidTimeObj = { hours: 9 } // minutesが不足
    wrapper.vm.formatTime(invalidTimeObj, 'start')
    expect(wrapper.vm.selectedAddEventStartTime).toBe('09:undefined')
  })

  it('formatTime: hoursがundefinedの場合は何もしない', () => {
    const invalidTimeObj = { minutes: 30 } // hoursが不足
    wrapper.vm.formatTime(invalidTimeObj, 'start')
    expect(wrapper.vm.selectedAddEventStartTime).toBe('')
  })

  it('formatTime: nullの場合は何もしない', () => {
    wrapper.vm.formatTime(null, 'start')
    expect(wrapper.vm.selectedAddEventStartTime).toBe('')
  })
})
