<template>
  <div class="online-users">
    <div class="header">
      <h2>👥 在线用户</h2>
      <div class="stats">
        <span class="stat-item">
          <span class="stat-label">在线人数:</span>
          <span class="stat-value">{{ onlineCount }}</span>
        </span>
      </div>
      <button @click="refreshData" class="refresh-button" :disabled="loading">
        {{ loading ? '加载中...' : '🔄 刷新' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="section">
      <h3>👤 在线用户列表</h3>
      <div v-if="users.length === 0" class="empty-state">
        <p>暂无在线用户</p>
      </div>
      <div v-else class="users-grid">
        <div v-for="user in users" :key="user.userId" class="user-card">
          <div class="user-avatar">{{ user.avatar }}</div>
          <div class="user-info">
            <div class="user-name">{{ user.username }}</div>
            <div class="user-id">ID: {{ user.userId.substring(0, 12) }}...</div>
            <div class="user-time">最后活跃: {{ formatTime(user.lastHeartbeat) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OnlineUsers',
  data() {
    return {
      users: [],
      onlineCount: 0,
      loading: false,
      error: null,
      pollingInterval: null
    };
  },
  mounted() {
    this.loadData();
    this.startPolling();
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.get('/api/users/online');

        if (response.data.success) {
          this.users = response.data.users;
          this.onlineCount = response.data.count;
        } else {
          this.error = '获取在线用户失败';
        }
      } catch (err) {
        console.error('获取在线用户失败:', err);
        this.error = '无法连接到服务器';
      } finally {
        this.loading = false;
      }
    },
    refreshData() {
      this.loadData();
    },
    startPolling() {
      // 每5秒自动刷新一次数据
      this.pollingInterval = setInterval(() => {
        this.loadData();
      }, 5000);
    },
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },
    formatTime(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;

      if (diff < 10000) {
        return '刚刚';
      } else if (diff < 60000) {
        return `${Math.floor(diff / 1000)}秒前`;
      } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
      } else {
        const date = new Date(timestamp);
        return date.toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
  }
};
</script>

<style scoped>
.online-users {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #444;
  flex-wrap: wrap;
  gap: 15px;
}

.header h2 {
  margin: 0;
  color: #00ff88;
  font-size: 28px;
  font-weight: 600;
}

.stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
}

.stat-label {
  color: #999;
  font-size: 14px;
}

.stat-value {
  color: #00ff88;
  font-size: 18px;
  font-weight: 600;
}

.refresh-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.refresh-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 15px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 8px;
  color: #e74c3c;
  margin-bottom: 20px;
  text-align: center;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  margin: 0 0 20px 0;
  color: #e0e0e0;
  font-size: 20px;
  font-weight: 500;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  background: #1a1a1a;
  border: 2px dashed #444;
  border-radius: 12px;
}

.empty-state p {
  margin: 0;
  color: #999;
  font-size: 16px;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 12px;
  transition: all 0.3s;
}

.user-card:hover {
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.user-avatar {
  font-size: 48px;
  line-height: 1;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #00ff88;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-id {
  font-size: 12px;
  color: #999;
  font-family: 'Courier New', monospace;
  margin-bottom: 5px;
}

.user-time {
  font-size: 13px;
  color: #999;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats {
    width: 100%;
    justify-content: space-between;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .online-users {
    padding: 15px;
  }

  .header h2 {
    font-size: 24px;
  }

  .user-avatar {
    font-size: 36px;
  }

  .user-name {
    font-size: 16px;
  }
}
</style>
