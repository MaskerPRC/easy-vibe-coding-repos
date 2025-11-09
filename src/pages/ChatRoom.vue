<template>
  <div class="chat-container">
    <!-- 聊天室头部 -->
    <div class="chat-header">
      <h2>聊天室</h2>
      <div class="header-actions">
        <router-link to="/prompt" class="prompt-link">
          查看提示词
        </router-link>
        <div class="online-users">
          <span>在线用户: {{ onlineCount }}</span>
        </div>
      </div>
    </div>

    <!-- 消息列表区域 -->
    <div class="messages-container" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message-item"
        :class="{ 'own-message': message.userId === currentUserId }"
      >
        <div class="message-header">
          <span class="username">{{ message.username }}</span>
          <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
        </div>
        <div class="message-content">{{ message.content }}</div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="messages.length === 0" class="empty-state">
        <p>暂无消息，开始聊天吧！</p>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-container">
      <div class="input-wrapper">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="输入消息... (按 Enter 发送)"
          class="message-input"
          maxlength="500"
        />
        <div class="char-counter" :class="{ 'warning': inputMessage.length > 450, 'error': inputMessage.length >= 500 }">
          {{ inputMessage.length }}/500
        </div>
      </div>
      <button @click="sendMessage" class="send-btn" :disabled="!inputMessage.trim()">
        发送
      </button>
    </div>

  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

export default {
  name: 'ChatRoom',
  setup() {
    const messages = ref([]);
    const inputMessage = ref('');
    const currentUserId = ref('');
    const onlineCount = ref(1);
    const messagesContainer = ref(null);
    let pollInterval = null;

    // 初始化用户ID
    const initUser = () => {
      let userId = localStorage.getItem('chatUserId');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('chatUserId', userId);
      }
      currentUserId.value = userId;

      let username = localStorage.getItem('chatUsername');
      if (!username) {
        username = '用户' + Math.floor(Math.random() * 10000);
        localStorage.setItem('chatUsername', username);
      }
    };

    // 格式化时间
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    };

    // 加载消息
    const loadMessages = async () => {
      try {
        const response = await fetch('/api/chat/messages');
        const data = await response.json();
        if (data.success) {
          messages.value = data.messages || [];
          scrollToBottom();
        }
      } catch (error) {
        console.error('加载消息失败:', error);
      }
    };

    // 获取在线人数
    const getOnlineCount = async () => {
      try {
        const response = await fetch('/api/chat/online');
        const data = await response.json();
        if (data.success) {
          onlineCount.value = data.count || 1;
        }
      } catch (error) {
        console.error('获取在线人数失败:', error);
      }
    };

    // 发送消息
    const sendMessage = async () => {
      const trimmedMessage = inputMessage.value.trim();

      // 前端验证：消息不能为空
      if (!trimmedMessage) {
        alert('消息内容不能为空，请输入消息后再发送');
        return;
      }

      // 前端验证：消息长度不能超过500字符
      if (trimmedMessage.length > 500) {
        alert('消息长度不能超过500字符，当前长度：' + trimmedMessage.length + '字符');
        return;
      }

      const username = localStorage.getItem('chatUsername') || '匿名用户';

      try {
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: currentUserId.value,
            username: username,
            content: trimmedMessage
          })
        });

        const data = await response.json();

        // 检查 HTTP 状态码
        if (!response.ok) {
          // HTTP 错误（400, 500 等）
          let errorMsg = '发送失败';
          if (response.status === 400) {
            errorMsg = '消息验证失败：' + (data.message || '请检查消息内容');
          } else if (response.status >= 500) {
            errorMsg = '服务器错误：' + (data.message || '请稍后重试');
          } else {
            errorMsg = 'HTTP 错误 ' + response.status + '：' + (data.message || '未知错误');
          }
          alert(errorMsg);
          return;
        }

        if (data.success) {
          inputMessage.value = '';
          await loadMessages();
        } else {
          alert('发送失败: ' + (data.message || '未知错误'));
        }
      } catch (error) {
        console.error('发送消息失败:', error);
        alert('发送消息失败，请检查网络连接');
      }
    };

    // 定期轮询消息
    const startPolling = () => {
      pollInterval = setInterval(() => {
        loadMessages();
        getOnlineCount();
      }, 2000); // 每2秒刷新一次
    };

    onMounted(() => {
      initUser();
      loadMessages();
      getOnlineCount();
      startPolling();
    });

    onUnmounted(() => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    });

    return {
      messages,
      inputMessage,
      currentUserId,
      onlineCount,
      messagesContainer,
      formatTime,
      sendMessage
    };
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.chat-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.prompt-link {
  padding: 8px 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}

.prompt-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.online-users {
  color: #666;
  font-size: 14px;
}

.online-users span {
  background: #4caf50;
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-weight: 500;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
}

.message-item {
  margin-bottom: 15px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  max-width: 70%;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item.own-message {
  margin-left: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
}

.username {
  font-weight: bold;
  color: #667eea;
}

.own-message .username {
  color: #fff;
}

.timestamp {
  color: #999;
  font-size: 11px;
}

.own-message .timestamp {
  color: rgba(255, 255, 255, 0.8);
}

.message-content {
  word-wrap: break-word;
  line-height: 1.5;
  color: #333;
}

.own-message .message-content {
  color: white;
}

.empty-state {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 50px;
  font-size: 16px;
}

.input-container {
  display: flex;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  gap: 10px;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.message-input {
  width: 100%;
  padding: 12px 15px;
  padding-right: 70px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.message-input:focus {
  border-color: #667eea;
}

.char-counter {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #999;
  pointer-events: none;
  transition: color 0.3s;
}

.char-counter.warning {
  color: #ff9800;
  font-weight: 600;
}

.char-counter.error {
  color: #f44336;
  font-weight: 700;
}

.send-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.2s, opacity 0.3s;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
