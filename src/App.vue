<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// 应用根组件,使用路由视图显示页面内容
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
