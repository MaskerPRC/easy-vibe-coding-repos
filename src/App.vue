<template>
  <div class="app">
    <!-- 页面标题 -->
    <header class="page-header">
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
      :timeline-items="timelineItems"
      :current-id="currentCrashId"
      @select="handleSelectCrash"
    />

    <!-- 崩溃画面展示区 -->
    <main class="main-content">
      <div class="content-wrapper">
        <transition name="fade" mode="out-in">
          <CrashCard
            :key="currentCrash.id"
            :crash-data="currentCrash"
          />
        </transition>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="page-footer">
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
import { ref, computed, onMounted } from 'vue';
import Timeline from './components/Timeline.vue';
import CrashCard from './components/CrashCard.vue';
import { getCrashScreensByYear } from './data/crashData.js';

// 获取所有崩溃画面数据（按年份排序）
const crashScreens = ref([]);
const currentCrashId = ref(1);

// 初始化数据
onMounted(() => {
  crashScreens.value = getCrashScreensByYear();
  if (crashScreens.value.length > 0) {
    currentCrashId.value = crashScreens.value[0].id;
  }
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

// 处理选择崩溃画面
const handleSelectCrash = (id) => {
  currentCrashId.value = id;
  // 平滑滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
}

@media (max-width: 480px) {
  .main-title {
    font-size: 26px;
  }

  .main-subtitle {
    font-size: 14px;
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

