import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createStore } from 'vuex'
import { shallowMount } from '@vue/test-utils'
import UploadView from '../../components/UploadView.vue'

// window.alertをモック
globalThis.alert = vi.fn()

// APIモック
vi.mock('../../services/apiFacade', () => ({
  default: {
    uploadExcelFile: vi.fn()
  }
}))

const store = createStore({
  state: {
    userId: 'test-user-id'
  }
})

describe('UploadView.vue ロジックテスト', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(UploadView, {
      global: {
        plugins: [store]
      }
    })
  })

  it('初期状態ではファイルが選択されていない', () => {
    expect(wrapper.vm.selectedFile).toBe(null)
    expect(wrapper.vm.fileName).toBe('')
  })

  it('onFileChange: ファイルが選択された場合', () => {
    const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' })
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    }

    wrapper.vm.onFileChange(mockEvent)

    expect(wrapper.vm.selectedFile).toBe(mockFile)
    expect(wrapper.vm.fileName).toBe('test.csv')
  })

  it('onFileChange: ファイルが選択されていない場合', () => {
    const mockEvent = {
      target: {
        files: []
      }
    }

    wrapper.vm.onFileChange(mockEvent)

    expect(wrapper.vm.selectedFile).toBe(undefined)
    expect(wrapper.vm.fileName).toBe('')
  })

  it('uploadFile: ファイルが選択されている場合の正常なアップロード', async () => {
    const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' })
    wrapper.vm.selectedFile = mockFile

    // APIモックの設定
    const { default: apiFacade } = await import('../../services/apiFacade')
    apiFacade.uploadExcelFile.mockResolvedValue({ success: true })

    await wrapper.vm.uploadFile()

    expect(apiFacade.uploadExcelFile).toHaveBeenCalled()
    expect(globalThis.alert).toHaveBeenCalledWith('ファイルが正常にアップロードされました！')
  })

  it('uploadFile: ファイルが選択されていない場合は何もしない', async () => {
    wrapper.vm.selectedFile = null

    await wrapper.vm.uploadFile()

    // APIが呼ばれないことを確認
    const { default: apiFacade } = await import('../../services/apiFacade')
    expect(apiFacade.uploadExcelFile).not.toHaveBeenCalled()
  })

  it('uploadFile: アップロードエラーの処理', async () => {
    const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' })
    wrapper.vm.selectedFile = mockFile

    // APIモックの設定
    const { default: apiFacade } = await import('../../services/apiFacade')
    apiFacade.uploadExcelFile.mockRejectedValue(new Error('Upload failed'))

    await wrapper.vm.uploadFile()

    expect(globalThis.alert).toHaveBeenCalledWith('ファイルのアップロードに失敗しました。')
  })
})
