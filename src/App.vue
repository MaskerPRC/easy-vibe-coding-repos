<template>
  <div id="app">
    <!-- 星空背景层 -->
    <div class="stars-container">
      <div
        v-for="index in starCount"
        :key="'star-' + index"
        class="star"
        :style="getStarStyle(index)"
      ></div>
    </div>

    <div class="chat-buttons-container">
      <div
        v-for="index in buttonCount"
        :key="index"
        class="chat-button"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const buttonCount = ref(0);
const starCount = ref(200); // 星星数量

const calculateButtonCount = () => {
  // 按钮大小为 60px (包括间距)
  const buttonSize = 60;
  const cols = Math.ceil(window.innerWidth / buttonSize);
  const rows = Math.ceil(window.innerHeight / buttonSize);
  buttonCount.value = cols * rows + 20; // 多一些确保填满
};

// 生成星星的随机样式
const getStarStyle = (index) => {
  // 使用index作为种子生成伪随机位置
  const random1 = (index * 9301 + 49297) % 233280 / 233280;
  const random2 = (index * 4253 + 19203) % 233280 / 233280;
  const random3 = (index * 7919 + 13841) % 233280 / 233280;
  const random4 = (index * 3571 + 29167) % 233280 / 233280;

  const left = random1 * 100;
  const top = random2 * 100;
  const size = 1 + random3 * 2; // 1-3px
  const duration = 2 + random4 * 3; // 2-5秒
  const delay = random1 * 5; // 0-5秒延迟

  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`
  };
};

onMounted(() => {
  calculateButtonCount();
  window.addEventListener('resize', calculateButtonCount);
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateButtonCount);
});
</script>

<style>
/* ==================== 全局重置 ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
}

/* ==================== 聊天按钮容器 ==================== */
#app {
  width: 100%;
  height: 100vh;
  background: #000000;
  overflow: hidden;
  position: relative;
}

/* ==================== 星空背景 ==================== */
.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.star {
  position: absolute;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 3px #ffffff;
  animation: twinkle infinite ease-in-out;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.chat-buttons-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.chat-button {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.chat-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.chat-button svg {
  color: #ffffff;
  stroke-width: 2;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

/* ==================== 动画效果 ==================== */
.chat-button {
  animation: fadeInScale 0.5s ease-in-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
