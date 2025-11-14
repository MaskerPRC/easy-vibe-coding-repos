<template>
  <div class="app">
    <!-- 头部导航 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">{ }</span>
          <span class="logo-text">程序员社交技能提升指南</span>
        </div>
        <nav class="nav">
          <a href="#intro" class="nav-link">简介</a>
          <a href="#problems" class="nav-link">核心问题</a>
          <a href="#solutions" class="nav-link">解决方案</a>
        </nav>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- 英雄区域 -->
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">从代码到人际的完美转型</h1>
          <p class="hero-subtitle">提升社交技能，不仅仅是为了更好的职业发展，更是为了更丰富的人生体验</p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">75%</div>
              <div class="stat-label">程序员感到社交困难</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">3个月</div>
              <div class="stat-label">平均提升周期</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">可培养的技能</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 社交困境分析 -->
      <section id="intro" class="section">
        <div class="section-content">
          <div class="section-header">
            <h2 class="section-title">社交困境的根源与破局点</h2>
            <p class="section-description">
              程序员长期面对电脑，社交能力弱化是普遍现象，但不必焦虑。
              <strong>这是可培养的技能，而非天生特质。</strong>
            </p>
          </div>

          <div class="insight-card">
            <div class="insight-icon">💡</div>
            <div class="insight-content">
              <h3 class="insight-title">关键洞察</h3>
              <p class="insight-text">
                社交能力就像编程技能一样，都是通过学习和实践不断提升的。
                你已经掌握了复杂的编程逻辑，同样也能掌握人际交往的规律。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心问题 -->
      <section id="problems" class="section section-alt">
        <div class="section-content">
          <div class="section-header">
            <h2 class="section-title">核心问题分析</h2>
            <p class="section-description">
              理解问题的本质，是解决问题的第一步
            </p>
          </div>

          <div class="problems-grid">
            <div class="problem-card">
              <div class="problem-header">
                <div class="problem-icon">🧠</div>
                <h3 class="problem-title">思维模式差异</h3>
              </div>
              <p class="problem-description">
                过度依赖逻辑思维，缺乏情感共鸣训练。长期与代码打交道，
                习惯了精确的逻辑推理，却忽略了人际交往中的情感因素。
              </p>
              <div class="problem-tags">
                <span class="tag">逻辑思维</span>
                <span class="tag">情感缺失</span>
              </div>
            </div>

            <div class="problem-card">
              <div class="problem-header">
                <div class="problem-icon">🔧</div>
                <h3 class="problem-title">沟通模式偏差</h3>
              </div>
              <p class="problem-description">
                习惯"解决问题"而非"维持关系"的沟通模式。在对话中总想着
                提供解决方案，而忽略了倾听和理解对方的需求。
              </p>
              <div class="problem-tags">
                <span class="tag">解决导向</span>
                <span class="tag">倾听不足</span>
              </div>
            </div>

            <div class="problem-card">
              <div class="problem-header">
                <div class="problem-icon">😰</div>
                <h3 class="problem-title">环境适应困难</h3>
              </div>
              <p class="problem-description">
                对非结构化社交感到不适。与代码的确定性不同，社交场合充满了
                不确定性和随机性，这让习惯了规则的程序员感到不安。
              </p>
              <div class="problem-tags">
                <span class="tag">结构化思维</span>
                <span class="tag">不确定性</span>
              </div>
            </div>

            <div class="problem-card">
              <div class="problem-header">
                <div class="problem-icon">🏢</div>
                <h3 class="problem-title">社交圈狭窄</h3>
              </div>
              <p class="problem-description">
                职场环境单一，社交圈狭窄。长期在技术圈内活动，缺乏与不同
                背景人群交流的机会，导致社交技能得不到锻炼。
              </p>
              <div class="problem-tags">
                <span class="tag">环境单一</span>
                <span class="tag">机会缺乏</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 解决方案预告 -->
      <section id="solutions" class="section">
        <div class="section-content">
          <div class="section-header">
            <h2 class="section-title">提升路径</h2>
            <p class="section-description">
              系统化的提升方案，帮助你逐步建立社交自信
            </p>
          </div>

          <div class="roadmap">
            <div class="roadmap-item" v-for="(step, index) in roadmapSteps" :key="index">
              <div class="roadmap-number">{{ index + 1 }}</div>
              <div class="roadmap-content">
                <h3 class="roadmap-title">{{ step.title }}</h3>
                <p class="roadmap-description">{{ step.description }}</p>
              </div>
            </div>
          </div>

          <div class="cta-section">
            <h3 class="cta-title">准备好开始你的社交技能提升之旅了吗？</h3>
            <p class="cta-text">
              记住：每一个社交高手都是从零开始的，你的代码能力已经证明了你的学习能力，
              社交技能同样可以通过学习和实践来掌握。
            </p>
            <button class="cta-button">开始学习</button>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">
          社交能力提升是一个持续的过程，保持耐心，持续实践
        </p>
        <p class="footer-copyright">
          © 2024 程序员社交技能提升指南
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 提升路径数据
const roadmapSteps = ref([
  {
    title: '自我认知',
    description: '了解自己的社交模式和习惯，识别需要改进的地方'
  },
  {
    title: '理论学习',
    description: '学习基本的社交技巧和沟通原理，建立理论框架'
  },
  {
    title: '刻意练习',
    description: '在安全的环境中练习新技能，逐步建立肌肉记忆'
  },
  {
    title: '实战应用',
    description: '将所学应用到真实场景中，在实践中不断调整优化'
  },
  {
    title: '持续反思',
    description: '定期回顾和总结，形成自己的社交风格和方法论'
  }
]);
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F8F9FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #333333;
}

