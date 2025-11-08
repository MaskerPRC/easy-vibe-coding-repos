<template>
  <div class="haruhi-disappearance">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="container">
        <div class="logo">涼宮ハルヒの消失</div>
        <div class="nav-links">
          <a href="#story">故事</a>
          <a href="#characters">角色</a>
          <a href="#info">信息</a>
        </div>
      </div>
    </nav>

    <!-- 主视觉区域 -->
    <section class="hero">
      <div class="hero-content">
        <div class="snow-container">
          <div v-for="i in 50" :key="i" class="snowflake" :style="getSnowStyle(i)"></div>
        </div>
        <h1 class="main-title">
          <span class="title-line">涼宮ハルヒの消失</span>
          <span class="subtitle">The Disappearance of Haruhi Suzumiya</span>
        </h1>
        <p class="tagline">如果这个世界没有她，你会如何选择?</p>
        <div class="cta-buttons">
          <button class="btn btn-primary" @click="scrollToStory">了解故事</button>
          <button class="btn btn-secondary" @click="showTrailer">观看预告</button>
        </div>
      </div>
    </section>

    <!-- 故事简介 -->
    <section id="story" class="story-section">
      <div class="container">
        <h2 class="section-title">故事简介</h2>
        <div class="story-content">
          <div class="story-text">
            <p>12月18日，那个平凡的早晨，阿虚醒来却发现世界完全改变了...</p>
            <p class="highlight">涼宮春日消失了。</p>
            <p>SOS团不存在了，长门有希成为了普通的文艺少女，朝比奈实玖里不认识他，古泉一树也不在学校...</p>
            <p>在这个没有超常现象、没有外星人、没有未来人、没有超能力者，也没有涼宮春日的世界里，阿虚必须做出选择。</p>
            <p class="emphasis">是接受这个平静的世界，还是找回那个充满不可思议的日常?</p>
          </div>
          <div class="story-visual">
            <div class="quote-box">
              <p class="quote">"あなたは、誰？"</p>
              <p class="quote-author">— 长门有希</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 角色介绍 -->
    <section id="characters" class="characters-section">
      <div class="container">
        <h2 class="section-title">主要角色</h2>
        <div class="characters-grid">
          <div class="character-card" v-for="char in characters" :key="char.name">
            <div class="character-icon" :style="{ background: char.color }">
              {{ char.initial }}
            </div>
            <h3>{{ char.name }}</h3>
            <p class="character-role">{{ char.role }}</p>
            <p class="character-desc">{{ char.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 关键信息 -->
    <section id="info" class="info-section">
      <div class="container">
        <h2 class="section-title">作品信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">📅</div>
            <h3>上映时间</h3>
            <p>2010年2月6日</p>
          </div>
          <div class="info-item">
            <div class="info-icon">⏱️</div>
            <h3>片长</h3>
            <p>162分钟</p>
          </div>
          <div class="info-item">
            <div class="info-icon">🎬</div>
            <h3>导演</h3>
            <p>武本康弘 / 石原立也</p>
          </div>
          <div class="info-item">
            <div class="info-icon">🏢</div>
            <h3>制作</h3>
            <p>京都动画</p>
          </div>
          <div class="info-item">
            <div class="info-icon">✍️</div>
            <h3>原作</h3>
            <p>谷川流</p>
          </div>
          <div class="info-item">
            <div class="info-icon">⭐</div>
            <h3>评分</h3>
            <p>豆瓣 9.3 / IMDb 8.2</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色亮点 -->
    <section class="highlights-section">
      <div class="container">
        <h2 class="section-title">为什么值得一看</h2>
        <div class="highlights-grid">
          <div class="highlight-card">
            <div class="highlight-number">01</div>
            <h3>深刻的情感描写</h3>
            <p>细腻刻画阿虚的心理变化，从平静到焦虑，从犹豫到决断</p>
          </div>
          <div class="highlight-card">
            <div class="highlight-number">02</div>
            <h3>京都动画的巅峰之作</h3>
            <p>162分钟的超长篇幅，每一帧都是精心制作的艺术品</p>
          </div>
          <div class="highlight-card">
            <div class="highlight-number">03</div>
            <h3>扣人心弦的剧情</h3>
            <p>悬疑、科幻、青春、选择，多重元素完美融合</p>
          </div>
          <div class="highlight-card">
            <div class="highlight-number">04</div>
            <h3>经典的配乐</h3>
            <p>神前晓的配乐完美烘托氛围，令人难忘</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <p class="footer-text">© 2010 谷川流・伊東雑音/SOS団 © 2009, 2010 Nagaru Tanigawa・Noizi Ito/SOS Dan</p>
        <p class="footer-note">本页面仅供学习交流使用</p>
      </div>
    </footer>

    <!-- 预告片弹窗 -->
    <div v-if="showModal" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        <h3>预告片</h3>
        <p class="modal-text">这是一个演示页面，实际预告片请前往相关视频平台观看。</p>
        <p class="modal-hint">推荐搜索: "凉宫春日的消失 预告片" 或 "The Disappearance of Haruhi Suzumiya Trailer"</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);

const characters = [
  {
    name: '阿虚',
    initial: '虚',
    role: 'SOS团成员',
    description: '故事的叙述者和主角，在世界改变后必须做出选择',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    name: '涼宮春日',
    initial: '春',
    role: 'SOS团团长',
    description: '充满活力的女孩，却在某个早晨从世界上消失了',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    name: '长门有希',
    initial: '长',
    role: '文艺部成员',
    description: '安静的书虫少女，在改变的世界中成为关键人物',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    name: '朝比奈实玖里',
    initial: '朝',
    role: '未来人',
    description: '可爱温柔的学姐，在新世界中失去了记忆',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    name: '古泉一树',
    initial: '古',
    role: '超能力者',
    description: '神秘的转学生，在改变的世界中不知去向',
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  }
];

const getSnowStyle = (index) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${10 + Math.random() * 20}s`,
    opacity: Math.random() * 0.6 + 0.4
  };
};

const scrollToStory = () => {
  document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
};

const showTrailer = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
.haruhi-disappearance {
  background: #f8f9fa;
  color: #333;
  overflow-x: hidden;
}

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 500;
}

.nav-links a:hover {
  color: #667eea;
}

/* 主视觉区域 */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
  overflow: hidden;
  margin-top: 60px;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 2rem;
}

.snow-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.snowflake {
  position: absolute;
  top: -10px;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  animation: fall linear infinite;
}

@keyframes fall {
  to {
    transform: translateY(100vh);
  }
}

.main-title {
  margin-bottom: 1.5rem;
}

.title-line {
  display: block;
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  }
  to {
    text-shadow: 0 0 30px rgba(102, 126, 234, 0.8), 0 0 40px rgba(102, 126, 234, 0.6);
  }
}

.subtitle {
  display: block;
  font-size: 1.5rem;
  opacity: 0.9;
  font-weight: 300;
}

.tagline {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  font-style: italic;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #1e3c72;
  transform: translateY(-3px);
}

/* 故事简介 */
.story-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.story-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.story-text p {
  font-size: 1.2rem;
  line-height: 2;
  margin-bottom: 1.5rem;
  color: #555;
}

.story-text .highlight {
  font-size: 2rem;
  font-weight: bold;
  color: #f5576c;
  margin: 2rem 0;
}

.story-text .emphasis {
  font-size: 1.3rem;
  font-style: italic;
  color: #667eea;
  border-left: 4px solid #667eea;
  padding-left: 1.5rem;
}

.quote-box {
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
}

.quote {
  font-size: 1.5rem;
  font-style: italic;
  margin-bottom: 1rem;
  color: #333;
}

.quote-author {
  color: #666;
  font-size: 1rem;
}

/* 角色介绍 */
.characters-section {
  padding: 6rem 0;
  background: #f0f0f0;
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.character-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.character-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
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
  color: white;
}

.character-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.character-role {
  color: #667eea;
  margin-bottom: 1rem;
  font-weight: 600;
}

.character-desc {
  color: #666;
  line-height: 1.6;
}

/* 信息区域 */
.info-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.info-item:hover {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.info-item h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #667eea;
}

.info-item p {
  font-size: 1.1rem;
  color: #666;
}

/* 亮点区域 */
.highlights-section {
  padding: 6rem 0;
  background: #f0f0f0;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.highlight-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  border-left: 4px solid #667eea;
  transition: all 0.3s;
}

.highlight-card:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateX(10px);
}

.highlight-number {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  opacity: 0.3;
  margin-bottom: 1rem;
}

.highlight-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #667eea;
}

.highlight-card p {
  color: #666;
  line-height: 1.6;
}

/* 底部 */
.footer {
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem 0;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.footer-text {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.footer-note {
  color: #888;
  font-size: 0.85rem;
}

/* 弹窗 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #ffffff;
  border-radius: 20px;
  padding: 3rem;
  max-width: 500px;
  position: relative;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #333;
  font-size: 2rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-content h3 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #667eea;
}

.modal-text {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #333;
}

.modal-hint {
  color: #666;
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title-line {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .tagline {
    font-size: 1.2rem;
  }

  .story-content {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .nav-links {
    gap: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
