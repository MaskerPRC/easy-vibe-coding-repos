<template>
  <div class="task-manager">
    <h2>📋 任务管理系统 (TaskInnerSupport)</h2>

    <!-- 创建任务表单 -->
    <div class="task-form">
      <h3>创建新任务</h3>
      <div class="form-group">
        <label>任务名称：</label>
        <input
          v-model="newTask.name"
          type="text"
          placeholder="输入任务名称"
          @keyup.enter="createTask"
        >
      </div>
      <div class="form-group">
        <label>任务类型：</label>
        <select v-model="newTask.type">
          <option value="command">命令执行</option>
          <option value="file">文件处理</option>
          <option value="custom">自定义任务</option>
        </select>
      </div>
      <div class="form-group">
        <label>任务内容：</label>
        <textarea
          v-model="newTask.content"
          placeholder="输入任务内容（命令、文件路径等）"
          rows="3"
        ></textarea>
      </div>
      <div class="form-group">
        <label>优先级：</label>
        <select v-model="newTask.priority">
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </div>
      <div class="form-group">
        <label>描述：</label>
        <input
          v-model="newTask.description"
          type="text"
          placeholder="任务描述（可选）"
        >
      </div>
      <button @click="createTask" class="btn-primary">创建任务</button>
    </div>

    <!-- 任务统计 -->
    <div class="task-stats">
      <div class="stat-card">
        <div class="stat-label">总任务</div>
        <div class="stat-value">{{ tasks.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">待执行</div>
        <div class="stat-value pending">{{ tasksByStatus.pending }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">执行中</div>
        <div class="stat-value running">{{ tasksByStatus.running }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">已完成</div>
        <div class="stat-value completed">{{ tasksByStatus.completed }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">失败</div>
        <div class="stat-value failed">{{ tasksByStatus.failed }}</div>
      </div>
    </div>

    <!-- 任务过滤 -->
    <div class="task-filter">
      <button
        v-for="status in ['all', 'pending', 'running', 'completed', 'failed']"
        :key="status"
        @click="filterStatus = status"
        :class="{ active: filterStatus === status }"
      >
        {{ statusLabels[status] }}
      </button>
    </div>

    <!-- 任务列表 -->
    <div class="task-list">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        :class="['task-item', task.status]"
      >
        <div class="task-header">
          <div class="task-title">
            <span class="task-icon">{{ typeIcons[task.type] }}</span>
            <span class="task-name">{{ task.name }}</span>
            <span :class="['task-priority', task.priority]">{{ priorityLabels[task.priority] }}</span>
          </div>
          <div class="task-actions">
            <button
              v-if="task.status === 'pending'"
              @click="executeTask(task.id)"
              class="btn-small btn-execute"
              title="执行任务"
            >
              ▶️
            </button>
            <button
              v-if="task.status === 'running'"
              @click="stopTask(task.id)"
              class="btn-small btn-stop"
              title="停止任务"
            >
              ⏸️
            </button>
            <button
              @click="viewTaskDetails(task)"
              class="btn-small"
              title="查看详情"
            >
              👁️
            </button>
            <button
              @click="deleteTask(task.id)"
              class="btn-small btn-delete"
              title="删除任务"
            >
              🗑️
            </button>
          </div>
        </div>

        <div class="task-info">
          <div class="task-description">{{ task.description || '无描述' }}</div>
          <div class="task-meta">
            <span>类型: {{ typeLabels[task.type] }}</span>
            <span>状态: {{ statusLabels[task.status] }}</span>
            <span>创建: {{ formatDate(task.createdAt) }}</span>
            <span v-if="task.executedAt">执行: {{ formatDate(task.executedAt) }}</span>
          </div>
        </div>

        <div v-if="task.content" class="task-content">
          <strong>内容:</strong> <code>{{ task.content }}</code>
        </div>

        <div v-if="task.result" class="task-result">
          <strong>执行结果:</strong>
          <pre>{{ task.result }}</pre>
        </div>

        <div v-if="task.error" class="task-error">
          <strong>错误信息:</strong>
          <pre>{{ task.error }}</pre>
        </div>
      </div>

      <div v-if="filteredTasks.length === 0" class="no-tasks">
        暂无任务
      </div>
    </div>

    <!-- 任务详情弹窗 -->
    <div v-if="selectedTask" class="modal" @click.self="selectedTask = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>任务详情</h3>
          <button @click="selectedTask = null" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <strong>ID:</strong> {{ selectedTask.id }}
          </div>
          <div class="detail-row">
            <strong>名称:</strong> {{ selectedTask.name }}
          </div>
          <div class="detail-row">
            <strong>类型:</strong> {{ typeLabels[selectedTask.type] }}
          </div>
          <div class="detail-row">
            <strong>优先级:</strong> {{ priorityLabels[selectedTask.priority] }}
          </div>
          <div class="detail-row">
            <strong>状态:</strong> {{ statusLabels[selectedTask.status] }}
          </div>
          <div class="detail-row">
            <strong>描述:</strong> {{ selectedTask.description || '无' }}
          </div>
          <div class="detail-row">
            <strong>内容:</strong>
            <pre>{{ selectedTask.content }}</pre>
          </div>
          <div class="detail-row">
            <strong>创建时间:</strong> {{ formatDate(selectedTask.createdAt) }}
          </div>
          <div v-if="selectedTask.executedAt" class="detail-row">
            <strong>执行时间:</strong> {{ formatDate(selectedTask.executedAt) }}
          </div>
          <div v-if="selectedTask.completedAt" class="detail-row">
            <strong>完成时间:</strong> {{ formatDate(selectedTask.completedAt) }}
          </div>
          <div v-if="selectedTask.result" class="detail-row">
            <strong>执行结果:</strong>
            <pre>{{ selectedTask.result }}</pre>
          </div>
          <div v-if="selectedTask.error" class="detail-row">
            <strong>错误信息:</strong>
            <pre class="error-text">{{ selectedTask.error }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'TaskManager',
  setup() {
    const tasks = ref([]);
    const filterStatus = ref('all');
    const selectedTask = ref(null);

    const newTask = ref({
      name: '',
      type: 'command',
      content: '',
      priority: 'medium',
      description: ''
    });

    const typeLabels = {
      command: '命令执行',
      file: '文件处理',
      custom: '自定义任务'
    };

    const typeIcons = {
      command: '⚡',
      file: '📁',
      custom: '⚙️'
    };

    const statusLabels = {
      all: '全部',
      pending: '待执行',
      running: '执行中',
      completed: '已完成',
      failed: '失败'
    };

    const priorityLabels = {
      low: '低',
      medium: '中',
      high: '高'
    };

    // 计算属性：按状态统计任务
    const tasksByStatus = computed(() => {
      return {
        pending: tasks.value.filter(t => t.status === 'pending').length,
        running: tasks.value.filter(t => t.status === 'running').length,
        completed: tasks.value.filter(t => t.status === 'completed').length,
        failed: tasks.value.filter(t => t.status === 'failed').length
      };
    });

    // 计算属性：过滤后的任务
    const filteredTasks = computed(() => {
      if (filterStatus.value === 'all') {
        return tasks.value;
      }
      return tasks.value.filter(t => t.status === filterStatus.value);
    });

    // 格式化日期
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleString('zh-CN');
    };

    // 加载任务列表
    const loadTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        tasks.value = response.data.tasks || [];
      } catch (error) {
        console.error('加载任务失败:', error);
        alert('加载任务失败: ' + (error.response?.data?.error || error.message));
      }
    };

    // 创建任务
    const createTask = async () => {
      if (!newTask.value.name.trim()) {
        alert('请输入任务名称');
        return;
      }
      if (!newTask.value.content.trim()) {
        alert('请输入任务内容');
        return;
      }

      try {
        const response = await axios.post('/api/tasks', newTask.value);
        tasks.value.unshift(response.data.task);

        // 重置表单
        newTask.value = {
          name: '',
          type: 'command',
          content: '',
          priority: 'medium',
          description: ''
        };

        alert('任务创建成功！');
      } catch (error) {
        console.error('创建任务失败:', error);
        alert('创建任务失败: ' + (error.response?.data?.error || error.message));
      }
    };

    // 执行任务
    const executeTask = async (taskId) => {
      try {
        const response = await axios.post(`/api/tasks/${taskId}/execute`);
        const updatedTask = response.data.task;

        // 更新任务列表
        const index = tasks.value.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }

        alert('任务执行成功！');
      } catch (error) {
        console.error('执行任务失败:', error);
        alert('执行任务失败: ' + (error.response?.data?.error || error.message));

        // 刷新任务列表以获取最新状态
        loadTasks();
      }
    };

    // 停止任务
    const stopTask = async (taskId) => {
      try {
        const response = await axios.post(`/api/tasks/${taskId}/stop`);
        const updatedTask = response.data.task;

        // 更新任务列表
        const index = tasks.value.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks.value[index] = updatedTask;
        }

        alert('任务已停止');
      } catch (error) {
        console.error('停止任务失败:', error);
        alert('停止任务失败: ' + (error.response?.data?.error || error.message));
      }
    };

    // 删除任务
    const deleteTask = async (taskId) => {
      if (!confirm('确定要删除这个任务吗？')) {
        return;
      }

      try {
        await axios.delete(`/api/tasks/${taskId}`);
        tasks.value = tasks.value.filter(t => t.id !== taskId);
        alert('任务已删除');
      } catch (error) {
        console.error('删除任务失败:', error);
        alert('删除任务失败: ' + (error.response?.data?.error || error.message));
      }
    };

    // 查看任务详情
    const viewTaskDetails = (task) => {
      selectedTask.value = task;
    };

    // 组件挂载时加载任务
    onMounted(() => {
      loadTasks();
    });

    return {
      tasks,
      newTask,
      filterStatus,
      selectedTask,
      typeLabels,
      typeIcons,
      statusLabels,
      priorityLabels,
      tasksByStatus,
      filteredTasks,
      formatDate,
      loadTasks,
      createTask,
      executeTask,
      stopTask,
      deleteTask,
      viewTaskDetails
    };
  }
};
</script>

