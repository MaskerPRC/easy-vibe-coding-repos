<template>
  <div class="transform-widget">
    <!-- 悬浮按钮 -->
    <transition name="bounce">
      <div
        v-if="!dialogVisible"
        class="floating-button"
        @click="openDialog"
        :title="isExpired ? '会话已过期，点击创建新会话' : '提需求'"
      >
        <el-icon :size="24">
          <Edit />
        </el-icon>
        <span v-if="pendingCount > 0" class="badge">{{ pendingCount }}</span>
      </div>
    </transition>

    <!-- 对话框 -->
    <el-drawer
      v-model="dialogVisible"
      title="提需求 - 即时改造站点"
      size="500px"
      direction="rtl"
      :close-on-click-modal="false"
    >
      <div class="dialog-content">
        <!-- 提示信息 -->
        <el-alert
          title="安全提示"
          type="info"
          :closable="false"
          show-icon
          class="info-alert"
        >
          <p>本功能仅做页面呈现层的安全改造，禁止输入敏感信息（密钥、密码等）。</p>
          <p>改造将在 30 分钟后自动过期恢复。</p>
        </el-alert>

        <!-- 会话信息 -->
        <div v-if="sessionId" class="session-info">
          <el-tag type="success" size="small">
            会话有效期: {{ formatTTL(ttl) }}
          </el-tag>
          <el-tag v-if="historySize > 0" type="info" size="small">
            历史快照: {{ historySize }}
          </el-tag>
        </div>

        <!-- 输入框 -->
        <div class="input-section">
          <el-input
            v-model="userInput"
            type="textarea"
            :rows="4"
            placeholder="请输入您的需求（例如：把标题改成「欢迎」、改为蓝色主题、隐藏横幅等）"
            :maxlength="800"
            show-word-limit
            :disabled="loading"
          />
        </div>

        <!-- 预览区 -->
        <div v-if="preview" class="preview-section">
          <el-divider>预览</el-divider>
          <div class="preview-content">
            <div class="preview-header">
              <span class="preview-title">将执行以下改造：</span>
              <el-tag v-if="preview.warnings && preview.warnings.length > 0" type="warning" size="small">
                有警告
              </el-tag>
            </div>
            <ul class="change-list">
              <li v-for="(change, index) in preview.dsl.changes" :key="index">
                {{ formatChange(change) }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 错误提示 -->
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          :closable="true"
          @close="error = ''"
          class="error-alert"
        />

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button
            v-if="!preview"
            type="primary"
            :loading="loading"
            :disabled="!userInput.trim() || !sessionId"
            @click="generatePreview"
          >
            生成预览
          </el-button>

          <template v-else>
            <el-button @click="clearPreview">
              取消
            </el-button>
            <el-button
              type="primary"
              :loading="loading"
              @click="applyTransform"
            >
              应用改造
            </el-button>
          </template>

          <el-button
            v-if="historySize > 0"
            type="warning"
            :disabled="loading"
            @click="undoTransform"
          >
            撤销
          </el-button>

          <el-button
            v-if="historySize > 0"
            type="danger"
            :disabled="loading"
            @click="resetToInitial"
          >
            恢复初始
          </el-button>
        </div>

        <!-- 历史记录 -->
        <div v-if="history.length > 0" class="history-section">
          <el-divider>改造历史</el-divider>
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in history.slice().reverse()"
              :key="index"
              :timestamp="item.timestamp"
              placement="top"
            >
              {{ item.description }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
import axios from 'axios';

// 响应式数据
const dialogVisible = ref(false);
const sessionId = ref('');
const userInput = ref('');
const loading = ref(false);
const error = ref('');
const preview = ref(null);
const history = ref([]);
const pendingCount = ref(0);
const ttl = ref(0);
const historySize = ref(0);
const isExpired = ref(false);

// 会话检查定时器
let sessionCheckTimer = null;
let ttlUpdateTimer = null;

// 格式化改造描述
const formatChange = (change) => {
  switch (change.op) {
    case 'set_text':
      return `修改文本: ${change.selector} → "${change.text}"`;
    case 'set_style_var':
      return `修改样式: ${change.var} → ${change.value}`;
    case 'toggle':
      return `${change.enabled ? '显示' : '隐藏'}: ${change.selector}`;
    case 'reorder':
      return `重新排序: ${change.selector}`;
    case 'set_prop':
      return `设置属性: ${change.selector}.${change.prop} → ${change.value}`;
    default:
      return `未知操作: ${change.op}`;
  }
};

// 格式化 TTL
const formatTTL = (ms) => {
  if (ms <= 0) return '已过期';
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}分${seconds}秒`;
};

// 创建会话
const createSession = async () => {
  try {
    const response = await axios.post('/api/transform/session');
    if (response.data.success) {
      sessionId.value = response.data.sessionId;
      localStorage.setItem('transform_session_id', sessionId.value);
      isExpired.value = false;
      await updateSessionState();
      ElMessage.success('会话创建成功');
    }
  } catch (err) {
    error.value = err.response?.data?.error || '创建会话失败';
    ElMessage.error(error.value);
  }
};

// 更新会话状态
const updateSessionState = async () => {
  if (!sessionId.value) return;

  try {
    const response = await axios.get('/api/transform/session/state', {
      params: { sessionId: sessionId.value }
    });

    if (response.data.success) {
      ttl.value = response.data.ttlMs;
      historySize.value = response.data.historySize;
      isExpired.value = false;
    }
  } catch (err) {
    if (err.response?.status === 404) {
      // 会话过期
      isExpired.value = true;
      sessionId.value = '';
      localStorage.removeItem('transform_session_id');
    }
  }
};

// 生成预览
const generatePreview = async () => {
  if (!userInput.value.trim()) {
    error.value = '请输入需求内容';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('/api/transform/compile', {
      text: userInput.value,
      sessionId: sessionId.value,
      dryRun: true
    });

    if (response.data.success) {
      preview.value = response.data;
      ElMessage.success('预览生成成功');
    }
  } catch (err) {
    error.value = err.response?.data?.error || '生成预览失败';
    if (err.response?.data?.risks) {
      const risks = err.response.data.risks;
      error.value += `: ${risks.map(r => r.message).join(', ')}`;
    }
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
};

// 应用转换
const applyTransform = async () => {
  if (!preview.value) return;

  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('/api/transform/apply', {
      sessionId: sessionId.value,
      dsl: preview.value.dsl
    });

    if (response.data.success) {
      // 通知父组件应用补丁
      window.dispatchEvent(new CustomEvent('apply-transform', {
        detail: { dsl: preview.value.dsl }
      }));

      // 添加到历史
      history.value.push({
        timestamp: new Date().toLocaleString(),
        description: userInput.value.substring(0, 50) + (userInput.value.length > 50 ? '...' : '')
      });

      // 清理
      userInput.value = '';
      preview.value = null;
      await updateSessionState();

      ElMessage.success('改造已应用');
    }
  } catch (err) {
    error.value = err.response?.data?.error || '应用改造失败';
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
};

// 撤销转换
const undoTransform = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('/api/transform/undo', {
      sessionId: sessionId.value,
      steps: 1
    });

    if (response.data.success) {
      // 通知父组件撤销
      window.dispatchEvent(new CustomEvent('undo-transform', {
        detail: { dsl: response.data.dsl }
      }));

      if (history.value.length > 0) {
        history.value.pop();
      }

      await updateSessionState();
      ElMessage.success('已撤销');
    }
  } catch (err) {
    error.value = err.response?.data?.error || '撤销失败';
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
};

// 恢复初始状态
const resetToInitial = async () => {
  const count = historySize.value;
  if (count === 0) return;

  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('/api/transform/undo', {
      sessionId: sessionId.value,
      steps: count
    });

    if (response.data.success) {
      // 通知父组件重置
      window.dispatchEvent(new CustomEvent('reset-transform'));

      history.value = [];
      await updateSessionState();

      ElMessage.success('已恢复初始状态');
    }
  } catch (err) {
    error.value = err.response?.data?.error || '恢复失败';
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
};

// 清除预览
const clearPreview = () => {
  preview.value = null;
  error.value = '';
};

// 打开对话框
const openDialog = async () => {
  dialogVisible.value = true;

  // 如果没有会话或会话过期，创建新会话
  if (!sessionId.value || isExpired.value) {
    await createSession();
  } else {
    await updateSessionState();
  }
};

// 初始化
onMounted(() => {
  // 尝试恢复会话
  const savedSessionId = localStorage.getItem('transform_session_id');
  if (savedSessionId) {
    sessionId.value = savedSessionId;
    updateSessionState();
  }

  // 定期检查会话状态
  sessionCheckTimer = setInterval(() => {
    if (sessionId.value) {
      updateSessionState();
    }
  }, 30000); // 30秒检查一次

  // 更新 TTL 显示
  ttlUpdateTimer = setInterval(() => {
    if (ttl.value > 0) {
      ttl.value -= 1000;
    }
  }, 1000);
});

// 清理
onUnmounted(() => {
  if (sessionCheckTimer) {
    clearInterval(sessionCheckTimer);
  }
  if (ttlUpdateTimer) {
    clearInterval(ttlUpdateTimer);
  }
});
</script>

<style scoped>
.transform-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

.floating-button {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
}

.floating-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.floating-button .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f56c6c;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.info-alert {
  margin-bottom: 8px;
}

.info-alert p {
  margin: 4px 0;
  font-size: 13px;
  line-height: 1.5;
}

.session-info {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.input-section {
  margin: 8px 0;
}

.preview-section {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 12px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.preview-title {
  font-weight: 600;
  color: #303133;
}

.change-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.change-list li {
  padding: 6px 0;
  border-bottom: 1px solid #e4e7ed;
  font-size: 14px;
  color: #606266;
}

.change-list li:last-child {
  border-bottom: none;
}

.error-alert {
  margin: 8px 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.history-section {
  margin-top: 16px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
