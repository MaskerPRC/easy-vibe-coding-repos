<template>
  <div class="home">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <span class="logo-bracket">&lt;</span>
          <span class="logo-text">MTBI</span>
          <span class="logo-bracket">/&gt;</span>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="main-content">
      <div class="hero-section">
        <div class="hero-badge">开发者人格测试</div>
        <h1 class="hero-title">
          发现你的
          <span class="highlight">开发人格</span>
        </h1>
        <p class="hero-subtitle">
          专为开发者打造的 MTBI 人格测试
        </p>
        <p class="hero-description">
          通过 30 道精心设计的问题，了解你在编码风格、架构思维、调试方式和技术选型上的独特倾向
        </p>

        <button class="start-button" @click="startTest">
          <span class="button-text">开始测试</span>
          <span class="button-icon">→</span>
        </button>

        <div class="stats">
          <div class="stat-item">
            <div class="stat-number">30</div>
            <div class="stat-label">精选问题</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">4</div>
            <div class="stat-label">人格维度</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">16</div>
            <div class="stat-label">人格类型</div>
          </div>
        </div>
      </div>

      <!-- 维度介绍 -->
      <div class="dimensions-section">
        <h2 class="section-title">四大开发人格维度</h2>
        <div class="dimensions-grid">
          <div class="dimension-card">
            <div class="dimension-icon">P/I</div>
            <h3 class="dimension-title">编码风格</h3>
            <div class="dimension-types">
              <span class="type-tag type-p">Pragmatic 实用主义</span>
              <span class="vs">vs</span>
              <span class="type-tag type-i">Idealist 理想主义</span>
            </div>
            <p class="dimension-desc">
              你是追求快速实现的实用派，还是注重代码质量的完美主义者?
            </p>
          </div>

          <div class="dimension-card">
            <div class="dimension-icon">M/D</div>
            <h3 class="dimension-title">架构思维</h3>
            <div class="dimension-types">
              <span class="type-tag type-m">Monolith 单体思维</span>
              <span class="vs">vs</span>
              <span class="type-tag type-d">Distributed 分布式思维</span>
            </div>
            <p class="dimension-desc">
              你喜欢简单直接的架构，还是偏好模块化和可扩展设计?
            </p>
          </div>

          <div class="dimension-card">
            <div class="dimension-icon">C/T</div>
            <h3 class="dimension-title">调试方式</h3>
            <div class="dimension-types">
              <span class="type-tag type-c">Console 控制台派</span>
              <span class="vs">vs</span>
              <span class="type-tag type-t">Tool 工具派</span>
            </div>
            <p class="dimension-desc">
              你是 console.log 的忠实用户，还是专业调试工具的拥趸?
            </p>
          </div>

          <div class="dimension-card">
            <div class="dimension-icon">S/E</div>
            <h3 class="dimension-title">技术选型</h3>
            <div class="dimension-types">
              <span class="type-tag type-s">Stable 稳定派</span>
              <span class="vs">vs</span>
              <span class="type-tag type-e">Explorer 探索派</span>
            </div>
            <p class="dimension-desc">
              你更看重技术的成熟稳定，还是喜欢尝试新兴技术?
            </p>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="footer-note">
        <p>测试大约需要 5-10 分钟，请根据你的真实想法作答</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const startTest = () => {
  router.push('/test');
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 30px;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 80px;
}

.hero-badge {
  display: inline-block;
  background: #00BCD4;
  color: #ffffff;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 30px;
  letter-spacing: 1px;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  color: #2C3E50;
  margin-bottom: 20px;
  line-height: 1.2;
}

.highlight {
  color: #00BCD4;
  position: relative;
}

.hero-subtitle {
  font-size: 24px;
  color: #34495E;
  margin-bottom: 20px;
  font-weight: 500;
}

.hero-description {
  font-size: 18px;
  color: #34495E;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.85;
}

.start-button {
  background: #00BCD4;
  color: #ffffff;
  border: none;
  padding: 18px 50px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);
}

.start-button:hover {
  background: #00ACC1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 188, 212, 0.4);
}

.start-button:active {
  transform: translateY(0);
}

.button-text {
  letter-spacing: 1px;
}

.button-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.start-button:hover .button-icon {
  transform: translateX(4px);
}

/* 统计数据 */
.stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 60px;
  padding: 30px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #00BCD4;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #34495E;
  opacity: 0.8;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #ECF0F1;
}

/* 维度介绍 */
.dimensions-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #2C3E50;
  text-align: center;
  margin-bottom: 50px;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.dimension-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.dimension-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 188, 212, 0.15);
  border-color: #00BCD4;
}

.dimension-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #00BCD4, #00ACC1);
  color: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}

.dimension-title {
  font-size: 22px;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 15px;
}

.dimension-types {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  align-items: center;
}

.type-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.type-p,
.type-m,
.type-c,
.type-s {
  background: #E3F2FD;
  color: #1976D2;
}

.type-i,
.type-d,
.type-t,
.type-e {
  background: #F3E5F5;
  color: #7B1FA2;
}

.vs {
  font-size: 12px;
  color: #34495E;
  opacity: 0.5;
  font-weight: 600;
}

.dimension-desc {
  font-size: 15px;
  color: #34495E;
  line-height: 1.6;
  opacity: 0.85;
}

/* 底部提示 */
.footer-note {
  text-align: center;
  padding: 30px;
  color: #34495E;
  opacity: 0.7;
  font-size: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 20px;
  }

  .hero-description {
    font-size: 16px;
  }

  .stats {
    flex-direction: column;
    gap: 20px;
  }

  .stat-divider {
    width: 40px;
    height: 1px;
  }

  .section-title {
    font-size: 28px;
  }

  .dimensions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
