<template>
  <div class="case-detail">
    <div class="back-button" @click="goBack">
      ← 返回列表
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      加载中...
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 案例详情 -->
    <div v-else-if="caseData" class="content">
      <div class="case-info">
        <span :class="['category-badge', caseData.category]">
          {{ caseData.categoryLabel }}
        </span>
        <h1 class="case-title">{{ caseData.title }}</h1>

        <div class="info-section">
          <h3 class="section-title">使用的提示词</h3>
          <div class="prompt-box">{{ caseData.prompt }}</div>
        </div>

        <div class="info-section">
          <h3 class="section-title">失败原因</h3>
          <div class="failure-box">{{ caseData.failureReason }}</div>
        </div>
      </div>

      <div class="demo-section">
        <h2 class="demo-title">失败效果演示</h2>

        <!-- 根据不同类型展示不同的演示组件 -->
        <div class="demo-container">
          <!-- 文本类型演示 -->
          <div v-if="caseData.demoType === 'text'" class="demo-text">
            <div class="demo-content">
              <p v-html="highlightText(caseData.demoData.content, caseData.demoData.highlightWords)"></p>
            </div>
            <div class="demo-note">
              注意观察那些充满"AI味道"的词汇...
            </div>
          </div>

          <!-- 按钮类型演示 -->
          <div v-else-if="caseData.demoType === 'button'" class="demo-button">
            <button class="ai-button">{{ caseData.demoData.text }}</button>
            <div class="demo-note">
              过度使用渐变色、阴影和发光效果，看起来很"炫酷"但实际上并不实用
            </div>
          </div>

          <!-- 文本处理器演示 -->
          <div v-else-if="caseData.demoType === 'text-processor'" class="demo-processor">
            <div class="compare-box">
              <div class="compare-item">
                <h4>原始文本：</h4>
                <p>{{ caseData.demoData.original }}</p>
              </div>
              <div class="arrow">↓</div>
              <div class="compare-item error">
                <h4>AI处理后：</h4>
                <p>{{ caseData.demoData.processed }}</p>
              </div>
            </div>
            <div class="demo-note">
              单词之间的空格也被删除了，完全不可读！
            </div>
          </div>

          <!-- 表单验证演示 -->
          <div v-else-if="caseData.demoType === 'form'" class="demo-form">
            <div v-for="(field, index) in caseData.demoData.fields" :key="index" class="form-field">
              <div class="field-header">
                <strong>{{ field.label }}</strong>
                <span class="rule-badge">{{ field.rule }}</span>
              </div>
              <div class="examples">
                <div
                  v-for="(example, idx) in field.examples"
                  :key="idx"
                  :class="['example-item', example.includes('✓') ? 'valid' : 'invalid']"
                >
                  {{ example }}
                </div>
              </div>
            </div>
            <div class="demo-note">
              这些验证规则完全不考虑现实情况的多样性
            </div>
          </div>

          <!-- 错误提示演示 -->
          <div v-else-if="caseData.demoType === 'error'" class="demo-error">
            <div v-for="(err, index) in caseData.demoData.errors" :key="index" class="error-compare">
              <div class="scenario">场景：{{ err.scenario }}</div>
              <div class="compare-box">
                <div class="compare-item ai-version">
                  <h4>AI版本：</h4>
                  <p>{{ err.aiVersion }}</p>
                </div>
                <div class="compare-item normal-version">
                  <h4>正常版本：</h4>
                  <p>{{ err.normalVersion }}</p>
                </div>
              </div>
            </div>
            <div class="demo-note">
              AI把"友好"理解成了"啰嗦"
            </div>
          </div>

          <!-- 日期选择器演示 -->
          <div v-else-if="caseData.demoType === 'date-picker'" class="demo-date-picker">
            <div class="picker-description">{{ caseData.demoData.description }}</div>
            <div class="picker-fields">
              <div v-for="(field, index) in caseData.demoData.fields" :key="index" class="picker-field">
                <label>{{ field }}</label>
                <select class="picker-select">
                  <option>请选择...</option>
                </select>
              </div>
            </div>
            <div class="demo-note">
              7个下拉框！用户只是想选个日期而已...
            </div>
          </div>

          <!-- 聊天演示 -->
          <div v-else-if="caseData.demoType === 'chat'" class="demo-chat">
            <div v-for="(conv, index) in caseData.demoData.conversations" :key="index" class="chat-item">
              <div class="chat-user">
                <span class="chat-label">用户:</span>
                {{ conv.user }}
              </div>
              <div class="chat-ai">
                <span class="chat-label">AI:</span>
                {{ conv.ai }}
              </div>
            </div>
            <div class="demo-note">
              完全答非所问，毫无上下文理解能力
            </div>
          </div>

          <!-- 头像演示 -->
          <div v-else-if="caseData.demoType === 'avatars'" class="demo-avatars">
            <div class="avatars-description">{{ caseData.demoData.description }}</div>
            <div class="avatars-grid">
              <div v-for="i in 6" :key="i" class="avatar-placeholder">
                AI头像{{ i }}
              </div>
            </div>
            <div class="features-list">
              <h4>AI生成头像的共同特征：</h4>
              <ul>
                <li v-for="(feature, index) in caseData.demoData.features" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>
            <div class="demo-note">
              所有头像都有明显的AI痕迹，缺乏真实性
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

const caseData = ref(null);
const loading = ref(true);
const error = ref(null);

// 高亮文本中的关键词
const highlightText = (text, keywords) => {
  let highlighted = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'g');
    highlighted = highlighted.replace(regex, `<span class="highlight">${keyword}</span>`);
  });
  return highlighted;
};

