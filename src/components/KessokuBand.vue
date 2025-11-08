<template>
  <div class="kessoku-band">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">結束バンド</div>
        <ul class="nav-menu">
          <li><a href="#home">首页</a></li>
          <li><a href="#story">故事</a></li>
          <li><a href="#members">成员</a></li>
          <li><a href="#info">作品信息</a></li>
          <li><a href="#quotes">名言</a></li>
          <li><a href="#model-info">模型信息</a></li>
        </ul>
      </div>
    </nav>

    <!-- 主视觉区域 -->
    <section id="home" class="hero">
      <div class="hero-content">
        <h1 class="title">結束バンド</h1>
        <p class="subtitle">Kessoku Band</p>
        <div class="hero-description">
          <p>一个由四名女高中生组成的摇滚乐队</p>
          <p>从下北泽STARRY live house出发，追逐音乐梦想</p>
        </div>

        <!-- 模型信息卡片 -->
        <div class="model-info-banner" v-if="!modelLoading && modelInfo">
          <div class="model-info-card">
            <div class="model-icon">AI</div>
            <div class="model-details">
              <h3 class="model-name">{{ modelInfo.modelName }}</h3>
              <p class="model-id">{{ modelInfo.modelId }}</p>
              <div class="model-meta">
                <span class="meta-item">版本: {{ modelInfo.version }}</span>
                <span class="meta-divider">|</span>
                <span class="meta-item">{{ modelInfo.provider }}</span>
                <span class="meta-divider">|</span>
                <span class="meta-item">知识截止: {{ modelInfo.knowledgeCutoff }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="model-loading" v-else-if="modelLoading">
          <p>加载模型信息中...</p>
        </div>

        <button class="cta-button">开始摇滚</button>
      </div>
      <div class="guitar-animation">
        <div class="guitar-string"></div>
        <div class="guitar-string"></div>
        <div class="guitar-string"></div>
      </div>
    </section>

    <!-- 故事简介 -->
    <section id="story" class="story-section">
      <div class="container">
        <h2 class="section-title">故事简介</h2>
        <div class="story-content">
          <p>
            后藤独是一个极度内向、患有社交恐惧症的女高中生。
            她从中学时期就开始独自练习吉他，梦想着能和乐队一起演出。
          </p>
          <p>
            某天，她被伊地知虹夏邀请加入"結束バンド"，
            与贝斯手山田凉、吉他手兼主唱喜多郁代一起组建了四人乐队。
          </p>
          <p>
            这是一个关于孤独少女通过音乐找到归属感，
            和伙伴们一起追逐梦想的青春成长故事。
          </p>
        </div>
      </div>
    </section>

    <!-- 乐队成员 -->
    <section id="members" class="members-section">
      <div class="container">
        <h2 class="section-title">乐队成员</h2>
        <div class="members-grid">
          <div class="member-card" v-for="member in members" :key="member.name">
            <div class="member-icon" :style="{ background: member.color }">
              <span class="member-initial">{{ member.initial }}</span>
            </div>
            <h3>{{ member.name }}</h3>
            <p class="member-role">{{ member.role }}</p>
            <p class="member-desc">{{ member.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 作品信息 -->
    <section id="info" class="info-section">
      <div class="container">
        <h2 class="section-title">作品信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <h3>原作</h3>
            <p>はまじあき</p>
          </div>
          <div class="info-item">
            <h3>动画制作</h3>
            <p>CloverWorks</p>
          </div>
          <div class="info-item">
            <h3>监督</h3>
            <p>斎藤圭一郎</p>
          </div>
          <div class="info-item">
            <h3>系列构成</h3>
            <p>吉田恵里香</p>
          </div>
          <div class="info-item">
            <h3>音乐</h3>
            <p>結束バンド</p>
          </div>
          <div class="info-item">
            <h3>播出时间</h3>
            <p>2022年10月～12月</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 名言区 -->
    <section id="quotes" class="quotes-section">
      <div class="container">
        <div class="quote-carousel">
          <div class="quote" :class="{ active: currentQuote === index }" v-for="(quote, index) in quotes" :key="index">
            <p class="quote-text">"{{ quote.text }}"</p>
            <p class="quote-author">—— {{ quote.author }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 模型信息区 -->
    <section id="model-info" class="model-info-section">
      <div class="container">
        <h2 class="section-title">AI 模型信息</h2>
        <div class="model-info-wrapper">
          <ModelInfo />
        </div>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <p>© はまじあき／芳文社・アニプレックス</p>
        <p>本网站为粉丝自制，仅用于展示和学习目的</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ModelInfo from './ModelInfo.vue';

// 模型信息状态
const modelInfo = ref(null);
const modelLoading = ref(true);

// 获取模型信息
const fetchModelInfo = async () => {
  try {
    const response = await fetch('/api/model-info');
    const data = await response.json();
    if (response.ok) {
      modelInfo.value = data;
    }
  } catch (err) {
    console.error('获取模型信息失败:', err);
  } finally {
    modelLoading.value = false;
  }
};

const members = [
  {
    name: '后藤独',
    initial: '独',
    role: '主音吉他手',
    description: '极度内向的吉他天才，绰号"小孤独"。拥有出色的吉他技术，但患有严重的社交恐惧症。',
    color: 'linear-gradient(135deg, #FFB6D9 0%, #FFC9E3 100%)'
  },
  {
    name: '伊地知虹夏',
    initial: '虹',
    role: '鼓手 / 队长',
    description: '開朗活泼的乐队队长，STARRY live house 店长的女儿。负责将大家凝聚在一起。',
    color: 'linear-gradient(135deg, #FFD93D 0%, #FFE56E 100%)'
  },
  {
    name: '山田凉',
    initial: '凉',
    role: '贝斯手',
    description: '冷静沉着的贝斯手，性格独特。对乐器和音乐有着深厚的理解，经济状况不佳。',
    color: 'linear-gradient(135deg, #6FBAFF 0%, #8FC9FF 100%)'
  },
  {
    name: '喜多郁代',
    initial: '郁',
    role: '吉他手 / 主唱',
    description: '开朗外向的吉他手兼主唱，后期加入乐队。虽然是新手但学习能力强，充满热情。',
    color: 'linear-gradient(135deg, #FF6B9D 0%, #FF8AB5 100%)'
  }
];

const quotes = [
  {
    text: '我想成为能在乐队里演奏的人！',
    author: '后藤独'
  },
  {
    text: '音乐就是要和大家一起享受才有意思！',
    author: '伊地知虹夏'
  },
  {
    text: '演奏的时候，要用心去感受音乐。',
    author: '山田凉'
  },
  {
    text: '虽然我还是新手，但我会努力追上大家的！',
    author: '喜多郁代'
  },
  {
    text: '結束バンド，永不解散！',
    author: '結束バンド全员'
  }
];

const currentQuote = ref(0);
let quoteInterval = null;

onMounted(() => {
  // 获取模型信息
  fetchModelInfo();

  // 名言轮播
  quoteInterval = setInterval(() => {
    currentQuote.value = (currentQuote.value + 1) % quotes.length;
  }, 5000);
});

onUnmounted(() => {
  if (quoteInterval) {
    clearInterval(quoteInterval);
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.kessoku-band {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #f5f5f5;
  overflow-x: hidden;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(255, 182, 217, 0.3);
  border-bottom: 2px solid rgba(255, 182, 217, 0.2);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #FFB6D9, #FFD93D, #6FBAFF, #FF6B9D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  color: #f5f5f5;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
  font-weight: 500;
}

.nav-menu a:hover {
  color: #FFB6D9;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #FFB6D9, #FFD93D);
  transition: width 0.3s;
}

.nav-menu a:hover::after {
  width: 100%;
}

/* 主视觉区域 */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 80px;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 182, 217, 0.15), transparent 70%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.hero-content {
  text-align: center;
  z-index: 1;
  max-width: 800px;
  padding: 0 2rem;
}

.title {
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #FFB6D9, #FFD93D, #6FBAFF, #FF6B9D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite;
  font-weight: bold;
  letter-spacing: 3px;
}

@keyframes titleGlow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 182, 217, 0.5)); }
  50% { filter: drop-shadow(0 0 30px rgba(255, 182, 217, 0.8)); }
}

.subtitle {
  font-size: 1.5rem;
  color: #FFD93D;
  margin-bottom: 2rem;
  font-weight: 300;
  letter-spacing: 2px;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 2;
  margin-bottom: 2rem;
  color: #d1d1d1;
}

/* 模型信息横幅 */
.model-info-banner {
  margin-bottom: 2rem;
  width: 100%;
  max-width: 700px;
}

.model-info-card {
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid rgba(255, 182, 217, 0.4);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(255, 182, 217, 0.2);
  transition: all 0.3s ease;
}

.model-info-card:hover {
  border-color: rgba(255, 182, 217, 0.6);
  box-shadow: 0 12px 40px rgba(255, 182, 217, 0.3);
  transform: translateY(-3px);
}

.model-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FFB6D9, #FF6B9D);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
}

.model-details {
  flex: 1;
  text-align: left;
}

.model-name {
  font-size: 1.3rem;
  color: #FFB6D9;
  margin: 0 0 0.3rem 0;
  font-weight: bold;
}

.model-id {
  font-size: 0.9rem;
  color: #FFD93D;
  margin: 0 0 0.5rem 0;
  font-family: 'Courier New', monospace;
}

.model-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #d1d1d1;
}

