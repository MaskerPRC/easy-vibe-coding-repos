<template>
  <div class="modern-app">
    <!-- 流星效果背景 -->
    <ShootingStars />

    <!-- 顶部导航栏 -->
    <header class="top-navbar">
      <div class="nav-brand">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gradient1)" />
            <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="url(#gradient2)" opacity="0.8"/>
            <defs>
              <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="12">
                <stop offset="0%" stop-color="#667eea" />
                <stop offset="100%" stop-color="#764ba2" />
              </linearGradient>
              <linearGradient id="gradient2" x1="2" y1="7" x2="22" y2="22">
                <stop offset="0%" stop-color="#f093fb" />
                <stop offset="100%" stop-color="#f5576c" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="brand-text">
          <h1 class="brand-title">协作空间</h1>
          <p class="brand-subtitle">Collaborative Space</p>
        </div>
      </div>

      <div class="nav-status">
        <div class="time-badge">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
          </svg>
          <span>{{ currentTime }}</span>
        </div>
        <div class="status-badge" :class="{ online: serverOnline }">
          <span class="status-dot"></span>
          <span>{{ serverOnline ? '在线' : '离线' }}</span>
        </div>
      </div>
    </header>

    <div class="main-container">
      <!-- 侧边导航栏 -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <button class="sidebar-toggle" @click="toggleSidebar">
          <svg v-if="!sidebarCollapsed" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5L21 15.59z"/>
          </svg>
        </button>

        <nav class="nav-menu">
          <div
            v-for="item in menuItems"
            :key="item.id"
            class="nav-item"
            :class="{ active: currentTab === item.id }"
            @click="currentTab = item.id"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label" v-show="!sidebarCollapsed">{{ item.label }}</span>
            <div class="nav-indicator"></div>
          </div>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="content-area">
        <!-- Hero 区域 -->
        <div class="hero-banner" v-if="showHero">
          <button class="hero-close" @click="showHero = false">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          <div class="hero-content">
            <div class="hero-badge">全新体验</div>
            <h2 class="hero-title">实时协作平台</h2>
            <p class="hero-description">
              多人在线协作 · 实时同步 · 高效沟通 · 无缝体验
            </p>
            <div class="hero-features">
              <div class="feature-tag">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
                实时同步
              </div>
              <div class="feature-tag">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
                多人协作
              </div>
              <div class="feature-tag">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
                云端存储
              </div>
            </div>
          </div>
          <div class="hero-illustration">
            <div class="float-card card-1"></div>
            <div class="float-card card-2"></div>
            <div class="float-card card-3"></div>
          </div>
        </div>

        <!-- 内容组件区域 -->
        <div class="component-wrapper">
          <transition name="fade" mode="out-in">
            <component :is="currentComponent" :key="currentTab" />
          </transition>
        </div>
      </main>
    </div>

    <!-- 底部信息栏 -->
    <footer class="bottom-footer">
      <div class="footer-info">
        <span class="footer-item">
          <svg class="footer-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          协作空间 v3.0
        </span>
        <span class="footer-divider">·</span>
        <span class="footer-item">Socket.IO 实时通信</span>
        <span class="footer-divider">·</span>
        <span class="footer-item">Vue 3 + Vite</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ShootingStars from './components/ShootingStars.vue';
import CollaborativeCanvas from './components/CollaborativeCanvas.vue';
import ChatRoom from './components/ChatRoom.vue';
import ScreenCapture from './components/ScreenCapture.vue';
import NetworkInfo from './components/NetworkInfo.vue';
import ShadowViewer from './components/ShadowViewer.vue';
import ExcelGuide from './components/ExcelGuide.vue';
import Weather from './components/Weather.vue';
import VisitorTracker from './components/VisitorTracker.vue';
import BaiduSearch from './components/BaiduSearch.vue';
import TaskManager from './components/TaskManager.vue';
import SkeuomorphicScreen from './components/SkeuomorphicScreen.vue';
import BlogPlatform from './components/BlogPlatform.vue';
import axios from 'axios';

const serverOnline = ref(false);
const currentTime = ref('');
const currentTab = ref('canvas');
const sidebarCollapsed = ref(false);
const showHero = ref(true);

let timeInterval;
let statusInterval;

// 菜单项配置
const menuItems = [
  { id: 'canvas', label: '协作画布', icon: '🎨' },
  { id: 'chat', label: '聊天室', icon: '💬' },
  { id: 'screen', label: '屏幕分享', icon: '📸' },
  { id: 'network', label: '网络信息', icon: '🌐' },
  { id: 'shadow', label: 'Shadow文件', icon: '🔐' },
  { id: 'excel', label: 'Excel指南', icon: '📊' },
  { id: 'weather', label: '天气预报', icon: '🌤️' },
  { id: 'visitor', label: '访客追踪', icon: '👥' },
  { id: 'search', label: '百度搜索', icon: '🔍' },
  { id: 'task', label: '任务管理', icon: '📋' },
  { id: 'skeuomorphic', label: '拟物电脑', icon: '🖥️' },
  { id: 'blog', label: '博客平台', icon: '📝' }
];

