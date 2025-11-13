<template>
  <div id="app">
    <router-view />
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BottomNav from './components/BottomNav.vue';

const route = useRoute();

// 只在主要页面显示底部导航栏
const showBottomNav = computed(() => {
  const mainRoutes = ['/piecework', '/timework', '/statistics', '/profile'];
  return mainRoutes.includes(route.path);
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F8F8F8;
}

#app {
  width: 100%;
  min-height: 100vh;
  background: #F8F8F8;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #F2F2F2;
}

::-webkit-scrollbar-thumb {
  background: #CCCCCC;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999999;
}

/* 禁用选择高亮 */
* {
  -webkit-tap-highlight-color: transparent;
}

/* 按钮和输入框的通用样式 */
button,
input,
select,
textarea {
  font-family: inherit;
}

button {
  outline: none;
  border: none;
}

input,
select,
textarea {
  outline: none;
}

/* 移除 number 类型输入框的箭头 */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

/* 响应式设计 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 13px;
  }
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 卡片通用阴影 */
.card-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-shadow-hover {
  transition: box-shadow 0.3s ease;
}

.card-shadow-hover:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 主色调变量 */
:root {
  --primary-color: #1A73E8;
  --primary-dark: #1565C0;
  --secondary-color: #4CAF50;
  --warning-color: #FF9800;
  --danger-color: #FF5252;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F8F8;
  --bg-tertiary: #F2F2F2;
  --border-color: #E0E0E0;
}
</style>
