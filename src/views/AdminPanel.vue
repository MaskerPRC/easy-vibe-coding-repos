<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>服务器带外管理面板</h1>
      <p class="admin-subtitle">Out-of-Band Server Management</p>
    </div>

    <div class="admin-container">
      <!-- 服务器状态卡片 -->
      <div class="admin-card">
        <div class="card-header">
          <h2>服务器状态</h2>
          <button @click="refreshServerStatus" class="refresh-btn" :disabled="loading">
            <span v-if="!loading">刷新</span>
            <span v-else>刷新中...</span>
          </button>
        </div>
        <div class="status-grid" v-if="serverStatus">
          <div class="status-item">
            <div class="status-label">状态</div>
            <div class="status-value" :class="serverStatus.status === 'healthy' ? 'status-healthy' : 'status-error'">
              {{ serverStatus.status === 'healthy' ? '运行中' : '异常' }}
            </div>
          </div>
          <div class="status-item">
            <div class="status-label">端口</div>
            <div class="status-value">{{ serverStatus.port }}</div>
          </div>
          <div class="status-item">
            <div class="status-label">启动时间</div>
            <div class="status-value">{{ formatTime(serverStatus.timestamp) }}</div>
          </div>
          <div class="status-item">
            <div class="status-label">运行时长</div>
            <div class="status-value">{{ serverStatus.uptime || 'N/A' }}</div>
          </div>
        </div>
        <div v-else class="loading-message">加载中...</div>
      </div>

      <!-- 系统信息卡片 -->
      <div class="admin-card">
        <div class="card-header">
          <h2>系统信息</h2>
        </div>
        <div class="info-grid" v-if="systemInfo">
          <div class="info-item">
            <span class="info-label">Node 版本:</span>
            <span class="info-value">{{ systemInfo.nodeVersion }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">平台:</span>
            <span class="info-value">{{ systemInfo.platform }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">内存使用:</span>
            <span class="info-value">{{ systemInfo.memoryUsage }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">CPU 架构:</span>
            <span class="info-value">{{ systemInfo.arch }}</span>
          </div>
        </div>
        <div v-else class="loading-message">加载中...</div>
      </div>

      <!-- 数据管理卡片 -->
      <div class="admin-card">
        <div class="card-header">
          <h2>数据管理</h2>
          <button @click="refreshData" class="refresh-btn" :disabled="loading">
            <span v-if="!loading">刷新</span>
            <span v-else>刷新中...</span>
          </button>
        </div>
        <div class="data-section" v-if="dataInfo">
          <div class="data-display">
            <div class="data-row">
              <span class="data-label">计数器:</span>
              <span class="data-value">{{ dataInfo.count }}</span>
            </div>
            <div class="data-row">
              <span class="data-label">项目数:</span>
              <span class="data-value">{{ dataInfo.items ? dataInfo.items.length : 0 }}</span>
            </div>
          </div>
          <div class="data-actions">
            <input
              v-model.number="newCount"
              type="number"
              placeholder="输入新的计数值"
              class="count-input"
            />
            <button @click="updateCount" class="action-btn" :disabled="loading">
              更新计数
            </button>
          </div>
        </div>
        <div v-else class="loading-message">加载中...</div>
      </div>

      <!-- 服务器日志卡片 -->
      <div class="admin-card full-width">
        <div class="card-header">
          <h2>服务器日志</h2>
          <button @click="refreshLogs" class="refresh-btn" :disabled="loading">
            <span v-if="!loading">刷新</span>
            <span v-else>刷新中...</span>
          </button>
        </div>
        <div class="logs-container">
          <div v-if="logs && logs.length > 0" class="logs-list">
            <div v-for="(log, index) in logs" :key="index" class="log-entry" :class="'log-' + log.level">
              <span class="log-time">{{ log.timestamp }}</span>
              <span class="log-level">{{ log.level.toUpperCase() }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
          <div v-else class="empty-message">暂无日志记录</div>
        </div>
      </div>

      <!-- API 端点卡片 -->
      <div class="admin-card full-width">
        <div class="card-header">
          <h2>API 端点</h2>
        </div>
        <div class="api-list">
          <div v-for="endpoint in apiEndpoints" :key="endpoint.path" class="api-item">
            <span class="api-method" :class="'method-' + endpoint.method.toLowerCase()">
              {{ endpoint.method }}
            </span>
            <span class="api-path">{{ endpoint.path }}</span>
            <span class="api-description">{{ endpoint.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-toast">
      {{ error }}
    </div>

    <!-- 成功提示 -->
    <div v-if="success" class="success-toast">
      {{ success }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
  data() {
    return {
      loading: false,
      error: null,
      success: null,
      serverStatus: null,
      systemInfo: null,
      dataInfo: null,
      logs: [],
      newCount: 0,
      apiEndpoints: [
        { method: 'GET', path: '/api/health', description: '健康检查' },
        { method: 'GET', path: '/api/data', description: '获取数据' },
        { method: 'POST', path: '/api/data', description: '更新数据' },
        { method: 'GET', path: '/api/config', description: '获取配置' },
        { method: 'GET', path: '/api/location', description: '获取位置信息' },
        { method: 'GET', path: '/api/weather', description: '获取天气数据' },
        { method: 'GET', path: '/api/admin/system', description: '获取系统信息' },
        { method: 'GET', path: '/api/admin/logs', description: '获取服务器日志' },
      ]
    }
  },
  mounted() {
    this.loadAllData()
  },
  methods: {
    async loadAllData() {
      await this.refreshServerStatus()
      await this.refreshSystemInfo()
      await this.refreshData()
      await this.refreshLogs()
    },
    async refreshServerStatus() {
      try {
        this.loading = true
        const response = await fetch('/api/health')
        if (!response.ok) throw new Error('获取服务器状态失败')
        this.serverStatus = await response.json()
      } catch (err) {
        this.showError('获取服务器状态失败: ' + err.message)
      } finally {
        this.loading = false
      }
    },
    async refreshSystemInfo() {
      try {
        this.loading = true
        const response = await fetch('/api/admin/system')
        if (!response.ok) throw new Error('获取系统信息失败')
        this.systemInfo = await response.json()
      } catch (err) {
        this.showError('获取系统信息失败: ' + err.message)
      } finally {
        this.loading = false
      }
    },
    async refreshData() {
      try {
        this.loading = true
        const response = await fetch('/api/data')
        if (!response.ok) throw new Error('获取数据失败')
        const result = await response.json()
        this.dataInfo = result.data
        this.newCount = result.data.count
      } catch (err) {
        this.showError('获取数据失败: ' + err.message)
      } finally {
        this.loading = false
      }
    },
    async refreshLogs() {
      try {
        this.loading = true
        const response = await fetch('/api/admin/logs')
        if (!response.ok) throw new Error('获取日志失败')
        const result = await response.json()
        this.logs = result.logs || []
      } catch (err) {
        this.showError('获取日志失败: ' + err.message)
      } finally {
        this.loading = false
      }
    },
    async updateCount() {
      try {
        this.loading = true
        const response = await fetch('/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ count: this.newCount })
        })
        if (!response.ok) throw new Error('更新数据失败')
        const result = await response.json()
        this.dataInfo = result.data
        this.showSuccess('数据更新成功')
      } catch (err) {
        this.showError('更新数据失败: ' + err.message)
      } finally {
        this.loading = false
      }
    },
    formatTime(timestamp) {
      if (!timestamp) return 'N/A'
      return new Date(timestamp).toLocaleString('zh-CN')
    },
    showError(message) {
      this.error = message
      setTimeout(() => {
        this.error = null
      }, 5000)
    },
    showSuccess(message) {
      this.success = message
      setTimeout(() => {
        this.success = null
      }, 3000)
    }
  }
}
</script>

<style scoped>
.admin-panel {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.admin-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.admin-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.admin-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.admin-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-card.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.card-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.status-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.status-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
  display: block;
}

.status-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.status-healthy {
  color: #22c55e;
}

.status-error {
  color: #ef4444;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 600;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.data-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.data-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.data-label {
  color: #666;
  font-weight: 500;
}

.data-value {
  color: #333;
  font-weight: 600;
}

.data-actions {
  display: flex;
  gap: 1rem;
}

.count-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
}

.count-input:focus {
  outline: none;
  border-color: #667eea;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logs-container {
  max-height: 400px;
  overflow-y: auto;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.9rem;
}

.log-time {
  color: #666;
  min-width: 160px;
}

.log-level {
  font-weight: 600;
  min-width: 60px;
}

.log-info .log-level {
  color: #3b82f6;
}

.log-warn .log-level {
  color: #f59e0b;
}

.log-error .log-level {
  color: #ef4444;
}

.log-message {
  color: #333;
  flex: 1;
}

.api-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.api-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.api-method {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.85rem;
  min-width: 60px;
  text-align: center;
}

.method-get {
  background: #dbeafe;
  color: #1e40af;
}

.method-post {
  background: #dcfce7;
  color: #166534;
}

.api-path {
  font-family: monospace;
  color: #333;
  font-weight: 500;
  min-width: 250px;
}

.api-description {
  color: #666;
  flex: 1;
}

.loading-message,
.empty-message {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.error-toast,
.success-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.error-toast {
  background: #ef4444;
}

.success-toast {
  background: #10b981;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .admin-container {
    grid-template-columns: 1fr;
  }

  .admin-header h1 {
    font-size: 1.75rem;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .data-actions {
    flex-direction: column;
  }

  .api-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
