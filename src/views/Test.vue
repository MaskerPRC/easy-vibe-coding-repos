<template>
  <div class="test">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo" @click="goHome">
          <span class="logo-bracket">&lt;</span>
          <span class="logo-text">MTBI</span>
          <span class="logo-bracket">/&gt;</span>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载测试题目...</p>
      </div>

      <!-- 测试内容 -->
      <div v-else-if="questions.length > 0" class="test-container">
        <!-- 进度条 -->
        <div class="progress-section">
          <div class="progress-info">
            <span class="progress-text">问题 {{ currentIndex + 1 }} / {{ questions.length }}</span>
            <span class="progress-percent">{{ Math.round(((currentIndex + 1) / questions.length) * 100) }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"></div>
          </div>
        </div>

        <!-- 问题卡片 -->
        <div class="question-card" :key="currentQuestion.id">
          <div class="question-number">问题 {{ currentIndex + 1 }}</div>
          <h2 class="question-text">{{ currentQuestion.question }}</h2>

          <div class="options">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="option-button"
              :class="{ 'selected': selectedOption === index }"
              @click="selectOption(index, option.value)"
            >
              <div class="option-indicator">
                <div class="option-circle"></div>
              </div>
              <div class="option-text">{{ option.text }}</div>
            </button>
          </div>

          <!-- 导航按钮 -->
          <div class="navigation">
            <button
              class="nav-button prev"
              @click="previousQuestion"
              :disabled="currentIndex === 0"
            >
              ← 上一题
            </button>
            <button
              v-if="currentIndex < questions.length - 1"
              class="nav-button next"
              @click="nextQuestion"
              :disabled="selectedOption === null"
            >
              下一题 →
            </button>
            <button
              v-else
              class="nav-button submit"
              @click="submitTest"
              :disabled="!allAnswered"
            >
              提交测试
            </button>
          </div>

          <!-- 已回答提示 -->
          <div class="answered-info" v-if="answers.length > 0">
            已回答：{{ answers.length }} / {{ questions.length }}
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-else class="error-container">
        <p>加载测试题目失败，请刷新页面重试</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const loading = ref(true);
const questions = ref([]);
const currentIndex = ref(0);
const answers = ref([]);
const selectedOption = ref(null);

const currentQuestion = computed(() => questions.value[currentIndex.value]);

const allAnswered = computed(() => {
  return answers.value.length === questions.value.length;
});

// 加载问题
const loadQuestions = async () => {
  try {
    loading.value = true;
    const response = await axios.get('/api/questions');
    questions.value = response.data;

    // 检查是否有已保存的答案
    const savedAnswer = answers.value.find(a => a.questionId === currentQuestion.value.id);
    if (savedAnswer) {
      selectedOption.value = currentQuestion.value.options.findIndex(opt => opt.value === savedAnswer.value);
    }
  } catch (error) {
    console.error('加载问题失败:', error);
  } finally {
    loading.value = false;
  }
};

// 选择选项
const selectOption = (index, value) => {
  selectedOption.value = index;

  // 保存或更新答案
  const answerIndex = answers.value.findIndex(a => a.questionId === currentQuestion.value.id);
  if (answerIndex >= 0) {
    answers.value[answerIndex].value = value;
  } else {
    answers.value.push({
      questionId: currentQuestion.value.id,
      value: value
    });
  }
};

// 下一题
const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    updateSelectedOption();
  }
};

// 上一题
const previousQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    updateSelectedOption();
  }
};

// 更新选中状态
const updateSelectedOption = () => {
  const savedAnswer = answers.value.find(a => a.questionId === currentQuestion.value.id);
  if (savedAnswer) {
    selectedOption.value = currentQuestion.value.options.findIndex(opt => opt.value === savedAnswer.value);
  } else {
    selectedOption.value = null;
  }
};

// 提交测试
const submitTest = async () => {
  if (!allAnswered.value) {
    alert('请回答所有问题后再提交');
    return;
  }

  try {
    const response = await axios.post('/api/submit', {
      answers: answers.value
    });

    if (response.data.success) {
      // 跳转到结果页面
      router.push(`/result/${response.data.code}`);
    }
  } catch (error) {
    console.error('提交测试失败:', error);
    alert('提交失败，请重试');
  }
};

// 返回首页
const goHome = () => {
  if (confirm('测试进度将会丢失，确定要返回首页吗？')) {
    router.push('/');
  }
};

onMounted(() => {
  loadQuestions();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.test {
  min-height: 100vh;
  background: linear-gradient(135deg, #F5F7F8 0%, #E8ECEF 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 导航栏 */
.navbar {
  background: #2C3E50;
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  width: fit-content;
}

.logo-bracket {
  color: #00BCD4;
  font-weight: 700;
}

.logo-text {
  letter-spacing: 2px;
}

/* 主要内容 */
.main-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 30px;
}

/* 加载中 */
.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #ECF0F1;
  border-top-color: #00BCD4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  color: #34495E;
  font-size: 16px;
}

/* 测试容器 */
.test-container {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 进度条 */
.progress-section {
  margin-bottom: 40px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-text {
  font-size: 16px;
  color: #34495E;
  font-weight: 600;
}

.progress-percent {
  font-size: 16px;
  color: #00BCD4;
  font-weight: 700;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #ECF0F1;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00BCD4, #00ACC1);
  border-radius: 10px;
  transition: width 0.3s ease;
}

/* 问题卡片 */
.question-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

.question-number {
  display: inline-block;
  background: #E3F2FD;
  color: #00BCD4;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}

.question-text {
  font-size: 24px;
  font-weight: 600;
  color: #2C3E50;
  line-height: 1.5;
  margin-bottom: 40px;
}

/* 选项 */
.options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.option-button {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #F8F9FA;
  border: 2px solid #ECF0F1;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-button:hover {
  background: #E3F2FD;
  border-color: #00BCD4;
  transform: translateX(5px);
}

.option-button.selected {
  background: #E3F2FD;
  border-color: #00BCD4;
  box-shadow: 0 4px 15px rgba(0, 188, 212, 0.2);
}

.option-indicator {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: 2px solid #34495E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  transition: all 0.3s ease;
}

.option-button.selected .option-indicator {
  border-color: #00BCD4;
  background: #00BCD4;
}

.option-circle {
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.option-button.selected .option-circle {
  opacity: 1;
}

.option-text {
  flex: 1;
  font-size: 16px;
  color: #34495E;
  line-height: 1.6;
}

/* 导航按钮 */
.navigation {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.nav-button {
  padding: 14px 32px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button.prev {
  background: #ECF0F1;
  color: #34495E;
}

.nav-button.prev:hover:not(:disabled) {
  background: #D5DBDB;
}

.nav-button.next,
.nav-button.submit {
  background: #00BCD4;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
}

.nav-button.next:hover:not(:disabled),
.nav-button.submit:hover:not(:disabled) {
  background: #00ACC1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 188, 212, 0.4);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 已回答提示 */
.answered-info {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #34495E;
  opacity: 0.7;
}

/* 错误提示 */
.error-container {
  text-align: center;
  padding: 60px 20px;
  color: #34495E;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-card {
    padding: 30px 20px;
  }

  .question-text {
    font-size: 20px;
  }

  .option-text {
    font-size: 15px;
  }

  .navigation {
    flex-direction: column;
  }

  .nav-button {
    width: 100%;
  }
}
</style>
