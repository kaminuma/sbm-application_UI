import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Header from '../../components/Header.vue'

describe('Header.vue ロジックテスト', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Header, {
      props: {
        showMenu: true
      }
    })
  })

  it('props: showMenuがtrueの場合、メニューアイコンが表示', () => {
    expect(wrapper.vm.showMenu).toBe(true)
  })

  it('props: showMenuがfalseの場合、メニューアイコンが非表示', async () => {
    await wrapper.setProps({ showMenu: false })
    expect(wrapper.vm.showMenu).toBe(false)
  })

  it('メニューアイコンクリック時にtoggle-sidebarイベントが発火する', async () => {
    await wrapper.find('.menu-icon').trigger('click')
    expect(wrapper.emitted('toggle-sidebar')).toBeTruthy()
  })

  it('デフォルトのshowMenu値がtrue', () => {
    const defaultWrapper = shallowMount(Header)
    expect(defaultWrapper.vm.showMenu).toBe(true)
  })
})
