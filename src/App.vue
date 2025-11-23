<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">© 2024 时尚商城 - 品质生活，从这里开始</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F8F8F8;
  color: #333333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #F8F8F8;
}

::-webkit-scrollbar-thumb {
  background: #CCCCCC;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999999;
}

/* 全局按钮样式 */
button {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* 全局输入框样式 */
input,
textarea,
select {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* 链接样式 */
a {
  text-decoration: none;
  color: inherit;
}

/* 图片样式 */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 页脚样式 */
.footer {
  background: #333333;
  color: white;
  padding: 32px 0;
  margin-top: 48px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
}

.footer-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'PingFang SC', sans-serif;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .footer {
    padding: 24px 0;
    margin-top: 32px;
  }

  .footer-text {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 20px 0;
    margin-top: 24px;
  }

  .footer-content {
    padding: 0 16px;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
