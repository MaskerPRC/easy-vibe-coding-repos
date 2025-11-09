<template>
  <div id="app">
    <div class="maintenance-container">
      <div class="maintenance-content">
        <h1 class="maintenance-title">网站正在维护中！</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
// 维护页面 - 无需任何逻辑
</script>

<style>
/* ==================== 全局重置 ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ==================== 维护页面样式 ==================== */
#app {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.maintenance-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.maintenance-content {
  text-align: center;
  animation: fadeIn 0.8s ease-in-out;
}

.maintenance-title {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
  line-height: 1.4;
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 768px) {
  .maintenance-title {
    font-size: 32px;
  }
}

@media (max-width: 480px) {
  .maintenance-title {
    font-size: 24px;
  }
}

/* ==================== 动画效果 ==================== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
