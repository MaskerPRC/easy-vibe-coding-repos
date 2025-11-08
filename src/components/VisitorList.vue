<template>
  <div class="visitor-container">
    <div class="visitor-card">
      <h2 class="title">访问者 IP 地址列表</h2>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">独立访客</span>
          <span class="stat-value">{{ visitorData.total }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总访问次数</span>
          <span class="stat-value">{{ visitorData.totalVisits }}</span>
        </div>
      </div>

      <div v-if="loading" class="loading">
        加载中...
      </div>

      <div v-else-if="visitorData.visitors.length === 0" class="empty">
        暂无访问记录
      </div>

      <div v-else class="visitor-list">
        <div
          v-for="(visitor, index) in visitorData.visitors"
          :key="visitor.ip"
          class="visitor-item"
        >
          <div class="visitor-rank">{{ index + 1 }}</div>
          <div class="visitor-info">
            <div class="visitor-ip">{{ visitor.ip }}</div>
            <div class="visitor-details">
              <span class="detail-item">访问次数: {{ visitor.count }}</span>
              <span class="detail-item">首次访问: {{ formatTime(visitor.firstVisit) }}</span>
              <span class="detail-item">最近访问: {{ formatTime(visitor.lastVisit) }}</span>
            </div>
          </div>
        </div>
      </div>

      <button @click="refreshData" class="refresh-btn" :disabled="loading">
        {{ loading ? '刷新中...' : '刷新数据' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const visitorData = ref({
  visitors: [],
  total: 0,
  totalVisits: 0
});

const loading = ref(false);

// 格式化时间
const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 获取访问者数据
const fetchVisitors = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/visitors');
    const data = await response.json();
    visitorData.value = data;
  } catch (error) {
    console.error('获取访问者数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 刷新数据
const refreshData = () => {
  fetchVisitors();
};

// 组件挂载时获取数据
onMounted(() => {
  fetchVisitors();
});
</script>

<style scoped>
.visitor-container {
  min-height: 100vh;
  background: #667eea;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.visitor-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  padding: 20px;
  background: #667eea;
  border-radius: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
}

.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
}

.visitor-list {
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.visitor-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.visitor-item:hover {
  background-color: #f8f9fa;
}

.visitor-item:last-child {
  border-bottom: none;
}

.visitor-rank {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 15px;
  flex-shrink: 0;
}

.visitor-info {
  flex: 1;
}

.visitor-ip {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
}

.visitor-details {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 13px;
  color: #666;
}

.detail-item {
  white-space: nowrap;
}

.refresh-btn {
  width: 100%;
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* 滚动条样式 */
.visitor-list::-webkit-scrollbar {
  width: 8px;
}

.visitor-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.visitor-list::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.visitor-list::-webkit-scrollbar-thumb:hover {
  background: #5568d3;
}

@media (max-width: 768px) {
  .visitor-card {
    padding: 20px;
  }

  .title {
    font-size: 22px;
  }

  .stats {
    flex-direction: column;
    gap: 15px;
  }

  .visitor-details {
    flex-direction: column;
    gap: 5px;
  }

  .visitor-ip {
    font-size: 16px;
  }

  .detail-item {
    font-size: 12px;
  }
}
</style>