// 获取案例详情
const fetchCaseDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`/api/cases/${route.params.id}`);

    if (response.data.success) {
      caseData.value = response.data.data;
    } else {
      error.value = '案例不存在';
    }
  } catch (err) {
    console.error('获取案例详情失败:', err);
    error.value = '加载失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 返回列表
const goBack = () => {
  router.push('/');
};

onMounted(() => {
  fetchCaseDetail();
});
</script>

<style scoped>
.case-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.back-button {
  max-width: 1200px;
  margin: 0 auto 20px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-5px);
}

.loading, .error-message {
  max-width: 1200px;
  margin: 60px auto;
  text-align: center;
  color: white;
  font-size: 18px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.case-info {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.category-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin-bottom: 16px;
}

.category-badge.ai-taste {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.category-badge.mechanical {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.category-badge.reality {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.case-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 24px;
}

.info-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 12px;
}

.prompt-box {
  background: #f7fafc;
  border-left: 4px solid #667eea;
  padding: 16px;
  border-radius: 8px;
  font-style: italic;
  color: #4a5568;
  line-height: 1.6;
}

.failure-box {
  background: #fff5f5;
  border-left: 4px solid #e53e3e;
  padding: 16px;
  border-radius: 8px;
  color: #c53030;
  line-height: 1.6;
  font-weight: 500;
}

.demo-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.demo-title {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 24px;
  text-align: center;
}

.demo-container {
  background: #f7fafc;
  border-radius: 12px;
  padding: 24px;
  min-height: 200px;
}

.demo-note {
  margin-top: 20px;
  padding: 12px;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
  color: #856404;
  font-size: 14px;
  font-weight: 500;
}

/* 文本演示样式 */
.demo-text .demo-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  line-height: 1.8;
  font-size: 16px;
}

.demo-text :deep(.highlight) {
  background: #ffd700;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
  color: #c53030;
}

/* 按钮演示样式 */
.demo-button {
  text-align: center;
  padding: 40px;
}

.ai-button {
  padding: 20px 50px;
  font-size: 18px;
  font-weight: 700;
  color: white;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4),
              0 0 20px rgba(102, 126, 234, 0.6),
              inset 0 -5px 20px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.ai-button:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6),
              0 0 30px rgba(102, 126, 234, 0.8);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4),
                0 0 20px rgba(102, 126, 234, 0.6);
  }
  50% {
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6),
                0 0 40px rgba(102, 126, 234, 0.8);
  }
}

/* 文本处理器演示样式 */
.compare-box {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.compare-item {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.compare-item h4 {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.compare-item p {
  font-size: 16px;
  color: #2d3748;
  line-height: 1.6;
}

.compare-item.error {
  background: #fff5f5;
  border: 2px solid #e53e3e;
}

.arrow {
  text-align: center;
  font-size: 24px;
  color: #e53e3e;
  margin: 8px 0;
}

/* 表单演示样式 */
.demo-form {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.form-field {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.form-field:last-of-type {
  border-bottom: none;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.field-header strong {
  font-size: 16px;
  color: #2d3748;
}

.rule-badge {
  background: #e53e3e;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.example-item {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
}

.example-item.valid {
  background: #f0fdf4;
  color: #166534;
  border-left: 3px solid #22c55e;
}

.example-item.invalid {
  background: #fff5f5;
  color: #991b1b;
  border-left: 3px solid #e53e3e;
}

/* 错误提示演示样式 */
.demo-error .error-compare {
  margin-bottom: 24px;
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.scenario {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  font-size: 16px;
}

.ai-version {
  background: #fff5f5;
  border-left: 4px solid #e53e3e;
}

.normal-version {
  background: #f0fdf4;
  border-left: 4px solid #22c55e;
}

/* 日期选择器演示样式 */
.demo-date-picker {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.picker-description {
  margin-bottom: 20px;
  color: #4a5568;
  line-height: 1.6;
}

.picker-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.picker-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.picker-field label {
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
}

.picker-select {
  padding: 8px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

/* 聊天演示样式 */
.demo-chat {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.chat-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.chat-item:last-of-type {
  border-bottom: none;
}

.chat-user, .chat-ai {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  line-height: 1.6;
}

.chat-user {
  background: #e0e7ff;
  margin-left: 0;
  margin-right: 40px;
}

.chat-ai {
  background: #fff5f5;
  margin-left: 40px;
  margin-right: 0;
  border-left: 3px solid #e53e3e;
}

.chat-label {
  font-weight: 600;
  margin-right: 8px;
}

/* 头像演示样式 */
.demo-avatars {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.avatars-description {
  margin-bottom: 20px;
  color: #4a5568;
  line-height: 1.6;
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.avatar-placeholder {
  aspect-ratio: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.features-list {
  background: #f7fafc;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
}

.features-list h4 {
  color: #2d3748;
  margin-bottom: 12px;
  font-size: 15px;
}

.features-list ul {
  list-style: none;
  padding: 0;
}

.features-list li {
  padding: 6px 0;
  color: #4a5568;
  font-size: 14px;
  position: relative;
  padding-left: 20px;
}

.features-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #e53e3e;
  font-weight: bold;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .case-info, .demo-section {
    padding: 20px;
  }

  .case-title {
    font-size: 24px;
  }

  .demo-title {
    font-size: 20px;
  }

  .picker-fields {
    grid-template-columns: 1fr;
  }

  .avatars-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .chat-user, .chat-ai {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