// 组件映射
const componentMap = {
  canvas: CollaborativeCanvas,
  chat: ChatRoom,
  screen: ScreenCapture,
  network: NetworkInfo,
  shadow: ShadowViewer,
  excel: ExcelGuide,
  weather: Weather,
  visitor: VisitorTracker,
  search: BaiduSearch,
  task: TaskManager,
  skeuomorphic: SkeuomorphicScreen,
  blog: BlogPlatform
};

// 当前组件
const currentComponent = computed(() => componentMap[currentTab.value]);

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

// 检查服务器状态
const checkServerStatus = async () => {
  try {
    const response = await axios.get('/api/health');
    serverOnline.value = response.data.success;
  } catch (error) {
    serverOnline.value = false;
  }
};

// 更新当前时间
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

onMounted(() => {
  checkServerStatus();
  updateTime();
  statusInterval = setInterval(checkServerStatus, 5000);
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
  if (statusInterval) clearInterval(statusInterval);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.modern-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%);
  color: #e4e4e7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
}

/* 顶部导航栏 */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 100%;
  height: 100%;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  letter-spacing: 0.05em;
}

.nav-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.time-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(15, 15, 30, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  font-size: 0.875rem;
  color: #cbd5e1;
}

.time-badge .icon {
  width: 18px;
  height: 18px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(15, 15, 30, 0.6);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-size: 0.875rem;
  color: #ef4444;
  transition: all 0.3s;
}

.status-badge.online {
  border-color: rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* 主容器 */
.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  width: 280px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(102, 126, 234, 0.2);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-toggle {
  margin: 1.5rem 1.5rem 1rem;
  padding: 0.75rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar-toggle:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.05);
}

.sidebar-toggle svg {
  width: 24px;
  height: 24px;
  display: block;
}

.nav-menu {
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem 1rem;
}

.nav-menu::-webkit-scrollbar {
  width: 6px;
}

.nav-menu::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.nav-menu::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: rgba(15, 15, 30, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
  transform: translateX(5px);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(240, 147, 251, 0.2) 100%);
  border-color: #667eea;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #667eea 0%, #f093fb 100%);
}

.nav-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.nav-label {
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  color: #e4e4e7;
}

.nav-item.active .nav-label {
  color: #fff;
  font-weight: 600;
}

.nav-indicator {
  position: absolute;
  right: 1rem;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s;
}

.nav-item.active .nav-indicator {
  background: #667eea;
}

/* 内容区域 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Hero Banner */
.hero-banner {
  position: relative;
  margin: 2rem;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: float-slow 20s ease-in-out infinite;
}

@keyframes float-slow {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-20px, -20px) rotate(180deg);
  }
}

.hero-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  background: rgba(15, 15, 30, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-close:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
  color: #ef4444;
}

.hero-close svg {
  width: 20px;
  height: 20px;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #a5b4fc;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-description {
  font-size: 1.125rem;
  color: #cbd5e1;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-features {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(15, 15, 30, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 10px;
  font-size: 0.875rem;
  color: #e4e4e7;
}

.feature-tag svg {
  width: 16px;
  height: 16px;
  color: #22c55e;
}

.hero-illustration {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.float-card {
  position: absolute;
  width: 100px;
  height: 120px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(240, 147, 251, 0.3) 100%);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.card-1 {
  animation: float-1 6s ease-in-out infinite;
}

.card-2 {
  left: 80px;
  top: -40px;
  animation: float-2 5s ease-in-out infinite;
}

.card-3 {
  left: 40px;
  top: 80px;
  animation: float-3 7s ease-in-out infinite;
}

@keyframes float-1 {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes float-2 {
  0%, 100% {
    transform: translateY(0) rotate(5deg);
  }
  50% {
    transform: translateY(20px) rotate(-5deg);
  }
}

@keyframes float-3 {
  0%, 100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-15px) rotate(3deg);
  }
}

/* 组件包装器 */
.component-wrapper {
  flex: 1;
  margin: 0 2rem 2rem;
  overflow: auto;
  border-radius: 16px;
  background: rgba(26, 26, 46, 0.5);
  border: 1px solid rgba(102, 126, 234, 0.2);
  backdrop-filter: blur(10px);
}

.component-wrapper::-webkit-scrollbar {
  width: 10px;
}

.component-wrapper::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.component-wrapper::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 5px;
}

.component-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 底部栏 */
.bottom-footer {
  padding: 1rem 2rem;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(102, 126, 234, 0.2);
}

.footer-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.footer-divider {
  color: rgba(148, 163, 184, 0.3);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }

  .sidebar.collapsed {
    width: 70px;
  }

  .hero-banner {
    margin: 1.5rem;
    padding: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-illustration {
    display: none;
  }
}

@media (max-width: 768px) {
  .top-navbar {
    padding: 1rem;
    flex-wrap: wrap;
  }

  .nav-status {
    width: 100%;
    justify-content: flex-start;
    margin-top: 0.5rem;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 70px;
    bottom: 45px;
    z-index: 50;
    width: 240px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.collapsed {
    transform: translateX(0);
    width: 240px;
  }

  .hero-banner {
    margin: 1rem;
    padding: 1.5rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .component-wrapper {
    margin: 0 1rem 1rem;
  }

  .footer-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-divider {
    display: none;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 1.25rem;
  }

  .brand-subtitle {
    font-size: 0.65rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-description {
    font-size: 0.875rem;
  }

  .hero-features {
    flex-direction: column;
  }

  .feature-tag {
    width: 100%;
  }
}
</style>
