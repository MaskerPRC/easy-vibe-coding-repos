<template>
  <div class="transform-widget">
    <!-- 折叠状态：仅显示图标按钮 -->
    <button
      v-if="!isExpanded"
      class="widget-toggle"
      @click="toggleWidget"
      title="自定义页面"
    >
      <span class="toggle-icon">✨</span>
    </button>

    <!-- 展开状态：完整交互面板 -->
    <div v-else class="widget-panel">
      <!-- 面板头部 -->
      <div class="panel-header">
        <h3 class="panel-title">自定义页面</h3>
        <button class="close-btn" @click="toggleWidget" title="关闭">×</button>
      </div>

      <!-- 面板内容 -->
      <div class="panel-body">
        <!-- 输入区 -->
        <div class="input-section">
          <label class="input-label">输入您的需求：</label>
          <textarea
            v-model="userInput"
            class="input-textarea"
            placeholder="例如：把主标题改成：周末狂欢&#10;或：主题色改为绿色&#10;或：隐藏促销条"
            rows="3"
            maxlength="200"
            :disabled="isProcessing"
          ></textarea>
          <div class="input-hint">{{ userInput.length }} / 200</div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button
            class="btn btn-preview"
            @click="handlePreview"
            :disabled="!userInput.trim() || isProcessing"
          >
            {{ isProcessing ? '处理中...' : '预览效果' }}
          </button>
        </div>

        <!-- 预览区域 -->
        <div v-if="previewData" class="preview-section">
          <div class="preview-header">
            <span class="preview-title">预览变更</span>
            <span class="preview-badge">{{ previewData.changes.length }}项</span>
          </div>
          <div class="preview-list">
            <div
              v-for="(change, index) in previewData.changes"
              :key="index"
              class="preview-item"
            >
              <span class="preview-op">{{ getOpLabel(change.op) }}</span>
              <span class="preview-desc">{{ getChangeDesc(change) }}</span>
            </div>
          </div>
          <div class="preview-actions">
            <button class="btn btn-apply" @click="handleApply">
              应用变更
            </button>
            <button class="btn btn-cancel" @click="clearPreview">
              取消
            </button>
          </div>
        </div>

        <!-- 撤销按钮 -->
        <div v-if="canUndo && !previewData" class="undo-section">
          <button class="btn btn-undo" @click="handleUndo">
            撤销上次变更
          </button>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- 成功提示 -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </div>

      <!-- 面板底部 -->
      <div class="panel-footer">
        <div class="footer-hint">
          变更仅对本会话生效，15分钟后自动恢复
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { transformExecutor } from '../utils/transformExecutor';
import { mvpApi } from '../utils/mvpApi';

// 状态
const isExpanded = ref(false);
const userInput = ref('');
const isProcessing = ref(false);
const previewData = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const canUndo = ref(false);

// 切换面板展开/折叠
function toggleWidget() {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    clearMessages();
  }
}

// 清除消息
function clearMessages() {
  errorMessage.value = '';
  successMessage.value = '';
}

// 清除预览
function clearPreview() {
  previewData.value = null;
  clearMessages();
}

// 处理预览请求
async function handlePreview() {
  if (!userInput.value.trim()) return;

  clearMessages();
  isProcessing.value = true;

  try {
    const result = await mvpApi.compile(userInput.value);

    if (result.status === 'ok') {
      previewData.value = {
        dsl: result.data.dsl,
        changes: result.data.preview_patch,
        previewHash: result.data.preview_hash,
        warnings: result.data.warnings || []
      };

      // 显示警告（如果有）
      if (previewData.value.warnings.length > 0) {
        successMessage.value = `预览成功（警告：${previewData.value.warnings.join('；')}）`;
      } else {
        successMessage.value = '预览成功，您可以查看变更详情';
      }
    } else {
      errorMessage.value = result.error || '预览失败';
    }
  } catch (error) {
    errorMessage.value = `请求失败：${error.message}`;
  } finally {
    isProcessing.value = false;
  }
}