<style scoped>
.task-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

/* 任务表单 */
.task-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.task-form h3 {
  margin-top: 0;
  color: #555;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #666;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  font-family: monospace;
}

/* 按钮 */
.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-small {
  padding: 4px 8px;
  border: none;
  background: #f0f0f0;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 5px;
  font-size: 12px;
}

.btn-small:hover {
  background: #e0e0e0;
}

.btn-execute {
  background: #28a745;
  color: white;
}

.btn-execute:hover {
  background: #218838;
}

.btn-stop {
  background: #ffc107;
  color: white;
}

.btn-stop:hover {
  background: #e0a800;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}

/* 任务统计 */
.task-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 120px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-value.pending {
  color: #ffc107;
}

.stat-value.running {
  color: #17a2b8;
}

.stat-value.completed {
  color: #28a745;
}

.stat-value.failed {
  color: #dc3545;
}

/* 任务过滤 */
.task-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.task-filter button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.task-filter button:hover {
  background: #f0f0f0;
}

.task-filter button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* 任务列表 */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-left: 4px solid #ddd;
}

.task-item.pending {
  border-left-color: #ffc107;
}

.task-item.running {
  border-left-color: #17a2b8;
}

.task-item.completed {
  border-left-color: #28a745;
}

.task-item.failed {
  border-left-color: #dc3545;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 16px;
}

