<template>
  <div class="screen-capture">
    <div class="capture-header">
      <div class="header-info">
        <h2 class="section-title">屏幕分享墙</h2>
        <p class="section-desc">捕获并分享你的屏幕内容</p>
      </div>
      <div class="header-actions">
        <input
          v-model="username"
          type="text"
          class="username-input"
          placeholder="输入你的名字"
          maxlength="20"
        />
        <button @click="captureScreen" class="capture-btn" :disabled="isCapturing">
          <span v-if="!isCapturing">📸 捕获屏幕</span>
          <span v-else>⏳ 捕获中...</span>
        </button>
        <button @click="refreshScreenshots" class="refresh-btn" :disabled="isLoading">
          🔄 刷新
        </button>
        <button @click="clearAllScreenshots" class="clear-btn" :disabled="screenshots.length === 0">
          🗑️ 清空全部
        </button>
      </div>
    </div>

    <!-- 状态消息 -->
    <div v-if="statusMessage" class="status-message" :class="statusType">
      {{ statusMessage }}
    </div>

    <!-- 截图网格 -->
    <div class="screenshots-container">
      <div v-if="isLoading && screenshots.length === 0" class="loading-state">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="screenshots.length === 0" class="empty-state">
        <div class="empty-icon">📸</div>
        <p class="empty-text">还没有截图</p>
        <p class="empty-hint">点击"捕获屏幕"按钮开始分享</p>
      </div>

      <div v-else class="screenshots-grid">
        <div
          v-for="screenshot in screenshots"
          :key="screenshot.id"
          class="screenshot-card"
        >
          <div class="screenshot-header">
            <div class="user-info">
              <span class="user-icon">👤</span>
              <span class="username">{{ screenshot.username }}</span>
            </div>
            <div class="screenshot-actions">
              <button @click="viewFullscreen(screenshot)" class="icon-btn" title="全屏查看">
                🔍
              </button>
              <button @click="deleteScreenshot(screenshot.id)" class="icon-btn delete-btn" title="删除">
                ✕
              </button>
            </div>
          </div>

          <div class="screenshot-image-wrapper" @click="viewFullscreen(screenshot)">
            <img :src="screenshot.imageData" :alt="`${screenshot.username}的截图`" class="screenshot-image" />
            <div class="image-overlay">
              <span class="view-hint">点击查看大图</span>
            </div>
          </div>

          <div class="screenshot-footer">
            <span class="time-info">🕐 {{ screenshot.uploadTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 全屏查看模态框 -->
    <div v-if="fullscreenImage" class="fullscreen-modal" @click="closeFullscreen">
      <div class="fullscreen-content">
        <button class="close-btn" @click="closeFullscreen">✕</button>
        <img :src="fullscreenImage.imageData" :alt="`${fullscreenImage.username}的截图`" class="fullscreen-image" />
        <div class="fullscreen-info">
          <span class="fullscreen-user">{{ fullscreenImage.username }}</span>
          <span class="fullscreen-time">{{ fullscreenImage.uploadTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const username = ref('访客');
const screenshots = ref([]);
const isCapturing = ref(false);
const isLoading = ref(false);
const statusMessage = ref('');
const statusType = ref('info');
const fullscreenImage = ref(null);
let refreshInterval = null;

// 显示状态消息
const showStatus = (message, type = 'info', duration = 3000) => {
  statusMessage.value = message;
  statusType.value = type;
  setTimeout(() => {
    statusMessage.value = '';
  }, duration);
};

// 捕获屏幕
const captureScreen = async () => {
  try {
    isCapturing.value = true;

    // 检查浏览器支持
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      showStatus('您的浏览器不支持屏幕捕获功能', 'error');
      return;
    }

    // 请求屏幕捕获权限
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        mediaSource: 'screen',
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    });

    // 创建视频元素
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;

    // 等待视频加载
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });

    // 等待一帧以确保视频已渲染
    await new Promise(resolve => setTimeout(resolve, 500));

    // 创建 Canvas 并捕获画面
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 停止视频流
    stream.getTracks().forEach(track => track.stop());

    // 转换为 Base64
    const imageData = canvas.toDataURL('image/png', 0.8);

    // 上传到服务器
    const response = await axios.post('/api/screenshots/upload', {
      imageData,
      username: username.value.trim() || '访客'
    });

    if (response.data.success) {
      showStatus('截图上传成功！', 'success');
      await refreshScreenshots();
    } else {
      showStatus('上传失败：' + response.data.message, 'error');
    }
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      showStatus('您取消了屏幕捕获', 'warning');
    } else if (error.name === 'NotSupportedError') {
      showStatus('您的浏览器不支持此功能', 'error');
    } else {
      console.error('捕获屏幕失败:', error);
      showStatus('捕获失败：' + error.message, 'error');
    }
  } finally {
    isCapturing.value = false;
  }
};

