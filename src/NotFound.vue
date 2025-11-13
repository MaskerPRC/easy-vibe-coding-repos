<template>
  <div class="not-found-page">
    <div class="content-wrapper">
      <!-- 小恐龙插画 -->
      <div class="dino-container">
        <svg class="dino" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
          <!-- 恐龙身体 -->
          <rect x="60" y="45" width="70" height="35" fill="#5F6368"/>
          <!-- 恐龙头部 -->
          <rect x="120" y="35" width="30" height="30" fill="#5F6368"/>
          <!-- 恐龙眼睛 -->
          <circle cx="140" cy="45" r="3" fill="#3C4043"/>
          <!-- 恐龙嘴巴 -->
          <rect x="145" y="50" width="5" height="3" fill="#3C4043"/>
          <!-- 恐龙尾巴 -->
          <polygon points="60,55 40,50 50,65" fill="#5F6368"/>
          <!-- 恐龙腿 -->
          <rect x="70" y="80" width="8" height="15" fill="#5F6368"/>
          <rect x="90" y="80" width="8" height="15" fill="#5F6368"/>
          <rect x="110" y="80" width="8" height="15" fill="#5F6368"/>
          <!-- 地面线 -->
          <line x1="20" y1="95" x2="180" y2="95" stroke="#5F6368" stroke-width="2"/>
        </svg>
      </div>

      <!-- 错误信息 -->
      <div class="error-info">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">找不到网页</h2>
        <p class="error-description">
          您访问的网页不存在。可能是网址输入错误，或该网页已被移除。
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button @click="goHome" class="btn-primary">
          返回首页
        </button>
        <button @click="goBack" class="btn-secondary">
          返回上一页
        </button>
      </div>

      <!-- 建议链接 -->
      <div class="suggestions">
        <p class="suggestions-text">建议：</p>
        <ul class="suggestions-list">
          <li>检查网址是否输入正确</li>
          <li>尝试使用浏览器的后退按钮</li>
          <li>访问我们的首页重新开始</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 页面容器 */
.not-found-page {
  min-height: 100vh;
  background-color: #F8F9FA;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Roboto', 'Arial', 'Helvetica', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 内容包装器 */
.content-wrapper {
  max-width: 600px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* 小恐龙容器 */
.dino-container {
  width: 200px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s ease-in-out infinite;
}

.dino {
  width: 100%;
  height: 100%;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 错误信息 */
.error-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-code {
  font-size: 64px;
  font-weight: bold;
  color: #3C4043;
  line-height: 1;
  letter-spacing: -2px;
}

.error-title {
  font-size: 28px;
  font-weight: normal;
  color: #3C4043;
  margin: 0;
}

.error-description {
  font-size: 16px;
  color: #5F6368;
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  outline: none;
}

.btn-primary {
  background-color: #1a73e8;
  color: #FFFFFF;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.btn-primary:hover {
  background-color: #1557b0;
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
}

.btn-primary:active {
  background-color: #1557b0;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.btn-secondary {
  background-color: #FFFFFF;
  color: #1a73e8;
  border: 1px solid #DADCE0;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.btn-secondary:hover {
  background-color: #F8F9FA;
  border-color: #DADCE0;
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
}

.btn-secondary:active {
  background-color: #F1F3F4;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

/* 建议链接 */
.suggestions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  max-width: 400px;
  width: 100%;
}

.suggestions-text {
  font-size: 14px;
  font-weight: 500;
  color: #3C4043;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestions-list li {
  font-size: 14px;
  color: #5F6368;
  padding-left: 20px;
  position: relative;
}

.suggestions-list li::before {
  content: "•";
  position: absolute;
  left: 8px;
  color: #5F6368;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    gap: 24px;
  }

  .dino-container {
    width: 160px;
    height: 80px;
  }

  .error-code {
    font-size: 48px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-description {
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .not-found-page {
    padding: 20px 16px;
  }

  .dino-container {
    width: 140px;
    height: 70px;
  }

  .error-code {
    font-size: 40px;
  }

  .error-title {
    font-size: 20px;
  }

  .error-description {
    font-size: 13px;
  }

  button {
    padding: 8px 20px;
    font-size: 13px;
  }
}
</style>
