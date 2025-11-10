<template>
  <div class="visitor-tracker">
    <div class="tracker-header">
      <h2>👥 访客IP追踪</h2>
      <div class="stats-summary">
        <span class="stat-item">
          <span class="stat-label">总访问次数:</span>
          <span class="stat-value">{{ totalRecords }}</span>
        </span>
        <span class="stat-item">
          <span class="stat-label">独立访客:</span>
          <span class="stat-value">{{ uniqueIPs }}</span>
        </span>
      </div>
      <button @click="refreshData" class="refresh-button" :disabled="loading">
        {{ loading ? '加载中...' : '🔄 刷新' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- IP统计表 -->
    <div class="section">
      <h3>📊 IP访问统计</h3>
      <div v-if="ipStats.length === 0" class="empty-state">
        <p>暂无访客记录</p>
      </div>
      <div v-else class="ip-stats-table">
        <table>
          <thead>
            <tr>
              <th>IP地址</th>
              <th>访问次数</th>
              <th>首次访问</th>
              <th>最后访问</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stat, index) in ipStats" :key="index">
              <td class="ip-cell">{{ stat.ip }}</td>
              <td class="count-cell">{{ stat.count }}</td>
              <td class="time-cell">{{ stat.firstVisit }}</td>
              <td class="time-cell">{{ stat.lastVisit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 最近访问记录 -->
    <div class="section">
      <h3>🕐 最近访问记录</h3>
      <div v-if="records.length === 0" class="empty-state">
        <p>暂无访问记录</p>
      </div>
      <div v-else class="records-list">
        <div v-for="(record, index) in records" :key="index" class="record-item">
          <div class="record-header">
            <span class="record-ip">{{ record.ip }}</span>
            <span class="record-time">{{ record.time }}</span>
          </div>
          <div class="record-details">
            <span class="record-method">{{ record.method }}</span>
            <span class="record-path">{{ record.path }}</span>
          </div>
          <div class="record-useragent">{{ truncateUserAgent(record.userAgent) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VisitorTracker',
  data() {
    return {
      totalRecords: 0,
      uniqueIPs: 0,
      ipStats: [],
      records: [],
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
        const response = await axios.get('/api/visitors/ips');

        if (response.data.success) {
          this.totalRecords = response.data.totalRecords;
          this.uniqueIPs = response.data.uniqueIPs;
          this.ipStats = response.data.ipStats;
          this.records = response.data.records;
        }
      } catch (error) {
        console.error('加载访客数据失败:', error);
        this.error = '加载访客数据失败: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },
    refreshData() {
      this.loadData();
    },
    startPolling() {
      // 每10秒自动刷新一次
      this.pollingInterval = setInterval(() => {
        this.loadData();
      }, 10000);
    },
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },
    truncateUserAgent(ua) {
      if (ua.length > 80) {
        return ua.substring(0, 80) + '...';
      }
      return ua;
    }
  }
};
</script>

<style scoped>
.visitor-tracker {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tracker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.tracker-header h2 {
  margin: 0;
  color: #333;
  font-size: 28px;
}

.stats-summary {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0f8ff;
  border-radius: 8px;
  border: 2px solid #4a90e2;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.stat-value {
  color: #4a90e2;
  font-size: 20px;
  font-weight: bold;
}

.refresh-button {
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.refresh-button:hover:not(:disabled) {
  background: #357abd;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.refresh-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #c62828;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

/* IP统计表格 */
.ip-stats-table {
  overflow-x: auto;
}

.ip-stats-table table {
  width: 100%;
  border-collapse: collapse;
}

.ip-stats-table thead {
  background: #f8f9fa;
}

.ip-stats-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 2px solid #e0e0e0;
}

.ip-stats-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.ip-stats-table tbody tr:hover {
  background: #f8f9fa;
}

.ip-cell {
  font-family: monospace;
  color: #4a90e2;
  font-weight: 500;
}

.count-cell {
  font-weight: bold;
  color: #e67e22;
}

.time-cell {
  color: #666;
  font-size: 13px;
}

/* 访问记录列表 */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 600px;
  overflow-y: auto;
}

.record-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #4a90e2;
  transition: all 0.3s;
}

.record-item:hover {
  background: #e3f2fd;
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.record-ip {
  font-family: monospace;
  font-weight: bold;
  color: #4a90e2;
  font-size: 16px;
}

.record-time {
  color: #666;
  font-size: 13px;
}

.record-details {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
}

.record-method {
  display: inline-block;
  padding: 2px 8px;
  background: #27ae60;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.record-path {
  font-family: monospace;
  color: #555;
  font-size: 13px;
}

.record-useragent {
  color: #999;
  font-size: 12px;
  font-family: monospace;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tracker-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-summary {
    width: 100%;
    flex-direction: column;
  }

  .stat-item {
    width: 100%;
    justify-content: space-between;
  }

  .ip-stats-table {
    font-size: 14px;
  }

  .ip-stats-table th,
  .ip-stats-table td {
    padding: 8px;
  }
}
</style>