.task-icon {
  font-size: 20px;
}

.task-name {
  color: #333;
}

.task-priority {
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: normal;
}

.task-priority.low {
  background: #e0e0e0;
  color: #666;
}

.task-priority.medium {
  background: #fff3cd;
  color: #856404;
}

.task-priority.high {
  background: #f8d7da;
  color: #721c24;
}

.task-actions {
  display: flex;
  align-items: center;
}

.task-info {
  margin-bottom: 10px;
}

.task-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.task-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
  flex-wrap: wrap;
}

.task-content {
  margin: 10px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 13px;
}

.task-content code {
  font-family: monospace;
  color: #333;
}

.task-result {
  margin: 10px 0;
  padding: 10px;
  background: #d4edda;
  border-radius: 4px;
  font-size: 13px;
}

.task-result pre {
  margin: 5px 0 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 12px;
}

.task-error {
  margin: 10px 0;
  padding: 10px;
  background: #f8d7da;
  border-radius: 4px;
  font-size: 13px;
}

.task-error pre {
  margin: 5px 0 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  font-size: 12px;
  color: #721c24;
}

.no-tasks {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

/* 弹窗 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.detail-row {
  margin-bottom: 15px;
}

.detail-row strong {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.detail-row pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 5px 0 0 0;
}

.error-text {
  color: #dc3545;
}
</style>
