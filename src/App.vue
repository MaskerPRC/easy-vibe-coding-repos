<template>
  <div class="app">
    <div class="iframe-container">
      <iframe
        src="https://www.v2ex.com/"
        class="v2ex-iframe"
        frameborder="0"
        title="V2EX"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
// V2EX 嵌入页面
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
  background: #E2E2E2;
  font-family: 'Helvetica Neue', Helvetica, Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  overflow: hidden;
}

.iframe-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #FFFFFF;
}

.v2ex-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
