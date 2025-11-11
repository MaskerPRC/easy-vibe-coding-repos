<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">探索生命的真谛</h1>
        <p class="hero-subtitle">在这里，我们一起思考生命的意义，探寻存在的价值</p>
        <div class="hero-buttons">
          <router-link to="/meaning" class="btn btn-primary">开始探索</router-link>
          <router-link to="/wisdom" class="btn btn-secondary">获得智慧</router-link>
        </div>
      </div>
    </section>

    <!-- 每日名言 -->
    <section class="quote-section">
      <div class="container">
        <div class="quote-card">
          <p class="quote-text">{{ dailyQuote.text }}</p>
          <p class="quote-author">— {{ dailyQuote.author }}</p>
        </div>
      </div>
    </section>

    <!-- 核心主题 -->
    <section class="themes">
      <div class="container">
        <h2 class="section-title">核心主题</h2>
        <div class="theme-grid">
          <router-link to="/meaning" class="theme-card">
            <div class="theme-icon">🌟</div>
            <h3>生命的意义</h3>
            <p>探索生命存在的目的与价值，找到属于自己的人生方向</p>
          </router-link>

          <router-link to="/wisdom" class="theme-card">
            <div class="theme-icon">💡</div>
            <h3>生命的智慧</h3>
            <p>汲取古今中外的智慧，学习如何更好地生活与成长</p>
          </router-link>

          <router-link to="/philosophy" class="theme-card">
            <div class="theme-icon">📖</div>
            <h3>生命哲学</h3>
            <p>深入思考存在、自由、死亡等永恒的哲学命题</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 生命的四个维度 -->
    <section class="dimensions">
      <div class="container">
        <h2 class="section-title">生命的四个维度</h2>
        <div class="dimension-grid">
          <div class="dimension-card">
            <h3>🧠 思想维度</h3>
            <p>保持思考，不断学习，拓展认知边界</p>
          </div>
          <div class="dimension-card">
            <h3>❤️ 情感维度</h3>
            <p>珍惜关系，培养爱的能力，建立深刻连接</p>
          </div>
          <div class="dimension-card">
            <h3>🎯 行动维度</h3>
            <p>设定目标，付诸实践，创造有意义的成果</p>
          </div>
          <div class="dimension-card">
            <h3>🌱 成长维度</h3>
            <p>接受挑战，拥抱变化，持续自我提升</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 每日名言
const dailyQuote = ref({
  text: '生命的意义在于不断探索和成长',
  author: '佚名'
})

// 获取每日名言
const fetchDailyQuote = async () => {
  try {
    const response = await axios.get('/api/quotes/daily')
    if (response.data && response.data.quote) {
      dailyQuote.value = response.data.quote
    }
  } catch (error) {
    console.log('使用默认名言')
  }
}

onMounted(() => {
  fetchDailyQuote()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* 英雄区域 */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
  animation: fadeInUp 1s ease;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  animation: fadeInUp 1s ease 0.2s backwards;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  animation: fadeInUp 1s ease 0.4s backwards;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 名言区域 */
.quote-section {
  padding: 3rem 2rem;
  background: #f7fafc;
}

.quote-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.quote-text {
  font-size: 1.5rem;
  font-style: italic;
  color: #2d3748;
  margin-bottom: 1rem;
  line-height: 1.8;
}

.quote-author {
  color: #718096;
  font-size: 1.1rem;
}

/* 主题区域 */
.themes {
  padding: 4rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2d3748;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.theme-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  text-align: center;
}

.theme-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
}

.theme-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.theme-card h3 {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.theme-card p {
  color: #718096;
  line-height: 1.6;
}

/* 维度区域 */
.dimensions {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dimension-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.dimension-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.dimension-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.dimension-card h3 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.dimension-card p {
  color: #718096;
  line-height: 1.6;
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }

  .quote-text {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .theme-grid,
  .dimension-grid {
    grid-template-columns: 1fr;
  }
}
</style>
