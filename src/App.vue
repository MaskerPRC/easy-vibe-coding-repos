<template>
  <div class="chat-app">
    <!-- 登录界面 -->
    <div v-if="!isJoined" class="login-container">
      <div class="login-box">
        <h1 class="login-title">多人在线聊天室</h1>
        <p class="login-subtitle">欢迎来到即时聊天室</p>
        <div class="login-form">
          <input
            v-model="username"
            @keyup.enter="joinChat"
            type="text"
            placeholder="请输入你的昵称"
            class="username-input"
            maxlength="20"
          />
          <button @click="joinChat" class="join-btn" :disabled="!username.trim()">
            进入聊天室
          </button>
        </div>
        <div class="login-footer">
          <p>在线人数: {{ onlineCount }}</p>
        </div>
      </div>
    </div>

    <!-- 聊天室界面 -->
    <div v-else class="chat-container">
      <!-- 侧边栏 - 在线用户 -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>在线用户</h2>
          <span class="online-count">{{ onlineUsers.length }} 人</span>
        </div>
        <div class="user-list">
          <div
            v-for="user in onlineUsers"
            :key="user.id"
            class="user-item"
            :class="{ 'is-me': user.id === socket?.id }"
          >
            <span class="user-avatar">{{ user.username.charAt(0) }}</span>
            <span class="user-name">{{ user.username }}</span>
            <span v-if="user.id === socket?.id" class="me-badge">我</span>
          </div>
        </div>
      </aside>

      <!-- 聊天主区域 -->
      <main class="chat-main">
        <!-- 聊天头部 -->
        <header class="chat-header">
          <div class="header-left">
            <h1 class="chat-title">多人聊天室</h1>
            <span class="status-dot" :class="{ connected: isConnected }"></span>
            <span class="status-text">{{ isConnected ? '已连接' : '未连接' }}</span>
          </div>
          <div class="header-right">
            <button @click="clearHistory" class="clear-btn">清空记录</button>
            <button @click="leaveChat" class="leave-btn">退出聊天</button>
          </div>
        </header>

        <!-- 消息列表 -->
        <div ref="messageContainer" class="message-list">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="message-item"
            :class="{
              'system-message': msg.type === 'system',
              'my-message': msg.userId === socket?.id,
              'other-message': msg.type === 'user' && msg.userId !== socket?.id
            }"
          >
            <!-- 系统消息 -->
            <div v-if="msg.type === 'system'" class="system-content">
              <span class="system-text">{{ msg.content }}</span>
              <span class="message-time">{{ msg.time }}</span>
            </div>

            <!-- 用户消息 -->
            <div v-else class="user-message">
              <div v-if="msg.userId !== socket?.id" class="message-header">
                <span class="message-avatar">{{ msg.username.charAt(0) }}</span>
                <span class="message-username">{{ msg.username }}</span>
                <span class="message-time">{{ msg.time }}</span>
              </div>
              <div class="message-content">
                <p class="message-text">{{ msg.content }}</p>
              </div>
              <div v-if="msg.userId === socket?.id" class="message-footer">
                <span class="message-time">{{ msg.time }}</span>
              </div>
            </div>
          </div>

          <!-- 正在输入提示 -->
          <div v-if="typingUsers.length > 0" class="typing-indicator">
            <span class="typing-text">{{ typingUsers.join(', ') }} 正在输入...</span>
          </div>
        </div>

        <!-- 输入区域 -->
        <footer class="chat-footer">
          <div class="input-container">
            <textarea
              v-model="messageInput"
              @keydown.enter.exact.prevent="sendMessage"
              @input="handleTyping"
              placeholder="输入消息... (Enter发送, Shift+Enter换行)"
              class="message-input"
              rows="3"
              maxlength="500"
            ></textarea>
            <button
              @click="sendMessage"
              class="send-btn"
              :disabled="!messageInput.trim() || !isConnected"
            >
              发送
            </button>
          </div>
          <div class="input-footer">
            <span class="char-count">{{ messageInput.length }} / 500</span>
          </div>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { io } from 'socket.io-client';

// 状态
const isJoined = ref(false);
const username = ref('');
const socket = ref(null);
const isConnected = ref(false);
const messages = ref([]);
const onlineUsers = ref([]);
const onlineCount = ref(0);
const messageInput = ref('');
const typingUsers = ref([]);
const messageContainer = ref(null);

let typingTimeout = null;

// 加入聊天
const joinChat = () => {
  if (!username.value.trim()) return;

  // 连接 Socket.IO 服务器 (通过 Vite 代理)
  socket.value = io({
    path: '/socket.io',
    transports: ['websocket', 'polling']
  });

  // 连接成功
  socket.value.on('connect', () => {
    console.log('连接成功:', socket.value.id);
    isConnected.value = true;
    isJoined.value = true;
    socket.value.emit('join', username.value);
  });

  // 连接断开
  socket.value.on('disconnect', () => {
    console.log('连接断开');
    isConnected.value = false;
  });

  // 接收消息
  socket.value.on('message', (message) => {
    messages.value.push(message);
    scrollToBottom();
  });

  // 接收在线用户列表
  socket.value.on('users', (users) => {
    onlineUsers.value = users;
  });

  // 接收聊天历史
  socket.value.on('history', (history) => {
    messages.value = [...history];
    scrollToBottom();
  });

  // 清空历史记录
  socket.value.on('clearHistory', () => {
    messages.value = [];
  });

  // 用户正在输入
  socket.value.on('userTyping', ({ username, isTyping }) => {
    if (isTyping) {
      if (!typingUsers.value.includes(username)) {
        typingUsers.value.push(username);
      }
    } else {
      typingUsers.value = typingUsers.value.filter(u => u !== username);
    }
  });
};

