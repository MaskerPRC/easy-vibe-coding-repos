<template>
  <div class="app">
    <div class="container">
      <h1 class="title">网站连通性验证</h1>
      <p class="subtitle">输入网站地址，检测网络连通性</p>

      <div class="input-section">
        <input
          v-model="website"
          type="text"
          class="website-input"
          placeholder="请输入网站地址，例如：baidu.com"
          @keyup.enter="checkWebsite"
          :disabled="loading"
        />
        <button
          class="check-button"
          @click="checkWebsite"
          :disabled="loading || !website.trim()"
        >
          {{ loading ? '验证中...' : 'Ping验证' }}
        </button>
      </div>

      <div v-if="loading" class="status-message">
        <div class="loading-spinner"></div>
        <p>正在验证连通性，请稍候...</p>
      </div>

      <div v-if="result && !loading" class="result-section">
        <div :class="['result-card', result.success ? 'success' : 'error']">
          <div class="result-header">
            <div class="result-icon">
              <svg v-if="result.success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </div>
            <h2>{{ result.success ? '连接成功' : '连接失败' }}</h2>
          </div>

          <div class="result-content">
            <div class="result-item">
              <span class="label">目标地址：</span>
              <span class="value">{{ result.target || website }}</span>
            </div>

            <div v-if="result.success" class="result-details">
              <div class="result-item" v-if="result.transmitted">
                <span class="label">发送数据包：</span>
                <span class="value">{{ result.transmitted }} 个</span>
              </div>
              <div class="result-item" v-if="result.received !== undefined">
                <span class="label">接收数据包：</span>
                <span class="value">{{ result.received }} 个</span>
              </div>
              <div class="result-item" v-if="result.loss !== undefined">
                <span class="label">丢包率：</span>
                <span class="value">{{ result.loss }}%</span>
              </div>
              <div class="result-item" v-if="result.time">
                <span class="label">平均延迟：</span>
                <span class="value">{{ result.time }} ms</span>
              </div>
            </div>

            <div v-if="result.message" class="result-message">
              <span class="label">详细信息：</span>
              <pre class="output">{{ result.message }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const website = ref('');
const loading = ref(false);
const result = ref(null);

const checkWebsite = async () => {
  if (!website.value.trim()) {
    return;
  }

  loading.value = true;
  result.value = null;

  try {
    const response = await axios.post('/api/ping', {
      website: website.value.trim()
    });

    result.value = response.data;
  } catch (error) {
    result.value = {
      success: false,
      target: website.value,
      message: error.response?.data?.message || error.message || '验证失败，请检查网络连接或稍后重试'
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F5F7FA;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: 'Roboto', 'PingFang SC', 'Helvetica Neue', 'Hiragino Sans GB', sans-serif;
}

.container {
  width: 100%;
  max-width: 700px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  color: #333333;
  text-align: center;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 16px;
  color: #666666;
  text-align: center;
  margin-bottom: 32px;
}

.input-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.website-input {
  flex: 1;
  padding: 16px 20px;
  font-size: 16px;
  color: #333333;
  border: 2px solid #E1E8ED;
  border-radius: 8px;
  background: #FFFFFF;
  transition: all 0.3s ease;
  outline: none;
}

.website-input:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.website-input:disabled {
  background: #F5F7FA;
  cursor: not-allowed;
  opacity: 0.6;
}

.website-input::placeholder {
  color: #999999;
}

.check-button {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: #4A90E2;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  outline: none;
}

.check-button:hover:not(:disabled) {
  background: #357ABD;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.check-button:active:not(:disabled) {
  transform: translateY(0);
}

.check-button:disabled {
  background: #B0BEC5;
  cursor: not-allowed;
  opacity: 0.7;
}

.status-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: #4A90E2;
  font-size: 16px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #E1E8ED;
  border-top-color: #4A90E2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid;
}

.result-card.success {
  border-left-color: #28A745;
}

.result-card.error {
  border-left-color: #DC3545;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E1E8ED;
}

.result-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.success .result-icon {
  background: rgba(40, 167, 69, 0.1);
  color: #28A745;
}

.error .result-icon {
  background: rgba(220, 53, 69, 0.1);
  color: #DC3545;
}

.result-icon svg {
  width: 24px;
  height: 24px;
}

.result-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
}

.value {
  font-size: 16px;
  color: #333333;
  font-weight: 600;
}

.result-message {
  margin-top: 8px;
}

.output {
  margin-top: 8px;
  padding: 16px;
  background: #F5F7FA;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #333333;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .input-section {
    flex-direction: column;
    gap: 12px;
  }

  .check-button {
    width: 100%;
  }

  .result-card {
    padding: 24px 20px;
  }

  .result-header h2 {
    font-size: 20px;
  }

  .result-details {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .app {
    padding: 16px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 13px;
  }

  .website-input,
  .check-button {
    font-size: 15px;
    padding: 14px 16px;
  }

  .result-card {
    padding: 20px 16px;
  }

  .result-icon {
    width: 40px;
    height: 40px;
  }

  .result-icon svg {
    width: 20px;
    height: 20px;
  }

  .output {
    font-size: 12px;
    padding: 12px;
  }
}
</style>
