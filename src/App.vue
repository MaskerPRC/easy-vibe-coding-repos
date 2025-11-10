<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 全局字体和背景 */
html,
body {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f8f8f8;
  color: #333333;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f0f0f0;
}

::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* 链接样式 */
a {
  color: #2f80ed;
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: #1e5fc4;
}

/* 按钮通用样式 */
button {
  font-family: inherit;
  cursor: pointer;
}

button:focus {
  outline: none;
}

/* 输入框通用样式 */
input,
textarea {
  font-family: inherit;
}

input:focus,
textarea:focus {
  outline: none;
}
</style>

