<template>
  <div id="app">
    <header class="app-header">
      <h1 class="app-title">中国象棋</h1>
      <p class="app-subtitle">人机对战</p>
    </header>
    <main class="app-main">
      <ChessBoard />
    </main>
    <footer class="app-footer">
      <p>新中式雅致设计 | 智能AI对战</p>
    </footer>
  </div>
</template>

<script setup>
import ChessBoard from './components/ChessBoard.vue'
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  min-height: 100vh;
  font-family: 'Microsoft YaHei', '微软雅黑', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  background: linear-gradient(135deg, #F0F0E0 0%, #FFFFFF 100%);
  color: #2C2C2C;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 24px 20px 16px;
  background: linear-gradient(135deg, #4A2E1A 0%, #6B4423 100%);
  color: #F5F5DC;
  box-shadow: 0 4px 12px rgba(74, 46, 26, 0.3);
}

.app-title {
  font-size: 32px;
  font-weight: bold;
  font-family: 'KaiTi', '楷体', serif;
  letter-spacing: 8px;
  margin-bottom: 8px;
}

.app-subtitle {
  font-size: 14px;
  opacity: 0.8;
  letter-spacing: 2px;
}

.app-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.app-footer {
  text-align: center;
  padding: 16px;
  background: rgba(74, 46, 26, 0.05);
  color: #A0A0A0;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-title {
    font-size: 28px;
    letter-spacing: 6px;
  }

  .app-subtitle {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 16px 12px 12px;
  }

  .app-title {
    font-size: 24px;
    letter-spacing: 4px;
  }
}
</style>
