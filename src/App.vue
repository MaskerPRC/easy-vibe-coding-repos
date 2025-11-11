<template>
  <div class="app">
    <header class="header">
      <h1 class="header-title">外部网站展示</h1>
    </header>

    <main class="content">
      <div class="iframe-container">
        <div class="iframe-wrapper">
          <div class="iframe-label">百度</div>
          <iframe
            src="https://www.baidu.com/"
            class="iframe-content"
            frameborder="0"
            title="百度"
          ></iframe>
        </div>

        <div class="iframe-wrapper">
          <div class="iframe-label">ibracc</div>
          <iframe
            src="http://ibracc.click/"
            class="iframe-content"
            frameborder="0"
            title="ibracc"
          ></iframe>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// 展示外部网站页面
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
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 页头样式 */
.header {
  background: #333333;
  padding: 20px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: #FFFFFF;
  text-align: center;
  letter-spacing: 1px;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 30px;
  overflow: hidden;
}

.iframe-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.iframe-wrapper {
  flex: 1;
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.iframe-label {
  background: #666666;
  color: #FFFFFF;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #E0E0E0;
}

.iframe-content {
  flex: 1;
  width: 100%;
  border: none;
  display: block;
}

/* 响应式布局 - 大屏幕左右分栏 */
@media (min-width: 1200px) {
  .iframe-container {
    flex-direction: row;
  }

  .iframe-wrapper {
    min-width: 0;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
  }

  .header-title {
    font-size: 20px;
  }

  .content {
    padding: 15px;
  }

  .iframe-container {
    gap: 15px;
  }

  .iframe-label {
    padding: 10px 15px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 12px 15px;
  }

  .header-title {
    font-size: 18px;
  }

  .content {
    padding: 10px;
  }

  .iframe-container {
    gap: 10px;
  }

  .iframe-label {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
