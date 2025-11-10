<template>
  <div class="shadow-viewer">
    <div class="viewer-header">
      <h2 class="viewer-title">🔐 /etc/shadow 文件查看器</h2>
      <button class="load-button" @click="loadShadowFile" :disabled="loading">
        {{ loading ? '加载中...' : '🔄 加载文件' }}
      </button>
    </div>

    <div class="viewer-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="status-message loading">
        <div class="spinner"></div>
        <p>正在读取 /etc/shadow 文件...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="status-message error">
        <div class="error-icon">❌</div>
        <h3>读取失败</h3>
        <p class="error-text">{{ error }}</p>
        <button class="retry-button" @click="loadShadowFile">重试</button>
      </div>

      <!-- 成功显示内容 -->
      <div v-else-if="shadowContent" class="content-display">
        <div class="content-header">
          <div class="info-badge success">✅ 读取成功</div>
          <div class="info-badge">
            时间: {{ timestamp }}
          </div>
          <div class="info-badge">
            行数: {{ lineCount }}
          </div>
        </div>

        <div class="content-box">
          <pre class="shadow-content">{{ shadowContent }}</pre>
        </div>

        <div class="content-footer">
          <p class="warning-text">
            ⚠️ 注意：/etc/shadow 文件包含系统用户密码哈希，请妥善保管此信息
          </p>
        </div>
      </div>

      <!-- 初始状态 -->
      <div v-else class="status-message initial">
        <div class="initial-icon">📋</div>
        <h3>欢迎使用 /etc/shadow 查看器</h3>
        <p>点击上方的"加载文件"按钮开始读取</p>
        <div class="info-box">
          <p><strong>/etc/shadow 文件说明：</strong></p>
          <ul>
            <li>存储 Linux 系统用户的加密密码</li>
            <li>只有 root 用户才能读取</li>
            <li>包含用户名、密码哈希、密码策略等信息</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const loading = ref(false);
const error = ref(null);
const shadowContent = ref('');
const timestamp = ref('');

// 计算行数
const lineCount = computed(() => {
  if (!shadowContent.value) return 0;
  return shadowContent.value.trim().split('\n').filter(line => line.trim()).length;
});

// 加载 /etc/shadow 文件
const loadShadowFile = async () => {
  loading.value = true;
  error.value = null;
  shadowContent.value = '';

  try {
    const response = await axios.get('/api/system/shadow');

    if (response.data.success) {
      shadowContent.value = response.data.output || '(文件为空)';
      timestamp.value = new Date(response.data.timestamp).toLocaleString('zh-CN');
    } else {
      error.value = response.data.error || '读取失败，可能需要 root 权限';
    }
  } catch (err) {
    error.value = err.response?.data?.error || err.message || '网络请求失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.shadow-viewer {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 12px;
}

/* Header */
.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #333;
}

.viewer-title {
  margin: 0;
  font-size: 28px;
  color: #00ff88;
  font-weight: 600;
}

.load-button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.load-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.load-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Content Area */
.viewer-content {
  min-height: 400px;
  background: #2d2d2d;
  border-radius: 8px;
  padding: 30px;
}

/* Status Messages */
.status-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.status-message.loading {
  color: #999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #333;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-message.error {
  color: #e74c3c;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-text {
  font-size: 16px;
  color: #999;
  margin: 10px 0 20px 0;
}

.retry-button {
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-button:hover {
  background: #c0392b;
}

.status-message.initial {
  color: #e0e0e0;
}

.initial-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.info-box {
  margin-top: 30px;
  padding: 20px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  text-align: left;
  max-width: 500px;
}

.info-box strong {
  color: #00ff88;
}

.info-box ul {
  margin: 10px 0 0 0;
  padding-left: 20px;
  color: #999;
  line-height: 1.8;
}

/* Content Display */
.content-display {
  width: 100%;
}

.content-header {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.info-badge {
  padding: 8px 16px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 6px;
  font-size: 14px;
  color: #999;
}

.info-badge.success {
  border-color: #27ae60;
  color: #27ae60;
  font-weight: 600;
}

.content-box {
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  margin-bottom: 20px;
}

.shadow-content {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.8;
  color: #00ff88;
  white-space: pre-wrap;
  word-break: break-all;
}

.content-footer {
  padding: 15px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 6px;
}

.warning-text {
  margin: 0;
  color: #e74c3c;
  font-size: 14px;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .viewer-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .viewer-title {
    font-size: 22px;
  }

  .content-box {
    padding: 15px;
  }

  .shadow-content {
    font-size: 12px;
  }
}
</style>
