<template>
  <div class="app" :class="{ 'fullscreen-mode': isFullscreen }">
    <!-- 页面标题 -->
    <header class="page-header" v-show="!isFullscreen">
      <div class="header-content">
        <h1 class="main-title">内核崩溃画面博物馆</h1>
        <p class="main-subtitle">探索操作系统历史上的错误艺术</p>
      </div>
      <div class="header-decoration">
        <div class="decoration-line"></div>
      </div>
    </header>

    <!-- 时间线导航 -->
    <Timeline
      v-show="!isFullscreen"
      :timeline-items="timelineItems"
      :current-id="currentCrashId"
      @select="handleSelectCrash"
    />

    <!-- 崩溃画面展示区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 全屏按钮 -->
        <button
          class="fullscreen-toggle"
          @click="toggleFullscreen"
          :title="isFullscreen ? '退出全屏 (ESC)' : '全屏显示 (F)'"
        >
          <svg v-if="!isFullscreen" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V6C8 7.10457 7.10457 8 6 8H3M16 3V6C16 7.10457 16.8954 8 18 8H21M21 16H18C16.8954 16 16 16.8954 16 18V21M3 16H6C7.10457 16 8 16.8954 8 18V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <transition name="fade" mode="out-in">
          <CrashCard
            :key="currentCrash.id"
            :crash-data="currentCrash"
          />
        </transition>

        <!-- 全屏模式下的导航提示 -->
        <div v-if="isFullscreen" class="fullscreen-hint">
          <div class="hint-content">
            <span class="hint-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              上一个
            </span>
            <span class="hint-divider">|</span>
            <span class="hint-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              下一个
            </span>
            <span class="hint-divider">|</span>
            <span class="hint-item">
              <kbd>ESC</kbd>
              退出全屏
            </span>
          </div>
          <div class="hint-progress">
            {{ currentIndex + 1 }} / {{ crashScreens.length }}
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="page-footer" v-show="!isFullscreen">
      <p class="footer-text">
        内核崩溃画面博物馆 © 2024 |
        展览 {{ crashScreens.length }} 个历史上的操作系统错误画面
      </p>
      <p class="footer-note">
        这些画面虽然代表着系统故障，但也是计算机历史和设计演进的重要见证
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Timeline from './components/Timeline.vue';
import CrashCard from './components/CrashCard.vue';
import { getCrashScreensByYear } from './data/crashData.js';

// 获取所有崩溃画面数据（按年份排序）
const crashScreens = ref([]);
const currentCrashId = ref(1);
const isFullscreen = ref(false);

// 初始化数据
onMounted(() => {
  crashScreens.value = getCrashScreensByYear();
  if (crashScreens.value.length > 0) {
    currentCrashId.value = crashScreens.value[0].id;
  }

  // 添加键盘监听
  window.addEventListener('keydown', handleKeyDown);

  // 监听全屏状态变化
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);
});

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
});

// 时间线项目
const timelineItems = computed(() => {
  return crashScreens.value.map(screen => ({
    id: screen.id,
    year: screen.year,
    os: screen.os
  }));
});

// 当前选中的崩溃画面
const currentCrash = computed(() => {
  return crashScreens.value.find(screen => screen.id === currentCrashId.value) || crashScreens.value[0] || {};
});

// 当前崩溃画面的索引
const currentIndex = computed(() => {
  return crashScreens.value.findIndex(screen => screen.id === currentCrashId.value);
});

// 处理选择崩溃画面
const handleSelectCrash = (id) => {
  currentCrashId.value = id;
  // 平滑滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 切换到上一个崩溃画面
const goToPrevious = () => {
  const prevIndex = currentIndex.value - 1;
  if (prevIndex >= 0) {
    currentCrashId.value = crashScreens.value[prevIndex].id;
  }
};

// 切换到下一个崩溃画面
const goToNext = () => {
  const nextIndex = currentIndex.value + 1;
  if (nextIndex < crashScreens.value.length) {
    currentCrashId.value = crashScreens.value[nextIndex].id;
  }
};

// 切换全屏模式
const toggleFullscreen = async () => {
  const elem = document.documentElement;

  if (!isFullscreen.value) {
    // 进入全屏
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      await elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen();
    }
    isFullscreen.value = true;
  } else {
    // 退出全屏
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    }
    isFullscreen.value = false;
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  const isCurrentlyFullscreen = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
  isFullscreen.value = isCurrentlyFullscreen;
};

