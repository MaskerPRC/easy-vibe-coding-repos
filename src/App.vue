<template>
  <div class="app">
    <div class="welcome-container">
      <!-- 主要欢迎卡片 -->
      <div class="welcome-card">
        <div class="icon-wrapper">
          <svg class="welcome-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#4A90E2" opacity="0.1"/>
            <path d="M30 50 Q30 30 50 30 Q70 30 70 50" stroke="#4A90E2" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="40" cy="45" r="3" fill="#4A90E2"/>
            <circle cx="60" cy="45" r="3" fill="#4A90E2"/>
            <path d="M35 55 Q50 70 65 55" stroke="#4A90E2" stroke-width="3" fill="none" stroke-linecap="round"/>
          </svg>
        </div>
        <h1 class="main-title">你好！</h1>
        <p class="main-description">欢迎来到这里，很高兴见到你</p>
      </div>

      <!-- 信息卡片组 -->
      <div class="info-cards">
        <div class="info-card">
          <div class="card-icon" style="background-color: #4A90E2;">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="card-title">简约设计</h3>
          <p class="card-text">采用现代化的简约风格，注重用户体验</p>
        </div>

        <div class="info-card">
          <div class="card-icon" style="background-color: #50E3C2;">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="card-title">友好交互</h3>
          <p class="card-text">清晰的视觉反馈，让交互更加自然流畅</p>
        </div>

        <div class="info-card">
          <div class="card-icon" style="background-color: #4A90E2;">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" stroke="white" stroke-width="2" rx="1"/>
              <rect x="14" y="3" width="7" height="7" stroke="white" stroke-width="2" rx="1"/>
              <rect x="3" y="14" width="7" height="7" stroke="white" stroke-width="2" rx="1"/>
              <rect x="14" y="14" width="7" height="7" stroke="white" stroke-width="2" rx="1"/>
            </svg>
          </div>
          <h3 class="card-title">模块化</h3>
          <p class="card-text">清晰的信息层次，内容组织井然有序</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="btn btn-primary" @click="handleExplore">开始探索</button>
        <button class="btn btn-secondary" @click="handleLearnMore">了解更多</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleExplore = () => {
  console.log('开始探索');
  // 这里可以添加导航或其他逻辑
};

const handleLearnMore = () => {
  console.log('了解更多');
  // 这里可以添加更多信息展示逻辑
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F8F8F8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  font-family: 'PingFang SC', 'SF Pro SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Lato, sans-serif;
}

.welcome-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 主欢迎卡片 */
.welcome-card {
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.icon-wrapper {
  margin-bottom: 24px;
}

.welcome-icon {
  width: 100px;
  height: 100px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.main-title {
  font-size: 40px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.main-description {
  font-size: 18px;
  font-weight: 400;
  color: #666666;
  line-height: 1.6;
}

/* 信息卡片组 */
.info-cards {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.info-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.card-icon svg {
  width: 28px;
  height: 28px;
}

.card-title {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
}

.card-text {
  font-size: 14px;
  font-weight: 300;
  color: #999999;
  line-height: 1.6;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 12px 32px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-primary {
  background: #4A90E2;
  color: #ffffff;
}

.btn-primary:hover {
  background: #357ABD;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(74, 144, 226, 0.3);
}

.btn-secondary {
  background: #ffffff;
  color: #4A90E2;
  border: 2px solid #4A90E2;
}

.btn-secondary:hover {
  background: #4A90E2;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.btn-secondary:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(74, 144, 226, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app {
    padding: 24px 16px;
  }

  .welcome-card {
    padding: 32px 24px;
  }

  .main-title {
    font-size: 32px;
  }

  .main-description {
    font-size: 16px;
  }

  .welcome-icon {
    width: 80px;
    height: 80px;
  }

  .info-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .info-card {
    padding: 24px 20px;
  }

  .action-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .welcome-card {
    padding: 24px 16px;
  }

  .main-title {
    font-size: 28px;
  }

  .main-description {
    font-size: 15px;
  }

  .card-title {
    font-size: 16px;
  }

  .card-text {
    font-size: 13px;
  }
}
</style>

