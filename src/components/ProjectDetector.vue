<template>
  <div class="project-detector">
    <div class="detector-header">
      <h2>📊 项目检测</h2>
      <button @click="runDetection" :disabled="isDetecting" class="detect-btn">
        {{ isDetecting ? '检测中...' : '开始检测' }}
      </button>
    </div>

    <div class="detection-results">
      <!-- 整体状态 -->
      <div class="status-card overall-status" :class="overallStatus">
        <h3>整体状态</h3>
        <div class="status-indicator">
          <span class="status-icon">{{ getStatusIcon(overallStatus) }}</span>
          <span class="status-text">{{ getStatusText(overallStatus) }}</span>
        </div>
        <p class="last-check">上次检测: {{ lastCheckTime || '未检测' }}</p>
      </div>

      <!-- 前端状态 -->
      <div class="status-card">
        <h3>🎨 前端状态</h3>
        <div class="check-items">
          <div class="check-item" :class="detectionResults.frontend.vue">
            <span class="check-icon">{{ getCheckIcon(detectionResults.frontend.vue) }}</span>
            <span>Vue 运行环境</span>
          </div>
          <div class="check-item" :class="detectionResults.frontend.jspspy">
            <span class="check-icon">{{ getCheckIcon(detectionResults.frontend.jspspy) }}</span>
            <span>JSpspy 核心引擎</span>
          </div>
          <div class="check-item" :class="detectionResults.frontend.browserAPIs">
            <span class="check-icon">{{ getCheckIcon(detectionResults.frontend.browserAPIs) }}</span>
            <span>浏览器 API 支持</span>
          </div>
        </div>
      </div>

      <!-- 后端连接 -->
      <div class="status-card">
        <h3>🔌 后端连接</h3>
        <div class="check-items">
          <div class="check-item" :class="detectionResults.backend.health">
            <span class="check-icon">{{ getCheckIcon(detectionResults.backend.health) }}</span>
            <span>服务器健康检查</span>
          </div>
          <div class="check-item" :class="detectionResults.backend.api">
            <span class="check-icon">{{ getCheckIcon(detectionResults.backend.api) }}</span>
            <span>API 接口可用性</span>
          </div>
          <div class="check-item" :class="detectionResults.backend.storage">
            <span class="check-icon">{{ getCheckIcon(detectionResults.backend.storage) }}</span>
            <span>数据存储功能</span>
          </div>
        </div>
        <div class="server-info" v-if="serverInfo">
          <p>服务器端口: {{ serverInfo.port }}</p>
          <p>记录数量: {{ serverInfo.records }}</p>
        </div>
      </div>

      <!-- Hook 功能状态 -->
      <div class="status-card">
        <h3>🎣 Hook 功能</h3>
        <div class="check-items">
          <div class="check-item" :class="detectionResults.hooks.fetch">
            <span class="check-icon">{{ getCheckIcon(detectionResults.hooks.fetch) }}</span>
            <span>Fetch Hook</span>
          </div>
          <div class="check-item" :class="detectionResults.hooks.xhr">
            <span class="check-icon">{{ getCheckIcon(detectionResults.hooks.xhr) }}</span>
            <span>XHR Hook</span>
          </div>
          <div class="check-item" :class="detectionResults.hooks.storage">
            <span class="check-icon">{{ getCheckIcon(detectionResults.hooks.storage) }}</span>
            <span>Storage Hook</span>
          </div>
          <div class="check-item" :class="detectionResults.hooks.cookie">
            <span class="check-icon">{{ getCheckIcon(detectionResults.hooks.cookie) }}</span>
            <span>Cookie Hook</span>
          </div>
        </div>
      </div>

      <!-- 性能指标 -->
      <div class="status-card">
        <h3>⚡ 性能指标</h3>
        <div class="performance-metrics">
          <div class="metric">
            <span class="metric-label">响应时间</span>
            <span class="metric-value">{{ performanceMetrics.responseTime }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">内存使用</span>
            <span class="metric-value">{{ performanceMetrics.memory }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">检测耗时</span>
            <span class="metric-value">{{ performanceMetrics.detectionTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细日志 -->
    <div class="detection-logs" v-if="detectionLogs.length > 0">
      <h3>📝 检测日志</h3>
      <div class="logs-container">
        <div v-for="(log, index) in detectionLogs" :key="index" class="log-item" :class="log.level">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const isDetecting = ref(false)
const lastCheckTime = ref('')
const serverInfo = ref(null)
const detectionLogs = ref([])

const detectionResults = ref({
  frontend: {
    vue: 'pending',
    jspspy: 'pending',
    browserAPIs: 'pending'
  },
  backend: {
    health: 'pending',
    api: 'pending',
    storage: 'pending'
  },
  hooks: {
    fetch: 'pending',
    xhr: 'pending',
    storage: 'pending',
    cookie: 'pending'
  }
})

const performanceMetrics = ref({
  responseTime: '-',
  memory: '-',
  detectionTime: '-'
})

const overallStatus = computed(() => {
  const allResults = [
    ...Object.values(detectionResults.value.frontend),
    ...Object.values(detectionResults.value.backend),
    ...Object.values(detectionResults.value.hooks)
  ]

  if (allResults.includes('error')) return 'error'
  if (allResults.includes('warning')) return 'warning'
  if (allResults.every(r => r === 'success')) return 'success'
  return 'pending'
})

const addLog = (message, level = 'info') => {
  const now = new Date()
  const time = now.toLocaleTimeString('zh-CN')
  detectionLogs.value.unshift({ time, message, level })
  if (detectionLogs.value.length > 50) {
    detectionLogs.value.pop()
  }
}

const getStatusIcon = (status) => {
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    pending: '⏳'
  }
  return icons[status] || '❓'
}

const getStatusText = (status) => {
  const texts = {
    success: '运行正常',
    warning: '部分功能异常',
    error: '检测到错误',
    pending: '等待检测'
  }
  return texts[status] || '未知状态'
}

const getCheckIcon = (status) => {
  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✗',
    pending: '○'
  }
  return icons[status] || '?'
}

const checkFrontend = async () => {
  addLog('开始检测前端环境...')

  // 检测 Vue
  try {
    if (window.__VUE__) {
      detectionResults.value.frontend.vue = 'success'
      addLog('Vue 运行环境: 正常', 'success')
    } else {
      detectionResults.value.frontend.vue = 'warning'
      addLog('Vue 运行环境: 未检测到', 'warning')
    }
  } catch (e) {
    detectionResults.value.frontend.vue = 'error'
    addLog('Vue 运行环境: 检测失败', 'error')
  }

  // 检测 JSpspy
  try {
    if (window.jspspy && typeof window.jspspy.getStatus === 'function') {
      detectionResults.value.frontend.jspspy = 'success'
      addLog('JSpspy 核心引擎: 正常', 'success')
    } else {
      detectionResults.value.frontend.jspspy = 'error'
      addLog('JSpspy 核心引擎: 未找到', 'error')
    }
  } catch (e) {
    detectionResults.value.frontend.jspspy = 'error'
    addLog('JSpspy 核心引擎: 检测失败', 'error')
  }

  // 检测浏览器 API
  try {
    const requiredAPIs = ['fetch', 'XMLHttpRequest', 'localStorage', 'sessionStorage']
    const missingAPIs = requiredAPIs.filter(api => !window[api])

    if (missingAPIs.length === 0) {
      detectionResults.value.frontend.browserAPIs = 'success'
      addLog('浏览器 API 支持: 完整', 'success')
    } else {
      detectionResults.value.frontend.browserAPIs = 'warning'
      addLog(`浏览器 API 支持: 缺失 ${missingAPIs.join(', ')}`, 'warning')
    }
  } catch (e) {
    detectionResults.value.frontend.browserAPIs = 'error'
    addLog('浏览器 API 支持: 检测失败', 'error')
  }
}

const checkBackend = async () => {
  addLog('开始检测后端连接...')

  const startTime = Date.now()

  // 检测健康状态
  try {
    const response = await axios.get('/api/health', { timeout: 5000 })
    const endTime = Date.now()
    const responseTime = endTime - startTime

    if (response.data.success) {
      detectionResults.value.backend.health = 'success'
      performanceMetrics.value.responseTime = `${responseTime}ms`
      serverInfo.value = {
        port: response.data.port,
        records: response.data.records
      }
      addLog(`服务器健康检查: 正常 (${responseTime}ms)`, 'success')
    } else {
      detectionResults.value.backend.health = 'warning'
      addLog('服务器健康检查: 响应异常', 'warning')
    }
  } catch (e) {
    detectionResults.value.backend.health = 'error'
    addLog(`服务器健康检查: 连接失败 - ${e.message}`, 'error')
  }

  // 检测 API 可用性
  try {
    const response = await axios.get('/api/config', { timeout: 5000 })
    if (response.data.success) {
      detectionResults.value.backend.api = 'success'
      addLog('API 接口: 可用', 'success')
    } else {
      detectionResults.value.backend.api = 'warning'
      addLog('API 接口: 响应异常', 'warning')
    }
  } catch (e) {
    detectionResults.value.backend.api = 'error'
    addLog(`API 接口: 不可用 - ${e.message}`, 'error')
  }

  // 检测数据存储
  try {
    const response = await axios.get('/api/spy/records?limit=1', { timeout: 5000 })
    if (response.data.success !== undefined) {
      detectionResults.value.backend.storage = 'success'
      addLog('数据存储: 正常', 'success')
    } else {
      detectionResults.value.backend.storage = 'warning'
      addLog('数据存储: 响应异常', 'warning')
    }
  } catch (e) {
    detectionResults.value.backend.storage = 'error'
    addLog(`数据存储: 异常 - ${e.message}`, 'error')
  }
}

const checkHooks = async () => {
  addLog('开始检测 Hook 功能...')

  if (!window.jspspy) {
    detectionResults.value.hooks.fetch = 'error'
    detectionResults.value.hooks.xhr = 'error'
    detectionResults.value.hooks.storage = 'error'
    detectionResults.value.hooks.cookie = 'error'
    addLog('Hook 功能: JSpspy 未初始化', 'error')
    return
  }

  try {
    const status = window.jspspy.getStatus()

    // 检测 Fetch Hook
    if (status.fetch !== undefined) {
      detectionResults.value.hooks.fetch = status.fetch ? 'success' : 'warning'
      addLog(`Fetch Hook: ${status.fetch ? '已启用' : '未启用'}`, status.fetch ? 'success' : 'info')
    } else {
      detectionResults.value.hooks.fetch = 'error'
      addLog('Fetch Hook: 检测失败', 'error')
    }

    // 检测 XHR Hook
    if (status.xhr !== undefined) {
      detectionResults.value.hooks.xhr = status.xhr ? 'success' : 'warning'
      addLog(`XHR Hook: ${status.xhr ? '已启用' : '未启用'}`, status.xhr ? 'success' : 'info')
    } else {
      detectionResults.value.hooks.xhr = 'error'
      addLog('XHR Hook: 检测失败', 'error')
    }

    // 检测 Storage Hook
    if (status.localStorage !== undefined) {
      detectionResults.value.hooks.storage = status.localStorage ? 'success' : 'warning'
      addLog(`Storage Hook: ${status.localStorage ? '已启用' : '未启用'}`, status.localStorage ? 'success' : 'info')
    } else {
      detectionResults.value.hooks.storage = 'error'
      addLog('Storage Hook: 检测失败', 'error')
    }

    // 检测 Cookie Hook
    if (status.cookie !== undefined) {
      detectionResults.value.hooks.cookie = status.cookie ? 'success' : 'warning'
      addLog(`Cookie Hook: ${status.cookie ? '已启用' : '未启用'}`, status.cookie ? 'success' : 'info')
    } else {
      detectionResults.value.hooks.cookie = 'error'
      addLog('Cookie Hook: 检测失败', 'error')
    }
  } catch (e) {
    detectionResults.value.hooks.fetch = 'error'
    detectionResults.value.hooks.xhr = 'error'
    detectionResults.value.hooks.storage = 'error'
    detectionResults.value.hooks.cookie = 'error'
    addLog(`Hook 功能: 检测失败 - ${e.message}`, 'error')
  }
}

const checkPerformance = () => {
  addLog('开始检测性能指标...')

  // 检测内存使用
  if (performance.memory) {
    const usedMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
    const totalMB = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
    performanceMetrics.value.memory = `${usedMB}MB / ${totalMB}MB`
    addLog(`内存使用: ${usedMB}MB / ${totalMB}MB`, 'info')
  } else {
    performanceMetrics.value.memory = '不支持'
    addLog('内存使用: 浏览器不支持性能监控', 'info')
  }
}

const runDetection = async () => {
  if (isDetecting.value) return

  isDetecting.value = true
  detectionLogs.value = []
  const detectionStartTime = Date.now()

  addLog('========== 开始项目检测 ==========', 'info')

  try {
    // 重置所有结果
    detectionResults.value = {
      frontend: {
        vue: 'pending',
        jspspy: 'pending',
        browserAPIs: 'pending'
      },
      backend: {
        health: 'pending',
        api: 'pending',
        storage: 'pending'
      },
      hooks: {
        fetch: 'pending',
        xhr: 'pending',
        storage: 'pending',
        cookie: 'pending'
      }
    }

    performanceMetrics.value = {
      responseTime: '-',
      memory: '-',
      detectionTime: '-'
    }

    // 依次执行检测
    await checkFrontend()
    await checkBackend()
    await checkHooks()
    checkPerformance()

    const detectionEndTime = Date.now()
    const totalTime = detectionEndTime - detectionStartTime
    performanceMetrics.value.detectionTime = `${totalTime}ms`

    lastCheckTime.value = new Date().toLocaleString('zh-CN')
    addLog(`========== 检测完成 (耗时 ${totalTime}ms) ==========`, 'success')
  } catch (e) {
    addLog(`检测过程发生错误: ${e.message}`, 'error')
  } finally {
    isDetecting.value = false
  }
}

// 自动运行一次检测
setTimeout(() => {
  runDetection()
}, 500)
</script>

<style scoped>
.project-detector {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #1a1a1a;
  color: #e0e0e0;
  overflow-y: auto;
}

.detector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #00ff88;
}

.detector-header h2 {
  margin: 0;
  font-size: 24px;
  color: #00ff88;
}

.detect-btn {
  padding: 10px 20px;
  background: #00ff88;
  color: #1a1a1a;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.detect-btn:hover:not(:disabled) {
  background: #00cc6a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 255, 136, 0.3);
}

.detect-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.detection-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.status-card {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #444;
  transition: all 0.3s ease;
}

.status-card:hover {
  border-color: #00ff88;
  box-shadow: 0 4px 12px rgba(0, 255, 136, 0.1);
}

.status-card h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #00ff88;
}

