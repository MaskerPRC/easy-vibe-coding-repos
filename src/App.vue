<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// 使用 Vue Router 进行页面路由
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>

