<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>系统管理端</h1>
      <p>只读监控与基础处置</p>
      <button @click="goBack" class="btn-back">← 返回首页</button>
    </div>

    <div class="admin-content">
      <!-- 统计指标 -->
      <div class="metrics-section">
        <h2>系统指标</h2>
        <div v-if="metrics" class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">{{ metrics.stats.totalRequests }}</div>
            <div class="metric-label">总请求数</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ metrics.stats.passedRequests }}</div>
            <div class="metric-label">通过请求</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ metrics.stats.rejectedRequests }}</div>
            <div class="metric-label">拒绝请求</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ Math.round(passRate) }}%</div>
            <div class="metric-label">通过率</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ metrics.stats.activeSessions }}</div>
            <div class="metric-label">活跃会话</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ metrics.stats.totalTransforms }}</div>
            <div class="metric-label">改造次数</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ formatUptime(metrics.stats.uptime) }}</div>
            <div class="metric-label">运行时间</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ metrics.banned.total }}</div>
            <div class="metric-label">封禁数量</div>
          </div>
        </div>
        <button @click="refreshMetrics" class="btn-refresh">🔄 刷新</button>
      </div>

      <!-- 审计日志 -->
      <div class="logs-section">
        <h2>审计日志（最近100条）</h2>
        <div v-if="logs && logs.length > 0" class="logs-container">
          <table class="logs-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>级别</th>
                <th>事件</th>
                <th>会话ID</th>
                <th>详情</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id" :class="`log-${log.level}`">
                <td>{{ formatTime(log.createdAt) }}</td>
                <td>{{ log.level }}</td>
                <td>{{ log.event }}</td>
                <td>{{ log.sessionId ? log.sessionId.substr(0, 16) + '...' : '-' }}</td>
                <td class="log-data">{{ formatData(log.data) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="no-data">暂无日志</div>
      </div>

      <!-- 封禁管理 -->
      <div class="ban-section">
        <h2>封禁管理</h2>
        <div class="ban-form">
          <h3>添加封禁</h3>
          <div class="form-row">
            <select v-model="banForm.type">
              <option value="ip">IP地址</option>
              <option value="session">会话ID</option>
            </select>
            <input
              v-model="banForm.target"
              :placeholder="banForm.type === 'ip' ? '输入IP地址' : '输入会话ID'"
            />
            <input
              v-model="banForm.reason"
              placeholder="封禁原因"
            />
            <button @click="addBan" :disabled="!banForm.target">封禁</button>
          </div>
        </div>

        <div class="unban-form">
          <h3>解除封禁</h3>
          <div class="form-row">
            <select v-model="unbanForm.type">
              <option value="ip">IP地址</option>
              <option value="session">会话ID</option>
            </select>
            <input
              v-model="unbanForm.target"
              :placeholder="unbanForm.type === 'ip' ? '输入IP地址' : '输入会话ID'"
            />
            <button @click="removeBan" :disabled="!unbanForm.target">解封</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 数据
const metrics = ref(null);
const logs = ref([]);

// 表单
const banForm = ref({
  type: 'ip',
  target: '',
  reason: ''
});

const unbanForm = ref({
  type: 'ip',
  target: ''
});

// 计算通过率
const passRate = computed(() => {
  if (!metrics.value || metrics.value.stats.totalRequests === 0) return 0;
  return (metrics.value.stats.passedRequests / metrics.value.stats.totalRequests) * 100;
});

/**
 * 获取指标
 */
async function refreshMetrics() {
  try {
    const response = await fetch('/api/v1/admin/metrics');
    const result = await response.json();

    if (result.status === 'success') {
      metrics.value = result.data;
    }
  } catch (error) {
    console.error('获取指标失败:', error);
    alert('获取指标失败: ' + error.message);
  }
}

/**
 * 获取审计日志
 */
async function fetchLogs() {
  try {
    const response = await fetch('/api/v1/admin/audit?limit=100');
    const result = await response.json();

    if (result.status === 'success') {
      logs.value = result.data.logs;
    }
  } catch (error) {
    console.error('获取日志失败:', error);
  }
}

/**
 * 添加封禁
 */
async function addBan() {
  if (!banForm.value.target) return;

  try {
    const response = await fetch('/api/v1/admin/ban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: banForm.value.type,
        target: banForm.value.target,
        reason: banForm.value.reason || '管理员封禁'
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      alert('封禁成功');
      banForm.value.target = '';
      banForm.value.reason = '';
      refreshMetrics();
    } else {
      alert('封禁失败: ' + result.error);
    }
  } catch (error) {
    console.error('封禁错误:', error);
    alert('封禁失败: ' + error.message);
  }
}

/**
 * 解除封禁
 */
async function removeBan() {
  if (!unbanForm.value.target) return;

  try {
    const response = await fetch('/api/v1/admin/unban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: unbanForm.value.type,
        target: unbanForm.value.target
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      alert(result.data.unbanned ? '解封成功' : '未找到该封禁记录');
      unbanForm.value.target = '';
      refreshMetrics();
    } else {
      alert('解封失败: ' + result.error);
    }
  } catch (error) {
    console.error('解封错误:', error);
    alert('解封失败: ' + error.message);
  }
}

/**
 * 格式化时间
 */
function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString('zh-CN');
}

/**
 * 格式化运行时间
 */
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}天`;
  if (hours > 0) return `${hours}小时`;
  if (minutes > 0) return `${minutes}分钟`;
  return `${seconds}秒`;
}

/**
 * 格式化数据
 */
function formatData(data) {
  if (!data) return '-';
  return JSON.stringify(data);
}

/**
 * 返回首页
 */
function goBack() {
  window.location.href = '/';
}

// 初始化
onMounted(() => {
  refreshMetrics();
  fetchLogs();

  // 自动刷新
  setInterval(refreshMetrics, 30000); // 每30秒刷新
});
</script>

<style scoped>
.admin-panel {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.admin-header {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  position: relative;
}

.admin-header h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.admin-header p {
  margin: 0;
  color: #7f8c8d;
}

.btn-back {
  position: absolute;
  top: 30px;
  right: 30px;
  background: #ecf0f1;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-back:hover {
  background: #bdc3c7;
}

.admin-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metrics-section,
.logs-section,
.ban-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.metrics-section h2,
.logs-section h2,
.ban-section h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.metric-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #4a90e2;
  margin-bottom: 8px;
}

.metric-label {
  font-size: 14px;
  color: #7f8c8d;
}

.btn-refresh {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-refresh:hover {
  background: #357abd;
}

.logs-container {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.logs-table thead {
  background: #f8f9fa;
  position: sticky;
  top: 0;
}

.logs-table th {
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 600;
}

.logs-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.log-data {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
  font-size: 12px;
}

.log-info {
  background: #e3f2fd;
}

.log-warn {
  background: #fff3cd;
}

.log-error {
  background: #ffebee;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

.ban-form,
.unban-form {
  margin-bottom: 20px;
}

.ban-form h3,
.unban-form h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #2c3e50;
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-row select,
.form-row input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-row select {
  width: 150px;
}

.form-row input {
  flex: 1;
}

.form-row button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.form-row button:hover:not(:disabled) {
  background: #c0392b;
}

.form-row button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    flex-direction: column;
  }

  .form-row select,
  .form-row input {
    width: 100%;
  }
}
</style>
