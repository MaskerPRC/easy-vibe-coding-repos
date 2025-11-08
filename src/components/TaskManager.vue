<template>
  <div class="task-manager">
    <div class="header">
      <h1>任务管理系统</h1>
      <div class="stats">
        <span>总任务数: {{ totalTasks }}</span>
        <span>已完成: {{ completedCount }}</span>
        <span>未完成: {{ pendingCount }}</span>
      </div>
      <div class="action-buttons">
        <button @click="initTasks" class="init-btn" :disabled="loading">
          {{ tasks.length === 0 ? '初始化 1000 个任务' : '重新初始化任务' }}
        </button>
        <button @click="deleteAllTasks" class="delete-btn" :disabled="loading || tasks.length === 0">
          删除所有任务
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="task-list">
      <div v-if="tasks.length === 0" class="empty-state">
        <p>暂无任务，请点击上方按钮初始化任务</p>
      </div>

      <div v-else class="tasks-container">
        <div class="filter-buttons">
          <button
            @click="filter = 'all'"
            :class="{ active: filter === 'all' }"
          >
            全部 ({{ totalTasks }})
          </button>
          <button
            @click="filter = 'pending'"
            :class="{ active: filter === 'pending' }"
          >
            未完成 ({{ pendingCount }})
          </button>
          <button
            @click="filter = 'completed'"
            :class="{ active: filter === 'completed' }"
          >
            已完成 ({{ completedCount }})
          </button>
        </div>

        <div class="task-items">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="task-item"
            :class="{ completed: task.completed }"
          >
            <div class="task-info">
              <div class="task-header">
                <span class="task-id">#{task.id}</span>
                <h3>{{ task.title }}</h3>
              </div>
              <p class="task-description">{{ task.description }}</p>
              <span class="task-time">创建时间: {{ formatDate(task.createdAt) }}</span>
              <span v-if="task.completed" class="task-time">
                完成时间: {{ formatDate(task.completedAt) }}
              </span>
            </div>
            <button
              v-if="!task.completed"
              @click="completeTask(task.id)"
              class="complete-btn"
              :disabled="completing === task.id"
            >
              {{ completing === task.id ? '处理中...' : '完成任务' }}
            </button>
            <span v-else class="completed-badge">✓ 已完成</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const tasks = ref([]);
const loading = ref(false);
const completing = ref(null);
const filter = ref('all');

const totalTasks = computed(() => tasks.value.length);
const completedCount = computed(() => tasks.value.filter(t => t.completed).length);
const pendingCount = computed(() => tasks.value.filter(t => !t.completed).length);

const filteredTasks = computed(() => {
  if (filter.value === 'all') return tasks.value;
  if (filter.value === 'pending') return tasks.value.filter(t => !t.completed);
  if (filter.value === 'completed') return tasks.value.filter(t => t.completed);
  return tasks.value;
});

// 加载任务列表
async function loadTasks() {
  loading.value = true;
  try {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    tasks.value = data.tasks || [];
  } catch (error) {
    console.error('加载任务失败:', error);
    alert('加载任务失败，请刷新页面重试');
  } finally {
    loading.value = false;
  }
}

// 初始化任务
async function initTasks() {
  if (tasks.value.length > 0) {
    if (!confirm('确定要重新初始化任务吗？这将清除所有现有任务。')) {
      return;
    }
  }

  loading.value = true;
  try {
    const response = await fetch('/api/tasks/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    if (data.success) {
      alert(`成功初始化 ${data.total} 个任务！`);
      await loadTasks();
    } else {
      alert('初始化任务失败: ' + data.message);
    }
  } catch (error) {
    console.error('初始化任务失败:', error);
    alert('初始化任务失败，请重试');
  } finally {
    loading.value = false;
  }
}

// 删除所有任务
async function deleteAllTasks() {
  if (!confirm('确定要删除所有任务吗？此操作不可恢复！')) {
    return;
  }

  loading.value = true;
  try {
    const response = await fetch('/api/tasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    if (data.success) {
      alert(`成功删除 ${data.deletedCount} 个任务！`);
      await loadTasks();
    } else {
      alert('删除任务失败: ' + data.message);
    }
  } catch (error) {
    console.error('删除任务失败:', error);
    alert('删除任务失败，请重试');
  } finally {
    loading.value = false;
  }
}

// 完成任务
async function completeTask(taskId) {
  completing.value = taskId;
  try {
    const response = await fetch(`/api/tasks/${taskId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    if (data.success) {
      // 更新本地任务状态
      const taskIndex = tasks.value.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = data.task;
      }

      // 任务完成后立即跳转到 v2ex.com
      setTimeout(() => {
        window.location.href = 'https://www.v2ex.com';
      }, 500);
    } else {
      alert('完成任务失败: ' + data.message);
    }
  } catch (error) {
    console.error('完成任务失败:', error);
    alert('完成任务失败，请重试');
  } finally {
    completing.value = null;
  }
}

// 格式化日期
function formatDate(dateString) {
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
}

// 组件挂载时加载任务
onMounted(() => {
  loadTasks();
});
</script>

<style scoped>
.task-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.header {
  background: #667eea;
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0 0 15px 0;
  font-size: 32px;
  font-weight: 700;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 16px;
}

.stats span {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.init-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.init-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.init-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-btn:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 20px;
  color: #667eea;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #666;
  font-size: 18px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-buttons button {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-buttons button:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-buttons button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.task-items {
  display: grid;
  gap: 15px;
}

.task-item {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.task-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.task-item.completed {
  background: #f8f9fa;
  border-color: #28a745;
  opacity: 0.8;
}

.task-info {
  flex: 1;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.task-id {
  background: #667eea;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.task-item.completed .task-id {
  background: #28a745;
}

.task-item h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.task-description {
  color: #666;
  margin: 8px 0;
  font-size: 14px;
}

.task-time {
  font-size: 12px;
  color: #999;
  margin-right: 15px;
}

.complete-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.complete-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.complete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.completed-badge {
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
