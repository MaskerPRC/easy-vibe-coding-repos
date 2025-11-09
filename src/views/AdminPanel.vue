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

      <!-- WebShell 控制台卡片 -->
      <div class="admin-card full-width">
        <div class="card-header">
          <h2>WebShell 控制台</h2>
          <button @click="clearShellHistory" class="refresh-btn" :disabled="loading">
            清空历史
          </button>
        </div>
        <div class="webshell-container">
          <div class="webshell-input-section">
            <div class="input-wrapper">
              <span class="shell-prompt">$</span>
              <input
                v-model="shellCommand"
                @keyup.enter="executeShellCommand"
                type="text"
                placeholder="输入命令，如: ls -la, pwd, whoami, date 等..."
                class="shell-input"
                :disabled="shellLoading"
              />
            </div>
            <button
              @click="executeShellCommand"
              class="execute-btn"
              :disabled="shellLoading || !shellCommand"
            >
              <span v-if="!shellLoading">执行</span>
              <span v-else>执行中...</span>
            </button>
          </div>

          <div class="webshell-output-section">
            <div class="output-header">
              <span>输出结果</span>
              <span class="output-count">{{ shellHistory.length }} 条记录</span>
            </div>
            <div class="shell-output" ref="shellOutput">
              <div v-if="shellHistory.length === 0" class="empty-output">
                暂无命令执行记录，请在上方输入命令并执行
              </div>
              <div v-else>
                <div
                  v-for="(item, index) in shellHistory"
                  :key="index"
                  class="shell-history-item"
                >
                  <div class="shell-command-line">
                    <span class="command-prompt">$</span>
                    <span class="command-text">{{ item.command }}</span>
                    <span class="command-time">{{ formatShortTime(item.timestamp) }}</span>
                  </div>
                  <div v-if="item.stdout" class="shell-stdout">{{ item.stdout }}</div>
                  <div v-if="item.stderr" class="shell-stderr">{{ item.stderr }}</div>
                  <div v-if="item.error" class="shell-error">
                    错误: {{ item.error }}
                  </div>
                  <div v-if="!item.stdout && !item.stderr && !item.error && item.success" class="shell-success">
                    命令执行成功（无输出）
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="webshell-tips">
            <div class="tip-title">💡 使用提示：</div>
            <ul class="tip-list">
              <li>支持大部分常用的 Linux/Unix 命令，如: ls, pwd, whoami, date, df, free, ps 等</li>
              <li>按 Enter 键快速执行命令</li>
              <li>命令执行超时时间为 30 秒</li>
              <li>所有命令执行记录会保存在历史记录中，可随时查看</li>
            </ul>
          </div>
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
      shellCommand: '',
      shellLoading: false,
      shellHistory: [],
      apiEndpoints: [
        { method: 'GET', path: '/api/health', description: '健康检查' },
        { method: 'GET', path: '/api/data', description: '获取数据' },
        { method: 'POST', path: '/api/data', description: '更新数据' },
        { method: 'GET', path: '/api/config', description: '获取配置' },
        { method: 'GET', path: '/api/location', description: '获取位置信息' },
        { method: 'GET', path: '/api/weather', description: '获取天气数据' },
        { method: 'GET', path: '/api/admin/system', description: '获取系统信息' },
        { method: 'GET', path: '/api/admin/logs', description: '获取服务器日志' },
        { method: 'POST', path: '/api/admin/webshell', description: 'WebShell 命令执行' },
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
    },
    async executeShellCommand() {
      if (!this.shellCommand || this.shellCommand.trim() === '') {
        this.showError('请输入命令')
        return
      }

      try {
        this.shellLoading = true
        const command = this.shellCommand.trim()

        const response = await fetch('/api/admin/webshell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ command })
        })

        if (!response.ok) {
          throw new Error('命令执行请求失败')
        }

        const result = await response.json()

        // 添加到历史记录
        this.shellHistory.unshift({
          command: result.command,
          stdout: result.stdout,
          stderr: result.stderr,
          error: result.error,
          success: result.success,
          timestamp: result.timestamp
        })

        // 限制历史记录数量为100条
        if (this.shellHistory.length > 100) {
          this.shellHistory = this.shellHistory.slice(0, 100)
        }

        // 清空输入框
        this.shellCommand = ''

        // 滚动到顶部查看最新结果
        this.$nextTick(() => {
          if (this.$refs.shellOutput) {
            this.$refs.shellOutput.scrollTop = 0
          }
        })

        if (result.success && !result.stderr) {
          this.showSuccess('命令执行成功')
        } else if (result.stderr) {
          this.showError('命令执行有警告或错误输出')
        } else {
          this.showError('命令执行失败')
        }
      } catch (err) {
        this.showError('执行命令失败: ' + err.message)
      } finally {
        this.shellLoading = false
      }
    },
    clearShellHistory() {
      this.shellHistory = []
      this.showSuccess('历史记录已清空')
    },
    formatShortTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      // 如果是今天，只显示时间
      if (diff < 86400000 && date.getDate() === now.getDate()) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      // 否则显示日期和时间
      return date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
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

/* WebShell 样式 */
.webshell-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.webshell-input-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #1e1e1e;
  border-radius: 8px;
  border: 2px solid #333;
}

.shell-prompt {
  color: #22c55e;
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
}

.shell-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e5e7eb;
  font-family: monospace;
  font-size: 1rem;
  outline: none;
}

.shell-input::placeholder {
  color: #6b7280;
}

.shell-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.execute-btn {
  padding: 0.75rem 2rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.execute-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.execute-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.webshell-output-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #333;
}

.output-count {
  font-size: 0.9rem;
  color: #666;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.shell-output {
  max-height: 500px;
  overflow-y: auto;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 1rem;
  font-family: monospace;
  border: 2px solid #333;
}

.empty-output {
  color: #6b7280;
  text-align: center;
  padding: 3rem 1rem;
  font-size: 0.95rem;
}

.shell-history-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #374151;
}

.shell-history-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.shell-command-line {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: #2d2d2d;
  border-radius: 6px;
}

.command-prompt {
  color: #22c55e;
  font-weight: bold;
  font-size: 1rem;
}

.command-text {
  flex: 1;
  color: #e5e7eb;
  font-weight: 500;
}

.command-time {
  color: #9ca3af;
  font-size: 0.85rem;
}

.shell-stdout {
  color: #e5e7eb;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 0.75rem;
  background: #0f172a;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.shell-stderr {
  color: #fbbf24;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 0.75rem;
  background: #422006;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.shell-error {
  color: #fca5a5;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 0.75rem;
  background: #450a0a;
  border-radius: 6px;
  border-left: 3px solid #ef4444;
  margin-top: 0.5rem;
  line-height: 1.5;
}

.shell-success {
  color: #86efac;
  padding: 0.75rem;
  background: #052e16;
  border-radius: 6px;
  border-left: 3px solid #22c55e;
  margin-top: 0.5rem;
}

.webshell-tips {
  background: #f0f9ff;
  border: 2px solid #bfdbfe;
  border-radius: 8px;
  padding: 1rem 1.5rem;
}

.tip-title {
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.tip-list {
  margin: 0;
  padding-left: 1.5rem;
  color: #1e3a8a;
}

.tip-list li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.tip-list li:last-child {
  margin-bottom: 0;
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

  .webshell-input-section {
    flex-direction: column;
    align-items: stretch;
  }

  .execute-btn {
    width: 100%;
  }
}
</style>
