<template>
  <div class="fish-tracker">
    <div class="header">
      <h1>🐟 今日摸鱼追踪器</h1>
      <p class="date">{{ currentDate }}</p>
    </div>

    <div class="stats-container">
      <div class="stat-card total">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <div class="stat-label">今日总摸鱼次数</div>
          <div class="stat-value">{{ totalCount }}</div>
        </div>
      </div>

      <div class="stat-card users">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <div class="stat-label">摸鱼网友数</div>
          <div class="stat-value">{{ userCount }}</div>
        </div>
      </div>
    </div>

    <div class="action-section">
      <button @click="addFish" class="fish-button" :disabled="loading">
        <span v-if="!loading">🐟 我也要摸鱼！</span>
        <span v-else>记录中...</span>
      </button>
      <p v-if="message" class="message" :class="messageType">{{ message }}</p>
    </div>

    <div class="records-section">
      <h2>📋 今日摸鱼记录</h2>
      <div v-if="records.length === 0" class="empty-state">
        <p>今天还没有人摸鱼哦，快来做第一条咸鱼吧！</p>
      </div>
      <div v-else class="records-list">
        <div v-for="(record, index) in records" :key="record.id" class="record-item">
          <div class="record-number">#{{ records.length - index }}</div>
          <div class="record-content">
            <div class="record-user">网友{{ record.userId }}</div>
            <div class="record-time">{{ formatTime(record.timestamp) }}</div>
          </div>
          <div class="record-badge">🐟</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FishTracker',
  data() {
    return {
      records: [],
      loading: false,
      message: '',
      messageType: 'success'
    };
  },
  computed: {
    currentDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekDay = weekDays[date.getDay()];
      return `${year}年${month}月${day}日 ${weekDay}`;
    },
    totalCount() {
      return this.records.length;
    },
    userCount() {
      const uniqueUsers = new Set(this.records.map(r => r.userId));
      return uniqueUsers.size;
    }
  },
  methods: {
    async fetchRecords() {
      try {
        const response = await axios.get('/api/fish-records');
        this.records = response.data.records || [];
      } catch (error) {
        console.error('获取摸鱼记录失败:', error);
        this.showMessage('获取记录失败，请刷新页面重试', 'error');
      }
    },
    async addFish() {
      if (this.loading) return;

      this.loading = true;
      this.message = '';

      try {
        const response = await axios.post('/api/fish-records');
        this.records = response.data.records || [];
        this.showMessage('摸鱼记录成功！继续摸吧~', 'success');
      } catch (error) {
        console.error('添加摸鱼记录失败:', error);
        this.showMessage('记录失败，请稍后重试', 'error');
      } finally {
        this.loading = false;
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
    showMessage(text, type = 'success') {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  },
  mounted() {
    this.fetchRecords();
  }
};
</script>

<style scoped>
.fish-tracker {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.date {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.users {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon {
  font-size: 3rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.stat-value {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
}

.action-section {
  text-align: center;
  margin-bottom: 40px;
}

.fish-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.fish-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.fish-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
}

.records-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.records-section h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.record-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.record-number {
  font-weight: bold;
  color: #667eea;
  font-size: 1.2rem;
  min-width: 50px;
}

.record-content {
  flex: 1;
  margin-left: 15px;
}

.record-user {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 3px;
}

.record-time {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.record-badge {
  font-size: 1.5rem;
}

@media (max-width: 600px) {
  .header h1 {
    font-size: 2rem;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-value {
    font-size: 2rem;
  }

  .fish-button {
    padding: 12px 30px;
    font-size: 1rem;
  }
}
</style>
