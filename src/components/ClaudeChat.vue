<template>
  <div class="claude-chat">
    <div class="chat-header">
      <div class="header-content">
        <h1>Claude AI 对话助手</h1>
        <p class="subtitle">由 Claude 3.5 Sonnet 提供支持</p>
      </div>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="welcome-message">
        <div class="welcome-icon">🤖</div>
        <h2>欢迎使用 Claude AI</h2>
        <p>我是 Claude，一个由 Anthropic 开发的 AI 助手。</p>
        <p>请输入您的问题，我会尽力帮助您！</p>
      </div>

      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        <div class="message-avatar">
          <span v-if="message.role === 'user'">👤</span>
          <span v-else>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-text" v-html="formatMessage(message.content)"></div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>

      <div v-if="isLoading" class="message assistant">
        <div class="message-avatar">
          <span>🤖</span>
        </div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input-container">
      <div class="input-wrapper">
        <textarea
          v-model="inputMessage"
          @keydown.enter.exact.prevent="sendMessage"
          placeholder="输入您的问题... (按 Enter 发送，Shift+Enter 换行)"
          rows="1"
          ref="inputTextarea"
          :disabled="isLoading"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isLoading"
          class="send-button"
        >
          <span v-if="!isLoading">发送</span>
          <span v-else>发送中...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClaudeChat',
  data() {
    return {
      messages: [],
      inputMessage: '',
      isLoading: false,
      currentStreamingMessage: ''
    };
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading) {
        return;
      }

      const userMessage = this.inputMessage.trim();
      this.inputMessage = '';

      // 添加用户消息
      this.messages.push({
        role: 'user',
        content: userMessage,
        timestamp: Date.now()
      });

      this.isLoading = true;
      this.currentStreamingMessage = '';

      // 滚动到底部
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      try {
        // 构建消息历史
        const apiMessages = this.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // 调用API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: apiMessages,
            stream: true
          })
        });

        if (!response.ok) {
          throw new Error('网络请求失败');
        }

        // 创建助手消息
        const assistantMessage = {
          role: 'assistant',
          content: '',
          timestamp: Date.now()
        };
        this.messages.push(assistantMessage);

        // 处理流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'text') {
                  assistantMessage.content += data.content;
                  this.$nextTick(() => {
                    this.scrollToBottom();
                  });
                } else if (data.type === 'error') {
                  console.error('API错误:', data.error);
                  assistantMessage.content += '\n\n抱歉，发生了错误: ' + data.error;
                } else if (data.type === 'done') {
                  console.log('流式响应完成');
                }
              } catch (e) {
                console.error('解析响应数据失败:', e);
              }
            }
          }
        }

      } catch (error) {
        console.error('发送消息失败:', error);
        this.messages.push({
          role: 'assistant',
          content: '抱歉，发生了错误。请稍后重试。',
          timestamp: Date.now()
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    formatMessage(content) {
      // 简单的格式化：将换行符转换为<br>
      return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },
  mounted() {
    // 自动聚焦输入框
    this.$refs.inputTextarea?.focus();
  }
};
</script>

<style scoped>
.claude-chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

.chat-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #718096;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.welcome-message h2 {
  font-size: 32px;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.welcome-message p {
  font-size: 16px;
  margin: 8px 0;
  opacity: 0.9;
}

.message {
  display: flex;
  gap: 12px;
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

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.message-content {
  max-width: 70%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-text {
  line-height: 1.6;
  word-wrap: break-word;
}

.message.user .message-text {
  color: white;
}

.message-text :deep(pre) {
  background: rgba(0, 0, 0, 0.05);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.message.user .message-text :deep(pre) {
  background: rgba(255, 255, 255, 0.2);
}

.message-text :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.message.user .message-text :deep(code) {
  background: rgba(255, 255, 255, 0.2);
}

.message-time {
  font-size: 11px;
  color: #718096;
  margin-top: 6px;
  opacity: 0.7;
}

.message.user .message-time {
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.input-wrapper {
  display: flex;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.input-wrapper textarea {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: all 0.2s;
  max-height: 150px;
  min-height: 44px;
}

.input-wrapper textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-wrapper textarea:disabled {
  background: #f7fafc;
  cursor: not-allowed;
}

.send-button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