// 发送消息
const sendMessage = () => {
  if (!messageInput.value.trim() || !socket.value) return;

  socket.value.emit('message', {
    content: messageInput.value.trim()
  });

  messageInput.value = '';
  socket.value.emit('typing', false);
};

// 处理输入
const handleTyping = () => {
  if (!socket.value) return;

  socket.value.emit('typing', true);

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.value.emit('typing', false);
  }, 1000);
};

// 清空聊天记录
const clearHistory = async () => {
  if (confirm('确定要清空所有聊天记录吗？')) {
    try {
      const response = await fetch('/api/chat/clear', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        messages.value = [];
      }
    } catch (error) {
      console.error('清空记录失败:', error);
    }
  }
};

// 离开聊天
const leaveChat = () => {
  if (confirm('确定要退出聊天室吗？')) {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
    isJoined.value = false;
    isConnected.value = false;
    messages.value = [];
    onlineUsers.value = [];
    username.value = '';
  }
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

// 获取在线人数
const fetchOnlineCount = async () => {
  try {
    const response = await fetch('/api/chat/users');
    const data = await response.json();
    if (data.success) {
      onlineCount.value = data.count;
    }
  } catch (error) {
    console.error('获取在线人数失败:', error);
  }
};

// 组件挂载
onMounted(() => {
  fetchOnlineCount();
  setInterval(fetchOnlineCount, 5000);
});

// 组件卸载
onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
  clearTimeout(typingTimeout);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.chat-app {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow: hidden;
}

/* 登录界面 */
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 450px;
  width: 100%;
  text-align: center;
}

.login-title {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 10px;
  font-weight: 700;
}

.login-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.username-input {
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.username-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.join-btn {
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.join-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  color: #666;
  font-size: 14px;
}

/* 聊天室界面 */
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  background: white;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  background: #2d3748;
  color: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #4a5568;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #4a5568;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 600;
}

.online-count {
  background: #667eea;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.user-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 5px;
  transition: background 0.2s;
}

.user-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-item.is-me {
  background: rgba(102, 126, 234, 0.2);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.user-name {
  flex: 1;
  font-size: 14px;
}

.me-badge {
  background: #48bb78;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

/* 聊天主区域 */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f7fafc;
}

.chat-header {
  padding: 20px 30px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-title {
  font-size: 24px;
  color: #2d3748;
  font-weight: 700;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e53e3e;
  animation: pulse 2s ease-in-out infinite;
}

.status-dot.connected {
  background: #48bb78;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 14px;
  color: #718096;
}

.header-right {
  display: flex;
  gap: 10px;
}

.clear-btn, .leave-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn {
  background: #edf2f7;
  color: #4a5568;
}

.clear-btn:hover {
  background: #e2e8f0;
}

.leave-btn {
  background: #e53e3e;
  color: white;
}

.leave-btn:hover {
  background: #c53030;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-item {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 系统消息 */
.system-message {
  align-items: center;
}

.system-content {
  background: rgba(102, 126, 234, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.system-text {
  font-size: 13px;
  color: #667eea;
  font-weight: 500;
}

/* 用户消息 */
.my-message {
  align-items: flex-end;
}

.other-message {
  align-items: flex-start;
}

.user-message {
  max-width: 70%;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.message-username {
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
}

.message-content {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.my-message .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.other-message .message-content {
  border-bottom-left-radius: 4px;
}

.message-text {
  font-size: 15px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-footer {
  margin-top: 4px;
  text-align: right;
}

.message-time {
  font-size: 11px;
  color: #a0aec0;
}

.my-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

/* 正在输入提示 */
.typing-indicator {
  padding: 8px 16px;
  animation: fadeIn 0.3s ease;
}

.typing-text {
  font-size: 13px;
  color: #718096;
  font-style: italic;
}

/* 输入区域 */
.chat-footer {
  padding: 20px 30px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  transition: all 0.3s ease;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  height: fit-content;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-footer {
  margin-top: 8px;
  text-align: right;
}

.char-count {
  font-size: 12px;
  color: #a0aec0;
}

/* 滚动条样式 */
.message-list::-webkit-scrollbar,
.user-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track,
.user-list::-webkit-scrollbar-track {
  background: transparent;
}

.message-list::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.user-list::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover,
.user-list::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* 响应式 */
@media (max-width: 768px) {
  .sidebar {
    width: 240px;
  }

  .chat-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .user-message {
    max-width: 85%;
  }
}
</style>
