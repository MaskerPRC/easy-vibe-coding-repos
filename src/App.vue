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
import FPSGame from './components/FPSGame.vue';
import DigitalCat from './components/DigitalCat.vue';
import LOLAnalysis from './components/LOLAnalysis.vue';
import MathModel from './components/MathModel.vue';
import Error502 from './components/Error502.vue';

// 当前页面
const currentPage = ref('digitalcat');

// 是否全屏模式（FPS游戏时）
const isFullscreen = computed(() => currentPage.value === 'fps');

// 页面列表
const pages = [
  { name: 'digitalcat', label: '数码猫咪', component: DigitalCat },
  { name: 'fps', label: 'FPS游戏', component: FPSGame },
  { name: 'lol', label: 'LOL分析', component: LOLAnalysis },
  { name: 'math', label: '数学模型', component: MathModel },
  { name: 'error502', label: '502错误', component: Error502 }
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
      sourceCode.value = data.source;
      sourceUrl.value = data.url;
      console.log('源码获取成功，长度:', data.length);
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

/* 源码显示区域 */
.source-display {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  margin: 15px 30px;
  padding: 15px;
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
}

.source-header h3 {
  color: #00ffff;
  font-family: 'Courier New', monospace;
  font-size: 1.2em;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.toggle-btn {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 255, 255, 0.3);
  border-radius: 6px;
  color: #00ffff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.toggle-btn:hover {
  background: rgba(0, 255, 255, 0.2);
  border-color: #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.source-content {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 6px;
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: auto;
}

.source-content pre {
  margin: 0;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.source-content code {
  color: #00ff00;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.source-error {
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid rgba(255, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  color: #ff6b6b;
  font-family: 'Courier New', monospace;
  margin-top: 10px;
}

.source-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.source-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.source-content::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 255, 0.5);
  border-radius: 4px;
}

.source-content::-webkit-scrollbar-thumb:hover {
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
