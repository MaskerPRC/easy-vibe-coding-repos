<template>
  <div class="todo-container">
    <div class="todo-card">
      <h1 class="title">我的待办事项</h1>

      <!-- 添加任务区域 -->
      <div class="add-todo">
        <input
          v-model="newTodo"
          @keyup.enter="addTodo"
          placeholder="输入新任务，按回车添加..."
          class="todo-input"
        />
        <button @click="addTodo" class="add-btn">添加</button>
      </div>

      <!-- 统计信息 -->
      <div class="stats">
        <span>总计: {{ todos.length }}</span>
        <span>已完成: {{ completedCount }}</span>
        <span>待完成: {{ pendingCount }}</span>
      </div>

      <!-- 过滤按钮 -->
      <div class="filter-btns">
        <button
          :class="{ active: filter === 'all' }"
          @click="filter = 'all'"
        >
          全部
        </button>
        <button
          :class="{ active: filter === 'pending' }"
          @click="filter = 'pending'"
        >
          待完成
        </button>
        <button
          :class="{ active: filter === 'completed' }"
          @click="filter = 'completed'"
        >
          已完成
        </button>
      </div>

      <!-- 任务列表 -->
      <div class="todo-list">
        <transition-group name="list">
          <div
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="todo-item"
            :class="{ completed: todo.completed }"
          >
            <div class="todo-content">
              <input
                type="checkbox"
                v-model="todo.completed"
                @change="toggleTodo(todo)"
                class="checkbox"
              />
              <span class="todo-text">{{ todo.text }}</span>
              <span class="todo-time">{{ formatTime(todo.createdAt) }}</span>
            </div>
            <button @click="deleteTodo(todo.id)" class="delete-btn">删除</button>
          </div>
        </transition-group>

        <div v-if="filteredTodos.length === 0" class="empty-state">
          <p>{{ emptyMessage }}</p>
        </div>
      </div>

      <!-- 清除已完成 -->
      <div v-if="completedCount > 0" class="clear-section">
        <button @click="clearCompleted" class="clear-btn">
          清除已完成 ({{ completedCount }})
        </button>
      </div>

      <!-- 状态提示 -->
      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const newTodo = ref('');
const todos = ref([]);
const filter = ref('all');
const message = ref('');
const messageType = ref('success');

// 计算属性
const completedCount = computed(() =>
  todos.value.filter(todo => todo.completed).length
);

const pendingCount = computed(() =>
  todos.value.filter(todo => !todo.completed).length
);

const filteredTodos = computed(() => {
  if (filter.value === 'completed') {
    return todos.value.filter(todo => todo.completed);
  } else if (filter.value === 'pending') {
    return todos.value.filter(todo => !todo.completed);
  }
  return todos.value;
});

const emptyMessage = computed(() => {
  if (filter.value === 'completed') return '还没有完成的任务';
  if (filter.value === 'pending') return '太棒了！没有待完成的任务';
  return '还没有任务，快添加一个吧！';
});

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  // 小于1分钟
  if (diff < 60000) return '刚刚';
  // 小于1小时
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  // 小于1天
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  // 显示日期
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 显示消息
const showMessage = (msg, type = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 2000);
};

// 从后端加载任务
const loadTodos = async () => {
  try {
    const response = await fetch('/api/todos');
    const data = await response.json();
    if (data.success) {
      todos.value = data.todos || [];
    }
  } catch (error) {
    console.error('加载任务失败:', error);
    showMessage('加载任务失败', 'error');
  }
};

// 保存到后端
const saveTodos = async () => {
  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ todos: todos.value })
    });
    const data = await response.json();
    if (!data.success) {
      showMessage('保存失败', 'error');
    }
  } catch (error) {
    console.error('保存任务失败:', error);
    showMessage('保存失败', 'error');
  }
};

// 添加任务
const addTodo = () => {
  const text = newTodo.value.trim();
  if (!text) {
    showMessage('请输入任务内容', 'error');
    return;
  }

  todos.value.push({
    id: Date.now(),
    text,
    completed: false,
    createdAt: Date.now()
  });

  newTodo.value = '';
  saveTodos();
  showMessage('任务已添加');
};

// 切换任务状态
const toggleTodo = (todo) => {
  saveTodos();
  showMessage(todo.completed ? '任务已完成' : '任务标记为待完成');
};

// 删除任务
const deleteTodo = (id) => {
  todos.value = todos.value.filter(todo => todo.id !== id);
  saveTodos();
  showMessage('任务已删除');
};

// 清除已完成
const clearCompleted = () => {
  const count = completedCount.value;
  todos.value = todos.value.filter(todo => !todo.completed);
  saveTodos();
  showMessage(`已清除 ${count} 个已完成任务`);
};

// 页面加载时获取数据
onMounted(() => {
  loadTodos();
});
</script>

<style scoped>
.todo-container {
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.todo-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 100%;
}

.title {
  color: #667eea;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  font-weight: 700;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.todo-input:focus {
  outline: none;
  border-color: #667eea;
}

.add-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.add-btn:active {
  transform: translateY(0);
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stats span {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.filter-btns {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-btns button {
  padding: 8px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  color: #666;
}

.filter-btns button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.filter-btns button:hover {
  border-color: #667eea;
}

.todo-list {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s;
  border-left: 4px solid #667eea;
}

.todo-item:hover {
  background: #f0f2f5;
  transform: translateX(5px);
}

.todo-item.completed {
  opacity: 0.6;
  border-left-color: #95a5a6;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.todo-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.completed .todo-text {
  text-decoration: line-through;
  color: #95a5a6;
}

.todo-time {
  font-size: 12px;
  color: #999;
  margin-left: auto;
  margin-right: 10px;
}

.delete-btn {
  padding: 6px 16px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #ff5252;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-state p {
  font-size: 16px;
}

.clear-section {
  text-align: center;
  margin-top: 20px;
}

.clear-btn {
  padding: 10px 20px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #7f8c8d;
}

.message {
  margin-top: 20px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.message.success {
  background: #d4edda;
  color: #155724;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
}

/* 动画效果 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .todo-card {
    padding: 20px;
  }

  .title {
    font-size: 1.5rem;
  }

  .add-todo {
    flex-direction: column;
  }

  .add-btn {
    width: 100%;
  }

  .stats {
    flex-direction: column;
    gap: 8px;
  }

  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .delete-btn {
    width: 100%;
  }
}
</style>
