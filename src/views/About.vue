<template>
  <div class="about-page">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">关于服务器</h1>
      <p class="page-subtitle">服务器配置信息</p>
    </header>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载服务器信息...</p>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
      <button class="retry-btn" @click="fetchServerInfo">重试</button>
    </div>

    <!-- 服务器信息 -->
    <div v-else class="info-container">
      <!-- 服务器硬件信息 -->
      <div class="info-section">
        <div class="section-header">
          <span class="section-icon">🖥️</span>
          <h2 class="section-title">服务器硬件信息</h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">主机名</div>
            <div class="info-value">{{ serverInfo.server?.hostname || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">操作系统</div>
            <div class="info-value">{{ serverInfo.server?.platform || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">系统架构</div>
            <div class="info-value">{{ serverInfo.server?.architecture || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">CPU 型号</div>
            <div class="info-value">{{ serverInfo.server?.cpuModel || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">CPU 核心数</div>
            <div class="info-value">{{ serverInfo.server?.cpuCount || 'N/A' }} 核</div>
          </div>
          <div class="info-item">
            <div class="info-label">系统运行时间</div>
            <div class="info-value">{{ serverInfo.server?.uptime || 'N/A' }}</div>
          </div>
        </div>
      </div>

      <!-- 内存信息 -->
      <div class="info-section">
        <div class="section-header">
          <span class="section-icon">💾</span>
          <h2 class="section-title">内存信息</h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">总内存</div>
            <div class="info-value">{{ serverInfo.server?.totalMemory || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">可用内存</div>
            <div class="info-value">{{ serverInfo.server?.freeMemory || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">内存使用率</div>
            <div class="info-value">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: memoryUsagePercent + '%' }"></div>
              </div>
              <span class="progress-text">{{ memoryUsagePercent }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 应用程序信息 -->
      <div class="info-section">
        <div class="section-header">
          <span class="section-icon">⚙️</span>
          <h2 class="section-title">应用程序信息</h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">应用名称</div>
            <div class="info-value">{{ serverInfo.application?.name || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">应用版本</div>
            <div class="info-value">{{ serverInfo.application?.version || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">服务端口</div>
            <div class="info-value">{{ serverInfo.application?.port || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">运行环境</div>
            <div class="info-value">{{ serverInfo.application?.environment || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Node.js 版本</div>
            <div class="info-value">{{ serverInfo.server?.nodeVersion || 'N/A' }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">最后更新时间</div>
            <div class="info-value">{{ formatTime(serverInfo.timestamp) }}</div>
          </div>
        </div>
      </div>

      <!-- 功能特性 -->
      <div class="info-section">
        <div class="section-header">
          <span class="section-icon">✨</span>
          <h2 class="section-title">功能特性</h2>
        </div>
        <div class="features-list">
          <div
            v-for="(feature, index) in serverInfo.application?.features"
            :key="index"
            class="feature-tag"
          >
            {{ feature }}
          </div>
        </div>
      </div>

      <!-- 刷新按钮 -->
      <div class="action-bar">
        <button class="refresh-btn" @click="fetchServerInfo">
          <span class="btn-icon">🔄</span>
          刷新信息
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const serverInfo = ref({});
const loading = ref(true);
const error = ref(null);

// 计算内存使用率
const memoryUsagePercent = computed(() => {
  if (!serverInfo.value.server?.totalMemory || !serverInfo.value.server?.freeMemory) {
    return 0;
  }
  const total = parseFloat(serverInfo.value.server.totalMemory);
  const free = parseFloat(serverInfo.value.server.freeMemory);
  const used = total - free;
  return Math.round((used / total) * 100);
});

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

// 获取服务器信息
const fetchServerInfo = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('/api/server-info');
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }
    const data = await response.json();
    serverInfo.value = data;
  } catch (err) {
    console.error('获取服务器信息失败:', err);
    error.value = '获取服务器信息失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchServerInfo();
});
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #666;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误提示 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-message {
  font-size: 16px;
  color: #ff4d4f;
  margin: 0 0 24px 0;
}

.retry-btn {
  padding: 8px 24px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #40a9ff;
}

/* 信息容器 */
.info-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 信息区块 */
.info-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.section-icon {
  font-size: 28px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.info-item {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
  transition: background 0.3s;
}

.info-item:hover {
  background: #f0f7ff;
}

.info-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
  font-weight: 500;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

/* 进度条 */
.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 14px;
  color: #1890ff;
  font-weight: 600;
}

/* 功能特性 */
.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.feature-tag {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-tag:hover {
  transform: scale(1.05);
}

/* 操作栏 */
.action-bar {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

.btn-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-page {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
