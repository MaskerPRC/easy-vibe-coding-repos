<template>
  <div class="app">
    <div class="iframe-container">
      <iframe
        src="https://www.baidu.com/"
        class="iframe-content"
        title="百度首页"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script setup>
// 首页展示百度页面
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F0F2F5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  font-family: Arial, Helvetica, sans-serif;
}

.iframe-container {
  width: 100%;
  height: calc(100vh - 60px);
  max-width: 100%;
  background: #FFFFFF;
  overflow: hidden;
}

.iframe-content {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .app {
    padding: 20px;
  }

  .iframe-container {
    height: calc(100vh - 40px);
  }
}

@media (max-width: 480px) {
  .app {
    padding: 10px;
  }

  .iframe-container {
    height: calc(100vh - 20px);
  }
}
</style>

