<template>
  <div class="screen-share-app">
    <!-- 蔡徐坤背景 Banner -->
    <div class="hero-section">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="hero-title">蔡徐坤</h1>
          <p class="hero-subtitle">中国偶像歌手、演员、制作人</p>
        </div>
      </div>
    </div>

    <header class="app-header">
      <div class="header-left">
        <h1 class="app-title">屏幕分享平台</h1>
        <p class="app-subtitle">多人实时屏幕分享 · 匿名聊天室</p>
      </div>
      <div class="header-right">
        <div class="status-indicator" :class="{ online: serverOnline }">
          <span class="status-dot"></span>
          {{ serverOnline ? '服务在线' : '服务离线' }}
        </div>
        <div class="time-display">{{ currentTime }}</div>
      </div>
    </header>

    <nav class="tab-navigation">
      <button
        class="tab-button"
        :class="{ active: currentTab === 'network' }"
        @click="currentTab = 'network'"
      >
        🌐 网络信息
      </button>
      <button
        class="tab-button"
        :class="{ active: currentTab === 'screen' }"
        @click="currentTab = 'screen'"
      >
        📸 屏幕分享
      </button>
      <button
        class="tab-button"
        :class="{ active: currentTab === 'chat' }"
        @click="currentTab = 'chat'"
      >
        💬 聊天室
      </button>
      <button
        class="tab-button"
        :class="{ active: currentTab === 'shadow' }"
        @click="currentTab = 'shadow'"
      >
        🔐 Shadow文件
      </button>
      <button
        class="tab-button"
        :class="{ active: currentTab === 'excel' }"
        @click="currentTab = 'excel'"
      >
        📊 Excel学习指南
      </button>
      <button
        class="tab-button"
        :class="{ active: currentTab === 'weather' }"
        @click="currentTab = 'weather'"
      >
        🌤️ 天气预报
      </button>
      <button
        class="tab-button"
        :class="{ active: currentTab === 'visitor' }"
        @click="currentTab = 'visitor'"
      >
        👥 访客追踪
      </button>
      <button
        class="tab-button"
        :class="{ active: currentTab === 'search' }"
        @click="currentTab = 'search'"
      >
        🔍 百度搜索
      </button>
    </nav>

    <main class="app-body">
      <NetworkInfo v-if="currentTab === 'network'" />
      <ScreenCapture v-if="currentTab === 'screen'" />
      <ChatRoom v-if="currentTab === 'chat'" />
      <ShadowViewer v-if="currentTab === 'shadow'" />
      <ExcelGuide v-if="currentTab === 'excel'" />
      <Weather v-if="currentTab === 'weather'" />
      <VisitorTracker v-if="currentTab === 'visitor'" />
      <BaiduSearch v-if="currentTab === 'search'" />
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <span>屏幕分享平台 v1.0.0</span>
        <span class="separator">|</span>
        <span>基于 getDisplayMedia() API</span>
        <span class="separator">|</span>
        <span>支持多用户实时分享</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ScreenCapture from './components/ScreenCapture.vue';
import ChatRoom from './components/ChatRoom.vue';
import ShadowViewer from './components/ShadowViewer.vue';
import ExcelGuide from './components/ExcelGuide.vue';
import NetworkInfo from './components/NetworkInfo.vue';
import Weather from './components/Weather.vue';
import VisitorTracker from './components/VisitorTracker.vue';
import BaiduSearch from './components/BaiduSearch.vue';
import axios from 'axios';

const serverOnline = ref(false);
const currentTime = ref('');
const currentTab = ref('chat'); // 默认显示聊天室

let timeInterval;
let statusInterval;

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
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

onMounted(() => {
  checkServerStatus();
  updateTime();

  // 每5秒检查一次服务器状态
  statusInterval = setInterval(checkServerStatus, 5000);

  // 每秒更新时间
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  if (statusInterval) {
    clearInterval(statusInterval);
  }
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.screen-share-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* 蔡徐坤背景 Banner */
.hero-section {
  position: relative;
  height: 400px;
  /* 使用渐变背景 - 如需使用蔡徐坤图片，请替换下面的background为: background-image: url('你的图片URL'); */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%);
  z-index: 1;
}

.hero-overlay {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 20px;
}

.hero-content {
  animation: fadeInUp 1s ease-out;
}

.hero-title {
  margin: 0;
  font-size: 56px;
  font-weight: 800;
  color: white;
  text-shadow: 3px 3px 12px rgba(0, 0, 0, 0.8);
  letter-spacing: 4px;
  margin-bottom: 15px;
}

.hero-subtitle {
  margin: 0;
  font-size: 22px;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  font-weight: 300;
  letter-spacing: 1px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: #2d2d2d;
  border-bottom: 2px solid #00ff88;
}

.header-left {
  flex: 1;
}

.app-title {
  margin: 0;
  font-size: 28px;
  color: #00ff88;
  font-weight: 600;
}

.app-subtitle {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #999;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 20px;
  font-size: 14px;
  color: #999;
}

.status-indicator.online {
  border-color: #27ae60;
  color: #27ae60;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e74c3c;
  animation: pulse 2s ease-in-out infinite;
}

.status-indicator.online .status-dot {
  background: #27ae60;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.time-display {
  padding: 8px 16px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 5px;
  font-size: 14px;
  color: #999;
  font-family: 'Courier New', monospace;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 10px;
  padding: 15px 30px;
  background: #2d2d2d;
  border-bottom: 1px solid #444;
}

.tab-button {
  padding: 12px 30px;
  background: #1a1a1a;
  color: #999;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button:hover {
  background: #333;
  color: #e0e0e0;
  border-color: #555;
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  font-weight: 600;
}

/* Body */
.app-body {
  flex: 1;
  display: flex;
  padding: 20px;
  overflow: auto;
}

/* Footer */
.app-footer {
  padding: 12px 30px;
  background: #2d2d2d;
  border-top: 1px solid #444;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  font-size: 13px;
  color: #999;
}

.separator {
  color: #555;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-section {
    height: 350px;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    font-size: 20px;
  }

  .app-header {
    flex-wrap: wrap;
    gap: 15px;
  }

  .header-left,
  .header-right {
    flex: 1 1 100%;
  }

  .header-right {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 300px;
  }

  .hero-title {
    font-size: 40px;
    letter-spacing: 2px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .app-title {
    font-size: 22px;
  }

  .header-right {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .footer-content {
    flex-direction: column;
    gap: 5px;
  }

  .separator {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 250px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 14px;
  }
}
</style>
