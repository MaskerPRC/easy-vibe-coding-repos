<template>
  <div class="chat-container">
    <!-- 聊天标题栏 -->
    <div class="chat-header">
      <div class="header-info">
        <h2>AI 智能助手</h2>
        <p class="subtitle">基于人工智能的对话系统</p>
      </div>
      <div class="header-actions">
        <button @click="clearMessages" class="btn-action" title="清空对话">
          🗑️ 清空
        </button>
        <button @click="exportChat" class="btn-action" title="导出对话">
          💾 导出
        </button>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="welcome-message">
        <div class="welcome-icon">🤖</div>
        <h3>欢迎使用 AI 智能助手</h3>
        <p>我可以帮你回答问题、提供建议、进行对话...</p>
        <div class="quick-prompts">
          <button
            v-for="prompt in quickPrompts"
            :key="prompt"
            @click="sendQuickPrompt(prompt)"
            class="quick-prompt-btn">
            {{ prompt }}
          </button>
        </div>
      </div>

      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message-wrapper"
        :class="message.role">
        <div class="message-avatar">
          <span v-if="message.role === 'user'">👤</span>
          <span v-else>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-role">{{ message.role === 'user' ? '你' : 'AI助手' }}</span>
            <span class="message-time">{{ message.time }}</span>
          </div>
          <div class="message-text" v-html="formatMessage(message.content)"></div>
        </div>
      </div>

      <!-- 加载指示器 -->
      <div v-if="isLoading" class="message-wrapper assistant">
        <div class="message-avatar">
          <span>🤖</span>
        </div>
        <div class="message-content">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-area">
      <div class="input-wrapper">
        <textarea
          v-model="userInput"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift.exact="userInput += '\n'"
          placeholder="输入消息... (Enter发送, Shift+Enter换行)"
          class="chat-input"
          ref="inputElement"
          :disabled="isLoading"
        ></textarea>
        <button
          @click="sendMessage"
          class="btn-send"
          :disabled="!userInput.trim() || isLoading">
          <span v-if="!isLoading">发送 ➤</span>
          <span v-else>发送中...</span>
        </button>
      </div>
      <div class="input-tips">
        <span>💡 提示: 按Enter发送消息，Shift+Enter换行</span>
        <span class="message-count">对话数: {{ messages.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import axios from 'axios';

const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);
const messagesContainer = ref(null);
const inputElement = ref(null);

const quickPrompts = [
  '介绍一下你自己',
  '帮我写一段代码',
  '给我讲个笑话',
  '推荐一本书'
];

// 格式化时间
const getFormattedTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 格式化消息内容（支持简单的markdown）
const formatMessage = (text) => {
  if (!text) return '';

  // 转义HTML
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 代码块
  formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // 行内代码
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 粗体
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // 斜体
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 换行
  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const content = userInput.value.trim();
  userInput.value = '';

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content,
    time: getFormattedTime()
  });

  scrollToBottom();
  isLoading.value = true;

  try {
    const response = await axios.post('/api/chat/message', {
      message: content,
      history: messages.value.slice(-10) // 只发送最近10条消息作为上下文
    });

    if (response.data.success) {
      messages.value.push({
        role: 'assistant',
        content: response.data.reply,
        time: getFormattedTime()
      });
    } else {
      messages.value.push({
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        time: getFormattedTime()
      });
    }
  } catch (error) {
    console.error('发送消息失败:', error);
    messages.value.push({
      role: 'assistant',
      content: '连接失败，请检查网络连接或稍后重试。',
      time: getFormattedTime()
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
    // 自动聚焦输入框
    nextTick(() => {
      if (inputElement.value) {
        inputElement.value.focus();
      }
    });
  }
};

// 快速提示
const sendQuickPrompt = (prompt) => {
  userInput.value = prompt;
  sendMessage();
};

// 清空消息
const clearMessages = () => {
  if (messages.value.length === 0) return;

  if (confirm('确定要清空所有对话记录吗？')) {
    messages.value = [];
  }
};

// 导出对话
const exportChat = () => {
  if (messages.value.length === 0) {
    alert('没有对话记录可以导出');
    return;
  }

  const chatHistory = messages.value.map(msg => {
    return `[${msg.time}] ${msg.role === 'user' ? '用户' : 'AI助手'}: ${msg.content}`;
  }).join('\n\n');

  const blob = new Blob([chatHistory], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-history-${new Date().getTime()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

onMounted(() => {
  if (inputElement.value) {
    inputElement.value.focus();
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1a;
}

/* 标题栏 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #2d2d2d;
  border-bottom: 2px solid #00ff88;
}

.header-info h2 {
  margin: 0;
  font-size: 24px;
  color: #00ff88;
  font-weight: 600;
}

.header-info .subtitle {
  margin: 5px 0 0 0;
  font-size: 13px;
  color: #999;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-action {
  padding: 8px 16px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #1a1a1a;
  color: #e0e0e0;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action:hover {
  background: #333;
  border-color: #00ff88;
  color: #00ff88;
}

/* 消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 欢迎消息 */
.welcome-message {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.welcome-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.welcome-message h3 {
  font-size: 24px;
  color: #e0e0e0;
  margin: 0 0 10px 0;
}

.welcome-message p {
  font-size: 14px;
  margin: 0 0 30px 0;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
}

.quick-prompt-btn {
  padding: 10px 20px;
  border: 1px solid #444;
  border-radius: 20px;
  background: #2d2d2d;
  color: #e0e0e0;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-prompt-btn:hover {
  background: #00ff88;
  color: #1a1a1a;
  border-color: #00ff88;
  transform: translateY(-2px);
}

/* 消息项 */
.message-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message-wrapper.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  background: #2d2d2d;
}

.message-wrapper.user .message-avatar {
  background: #00ff88;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  gap: 10px;
}

.message-wrapper.user .message-header {
  flex-direction: row-reverse;
}

.message-role {
  font-size: 13px;
  font-weight: 600;
  color: #00ff88;
}

.message-time {
  font-size: 11px;
  color: #666;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  background: #2d2d2d;
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.message-wrapper.user .message-text {
  background: #00ff88;
  color: #1a1a1a;
}

.message-text :deep(code) {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.message-text :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 8px 0;
}

.message-text :deep(pre code) {
  background: none;
  padding: 0;
}

/* 加载动画 */
.loading-dots {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff88;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.chat-input-area {
  padding: 20px;
  background: #2d2d2d;
  border-top: 1px solid #444;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background: #1a1a1a;
  color: #e0e0e0;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  min-height: 50px;
  max-height: 150px;
  transition: border-color 0.3s ease;
}

.chat-input:focus {
  outline: none;
  border-color: #00ff88;
}

.chat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-send {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #00ff88;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-send:hover:not(:disabled) {
  background: #00dd77;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
}

.btn-send:disabled {
  background: #444;
  color: #666;
  cursor: not-allowed;
  transform: none;
}

.input-tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.message-count {
  color: #00ff88;
}

/* 响应式 */
@media (max-width: 768px) {
  .chat-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .message-content {
    max-width: 85%;
  }

  .input-wrapper {
    flex-direction: column;
  }

  .btn-send {
    width: 100%;
  }

  .input-tips {
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
  }
}
</style>
