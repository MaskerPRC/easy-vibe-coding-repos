<template>
  <div class="madoka-magica">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">魔法少女まどか☆マギカ</div>
        <ul class="nav-menu">
          <li><a href="#home">首页</a></li>
          <li><a href="#story">故事</a></li>
          <li><a href="#characters">角色</a></li>
          <li><a href="#gallery">画廊</a></li>
          <li><a href="#news">新闻</a></li>
          <li><a href="#model-info">模型信息</a></li>
        </ul>
      </div>
    </nav>

    <!-- 主视觉区域 -->
    <section id="home" class="hero">
      <div class="hero-content">
        <h1 class="title">魔法少女小圆</h1>
        <p class="subtitle">Puella Magi Madoka Magica</p>
        <div class="hero-description">
          <p>你的愿望是什么？</p>
          <p>如果能实现任何愿望，你会希望什么？</p>
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

        <button class="cta-button">探索魔法世界</button>
      </div>
      <div class="magic-circle">
        <div class="circle-outer"></div>
        <div class="circle-inner"></div>
      </div>
    </section>

    <!-- 故事简介 -->
    <section id="story" class="story-section">
      <div class="container">
        <h2 class="section-title">故事简介</h2>
        <div class="story-content">
          <p>
            鹿目圆是一个平凡的初中二年级学生，过着普通而幸福的生活。
            某天，一只神秘的生物丘比出现在她的面前，询问她是否愿意成为魔法少女。
          </p>
          <p>
            "和我签订契约，成为魔法少女吧！"
          </p>
          <p>
            为了对抗威胁世界的魔女，她需要做出选择。
            但是，成为魔法少女的真相，远比她想象的要残酷...
          </p>
        </div>
      </div>
    </section>

    <!-- 角色介绍 -->
    <section id="characters" class="characters-section">
      <div class="container">
        <h2 class="section-title">主要角色</h2>
        <div class="characters-grid">
          <div class="character-card" v-for="character in characters" :key="character.name">
            <div class="character-icon" :style="{ background: character.color }">
              <span class="character-initial">{{ character.initial }}</span>
            </div>
            <h3>{{ character.name }}</h3>
            <p class="character-title">{{ character.title }}</p>
            <p class="character-desc">{{ character.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 作品信息 -->
    <section id="gallery" class="info-section">
      <div class="container">
        <h2 class="section-title">作品信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <h3>制作</h3>
            <p>SHAFT</p>
          </div>
          <div class="info-item">
            <h3>监督</h3>
            <p>新房昭之</p>
          </div>
          <div class="info-item">
            <h3>剧本</h3>
            <p>虚渊玄</p>
          </div>
          <div class="info-item">
            <h3>角色原案</h3>
            <p>蒼樹うめ</p>
          </div>
          <div class="info-item">
            <h3>音乐</h3>
            <p>梶浦由记</p>
          </div>
          <div class="info-item">
            <h3>放送时间</h3>
            <p>2011年1月～4月</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 名言区 -->
    <section class="quotes-section">
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
        <p>© Magica Quartet / Aniplex · Madoka Partners · MBS</p>
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

const characters = [
  {
    name: '鹿目圆',
    initial: '圆',
    title: '魔法少女',
    description: '平凡而善良的初中二年级学生，拥有成为最强魔法少女的潜质。',
    color: 'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)'
  },
  {
    name: '晓美焰',
    initial: '焰',
    title: '时间魔法',
    description: '神秘的转学生，拥有操控时间的能力，守护着小圆。',
    color: 'linear-gradient(135deg, #9370DB 0%, #8B7FB8 100%)'
  },
  {
    name: '美树沙耶加',
    initial: '沙',
    title: '剑之魔法',
    description: '小圆的好友，正义感强烈，为了拯救他人而成为魔法少女。',
    color: 'linear-gradient(135deg, #4682B4 0%, #5F9EA0 100%)'
  },
  {
    name: '巴麻美',
    initial: '麻',
    title: '前辈魔法少女',
    description: '温柔可靠的前辈魔法少女，使用枪械作战。',
    color: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
  },
  {
    name: '佐仓杏子',
    initial: '杏',
    title: '枪之魔法',
    description: '独来独往的魔法少女，经历过悲惨的过去。',
    color: 'linear-gradient(135deg, #DC143C 0%, #FF6347 100%)'
  },
  {
    name: '丘比',
    initial: 'Q',
    title: '神秘生物',
    description: '能够实现愿望的神秘生物，邀请少女们成为魔法少女。',
    color: 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)'
  }
];

const quotes = [
  {
    text: '和我签订契约，成为魔法少女吧！',
    author: '丘比'
  },
  {
    text: '我要改写宇宙的规则，让魔法少女不再有悲剧。',
    author: '鹿目圆'
  },
  {
    text: '不要忘了，永远不要忘记。相信着你的我，还有你一直相信的自己。',
    author: '晓美焰'
  },
  {
    text: '即使奇迹真的发生，也一定会有相应的代价。',
    author: '美树沙耶加'
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

.madoka-magica {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #333;
  overflow-x: hidden;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(255, 182, 193, 0.3);
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
  background: linear-gradient(135deg, #FFB6C1, #FF69B4, #FFB6C1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  color: #333;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
}

.nav-menu a:hover {
  color: #FFB6C1;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #FFB6C1;
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
  background: radial-gradient(circle at 50% 50%, rgba(255, 182, 193, 0.1), transparent 70%);
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
  background: linear-gradient(135deg, #FFB6C1, #FF69B4, #FFB6C1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 182, 193, 0.5)); }
  50% { filter: drop-shadow(0 0 30px rgba(255, 182, 193, 0.8)); }
}

.subtitle {
  font-size: 1.5rem;
  color: #DDA0DD;
  margin-bottom: 2rem;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 2;
  margin-bottom: 2rem;
  color: #666;
}

/* 模型信息横幅 */
.model-info-banner {
  margin-bottom: 2rem;
  width: 100%;
  max-width: 700px;
}

.model-info-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 182, 193, 0.4);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.2);
  transition: all 0.3s ease;
}

.model-info-card:hover {
  border-color: rgba(255, 182, 193, 0.6);
  box-shadow: 0 12px 40px rgba(255, 105, 180, 0.3);
  transform: translateY(-3px);
}

.model-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FF69B4, #FFB6C1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
}

.model-details {
  flex: 1;
  text-align: left;
}

.model-name {
  font-size: 1.3rem;
  color: #FF69B4;
  margin: 0 0 0.3rem 0;
  font-weight: bold;
}

.model-id {
  font-size: 0.9rem;
  color: #8B5A8B;
  margin: 0 0 0.5rem 0;
  font-family: 'Courier New', monospace;
}

.model-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: #666;
}