.overall-status {
  grid-column: 1 / -1;
}

.overall-status .status-indicator {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 15px 0;
}

.overall-status .status-icon {
  font-size: 48px;
}

.overall-status .status-text {
  font-size: 24px;
  font-weight: bold;
}

.overall-status.success .status-text {
  color: #00ff88;
}

.overall-status.warning .status-text {
  color: #f39c12;
}

.overall-status.error .status-text {
  color: #e74c3c;
}

.overall-status.pending .status-text {
  color: #999;
}

.last-check {
  margin: 10px 0 0 0;
  font-size: 14px;
  color: #999;
}

.check-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #1a1a1a;
  border-radius: 5px;
  border-left: 3px solid #666;
  transition: all 0.3s ease;
}

.check-item.success {
  border-left-color: #00ff88;
}

.check-item.warning {
  border-left-color: #f39c12;
}

.check-item.error {
  border-left-color: #e74c3c;
}

.check-item.pending {
  border-left-color: #666;
}

.check-icon {
  font-weight: bold;
  font-size: 16px;
}

.check-item.success .check-icon {
  color: #00ff88;
}

.check-item.warning .check-icon {
  color: #f39c12;
}

.check-item.error .check-icon {
  color: #e74c3c;
}

.check-item.pending .check-icon {
  color: #666;
}

