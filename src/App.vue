<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <nav class="nav-bar" v-if="!isFullscreen">
      <div class="nav-title">应用项目</div>
      <div class="nav-buttons">
        <button
          v-for="page in pages"
          :key="page.name"
          @click="currentPage = page.name"
          :class="['nav-btn', { active: currentPage === page.name }]"
        >
          {{ page.label }}
        </button>
      </div>
    </nav>

    <!-- 页面内容 -->
    <div class="page-content" :class="{ fullscreen: isFullscreen }">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FPSGame from './components/FPSGame.vue';
import DigitalCat from './components/DigitalCat.vue';
import LOLAnalysis from './components/LOLAnalysis.vue';
import MathModel from './components/MathModel.vue';

// 当前页面
const currentPage = ref('digitalcat');

// 是否全屏模式（FPS游戏时）
const isFullscreen = computed(() => currentPage.value === 'fps');

// 页面列表
const pages = [
  { name: 'digitalcat', label: '数码猫咪', component: DigitalCat },
  { name: 'fps', label: 'FPS游戏', component: FPSGame },
  { name: 'lol', label: 'LOL分析', component: LOLAnalysis },
  { name: 'math', label: '数学模型', component: MathModel }
];

// 当前组件
const currentComponent = computed(() => {
  const page = pages.find(p => p.name === currentPage.value);
  return page ? page.component : DigitalCat;
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0e27;
}

/* 导航栏样式 */
.nav-bar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.nav-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  font-family: 'Courier New', monospace;
}

.nav-buttons {
  display: flex;
  gap: 15px;
}

.nav-btn {
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  color: #00ffff;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.nav-btn:hover {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  transform: translateY(-2px);
}

.nav-btn.active {
  background: rgba(0, 255, 255, 0.3);
  border-color: #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
}

/* 页面内容 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.page-content.fullscreen {
  height: 100vh;
  overflow: hidden;
}

/* 滚动条样式 */
.page-content::-webkit-scrollbar {
  width: 10px;
}

.page-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.page-content::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 255, 0.5);
  border-radius: 5px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 255, 0.7);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-bar {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .nav-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-btn {
    padding: 8px 15px;
    font-size: 0.9em;
  }
}
</style>
