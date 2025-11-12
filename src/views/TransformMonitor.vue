<template>
  <div class="transform-monitor">
    <el-card class="header-card">
      <h2>站点转换监控</h2>
      <p class="subtitle">实时监控用户站点改造请求和安全事件</p>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409EFF;">
              <el-icon :size="32"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ metrics.sessions.totalSessions }}</div>
              <div class="stat-label">总会话数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67C23A;">
              <el-icon :size="32"><Check /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ metrics.sessions.activeSessions }}</div>
              <div class="stat-label">活跃会话</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #E6A23C;">
              <el-icon :size="32"><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ metrics.security.recentWarnings }}</div>
              <div class="stat-label">近期警告</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #F56C6C;">
              <el-icon :size="32"><Close /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ metrics.security.bannedIPs }}</div>
              <div class="stat-label">封禁IP数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 会话列表 -->
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">活跃会话</span>
          <el-button type="primary" size="small" @click="refreshData">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <el-table :data="sessions" stripe style="width: 100%">
        <el-table-column prop="id" label="会话ID" width="180" />
        <el-table-column prop="ipHash" label="IP哈希" width="150" />
        <el-table-column prop="requestCount" label="请求数" width="100" />
        <el-table-column prop="snapshotCount" label="快照数" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column prop="expiresAt" label="过期时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isExpired ? 'danger' : 'success'">
              {{ row.isExpired ? '已过期' : '活跃' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 审计日志 -->
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">审计日志</span>
          <el-select v-model="logFilter" size="small" style="width: 120px;">
            <el-option label="全部" value="all" />
            <el-option label="错误" value="error" />
            <el-option label="警告" value="warning" />
            <el-option label="信息" value="info" />
          </el-select>
        </div>
      </template>

      <el-table :data="filteredLogs" stripe style="width: 100%" max-height="400">
        <el-table-column prop="timestamp" label="时间" width="180" />
        <el-table-column label="级别" width="100">
          <template #default="{ row }">
            <el-tag
              :type="getLogLevelType(row.level)"
              size="small"
            >
              {{ row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="event" label="事件" width="200" />
        <el-table-column prop="sessionId" label="会话ID" width="180" />
        <el-table-column label="详情">
          <template #default="{ row }">
            <pre class="log-detail">{{ formatLogData(row) }}</pre>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- IP黑名单管理 -->
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">IP黑名单</span>
          <el-button type="danger" size="small" @click="showBanDialog = true">
            <el-icon><Lock /></el-icon>
            封禁IP
          </el-button>
        </div>
      </template>

      <el-table :data="blacklist" stripe style="width: 100%">
        <el-table-column prop="ipHash" label="IP哈希" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="unbanIP(row.ipHash)">
              解封
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 封禁对话框 -->
    <el-dialog v-model="showBanDialog" title="封禁IP" width="400px">
      <el-form :model="banForm" label-width="80px">
        <el-form-item label="IP地址">
          <el-input v-model="banForm.ip" placeholder="请输入要封禁的IP地址" />
        </el-form-item>
        <el-form-item label="原因">
          <el-input
            v-model="banForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入封禁原因"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showBanDialog = false">取消</el-button>
        <el-button type="danger" @click="banIP">确认封禁</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  Document,
  Check,
  Warning,
  Close,
  Refresh,
  Lock
} from '@element-plus/icons-vue';
import axios from 'axios';

// 响应式数据
const metrics = ref({
  sessions: {
    totalSessions: 0,
    activeSessions: 0,
    totalSnapshots: 0
  },
  security: {
    totalAuditLogs: 0,
    bannedIPs: 0,
    activeIPTracking: 0,
    recentIncidents: 0,
    recentWarnings: 0
  },
  recentLogs: []
});

const sessions = ref([]);
const blacklist = ref([]);
const logFilter = ref('all');
const showBanDialog = ref(false);
const banForm = ref({
  ip: '',
  reason: ''
});

// 计算过滤后的日志
const filteredLogs = computed(() => {
  if (logFilter.value === 'all') {
    return metrics.value.recentLogs;
  }
  return metrics.value.recentLogs.filter(log => log.level === logFilter.value);
});

// 获取日志级别类型
const getLogLevelType = (level) => {
  const types = {
    error: 'danger',
    critical: 'danger',
    warning: 'warning',
    info: 'info'
  };
  return types[level] || 'info';
};

// 格式化日志数据
const formatLogData = (log) => {
  const data = { ...log };
  delete data.timestamp;
  delete data.event;
  delete data.level;
  delete data.sessionId;

  if (Object.keys(data).length === 0) {
    return '-';
  }

  return JSON.stringify(data, null, 2);
};

// 刷新数据
const refreshData = async () => {
  try {
    // 获取统计数据
    const metricsRes = await axios.get('/api/admin/transform/metrics', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (metricsRes.data.success) {
      metrics.value = metricsRes.data.metrics;
    }

    // 获取会话列表
    const sessionsRes = await axios.get('/api/admin/transform/sessions', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (sessionsRes.data.success) {
      sessions.value = sessionsRes.data.sessions;
    }

    // 获取黑名单
    const blacklistRes = await axios.get('/api/admin/transform/blacklist', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (blacklistRes.data.success) {
      blacklist.value = blacklistRes.data.blacklist;
    }

    ElMessage.success('数据已刷新');
  } catch (error) {
    ElMessage.error('刷新数据失败: ' + (error.response?.data?.error || error.message));
  }
};

// 封禁IP
const banIP = async () => {
  if (!banForm.value.ip) {
    ElMessage.warning('请输入IP地址');
    return;
  }

  try {
    const response = await axios.post('/api/admin/transform/ban', banForm.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.data.success) {
      ElMessage.success('IP已封禁');
      showBanDialog.value = false;
      banForm.value = { ip: '', reason: '' };
      await refreshData();
    }
  } catch (error) {
    ElMessage.error('封禁失败: ' + (error.response?.data?.error || error.message));
  }
};

// 解封IP
const unbanIP = async (ipHash) => {
  try {
    // 注意：这里传的是 ipHash，但后端需要原始 IP
    // 实际应用中需要存储完整 IP 信息或提供其他解封方式
    const response = await axios.post(
      '/api/admin/transform/unban',
      { ip: ipHash },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    if (response.data.success) {
      ElMessage.success('IP已解封');
      await refreshData();
    }
  } catch (error) {
    ElMessage.error('解封失败: ' + (error.response?.data?.error || error.message));
  }
};

// 定时刷新
let refreshTimer = null;

onMounted(() => {
  refreshData();
  // 每30秒自动刷新
  refreshTimer = setInterval(refreshData, 30000);
});

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});
</script>

<style scoped>
.transform-monitor {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header-card h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
}

.stat-label {
  margin-top: 4px;
  font-size: 14px;
  color: #909399;
}

.content-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.log-detail {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin: 0;
  padding: 4px;
  background: #f5f7fa;
  border-radius: 4px;
  max-height: 100px;
  overflow: auto;
}
</style>
