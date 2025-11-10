<template>
  <div class="todo-container">
    <div class="todo-wrapper">
      <div class="header-bar">
        <router-link to="/" class="back-link">← 返回首页</router-link>
      </div>
      <h1 class="todo-title">我的待办事项</h1>

      <!-- 添加 TODO 表单 -->
      <div class="add-todo">
        <input
          v-model="newTodoText"
          @keyup.enter="addTodo"
          type="text"
          placeholder="添加新的待办事项..."
          class="todo-input"
        />
        <button @click="addTodo" class="add-btn">添加</button>
      </div>

      <!-- 统计信息 -->
      <div class="todo-stats">
        <span>总计: {{ todos.length }}</span>
        <span>已完成: {{ completedCount }}</span>
        <span>待办: {{ pendingCount }}</span>
      </div>

      <!-- TODO 列表 -->
      <div class="todo-list">
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="todo-item"
          :class="{ completed: todo.completed }"
        >
          <div class="todo-content">
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo)"
              class="todo-checkbox"
            />
            <span class="todo-text">{{ todo.text }}</span>
          </div>
          <button @click="deleteTodo(todo.id)" class="delete-btn">删除</button>
        </div>

        <div v-if="todos.length === 0" class="empty-state">
          <p>暂无待办事项</p>
          <p class="empty-hint">在上方输入框添加你的第一个待办事项吧!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const todos = ref([]);
const newTodoText = ref('');

// 计算属性
const completedCount = computed(() => {
  return todos.value.filter(t => t.completed).length;
});

const pendingCount = computed(() => {
  return todos.value.filter(t => !t.completed).length;
});

// 加载 TODO 列表
const loadTodos = async () => {
  try {
    const response = await axios.get('/api/todos');
    if (response.data.success) {
      todos.value = response.data.todos;
    }
  } catch (error) {
    console.error('加载待办事项失败:', error);
    alert('加载待办事项失败,请稍后重试');
  }
};

// 添加 TODO
const addTodo = async () => {
  if (!newTodoText.value.trim()) {
    alert('请输入待办事项内容');
    return;
  }

  try {
    const response = await axios.post('/api/todos', {
      text: newTodoText.value
    });

    if (response.data.success) {
      todos.value.push(response.data.todo);
      newTodoText.value = '';
    }
  } catch (error) {
    console.error('添加待办事项失败:', error);
    alert('添加待办事项失败,请稍后重试');
  }
};

// 切换 TODO 完成状态
const toggleTodo = async (todo) => {
  try {
    const response = await axios.put(`/api/todos/${todo.id}`, {
      completed: !todo.completed
    });

    if (response.data.success) {
      todo.completed = !todo.completed;
    }
  } catch (error) {
    console.error('更新待办事项失败:', error);
    alert('更新待办事项失败,请稍后重试');
  }
};

// 删除 TODO
const deleteTodo = async (id) => {
  if (!confirm('确定要删除这个待办事项吗?')) {
    return;
  }

  try {
    const response = await axios.delete(`/api/todos/${id}`);

    if (response.data.success) {
      todos.value = todos.value.filter(t => t.id !== id);
    }
  } catch (error) {
    console.error('删除待办事项失败:', error);
    alert('删除待办事项失败,请稍后重试');
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadTodos();
});
</script>

<style scoped>
.todo-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.todo-wrapper {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.header-bar {
  margin-bottom: 20px;
}

.back-link {
  display: inline-block;
  padding: 8px 16px;
  background: #f3f4f6;
  color: #667eea;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.back-link:hover {
  background: #e5e7eb;
  transform: translateX(-4px);
}

.todo-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.add-todo {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.todo-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s;
}

.todo-input:focus {
  border-color: #667eea;
}

.add-btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
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

.todo-stats {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
}

.todo-stats span {
  font-weight: 600;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s;
}

.todo-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.todo-item.completed {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-text {
  font-size: 16px;
  color: #333;
  word-break: break-word;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #9ca3af;
}

.delete-btn {
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
  color: #d1d5db;
}
</style>
