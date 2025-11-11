<template>
  <div class="app">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration">
      <div class="circle-1"></div>
      <div class="circle-2"></div>
      <div class="circle-3"></div>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 标题区域 -->
      <header class="header">
        <h1 class="main-title">
          <span class="title-text">蔡徐坤</span>
          <span class="title-subtitle">CAI XU KUN</span>
        </h1>
        <p class="tagline">偶像 · 艺术家 · 梦想家</p>
      </header>

      <!-- 卡片网格布局 -->
      <div class="card-grid">
        <!-- 主要人物卡片 -->
        <div class="card card-main">
          <div class="card-content">
            <div class="character-illustration">
              <!-- SVG 人物插画 -->
              <svg viewBox="0 0 300 400" class="character-svg">
                <!-- 舞台光芒效果 -->
                <defs>
                  <linearGradient id="stageLight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#673AB7;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#FFD600;stop-opacity:0.1" />
                  </linearGradient>
                  <radialGradient id="spotlight" cx="50%" cy="30%">
                    <stop offset="0%" style="stop-color:#FFD600;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#673AB7;stop-opacity:0" />
                  </radialGradient>
                </defs>

                <!-- 聚光灯背景 -->
                <ellipse cx="150" cy="120" rx="100" ry="80" fill="url(#spotlight)" />

                <!-- 人物剪影 - 头部 -->
                <ellipse cx="150" cy="80" rx="35" ry="40" fill="#1A237E" />

                <!-- 人物剪影 - 身体 -->
                <path d="M 150 110 Q 140 140 135 180 L 135 240 L 125 320 L 140 320 L 150 250 L 160 320 L 175 320 L 165 240 L 165 180 Q 160 140 150 110 Z" fill="#1A237E" />

                <!-- 人物剪影 - 手臂（动感姿势） -->
                <path d="M 135 140 Q 100 160 90 190 L 100 195 Q 110 170 135 155 Z" fill="#1A237E" />
                <path d="M 165 140 Q 200 160 210 190 L 200 195 Q 190 170 165 155 Z" fill="#1A237E" />

                <!-- 篮球元素 -->
                <circle cx="95" cy="200" r="20" fill="#FF4081" opacity="0.9" />
                <path d="M 75 200 Q 95 180 115 200" stroke="#1A237E" stroke-width="2" fill="none" />
                <path d="M 95 180 L 95 220" stroke="#1A237E" stroke-width="2" />

                <!-- 音符装饰 -->
                <circle cx="220" cy="100" r="6" fill="#FFD600" />
                <rect x="226" y="70" width="3" height="30" fill="#FFD600" />
                <circle cx="240" cy="130" r="5" fill="#FF4081" />
                <rect x="245" y="105" width="2.5" height="25" fill="#FF4081" />

                <!-- 星星装饰 -->
                <path d="M 80 50 L 83 58 L 92 58 L 85 63 L 88 72 L 80 66 L 72 72 L 75 63 L 68 58 L 77 58 Z" fill="#FFD600" opacity="0.8" />
                <path d="M 210 60 L 212 66 L 218 66 L 213 70 L 215 76 L 210 72 L 205 76 L 207 70 L 202 66 L 208 66 Z" fill="#FF4081" opacity="0.8" />

                <!-- 舞台地面 -->
                <rect x="50" y="320" width="200" height="3" fill="url(#stageLight)" opacity="0.5" />
              </svg>
            </div>
            <div class="card-badge">明星偶像</div>
          </div>
        </div>

        <!-- 信息卡片 1 -->
        <div class="card card-info">
          <div class="card-icon">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="#FFD600" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
          </div>
          <h3 class="card-title">音乐才华</h3>
          <p class="card-text">创作型偶像歌手，以独特的音乐风格和舞台表现力著称</p>
        </div>

        <!-- 信息卡片 2 -->
        <div class="card card-info">
          <div class="card-icon">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="#FF4081" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"/>
              </svg>
            </div>
          </div>
          <h3 class="card-title">多面艺人</h3>
          <p class="card-text">集唱、跳、Rap、篮球于一身的全能艺人</p>
        </div>

        <!-- 信息卡片 3 -->
        <div class="card card-info">
          <div class="card-icon">
            <div class="icon-circle">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="#673AB7" d="M12 2L2 7V12C2 17.55 5.84 22.54 11 23.77C16.16 22.54 20 17.55 20 12V7L12 2ZM12 11C13.1 11 14 11.9 14 13C14 14.1 13.1 15 12 15C10.9 15 10 14.1 10 13C10 11.9 10.9 11 12 11Z"/>
              </svg>
            </div>
          </div>
          <h3 class="card-title">时尚Icon</h3>
          <p class="card-text">引领潮流，个人风格独特，时尚品味出众</p>
        </div>

        <!-- 精彩瞬间卡片 -->
        <div class="card card-highlight">
          <div class="highlight-badge">精彩瞬间</div>
          <div class="highlight-content">
            <div class="highlight-item">
              <span class="highlight-icon">🎤</span>
              <span class="highlight-text">演唱会巡演</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">🏀</span>
              <span class="highlight-text">篮球才艺</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">💃</span>
              <span class="highlight-text">舞蹈表演</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">⭐</span>
              <span class="highlight-text">综艺节目</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <footer class="footer">
        <div class="footer-line"></div>
        <p class="footer-text">Keep Dreaming · Keep Shining</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
