<template>
  <div class="app" :style="rootStyles">
    <!-- 主要内容区域 -->
    <div class="construction-container">
      <div class="construction-box">
        <div class="construction-icon">
          <div class="icon-bar icon-bar-1"></div>
          <div class="icon-bar icon-bar-2"></div>
          <div class="icon-bar icon-bar-3"></div>
        </div>
        <h1 id="hero-title" class="construction-title">网站正在构建中</h1>
        <p id="hero-subtitle" class="construction-text">我们正在努力完善这个网站，请稍后再来</p>
        <div class="promo-banner" id="promo-banner" v-show="promoBannerVisible">
          <p>✨ 试试右下角的"提需求"按钮，即时改造这个页面！</p>
        </div>
        <div class="construction-stripes">
          <div class="stripe stripe-1"></div>
          <div class="stripe stripe-2"></div>
          <div class="stripe stripe-3"></div>
          <div class="stripe stripe-4"></div>
        </div>
      </div>
    </div>

    <!-- 右下角悬浮按钮 -->
    <div class="floating-button" @click="toggleDialog" :class="{ active: dialogOpen }">
      <span v-if="!dialogOpen">💬 提需求</span>
      <span v-else>✕</span>
    </div>

    <!-- 对话框 -->
    <transition name="slide">
      <div v-if="dialogOpen" class="dialog-panel">
        <div class="dialog-header">
          <h3>自然语言改造站点</h3>
          <p class="dialog-subtitle">仅做页面呈现层的安全改造，禁止输入敏感信息</p>
        </div>

        <div class="dialog-body">
          <!-- 历史记录 -->
          <div class="history" ref="historyRef">
            <div v-for="(item, index) in history" :key="index" class="history-item">
              <div class="user-message">
                <strong>您:</strong> {{ item.text }}
              </div>
              <div v-if="item.response" class="system-message">
                <strong>系统:</strong> {{ item.response }}
              </div>
              <div v-if="item.error" class="error-message">
                <strong>错误:</strong> {{ item.error }}
              </div>
            </div>

            <div v-if="processing" class="processing">
              <span class="spinner"></span> 处理中...
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="input-area">
            <textarea
              v-model="userInput"
              placeholder="例如：修改标题为"欢迎访问"，将主题改为蓝色，隐藏公告横幅..."
              :maxlength="800"
              @keydown.ctrl.enter="submitRequest"
              @keydown.meta.enter="submitRequest"
              :disabled="processing"
            ></textarea>
            <div class="input-footer">
              <span class="char-count">{{ userInput.length }}/800</span>
              <button @click="submitRequest" :disabled="!userInput.trim() || processing">
                发送
              </button>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="dialog-footer">
          <button @click="undoLast" :disabled="!canUndo || processing" class="btn-secondary">
            ↶ 撤销
          </button>
          <button @click="resetAll" :disabled="!canUndo || processing" class="btn-secondary">
            ⟲ 重置
          </button>
          <a href="/admin" target="_blank" class="btn-link">管理端</a>
        </div>
      </div>
    </transition>

    <!-- TTL提示 -->
    <div v-if="sessionTTL > 0 && sessionTTL < 5 * 60 * 1000" class="ttl-notice">
      会话将在 {{ Math.ceil(sessionTTL / 60000) }} 分钟后过期
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';
import DSLExecutor from './dslExecutor.js';

// 会话ID（使用localStorage持久化）
const sessionId = ref(localStorage.getItem('transform_session_id') || generateSessionId());
localStorage.setItem('transform_session_id', sessionId.value);

// DSL执行引擎
const executor = new DSLExecutor();

// 状态
const dialogOpen = ref(false);
const userInput = ref('');
const history = ref([]);
const processing = ref(false);
const canUndo = ref(false);
const sessionTTL = ref(0);
const promoBannerVisible = ref(true);

// 根样式（用于主题变量）
const rootStyles = ref({});

// 历史记录滚动
const historyRef = ref(null);

// 定时器
let ttlTimer = null;

/**
 * 生成会话ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 切换对话框
 */
function toggleDialog() {
  dialogOpen.value = !dialogOpen.value;
  if (dialogOpen.value) {
    updateSessionState();
  }
}

/**
 * 提交请求
 */
