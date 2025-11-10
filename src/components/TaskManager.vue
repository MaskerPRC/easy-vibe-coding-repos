<template>
  <div class="task-manager">
    <h2>📋 Dark Task Grimoire (TaskInnerSupport)</h2>

    <!-- 创建任务表单 -->
    <div class="task-form">
      <h3>Summon New Task</h3>
      <div class="form-group">
        <label>Task Name:</label>
        <input
          v-model="newTask.name"
          type="text"
          placeholder="Enter task name"
          @keyup.enter="createTask"
        >
      </div>
      <div class="form-group">
        <label>Task Type:</label>
        <select v-model="newTask.type">
          <option value="command">Command Execution</option>
          <option value="file">File Processing</option>
          <option value="custom">Custom Ritual</option>
        </select>
      </div>
      <div class="form-group">
        <label>Task Content:</label>
        <textarea
          v-model="newTask.content"
          placeholder="Enter task content (commands, file paths, etc.)"
          rows="3"
        ></textarea>
      </div>
      <div class="form-group">
        <label>Priority:</label>
        <select v-model="newTask.priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div class="form-group">
        <label>Description:</label>
        <input
          v-model="newTask.description"
          type="text"
          placeholder="Task description (optional)"
        >
      </div>
      <button @click="createTask" class="btn-primary">Create Task</button>
    </div>

    <!-- 任务统计 -->
    <div class="task-stats">
      <div class="stat-card">
        <div class="stat-label">Total Tasks</div>
        <div class="stat-value">{{ tasks.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pending</div>
        <div class="stat-value pending">{{ tasksByStatus.pending }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Running</div>
        <div class="stat-value running">{{ tasksByStatus.running }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Completed</div>
        <div class="stat-value completed">{{ tasksByStatus.completed }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Failed</div>
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
              title="Execute Task"
            >
              ▶️
            </button>
            <button
              v-if="task.status === 'running'"
              @click="stopTask(task.id)"
              class="btn-small btn-stop"
              title="Stop Task"
            >
              ⏸️
            </button>
            <button
              @click="viewTaskDetails(task)"
              class="btn-small"
              title="View Details"
            >
              👁️
            </button>
            <button
              @click="deleteTask(task.id)"
              class="btn-small btn-delete"
              title="Delete Task"
            >
              🗑️
            </button>
          </div>
        </div>

        <div class="task-info">
          <div class="task-description">{{ task.description || 'No description' }}</div>
          <div class="task-meta">
            <span>Type: {{ typeLabels[task.type] }}</span>
            <span>Status: {{ statusLabels[task.status] }}</span>
            <span>Created: {{ formatDate(task.createdAt) }}</span>
            <span v-if="task.executedAt">Executed: {{ formatDate(task.executedAt) }}</span>
          </div>
        </div>

        <div v-if="task.content" class="task-content">
          <strong>Content:</strong> <code>{{ task.content }}</code>
        </div>

        <div v-if="task.result" class="task-result">
          <strong>Execution Result:</strong>
          <pre>{{ task.result }}</pre>
        </div>

        <div v-if="task.error" class="task-error">
          <strong>Error Message:</strong>
          <pre>{{ task.error }}</pre>
        </div>
      </div>

      <div v-if="filteredTasks.length === 0" class="no-tasks">
        No tasks found
      </div>
    </div>

    <!-- 任务详情弹窗 -->
    <div v-if="selectedTask" class="modal" @click.self="selectedTask = null">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Task Details</h3>
          <button @click="selectedTask = null" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <strong>ID:</strong> {{ selectedTask.id }}
          </div>
          <div class="detail-row">
            <strong>Name:</strong> {{ selectedTask.name }}
          </div>
          <div class="detail-row">
            <strong>Type:</strong> {{ typeLabels[selectedTask.type] }}
          </div>
          <div class="detail-row">
            <strong>Priority:</strong> {{ priorityLabels[selectedTask.priority] }}
          </div>
          <div class="detail-row">
            <strong>Status:</strong> {{ statusLabels[selectedTask.status] }}
          </div>
          <div class="detail-row">
            <strong>Description:</strong> {{ selectedTask.description || 'None' }}
          </div>
          <div class="detail-row">
            <strong>Content:</strong>
            <pre>{{ selectedTask.content }}</pre>
          </div>
          <div class="detail-row">
            <strong>Created At:</strong> {{ formatDate(selectedTask.createdAt) }}
          </div>
          <div v-if="selectedTask.executedAt" class="detail-row">
            <strong>Executed At:</strong> {{ formatDate(selectedTask.executedAt) }}
          </div>
          <div v-if="selectedTask.completedAt" class="detail-row">
            <strong>Completed At:</strong> {{ formatDate(selectedTask.completedAt) }}
          </div>
          <div v-if="selectedTask.result" class="detail-row">
            <strong>Execution Result:</strong>
            <pre>{{ selectedTask.result }}</pre>
          </div>
          <div v-if="selectedTask.error" class="detail-row">
            <strong>Error Message:</strong>
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
      command: 'Command Execution',
      file: 'File Processing',
      custom: 'Custom Ritual'
    };

    const typeIcons = {
      command: '⚡',
      file: '📁',
      custom: '⚙️'
    };

    const statusLabels = {
      all: 'All',
      pending: 'Pending',
      running: 'Running',
      completed: 'Completed',
      failed: 'Failed'
    };

    const priorityLabels = {
      low: 'Low',
      medium: 'Medium',
      high: 'High'
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
      return date.toLocaleString('en-US');
    };

    // 加载任务列表
    const loadTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        tasks.value = response.data.tasks || [];
      } catch (error) {
        console.error('Failed to load tasks:', error);
        alert('Failed to load tasks: ' + (error.response?.data?.error || error.message));
      }
    };

    // 创建任务
    const createTask = async () => {
      if (!newTask.value.name.trim()) {
        alert('Please enter task name');
        return;
      }
      if (!newTask.value.content.trim()) {
        alert('Please enter task content');
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

        alert('Task summoned successfully!');
      } catch (error) {
        console.error('Failed to create task:', error);
        alert('Failed to create task: ' + (error.response?.data?.error || error.message));
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

        alert('Task executed successfully!');
      } catch (error) {
        console.error('Failed to execute task:', error);
        alert('Failed to execute task: ' + (error.response?.data?.error || error.message));

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

        alert('Task stopped');
      } catch (error) {
        console.error('Failed to stop task:', error);
        alert('Failed to stop task: ' + (error.response?.data?.error || error.message));
      }
    };

    // 删除任务
    const deleteTask = async (taskId) => {
      if (!confirm('Are you sure you want to delete this task?')) {
        return;
      }

      try {
        await axios.delete(`/api/tasks/${taskId}`);
        tasks.value = tasks.value.filter(t => t.id !== taskId);
        alert('Task deleted');
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task: ' + (error.response?.data?.error || error.message));
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