// 键盘事件处理
const handleKeyDown = (event) => {
  // 只在全屏模式下响应方向键
  if (isFullscreen.value) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    } else if (event.key === 'Escape') {
      // ESC键退出全屏
      event.preventDefault();
      if (isFullscreen.value) {
        toggleFullscreen();
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #0A192F;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  overflow-x: hidden;
}

/* 全屏模式样式 */
.app.fullscreen-mode {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
}

.app.fullscreen-mode .main-content {
  padding: 0;
  max-width: 100%;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app.fullscreen-mode .content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 全屏按钮 */
.fullscreen-toggle {
  position: fixed;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 255, 204, 0.1);
  border: 2px solid #00FFCC;
  color: #00FFCC;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.fullscreen-toggle:hover {
  background: rgba(0, 255, 204, 0.2);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.4);
}

.fullscreen-toggle:active {
  transform: scale(0.95);
}

.fullscreen-mode .fullscreen-toggle {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.5);
  color: #FFFFFF;
}

.fullscreen-mode .fullscreen-toggle:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: #FFFFFF;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

/* 全屏模式下的导航提示 */
.fullscreen-hint {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 16px 32px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 24px;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.5s ease-out;
  z-index: 1000;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.hint-content {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #FFFFFF;
  font-size: 14px;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #E0E0E0;
}

.hint-item svg {
  color: #00FFCC;
}

.hint-divider {
  color: rgba(255, 255, 255, 0.3);
}

.hint-item kbd {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hint-progress {
  color: #00FFCC;
  font-weight: 600;
  padding-left: 16px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 14px;
}

/* 页面标题 */
.page-header {
  padding: 64px 32px 48px;
  text-align: center;
  position: relative;
  background: linear-gradient(180deg, rgba(26, 43, 66, 0.6) 0%, transparent 100%);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.main-title {
  color: #FFFFFF;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 2px;
  text-shadow: 0 0 30px rgba(0, 255, 204, 0.3);
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 30px rgba(0, 255, 204, 0.3);
  }
  50% {
    text-shadow: 0 0 40px rgba(0, 255, 204, 0.5);
  }
}

.main-subtitle {
  color: #B0B0B0;
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 1px;
}

.header-decoration {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.decoration-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00FFCC, transparent);
  animation: lineExpand 2s ease-in-out infinite;
}

@keyframes lineExpand {
  0%, 100% {
    width: 200px;
    opacity: 0.6;
  }
  50% {
    width: 300px;
    opacity: 1;
  }
}

/* 主内容区 */
.main-content {
  padding: 32px 16px 64px;
  max-width: 1400px;
  margin: 0 auto;
}

.content-wrapper {
  width: 100%;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 页脚 */
.page-footer {
  padding: 48px 32px;
  text-align: center;
  background: rgba(26, 43, 66, 0.5);
  border-top: 1px solid rgba(0, 255, 204, 0.2);
}

.footer-text {
  color: #E0E0E0;
  font-size: 14px;
  margin-bottom: 8px;
}

.footer-note {
  color: #B0B0B0;
  font-size: 13px;
  font-style: italic;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 48px 20px 32px;
  }

  .main-title {
    font-size: 32px;
    letter-spacing: 1px;
  }

  .main-subtitle {
    font-size: 15px;
  }

  .decoration-line {
    width: 150px;
  }

  @keyframes lineExpand {
    0%, 100% {
      width: 150px;
    }
    50% {
      width: 220px;
    }
  }

  .main-content {
    padding: 24px 12px 48px;
  }

  .page-footer {
    padding: 32px 20px;
  }

  .footer-text {
    font-size: 13px;
  }

  .footer-note {
    font-size: 12px;
  }

  .fullscreen-toggle {
    width: 40px;
    height: 40px;
    top: 16px;
    right: 16px;
  }

  .fullscreen-hint {
    bottom: 16px;
    padding: 12px 20px;
    flex-direction: column;
    gap: 12px;
  }

  .hint-content {
    font-size: 12px;
    gap: 12px;
  }

  .hint-progress {
    padding-left: 0;
    border-left: none;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 26px;
  }

  .main-subtitle {
    font-size: 14px;
  }

  .hint-item span:not(.hint-divider) {
    display: none;
  }

  .hint-content {
    gap: 8px;
  }
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #0A192F;
}

::-webkit-scrollbar-thumb {
  background: #00FFCC;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00D4AA;
}
</style>

