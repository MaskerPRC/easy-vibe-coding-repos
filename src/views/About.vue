<template>
  <div class="about-page">
    <div class="container">
      <h1 class="title">服务器配置信息</h1>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>正在加载服务器信息...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="fetchServerInfo" class="retry-btn">重试</button>
      </div>

      <div v-else class="info-container">
        <!-- 服务器信息 -->
        <section class="info-section">
          <h2 class="section-title">服务器信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">操作系统平台:</span>
              <span class="value">{{ serverInfo.server.platform }}</span>
            </div>
            <div class="info-item">
              <span class="label">系统架构:</span>
              <span class="value">{{ serverInfo.server.architecture }}</span>
            </div>
            <div class="info-item">
              <span class="label">CPU 核心数:</span>
              <span class="value">{{ serverInfo.server.cpuCount }}</span>
            </div>
            <div class="info-item">
              <span class="label">CPU 型号:</span>
              <span class="value">{{ serverInfo.server.cpuModel }}</span>
            </div>
            <div class="info-item">
              <span class="label">总内存:</span>
              <span class="value">{{ serverInfo.server.totalMemory }}</span>
            </div>
            <div class="info-item">
              <span class="label">可用内存:</span>
              <span class="value">{{ serverInfo.server.freeMemory }}</span>
            </div>
            <div class="info-item">
              <span class="label">系统运行时间:</span>
              <span class="value">{{ serverInfo.server.uptime }}</span>
            </div>
            <div class="info-item">
              <span class="label">主机名:</span>
              <span class="value">{{ serverInfo.server.hostname }}</span>
            </div>
            <div class="info-item">
              <span class="label">Node.js 版本:</span>
              <span class="value">{{ serverInfo.server.nodeVersion }}</span>
            </div>
          </div>
        </section>

        <!-- 应用信息 -->
        <section class="info-section">
          <h2 class="section-title">应用信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">应用名称:</span>
              <span class="value">{{ serverInfo.application.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">版本号:</span>
              <span class="value">{{ serverInfo.application.version }}</span>
            </div>
            <div class="info-item">
              <span class="label">运行端口:</span>
              <span class="value">{{ serverInfo.application.port }}</span>
            </div>
            <div class="info-item">
              <span class="label">运行环境:</span>
              <span class="value">{{ serverInfo.application.environment }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">功能特性:</span>
              <div class="features">
                <span v-for="feature in serverInfo.application.features" :key="feature" class="feature-tag">
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div class="timestamp">
          更新时间: {{ new Date(serverInfo.timestamp).toLocaleString('zh-CN') }}
        </div>

        <button @click="fetchServerInfo" class="refresh-btn">刷新信息</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const serverInfo = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchServerInfo = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('/api/server-info');
    if (!response.ok) {
      throw new Error('获取服务器信息失败');
    }
    const data = await response.json();
    serverInfo.value = data;
  } catch (err) {
    error.value = err.message || '无法连接到服务器';
    console.error('获取服务器信息失败:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchServerInfo();
});
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  font-size: 1.1rem;
  color: #666;
}

.error {
  color: #e74c3c;
}

.error p {
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.retry-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #c0392b;
}

.info-container {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.info-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  color: #667eea;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #667eea;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 10px;
  border-left: 4px solid #667eea;
  transition: transform 0.2s, box-shadow 0.2s;
}

.info-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.value {
  display: block;
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.feature-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.timestamp {
  text-align: center;
  color: #999;
  font-size: 0.9rem;
  margin: 30px 0 20px;
  font-style: italic;
}

.refresh-btn {
  display: block;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 40px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.refresh-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .title {
    font-size: 1.8rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 1.4rem;
  }
}
</style>
