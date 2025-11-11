<template>
  <div class="app">
    <div class="container">
      <!-- 页面标题 -->
      <header class="header">
        <h1 class="main-title">这是什么？</h1>
        <p class="subtitle">探索我们的全栈应用平台</p>
      </header>

      <!-- 主要内容卡片 -->
      <div class="card-grid">
        <!-- 项目介绍卡片 -->
        <div class="card card-highlight">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="card-title">现代化全栈应用</h2>
          <p class="card-description">
            这是一个基于 Vue 3 和 Express 构建的现代化全栈 Web 应用平台。
            采用前后端分离架构，为您提供快速、灵活、可扩展的开发体验。
          </p>
        </div>

        <!-- 技术栈卡片 -->
        <div class="card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">前端技术</h3>
          <div class="tech-list">
            <span class="tech-tag">Vue 3</span>
            <span class="tech-tag">Vite</span>
            <span class="tech-tag">Vue Router</span>
            <span class="tech-tag">Axios</span>
          </div>
          <p class="card-description">
            使用最新的 Vue 3 组合式 API，配合 Vite 超快的开发体验，
            打造响应式、高性能的用户界面。
          </p>
        </div>

        <!-- 后端技术卡片 -->
        <div class="card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">后端技术</h3>
          <div class="tech-list">
            <span class="tech-tag">Express</span>
            <span class="tech-tag">Node.js</span>
            <span class="tech-tag">CORS</span>
            <span class="tech-tag">REST API</span>
          </div>
          <p class="card-description">
            基于 Express 框架构建的 RESTful API 服务，
            提供高效、可靠的后端支持。
          </p>
        </div>

        <!-- 核心特性卡片 -->
        <div class="card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="card-title">开发效率</h3>
          <ul class="feature-list">
            <li>热模块替换 (HMR)</li>
            <li>自动重启服务</li>
            <li>并发开发模式</li>
            <li>快速构建打包</li>
          </ul>
        </div>

        <!-- 架构特点卡片 -->
        <div class="card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h3 class="card-title">架构优势</h3>
          <ul class="feature-list">
            <li>前后端分离</li>
            <li>组件化设计</li>
            <li>响应式布局</li>
            <li>可扩展架构</li>
          </ul>
        </div>

        <!-- 部署方式卡片 -->
        <div class="card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">部署环境</h3>
          <ul class="feature-list">
            <li>内存数据存储</li>
            <li>无服务器友好</li>
            <li>快速启动</li>
            <li>轻量级设计</li>
          </ul>
        </div>
      </div>

      <!-- 底部信息 -->
      <footer class="footer">
        <div class="footer-content">
          <p class="footer-text">基于现代化技术栈构建的全栈应用平台</p>
          <p class="footer-hint">端口配置：前端 5173 | 后端 3002</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
// 项目介绍页面 - 纯展示组件
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
  background-color: #F0F2F5;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 32px 16px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面头部 */
.header {
  text-align: center;
  margin-bottom: 48px;
  animation: fadeInDown 0.6s ease-out;
}

.main-title {
  font-size: 36px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 18px;
  font-weight: 400;
  color: #666666;
  line-height: 1.6;
}

/* 卡片网格布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

/* 卡片样式 */
.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 32px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }
.card:nth-child(4) { animation-delay: 0.4s; }
.card:nth-child(5) { animation-delay: 0.5s; }
.card:nth-child(6) { animation-delay: 0.6s; }

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 高亮卡片 */
.card-highlight {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  color: #ffffff;
}

.card-highlight .card-title,
.card-highlight .card-description {
  color: #ffffff;
}

.card-highlight .card-icon {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

/* 卡片图标 */
.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: rgba(0, 122, 255, 0.1);
  color: #007AFF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: transform 0.3s ease;
}

.card:hover .card-icon {
  transform: scale(1.1);
}

.card-icon svg {
  width: 28px;
  height: 28px;
}

/* 卡片标题 */
.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16px;
  line-height: 1.4;
}

/* 卡片描述 */
.card-description {
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  line-height: 1.7;
  margin-bottom: 0;
}

/* 技术标签列表 */
.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tech-tag {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(0, 122, 255, 0.08);
  color: #007AFF;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tech-tag:hover {
  background: rgba(0, 122, 255, 0.15);
  transform: translateY(-1px);
}

/* 特性列表 */
.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 8px 0;
  padding-left: 24px;
  color: #666666;
  font-size: 14px;
  line-height: 1.6;
  position: relative;
}

.feature-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #5AC8FA;
  border-radius: 50%;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 32px 16px;
  animation: fadeIn 0.8s ease-out 0.6s;
  animation-fill-mode: both;
}

.footer-content {
  max-width: 600px;
  margin: 0 auto;
}

.footer-text {
  font-size: 15px;
  color: #666666;
  margin-bottom: 8px;
  line-height: 1.6;
}

.footer-hint {
  font-size: 13px;
  color: #999999;
  font-weight: 400;
}

/* 动画定义 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 - 平板 */
@media (max-width: 768px) {
  .app {
    padding: 24px 12px;
  }

  .header {
    margin-bottom: 32px;
  }

  .main-title {
    font-size: 28px;
    margin-bottom: 12px;
  }

  .subtitle {
    font-size: 16px;
  }

  .card-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }

  .card {
    padding: 24px 20px;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 20px;
  }

  .card-icon svg {
    width: 24px;
    height: 24px;
  }

  .card-title {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .card-description {
    font-size: 13px;
  }

  .footer {
    padding: 24px 12px;
  }

  .footer-text {
    font-size: 14px;
  }

  .footer-hint {
    font-size: 12px;
  }
}

/* 响应式设计 - 手机 */
@media (max-width: 480px) {
  .app {
    padding: 16px 8px;
  }

  .main-title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .card {
    padding: 20px 16px;
  }

  .card-icon {
    width: 44px;
    height: 44px;
    margin-bottom: 16px;
  }

  .card-icon svg {
    width: 22px;
    height: 22px;
  }

  .card-title {
    font-size: 17px;
  }

  .card-description,
  .feature-list li {
    font-size: 13px;
  }

  .tech-tag {
    padding: 5px 10px;
    font-size: 12px;
  }
}

/* 深色模式支持（可选） */
@media (prefers-color-scheme: dark) {
  .app {
    background-color: #1a1a1a;
  }

  .card {
    background: #2a2a2a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .main-title {
    color: #f0f0f0;
  }

  .subtitle,
  .card-description,
  .feature-list li,
  .footer-text {
    color: #b0b0b0;
  }

  .card-title {
    color: #e0e0e0;
  }

  .footer-hint {
    color: #808080;
  }

  .tech-tag {
    background: rgba(90, 200, 250, 0.15);
    color: #5AC8FA;
  }

  .tech-tag:hover {
    background: rgba(90, 200, 250, 0.25);
  }
}
</style>
