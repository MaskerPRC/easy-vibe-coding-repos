<template>
  <div id="app">
    <Navigation />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navigation from './components/Navigation.vue';

const router = useRouter();

// 检测浏览器类型
const detectBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('chrome') && !userAgent.includes('edge') && !userAgent.includes('opr')) {
    return 'chrome';
  } else if (userAgent.includes('firefox')) {
    return 'firefox';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  } else if (userAgent.includes('edge')) {
    return 'edge';
  } else if (userAgent.includes('opr') || userAgent.includes('opera')) {
    return 'opera';
  }

  return 'other';
};

onMounted(() => {
  // 页面加载时的初始化逻辑
  console.log('World App - 自动代码修改系统已加载');

  // 检测浏览器并跳转到对应页面
  const browser = detectBrowser();

  if (browser === 'chrome') {
    // Chrome浏览器跳转到恐龙游戏页面
    router.push('/chrome-game');
  } else {
    // 其他浏览器跳转到空白页
    router.push('/blank');
  }
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
