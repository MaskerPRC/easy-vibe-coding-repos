<template>
  <div class="bocai-page">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-container">
        <div class="logo-section">
          <div class="logo-icon">
            <span class="logo-text">博采</span>
          </div>
        </div>

        <nav class="nav-menu">
          <a href="#" class="nav-item active">首页</a>
          <a href="#" class="nav-item">资讯</a>
          <a href="#" class="nav-item">数据</a>
          <a href="#" class="nav-item">分析</a>
          <a href="#" class="nav-item">赛事</a>
          <a href="#" class="nav-item">关于我们</a>
        </nav>

        <div class="auth-buttons">
          <button class="btn-login">登录</button>
          <button class="btn-register">注册</button>
        </div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- Banner 区域 -->
      <section class="banner-section">
        <div class="banner-content">
          <h1 class="banner-title">欢迎来到博采平台</h1>
          <p class="banner-subtitle">专业的信息资讯与数据分析平台</p>
          <div class="banner-actions">
            <button class="btn-primary">立即探索</button>
            <button class="btn-secondary">了解更多</button>
          </div>
        </div>
      </section>

      <!-- 功能卡片区 -->
      <section class="features-section">
        <h2 class="section-title">核心功能</h2>
        <div class="cards-container">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="card-icon">{{ feature.icon }}</div>
            <h3 class="card-title">{{ feature.title }}</h3>
            <p class="card-description">{{ feature.description }}</p>
            <button class="card-btn">查看详情</button>
          </div>
        </div>
      </section>

      <!-- 数据展示区 -->
      <section class="data-section">
        <h2 class="section-title">实时数据</h2>
        <div class="data-grid">
          <div class="data-item" v-for="data in dataItems" :key="data.id">
            <div class="data-label">{{ data.label }}</div>
            <div class="data-value">{{ data.value }}</div>
            <div class="data-change" :class="data.trend">{{ data.change }}</div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-column">
          <h4>关于我们</h4>
          <a href="#">公司简介</a>
          <a href="#">团队介绍</a>
          <a href="#">联系我们</a>
        </div>
        <div class="footer-column">
          <h4>产品服务</h4>
          <a href="#">数据分析</a>
          <a href="#">资讯服务</a>
          <a href="#">API接口</a>
        </div>
        <div class="footer-column">
          <h4>帮助中心</h4>
          <a href="#">使用指南</a>
          <a href="#">常见问题</a>
          <a href="#">技术支持</a>
        </div>
        <div class="footer-column">
          <h4>法律条款</h4>
          <a href="#">服务协议</a>
          <a href="#">隐私政策</a>
          <a href="#">免责声明</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 博采平台. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 功能卡片数据
const features = ref([
  {
    id: 1,
    icon: '📊',
    title: '数据分析',
    description: '专业的数据统计与分析服务，为您提供深度洞察'
  },
  {
    id: 2,
    icon: '📰',
    title: '实时资讯',
    description: '第一时间获取最新资讯，掌握行业动态'
  },
  {
    id: 3,
    icon: '🎯',
    title: '精准推荐',
    description: '基于智能算法的个性化内容推荐系统'
  },
  {
    id: 4,
    icon: '🔒',
    title: '安全可靠',
    description: '企业级安全保障，保护您的数据隐私'
  }
]);

// 数据展示
const dataItems = ref([
  {
    id: 1,
    label: '今日访问',
    value: '128,456',
    change: '+12.5%',
    trend: 'up'
  },
  {
    id: 2,
    label: '活跃用户',
    value: '45,892',
    change: '+8.3%',
    trend: 'up'
  },
  {
    id: 3,
    label: '数据更新',
    value: '2,341',
    change: '-3.2%',
    trend: 'down'
  },
  {
    id: 4,
    label: '系统稳定',
    value: '99.9%',
    change: '+0.1%',
    trend: 'up'
  }
]);
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.bocai-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #0f1419 100%);
  color: #ffffff;
}

