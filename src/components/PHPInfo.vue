<template>
  <div class="php-info-container">
    <div class="php-header">
      <h2 class="section-title">PHP 信息</h2>
      <div class="php-actions">
        <button @click="loadPHPInfo" class="action-btn refresh-btn" :disabled="loading">
          {{ loading ? '⏳ 加载中...' : '🔄 刷新' }}
        </button>
        <button v-if="phpInfo.installed" @click="showCodeEditor = !showCodeEditor" class="action-btn">
          {{ showCodeEditor ? '📊 查看 PHPInfo' : '💻 运行 PHP 代码' }}
        </button>
      </div>
    </div>

    <!-- PHP 代码编辑器 -->
    <div v-if="showCodeEditor && phpInfo.installed" class="code-editor-section">
      <div class="editor-header">
        <h3>PHP 代码执行器</h3>
        <button @click="executePHPCode" class="action-btn execute-btn" :disabled="executing">
          {{ executing ? '⏳ 执行中...' : '▶️ 运行' }}
        </button>
      </div>
      <div class="editor-content">
        <textarea
          v-model="phpCode"
          class="php-code-input"
          placeholder="输入 PHP 代码，例如: echo 'Hello World!';"
          rows="10"
        ></textarea>
      </div>
      <div v-if="codeOutput || codeError" class="code-output">
        <div v-if="codeOutput" class="output-success">
          <strong>输出：</strong>
          <pre>{{ codeOutput }}</pre>
        </div>
        <div v-if="codeError" class="output-error">
          <strong>错误：</strong>
          <pre>{{ codeError }}</pre>
        </div>
      </div>
    </div>

    <!-- PHPInfo 显示区域 -->
    <div v-if="!showCodeEditor" class="php-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>正在加载 PHP 信息...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button @click="loadPHPInfo" class="action-btn retry-btn">重试</button>
      </div>

      <!-- PHP 未安装 -->
      <div v-else-if="!phpInfo.installed" class="not-installed-state">
        <div class="warning-icon">🐘</div>
        <h3>PHP 未安装</h3>
        <div class="install-instructions" v-html="phpInfo.html"></div>
        <div class="install-steps">
          <h4>安装步骤：</h4>
          <ol>
            <li>打开终端</li>
            <li>执行命令：<code>sudo apt update</code></li>
            <li>执行命令：<code>sudo apt install -y php php-cli</code></li>
            <li>刷新此页面</li>
          </ol>
        </div>
      </div>

      <!-- PHP 信息显示 -->
      <div v-else-if="phpInfo.installed" class="php-info-display">
        <!-- PHP 版本信息 -->
        <div class="version-info">
          <h3>PHP 版本信息</h3>
          <pre class="version-output">{{ phpInfo.version }}</pre>
        </div>

        <!-- PHPInfo 详细信息 -->
        <div class="phpinfo-detail">
          <h3>PHP 配置详情</h3>
          <div class="phpinfo-content" v-html="formatPHPInfo(phpInfo.html)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const loading = ref(false);
const error = ref('');
const phpInfo = ref({
  installed: false,
  version: '',
  html: '',
  timestamp: ''
});

const showCodeEditor = ref(false);
const phpCode = ref("echo 'Hello from PHP!';\necho PHP_VERSION;");
const codeOutput = ref('');
const codeError = ref('');
const executing = ref(false);

/**
 * 加载 PHP 信息
 */
const loadPHPInfo = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.get('/api/php/info');

    if (response.data.success) {
      phpInfo.value = {
        installed: true,
        version: response.data.version,
        html: response.data.html,
        timestamp: response.data.timestamp
      };
    } else {
      phpInfo.value = {
        installed: false,
        version: '',
        html: response.data.html || '',
        timestamp: ''
      };
      error.value = response.data.message || 'PHP 未安装';
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || '无法连接到服务器';
    phpInfo.value.installed = false;
  } finally {
    loading.value = false;
  }
};

/**
 * 执行 PHP 代码
 */
const executePHPCode = async () => {
  if (!phpCode.value.trim()) {
    codeError.value = 'PHP 代码不能为空';
    return;
  }

  executing.value = true;
  codeOutput.value = '';
  codeError.value = '';

  try {
    const response = await axios.post('/api/php/exec', {
      code: phpCode.value
    });

    if (response.data.success) {
      codeOutput.value = response.data.output || '(无输出)';
      if (response.data.error) {
        codeError.value = response.data.error;
      }
    } else {
      codeError.value = response.data.error || response.data.message || '执行失败';
      if (response.data.output) {
        codeOutput.value = response.data.output;
      }
    }
  } catch (err) {
    codeError.value = err.response?.data?.message || err.message || '执行失败';
  } finally {
    executing.value = false;
  }
};

