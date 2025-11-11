<template>
  <div class="app">
    <!-- 可选的简洁标题区域 -->
    <header class="header">
      <h1 class="header-title">网站展示</h1>
    </header>

    <main class="content">
      <div class="iframe-container">
        <!-- 百度 iframe -->
        <div class="iframe-wrapper">
          <iframe
            src="https://www.baidu.com/"
            class="iframe-content"
            frameborder="0"
            title="百度"
            loading="lazy"
          ></iframe>
        </div>

        <!-- ibracc iframe -->
        <div class="iframe-wrapper">
          <iframe
            src="http://ibracc.click/"
            class="iframe-content"
            frameborder="0"
            title="ibracc"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// 主页：使用iframe展示外部网站
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F5F5F5;
  display: flex;
  flex-direction: column;
  /* 中文：思源黑体或系统默认无衬线字体 */
  /* 英文/数字：Roboto或系统默认无衬线字体 */
  font-family: 'Source Han Sans CN', 'Noto Sans CJK SC', 'PingFang SC', 'Microsoft YaHei', 'Roboto', 'Arial', 'Helvetica', sans-serif;
}

/* 简洁标题区域（可选） */
.header {
  background: #F5F5F5;
  padding: 20px 30px;
}

.header-title {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  text-align: center;
}

/* 主内容区域 */
.content {
  flex: 1;
  padding: 20px 30px 30px;
  overflow: hidden;
}

/* iframe容器 - 默认左右布局 */
.iframe-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  height: 100%;
  min-height: 0;
}

/* iframe包装器 */
.iframe-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  /* 1px浅灰色边框 */
  border: 1px solid #666666;
  /* 极小圆角 */
  border-radius: 4px;
  /* 轻微阴影 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: #FFFFFF;
}

/* iframe内容 */
.iframe-content {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* 响应式设计：小屏幕垂直堆叠 */
@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
  }

  .header-title {
    font-size: 14px;
  }

  .content {
    padding: 15px 20px 20px;
  }

  .iframe-container {
    flex-direction: column;
    gap: 15px;
  }

  .iframe-wrapper {
    min-height: 400px;
  }
}

/* 更小屏幕优化 */
@media (max-width: 480px) {
  .header {
    padding: 12px 15px;
  }

  .content {
    padding: 10px 15px 15px;
  }

  .iframe-container {
    gap: 10px;
  }

  .iframe-wrapper {
    min-height: 350px;
  }
}
</style>
