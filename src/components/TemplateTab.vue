<template>
  <div class="tab-content">
    <section class="section">
      <h2 class="section-title">一页纸商业计划</h2>
      <p class="section-desc">用这个框架整理你的商业想法,让投资人一目了然</p>

      <div class="template-container">
        <div v-for="(item, index) in templateItems" :key="index" class="template-card">
          <div class="template-number">{{ index + 1 }}</div>
          <div class="template-content">
            <h3 class="template-title">{{ item.title }}</h3>
            <p class="template-desc">{{ item.description }}</p>
            <div class="template-input">
              <textarea
                v-model="userAnswers[index]"
                :placeholder="item.placeholder"
                class="template-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="template-actions">
          <button @click="handleExport" class="btn-primary">导出计划</button>
          <button @click="handleClear" class="btn-secondary">清空内容</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { templateItems } from '@/data/templateData';
import { exportPlan, clearAnswers } from '@/utils/templateExport';

// 用户答案 - 使用内存存储
const userAnswers = ref(Array(templateItems.length).fill(''));

// 导出计划
const handleExport = () => {
  exportPlan(templateItems, userAnswers.value);
};

// 清空内容
const handleClear = () => {
  const result = clearAnswers(templateItems.length);
  if (result !== null) {
    userAnswers.value = result;
  }
};
</script>

<style scoped>
.tab-content {
  padding: 0;
}

.section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 12px;
  text-align: center;
}

.section-desc {
  font-size: 16px;
  color: #666666;
  text-align: center;
  margin-bottom: 40px;
}

/* 模板容器 */
.template-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.template-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 20px;
}

.template-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2ECC71, #27AE60);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.template-content {
  flex: 1;
}

.template-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 8px 0;
}

.template-desc {
  font-size: 14px;
  color: #999999;
  margin: 0 0 12px 0;
}

.template-input {
  margin-top: 12px;
}

.template-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #EEEEEE;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  color: #333333;
  resize: vertical;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.template-textarea:focus {
  outline: none;
  border-color: #2980B9;
}

.template-textarea::placeholder {
  color: #CCCCCC;
}

.template-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 16px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3498DB, #2980B9);
  color: #ffffff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(41, 128, 185, 0.3);
}

.btn-secondary {
  background: #EEEEEE;
  color: #666666;
}

.btn-secondary:hover {
  background: #E0E0E0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .template-card {
    flex-direction: column;
  }

  .template-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .section-title {
    font-size: 24px;
  }
}
</style>