/**
 * 格式化 PHPInfo HTML 输出
 */
const formatPHPInfo = (html) => {
  if (!html) return '';

  // 为 phpinfo 输出添加样式
  return `
    <style>
      .phpinfo-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
        background: #2d2d2d;
        border-radius: 5px;
        overflow: hidden;
      }
      .phpinfo-content th {
        background: #00ff88;
        color: #1a1a1a;
        padding: 10px;
        text-align: left;
        font-weight: 600;
      }
      .phpinfo-content td {
        padding: 8px 10px;
        border-bottom: 1px solid #444;
        color: #e0e0e0;
      }
      .phpinfo-content tr:hover {
        background: #3d3d3d;
      }
      .phpinfo-content h2 {
        color: #00ff88;
        margin: 20px 0 10px 0;
        font-size: 18px;
      }
    </style>
    ${html}
  `;
};

onMounted(() => {
  loadPHPInfo();
});
</script>

<style scoped>
.php-info-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1a;
  color: #e0e0e0;
}

.php-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #2d2d2d;
  border-bottom: 2px solid #00ff88;
}

.section-title {
  margin: 0;
  font-size: 24px;
  color: #00ff88;
  display: flex;
  align-items: center;
  gap: 10px;
}

.php-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: #00ff88;
  color: #1a1a1a;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  background: #00cc6f;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 255, 136, 0.3);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn {
  background: #3498db;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #2980b9;
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.execute-btn {
  background: #e74c3c;
  color: white;
}

.execute-btn:hover:not(:disabled) {
  background: #c0392b;
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

.php-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #444;
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 15px;
  text-align: center;
}

.error-icon {
  font-size: 60px;
}

.error-state h3 {
  color: #e74c3c;
  margin: 0;
  font-size: 24px;
}

.error-state p {
  color: #999;
  margin: 0;
  max-width: 500px;
}

.retry-btn {
  background: #e74c3c;
  color: white;
}

.retry-btn:hover {
  background: #c0392b;
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
}

/* PHP 未安装状态 */
.not-installed-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.warning-icon {
  font-size: 80px;
}

.not-installed-state h3 {
  color: #f39c12;
  margin: 0;
  font-size: 28px;
}

.install-instructions {
  width: 100%;
  text-align: left;
}

.install-steps {
  width: 100%;
  text-align: left;
  background: #2d2d2d;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #f39c12;
}

.install-steps h4 {
  color: #00ff88;
  margin-top: 0;
}

.install-steps ol {
  margin: 10px 0;
  padding-left: 25px;
}

.install-steps li {
  margin: 10px 0;
  color: #e0e0e0;
}

.install-steps code {
  background: #1a1a1a;
  padding: 4px 8px;
  border-radius: 4px;
  color: #00ff88;
  font-family: 'Courier New', monospace;
}

/* PHP 信息显示 */
.php-info-display {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.version-info,
.phpinfo-detail {
  background: #2d2d2d;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #00ff88;
}

.version-info h3,
.phpinfo-detail h3 {
  margin: 0 0 15px 0;
  color: #00ff88;
  font-size: 20px;
}

.version-output {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.phpinfo-content {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}

/* 代码编辑器 */
.code-editor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 20px 30px;
  background: #2d2d2d;
  border-radius: 8px;
  border-left: 4px solid #00ff88;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #3d3d3d;
  border-bottom: 1px solid #444;
}

.editor-header h3 {
  margin: 0;
  color: #00ff88;
  font-size: 18px;
}

.editor-content {
  flex: 1;
  padding: 20px;
}

.php-code-input {
  width: 100%;
  height: 300px;
  background: #1a1a1a;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 5px;
  padding: 15px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
}

.php-code-input:focus {
  outline: none;
  border-color: #00ff88;
}

.code-output {
  padding: 20px;
  border-top: 1px solid #444;
}

.output-success,
.output-error {
  margin-bottom: 15px;
}

.output-success strong {
  color: #27ae60;
  display: block;
  margin-bottom: 10px;
}

.output-error strong {
  color: #e74c3c;
  display: block;
  margin-bottom: 10px;
}

.output-success pre,
.output-error pre {
  background: #1a1a1a;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-error pre {
  color: #e74c3c;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #2d2d2d;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>
