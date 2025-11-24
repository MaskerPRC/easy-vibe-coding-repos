<template>
  <div class="app">
    <div class="construction-container">
      <div class="construction-box">
        <div class="construction-icon">
          <div class="icon-bar icon-bar-1"></div>
          <div class="icon-bar icon-bar-2"></div>
          <div class="icon-bar icon-bar-3"></div>
        </div>
        <h1 class="construction-title">网站正在构建中</h1>
        <p class="construction-text">我们正在努力完善这个网站,请稍后再来</p>
        <div class="construction-stripes">
          <div class="stripe stripe-1"></div>
          <div class="stripe stripe-2"></div>
          <div class="stripe stripe-3"></div>
          <div class="stripe stripe-4"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 首页组件
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.construction-container {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.construction-box {
  border: 2px solid #ffffff;
  background: #ffffff;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.construction-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bar {
  position: absolute;
  width: 8px;
  height: 60px;
  background: #000000;
  animation: construction-pulse 1.5s ease-in-out infinite;
}

.icon-bar-1 {
  left: 20px;
  animation-delay: 0s;
}

.icon-bar-2 {
  left: 36px;
  animation-delay: 0.3s;
}

.icon-bar-3 {
  left: 52px;
  animation-delay: 0.6s;
}

@keyframes construction-pulse {
  0%, 100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.3;
    transform: scaleY(0.5);
  }
}

.construction-title {
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.construction-text {
  font-size: 16px;
  color: #000000;
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 40px;
}

.construction-stripes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.stripe {
  position: absolute;
  width: 100%;
  height: 20px;
  background: repeating-linear-gradient(
    90deg,
    #000000 0px,
    #000000 20px,
    transparent 20px,
    transparent 40px
  );
  opacity: 0.1;
  animation: stripe-move 2s linear infinite;
}

.stripe-1 {
  top: 0;
  animation-delay: 0s;
}

.stripe-2 {
  top: 25%;
  animation-delay: 0.5s;
}

.stripe-3 {
  top: 50%;
  animation-delay: 1s;
}

.stripe-4 {
  top: 75%;
  animation-delay: 1.5s;
}

@keyframes stripe-move {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .construction-box {
    padding: 40px 20px;
  }

  .construction-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 30px;
  }

  .icon-bar {
    width: 6px;
    height: 45px;
  }

  .icon-bar-1 {
    left: 15px;
  }

  .icon-bar-2 {
    left: 27px;
  }

  .icon-bar-3 {
    left: 39px;
  }

  .construction-title {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .construction-text {
    font-size: 14px;
    margin-bottom: 30px;
  }

  .stripe {
    height: 15px;
  }
}

@media (max-width: 480px) {
  .construction-box {
    padding: 30px 15px;
  }

  .construction-title {
    font-size: 20px;
  }

  .construction-text {
    font-size: 13px;
  }
}
</style>