.meta-item {
  color: #d1d1d1;
}

.meta-divider {
  color: rgba(255, 182, 217, 0.5);
}

.model-loading {
  margin-bottom: 2rem;
  color: #FFD93D;
  font-style: italic;
}

.cta-button {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #FF6B9D, #FFB6D9);
  border: none;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 30px rgba(255, 107, 157, 0.4);
  font-weight: bold;
}

.cta-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(255, 107, 157, 0.6);
  background: linear-gradient(135deg, #FFB6D9, #FFD93D);
}

/* 吉他动画 */
.guitar-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  z-index: 0;
  opacity: 0.2;
}

.guitar-string {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FFD93D, transparent);
  animation: vibrate 2s ease-in-out infinite;
}

.guitar-string:nth-child(1) {
  top: 30%;
  animation-delay: 0s;
}

.guitar-string:nth-child(2) {
  top: 50%;
  animation-delay: 0.3s;
}

.guitar-string:nth-child(3) {
  top: 70%;
  animation-delay: 0.6s;
}

@keyframes vibrate {
  0%, 100% { transform: scaleY(1); opacity: 0.3; }
  50% { transform: scaleY(3); opacity: 0.8; }
}

/* 通用容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 章节标题 */
.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 4rem;
  background: linear-gradient(135deg, #FFB6D9, #FFD93D, #6FBAFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
}

