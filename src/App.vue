<template>
  <div class="app">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <div class="logo-icon">
            <div class="logo-dot"></div>
          </div>
          <span class="logo-text">探索站</span>
        </div>
        <nav class="nav">
          <a href="#about" class="nav-link">关于我们</a>
          <a href="#features" class="nav-link">核心功能</a>
          <a href="#team" class="nav-link">团队成员</a>
          <a href="#contact" class="nav-link">联系方式</a>
        </nav>
      </div>
    </header>

    <!-- 主横幅区域 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">探索站 - 发现无限可能</h1>
          <p class="hero-subtitle">一个专注于知识分享、技术探索与创新交流的现代化平台</p>
          <div class="hero-actions">
            <button class="btn btn-primary">开始探索</button>
            <button class="btn btn-outline">了解更多</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section id="about" class="section section-light">
      <div class="container">
        <h2 class="section-title">关于本站</h2>
        <div class="about-content">
          <div class="about-card">
            <div class="about-icon">🎯</div>
            <h3 class="about-card-title">我们的使命</h3>
            <p class="about-card-text">致力于打造一个开放、包容的知识分享平台，让每个人都能找到属于自己的学习路径，实现个人成长与价值创造。</p>
          </div>
          <div class="about-card">
            <div class="about-icon">💡</div>
            <h3 class="about-card-title">我们的愿景</h3>
            <p class="about-card-text">成为全球领先的知识探索社区，连接世界各地的学习者和创作者，构建一个充满活力的智慧生态系统。</p>
          </div>
          <div class="about-card">
            <div class="about-icon">🚀</div>
            <h3 class="about-card-title">我们的价值观</h3>
            <p class="about-card-text">秉持开放、创新、协作的核心价值观，鼓励探索精神，推动知识共享，助力每个人发挥潜能。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section id="features" class="section">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <p class="section-subtitle">为您提供全方位的学习与交流体验</p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon primary">📚</div>
            <h3 class="feature-title">知识库</h3>
            <p class="feature-text">海量优质内容，涵盖技术、设计、商业等多个领域，助您快速获取所需知识。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon success">🎨</div>
            <h3 class="feature-title">创作工具</h3>
            <p class="feature-text">强大的在线编辑器，支持多种格式，让您的创作更加高效便捷。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon primary">👥</div>
            <h3 class="feature-title">社区交流</h3>
            <p class="feature-text">与志同道合的伙伴交流互动，分享经验，共同成长。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon success">📊</div>
            <h3 class="feature-title">学习分析</h3>
            <p class="feature-text">智能追踪学习进度，提供个性化推荐，帮助您更好地规划学习路径。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon primary">🔍</div>
            <h3 class="feature-title">智能搜索</h3>
            <p class="feature-text">先进的搜索算法，快速定位您需要的内容，节省宝贵时间。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon success">🎓</div>
            <h3 class="feature-title">在线课程</h3>
            <p class="feature-text">精心设计的系统化课程，由行业专家授课，助您系统掌握专业技能。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 团队成员 -->
    <section id="team" class="section section-light">
      <div class="container">
        <h2 class="section-title">团队成员</h2>
        <p class="section-subtitle">我们是一群充满热情的创造者</p>
        <div class="team-grid">
          <div class="team-card">
            <div class="team-avatar">👨‍💻</div>
            <h3 class="team-name">张明</h3>
            <p class="team-role">创始人 & CEO</p>
            <p class="team-bio">10年互联网产品经验，致力于打造极致用户体验</p>
          </div>
          <div class="team-card">
            <div class="team-avatar">👩‍💼</div>
            <h3 class="team-name">李娜</h3>
            <p class="team-role">首席技术官</p>
            <p class="team-bio">全栈工程师，热衷于技术创新与架构设计</p>
          </div>
          <div class="team-card">
            <div class="team-avatar">👨‍🎨</div>
            <h3 class="team-name">王强</h3>
            <p class="team-role">设计总监</p>
            <p class="team-bio">追求完美的视觉设计师，擅长创造令人愉悦的界面</p>
          </div>
          <div class="team-card">
            <div class="team-avatar">👩‍🏫</div>
            <h3 class="team-name">赵丽</h3>
            <p class="team-role">内容负责人</p>
            <p class="team-bio">资深编辑，专注于优质内容的策划与生产</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">10,000+</div>
            <div class="stat-label">注册用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">5,000+</div>
            <div class="stat-label">优质内容</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50+</div>
            <div class="stat-label">精品课程</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">98%</div>
            <div class="stat-label">用户满意度</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系方式 -->
    <section id="contact" class="section section-light">
      <div class="container">
        <h2 class="section-title">联系我们</h2>
        <p class="section-subtitle">我们期待听到您的声音</p>
        <div class="contact-content">
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">📧</div>
              <div class="contact-details">
                <h4 class="contact-label">邮箱</h4>
                <p class="contact-value">contact@exploreweb.com</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">📱</div>
              <div class="contact-details">
                <h4 class="contact-label">电话</h4>
                <p class="contact-value">+86 138 0000 0000</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">📍</div>
              <div class="contact-details">
                <h4 class="contact-label">地址</h4>
                <p class="contact-value">中国 · 北京 · 朝阳区</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">⏰</div>
              <div class="contact-details">
                <h4 class="contact-label">工作时间</h4>
                <p class="contact-value">周一至周五 9:00 - 18:00</p>
              </div>
            </div>
          </div>
          <div class="contact-form">
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label class="form-label">姓名</label>
                <input type="text" class="form-input" placeholder="请输入您的姓名" v-model="formData.name">
              </div>
              <div class="form-group">
                <label class="form-label">邮箱</label>
                <input type="email" class="form-input" placeholder="请输入您的邮箱" v-model="formData.email">
              </div>
              <div class="form-group">
                <label class="form-label">留言</label>
                <textarea class="form-textarea" rows="4" placeholder="请输入您的留言" v-model="formData.message"></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-block">发送留言</button>
            </form>
            <div v-if="submitMessage" class="submit-message" :class="submitStatus">
              {{ submitMessage }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4 class="footer-title">探索站</h4>
            <p class="footer-text">发现无限可能，共创美好未来</p>
          </div>
          <div class="footer-section">
            <h4 class="footer-title">快速链接</h4>
            <a href="#about" class="footer-link">关于我们</a>
            <a href="#features" class="footer-link">核心功能</a>
            <a href="#team" class="footer-link">团队成员</a>
          </div>
          <div class="footer-section">
            <h4 class="footer-title">关注我们</h4>
            <div class="social-links">
              <span class="social-icon">📘</span>
              <span class="social-icon">🐦</span>
              <span class="social-icon">📷</span>
              <span class="social-icon">💼</span>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">© 2025 探索站. 保留所有权利</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 表单数据（使用内存存储）
const formData = ref({
  name: '',
  email: '',
  message: ''
});

const submitMessage = ref('');
const submitStatus = ref('');

// 处理表单提交
const handleSubmit = () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    submitMessage.value = '请填写所有必填项';
    submitStatus.value = 'error';
    setTimeout(() => {
      submitMessage.value = '';
    }, 3000);
    return;
  }

  // 模拟提交成功（数据存储在内存中）
  submitMessage.value = '感谢您的留言!我们会尽快回复您。';
  submitStatus.value = 'success';

  // 清空表单
  formData.value = {
    name: '',
    email: '',
    message: ''
  };

  setTimeout(() => {
    submitMessage.value = '';
  }, 3000);
};
</script>

