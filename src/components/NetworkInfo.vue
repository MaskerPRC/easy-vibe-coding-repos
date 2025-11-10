<template>
  <div class="network-info-container">
    <div class="network-header">
      <h2>🌐 Network Veil</h2>
      <button class="refresh-button" @click="fetchNetworkInfo" :disabled="loading">
        {{ loading ? 'Loading...' : '🔄 Refresh' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      <p>❌ Failed to retrieve network info: {{ error }}</p>
    </div>

    <div v-if="networkData && !loading" class="info-sections">
      <!-- 公网IP -->
      <div class="info-card">
        <h3>🌍 Public IP Address</h3>
        <div class="ip-display">
          <span class="ip-value">{{ networkData.publicIp }}</span>
        </div>
        <p class="info-description">Your current public IP address</p>
      </div>

      <!-- 内网IP -->
      <div class="info-card">
        <h3>🏠 Local IP Address</h3>
        <div v-if="networkData.localIps && networkData.localIps.length > 0" class="local-ips">
          <div v-for="(ip, index) in networkData.localIps" :key="index" class="local-ip-item">
            <div class="ip-header">
              <span class="interface-name">{{ ip.interface }}</span>
            </div>
            <div class="ip-details">
              <div class="detail-row">
                <span class="label">IP Address:</span>
                <span class="value">{{ ip.address }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Netmask:</span>
                <span class="value">{{ ip.netmask }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <p>No local IP detected</p>
        </div>
      </div>

      <!-- netstat输出 -->
      <div class="info-card netstat-card">
        <h3>📊 网络连接状态 (netstat -an)</h3>
        <div class="netstat-output">
          <pre>{{ networkData.netstat || '无数据' }}</pre>
        </div>
      </div>

      <!-- 时间戳 -->
      <div class="timestamp">
        <p>⏰ 更新时间: {{ formatTimestamp(networkData.timestamp) }}</p>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>正在获取网络信息...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const networkData = ref(null);
const loading = ref(false);
const error = ref('');

const fetchNetworkInfo = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.get('/api/system/network-info');

    if (response.data.success) {
      networkData.value = response.data;
    } else {
      error.value = response.data.error || '获取失败';
    }
  } catch (err) {
    error.value = err.response?.data?.error || err.message || '网络请求失败';
    console.error('获取网络信息失败:', err);
  } finally {
    loading.value = false;
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
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

onMounted(() => {
  fetchNetworkInfo();
});
</script>

<style scoped>
.network-info-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.network-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #00ff88;
}

.network-header h2 {
  margin: 0;
  font-size: 28px;
  color: #00ff88;
}

.refresh-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #ff4444;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #2d2d2d;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 25px;
  transition: all 0.3s;
}

.info-card:hover {
  border-color: #667eea;
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.2);
}

.info-card h3 {
  margin: 0 0 20px 0;
  font-size: 22px;
  color: #00ff88;
}

.ip-display {
  background: #1a1a1a;
  border: 2px solid #667eea;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
}

.ip-value {
  font-size: 32px;
  font-weight: 700;
  color: #667eea;
  font-family: 'Courier New', monospace;
}

.info-description {
  margin: 0;
  color: #999;
  font-size: 14px;
  text-align: center;
}

.local-ips {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.local-ip-item {
  background: #1a1a1a;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 15px;
}

.ip-header {
  margin-bottom: 10px;
}

.interface-name {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.ip-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.detail-row .label {
  color: #999;
  font-size: 14px;
}

.detail-row .value {
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: 600;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
}

.netstat-card {
  max-height: 600px;
}

.netstat-output {
  background: #1a1a1a;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 20px;
  max-height: 500px;
  overflow: auto;
}

.netstat-output pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #e0e0e0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.netstat-output::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.netstat-output::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 4px;
}

.netstat-output::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.netstat-output::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}

.timestamp {
  text-align: center;
  color: #999;
  font-size: 14px;
  padding-top: 10px;
}

.timestamp p {
  margin: 0;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #444;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #999;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .network-info-container {
    padding: 15px;
  }

  .network-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .network-header h2 {
    font-size: 24px;
  }

  .refresh-button {
    width: 100%;
  }

  .ip-value {
    font-size: 24px;
  }

  .info-card h3 {
    font-size: 20px;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .netstat-output pre {
    font-size: 11px;
  }
}
</style>
