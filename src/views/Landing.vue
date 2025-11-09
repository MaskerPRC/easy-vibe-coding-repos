<template>
  <div class="landing-page">
    <!-- 导航栏 -->
    <header class="header">
      <div class="container">
        <nav class="nav">
          <div class="logo">
            <span class="logo-icon">🚀</span>
            <span class="logo-text">MyApp</span>
          </div>
          <ul class="nav-menu">
            <li><a href="#features">功能特性</a></li>
            <li><a href="#about">关于我们</a></li>
            <li><a href="#contact">联系方式</a></li>
          </ul>
          <button class="btn-primary">开始使用</button>
        </nav>
      </div>
    </header>

    <!-- 英雄区 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            欢迎来到
            <span class="gradient-text">未来应用</span>
          </h1>
          <p class="hero-subtitle">
            打造卓越体验，赋能无限可能。我们为您提供最先进的解决方案，助力您的业务快速增长。
          </p>
          <div class="hero-buttons">
            <button class="btn-primary btn-large">立即开始</button>
            <button class="btn-secondary btn-large">了解更多</button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">10K+</div>
              <div class="stat-label">活跃用户</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">98%</div>
              <div class="stat-label">满意度</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">全天候支持</div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </section>

    <!-- 功能特性区 -->
    <section id="features" class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">核心功能特性</h2>
          <p class="section-subtitle">为您提供全方位的优质服务体验</p>
        </div>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.id" class="feature-card" :class="{ clickable: feature.link }" @click="handleFeatureClick(feature)">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div v-if="feature.link" class="feature-badge">点击体验</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于区 -->
    <section id="about" class="about">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2 class="section-title">关于我们</h2>
            <p class="about-description">
              我们致力于为用户提供最优质的产品和服务。凭借多年的行业经验和技术积累，
              我们不断创新，追求卓越，为客户创造价值。
            </p>
            <p class="about-description">
              团队由经验丰富的专业人士组成，我们相信技术的力量能够改变世界，
              让生活变得更加美好。
            </p>
            <ul class="about-list">
              <li>✓ 专业的技术团队</li>
              <li>✓ 完善的服务体系</li>
              <li>✓ 持续的产品创新</li>
              <li>✓ 用户至上的理念</li>
            </ul>
          </div>
          <div class="about-image">
            <div class="image-placeholder">
              <div class="placeholder-icon">📊</div>
              <p>数据驱动决策</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系区 -->
    <section id="contact" class="contact">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">联系我们</h2>
          <p class="section-subtitle">我们随时准备为您提供帮助</p>
        </div>
        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-content">
                <h4>邮箱地址</h4>
                <p>contact@example.com</p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">📱</div>
              <div class="info-content">
                <h4>联系电话</h4>
                <p>400-123-4567</p>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">📍</div>
              <div class="info-content">
                <h4>公司地址</h4>
                <p>北京市朝阳区科技园</p>
              </div>
            </div>
          </div>
          <div class="contact-form">
            <form @submit.prevent="handleSubmit">
              <input
                v-model="form.name"
                type="text"
                placeholder="您的姓名"
                class="form-input"
                required
              />
              <input
                v-model="form.email"
                type="email"
                placeholder="您的邮箱"
                class="form-input"
                required
              />
              <textarea
                v-model="form.message"
                placeholder="留言内容"
                class="form-textarea"
                rows="4"
                required
              ></textarea>
              <button type="submit" class="btn-primary btn-block">发送消息</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>关于我们</h4>
            <p>致力于打造最优质的产品和服务</p>
          </div>
          <div class="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><a href="#features">功能特性</a></li>
              <li><a href="#about">关于我们</a></li>
              <li><a href="#contact">联系方式</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>关注我们</h4>
            <div class="social-links">
              <a href="#" class="social-link">微信</a>
              <a href="#" class="social-link">微博</a>
              <a href="#" class="social-link">GitHub</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 MyApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const features = ref([
  {
    id: 1,
    icon: '⚡',
    title: '极速体验',
    description: '采用最新技术栈，确保应用运行流畅，响应迅速，给用户带来卓越体验。'
  },
  {
    id: 2,
    icon: '🔒',
    title: '安全可靠',
    description: '企业级安全保障，数据加密传输，保护您的隐私和信息安全。'
  },
  {
    id: 3,
    icon: '📱',
    title: '多端适配',
    description: '完美支持各种设备和屏幕尺寸，随时随地都能获得最佳体验。'
  },
  {
    id: 4,
    icon: '🎨',
    title: '精美设计',
    description: '现代化的界面设计，注重用户体验，每个细节都经过精心打磨。'
  },
  {
    id: 5,
    icon: '💰',
    title: '恭喜发财',
    description: '点击抽奖转盘，开启您的财富之旅，招财进宝，财运亨通！',
    link: '/fortune'
  },
  {
    id: 6,
    icon: '🚀',
    title: '持续更新',
    description: '不断优化和迭代，定期推出新功能，始终保持产品竞争力。'
  },
  {
    id: 7,
    icon: '💬',
    title: '专业支持',
    description: '7×24小时在线客服，专业团队随时为您解决各种问题。'
  }
]);

const handleFeatureClick = (feature) => {
  if (feature.link) {
    router.push(feature.link);
  }
};

const form = ref({
  name: '',
  email: '',
  message: ''
});

const handleSubmit = () => {
  console.log('表单提交:', form.value);
  alert('感谢您的留言，我们会尽快与您联系！');
  // 重置表单
  form.value = {
    name: '',
    email: '',
    message: ''
  };
};
</script>

<style scoped>
.landing-page {
  width: 100%;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 导航栏 */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.logo-icon {
  font-size: 2rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #4F46E5;
}

/* 按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn-block {
  width: 100%;
}

/* 英雄区 */
.hero {
  position: relative;
  padding: 8rem 0 6rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.hero-stats {
  display: flex;
  gap: 4rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stat-label {
  opacity: 0.9;
  font-size: 1rem;
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -50px;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 10%;
}

/* 功能特性区 */
.features {
  padding: 6rem 0;
  background: #f9fafb;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.feature-card.clickable {
  cursor: pointer;
  background: linear-gradient(135deg, #fff9e6 0%, #ffe6cc 100%);
  border: 2px solid #ffd700;
}

.feature-card.clickable:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 30px rgba(255, 215, 0, 0.3);
}

.feature-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffd700 100%);
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
}

/* 关于区 */
.about {
  padding: 6rem 0;
  background: white;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-description {
  color: #6b7280;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.about-list {
  list-style: none;
  margin-top: 2rem;
}

.about-list li {
  padding: 0.75rem 0;
  color: #1f2937;
  font-size: 1.1rem;
}

.about-image {
  height: 400px;
}

.image-placeholder {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.placeholder-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.image-placeholder p {
  font-size: 1.5rem;
  font-weight: 600;
}

/* 联系区 */
.contact {
  padding: 6rem 0;
  background: #f9fafb;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-item {
  display: flex;
  gap: 1.5rem;
  align-items: start;
}

.info-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.info-content h4 {
  color: #1f2937;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.info-content p {
  color: #6b7280;
}

.contact-form {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

/* 页脚 */
.footer {
  background: #1f2937;
  color: white;
  padding: 3rem 0 1.5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.footer-section p {
  color: #9ca3af;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.75rem;
}

.footer-section ul li a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #9ca3af;
  text-decoration: none;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  transition: all 0.3s;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #9ca3af;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-stats {
    gap: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .about-content {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>
