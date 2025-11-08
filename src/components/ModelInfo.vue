<template>
  <div class="model-info-container">
    <div class="header">
      <h2>AI 模型信息</h2>
      <button @click="fetchModelInfo" :disabled="loading" class="refresh-btn">
        {{ loading ? '加载中...' : '获取模型信息' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="modelInfo" class="info-content">
      <div class="model-header">
        <div class="model-icon">🤖</div>
        <div class="model-title">
          <h1>{{ modelInfo.modelName }}</h1>
          <p class="model-subtitle">{{ modelInfo.provider }} AI Assistant</p>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <div class="card-label">模型 ID</div>
          <div class="card-value">
            <code>{{ modelInfo.modelId }}</code>
          </div>
        </div>

        <div class="info-card">
          <div class="card-label">版本</div>
          <div class="card-value">{{ modelInfo.version }}</div>
        </div>

        <div class="info-card">
          <div class="card-label">模型系列</div>
          <div class="card-value">{{ modelInfo.family }}</div>
        </div>

        <div class="info-card">
          <div class="card-label">知识截止日期</div>
          <div class="card-value">{{ modelInfo.knowledgeCutoff }}</div>
        </div>
      </div>

      <div class="capabilities-section">
        <h3>核心能力</h3>
        <div class="capabilities-list">
          <div v-for="(capability, index) in modelInfo.capabilities" :key="index" class="capability-item">
            <span class="capability-icon">✓</span>
            <span class="capability-text">{{ capability }}</span>
          </div>
        </div>
      </div>

      <div class="footer-info">
        <span class="timestamp">查询时间: {{ formatTimestamp(modelInfo.timestamp) }}</span>
      </div>
    </div>

    <div v-if="!modelInfo && !loading" class="placeholder">
      点击上方按钮获取 AI 模型详细信息
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
const error = ref(null);
const modelInfo = ref(null);

const fetchModelInfo = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('/api/model-info');
    const data = await response.json();

    if (response.ok) {
      modelInfo.value = data;
    } else {
      error.value = data.message || '获取模型信息失败';
    }
  } catch (err) {
    error.value = '请求失败: ' + err.message;
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
    second: '2-digit'
  });
};
</script>

<style scoped>
.model-info-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.header h2 {
  margin: 0;
  color: #333;
  font-size: 28px;
  font-weight: 700;
}

.refresh-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.refresh-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #c62828;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.model-header {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.model-icon {
  font-size: 64px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.model-title h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.model-subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.info-card {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.card-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  font-weight: 600;
}

.card-value {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.card-value code {
  background-color: #2d2d2d;
  color: #00ff88;
  padding: 6px 12px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  display: inline-block;
  word-break: break-all;
}

.capabilities-section {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.capabilities-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 700;
}

.capabilities-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.capability-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background-color: #f0f4ff;
  border-radius: 8px;
  border-left: 3px solid #667eea;
  transition: all 0.2s;
}

.capability-item:hover {
  background-color: #e6edff;
  transform: translateX(5px);
}

.capability-icon {
  color: #667eea;
  font-weight: bold;
  font-size: 18px;
}

.capability-text {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.footer-info {
  text-align: center;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
  font-size: 13px;
}

.timestamp {
  font-family: 'Courier New', monospace;
}

.placeholder {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  font-size: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  border: 2px dashed #ddd;
}

@media (max-width: 768px) {
  .model-header {
    flex-direction: column;
    text-align: center;
  }

  .model-title h1 {
    font-size: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .capabilities-list {
    grid-template-columns: 1fr;
  }
}
</style>
