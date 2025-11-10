<template>
  <div class="screen-share-app">
    <!-- 蔡徐坤照片展示区域 -->
    <div class="hero-section">
      <div class="photo-container">
        <img
          src="https://img1.baidu.com/it/u=3823064048,3738063826&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=667"
          alt="蔡徐坤"
          class="hero-photo"
        />
        <div class="photo-caption">
          <h2>蔡徐坤</h2>
          <p>中国偶像歌手、演员</p>
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
    </nav>

    <main class="app-body">
      <ScreenCapture v-if="currentTab === 'screen'" />
      <ChatRoom v-if="currentTab === 'chat'" />
      <ShadowViewer v-if="currentTab === 'shadow'" />
      <ExcelGuide v-if="currentTab === 'excel'" />
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

/* 蔡徐坤照片展示区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.hero-photo {
  width: 400px;
  height: auto;
  max-height: 600px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  object-fit: cover;
  border: 5px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero-photo:hover {
  transform: scale(1.05);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.7);
}

.photo-caption {
  text-align: center;
  color: white;
}

.photo-caption h2 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}

.photo-caption p {
  margin: 10px 0 0 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
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
  .hero-photo {
    width: 350px;
  }

  .photo-caption h2 {
    font-size: 32px;
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
    padding: 30px 15px;
  }

  .hero-photo {
    width: 280px;
    max-height: 420px;
  }

  .photo-caption h2 {
    font-size: 28px;
  }

  .photo-caption p {
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
</style>
