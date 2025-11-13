<template>
  <div class="app">
    <div class="container">
      <!-- 标题区域 -->
      <div class="header">
        <h1 class="title">IP 信息查询</h1>
        <p class="subtitle">快速查询IP地址的详细信息</p>
      </div>

      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-wrapper">
          <input
            v-model="ipAddress"
            type="text"
            class="search-input"
            placeholder="请输入IP地址（留空查询本机IP）"
            @keyup.enter="searchIP"
          />
          <button
            class="search-button"
            @click="searchIP"
            :disabled="loading"
          >
            {{ loading ? '查询中...' : '查询' }}
          </button>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>正在查询中...</p>
      </div>

      <!-- 查询结果 -->
      <div v-if="ipInfo && !loading" class="result-section">
        <div class="result-card">
          <div class="result-item">
            <span class="result-label">IP 地址</span>
            <span class="result-value">{{ ipInfo.query || ipInfo.ip }}</span>
          </div>

          <div class="result-item" v-if="ipInfo.country">
            <span class="result-label">国家</span>
            <span class="result-value">{{ ipInfo.country }}</span>
          </div>

          <div class="result-item" v-if="ipInfo.regionName">
            <span class="result-label">地区</span>
            <span class="result-value">{{ ipInfo.regionName }}</span>
          </div>

          <div class="result-item" v-if="ipInfo.city">
            <span class="result-label">城市</span>
            <span class="result-value">{{ ipInfo.city }}</span>
          </div>

          <div class="result-item" v-if="ipInfo.district">
            <span class="result-label">区</span>
            <span class="result-value">{{ ipInfo.district }}</span>
          </div>

          <div class="result-item" v-if="ipInfo.isp">
            <span class="result-label">ISP 运营商</span>
            <span class="result-value">{{ ipInfo.isp }}</span>
          </div>

          <div class="result-item" v-if="ipInfo.org">
            <span class="result-label">组织</span>
            <span class="result-value">{{ ipInfo.org }}</span>
          </div>

          <div class="result-item" v-if="ipInfo.as">
            <span class="result-label">AS 号</span>
            <span class="result-value">{{ ipInfo.as }}</span>
          </div>

          <div class="result-item" v-if="ipInfo.timezone">
            <span class="result-label">时区</span>
            <span class="result-value">{{ ipInfo.timezone }}</span>
          </div>

          <div class="result-item" v-if="ipInfo.lat && ipInfo.lon">
            <span class="result-label">经纬度</span>
            <span class="result-value">{{ ipInfo.lat }}, {{ ipInfo.lon }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const ipAddress = ref('');
const ipInfo = ref(null);
const loading = ref(false);
const error = ref('');

const searchIP = async () => {
  error.value = '';
  ipInfo.value = null;
  loading.value = true;

  try {
    const response = await axios.get('/api/ip-info', {
      params: {
        ip: ipAddress.value.trim()
      }
    });

    if (response.data.success) {
      ipInfo.value = response.data.data;
    } else {
      error.value = response.data.message || '查询失败，请稍后再试';
    }
  } catch (err) {
    console.error('查询错误:', err);
    error.value = err.response?.data?.message || '查询失败，请检查网络连接或稍后再试';
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
  background: #F5F5F7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.container {
  width: 100%;
  max-width: 800px;
}

/* 标题区域 */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  color: #1C1C1E;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 16px;
  color: #6A6A6F;
  font-weight: 400;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 24px;
}

.search-wrapper {
  display: flex;
  gap: 12px;
  background: #FFFFFF;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
}

.search-input {
  flex: 1;
  padding: 14px 16px;
  font-size: 16px;
  color: #1C1C1E;
  border: none;
  border-radius: 6px;
  outline: none;
  background: transparent;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
}

.search-input::placeholder {
  color: #6A6A6F;
}

.search-button {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 500;
  color: #FFFFFF;
  background: #007AFF;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
}

.search-button:hover:not(:disabled) {
  background: #0051D5;
  transform: translateY(-1px);
  box-shadow: 0px 4px 12px rgba(0, 122, 255, 0.3);
}

.search-button:active:not(:disabled) {
  transform: translateY(0);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 错误提示 */
.error-message {
  padding: 16px 20px;
  background: #FFFFFF;
  border-left: 4px solid #FF3B30;
  border-radius: 6px;
  color: #FF3B30;
  font-size: 14px;
  margin-bottom: 24px;
  box-shadow: 0px 2px 8px rgba(255, 59, 48, 0.1);
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 40px 20px;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 4px solid #F5F5F7;
  border-top-color: #007AFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  color: #6A6A6F;
  font-size: 14px;
}

/* 结果区域 */
.result-section {
  animation: fadeIn 0.3s ease;
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
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #F5F5F7;
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-size: 14px;
  color: #6A6A6F;
  font-weight: 400;
}

.result-value {
  font-size: 15px;
  color: #1C1C1E;
  font-weight: 500;
  text-align: right;
  word-break: break-all;
  max-width: 60%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app {
    padding: 16px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .search-wrapper {
    flex-direction: column;
    gap: 8px;
  }

  .search-button {
    width: 100%;
  }

  .result-card {
    padding: 16px;
  }

  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .result-value {
    text-align: left;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 13px;
  }

  .search-input,
  .search-button {
    font-size: 14px;
    padding: 12px 16px;
  }

  .result-label,
  .result-value {
    font-size: 13px;
  }
}
</style>
