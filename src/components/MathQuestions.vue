<template>
  <div class="math-questions-container">
    <div class="title-section">
      <h1 class="title">小学数学练习题</h1>
      <p class="subtitle">每次刷新生成10道随机数学题</p>
    </div>

    <div class="controls">
      <button @click="loadQuestions" class="refresh-btn" :disabled="loading">
        {{ loading ? '生成中...' : '生成新题目' }}
      </button>
      <button @click="toggleAnswers" class="toggle-btn" v-if="questions.length > 0">
        {{ showAnswers ? '隐藏答案' : '显示答案' }}
      </button>
      <button @click="resetAnswers" class="reset-btn" v-if="userAnswers.length > 0">
        重置答题
      </button>
    </div>

    <div v-if="loading" class="loading">
      正在生成数学题...
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="questions.length > 0" class="questions-grid">
      <div
        v-for="(question, index) in questions"
        :key="question.id"
        class="question-card"
        :class="{ 'correct': userAnswers[index] && userAnswers[index] == question.answer, 'incorrect': userAnswers[index] && userAnswers[index] != question.answer }"
      >
        <div class="question-number">第 {{ question.id }} 题</div>
        <div class="question-text">{{ question.question }}</div>

        <div class="answer-input">
          <input
            type="number"
            v-model="userAnswers[index]"
            @input="checkAnswer(index, question.answer)"
            placeholder="请输入答案"
            class="input-field"
          />
        </div>

        <div v-if="showAnswers" class="answer-display">
          <span class="answer-label">正确答案：</span>
          <span class="answer-value">{{ question.answer }}</span>
        </div>

        <div v-if="userAnswers[index]" class="result-indicator">
          <span v-if="userAnswers[index] == question.answer" class="correct-mark">✓ 正确</span>
          <span v-else class="incorrect-mark">✗ 错误</span>
        </div>
      </div>
    </div>

    <div v-if="questions.length > 0 && userAnswers.length > 0" class="score-section">
      <h2 class="score-title">答题情况</h2>
      <div class="score-details">
        <div class="score-item">
          <span class="score-label">已答题数：</span>
          <span class="score-value">{{ answeredCount }} / 10</span>
        </div>
        <div class="score-item">
          <span class="score-label">正确题数：</span>
          <span class="score-value correct-text">{{ correctCount }}</span>
        </div>
        <div class="score-item">
          <span class="score-label">错误题数：</span>
          <span class="score-value incorrect-text">{{ incorrectCount }}</span>
        </div>
        <div class="score-item" v-if="answeredCount === 10">
          <span class="score-label">得分：</span>
          <span class="score-value score-text">{{ score }} 分</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const questions = ref([]);
const loading = ref(false);
const error = ref('');
const showAnswers = ref(false);
const userAnswers = ref([]);

// 加载数学题
const loadQuestions = async () => {
  loading.value = true;
  error.value = '';
  userAnswers.value = [];

  try {
    const response = await fetch('/api/math/questions');
    const data = await response.json();

    if (data.success) {
      questions.value = data.questions;
      userAnswers.value = new Array(10).fill('');
    } else {
      error.value = '获取数学题失败';
    }
  } catch (err) {
    error.value = '网络错误: ' + err.message;
  } finally {
    loading.value = false;
  }
};

// 切换答案显示
const toggleAnswers = () => {
  showAnswers.value = !showAnswers.value;
};

// 重置答案
const resetAnswers = () => {
  userAnswers.value = new Array(10).fill('');
};

// 检查答案
const checkAnswer = (index, correctAnswer) => {
  // 自动检查，不需要额外操作
};

// 计算已答题数
const answeredCount = computed(() => {
  return userAnswers.value.filter(answer => answer !== '').length;
});

// 计算正确题数
const correctCount = computed(() => {
  return questions.value.filter((q, index) =>
    userAnswers.value[index] && userAnswers.value[index] == q.answer
  ).length;
});

// 计算错误题数
const incorrectCount = computed(() => {
  return questions.value.filter((q, index) =>
    userAnswers.value[index] && userAnswers.value[index] != q.answer
  ).length;
});

// 计算得分
const score = computed(() => {
  return correctCount.value * 10;
});

// 页面加载时自动获取题目
onMounted(() => {
  loadQuestions();
});
</script>

<style scoped>
.math-questions-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background: #0000AA;
  min-height: 100vh;
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #FFFFFF;
}

