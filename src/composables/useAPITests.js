// API接口测试逻辑
import { ref } from 'vue'
import axios from 'axios'

export function useAPITests(addLog) {
  const results = ref([])

  const runTests = async () => {
    addLog('开始API接口测试...', 'info')
    results.value = []

    // 测试1: 健康检查
    try {
      const startTime = Date.now()
      const response = await axios.get('/api/health')
      const endTime = Date.now()
      results.value.push({
        name: '健康检查接口',
        passed: response.data.status === 'ok',
        message: response.data.status === 'ok' ? '服务器运行正常' : '服务器状态异常',
        time: endTime - startTime
      })
      addLog('健康检查测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '健康检查接口',
        passed: false,
        message: `请求失败: ${error.message}`
      })
      addLog('健康检查测试失败', 'error')
    }

    // 测试2: 获取牌桌列表
    try {
      const startTime = Date.now()
      const response = await axios.get('/api/tables')
      const endTime = Date.now()
      const isArray = Array.isArray(response.data)
      results.value.push({
        name: '获取牌桌列表',
        passed: isArray,
        message: isArray ? `成功获取${response.data.length}个牌桌` : '返回数据格式错误',
        time: endTime - startTime
      })
      addLog('获取牌桌列表测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '获取牌桌列表',
        passed: false,
        message: `请求失败: ${error.message}`
      })
      addLog('获取牌桌列表测试失败', 'error')
    }

    // 测试3: 创建牌桌
    try {
      const startTime = Date.now()
      const response = await axios.post('/api/tables', {
        name: '自测房间',
        minBet: 100,
        maxPlayers: 3
      })
      const endTime = Date.now()
      const hasId = response.data && response.data.id
      results.value.push({
        name: '创建牌桌',
        passed: hasId,
        message: hasId ? `成功创建牌桌，ID: ${response.data.id}` : '创建失败，无返回ID',
        time: endTime - startTime
      })

      // 清理：删除测试创建的牌桌
      if (hasId) {
        await axios.delete(`/api/tables/${response.data.id}`)
      }
      addLog('创建牌桌测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '创建牌桌',
        passed: false,
        message: `请求失败: ${error.message}`
      })
      addLog('创建牌桌测试失败', 'error')
    }

    // 测试4: 加入牌桌
    try {
      const tablesResponse = await axios.get('/api/tables')
      if (tablesResponse.data.length > 0) {
        const tableId = tablesResponse.data[0].id
        const startTime = Date.now()
        const response = await axios.post(`/api/tables/${tableId}/join`, {
          playerId: 'test_player_' + Date.now()
        })
        const endTime = Date.now()
        results.value.push({
          name: '加入牌桌',
          passed: response.status === 200,
          message: '成功加入牌桌',
          time: endTime - startTime
        })
        addLog('加入牌桌测试完成', 'success')
      } else {
        results.value.push({
          name: '加入牌桌',
          passed: false,
          message: '没有可用的牌桌进行测试'
        })
      }
    } catch (error) {
      results.value.push({
        name: '加入牌桌',
        passed: false,
        message: `请求失败: ${error.message}`
      })
      addLog('加入牌桌测试失败', 'error')
    }

    // 测试5: 404错误处理
    try {
      const startTime = Date.now()
      await axios.get('/api/nonexistent')
      results.value.push({
        name: '404错误处理',
        passed: false,
        message: '应该返回404错误'
      })
    } catch (error) {
      const endTime = Date.now()
      results.value.push({
        name: '404错误处理',
        passed: error.response && error.response.status === 404,
        message: error.response?.status === 404 ? '正确处理404错误' : `意外错误: ${error.message}`,
        time: endTime - Date.now() + 100
      })
      addLog('404错误处理测试完成', 'success')
    }

    addLog('API测试全部完成', 'info')
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
