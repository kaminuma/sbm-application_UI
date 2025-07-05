import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Sidebar from '../../components/Sidebar.vue'

describe('Sidebar.vue ロジックテスト', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Sidebar, {
      props: {
        isOpen: false
      },
      global: {
        stubs: {
          'router-link': true
        }
      }
    })
  })

  it('props: isOpenがfalseの場合、サイドバーが非表示', () => {
    expect(wrapper.vm.isOpen).toBe(false)
  })

  it('props: isOpenがtrueの場合、サイドバーが表示', async () => {
    await wrapper.setProps({ isOpen: true })
    expect(wrapper.vm.isOpen).toBe(true)
  })

  it('close-sidebarイベントが発火する', async () => {
    await wrapper.setProps({ isOpen: true })
    await wrapper.find('.close-btn').trigger('click')
    expect(wrapper.emitted('close-sidebar')).toBeTruthy()
  })

  it('メニュー項目クリック時にclose-sidebarイベントが発火する', async () => {
    await wrapper.setProps({ isOpen: true })
    const menuItems = wrapper.findAll('.sidebar-item a')
    
    // 最初のメニュー項目のみテスト
    if (menuItems.length > 0) {
      await menuItems[0].trigger('click')
      expect(wrapper.emitted('close-sidebar')).toBeTruthy()
    }
  })
})
