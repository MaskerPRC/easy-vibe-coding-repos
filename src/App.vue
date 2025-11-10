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
        <button
          @click="restartServer"
          class="nav-btn restart-btn"
          :disabled="isRestarting"
        >
          {{ isRestarting ? '重启中...' : '重启服务器' }}
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
import FileBrowser from './components/FileBrowser.vue';
import XSSDemo from './components/XSSDemo.vue';
import FPSGame from './components/FPSGame.vue';
import DigitalCat from './components/DigitalCat.vue';
import LOLAnalysis from './components/LOLAnalysis.vue';
import LOLWorldChampionship from './components/LOLWorldChampionship.vue';
import MathModel from './components/MathModel.vue';
import MathQuestions from './components/MathQuestions.vue';
import Error502 from './components/Error502.vue';
import Error592 from './components/Error592.vue';
import HeroCarousel from './components/HeroCarousel.vue';
import CatAsciiArt from './components/CatAsciiArt.vue';
import WeddingMemorial from './components/WeddingMemorial.vue';

// 当前页面
const currentPage = ref('filebrowser');

// 是否全屏模式（FPS游戏时）
const isFullscreen = computed(() => currentPage.value === 'fps');

// 页面列表
const pages = [
  { name: 'filebrowser', label: '文件浏览器', component: FileBrowser },
  { name: 'wedding', label: '结婚纪念帖', component: WeddingMemorial },
  { name: 'mathquestions', label: '小学数学题', component: MathQuestions },
  { name: 'lolworlds', label: 'LOL世界赛', component: LOLWorldChampionship },
  { name: 'xssdemo', label: 'XSS靶场', component: XSSDemo },
  { name: 'digitalcat', label: '数码猫咪', component: DigitalCat },
  { name: 'catascii', label: '猫咪字符画', component: CatAsciiArt },
  { name: 'hero', label: '王者荣耀', component: HeroCarousel },
  { name: 'fps', label: 'FPS游戏', component: FPSGame },
  { name: 'lol', label: 'LOL分析', component: LOLAnalysis },
  { name: 'math', label: '数学模型', component: MathModel },
  { name: 'error502', label: '502错误', component: Error502 },
  { name: 'error592', label: '592错误', component: Error592 }
];

// 当前组件
const currentComponent = computed(() => {
  const page = pages.find(p => p.name === currentPage.value);
  return page ? page.component : FileBrowser;
});

// 重启服务器状态
const isRestarting = ref(false);

// 重启服务器方法
const restartServer = async () => {
  if (isRestarting.value) return;

  const confirmRestart = confirm('确定要重启服务器吗？');
  if (!confirmRestart) return;

  isRestarting.value = true;

  try {
    console.log('正在请求重启服务器...');
    const response = await fetch('/api/restart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      alert('服务器正在重启，页面将在3秒后自动刷新');

      // 3秒后刷新页面
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      alert('重启失败: ' + (data.message || '未知错误'));
      isRestarting.value = false;
    }
  } catch (error) {
    console.error('重启请求失败:', error);
    // 如果请求失败，可能是服务器已经开始重启
    alert('服务器正在重启，页面将在3秒后自动刷新');
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
};

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', 'Fixedsys', 'Consolas', monospace;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: grayscale;
  background: #0000AA;
  color: #FFFFFF;
}

.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0000AA;
}

/* 导航栏样式 - Windows 98 蓝屏风格 */
.nav-bar {
  background: #0000AA;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #FFFFFF;
  z-index: 100;
}

.nav-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #FFFFFF;
  text-shadow: none;
  font-family: 'Courier New', 'Fixedsys', monospace;
  letter-spacing: 2px;
}

.nav-buttons {
  display: flex;
  gap: 15px;
}

.nav-btn {
  padding: 10px 20px;
  background: #0000AA;
  border: 2px solid #AAAAAA;
  border-radius: 0;
  color: #FFFFFF;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s ease;
  font-family: 'Courier New', 'Fixedsys', monospace;
  text-transform: uppercase;
}

.nav-btn:hover {
  background: #0000CC;
  border-color: #FFFFFF;
  box-shadow: none;
  transform: none;
}

.nav-btn.active {
  background: #000088;
  border-color: #FFFFFF;
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.5);
}

/* 重启按钮特殊样式 */
.restart-btn {
  background: #AA0000;
  border-color: #FFFFFF;
  margin-left: 10px;
}

.restart-btn:hover:not(:disabled) {
  background: #CC0000;
  border-color: #FFFF00;
}

.restart-btn:disabled {
  background: #880000;
  border-color: #888888;
  cursor: not-allowed;
  opacity: 0.7;
}

/* 页面内容 */
.page-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #0000AA;
}

.page-content.fullscreen {
  height: 100vh;
  overflow: hidden;
}

/* 滚动条样式 - 蓝屏风格 */
.page-content::-webkit-scrollbar {
  width: 12px;
}

.page-content::-webkit-scrollbar-track {
  background: #000088;
}

.page-content::-webkit-scrollbar-thumb {
  background: #AAAAAA;
  border-radius: 0;
  border: 1px solid #FFFFFF;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: #CCCCCC;
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