async function submitRequest() {
  if (!userInput.value.trim() || processing.value) return;

  const text = userInput.value.trim();
  processing.value = true;

  // 添加到历史
  const historyItem = {
    text,
    response: null,
    error: null
  };
  history.value.push(historyItem);

  try {
    // 调用编译API
    const response = await fetch('/api/v1/transform/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        session_id: sessionId.value,
        dry_run: false
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      // 执行DSL
      const dsl = result.data.dsl;
      const previewHash = result.data.preview_hash;

      // 前端执行
      executor.execute(dsl);

      // 通知后端已应用
      await fetch('/api/v1/transform/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId.value,
          dsl,
          preview_hash: previewHash
        })
      });

      historyItem.response = '✓ 改造已应用';
      canUndo.value = true;

    } else if (result.status === 'rejected' || result.status === 'policy_rejected') {
      historyItem.error = result.error + (result.reasons ? ': ' + result.reasons.join(', ') : '');
    } else if (result.status === 'rate_limited') {
      historyItem.error = result.error;
    } else if (result.status === 'failed') {
      historyItem.error = result.error || '无法理解您的请求';
      if (result.suggestions && result.suggestions.length > 0) {
        historyItem.response = '建议尝试：' + result.suggestions.join('、');
      }
    } else {
      historyItem.error = result.error || '处理失败';
    }

  } catch (error) {
    console.error('请求错误:', error);
    historyItem.error = '网络错误: ' + error.message;
  } finally {
    processing.value = false;
    userInput.value = '';
    await nextTick();
    scrollToBottom();
  }
}

/**
 * 撤销最后一步
 */
async function undoLast() {
  if (!canUndo.value || processing.value) return;

  processing.value = true;

  try {
    const response = await fetch('/api/v1/transform/undo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId.value,
        steps: 1
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      // 恢复到原始状态
      executor.restore();

      history.value.push({
        text: '[撤销操作]',
        response: '✓ 已撤销最后一次改造',
        error: null
      });

      if (!result.data.snapshot_id) {
        canUndo.value = false;
      }
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error('撤销错误:', error);
    history.value.push({
      text: '[撤销操作]',
      response: null,
      error: error.message
    });
  } finally {
    processing.value = false;
    await nextTick();
    scrollToBottom();
  }
}

/**
 * 重置到初始状态
 */
async function resetAll() {
  if (!canUndo.value || processing.value) return;

  if (!confirm('确定要重置到初始状态吗？这将撤销所有改造。')) {
    return;
  }

  processing.value = true;

  try {
    const response = await fetch('/api/v1/transform/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId.value
      })
    });

    const result = await response.json();

    if (result.status === 'success') {
      // 恢复到原始状态
      executor.restore();

      history.value.push({
        text: '[重置操作]',
        response: `✓ 已重置，撤销了 ${result.data.removed_count} 次改造`,
        error: null
      });

      canUndo.value = false;
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error('重置错误:', error);
    history.value.push({
      text: '[重置操作]',
      response: null,
      error: error.message
    });
  } finally {
    processing.value = false;
    await nextTick();
    scrollToBottom();
  }
}

/**
 * 更新会话状态
 */
async function updateSessionState() {
  try {
    const response = await fetch(`/api/v1/session/state?session_id=${sessionId.value}`);
    const result = await response.json();

    if (result.status === 'success' && result.data.exists) {
      canUndo.value = result.data.canUndo;
      sessionTTL.value = result.data.ttlMs;
    }
  } catch (error) {
    console.error('获取会话状态失败:', error);
  }
}

/**
 * 滚动到底部
 */
function scrollToBottom() {
  if (historyRef.value) {
    historyRef.value.scrollTop = historyRef.value.scrollHeight;
  }
}

/**
 * 启动TTL定时器
 */
function startTTLTimer() {
  ttlTimer = setInterval(() => {
    if (sessionTTL.value > 0) {
      sessionTTL.value -= 1000;

      if (sessionTTL.value <= 0) {
        // 会话过期，重置
        executor.restore();
        canUndo.value = false;
        sessionTTL.value = 0;
      }
    }
  }, 1000);
}

/**
 * 键盘快捷键
 */
