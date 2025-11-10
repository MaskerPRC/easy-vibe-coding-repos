<template>
  <div class="screen-share-app">
    <header class="app-header">
      <div class="header-left">
        <h1 class="app-title">屏幕分享平台</h1>
        <p class="app-subtitle">多人实时屏幕分享</p>
      </div>
      <div class="header-right">
        <div class="status-indicator" :class="{ online: serverOnline }">
          <span class="status-dot"></span>
          {{ serverOnline ? '服务在线' : '服务离线' }}
        </div>
        <div class="time-display">{{ currentTime }}</div>
      </div>
    </header>

    <main class="app-body">
      <ScreenCapture />
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
import axios from 'axios';

const serverOnline = ref(false);
const currentTime = ref('');

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

/* Body */
.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
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
