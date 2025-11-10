<template>
  <div class="chat-room">
    <div class="chat-header">
      <h2>💬 Whispering Chamber</h2>
      <div class="online-info">
        <span class="status-dot"></span>
        <span>Anonymous Whispers · No Sign Required</span>
      </div>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <p>The void awaits your whispers...</p>
      </div>
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message-item"
        :class="{ 'my-message': msg.userId === currentUserId }"
      >
        <div class="message-header">
          <span class="user-avatar">{{ msg.avatar }}</span>
          <span class="username">{{ msg.username }}</span>
          <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
        </div>
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>

    <div class="chat-input-area">
      <div class="username-input">
        <input
          v-model="username"
          type="text"
          placeholder="Choose your shadow name (optional, random by default)"
          maxlength="20"
          @input="saveUsername"
        />
      </div>
      <div class="message-input-container">
        <textarea
          v-model="newMessage"
          placeholder="Whisper into the darkness... (Ctrl+Enter to send)"
          @keydown.ctrl.enter="sendMessage"
          rows="3"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="!newMessage.trim()"
          class="send-button"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChatRoom',
  data() {
    return {
      messages: [],
      newMessage: '',
      username: '',
      currentUserId: '',
      pollingInterval: null,
      avatars: ['😀', '😎', '🤓', '😺', '🐶', '🐼', '🦊', '🐯', '🦁', '🐸', '🐙', '🦄', '🌟', '🎨', '🎭', '🎪', '🎸', '🎮', '🚀', '🌈']
    };
  },
  mounted() {
    this.initUser();
    this.loadMessages();
    this.startPolling();
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    initUser() {
      // 从 localStorage 获取或生成用户ID
      let userId = localStorage.getItem('chatUserId');
      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatUserId', userId);
      }
      this.currentUserId = userId;

      // 获取保存的用户名
      const savedUsername = localStorage.getItem('chatUsername');
      if (savedUsername) {
        this.username = savedUsername;
      }
    },
    saveUsername() {
      localStorage.setItem('chatUsername', this.username);
    },
    getUserAvatar() {
      // 根据用户ID生成固定的头像
      let avatarIndex = localStorage.getItem('chatAvatarIndex');
      if (!avatarIndex) {
        avatarIndex = Math.floor(Math.random() * this.avatars.length);
        localStorage.setItem('chatAvatarIndex', avatarIndex);
      }
      return this.avatars[parseInt(avatarIndex)];
    },
    getDisplayUsername() {
      if (this.username.trim()) {
        return this.username.trim();
      }
      // 生成随机昵称
      const adjectives = ['Dark', 'Mysterious', 'Brave', 'Cunning', 'Shadow', 'Crimson', 'Silent'];
      const nouns = ['Raven', 'Wolf', 'Phantom', 'Wraith', 'Specter', 'Shade', 'Dragon'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      return adj + ' ' + noun;
    },
    async loadMessages() {
      try {
        const response = await axios.get('/api/chat/messages');
        if (response.data.success) {
          this.messages = response.data.messages;
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      } catch (error) {
        console.error('Failed to load whispers:', error);
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      try {
        const messageData = {
          userId: this.currentUserId,
          username: this.getDisplayUsername(),
          avatar: this.getUserAvatar(),
          content: this.newMessage.trim(),
          timestamp: Date.now()
        };

        const response = await axios.post('/api/chat/messages', messageData);
        if (response.data.success) {
          this.newMessage = '';
          await this.loadMessages();
        }
      } catch (error) {
        console.error('Failed to send whisper:', error);
        alert('Failed to send your whisper, please try again');
      }
    },
    startPolling() {
      // 每2秒轮询一次新消息
      this.pollingInterval = setInterval(() => {
        this.loadMessages();
      }, 2000);
    },
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
      }
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;

      // 小于1分钟显示"刚刚"
      if (diff < 60000) {
        return 'Just now';
      }

      // 小于1小时显示分钟
      if (diff < 3600000) {
        return Math.floor(diff / 60000) + ' min ago';
      }

      // 今天的消息显示时间
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }

      // 其他显示日期和时间
      return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.chat-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e0e0e0;
}

.chat-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.online-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 16px;
}

.message-item {
  margin-bottom: 15px;
  padding: 12px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

.my-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.my-message .message-header {
  color: rgba(255, 255, 255, 0.9);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.user-avatar {
  font-size: 20px;
}

.username {
  font-weight: 600;
  color: #333;
}

.my-message .username {
  color: white;
}

.timestamp {
  margin-left: auto;
  font-size: 12px;
  opacity: 0.7;
}

.message-content {
  font-size: 15px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.chat-input-area {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-top: 2px solid #e0e0e0;
}

.username-input {
  margin-bottom: 10px;
}

.username-input input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.username-input input:focus {
  outline: none;
  border-color: #667eea;
}

.message-input-container {
  display: flex;
  gap: 10px;
}

.message-input-container textarea {
  flex: 1;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  transition: border-color 0.3s;
}

.message-input-container textarea:focus {
  outline: none;
  border-color: #667eea;
}

.send-button {
  padding: 10px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.3s;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.send-button:active:not(:disabled) {
  transform: translateY(0);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