<style scoped>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器 */
.app {
  min-height: 100vh;
  background: #F8F8F8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #333333;
  line-height: 1.6;
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 顶部导航 */
.header {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo-dot {
  width: 12px;
  height: 12px;
  background: #ffffff;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #7F8C8D;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 8px 0;
  position: relative;
}

.nav-link:hover {
  color: #3498DB;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #3498DB;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* 主横幅 */
.hero {
  background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%);
  color: #ffffff;
  padding: 80px 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.95;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 按钮 */
.btn {
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #ffffff;
  color: #3498DB;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  background: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;
}

.btn-outline:hover {
  background: #ffffff;
  color: #3498DB;
}

.btn-block {
  width: 100%;
}

/* 区块 */
.section {
  padding: 80px 0;
}

.section-light {
  background: #ffffff;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  color: #333333;
}

.section-subtitle {
  font-size: 18px;
  text-align: center;
  color: #7F8C8D;
  margin-bottom: 48px;
}

/* 关于我们 */
.about-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

.about-card {
  background: #F8F8F8;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.about-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.about-card-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333333;
}

.about-card-text {
  font-size: 15px;
  color: #7F8C8D;
  line-height: 1.7;
}

/* 功能特点 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 48px;
}

.feature-card {
  background: #ffffff;
  padding: 32px;
  border-radius: 12px;
  border: 1px solid #E8E8E8;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(52, 152, 219, 0.12);
  border-color: #3498DB;
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 24px;
}

.feature-icon.primary {
  background: rgba(52, 152, 219, 0.1);
}

.feature-icon.success {
  background: rgba(46, 204, 113, 0.1);
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333333;
}

.feature-text {
  font-size: 15px;
  color: #7F8C8D;
  line-height: 1.7;
}

/* 团队成员 */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

.team-card {
  background: #F8F8F8;
  padding: 32px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease;
}

.team-card:hover {
  transform: translateY(-4px);
}

.team-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498DB 0%, #2ECC71 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 0 auto 24px;
}

.team-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333333;
}

.team-role {
  font-size: 15px;
  color: #3498DB;
  margin-bottom: 16px;
  font-weight: 500;
}

.team-bio {
  font-size: 14px;
  color: #7F8C8D;
  line-height: 1.6;
}

/* 统计数据 */
.stats-section {
  background: linear-gradient(135deg, #3498DB 0%, #2ECC71 100%);
  padding: 64px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.stat-item {
  text-align: center;
  color: #ffffff;
}

.stat-number {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  opacity: 0.9;
}

/* 联系方式 */
.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-top: 48px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.contact-icon {
  width: 48px;
  height: 48px;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.contact-details {
  flex: 1;
}

.contact-label {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 4px;
}

.contact-value {
  font-size: 15px;
  color: #7F8C8D;
}

/* 表单 */
.contact-form {
  background: #F8F8F8;
  padding: 32px;
  border-radius: 12px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E8E8E8;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.3s ease;
  background: #ffffff;
  color: #333333;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498DB;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-message {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

.submit-message.success {
  background: rgba(46, 204, 113, 0.1);
  color: #2ECC71;
  border: 1px solid #2ECC71;
}

.submit-message.error {
  background: rgba(231, 76, 60, 0.1);
  color: #E74C3C;
  border: 1px solid #E74C3C;
}

/* 页脚 */
.footer {
  background: #2C3E50;
  color: #ffffff;
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
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.footer-text {
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.6;
}

.footer-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.footer-link:hover {
  opacity: 1;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
  text-align: center;
}

.copyright {
  font-size: 14px;
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 16px;
  }

  .nav {
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
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

  .contact-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .features-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 48px 0;
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .section {
    padding: 48px 0;
  }

  .section-title {
    font-size: 24px;
  }

  .btn {
    padding: 12px 24px;
    font-size: 14px;
  }

  .stat-number {
    font-size: 36px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
