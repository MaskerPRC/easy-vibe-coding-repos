<template>
  <!-- 提交工具模态框 -->
  <div v-if="isOpen" class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="handleClose">×</button>
      <h2 class="modal-title">提交新工具</h2>
      <form @submit.prevent="handleSubmit" class="submit-form">
        <div class="form-group">
          <label for="toolName" class="form-label">工具名称 *</label>
          <input
            id="toolName"
            v-model="formData.name"
            type="text"
            placeholder="例如：ChatGPT"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="toolDescription" class="form-label">一句话描述 *</label>
          <input
            id="toolDescription"
            v-model="formData.description"
            type="text"
            placeholder="简短描述工具的主要功能"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="toolWebsite" class="form-label">网站链接 *</label>
          <input
            id="toolWebsite"
            v-model="formData.website"
            type="url"
            placeholder="https://example.com"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label for="toolCategory" class="form-label">分类 *</label>
          <select
            id="toolCategory"
            v-model="formData.category"
            class="form-select"
            required
          >
            <option value="">选择分类</option>
            <option v-for="cat in availableCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div v-if="error" class="submit-error">
          {{ error }}
        </div>
        <div v-if="success" class="submit-success">
          工具提交成功！
        </div>
        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? '提交中...' : '提交工具' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';

// 组件属性定义
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  }
});

// 组件事件定义
const emit = defineEmits(['close', 'submit-success']);

// 表单数据
const formData = ref({
  name: '',
  description: '',
  website: '',
  category: ''
});

// 提交状态
const submitting = ref(false);
const error = ref('');
const success = ref(false);

// 可用分类（过滤掉"全部"）
const availableCategories = computed(() => {
  return props.categories.filter(c => c !== '全部');
});

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    website: '',
    category: ''
  };
  error.value = '';
  success.value = false;
};

// 关闭模态框
const handleClose = () => {
  resetForm();
  emit('close');
};

// 提交表单
const handleSubmit = async () => {
  submitting.value = true;
  error.value = '';
  success.value = false;

  try {
    const response = await axios.post('/api/tools/submit', formData.value);
    if (response.data.success) {
      success.value = true;
      emit('submit-success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  } catch (err) {
    error.value = err.response?.data?.error || '提交失败，请重试';
  } finally {
    submitting.value = false;
  }
};

// 监听模态框打开状态，打开时重置表单
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetForm();
  }
});
</script>

<style scoped>
/* 提交工具模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.modal-title {
  font-family: 'Poppins', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24px;
}

.submit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}

.form-input,
.form-select {
  padding: 12px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4A90E2;
}

.submit-error {
  padding: 12px;
  background: #ffebee;
  color: #c62828;
  border-radius: 6px;
  font-size: 14px;
}

.submit-success {
  padding: 12px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 6px;
  font-size: 14px;
}

.submit-btn {
  padding: 14px 24px;
  background: #4A90E2;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #3a7bc8;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