function handleKeyboard(e) {
  // Cmd/Ctrl + K 打开对话框
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    toggleDialog();
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeyboard);
  startTTLTimer();
  updateSessionState();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboard);
  if (ttlTimer) {
    clearInterval(ttlTimer);
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: var(--color-background, #000000);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  position: relative;
}

.construction-container {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.construction-box {
  border: 2px solid #ffffff;
  background: #ffffff;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.construction-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bar {
  position: absolute;
  width: 8px;
  height: 60px;
  background: #000000;
  animation: construction-pulse 1.5s ease-in-out infinite;
}

.icon-bar-1 {
  left: 20px;
  animation-delay: 0s;
}

.icon-bar-2 {
  left: 36px;
  animation-delay: 0.3s;
}

.icon-bar-3 {
  left: 52px;
  animation-delay: 0.6s;
}

@keyframes construction-pulse {
  0%, 100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.3;
    transform: scaleY(0.5);
  }
}

.construction-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text, #000000);
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.construction-text {
  font-size: 16px;
  color: var(--color-text, #000000);
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 40px;
}

.promo-banner {
  background: #4a90e2;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.construction-stripes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.stripe {
  position: absolute;
  width: 100%;
  height: 20px;
  background: repeating-linear-gradient(
    90deg,
    #000000 0px,
    #000000 20px,
    transparent 20px,
    transparent 40px
  );
  opacity: 0.1;
  animation: stripe-move 2s linear infinite;
}

.stripe-1 {
  top: 0;
  animation-delay: 0s;
}

.stripe-2 {
  top: 25%;
  animation-delay: 0.5s;
}

.stripe-3 {
  top: 50%;
  animation-delay: 1s;
}

.stripe-4 {
  top: 75%;
  animation-delay: 1.5s;
}

@keyframes stripe-move {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 悬浮按钮 */
.floating-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #4a90e2;
  color: white;
  padding: 15px 25px;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  font-weight: 600;
}

.floating-button:hover {
  background: #357abd;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

.floating-button.active {
  background: #e74c3c;
}

/* 对话框 */
.dialog-panel {
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 450px;
  max-height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  z-index: 999;
  overflow: hidden;
}

.dialog-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.dialog-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #2c3e50;
}

.dialog-subtitle {
  margin: 0;
  font-size: 12px;
  color: #e74c3c;
}

.dialog-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: 300px;
}

.history-item {
  margin-bottom: 15px;
}

.user-message {
  background: #e3f2fd;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 5px;
  font-size: 14px;
}

.system-message {
  background: #e8f5e9;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 5px;
  font-size: 14px;
}

.error-message {
  background: #ffebee;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  color: #c62828;
}

.processing {
  text-align: center;
  padding: 10px;
  color: #666;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.input-area {
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
}

.input-area textarea {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  outline: none;
}

.input-area textarea:focus {
  border-color: #4a90e2;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.char-count {
  font-size: 12px;
  color: #999;
}

.input-footer button {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.input-footer button:hover:not(:disabled) {
  background: #357abd;
}

.input-footer button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.dialog-footer {
  padding: 15px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 10px;
  background: #f8f9fa;
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-secondary:hover:not(:disabled) {
  background: #bdc3c7;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-link {
  color: #4a90e2;
  text-decoration: none;
  padding: 8px 16px;
  font-size: 14px;
}

.btn-link:hover {
  text-decoration: underline;
}

/* TTL提示 */
.ttl-notice {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff3cd;
  color: #856404;
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid #ffeeba;
  font-size: 14px;
  z-index: 999;
}

/* 过渡动画 */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dialog-panel {
    width: calc(100vw - 20px);
    right: 10px;
    bottom: 80px;
    max-height: 500px;
  }

  .floating-button {
    bottom: 20px;
    right: 20px;
  }

  .construction-box {
    padding: 40px 20px;
  }

  .construction-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 30px;
  }

  .icon-bar {
    width: 6px;
    height: 45px;
  }

  .icon-bar-1 {
    left: 15px;
  }

  .icon-bar-2 {
    left: 27px;
  }

  .icon-bar-3 {
    left: 39px;
  }

  .construction-title {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .construction-text {
    font-size: 14px;
    margin-bottom: 30px;
  }

  .stripe {
    height: 15px;
  }
}

@media (max-width: 480px) {
  .construction-box {
    padding: 30px 15px;
  }

  .construction-title {
    font-size: 20px;
  }

  .construction-text {
    font-size: 13px;
  }
}
</style>
