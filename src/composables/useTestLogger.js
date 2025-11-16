// 测试日志管理的composable
import { ref } from 'vue'

export function useTestLogger() {
  const logs = ref([])

  const addLog = (message, type = 'info') => {
    const now = new Date()
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    logs.value.push({ timestamp, message, type })
  }

  const clearLogs = () => {
    logs.value = []
  }

  return {
    logs,
    addLog,
    clearLogs
  }
}
