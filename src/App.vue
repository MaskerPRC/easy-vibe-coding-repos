<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// App.vue现在只是一个简单的容器，所有内容通过路由渲染
</script>

<style>
/* CSS变量定义 - 支持主题色切换 */
:root {
  --color-primary: #4a90e2;
  --color-primary-hover: #357abd;
}

body {
  --color-primary: #4a90e2;
  --color-primary-hover: #357abd;
  margin: 0;
  padding: 0;
}

/* 全局样式 - 主题色映射 */
body[data-theme="blue"] {
  --color-primary: #4a90e2;
  --color-primary-hover: #357abd;
}

body[data-theme="green"] {
  --color-primary: #10b981;
  --color-primary-hover: #059669;
}

body[data-theme="amber"] {
  --color-primary: #eab308;
  --color-primary-hover: #ca8a04;
}

* {
  box-sizing: border-box;
}
</style>
