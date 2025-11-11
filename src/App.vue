<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-text">百度搜索</span>
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
          src="https://www.baidu.com/"
          class="baidu-iframe"
          frameborder="0"
          allowfullscreen
          title="百度搜索"
        ></iframe>
      </div>
    </main>
  </div>
</template>

<script setup>
// 百度 iframe 嵌入页面 - 遵循百度UI设计规范
// 配色方案：蓝色主色调、白色背景、扁平化设计
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
  background: #FFFFFF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  overflow: hidden;
}

/* 顶部导航栏 - 简约扁平化设计 */
.header {
  width: 100%;
  background: #FFFFFF;
  border-bottom: 1px solid #E5E5E5;
  flex-shrink: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  letter-spacing: 0.3px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-link {
  font-size: 14px;
  color: #999999;
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: default;
}

.header-link:hover {
  color: #3385FF;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding: 0;
  background: #FFFFFF;
}

.iframe-container {
  width: 100%;
  height: 100%;
  max-width: 100%;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
}

.baidu-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* 响应式设计 - 平板适配 */
@media (max-width: 1024px) {
  .header-content {
    padding: 12px 20px;
  }

  .logo-text {
    font-size: 18px;
  }
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  .header-content {
    padding: 10px 16px;
  }

  .logo-text {
    font-size: 17px;
  }

  .header-info {
    gap: 12px;
  }

  .header-link {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 10px 12px;
  }

  .logo-text {
    font-size: 16px;
  }

  .header-link {
    font-size: 12px;
  }
}
</style>