.server-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #444;
}

.server-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #999;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #1a1a1a;
  border-radius: 5px;
}

.metric-label {
  color: #999;
  font-size: 14px;
}

.metric-value {
  color: #00ff88;
  font-weight: bold;
  font-size: 16px;
}

.detection-logs {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #444;
}

.detection-logs h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #00ff88;
}

.logs-container {
  max-height: 300px;
  overflow-y: auto;
  background: #1a1a1a;
  border-radius: 5px;
  padding: 10px;
}

.log-item {
  padding: 8px 12px;
  margin-bottom: 5px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Courier New', monospace;
  display: flex;
  gap: 10px;
  border-left: 3px solid #666;
}

.log-item.success {
  border-left-color: #00ff88;
  background: rgba(0, 255, 136, 0.05);
}

.log-item.warning {
  border-left-color: #f39c12;
  background: rgba(243, 156, 18, 0.05);
}

.log-item.error {
  border-left-color: #e74c3c;
  background: rgba(231, 76, 60, 0.05);
}

.log-item.info {
  border-left-color: #3498db;
  background: rgba(52, 152, 219, 0.05);
}

.log-time {
  color: #999;
  white-space: nowrap;
}

.log-message {
  color: #e0e0e0;
}

/* 滚动条样式 */
.logs-container::-webkit-scrollbar {
  width: 8px;
}

.logs-container::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 4px;
}

.logs-container::-webkit-scrollbar-thumb {
  background: #00ff88;
  border-radius: 4px;
}

.logs-container::-webkit-scrollbar-thumb:hover {
  background: #00cc6a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detection-results {
    grid-template-columns: 1fr;
  }

  .detector-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .detect-btn {
    width: 100%;
  }
}
</style>
