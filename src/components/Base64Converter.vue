<template>
  <div class="base64-converter">
    <div class="converter-header">
      <h2>🔐 Base64 加解密工具</h2>
      <p class="description">在线Base64编码和解码工具，支持文本的加密和解密</p>
    </div>

    <div class="converter-content">
      <!-- 输入区域 -->
      <div class="input-section">
        <label>输入文本：</label>
        <textarea
          v-model="inputText"
          placeholder="请输入需要编码或解码的文本..."
          rows="6"
        ></textarea>

        <div class="button-group">
          <button @click="handleEncode" class="btn-encode" :disabled="!inputText.trim()">
            🔒 Base64 编码
          </button>
          <button @click="handleDecode" class="btn-decode" :disabled="!inputText.trim()">
            🔓 Base64 解码
          </button>
          <button @click="clearAll" class="btn-clear">
            🗑️ 清空
          </button>
          <button @click="copyResult" class="btn-copy" :disabled="!result">
            📋 复制结果
          </button>
        </div>
      </div>

      <!-- 结果区域 -->
      <div class="result-section" v-if="result || error">
        <label>结果：</label>

        <!-- 成功结果 -->
        <div v-if="result && !error" class="result-box success">
          <div class="result-text">{{ result }}</div>
          <div class="stats" v-if="stats">
            <span>原始长度: {{ stats.originalLength }}</span>
            <span>结果长度: {{ stats.resultLength }}</span>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="result-box error">
          <div class="error-icon">⚠️</div>
          <div class="error-text">{{ error }}</div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="info-section">
        <h3>使用说明：</h3>
        <ul>
          <li>📝 <strong>编码：</strong>将普通文本转换为Base64编码格式</li>
          <li>📖 <strong>解码：</strong>将Base64编码还原为原始文本</li>
          <li>💡 Base64编码常用于数据传输、存储等场景</li>
          <li>⚡ 所有操作均在服务器端完成，确保数据安全</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Base64Converter',
  data() {
    return {
      inputText: '',
      result: '',
      error: null,
      stats: null
    };
  },
  methods: {
    async handleEncode() {
      if (!this.inputText.trim()) {
        this.error = '请输入需要编码的文本';
        return;
      }

      try {
        this.error = null;
        const response = await axios.post('/api/base64/encode', {
          text: this.inputText
        });

        if (response.data.success) {
          this.result = response.data.result;
          this.stats = {
            originalLength: response.data.stats.originalLength,
            resultLength: response.data.stats.encodedLength
          };
        } else {
          this.error = response.data.error || '编码失败';
        }
      } catch (error) {
        console.error('编码错误:', error);
        this.error = error.response?.data?.error || '网络错误，请稍后重试';
      }
    },

    async handleDecode() {
      if (!this.inputText.trim()) {
        this.error = '请输入需要解码的Base64文本';
        return;
      }

      try {
        this.error = null;
        const response = await axios.post('/api/base64/decode', {
          base64: this.inputText
        });

        if (response.data.success) {
          this.result = response.data.result;
          this.stats = {
            originalLength: response.data.stats.encodedLength,
            resultLength: response.data.stats.decodedLength
          };
        } else {
          this.error = response.data.error || '解码失败';
        }
      } catch (error) {
        console.error('解码错误:', error);
        this.error = error.response?.data?.error || '网络错误，请稍后重试';
      }
    },

    clearAll() {
      this.inputText = '';
      this.result = '';
      this.error = null;
      this.stats = null;
    },

    async copyResult() {
      if (!this.result) return;

      try {
        await navigator.clipboard.writeText(this.result);
        // 临时显示复制成功提示
        const originalError = this.error;
        this.error = '✅ 已复制到剪贴板';
        setTimeout(() => {
          this.error = originalError;
        }, 2000);
      } catch (error) {
        console.error('复制失败:', error);
        this.error = '复制失败，请手动复制';
      }
    }
  }
};
</script>

<style scoped>
.base64-converter {
  padding: 20px;
  background: #1e1e1e;
  border-radius: 12px;
  margin: 10px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.converter-header {
  margin-bottom: 20px;
  border-bottom: 2px solid #00ff88;
  padding-bottom: 15px;
}

.converter-header h2 {
  color: #00ff88;
  margin: 0 0 10px 0;
  font-size: 24px;
}

.description {
  color: #a0a0a0;
  margin: 0;
  font-size: 14px;
}

.converter-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-section,
.result-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  color: #00ff88;
  font-weight: 600;
  font-size: 16px;
}

textarea {
  background: #2d2d2d;
  color: #e0e0e0;
  border: 2px solid #444;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  resize: vertical;
  transition: border-color 0.3s;
}

textarea:focus {
  outline: none;
  border-color: #00ff88;
}

textarea::placeholder {
  color: #666;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
  flex: 1;
  min-width: 140px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-encode {
  background: #00ff88;
  color: #1a1a1a;
}

.btn-encode:hover:not(:disabled) {
  background: #00dd7a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 255, 136, 0.3);
}

.btn-decode {
  background: #3498db;
  color: white;
}

.btn-decode:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.btn-clear {
  background: #e74c3c;
  color: white;
}

.btn-clear:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

.btn-copy {
  background: #9b59b6;
  color: white;
}

.btn-copy:hover:not(:disabled) {
  background: #8e44ad;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(155, 89, 182, 0.3);
}

.result-box {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 15px;
  border: 2px solid;
}

.result-box.success {
  border-color: #00ff88;
}

.result-box.error {
  border-color: #e74c3c;
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-text {
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 1.6;
}

.stats {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #444;
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #a0a0a0;
}

.error-icon {
  font-size: 24px;
}

.error-text {
  color: #e74c3c;
  font-size: 14px;
  flex: 1;
}

.info-section {
  background: #2d2d2d;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #00ff88;
}

.info-section h3 {
  color: #00ff88;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.info-section ul {
  margin: 0;
  padding-left: 20px;
  color: #a0a0a0;
  line-height: 1.8;
}

.info-section li {
  margin: 5px 0;
}

.info-section strong {
  color: #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .base64-converter {
    padding: 15px;
  }

  .button-group {
    flex-direction: column;
  }

  button {
    width: 100%;
  }

  .stats {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
