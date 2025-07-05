import { describe, it, expect, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import DoughnutChart from '../../components/DoughnutChart.vue'

describe('DoughnutChart.vue ロジックテスト', () => {
  let wrapper

  const mockChartData = {
    labels: ['運動', '仕事', '学習'],
    datasets: [{
      data: [2, 8, 4],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  }

  const mockChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  }

  beforeEach(() => {
    wrapper = shallowMount(DoughnutChart, {
      props: {
        chartData: mockChartData,
        chartOptions: mockChartOptions
      },
      global: {
        stubs: {
          'Doughnut': true
        }
      }
    })
  })

  it('props: chartDataが正しく受け渡される', () => {
    expect(wrapper.vm.chartData).toEqual(mockChartData)
  })

  it('props: chartOptionsが正しく受け渡される', () => {
    expect(wrapper.vm.chartOptions).toEqual(mockChartOptions)
  })

  it('chartDataのlabelsが正しい', () => {
    expect(wrapper.vm.chartData.labels).toEqual(['運動', '仕事', '学習'])
  })

  it('chartDataのdatasetsが正しい', () => {
    expect(wrapper.vm.chartData.datasets[0].data).toEqual([2, 8, 4])
  })

  it('chartOptionsのresponsiveがtrue', () => {
    expect(wrapper.vm.chartOptions.responsive).toBe(true)
  })

  it('chartOptionsのmaintainAspectRatioがfalse', () => {
    expect(wrapper.vm.chartOptions.maintainAspectRatio).toBe(false)
  })
})
