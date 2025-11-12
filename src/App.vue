<template>
  <div class="app">
    <div class="container">
      <div class="api-key-box">
        <h1 class="title">API Key 管理</h1>

        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="error" class="error-box">
          <p class="error-message">{{ error }}</p>
          <button @click="fetchApiKey" class="btn btn-retry">重试</button>
        </div>

        <div v-else-if="apiKeyData" class="key-info">
          <div class="key-item">
            <label class="key-label">原始 API Key:</label>
            <div class="key-value-container">
              <input
                type="text"
                :value="apiKeyData.originalKey"
                readonly
                class="key-value"
              />
              <button @click="copyToClipboard(apiKeyData.originalKey)" class="btn btn-copy">
                复制
              </button>
            </div>
          </div>

          <div class="key-item highlight">
            <label class="key-label">Base64 加密后的 API Key:</label>
            <div class="key-value-container">
              <textarea
                :value="apiKeyData.base64Key"
                readonly
                class="key-value key-value-textarea"
                rows="3"
              ></textarea>
              <button @click="copyToClipboard(apiKeyData.base64Key)" class="btn btn-copy">
                复制
              </button>
            </div>
          </div>

          <div class="key-meta">
            <p>生成时间: {{ formatDate(apiKeyData.generatedAt) }}</p>
          </div>

          <div class="actions">
            <button @click="regenerateApiKey" class="btn btn-regenerate" :disabled="regenerating">
              {{ regenerating ? '重新生成中...' : '重新生成 API Key' }}
            </button>
          </div>
        </div>

        <div v-if="copySuccess" class="toast">
          {{ copySuccess }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const apiKeyData = ref(null);
const loading = ref(true);
const error = ref(null);
const regenerating = ref(false);
const copySuccess = ref('');

// 获取 API Key
async function fetchApiKey() {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get('/api/apikey');
    if (response.data.success) {
      apiKeyData.value = response.data.data;
    } else {
      error.value = '获取 API Key 失败';
    }
  } catch (err) {
    error.value = err.message || '网络请求失败';
  } finally {
    loading.value = false;
  }
}

// 重新生成 API Key
async function regenerateApiKey() {
  if (regenerating.value) return;

  if (!confirm('确定要重新生成 API Key 吗?原有的 Key 将失效。')) {
    return;
  }

  regenerating.value = true;
  error.value = null;

  try {
    const response = await axios.post('/api/apikey/regenerate');
    if (response.data.success) {
      apiKeyData.value = response.data.data;
      showToast('API Key 已重新生成');
    } else {
      error.value = '重新生成失败';
    }
  } catch (err) {
    error.value = err.message || '网络请求失败';
  } finally {
    regenerating.value = false;
  }
}

// 复制到剪贴板
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('已复制到剪贴板');
  } catch (err) {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('已复制到剪贴板');
    } catch (e) {
      showToast('复制失败,请手动复制');
    }
    document.body.removeChild(textarea);
  }
}

// 显示提示信息
function showToast(message) {
  copySuccess.value = message;
  setTimeout(() => {
    copySuccess.value = '';
  }, 3000);
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// 页面加载时获取 API Key
onMounted(() => {
  fetchApiKey();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.container {
  width: 100%;
  max-width: 800px;
}

.api-key-box {
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 40px 0;
}

.loading-spinner {
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
  color: #666;
  font-size: 16px;
}

/* 错误状态 */
.error-box {
  text-align: center;
  padding: 40px 0;
}

.error-message {
  color: #e74c3c;
  font-size: 16px;
  margin-bottom: 20px;
}

/* Key 信息 */
.key-info {
  margin-top: 20px;
}

.key-item {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.key-item.highlight {
  background: #fff3cd;
  border: 2px solid #ffc107;
}

.key-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  margin-bottom: 10px;
}

.key-value-container {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.key-value {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: #fff;
  color: #333;
  word-break: break-all;
}

.key-value-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-copy {
  background: #667eea;
  color: white;
}

.btn-copy:hover {
  background: #5568d3;
  transform: translateY(-1px);
}

.btn-copy:active {
  transform: translateY(0);
}

.btn-retry {
  background: #3498db;
  color: white;
  padding: 12px 30px;
}

.btn-retry:hover {
  background: #2980b9;
}

.btn-regenerate {
  background: #e74c3c;
  color: white;
  padding: 12px 30px;
  width: 100%;
}

.btn-regenerate:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-1px);
}

.btn-regenerate:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

/* Meta 信息 */
.key-meta {
  margin: 20px 0;
  padding: 12px;
  background: #e8f4fd;
  border-radius: 6px;
  text-align: center;
}

.key-meta p {
  color: #555;
  font-size: 13px;
}

/* 操作按钮 */
.actions {
  margin-top: 30px;
}

/* Toast 提示 */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #27ae60;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  font-weight: 600;
  animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
  z-index: 1000;
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

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .api-key-box {
    padding: 30px 20px;
  }

  .title {
    font-size: 24px;
  }

  .key-value-container {
    flex-direction: column;
  }

  .btn-copy {
    width: 100%;
  }

  .toast {
    right: 10px;
    left: 10px;
  }
}

@media (max-width: 480px) {
  .api-key-box {
    padding: 20px 15px;
  }

  .title {
    font-size: 20px;
  }

  .key-item {
    padding: 15px;
  }
}
</style>
