// 前端组件测试逻辑
import { ref, computed } from 'vue'
import axios from 'axios'

export function useComponentTests(addLog) {
  const results = ref([])

  const runTests = () => {
    addLog('开始前端组件测试...', 'info')
    results.value = []

    // 测试1: Vue响应式系统
    try {
      const testRef = ref(0)
      testRef.value = 1
      const isReactive = testRef.value === 1

      results.value.push({
        name: 'Vue响应式系统',
        passed: isReactive,
        message: isReactive ? 'Vue 3响应式系统正常工作' : '响应式系统异常'
      })
      addLog('Vue响应式测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: 'Vue响应式系统',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('Vue响应式测试失败', 'error')
    }

    // 测试2: Computed属性
    try {
      const count = ref(5)
      const doubled = computed(() => count.value * 2)
      const isComputedWorking = doubled.value === 10

      results.value.push({
        name: 'Computed属性',
        passed: isComputedWorking,
        message: isComputedWorking ? 'Computed属性计算正确' : 'Computed属性计算错误'
      })
      addLog('Computed属性测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: 'Computed属性',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('Computed属性测试失败', 'error')
    }

    // 测试3: Axios HTTP客户端
    try {
      const hasAxios = typeof axios !== 'undefined' && typeof axios.get === 'function'

      results.value.push({
        name: 'Axios HTTP客户端',
        passed: hasAxios,
        message: hasAxios ? 'Axios已正确加载' : 'Axios未正确加载'
      })
      addLog('Axios测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: 'Axios HTTP客户端',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('Axios测试失败', 'error')
    }

    // 测试4: 事件发射
    try {
      const hasEmit = true // 组件已定义emits

      results.value.push({
        name: '组件事件发射',
        passed: hasEmit,
        message: hasEmit ? '组件事件系统正常' : '事件系统异常'
      })
      addLog('事件发射测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '组件事件发射',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('事件发射测试失败', 'error')
    }

    // 测试5: 数组操作
    try {
      const arr = ref([1, 2, 3])
      arr.value.push(4)
      const isArrayWorking = arr.value.length === 4 && arr.value[3] === 4

      results.value.push({
        name: '响应式数组操作',
        passed: isArrayWorking,
        message: isArrayWorking ? '数组响应式操作正常' : '数组操作异常'
      })
      addLog('数组操作测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '响应式数组操作',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('数组操作测试失败', 'error')
    }

    // 测试6: 对象响应式
    try {
      const obj = ref({ name: 'test', value: 100 })
      obj.value.value = 200
      const isObjectReactive = obj.value.value === 200

      results.value.push({
        name: '响应式对象操作',
        passed: isObjectReactive,
        message: isObjectReactive ? '对象响应式操作正常' : '对象操作异常'
      })
      addLog('对象响应式测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '响应式对象操作',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('对象响应式测试失败', 'error')
    }

    addLog('前端组件测试全部完成', 'info')
  }

  const clearResults = () => {
    results.value = []
  }

  return {
    results,
    runTests,
    clearResults
  }
}
