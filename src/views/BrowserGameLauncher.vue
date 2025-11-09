<template>
  <div class="game-launcher">
    <div class="launcher-content">
      <h1>浏览器游戏启动器</h1>
      <p>正在检测您的浏览器并启动游戏...</p>
      <div class="loader"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // 定义一个函数来执行智能导航
  const navigateToGame = () => {
    // 首先，尝试使用现代的 userAgentData API，因为它更可靠
    if (navigator.userAgentData && navigator.userAgentData.brands) {
      const brands = navigator.userAgentData.brands;

      // 检查品牌列表中是否有 "Microsoft Edge"
      if (brands.some(brand => brand.brand === 'Microsoft Edge')) {
        window.top.location.href = 'edge://surf';
        return; // 执行后结束函数
      }

      // 检查品牌列表中是否有 "Google Chrome"
      if (brands.some(brand => brand.brand === 'Google Chrome')) {
        window.top.location.href = 'chrome://dino';
        return; // 执行后结束函数
      }
    }

    // 如果 userAgentData API 不可用，则回退到检查 userAgent 字符串
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Edg/')) { // Edge 的 UA 包含 'Edg/'
      window.top.location.href = 'edge://surf';
    } else if (userAgent.includes('Chrome/')) { // Chrome 的 UA 包含 'Chrome/'，但要排除Edge
      window.top.location.href = 'chrome://dino';
    } else {
      // 对于其他浏览器（如 Firefox, Safari），给出一个打印提示
      window.top.print();
    }
  };

  // 执行导航
  navigateToGame();
});
</script>

<style scoped>
.game-launcher {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.launcher-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

.launcher-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.launcher-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.loader {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top: 5px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
