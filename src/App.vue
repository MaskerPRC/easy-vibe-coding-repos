<template>
  <div class="app">
    <div class="container">
      <!-- 头部 -->
      <header class="header">
        <h1 class="title">Bash 历史记录查看器</h1>
        <button @click="importHistory" class="import-btn" :disabled="loading">
          <span v-if="loading">导入中...</span>
          <span v-else>导入历史记录</span>
        </button>
      </header>

      <!-- 状态信息 -->
      <div class="status-bar" v-if="lastUpdated || error">
        <div class="status-info" v-if="lastUpdated">
          <span class="label">最后更新:</span>
          <span class="value">{{ formatDate(lastUpdated) }}</span>
          <span class="label">命令数量:</span>
          <span class="value">{{ commandCount }}</span>
        </div>
        <div class="error-message" v-if="error">
          <span class="error-icon">⚠</span>
          {{ error }}
        </div>
      </div>

      <!-- 命令列表 -->
      <div class="commands-container">
        <div v-if="commands.length === 0 && !loading" class="empty-state">
          <p class="empty-icon">📋</p>
          <p class="empty-text">暂无历史记录</p>
          <p class="empty-hint">点击上方按钮导入 /root/.bash_history</p>
        </div>

        <div v-else class="commands-list">
          <div
            v-for="cmd in commands"
            :key="cmd.id"
            class="command-item"
          >
            <span class="command-id">{{ cmd.id }}</span>
            <span class="command-text">{{ cmd.command }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 响应式数据
const commands = ref([]);
const lastUpdated = ref(null);
const commandCount = ref(0);
const error = ref(null);
const loading = ref(false);

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 获取历史记录
const fetchHistory = async () => {
  try {
    const response = await fetch('/api/bash-history');
    const data = await response.json();

    commands.value = data.commands || [];
    lastUpdated.value = data.lastUpdated;
    commandCount.value = data.count || 0;
    error.value = data.error;
  } catch (err) {
    error.value = '获取历史记录失败: ' + err.message;
    console.error('获取历史记录失败:', err);
  }
};

// 导入历史记录
const importHistory = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('/api/bash-history/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      // 导入成功后，重新获取数据
      await fetchHistory();
    } else {
      error.value = data.error || '导入失败';
    }
  } catch (err) {
    error.value = '导入历史记录失败: ' + err.message;
    console.error('导入失败:', err);
  } finally {
    loading.value = false;
  }
};

// 页面加载时获取历史记录
onMounted(() => {
  fetchHistory();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #0a0a0a;
  color: #00ff00;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 8px;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.import-btn {
  padding: 10px 20px;
  background: #00ff00;
  color: #0a0a0a;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.import-btn:hover:not(:disabled) {
  background: #00cc00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3);
}

.import-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 状态栏样式 */
.status-bar {
  padding: 15px 20px;
  background: #1a1a1a;
  border: 1px solid #00ff00;
  border-radius: 8px;
  margin-bottom: 20px;
}

.status-info {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.label {
  color: #00ff00;
  font-weight: bold;
  opacity: 0.8;
}

.value {
  color: #00ff00;
  margin-right: 10px;
}

.error-message {
  color: #ff6b6b;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.error-icon {
  font-size: 20px;
}

/* 命令列表容器 */
.commands-container {
  background: #1a1a1a;
  border: 2px solid #00ff00;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

/* 滚动条样式 */
.commands-container::-webkit-scrollbar {
  width: 10px;
}

.commands-container::-webkit-scrollbar-track {
  background: #0a0a0a;
}

.commands-container::-webkit-scrollbar-thumb {
  background: #00ff00;
  border-radius: 5px;
}

.commands-container::-webkit-scrollbar-thumb:hover {
  background: #00cc00;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-text {
  font-size: 20px;
  color: #00ff00;
  margin-bottom: 10px;
  opacity: 0.8;
}

.empty-hint {
  font-size: 14px;
  color: #00ff00;
  opacity: 0.6;
}

/* 命令列表 */
.commands-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.command-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: #0a0a0a;
  border: 1px solid #00ff00;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.command-item:hover {
  background: #1a1a1a;
  border-color: #00cc00;
  transform: translateX(5px);
}

.command-id {
  min-width: 60px;
  color: #00ff00;
  opacity: 0.6;
  font-weight: bold;
  text-align: right;
  margin-right: 20px;
}

.command-text {
  flex: 1;
  color: #00ff00;
  word-break: break-all;
  font-family: inherit;
  line-height: 1.5;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .app {
    padding: 10px;
  }

  .header {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .title {
    font-size: 18px;
    text-align: center;
  }

  .import-btn {
    width: 100%;
  }

  .status-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .commands-container {
    padding: 15px;
    max-height: calc(100vh - 350px);
  }

  .command-item {
    flex-direction: column;
    gap: 8px;
  }

  .command-id {
    min-width: auto;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 16px;
  }

  .import-btn {
    font-size: 12px;
    padding: 8px 16px;
  }

  .command-item {
    padding: 10px;
  }
}
</style>