// 刷新截图列表
const refreshScreenshots = async () => {
  try {
    isLoading.value = true;
    const response = await axios.get('/api/screenshots/list?limit=50');
    if (response.data.success) {
      screenshots.value = response.data.screenshots;
    }
  } catch (error) {
    console.error('获取截图列表失败:', error);
    showStatus('加载失败：' + error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

// 删除截图
const deleteScreenshot = async (id) => {
  if (!confirm('确定要删除这张截图吗？')) {
    return;
  }

  try {
    const response = await axios.delete(`/api/screenshots/${id}`);
    if (response.data.success) {
      showStatus('删除成功', 'success');
      screenshots.value = screenshots.value.filter(s => s.id !== id);
    } else {
      showStatus('删除失败：' + response.data.message, 'error');
    }
  } catch (error) {
    console.error('删除截图失败:', error);
    showStatus('删除失败：' + error.message, 'error');
  }
};

// 清空所有截图
const clearAllScreenshots = async () => {
  if (!confirm(`确定要清空所有 ${screenshots.value.length} 张截图吗？此操作不可恢复！`)) {
    return;
  }

  try {
    const response = await axios.post('/api/screenshots/clear');
    if (response.data.success) {
      showStatus(response.data.message, 'success');
      screenshots.value = [];
    } else {
      showStatus('清空失败：' + response.data.message, 'error');
    }
  } catch (error) {
    console.error('清空截图失败:', error);
    showStatus('清空失败：' + error.message, 'error');
  }
};

// 全屏查看
const viewFullscreen = (screenshot) => {
  fullscreenImage.value = screenshot;
};

// 关闭全屏
const closeFullscreen = () => {
  fullscreenImage.value = null;
};

// 组件挂载
onMounted(() => {
  refreshScreenshots();
  // 每10秒自动刷新一次
  refreshInterval = setInterval(refreshScreenshots, 10000);
});

// 组件卸载
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
.screen-capture {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: #e0e0e0;
  overflow: hidden;
}

/* Header */
.capture-header {
  padding: 20px 30px;
  background: #2d2d2d;
  border-bottom: 2px solid #00ff88;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.header-info {
  flex: 1;
  min-width: 200px;
}

.section-title {
  margin: 0;
  font-size: 24px;
  color: #00ff88;
  font-weight: 600;
}

.section-desc {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #999;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.username-input {
  padding: 10px 15px;
  border: 1px solid #444;
  border-radius: 5px;
  background: #1a1a1a;
  color: #e0e0e0;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  min-width: 150px;
}

.username-input:focus {
  border-color: #00ff88;
}

.capture-btn,
.refresh-btn,
.clear-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.capture-btn {
  background: #00ff88;
  color: #1a1a1a;
}

.capture-btn:hover:not(:disabled) {
  background: #00dd77;
  transform: translateY(-2px);
}

.capture-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn {
  background: #3498db;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #2980b9;
}

.clear-btn {
  background: #e74c3c;
  color: white;
}

.clear-btn:hover:not(:disabled) {
  background: #c0392b;
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Status Message */
.status-message {
  padding: 12px 30px;
  text-align: center;
  font-size: 14px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-message.info {
  background: #3498db;
  color: white;
}

.status-message.success {
  background: #27ae60;
  color: white;
}

.status-message.warning {
  background: #f39c12;
  color: white;
}

.status-message.error {
  background: #e74c3c;
  color: white;
}

/* Screenshots Container */
.screenshots-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 30px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 15px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #444;
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 10px;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.3;
}

.empty-text {
  font-size: 18px;
  color: #999;
  margin: 0;
}

.empty-hint {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* Screenshots Grid */
.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.screenshot-card {
  background: #2d2d2d;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #444;
  transition: all 0.3s;
}

.screenshot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);
  border-color: #00ff88;
}

.screenshot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #242424;
  border-bottom: 1px solid #444;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-icon {
  font-size: 18px;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #00ff88;
}

.screenshot-actions {
  display: flex;
  gap: 5px;
}

.icon-btn {
  padding: 5px 10px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.3s;
}

.icon-btn:hover {
  background: #444;
  color: #e0e0e0;
}

.delete-btn:hover {
  background: #e74c3c;
  color: white;
}

.screenshot-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: #1a1a1a;
  cursor: pointer;
  overflow: hidden;
}

.screenshot-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s;
}

.screenshot-card:hover .screenshot-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.screenshot-image-wrapper:hover .image-overlay {
  opacity: 1;
}

.view-hint {
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.screenshot-footer {
  padding: 12px 15px;
  background: #242424;
  border-top: 1px solid #444;
}

.time-info {
  font-size: 13px;
  color: #999;
}

/* Fullscreen Modal */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
  cursor: pointer;
}

.fullscreen-content {
  position: relative;
  max-width: 95%;
  max-height: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.close-btn:hover {
  background: #c0392b;
}

.fullscreen-image {
  max-width: 100%;
  max-height: calc(95vh - 80px);
  object-fit: contain;
  border-radius: 5px;
  box-shadow: 0 0 50px rgba(0, 255, 136, 0.3);
}

.fullscreen-info {
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  background: rgba(45, 45, 45, 0.9);
  border-radius: 5px;
  font-size: 14px;
}

.fullscreen-user {
  color: #00ff88;
  font-weight: 500;
}

.fullscreen-time {
  color: #999;
}

/* Scrollbar */
.screenshots-container::-webkit-scrollbar {
  width: 10px;
}

.screenshots-container::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.screenshots-container::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 5px;
}

.screenshots-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive */
@media (max-width: 768px) {
  .screenshots-grid {
    grid-template-columns: 1fr;
  }

  .capture-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .username-input,
  .capture-btn,
  .refresh-btn,
  .clear-btn {
    width: 100%;
  }
}
</style>
