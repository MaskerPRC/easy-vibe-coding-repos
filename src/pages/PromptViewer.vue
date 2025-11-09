<template>
  <div class="prompt-viewer-container">
    <!-- 头部 -->
    <div class="viewer-header">
      <div class="header-left">
        <router-link to="/" class="back-btn">← 返回</router-link>
        <h2>提示词查看器</h2>
      </div>
      <button @click="toggleEdit" class="edit-btn">
        {{ isEditing ? '取消编辑' : '编辑提示词' }}
      </button>
    </div>

    <!-- 提示词展示/编辑区域 -->
    <div class="prompt-content">
      <div class="prompt-info">
        <div class="info-item">
          <label>标题:</label>
          <input
            v-if="isEditing"
            v-model="editablePrompt.title"
            type="text"
            class="title-input"
            placeholder="请输入提示词标题"
          />
          <span v-else class="info-value">{{ prompt.title }}</span>
        </div>

        <div class="info-item">
          <label>创建时间:</label>
          <span class="info-value">{{ formatDateTime(prompt.createdAt) }}</span>
        </div>

        <div class="info-item">
          <label>更新时间:</label>
          <span class="info-value">{{ formatDateTime(prompt.updatedAt) }}</span>
        </div>
      </div>

      <div class="prompt-text-section">
        <label class="section-label">提示词内容:</label>
        <textarea
          v-if="isEditing"
          v-model="editablePrompt.content"
          class="content-textarea"
          placeholder="请输入提示词内容..."
          rows="15"
        ></textarea>
        <div v-else class="content-display">
          <pre>{{ prompt.content }}</pre>
        </div>
      </div>

      <!-- 字符统计 -->
      <div class="char-stats">
        <span>字符数: {{ prompt.content.length }}</span>
        <span>行数: {{ countLines(prompt.content) }}</span>
      </div>

      <!-- 编辑模式下的操作按钮 -->
      <div v-if="isEditing" class="action-buttons">
        <button @click="savePrompt" class="save-btn" :disabled="isSaving">
          {{ isSaving ? '保存中...' : '保存' }}
        </button>
        <button @click="resetEdit" class="cancel-btn">
          重置
        </button>
      </div>

      <!-- 成功/错误提示 -->
      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'PromptViewer',
  setup() {
    const prompt = ref({
      id: 0,
      title: '',
      content: '',
      createdAt: '',
      updatedAt: ''
    });

    const editablePrompt = ref({
      title: '',
      content: ''
    });

    const isEditing = ref(false);
    const isSaving = ref(false);
    const message = ref('');
    const messageType = ref('success');

    // 格式化日期时间
    const formatDateTime = (dateString) => {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };

    // 统计行数
    const countLines = (text) => {
      if (!text) return 0;
      return text.split('\n').length;
    };

    // 加载提示词
    const loadPrompt = async () => {
      try {
        const response = await fetch('/api/prompt');
        const data = await response.json();

        if (data.success && data.data) {
          prompt.value = data.data;
        }
      } catch (error) {
        console.error('加载提示词失败:', error);
        showMessage('加载提示词失败', 'error');
      }
    };

    // 切换编辑模式
    const toggleEdit = () => {
      if (!isEditing.value) {
        // 进入编辑模式
        editablePrompt.value = {
          title: prompt.value.title,
          content: prompt.value.content
        };
      }
      isEditing.value = !isEditing.value;
      message.value = '';
    };

    // 重置编辑
    const resetEdit = () => {
      editablePrompt.value = {
        title: prompt.value.title,
        content: prompt.value.content
      };
      message.value = '';
    };

    // 保存提示词
    const savePrompt = async () => {
      if (!editablePrompt.value.content.trim()) {
        showMessage('提示词内容不能为空', 'error');
        return;
      }

      isSaving.value = true;
      message.value = '';

      try {
        const response = await fetch('/api/prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editablePrompt.value)
        });

        const data = await response.json();

        if (data.success) {
          prompt.value = data.data;
          isEditing.value = false;
          showMessage('提示词保存成功', 'success');
        } else {
          showMessage('保存失败: ' + (data.message || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('保存提示词失败:', error);
        showMessage('保存失败，请检查网络连接', 'error');
      } finally {
        isSaving.value = false;
      }
    };

    // 显示消息
    const showMessage = (msg, type = 'success') => {
      message.value = msg;
      messageType.value = type;
      setTimeout(() => {
        message.value = '';
      }, 3000);
    };

    onMounted(() => {
      loadPrompt();
    });

    return {
      prompt,
      editablePrompt,
      isEditing,
      isSaving,
      message,
      messageType,
      formatDateTime,
      countLines,
      toggleEdit,
      resetEdit,
      savePrompt
    };
  }
};
</script>

<style scoped>
.prompt-viewer-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 30px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-btn {
  padding: 8px 16px;
  background: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s, transform 0.2s;
}

.back-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.viewer-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.edit-btn {
  padding: 10px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.prompt-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.prompt-info {
  margin-bottom: 25px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.info-item label {
  font-weight: 600;
  color: #555;
  min-width: 100px;
  font-size: 14px;
}

.info-value {
  color: #333;
  font-size: 14px;
}

.title-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.title-input:focus {
  border-color: #667eea;
}

.prompt-text-section {
  margin-bottom: 20px;
}

.section-label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 10px;
  font-size: 14px;
}

.content-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.content-textarea:focus {
  border-color: #667eea;
}

.content-display {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
}

.content-display pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.char-stats {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  font-size: 13px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.save-btn, .cancel-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.save-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f0f0f0;
  color: #333;
}

.cancel-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.message {
  margin-top: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* 滚动条样式 */
.content-display::-webkit-scrollbar {
  width: 8px;
}

.content-display::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.content-display::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.content-display::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
