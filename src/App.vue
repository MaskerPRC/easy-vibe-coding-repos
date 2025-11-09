<template>
  <div id="app">
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

const calculateButtonCount = () => {
  // 按钮大小为 60px (包括间距)
  const buttonSize = 60;
  const cols = Math.ceil(window.innerWidth / buttonSize);
  const rows = Math.ceil(window.innerHeight / buttonSize);
  buttonCount.value = cols * rows + 20; // 多一些确保填满
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
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
