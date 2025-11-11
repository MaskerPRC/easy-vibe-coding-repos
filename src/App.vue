<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-text">V2EX 浏览器</span>
        </div>
        <div class="header-info">
          <span class="header-link">iframe嵌入模式</span>
        </div>
      </div>
    </header>

    <!-- iframe容器 -->
    <main class="main-content">
      <div class="iframe-container">
        <iframe
          src="https://www.v2ex.com/"
          class="v2ex-iframe"
          frameborder="0"
          allowfullscreen
          title="V2EX"
        ></iframe>
      </div>
    </main>
  </div>
</template>

<script setup>
// V2EX iframe 嵌入页面
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f0f0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  overflow: hidden;
}

/* 顶部导航栏 */
.header {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #cccccc;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  letter-spacing: 0.5px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-link {
  font-size: 14px;
  color: #999999;
  text-decoration: none;
  transition: color 0.2s ease;
}

.header-link:hover {
  color: #337ab7;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 0;
}

.iframe-container {
  width: 100%;
  height: 100%;
  max-width: 100%;
  background: #ffffff;
  position: relative;
  overflow: hidden;
}

.v2ex-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  .header-content {
    padding: 10px 15px;
  }

  .logo-text {
    font-size: 16px;
  }

  .header-info {
    gap: 10px;
  }

  .header-link {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 8px 12px;
  }

  .logo-text {
    font-size: 15px;
  }

  .header-link {
    font-size: 12px;
  }
}
</style>
