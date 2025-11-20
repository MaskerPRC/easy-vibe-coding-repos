<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <div class="logo-icon">
            <div class="logo-circle"></div>
          </div>
          <span class="logo-text">玩转本站</span>
        </div>
        <nav class="nav">
          <a href="#start" class="nav-link">开始使用</a>
          <a href="#features" class="nav-link">核心功能</a>
          <a href="#tips" class="nav-link">使用技巧</a>
        </nav>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main">
      <!-- 顶部介绍区 -->
      <section class="hero">
        <div class="container">
          <h1 class="hero-title">欢迎来到我们的网站</h1>
          <p class="hero-subtitle">通过简单几步，快速了解网站的使用方法和核心功能</p>
          <div class="hero-badge">
            <span class="badge-text">简单</span>
            <span class="badge-text">高效</span>
            <span class="badge-text">有趣</span>
          </div>
        </div>
      </section>

      <!-- 引导卡片区 -->
      <section id="start" class="guide-section">
        <div class="container">
          <h2 class="section-title">快速开始</h2>
          <p class="section-subtitle">跟随这些步骤，开启您的探索之旅</p>

          <div class="card-grid">
            <div
              v-for="(step, index) in quickStartSteps"
              :key="index"
              class="guide-card"
              :class="`card-${index % 3}`"
            >
              <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="card-icon" :style="{ backgroundColor: step.color }">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path :d="step.iconPath" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="card-title">{{ step.title }}</h3>
              <p class="card-description">{{ step.description }}</p>
              <button class="card-button" @click="handleCardClick(step.title)">
                立即体验
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心功能区 -->
      <section id="features" class="features-section">
        <div class="container">
          <h2 class="section-title">核心功能</h2>
          <p class="section-subtitle">探索网站提供的强大功能</p>

          <div class="features-grid">
            <div
              v-for="(feature, index) in features"
              :key="index"
              class="feature-card"
            >
              <div class="feature-icon" :style="{ backgroundColor: feature.bgColor }">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path :d="feature.iconPath" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
              <ul class="feature-list">
                <li v-for="(item, idx) in feature.items" :key="idx">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 使用技巧区 -->
      <section id="tips" class="tips-section">
        <div class="container">
          <h2 class="section-title">使用技巧</h2>
          <p class="section-subtitle">掌握这些技巧，让你的体验更加顺畅</p>

          <div class="tips-container">
            <div
              v-for="(tip, index) in tips"
              :key="index"
              class="tip-card"
            >
              <div class="tip-header">
                <div class="tip-badge" :style="{ backgroundColor: tip.badgeColor }">
                  {{ tip.badge }}
                </div>
                <h3 class="tip-title">{{ tip.title }}</h3>
              </div>
              <p class="tip-description">{{ tip.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA区域 -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-box">
            <h2 class="cta-title">准备好开始了吗？</h2>
            <p class="cta-description">现在就开始探索，发现更多精彩内容</p>
            <button class="cta-button" @click="handleStart">
              开始探索
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4 class="footer-title">关于我们</h4>
            <p class="footer-text">致力于提供最佳的用户体验</p>
          </div>
          <div class="footer-section">
            <h4 class="footer-title">快速链接</h4>
            <a href="#start" class="footer-link">快速开始</a>
            <a href="#features" class="footer-link">核心功能</a>
            <a href="#tips" class="footer-link">使用技巧</a>
          </div>
          <div class="footer-section">
            <h4 class="footer-title">联系方式</h4>
            <p class="footer-text">邮箱: contact@example.com</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">&copy; 2025 玩转本站. 保留所有权利</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 快速开始步骤数据
const quickStartSteps = ref([
  {
    title: '注册账号',
    description: '创建您的个人账号，享受个性化服务和完整功能体验',
    color: '#3498DB',
    iconPath: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M8.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M20 8v6 M23 11h-6'
  },
  {
    title: '浏览内容',
    description: '探索丰富多样的内容资源，发现感兴趣的话题和领域',
    color: '#2ECC71',
    iconPath: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'
  },
  {
    title: '互动交流',
    description: '与其他用户互动交流，分享想法和经验，建立社交网络',
    color: '#F39C12',
    iconPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'
  },
  {
    title: '个性化设置',
    description: '根据偏好自定义界面和功能，打造专属的使用体验',
    color: '#9B59B6',
    iconPath: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'
  },
  {
    title: '收藏管理',
    description: '收藏喜爱的内容，随时查看和管理您的收藏列表',
    color: '#E74C3C',
    iconPath: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
  },
  {
    title: '分享推荐',
    description: '将精彩内容分享给好友，邀请更多人一起加入探索',
    color: '#16A085',
    iconPath: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0'
  }
]);

// 核心功能数据
const features = ref([
  {
    title: '智能推荐',
    description: '基于您的兴趣和浏览历史，为您推荐最相关的内容',
    bgColor: 'rgba(52, 152, 219, 0.1)',
    iconPath: 'M22 12h-4l-3 9L9 3l-3 9H2',
    items: ['个性化推荐算法', '实时内容更新', '精准匹配兴趣']
  },
  {
    title: '多端同步',
    description: '在不同设备间无缝同步您的数据和设置',
    bgColor: 'rgba(46, 204, 113, 0.1)',
    iconPath: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    items: ['云端数据存储', '跨设备访问', '自动同步功能']
  },
  {
    title: '安全保障',
    description: '采用先进的安全技术，全方位保护您的隐私和数据',
    bgColor: 'rgba(243, 156, 18, 0.1)',
    iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    items: ['数据加密传输', '隐私保护机制', '安全认证体系']
  }
]);

// 使用技巧数据
const tips = ref([
  {
    badge: '快捷键',
    badgeColor: '#3498DB',
    title: '使用键盘快捷键提高效率',
    description: '按 Ctrl+K 快速打开搜索，按 Ctrl+/ 查看所有快捷键列表'
  },
  {
    badge: '搜索技巧',
    badgeColor: '#2ECC71',
    title: '善用高级搜索功能',
    description: '使用引号进行精确匹配，使用减号排除关键词，提高搜索精准度'
  },
  {
    badge: '界面定制',
    badgeColor: '#F39C12',
    title: '自定义您的工作空间',
    description: '拖拽调整布局，隐藏不需要的模块，创建最适合您的界面'
  },
  {
    badge: '通知管理',
    badgeColor: '#9B59B6',
    title: '合理设置通知偏好',
    description: '在设置中选择您感兴趣的通知类型，避免信息过载'
  }
]);

// 点击卡片按钮
const handleCardClick = (title) => {
  alert(`您点击了：${title}\n\n这是一个演示功能，实际使用时可以跳转到对应的功能页面。`);
};

// 点击开始探索按钮
const handleStart = () => {
  alert('开始探索！\n\n欢迎使用本网站，祝您使用愉快！');
};
</script>

<style scoped>
/* 全局重置和基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F8F9FA;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Source Han Sans CN', 'Roboto', 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #333333;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 顶部导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  height: 64px;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3498DB, #2ECC71);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: logo-pulse 2s ease-in-out infinite;
}

.logo-circle {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
}

@keyframes logo-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  letter-spacing: 0.5px;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #666666;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #3498DB;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #3498DB;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* 主内容区 */
.main {
  margin-top: 64px;
}

/* Hero区域 */
.hero {
  background: linear-gradient(135deg, #3498DB 0%, #2ECC71 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 1px;
  animation: fadeInUp 0.8s ease-out;
}

.hero-subtitle {
  font-size: 18px;
  opacity: 0.95;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-badge {
  display: flex;
  gap: 16px;
  justify-content: center;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.badge-text {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

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

/* 通用区块样式 */
.guide-section,
.features-section,
.tips-section {
  padding: 80px 0;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #333333;
  text-align: center;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.section-subtitle {
  font-size: 16px;
  color: #666666;
  text-align: center;
  margin-bottom: 48px;
}

/* 引导卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.guide-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.guide-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-number {
  position: absolute;
  top: 24px;
  right: 24px;
  font-size: 48px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.05);
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.icon {
  width: 32px;
  height: 32px;
  color: white;
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.card-description {
  font-size: 15px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.card-button {
  background: #3498DB;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.card-button:hover {
  background: #2980B9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* 核心功能区 */
.features-section {
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.feature-card {
  padding: 32px;
  border-radius: 16px;
  background: #F8F9FA;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: #3498DB;
  transform: translateY(-4px);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-icon .icon {
  color: #3498DB;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.feature-description {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.feature-list {
  list-style: none;
}

.feature-list li {
  font-size: 14px;
  color: #666666;
  padding-left: 20px;
  position: relative;
  margin-bottom: 8px;
}

.feature-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #2ECC71;
  font-weight: bold;
}

/* 使用技巧区 */
.tips-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.tip-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #3498DB;
  transition: all 0.3s ease;
}

.tip-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.tip-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.tip-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.tip-description {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
}

/* CTA区域 */
.cta-section {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  padding: 80px 0;
}

.cta-box {
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-description {
  font-size: 18px;
  opacity: 0.95;
  margin-bottom: 32px;
}

.cta-button {
  background: white;
  color: #667EEA;
  border: none;
  padding: 16px 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 页脚 */
.footer {
  background: #2C3E50;
  color: white;
  padding: 48px 0 24px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
  margin-bottom: 32px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.footer-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #3498DB;
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.copyright {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav {
    display: none;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 28px;
  }

  .card-grid,
  .features-grid,
  .tips-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .guide-section,
  .features-section,
  .tips-section {
    padding: 48px 0;
  }

  .cta-title {
    font-size: 28px;
  }

  .cta-description {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .hero {
    padding: 48px 0;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-badge {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .guide-card {
    padding: 24px;
  }

  .card-number {
    font-size: 36px;
  }
}
</style>
