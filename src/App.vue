<template>
  <div id="app">
    <Navigation />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Navigation from './components/Navigation.vue';

onMounted(() => {
  // 页面加载时的初始化逻辑
  console.log('World App - 浏览器游戏启动器已加载');
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  min-height: 100vh;
}

.chat-button {
  display: none !important;
}
</style>
