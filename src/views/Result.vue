<template>
  <div class="result">
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
      <div v-if="personality" class="result-container">
        <!-- 结果标题 -->
        <div class="result-header">
          <div class="result-badge">你的开发人格类型</div>
          <div class="personality-code">{{ personality.code }}</div>
          <h1 class="personality-name">{{ personality.name }}</h1>
          <p class="personality-nickname">{{ personality.nickname }}</p>
        </div>

        <!-- 人格描述 -->
        <div class="description-card">
          <h2 class="card-title">人格描述</h2>
          <p class="description-text">{{ personality.description }}</p>
        </div>

        <!-- 人格特质 -->
        <div class="traits-card">
          <h2 class="card-title">核心特质</h2>
          <div class="traits-grid">
            <div v-for="(trait, index) in personality.traits" :key="index" class="trait-item">
              <div class="trait-icon">✓</div>
              <span class="trait-text">{{ trait }}</span>
            </div>
          </div>
        </div>

        <!-- 优势与劣势 -->
        <div class="strengths-weaknesses">
          <div class="sw-card strengths">
            <div class="sw-icon">💪</div>
            <h3 class="sw-title">优势</h3>
            <p class="sw-text">{{ personality.strengths }}</p>
          </div>
          <div class="sw-card weaknesses">
            <div class="sw-icon">⚠️</div>
            <h3 class="sw-title">需要注意</h3>
            <p class="sw-text">{{ personality.weaknesses }}</p>
          </div>
        </div>

        <!-- 建议 -->
        <div class="advice-card">
          <h2 class="card-title">发展建议</h2>
          <p class="advice-text">{{ personality.advice }}</p>
        </div>

        <!-- 维度详情 -->
        <div class="dimensions-detail">
          <h2 class="section-title">你的人格维度分析</h2>
          <div class="dimensions-list">
            <div v-for="(dim, key) in dimensionResults" :key="key" class="dimension-item">
              <div class="dimension-header">
                <div class="dimension-name">{{ dim.dimensionName }}</div>
                <div class="dimension-type">{{ dim.letter }} - {{ dim.title }}</div>
              </div>
              <div class="dimension-bar">
                <div class="bar-fill" :style="{ width: dim.percentage + '%' }"></div>
              </div>
              <div class="dimension-desc">{{ dim.description }}</div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <button class="action-button secondary" @click="retakeTest">
            重新测试
          </button>
          <button class="action-button primary" @click="goHome">
            返回首页
          </button>
        </div>
      </div>

      <div v-else class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在分析结果...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { personalities, dimensions } from '../data/personality.js';

const router = useRouter();
const route = useRoute();

const personality = ref(null);
const dimensionResults = ref({});

// 获取维度结果
const getDimensionResults = (code) => {
  const results = {};

  // PI 维度
  const piLetter = code[0];
  results.PI = {
    dimensionName: dimensions.PI.name,
    letter: piLetter,
    title: dimensions.PI[piLetter].title,
    description: dimensions.PI[piLetter].description,
    percentage: piLetter === 'P' ? 70 : 30
  };

  // MD 维度
  const mdLetter = code[1];
  results.MD = {
    dimensionName: dimensions.MD.name,
    letter: mdLetter,
    title: dimensions.MD[mdLetter].title,
    description: dimensions.MD[mdLetter].description,
    percentage: mdLetter === 'M' ? 65 : 35
  };

  // CT 维度
  const ctLetter = code[2];
  results.CT = {
    dimensionName: dimensions.CT.name,
    letter: ctLetter,
    title: dimensions.CT[ctLetter].title,
    description: dimensions.CT[ctLetter].description,
    percentage: ctLetter === 'C' ? 60 : 40
  };

  // SE 维度
  const seLetter = code[3];
  results.SE = {
    dimensionName: dimensions.SE.name,
    letter: seLetter,
    title: dimensions.SE[seLetter].title,
    description: dimensions.SE[seLetter].description,
    percentage: seLetter === 'S' ? 75 : 25
  };

  return results;
};