/* 头部导航 */
.header {
  position: sticky;
  top: 0;
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 24px;
  color: #4A90E2;
  font-weight: bold;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #666666;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #4A90E2;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #4A90E2;
}

.nav-link:hover::after {
  width: 100%;
}

/* 主要内容区 */
.main-content {
  width: 100%;
}

/* 英雄区域 */
.hero {
  background: linear-gradient(135deg, #4A90E2 0%, #50E3C2 100%);
  color: #FFFFFF;
  padding: 80px 40px;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 20px;
  margin-bottom: 60px;
  opacity: 0.95;
  line-height: 1.6;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

/* 章节样式 */
.section {
  padding: 80px 40px;
}

.section-alt {
  background: #FFFFFF;
}

.section-content {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 16px;
}

.section-description {
  font-size: 18px;
  color: #666666;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

/* 洞察卡片 */
.insight-card {
  background: #FFFFFF;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.insight-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.insight-text {
  font-size: 16px;
  color: #666666;
  line-height: 1.8;
}

/* 问题网格 */
.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.problem-card {
  background: #FFFFFF;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.problem-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.15);
  border-color: #4A90E2;
}

.problem-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.problem-icon {
  font-size: 32px;
}

.problem-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
}

.problem-description {
  font-size: 15px;
  color: #666666;
  line-height: 1.7;
  margin-bottom: 20px;
}

.problem-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  background: #F8F9FA;
  color: #4A90E2;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

/* 路线图 */
.roadmap {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 800px;
  margin: 0 auto 60px;
}

.roadmap-item {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  position: relative;
}

.roadmap-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 23px;
  top: 56px;
  width: 2px;
  height: calc(100% + 32px);
  background: linear-gradient(to bottom, #4A90E2, #50E3C2);
  opacity: 0.3;
}

.roadmap-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4A90E2, #50E3C2);
  color: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.roadmap-content {
  flex: 1;
  background: #FFFFFF;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.roadmap-content:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 20px rgba(74, 144, 226, 0.15);
}

.roadmap-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.roadmap-description {
  font-size: 15px;
  color: #666666;
  line-height: 1.6;
}

/* CTA区域 */
.cta-section {
  text-align: center;
  background: linear-gradient(135deg, #4A90E2 0%, #50E3C2 100%);
  padding: 60px 40px;
  border-radius: 20px;
  color: #FFFFFF;
}

.cta-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-text {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 32px;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  background: #FFFFFF;
  color: #4A90E2;
  padding: 16px 48px;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.cta-button:active {
  transform: translateY(0);
}

/* 页脚 */
.footer {
  background: #333333;
  color: #FFFFFF;
  padding: 40px 40px;
  text-align: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-text {
  font-size: 16px;
  margin-bottom: 12px;
  opacity: 0.9;
}

.footer-copyright {
  font-size: 14px;
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    padding: 16px 20px;
  }

  .nav {
    gap: 20px;
  }

  .nav-link {
    font-size: 14px;
  }

  .hero {
    padding: 60px 20px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
    margin-bottom: 40px;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .section {
    padding: 60px 20px;
  }

  .section-title {
    font-size: 28px;
  }

  .section-description {
    font-size: 16px;
  }

  .insight-card {
    flex-direction: column;
    padding: 24px;
  }

  .problems-grid {
    grid-template-columns: 1fr;
  }

  .roadmap-item {
    gap: 16px;
  }

  .roadmap-number {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .roadmap-item:not(:last-child)::before {
    left: 19px;
    top: 48px;
  }

  .cta-section {
    padding: 40px 24px;
  }

  .cta-title {
    font-size: 22px;
  }

  .cta-text {
    font-size: 15px;
  }

  .cta-button {
    padding: 14px 36px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 14px;
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-label {
    font-size: 12px;
  }

  .section-title {
    font-size: 24px;
  }

  .section-description {
    font-size: 14px;
  }

  .problem-card {
    padding: 24px;
  }

  .cta-title {
    font-size: 20px;
  }
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>