/* ========== 头部导航 ========== */
.header {
  background: linear-gradient(90deg, #1a1f3a 0%, #0f1824 100%);
  border-bottom: 2px solid #d4af37;
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-icon {
  background: linear-gradient(135deg, #d4af37 0%, #f4e5c3 50%, #d4af37 100%);
  padding: 10px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.nav-menu {
  display: flex;
  gap: 35px;
  align-items: center;
}

.nav-item {
  color: #c0c5d0;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 15px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}

.nav-item.active {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.15);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -17px;
  left: 0;
  right: 0;
  height: 2px;
  background: #d4af37;
}

.auth-buttons {
  display: flex;
  gap: 15px;
}

.btn-login {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
  padding: 10px 25px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
}

.btn-register {
  background: linear-gradient(135deg, #d4af37 0%, #f4e5c3 50%, #d4af37 100%);
  color: #0a0e27;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
}

/* ========== 主要内容区 ========== */
.main-content {
  flex: 1;
}

/* Banner 区域 */
.banner-section {
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1824 100%);
  padding: 100px 30px;
  text-align: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  position: relative;
  overflow: hidden;
}

.banner-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.banner-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.banner-title {
  font-size: 52px;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #d4af37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
}

.banner-subtitle {
  font-size: 20px;
  color: #a8adb8;
  margin-bottom: 40px;
  line-height: 1.6;
}

.banner-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #d4af37 0%, #f4e5c3 50%, #d4af37 100%);
  color: #0a0e27;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
}

.btn-secondary {
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.2);
}

/* 功能卡片区 */
.features-section {
  padding: 80px 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 50px;
  color: #d4af37;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1824 100%);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 15px;
  padding: 35px 25px;
  text-align: center;
  transition: all 0.4s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
  transition: left 0.6s ease;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: #d4af37;
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
}

.card-icon {
  font-size: 50px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #ffffff;
}

.card-description {
  font-size: 14px;
  color: #a8adb8;
  line-height: 1.7;
  margin-bottom: 25px;
}

.card-btn {
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 10px 25px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-btn:hover {
  background: #d4af37;
  color: #0a0e27;
  transform: scale(1.05);
}

/* 数据展示区 */
.data-section {
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1824 100%);
  padding: 80px 30px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.data-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.data-item {
  background: rgba(15, 20, 36, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  padding: 30px 25px;
  text-align: center;
  transition: all 0.3s ease;
}

.data-item:hover {
  border-color: #d4af37;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.2);
  transform: translateY(-5px);
}

.data-label {
  font-size: 14px;
  color: #a8adb8;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.data-value {
  font-size: 36px;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 10px;
}

.data-change {
  font-size: 14px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 15px;
  display: inline-block;
}

.data-change.up {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
}

.data-change.down {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
}

/* ========== 页脚 ========== */
.footer {
  background: linear-gradient(90deg, #0f1419 0%, #1a1f3a 100%);
  border-top: 2px solid #d4af37;
  padding: 60px 30px 30px;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.footer-column h4 {
  font-size: 16px;
  font-weight: 700;
  color: #d4af37;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-column a {
  color: #a8adb8;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  padding-left: 5px;
}

.footer-column a:hover {
  color: #d4af37;
  padding-left: 10px;
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.footer-bottom p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .nav-menu {
    gap: 20px;
  }

  .banner-title {
    font-size: 40px;
  }

  .banner-subtitle {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 20px;
  }

  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
  }

  .nav-item.active::after {
    display: none;
  }

  .banner-section {
    padding: 60px 20px;
  }

  .banner-title {
    font-size: 32px;
  }

  .banner-subtitle {
    font-size: 16px;
  }

  .banner-actions {
    flex-direction: column;
    gap: 15px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .features-section,
  .data-section {
    padding: 50px 20px;
  }

  .section-title {
    font-size: 28px;
  }

  .cards-container {
    grid-template-columns: 1fr;
  }

  .data-grid {
    grid-template-columns: 1fr;
  }
}
</style>