const loadResult = () => {
  const code = route.params.code;
  if (code && personalities[code]) {
    personality.value = personalities[code];
    dimensionResults.value = getDimensionResults(code);
  } else {
    router.push('/');
  }
};

const retakeTest = () => {
  router.push('/test');
};

const goHome = () => {
  router.push('/');
};

onMounted(() => {
  loadResult();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.result {
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
  max-width: 1000px;
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

/* 结果容器 */
.result-container {
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 结果标题 */
.result-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 50px 30px;
  background: linear-gradient(135deg, #2C3E50, #34495E);
  border-radius: 20px;
  color: #ffffff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.result-badge {
  display: inline-block;
  background: rgba(0, 188, 212, 0.2);
  color: #00BCD4;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
  border: 1px solid #00BCD4;
}

.personality-code {
  font-size: 72px;
  font-weight: 700;
  letter-spacing: 8px;
  margin-bottom: 20px;
  color: #00BCD4;
  text-shadow: 0 4px 10px rgba(0, 188, 212, 0.3);
}

.personality-name {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
}

.personality-nickname {
  font-size: 20px;
  opacity: 0.8;
  font-style: italic;
}

/* 卡片样式 */
.description-card,
.traits-card,
.advice-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 35px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-title::before {
  content: '';
  width: 4px;
  height: 24px;
  background: #00BCD4;
  border-radius: 2px;
}

.description-text,
.advice-text {
  font-size: 17px;
  color: #34495E;
  line-height: 1.8;
}

/* 特质网格 */
.traits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.trait-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #E3F2FD;
  border-radius: 10px;
  border-left: 3px solid #00BCD4;
}

.trait-icon {
  width: 28px;
  height: 28px;
  background: #00BCD4;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.trait-text {
  font-size: 15px;
  font-weight: 600;
  color: #2C3E50;
}

/* 优势与劣势 */
.strengths-weaknesses {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.sw-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.sw-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.sw-title {
  font-size: 20px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 15px;
}

.sw-text {
  font-size: 16px;
  color: #34495E;
  line-height: 1.7;
}

/* 维度详情 */
.dimensions-detail {
  background: #ffffff;
  border-radius: 16px;
  padding: 35px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 24px;
  background: #00BCD4;
  border-radius: 2px;
}

.dimensions-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.dimension-item {
  padding-bottom: 25px;
  border-bottom: 1px solid #ECF0F1;
}

.dimension-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.dimension-name {
  font-size: 16px;
  font-weight: 600;
  color: #34495E;
}

.dimension-type {
  font-size: 15px;
  font-weight: 600;
  color: #00BCD4;
  background: #E3F2FD;
  padding: 6px 14px;
  border-radius: 20px;
}

.dimension-bar {
  width: 100%;
  height: 10px;
  background: #ECF0F1;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00BCD4, #00ACC1);
  border-radius: 10px;
  transition: width 1s ease;
}

.dimension-desc {
  font-size: 15px;
  color: #34495E;
  line-height: 1.6;
  opacity: 0.85;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  padding: 16px 40px;
  border: none;
  border-radius: 50px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.primary {
  background: #00BCD4;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
}

.action-button.primary:hover {
  background: #00ACC1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 188, 212, 0.4);
}

.action-button.secondary {
  background: #ECF0F1;
  color: #34495E;
}

.action-button.secondary:hover {
  background: #D5DBDB;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personality-code {
    font-size: 48px;
    letter-spacing: 4px;
  }

  .personality-name {
    font-size: 28px;
  }

  .personality-nickname {
    font-size: 18px;
  }

  .description-card,
  .traits-card,
  .advice-card,
  .dimensions-detail {
    padding: 25px 20px;
  }

  .traits-grid {
    grid-template-columns: 1fr;
  }

  .strengths-weaknesses {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}
</style>