.title {
  font-size: 2.5em;
  color: #FFFFFF;
  margin-bottom: 10px;
  font-family: 'Courier New', 'Fixedsys', monospace;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
  letter-spacing: 3px;
}

.subtitle {
  font-size: 1.1em;
  color: #AAAAAA;
  font-family: 'Courier New', 'Fixedsys', monospace;
  letter-spacing: 1px;
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.refresh-btn,
.toggle-btn,
.reset-btn {
  padding: 12px 30px;
  background: #0000AA;
  border: 2px solid #AAAAAA;
  border-radius: 0;
  color: #FFFFFF;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Courier New', 'Fixedsys', monospace;
  text-transform: uppercase;
}

.refresh-btn:hover,
.toggle-btn:hover,
.reset-btn:hover {
  background: #0000CC;
  border-color: #FFFFFF;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.loading,
.error-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #FFFFFF;
  font-family: 'Courier New', 'Fixedsys', monospace;
  border: 2px solid #FFFFFF;
  margin: 20px auto;
  max-width: 600px;
}

.error-message {
  background: #AA0000;
  border-color: #FFFFFF;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.question-card {
  background: #000088;
  border: 2px solid #FFFFFF;
  border-radius: 0;
  padding: 20px;
  transition: all 0.3s ease;
}

.question-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
}

.question-card.correct {
  border-color: #00FF00;
  background: #004400;
}

.question-card.incorrect {
  border-color: #FF0000;
  background: #440000;
}

.question-number {
  font-size: 0.9em;
  color: #AAAAAA;
  margin-bottom: 10px;
  font-family: 'Courier New', 'Fixedsys', monospace;
  letter-spacing: 1px;
}

.question-text {
  font-size: 1.8em;
  color: #FFFFFF;
  margin-bottom: 20px;
  font-weight: bold;
  text-align: center;
  font-family: 'Courier New', 'Fixedsys', monospace;
  letter-spacing: 2px;
}

.answer-input {
  margin-bottom: 15px;
}

.input-field {
  width: 100%;
  padding: 12px;
  font-size: 1.2em;
  background: #000044;
  border: 2px solid #AAAAAA;
  border-radius: 0;
  color: #FFFFFF;
  font-family: 'Courier New', 'Fixedsys', monospace;
  text-align: center;
}

.input-field:focus {
  outline: none;
  border-color: #FFFFFF;
  background: #000066;
}

.answer-display {
  margin-top: 15px;
  padding: 10px;
  background: #000066;
  border: 1px solid #AAAAAA;
  border-radius: 0;
  text-align: center;
}

.answer-label {
  color: #AAAAAA;
  font-size: 0.9em;
  font-family: 'Courier New', 'Fixedsys', monospace;
}

.answer-value {
  color: #00FF00;
  font-size: 1.3em;
  font-weight: bold;
  margin-left: 10px;
  font-family: 'Courier New', 'Fixedsys', monospace;
}

.result-indicator {
  margin-top: 15px;
  text-align: center;
  font-size: 1.1em;
  font-weight: bold;
  font-family: 'Courier New', 'Fixedsys', monospace;
}

.correct-mark {
  color: #00FF00;
}

.incorrect-mark {
  color: #FF0000;
}

.score-section {
  background: #000088;
  border: 2px solid #FFFFFF;
  border-radius: 0;
  padding: 25px;
  margin-top: 30px;
}

.score-title {
  font-size: 1.8em;
  color: #FFFFFF;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Courier New', 'Fixedsys', monospace;
  letter-spacing: 2px;
}

.score-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.score-item {
  background: #000066;
  padding: 15px;
  border: 1px solid #AAAAAA;
  border-radius: 0;
  text-align: center;
}

.score-label {
  display: block;
  color: #AAAAAA;
  font-size: 1em;
  margin-bottom: 8px;
  font-family: 'Courier New', 'Fixedsys', monospace;
}

.score-value {
  display: block;
  color: #FFFFFF;
  font-size: 1.5em;
  font-weight: bold;
  font-family: 'Courier New', 'Fixedsys', monospace;
}

.correct-text {
  color: #00FF00;
}

.incorrect-text {
  color: #FF0000;
}

.score-text {
  color: #FFFF00;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .math-questions-container {
    padding: 15px;
  }

  .title {
    font-size: 1.8em;
  }

  .subtitle {
    font-size: 0.9em;
  }

  .questions-grid {
    grid-template-columns: 1fr;
  }

  .score-details {
    grid-template-columns: 1fr;
  }
}
</style>
