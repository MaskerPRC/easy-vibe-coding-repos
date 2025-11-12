<template>
  <div class="test-page">
    <div class="test-header">
      <h1 class="title">AI依赖程度测试</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link">数据看板</router-link>
        <router-link to="/test" class="nav-link active">测试页面</router-link>
      </nav>
    </div>

    <div class="test-content">
      <!-- 测试表单 -->
      <div class="form-section">
        <h2 class="section-title">提交测试结果</h2>
        <form @submit.prevent="submitResult" class="test-form">
          <div class="form-group">
            <label for="userId">用户ID:</label>
            <input
              v-model="form.userId"
              type="text"
              id="userId"
              required
              placeholder="例如: user1"
            />
          </div>

          <div class="form-group">
            <label for="userName">用户名:</label>
            <input
              v-model="form.userName"
              type="text"
              id="userName"
              required
              placeholder="例如: 张三"
            />
          </div>

          <div class="form-group">
            <label for="questionId">选择题目:</label>
            <select v-model="form.questionId" id="questionId" required>
              <option value="">请选择题目</option>
              <option
                v-for="question in questions"
                :key="question.id"
                :value="question.id"
              >
                {{ question.title }} ({{ question.scenario }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="aiDependency">AI依赖程度 (1-5分):</label>
            <div class="dependency-selector">
              <div
                v-for="level in 5"
                :key="level"
                class="dependency-option"
                :class="{ selected: form.aiDependency === level }"
                @click="form.aiDependency = level"
              >
                <div class="option-circle">{{ level }}</div>
                <div class="option-label">{{ getDependencyLabel(level) }}</div>
              </div>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? '提交中...' : '提交结果' }}
          </button>

          <div v-if="message" class="message" :class="messageType">
            {{ message }}
          </div>
        </form>
      </div>

      <!-- 测试题目列表 -->
      <div class="questions-section">
        <h2 class="section-title">可用题目列表</h2>
        <div class="questions-list">
          <div
            v-for="question in questions"
            :key="question.id"
            class="question-card"
          >
            <div class="question-header">
              <h3 class="question-title">{{ question.title }}</h3>
              <span class="question-difficulty" :class="'diff-' + question.difficulty">
                {{ question.difficulty }}
              </span>
            </div>
            <div class="question-info">
              <span class="info-label">场景:</span>
              <span class="info-value">{{ question.scenario }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近的测试结果 -->
      <div class="results-section">
        <h2 class="section-title">最近的测试结果</h2>
        <div v-if="loadingResults" class="loading">加载中...</div>
        <div v-else-if="results.length === 0" class="no-data">暂无测试结果</div>
        <div v-else class="results-table">
          <table>
            <thead>
              <tr>
                <th>用户</th>
                <th>题目</th>
                <th>场景</th>
                <th>依赖程度</th>
                <th>完成时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in recentResults" :key="result.id">
                <td>{{ result.userName }}</td>
                <td>{{ result.questionTitle }}</td>
                <td>{{ result.scenario }}</td>
                <td>
                  <span class="dependency-badge" :class="'level-' + result.aiDependency">
                    {{ result.aiDependency }}分
                  </span>
                </td>
                <td>{{ result.completedAt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const form = ref({
  userId: '',
  userName: '',
  questionId: '',
  aiDependency: 3
});

const questions = ref([]);
const results = ref([]);
const submitting = ref(false);
const loadingResults = ref(false);
const message = ref('');
const messageType = ref('');

// 获取最近10条结果
const recentResults = computed(() => {
  return results.value.slice(-10).reverse();
});

// 获取依赖程度标签
const getDependencyLabel = (level) => {
  const labels = {
    1: '完全独立',
    2: '较少依赖',
    3: '中等依赖',
    4: '较多依赖',
    5: '完全依赖'
  };
  return labels[level] || '';
};

// 加载题目列表
const loadQuestions = async () => {
  try {
    const response = await axios.get('/api/questions');
    if (response.data.success) {
      questions.value = response.data.data;
    }
  } catch (error) {
    console.error('加载题目失败:', error);
  }
};

// 加载测试结果
const loadResults = async () => {
  try {
    loadingResults.value = true;
    const response = await axios.get('/api/results');
    if (response.data.success) {
      results.value = response.data.data;
    }
  } catch (error) {
    console.error('加载结果失败:', error);
  } finally {
    loadingResults.value = false;
  }
};

// 提交测试结果
const submitResult = async () => {
  try {
    submitting.value = true;
    message.value = '';

    const response = await axios.post('/api/results', form.value);

    if (response.data.success) {
      message.value = '提交成功!';
      messageType.value = 'success';

      // 重新加载结果
      await loadResults();

      // 清空表单（保留用户信息）
      form.value.questionId = '';
      form.value.aiDependency = 3;
    } else {
      message.value = '提交失败: ' + response.data.error;
      messageType.value = 'error';
    }
  } catch (error) {
    console.error('提交失败:', error);
    message.value = '提交失败: ' + (error.response?.data?.error || error.message);
    messageType.value = 'error';
  } finally {
    submitting.value = false;

    // 3秒后清除消息
    setTimeout(() => {
      message.value = '';
    }, 3000);
  }
};

onMounted(() => {
  loadQuestions();
  loadResults();
});
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.nav {
  display: flex;
  gap: 15px;
}

.nav-link {
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: #f0f0f0;
  color: #333;
}

.nav-link.active {
  background: #667eea;
  color: white;
}

.test-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-section,
.questions-section,
.results-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.test-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.dependency-selector {
  display: flex;
  gap: 15px;
  justify-content: space-between;
}

.dependency-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dependency-option:hover {
  border-color: #667eea;
  background: #f8f9fa;
}

.dependency-option.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.option-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  background: #f0f0f0;
  color: #333;
}

.dependency-option.selected .option-circle {
  background: white;
  color: #667eea;
}

.option-label {
  font-size: 11px;
  text-align: center;
  line-height: 1.3;
}

.submit-btn {
  padding: 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
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

.questions-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.question-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.question-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.question-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.question-difficulty {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.diff-简单 {
  background: #d4edda;
  color: #155724;
}

.diff-中等 {
  background: #fff3cd;
  color: #856404;
}

.diff-困难 {
  background: #f8d7da;
  color: #721c24;
}

.question-info {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.loading,
.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}

.results-table {
  overflow-x: auto;
}

.results-table table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th,
.results-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.results-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.results-table tr:hover {
  background: #f8f9fa;
}

.dependency-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.dependency-badge.level-1 { background: #d4edda; color: #155724; }
.dependency-badge.level-2 { background: #d1ecf1; color: #0c5460; }
.dependency-badge.level-3 { background: #fff3cd; color: #856404; }
.dependency-badge.level-4 { background: #f8d7da; color: #721c24; }
.dependency-badge.level-5 { background: #f5c6cb; color: #491217; }

@media (max-width: 768px) {
  .test-page {
    padding: 10px;
  }

  .test-header {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .title {
    font-size: 22px;
  }

  .form-section,
  .questions-section,
  .results-section {
    padding: 20px;
  }

  .dependency-selector {
    flex-wrap: wrap;
  }

  .dependency-option {
    min-width: calc(33.33% - 10px);
  }

  .questions-list {
    grid-template-columns: 1fr;
  }

  .results-table {
    font-size: 14px;
  }

  .results-table th,
  .results-table td {
    padding: 8px;
  }
}
</style>
