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
  console.log('World App - 自动代码修改系统已加载');

  // 定义一个函数,用于查找并隐藏按钮
  const hideButton = () => {
    const chatButton = document.querySelector('.chat-button');
    if (chatButton && chatButton.style.display !== 'none') {
      chatButton.style.display = 'none';
    }
  };

  // 立即尝试执行一次,以防按钮已经存在
  hideButton();

  // 创建一个观察器实例
  const observer = new MutationObserver((mutationsList) => {
    // 检查每次DOM变化,看是否需要隐藏按钮
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        hideButton();
      }
    }
  });

  // 配置观察器需要观察的变动
  const config = { childList: true, subtree: true };

  // 指定观察目标为整个文档的body
  observer.observe(document.body, config);
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
