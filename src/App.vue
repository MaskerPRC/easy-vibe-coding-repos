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

    <!-- 源码显示区域 -->
    <div class="source-display" v-if="!isFullscreen && sourceCode">
      <div class="source-header">
        <h3>网站源码 ({{ sourceUrl }})</h3>
        <button @click="showSource = !showSource" class="toggle-btn">
          {{ showSource ? '隐藏' : '显示' }}
        </button>
      </div>
      <div v-if="showSource" class="source-content">
        <pre><code>{{ sourceCode }}</code></pre>
      </div>
      <div v-if="sourceError" class="source-error">
        错误: {{ sourceError }}
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="page-content" :class="{ fullscreen: isFullscreen }">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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

// 当前页面
const currentPage = ref('lolworlds');

// 是否全屏模式（FPS游戏时）
const isFullscreen = computed(() => currentPage.value === 'fps');

// 页面列表
const pages = [
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
  return page ? page.component : DigitalCat;
});

// 源码相关状态
const sourceCode = ref('');
const sourceUrl = ref('');
const sourceError = ref('');
const showSource = ref(true);

// 页面加载时自动获取源码
onMounted(async () => {
  try {
    console.log('正在获取外部网站源码...');
    const response = await fetch('/api/fetch-source');
    const data = await response.json();

    if (data.success) {
      // 只取前100个字符
      sourceCode.value = data.source.substring(0, 100);
      sourceUrl.value = data.url;
      console.log('源码获取成功，显示前100字');

      // 3秒后自动跳转 - 已禁用
      // setTimeout(() => {
      //   console.log('即将跳转到:', data.url);
      //   window.location.href = data.url;
      // }, 3000);
    } else {
      sourceError.value = data.message || '获取源码失败';
      console.error('获取源码失败:', data.message);
    }
  } catch (error) {
    sourceError.value = error.message;
    console.error('请求失败:', error);
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

/* 源码显示区域 - 蓝屏风格 */
.source-display {
  background: #0000AA;
  margin: 15px 30px;
  padding: 15px;
  border: 2px solid #FFFFFF;
  border-radius: 0;
  box-shadow: none;
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #AAAAAA;
}

.source-header h3 {
  color: #FFFFFF;
  font-family: 'Courier New', 'Fixedsys', monospace;
  font-size: 1.2em;
  text-shadow: none;
  letter-spacing: 1px;
}

.toggle-btn {
  padding: 8px 16px;
  background: #0000AA;
  border: 2px solid #AAAAAA;
  border-radius: 0;
  color: #FFFFFF;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.1s ease;
  font-family: 'Courier New', 'Fixedsys', monospace;
}

.toggle-btn:hover {
  background: #0000CC;
  border-color: #FFFFFF;
  box-shadow: none;
}

.source-content {
  background: #000088;
  border: 1px solid #AAAAAA;
  border-radius: 0;
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: auto;
}

.source-content pre {
  margin: 0;
  color: #FFFFFF;
  font-family: 'Courier New', 'Fixedsys', monospace;
  font-size: 0.9em;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.source-content code {
  color: #FFFFFF;
  text-shadow: none;
}

.source-error {
  background: #AA0000;
  border: 1px solid #FFFFFF;
  border-radius: 0;
  padding: 10px;
  color: #FFFFFF;
  font-family: 'Courier New', 'Fixedsys', monospace;
  margin-top: 10px;
}

.source-content::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.source-content::-webkit-scrollbar-track {
  background: #000066;
}

.source-content::-webkit-scrollbar-thumb {
  background: #AAAAAA;
  border-radius: 0;
  border: 1px solid #FFFFFF;
}

.source-content::-webkit-scrollbar-thumb:hover {
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

  .source-display {
    margin: 10px 15px;
    padding: 10px;
  }

  .source-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .source-content {
    max-height: 300px;
  }
}
</style>
