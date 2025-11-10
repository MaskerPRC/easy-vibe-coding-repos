<template>
  <div class="system-info">
    <div class="info-header">
      <h2>系统信息</h2>
      <button @click="loadData" :disabled="loading" class="btn-refresh">
        {{ loading ? '加载中...' : '刷新' }}
      </button>
    </div>

    <div v-if="loading && !systemData" class="loading">
      <div class="loading-spinner"></div>
      <p>正在加载系统信息...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>加载失败: {{ error }}</p>
      <button @click="loadData" class="btn-retry">重试</button>
    </div>

    <div v-else class="info-content">
      <!-- 系统基本信息 -->
      <div class="info-card">
        <h3>基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">操作系统:</span>
            <span class="info-value">{{ systemData.platform }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">系统类型:</span>
            <span class="info-value">{{ systemData.type }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">系统版本:</span>
            <span class="info-value">{{ systemData.release }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">架构:</span>
            <span class="info-value">{{ systemData.arch }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">主机名:</span>
            <span class="info-value">{{ systemData.hostname }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Node版本:</span>
            <span class="info-value">{{ systemData.nodeVersion }}</span>
          </div>
        </div>
      </div>

      <!-- 资源信息 -->
      <div class="info-card">
        <h3>资源信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">CPU核心数:</span>
            <span class="info-value">{{ systemData.cpus }} 核</span>
          </div>
          <div class="info-item">
            <span class="info-label">总内存:</span>
            <span class="info-value">{{ formatMemory(systemData.totalMemory) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">空闲内存:</span>
            <span class="info-value">{{ formatMemory(systemData.freeMemory) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">已用内存:</span>
            <span class="info-value">{{ formatMemory(systemData.totalMemory - systemData.freeMemory) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">内存使用率:</span>
            <span class="info-value">{{ memoryUsagePercent }}%</span>
          </div>
          <div class="info-item">
            <span class="info-label">系统运行时间:</span>
            <span class="info-value">{{ formatUptime(systemData.uptime) }}</span>
          </div>
        </div>

        <!-- 内存使用图表 -->
        <div class="memory-chart">
          <div class="chart-label">内存使用情况</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: memoryUsagePercent + '%' }">
              {{ memoryUsagePercent }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="info-card">
        <h3>用户信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">用户名:</span>
            <span class="info-value">{{ systemData.user?.username }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">用户UID:</span>
            <span class="info-value">{{ systemData.user?.uid }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">用户GID:</span>
            <span class="info-value">{{ systemData.user?.gid }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">用户Shell:</span>
            <span class="info-value">{{ systemData.user?.shell }}</span>
          </div>
          <div class="info-item info-item-full">
            <span class="info-label">主目录:</span>
            <span class="info-value">{{ systemData.user?.homedir }}</span>
          </div>
        </div>
      </div>

      <!-- 工作目录 -->
      <div class="info-card">
        <h3>工作目录</h3>
        <div class="info-value-block">{{ systemData.cwd }}</div>
      </div>

      <!-- 环境变量 -->
      <div class="info-card">
        <h3>环境变量 <button @click="showEnvDialog" class="btn-small">查看全部</button></h3>
        <div class="env-preview">
          <div v-for="key in previewEnvKeys" :key="key" class="env-item">
            <span class="env-key">{{ key }}:</span>
            <span class="env-value">{{ truncate(envData[key], 60) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 环境变量对话框 -->
    <div v-if="envDialog.show" class="dialog-overlay" @click.self="closeEnvDialog">
      <div class="dialog">
        <div class="dialog-header">
          <h3>环境变量</h3>
          <div class="dialog-actions">
            <input
              v-model="envDialog.searchQuery"
              type="text"
              placeholder="搜索..."
              class="search-input"
            />
            <button @click="closeEnvDialog" class="btn-close">✕</button>
          </div>
        </div>
        <div class="dialog-body">
          <div class="env-list">
            <div
              v-for="key in filteredEnvKeys"
              :key="key"
              class="env-item-full"
            >
              <div class="env-key-full">{{ key }}</div>
              <div class="env-value-full">{{ envData[key] }}</div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button @click="closeEnvDialog" class="btn-secondary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const loading = ref(false);
const error = ref('');
const systemData = ref(null);
const envData = ref({});

const envDialog = ref({
  show: false,
  searchQuery: ''
});

// 预览的环境变量键
const previewEnvKeys = computed(() => {
  const keys = Object.keys(envData.value);
  const importantKeys = ['PATH', 'HOME', 'USER', 'SHELL', 'NODE_ENV', 'PORT'];
  return importantKeys.filter(key => keys.includes(key)).slice(0, 5);
});

// 过滤的环境变量键
const filteredEnvKeys = computed(() => {
  const keys = Object.keys(envData.value).sort();
  if (!envDialog.value.searchQuery) {
    return keys;
  }
  const query = envDialog.value.searchQuery.toLowerCase();
  return keys.filter(key =>
    key.toLowerCase().includes(query) ||
    envData.value[key].toLowerCase().includes(query)
  );
});

// 内存使用率
const memoryUsagePercent = computed(() => {
  if (!systemData.value) return 0;
  const used = systemData.value.totalMemory - systemData.value.freeMemory;
  const percent = (used / systemData.value.totalMemory) * 100;
  return percent.toFixed(1);
});

// 加载系统信息
const loadData = async () => {
  loading.value = true;
  error.value = '';

  try {
    // 加载系统信息
    const sysResponse = await axios.get('/api/system/info');
    if (sysResponse.data.success) {
      systemData.value = sysResponse.data.data;
    } else {
      throw new Error(sysResponse.data.message);
    }

    // 加载环境变量
    const envResponse = await axios.get('/api/system/env');
    if (envResponse.data.success) {
      envData.value = envResponse.data.data;
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 显示环境变量对话框
const showEnvDialog = () => {
  envDialog.value.show = true;
  envDialog.value.searchQuery = '';
};

// 关闭环境变量对话框
const closeEnvDialog = () => {
  envDialog.value.show = false;
};

// 格式化内存
const formatMemory = (bytes) => {
  if (!bytes) return '0 GB';
  const gb = bytes / 1024 / 1024 / 1024;
  return gb.toFixed(2) + ' GB';
};

// 格式化运行时间
const formatUptime = (seconds) => {
  if (!seconds) return '0天';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}天 ${hours}小时 ${minutes}分钟`;
};

// 截断文本
const truncate = (text, length) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.system-info {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1a;
  overflow-y: auto;
}

.info-header {
  padding: 20px;
  background: #2d2d2d;
  border-bottom: 2px solid #00ff88;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.info-header h2 {
  margin: 0;
  color: #00ff88;
  font-size: 20px;
}

.btn-refresh {
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-refresh:hover:not(:disabled) {
  background: #357abd;
}

.btn-refresh:disabled {
  background: #555;
  cursor: not-allowed;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #444;
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #e74c3c;
}

.btn-retry {
  margin-top: 20px;
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.info-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #2d2d2d;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 20px;
}

.info-card h3 {
  margin: 0 0 20px 0;
  color: #00ff88;
  font-size: 18px;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-small {
  padding: 5px 10px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.btn-small:hover {
  background: #357abd;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
}

.info-item-full {
  grid-column: 1 / -1;
}

.info-label {
  color: #999;
  font-weight: 600;
  min-width: 100px;
}

.info-value {
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  flex: 1;
  word-break: break-all;
}

.info-value-block {
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.memory-chart {
  margin-top: 20px;
}

.chart-label {
  color: #999;
  margin-bottom: 10px;
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 30px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  transition: width 0.5s ease;
}

.env-preview {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.env-item {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
}

.env-key {
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  min-width: 100px;
}

.env-value {
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  flex: 1;
  word-break: break-all;
}

/* 对话框样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #2d2d2d;
  border-radius: 8px;
  border: 1px solid #444;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  padding: 15px 20px;
  border-bottom: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.dialog-header h3 {
  margin: 0;
  color: #00ff88;
  font-size: 18px;
}

.dialog-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  padding: 8px 12px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  color: #e0e0e0;
  font-size: 14px;
  width: 250px;
}

.btn-close {
  background: none;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: #e74c3c;
}

.dialog-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.env-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.env-item-full {
  padding: 15px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
}

.env-key-full {
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.env-value-full {
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  word-break: break-all;
  line-height: 1.5;
}

.dialog-footer {
  padding: 15px 20px;
  border-top: 1px solid #444;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 10px 20px;
  background: #555;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #666;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
