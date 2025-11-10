<template>
  <div class="webshell-app">
    <header class="app-header">
      <div class="header-left">
        <h1 class="app-title">WebShell Manager</h1>
        <p class="app-subtitle">文件管理 & 命令执行工具</p>
      </div>
      <div class="header-center">
        <div class="view-tabs">
          <button
            @click="currentView = 'files'"
            class="tab-btn"
            :class="{ active: currentView === 'files' }">
            📁 文件管理
          </button>
          <button
            @click="currentView = 'terminal'"
            class="tab-btn"
            :class="{ active: currentView === 'terminal' }">
            💻 命令执行
          </button>
          <button
            @click="currentView = 'system'"
            class="tab-btn"
            :class="{ active: currentView === 'system' }">
            ⚙️ 系统信息
          </button>
        </div>
      </div>
      <div class="header-right">
        <div class="status-indicator" :class="{ online: serverOnline }">
          <span class="status-dot"></span>
          {{ serverOnline ? '在线' : '离线' }}
        </div>
      </div>
    </header>

    <main class="app-body">
      <!-- 文件管理视图 -->
      <div v-show="currentView === 'files'" class="view-content">
        <FileManager />
      </div>

      <!-- 命令执行视图 -->
      <div v-show="currentView === 'terminal'" class="view-content">
        <CommandExecutor />
      </div>

      <!-- 系统信息视图 -->
      <div v-show="currentView === 'system'" class="view-content">
        <SystemInfo />
      </div>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <span>WebShell Manager v1.0.0</span>
        <span class="separator">|</span>
        <span>当前时间: {{ currentTime }}</span>
        <span class="separator">|</span>
        <span>仅供授权使用</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import FileManager from './components/FileManager.vue';
import CommandExecutor from './components/CommandExecutor.vue';
import SystemInfo from './components/SystemInfo.vue';
import axios from 'axios';

const currentView = ref('files');
const serverOnline = ref(false);
const currentTime = ref('');

let timeInterval;

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
  setInterval(checkServerStatus, 5000);

  // 每秒更新时间
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.webshell-app {
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

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.view-tabs {
  display: flex;
  gap: 10px;
  background: #1a1a1a;
  padding: 5px;
  border-radius: 8px;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: #999;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #2d2d2d;
  color: #e0e0e0;
}

.tab-btn.active {
  background: #00ff88;
  color: #1a1a1a;
  font-weight: 600;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
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

/* Body */
.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.view-content {
  flex: 1;
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
  .header-center,
  .header-right {
    flex: 1 1 100%;
  }

  .header-center {
    justify-content: flex-start;
  }

  .header-right {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .app-title {
    font-size: 22px;
  }

  .view-tabs {
    flex-direction: column;
    width: 100%;
  }

  .tab-btn {
    width: 100%;
  }
}
</style>