.meta-item {
  color: #666;
}

.meta-divider {
  color: rgba(255, 182, 193, 0.5);
}

.model-loading {
  margin-bottom: 2rem;
  color: #DDA0DD;
  font-style: italic;
}

.cta-button {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #FF69B4, #FFB6C1);
  border: none;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 30px rgba(255, 105, 180, 0.4);
}

.cta-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(255, 105, 180, 0.6);
}

/* 魔法阵 */
.magic-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  z-index: 0;
  opacity: 0.3;
}

.circle-outer {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid #FFB6C1;
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

.circle-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  border: 2px solid #FF69B4;
  border-radius: 50%;
  animation: rotate 15s linear infinite reverse;
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
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
  background: linear-gradient(135deg, #FFB6C1, #FF69B4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 故事简介区 */
.story-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
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
  color: #555;
}

/* 角色区域 */
.characters-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.character-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  border: 1px solid rgba(255, 182, 193, 0.3);
}

.character-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 40px rgba(255, 182, 193, 0.3);
  border-color: rgba(255, 182, 193, 0.5);
}

.character-icon {
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
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.character-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #FFB6C1;
}

.character-title {
  color: #DDA0DD;
  margin-bottom: 1rem;
  font-weight: bold;
}

.character-desc {
  color: #666;
  line-height: 1.6;
}

/* 作品信息区 */
.info-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.info-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 182, 193, 0.3);
  transition: all 0.3s;
}

.info-item:hover {
  border-color: rgba(255, 182, 193, 0.5);
  box-shadow: 0 5px 20px rgba(255, 182, 193, 0.2);
}

.info-item h3 {
  color: #FFB6C1;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-item p {
  color: #666;
  font-size: 1rem;
}

/* 名言区 */
.quotes-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 400px;
  display: flex;
  align-items: center;
}

/* 模型信息区 */
.model-info-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.model-info-wrapper {
  max-width: 1000px;
  margin: 0 auto;
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
  color: #555;
  font-style: italic;
}

.quote-author {
  font-size: 1.3rem;
  color: #FFB6C1;
}

/* 底部 */
.footer {
  background: rgba(248, 249, 250, 0.95);
  padding: 3rem 0;
  text-align: center;
}

.footer p {
  color: #666;
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

  .characters-grid {
    grid-template-columns: 1fr;
  }

  .magic-circle {
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
