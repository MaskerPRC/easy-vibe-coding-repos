<template>
  <div class="system-info-container">
    <div class="header">
      <h2>系统信息</h2>
      <button @click="fetchSystemInfo" :disabled="loading" class="refresh-btn">
        {{ loading ? '加载中...' : '获取系统信息' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="systemInfo" class="info-content">
      <div class="info-section">
        <h3>当前执行路径</h3>
        <div class="path-display">
          <code>{{ systemInfo.currentPath }}</code>
        </div>
      </div>

      <div class="info-section">
        <h3>/usr/bin 目录列表</h3>
        <div class="count-info">
          共 {{ systemInfo.usrBinCount }} 个项目
        </div>
        <div class="bin-list">
          <div v-for="(item, index) in systemInfo.usrBinList" :key="index" class="bin-item">
            {{ item }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!systemInfo && !loading" class="placeholder">
      点击上方按钮获取系统信息
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
const error = ref(null);
const systemInfo = ref(null);

const fetchSystemInfo = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('/api/system-info');
    const data = await response.json();

    if (data.success) {
      systemInfo.value = data.data;
    } else {
      error.value = data.message || '获取系统信息失败';
    }
  } catch (err) {
    error.value = '请求失败: ' + err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.system-info-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.refresh-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.refresh-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  border-left: 4px solid #c62828;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.info-section {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-section h3 {
  margin: 0 0 15px 0;
  color: #555;
  font-size: 18px;
  font-weight: 600;
}

.path-display {
  background-color: #2d2d2d;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}

.path-display code {
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  white-space: nowrap;
}

.count-info {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
}

.bin-list {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
}

.bin-item {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #333;
}

.bin-item:last-child {
  border-bottom: none;
}

.bin-item:hover {
  background-color: #f9f9f9;
}

.placeholder {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #ddd;
}
</style>