/* 故事简介区 */
.story-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #16213e 0%, #1a1a2e 100%);
}

.story-content {
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.2rem;
  line-height: 2;
  text-align: justify;
}

.story-content p {
  margin-bottom: 1.5rem;
  color: #d1d1d1;
}

/* 成员区域 */
.members-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.member-card {
  background: rgba(26, 26, 46, 0.6);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid rgba(255, 182, 217, 0.3);
  backdrop-filter: blur(10px);
}

.member-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 40px rgba(255, 182, 217, 0.3);
  border-color: rgba(255, 182, 217, 0.6);
}

.member-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}

.member-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #FFB6D9;
}

.member-role {
  color: #FFD93D;
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
}

.member-desc {
  color: #d1d1d1;
  line-height: 1.6;
}

/* 作品信息区 */
.info-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #16213e 0%, #1a1a2e 100%);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.info-item {
  background: rgba(26, 26, 46, 0.6);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border: 2px solid rgba(255, 182, 217, 0.3);
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.info-item:hover {
  border-color: rgba(255, 182, 217, 0.5);
  box-shadow: 0 5px 20px rgba(255, 182, 217, 0.2);
  transform: translateY(-5px);
}

.info-item h3 {
  color: #FFB6D9;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-item p {
  color: #d1d1d1;
  font-size: 1rem;
}

/* 名言区 */
.quotes-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  min-height: 400px;
  display: flex;
  align-items: center;
}

.quote-carousel {
  position: relative;
  min-height: 200px;
}

.quote {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  text-align: center;
}

.quote.active {
  opacity: 1;
}

.quote-text {
  font-size: 2rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #f5f5f5;
  font-style: italic;
}

.quote-author {
  font-size: 1.3rem;
  color: #FFD93D;
}

/* 模型信息区 */
.model-info-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #16213e 0%, #1a1a2e 100%);
}

.model-info-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

/* 底部 */
.footer {
  background: rgba(26, 26, 46, 0.95);
  padding: 3rem 0;
  text-align: center;
  border-top: 2px solid rgba(255, 182, 217, 0.2);
}

.footer p {
  color: #d1d1d1;
  margin: 0.5rem 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .nav-menu {
    display: none;
  }

  .section-title {
    font-size: 2rem;
  }

  .quote-text {
    font-size: 1.5rem;
  }

  .members-grid {
    grid-template-columns: 1fr;
  }

  .guitar-animation {
    width: 300px;
    height: 300px;
  }

  .model-info-card {
    flex-direction: column;
    text-align: center;
    padding: 1.2rem;
  }

  .model-details {
    text-align: center;
  }

  .model-name {
    font-size: 1.1rem;
  }

  .model-id {
    font-size: 0.8rem;
  }

  .model-meta {
    justify-content: center;
    font-size: 0.75rem;
  }
}
</style>
