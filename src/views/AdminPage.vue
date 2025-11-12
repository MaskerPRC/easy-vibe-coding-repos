<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1 class="admin-title">MVP管理端</h1>
      <button class="btn-back" @click="goBack">← 返回首页</button>
    </div>

    <div class="admin-content">
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">总请求数</div>
          <div class="stat-value">{{ stats.total }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">最近拒绝</div>
          <div class="stat-value">{{ stats.recentRejections }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">最近错误</div>
          <div class="stat-value">{{ stats.recentErrors }}</div>
        </div>
      </div>

      <!-- 审计日志表格 -->
      <div class="audit-section">
        <div class="section-header">
          <h2 class="section-title">审计日志</h2>
          <div class="section-actions">
            <select v-model="filterAction" class="filter-select">
              <option value="">全部操作</option>
              <option value="compile">编译</option>
              <option value="apply">应用</option>
              <option value="undo">撤销</option>
            </select>
            <select v-model="filterStatus" class="filter-select">
              <option value="">全部状态</option>
              <option value="success">成功</option>
              <option value="error">错误</option>
              <option value="rejected">拒绝</option>
            </select>
            <button class="btn-refresh" @click="loadLogs">🔄 刷新</button>
          </div>
        </div>

        <div v-if="isLoading" class="loading">加载中...</div>

        <div v-else-if="errorMessage" class="error-alert">
          {{ errorMessage }}
        </div>

        <div v-else class="table-container">
          <table class="audit-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>操作</th>
                <th>状态</th>
                <th>会话ID</th>
                <th>IP</th>
                <th>详情</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredLogs" :key="log.id">
                <td>{{ formatTime(log.timestamp) }}</td>
                <td>
                  <span class="badge badge-action">{{ log.action }}</span>
                </td>
                <td>
                  <span :class="['badge', `badge-${log.status}`]">
                    {{ log.status }}
                  </span>
                </td>
                <td>
                  <code class="code-text">{{ log.session_id || '-' }}</code>
                </td>
                <td>
                  <code class="code-text">{{ log.ip || '-' }}</code>
                </td>
                <td>
                  <button
                    class="btn-detail"
                    @click="showDetail(log)"
                    title="查看详情"
                  >
                    📄
                  </button>
                </td>
                <td>
                  <button
                    v-if="log.session_id || log.ip"
                    class="btn-ban"
                    @click="handleBan(log.session_id || log.ip)"
                    title="封禁"
                  >
                    🚫
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredLogs.length === 0" class="empty-state">
            暂无日志记录
          </div>
        </div>
      </div>

      <!-- 详情弹窗 -->
      <div v-if="selectedLog" class="modal-overlay" @click="closeDetail">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>日志详情</h3>
            <button class="modal-close" @click="closeDetail">×</button>
          </div>
          <div class="modal-body">
            <pre class="detail-json">{{ JSON.stringify(selectedLog, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { mvpApi } from '../utils/mvpApi';

const router = useRouter();

// 状态
const logs = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const selectedLog = ref(null);
const filterAction = ref('');
const filterStatus = ref('');

// 统计数据
const stats = computed(() => {
  const total = logs.value.length;
  let recentRejections = 0;
  let recentErrors = 0;

  const oneHourAgo = Date.now() - 60 * 60 * 1000;

  for (const log of logs.value) {
    const logTime = new Date(log.timestamp).getTime();
    if (logTime > oneHourAgo) {
      if (log.status === 'error') recentErrors++;
      if (log.status === 'rejected' || log.status === 'policy_rejected') {
        recentRejections++;
      }
    }
  }

  return { total, recentRejections, recentErrors };
});

// 过滤后的日志
const filteredLogs = computed(() => {
  let filtered = logs.value;

  if (filterAction.value) {
    filtered = filtered.filter(log => log.action === filterAction.value);
  }

  if (filterStatus.value) {
    filtered = filtered.filter(log => log.status === filterStatus.value);
  }

  return filtered;
});

// 加载日志
async function loadLogs() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const result = await mvpApi.getAuditLogs(200);
    if (result.status === 'ok') {
      logs.value = result.data.logs;
    } else {
      errorMessage.value = '加载失败：' + result.error;
    }
  } catch (error) {
    errorMessage.value = '请求失败：' + error.message;
  } finally {
    isLoading.value = false;
  }
}

// 格式化时间
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// 显示详情
function showDetail(log) {
  selectedLog.value = log;
}

// 关闭详情
function closeDetail() {
  selectedLog.value = null;
}

// 封禁
async function handleBan(target) {
  if (!confirm(`确认封禁 ${target} ？`)) return;

  try {
    const result = await mvpApi.ban(target);
    if (result.status === 'ok') {
      alert('封禁成功');
      loadLogs();
    } else {
      alert('封禁失败：' + result.error);
    }
  } catch (error) {
    alert('请求失败：' + error.message);
  }
}

// 返回首页
function goBack() {
  router.push('/');
}

// 初始化
onMounted(() => {
  loadLogs();
});
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.admin-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.btn-back {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #5568d3;
}

.admin-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
}

/* 审计部分 */
.audit-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-refresh {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background: #059669;
}

/* 表格 */
.table-container {
  overflow-x: auto;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.audit-table thead {
  background: #f8f9fa;
}

.audit-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid #e0e0e0;
}

.audit-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.audit-table tbody tr:hover {
  background: #f8f9ff;
}

.code-text {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-action {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-error {
  background: #f8d7da;
  color: #721c24;
}

.badge-rejected,
.badge-policy_rejected {
  background: #fff3cd;
  color: #856404;
}

.badge-rate_limited {
  background: #ffeaa7;
  color: #d63031;
}

.badge-banned {
  background: #dfe6e9;
  color: #2d3436;
}

.btn-detail,
.btn-ban {
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s ease;
}

.btn-detail:hover,
.btn-ban:hover {
  transform: scale(1.2);
}

.loading,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

.error-alert {
  padding: 16px;
  background: #fee;
  color: #c00;
  border: 1px solid #fcc;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f5f5f5;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e0e0e0;
  transform: rotate(90deg);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.detail-json {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .audit-table {
    font-size: 12px;
  }

  .audit-table th,
  .audit-table td {
    padding: 8px;
  }
}
</style>