// 处理应用请求
async function handleApply() {
  if (!previewData.value) return;

  clearMessages();
  isProcessing.value = true;

  try {
    // 先应用到前端
    const executeResult = transformExecutor.execute(previewData.value.changes);

    if (!executeResult.success) {
      errorMessage.value = `应用失败：${executeResult.error}`;
      isProcessing.value = false;
      return;
    }

    // 通知后端
    const result = await mvpApi.apply(
      previewData.value.dsl,
      previewData.value.previewHash
    );

    if (result.status === 'ok') {
      successMessage.value = '变更已应用！15分钟后将自动恢复初始状态';
      canUndo.value = true;
      previewData.value = null;
      userInput.value = '';
    } else {
      // 应用失败，回滚前端变更
      transformExecutor.undo();
      errorMessage.value = result.error || '应用失败';
    }
  } catch (error) {
    // 请求失败，回滚前端变更
    transformExecutor.undo();
    errorMessage.value = `请求失败：${error.message}`;
  } finally {
    isProcessing.value = false;
  }
}

// 处理撤销请求
async function handleUndo() {
  clearMessages();

  try {
    // 前端撤销
    transformExecutor.undo();

    // 通知后端
    await mvpApi.undo();

    successMessage.value = '已撤销变更';
    canUndo.value = false;
  } catch (error) {
    errorMessage.value = `撤销失败：${error.message}`;
  }
}

// 获取操作类型标签
function getOpLabel(op) {
  const labels = {
    set_text: '📝 文本',
    set_style_var: '🎨 样式',
    toggle: '👁️ 显隐'
  };
  return labels[op] || op;
}

// 获取变更描述
function getChangeDesc(change) {
  switch (change.op) {
    case 'set_text':
      return `${change.selector} → "${change.text}"`;
    case 'set_style_var':
      return `${change.var} → ${change.value}`;
    case 'toggle':
      return `${change.selector} → ${change.enabled ? '显示' : '隐藏'}`;
    default:
      return JSON.stringify(change);
  }
}

// 初始化
onMounted(() => {
  // 检查是否有已应用的变更
  canUndo.value = transformExecutor.hasActiveTransform();

  // 监听执行器的恢复事件
  transformExecutor.on('restore', () => {
    canUndo.value = false;
    successMessage.value = '页面已自动恢复初始状态';
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  });
});

onUnmounted(() => {
  // 清理事件监听
  transformExecutor.off('restore');
});
</script>

<style scoped>
.transform-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

/* 折叠按钮 */
.widget-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.widget-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
}

.toggle-icon {
  font-size: 28px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 展开面板 */
.widget-panel {
  width: 380px;
  max-height: 80vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 面板头部 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* 面板主体 */
.panel-body {
  padding: 20px;
  max-height: calc(80vh - 120px);
  overflow-y: auto;
}

/* 输入区 */
.input-section {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.input-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.input-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.input-textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.input-hint {
  font-size: 12px;
  color: #999;
  text-align: right;
  margin-top: 4px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-preview {
  background: #667eea;
  color: white;
}

.btn-preview:hover:not(:disabled) {
  background: #5568d3;
}

.btn-apply {
  background: #10b981;
  color: white;
}

.btn-apply:hover {
  background: #059669;
}

.btn-cancel {
  background: #ef4444;
  color: white;
}

.btn-cancel:hover {
  background: #dc2626;
}

.btn-undo {
  width: 100%;
  background: #f59e0b;
  color: white;
}

.btn-undo:hover {
  background: #d97706;
}

/* 预览区域 */
.preview-section {
  border: 2px solid #667eea;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  background: #f8f9ff;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.preview-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.preview-badge {
  padding: 2px 8px;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.preview-list {
  margin-bottom: 12px;
}

.preview-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  margin-bottom: 6px;
  font-size: 13px;
}

.preview-op {
  flex-shrink: 0;
  font-weight: 600;
  color: #667eea;
}

.preview-desc {
  flex: 1;
  color: #666;
  word-break: break-word;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

/* 撤销区域 */
.undo-section {
  margin-top: 16px;
}

/* 消息提示 */
.error-message,
.success-message {
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  margin-top: 12px;
}

.error-message {
  background: #fee;
  color: #c00;
  border: 1px solid #fcc;
}

.success-message {
  background: #efe;
  color: #060;
  border: 1px solid #cfc;
}

/* 面板底部 */
.panel-footer {
  padding: 12px 20px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.footer-hint {
  font-size: 12px;
  color: #999;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .widget-panel {
    width: calc(100vw - 40px);
  }

  .widget-toggle {
    width: 50px;
    height: 50px;
  }

  .toggle-icon {
    font-size: 24px;
  }
}
</style>
