<template>
  <div class="translator-container">
    <div class="translator-card">
      <h1 class="title">简繁翻译工具</h1>
      <p class="subtitle">将简体中文翻译为繁体中文</p>

      <!-- 翻译区域 -->
      <div class="translate-area">
        <!-- 输入框 -->
        <div class="input-section">
          <label class="section-label">简体中文</label>
          <textarea
            v-model="inputText"
            placeholder="请输入要翻译的简体中文内容..."
            class="text-input"
            rows="10"
          ></textarea>
          <div class="char-count">字符数: {{ inputText.length }}</div>
        </div>

        <!-- 翻译按钮 -->
        <div class="action-section">
          <button
            @click="translateText"
            :disabled="!inputText || isLoading"
            class="translate-btn"
          >
            {{ isLoading ? '翻译中...' : '翻译' }}
          </button>
          <button
            @click="clearAll"
            class="clear-btn"
          >
            清空
          </button>
          <button
            @click="swapText"
            :disabled="!outputText"
            class="swap-btn"
          >
            交换
          </button>
        </div>

        <!-- 输出框 -->
        <div class="output-section">
          <label class="section-label">繁体中文</label>
          <textarea
            v-model="outputText"
            placeholder="翻译结果将显示在这里..."
            class="text-output"
            rows="10"
            readonly
          ></textarea>
          <div class="action-bar">
            <span class="char-count">字符数: {{ outputText.length }}</span>
            <button
              v-if="outputText"
              @click="copyToClipboard"
              class="copy-btn"
            >
              {{ copySuccess ? '已复制!' : '复制' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- 翻译历史 -->
      <div v-if="history.length > 0" class="history-section">
        <h3>翻译历史</h3>
        <div class="history-list">
          <div
            v-for="(item, index) in history.slice(0, 5)"
            :key="index"
            class="history-item"
            @click="loadHistory(item)"
          >
            <div class="history-text">
              <span class="original">{{ truncate(item.original) }}</span>
              <span class="arrow">→</span>
              <span class="translated">{{ truncate(item.translated) }}</span>
            </div>
            <span class="history-time">{{ formatTime(item.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Translator',
  setup() {
    const inputText = ref('');
    const outputText = ref('');
    const isLoading = ref(false);
    const errorMessage = ref('');
    const copySuccess = ref(false);
    const history = ref([]);

    // 翻译文本
    const translateText = async () => {
      if (!inputText.value.trim()) {
        errorMessage.value = '请输入要翻译的内容';
        return;
      }

      isLoading.value = true;
      errorMessage.value = '';

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: inputText.value
          })
        });

        const data = await response.json();

        if (data.success) {
          outputText.value = data.translated;

          // 添加到历史记录
          history.value.unshift({
            original: data.original,
            translated: data.translated,
            timestamp: data.timestamp
          });

          // 限制历史记录数量
          if (history.value.length > 20) {
            history.value = history.value.slice(0, 20);
          }
        } else {
          errorMessage.value = data.message || '翻译失败';
        }
      } catch (error) {
        console.error('翻译请求失败:', error);
        errorMessage.value = '网络请求失败，请稍后重试';
      } finally {
        isLoading.value = false;
      }
    };

    // 清空所有内容
    const clearAll = () => {
      inputText.value = '';
      outputText.value = '';
      errorMessage.value = '';
      copySuccess.value = false;
    };

    // 交换输入输出内容
    const swapText = () => {
      const temp = inputText.value;
      inputText.value = outputText.value;
      outputText.value = temp;
    };

    // 复制到剪贴板
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(outputText.value);
        copySuccess.value = true;
        setTimeout(() => {
          copySuccess.value = false;
        }, 2000);
      } catch (error) {
        console.error('复制失败:', error);
        // 降级方案：使用传统方法
        const textarea = document.createElement('textarea');
        textarea.value = outputText.value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copySuccess.value = true;
        setTimeout(() => {
          copySuccess.value = false;
        }, 2000);
      }
    };

    // 加载历史记录
    const loadHistory = (item) => {
      inputText.value = item.original;
      outputText.value = item.translated;
    };

    // 截断文本用于显示
    const truncate = (text, length = 30) => {
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    };

    // 格式化时间
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;

      if (diff < 60000) return '刚刚';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
      return date.toLocaleDateString();
    };

    return {
      inputText,
      outputText,
      isLoading,
      errorMessage,
      copySuccess,
      history,
      translateText,
      clearAll,
      swapText,
      copyToClipboard,
      loadHistory,
      truncate,
      formatTime
    };
  }
};
</script>

<style scoped>
.translator-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.translator-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  max-width: 1200px;
  width: 100%;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.translate-area {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
}

.section-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.text-input,
.text-output {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

.text-input:focus,
.text-output:focus {
  outline: none;
  border-color: #667eea;
}

.text-output {
  background-color: #f8f9fa;
  cursor: default;
}

.char-count {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}

.translate-btn,
.clear-btn,
.swap-btn,
.copy-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.translate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.translate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.translate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn {
  background: #f44336;
  color: white;
}

.clear-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}

.swap-btn {
  background: #ff9800;
  color: white;
}

.swap-btn:hover:not(:disabled) {
  background: #f57c00;
  transform: translateY(-2px);
}

.swap-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.copy-btn {
  background: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  min-width: auto;
}

.copy-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  border-left: 4px solid #f44336;
}

.history-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.history-section h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.history-text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  overflow: hidden;
}

.original,
.translated {
  color: #333;
}

.arrow {
  color: #667eea;
  font-weight: bold;
}

.history-time {
  font-size: 0.85rem;
  color: #999;
  white-space: nowrap;
  margin-left: 1rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .translate-area {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .action-section {
    flex-direction: row;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .translator-container {
    padding: 1rem;
  }

  .translator-card {
    padding: 1.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .action-section {
    flex-direction: column;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .history-time {
    margin-left: 0;
  }
}
</style>