// 展示蔡徐坤的艺术页面
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%);
  padding: 40px 20px;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans CJK SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.circle-1, .circle-2, .circle-3 {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #673AB7 0%, transparent 70%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #FF4081 0%, transparent 70%);
  bottom: -150px;
  right: -150px;
  animation-delay: 7s;
}

.circle-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #FFD600 0%, transparent 70%);
  top: 50%;
  right: 10%;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* 主容器 */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 标题区域 */
.header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInDown 1s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.main-title {
  margin-bottom: 16px;
}

.title-text {
  display: block;
  font-size: 56px;
  font-weight: 700;
  background: linear-gradient(135deg, #673AB7 0%, #1A237E 50%, #FF4081 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 8px;
  margin-bottom: 8px;
  text-shadow: 0 4px 8px rgba(103, 58, 183, 0.3);
}

.title-subtitle {
  display: block;
  font-size: 20px;
  font-weight: 300;
  color: #757575;
  letter-spacing: 4px;
}

.tagline {
  font-size: 18px;
  color: #757575;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
  padding: 0 40px;
}

.tagline::before,
.tagline::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #FFD600);
}

.tagline::before {
  left: 0;
}

.tagline::after {
  right: 0;
  background: linear-gradient(90deg, #FFD600, transparent);
}

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

/* 卡片通用样式 */
.card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(103, 58, 183, 0.12);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.8s ease-out backwards;
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

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(103, 58, 183, 0.2);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #673AB7, #FF4081, #FFD600);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::before {
  opacity: 1;
}

/* 主要卡片 */
.card-main {
  grid-column: span 2;
  padding: 40px;
  background: linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%);
  animation-delay: 0.1s;
}

.card-content {
  position: relative;
}

.character-illustration {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  filter: drop-shadow(0 10px 30px rgba(103, 58, 183, 0.3));
}

.character-svg {
  width: 100%;
  height: auto;
  animation: characterFloat 6s ease-in-out infinite;
}

@keyframes characterFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.card-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #673AB7, #1A237E);
  color: #FFFFFF;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(103, 58, 183, 0.4);
}

/* 信息卡片 */
.card-info {
  text-align: center;
}

.card-info:nth-child(3) {
  animation-delay: 0.2s;
}

.card-info:nth-child(4) {
  animation-delay: 0.3s;
}

.card-info:nth-child(5) {
  animation-delay: 0.4s;
}

.card-icon {
  margin-bottom: 20px;
}

.icon-circle {
  width: 64px;
  height: 64px;
  margin: 0 auto;
  background: linear-gradient(135deg, #F5F5F5, #E0E0E0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.card:hover .icon-circle {
  transform: scale(1.1) rotate(10deg);
  background: linear-gradient(135deg, #E0E0E0, #BDBDBD);
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #1A237E;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.card-text {
  font-size: 15px;
  color: #757575;
  line-height: 1.6;
}

/* 精彩瞬间卡片 */
.card-highlight {
  grid-column: span 2;
  background: linear-gradient(135deg, #673AB7 0%, #1A237E 100%);
  color: #FFFFFF;
  animation-delay: 0.5s;
}

.highlight-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.highlight-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.highlight-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(8px);
}

.highlight-icon {
  font-size: 28px;
}

.highlight-text {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 底部 */
.footer {
  text-align: center;
  padding-top: 40px;
  animation: fadeIn 1.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.footer-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #673AB7, #FF4081);
  margin: 0 auto 16px;
  border-radius: 2px;
}

.footer-text {
  font-size: 16px;
  color: #757575;
  letter-spacing: 2px;
  font-weight: 300;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .card-main {
    grid-column: span 1;
  }

  .card-highlight {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .app {
    padding: 30px 16px;
  }

  .header {
    margin-bottom: 40px;
  }

  .title-text {
    font-size: 40px;
    letter-spacing: 4px;
  }

  .title-subtitle {
    font-size: 16px;
    letter-spacing: 2px;
  }

  .tagline {
    font-size: 15px;
    padding: 0 30px;
  }

  .card-grid {
    gap: 20px;
    margin-bottom: 40px;
  }

  .card {
    padding: 24px;
  }

  .card-main {
    padding: 30px 20px;
  }

  .highlight-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .title-text {
    font-size: 32px;
    letter-spacing: 2px;
  }

  .title-subtitle {
    font-size: 14px;
  }

  .tagline {
    font-size: 14px;
  }

  .card {
    padding: 20px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-text {
    font-size: 14px;
  }

  .highlight-icon {
    font-size: 24px;
  }

  .highlight-text {
    font-size: 14px;
  }
}
</style>

