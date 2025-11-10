<template>
  <div class="screen-capture">
    <!-- 标题和操作区 -->
    <div class="header">
      <h2>屏幕捕获</h2>
      <div class="actions">
        <button @click="captureScreen" class="btn-capture" :disabled="capturing">
          {{ capturing ? '正在捕获...' : '捕获屏幕' }}
        </button>
        <button @click="refreshScreenshots" class="btn-refresh" :disabled="loading">
          {{ loading ? '刷新中...' : '刷新列表' }}
        </button>
        <label class="auto-refresh">
          <input type="checkbox" v-model="autoRefresh" />
          自动刷新 ({{ refreshInterval / 1000 }}秒)
        </label>
      </div>
    </div>

    <!-- 状态信息 -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <!-- 统计信息 -->
    <div class="stats">
      <span>共有 <strong>{{ screenshots.length }}</strong> 张截图</span>
      <span v-if="lastUpdate">最后更新: {{ lastUpdate }}</span>
    </div>

    <!-- 截图网格展示 -->
    <div class="screenshots-grid" v-if="screenshots.length > 0">
      <div v-for="screenshot in screenshots" :key="screenshot.id" class="screenshot-item">
        <div class="screenshot-header">
          <span class="username">{{ screenshot.username }}</span>
          <span class="time">{{ screenshot.uploadTime }}</span>
        </div>
        <div class="screenshot-image-wrapper">
          <img :src="screenshot.image" :alt="'Screenshot from ' + screenshot.username" />
        </div>
        <div class="screenshot-actions">
          <button @click="downloadImage(screenshot)" class="btn-download">下载</button>
          <button @click="deleteScreenshot(screenshot.id)" class="btn-delete">删除</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>暂无截图</p>
      <p class="hint">点击"捕获屏幕"按钮开始截图</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ScreenCapture',
  data() {
    return {
      screenshots: [],
      capturing: false,
      loading: false,
      message: '',
      messageType: 'info',
      autoRefresh: true,
      refreshInterval: 5000,
      refreshTimer: null,
      lastUpdate: ''
    };
  },
  mounted() {
    this.loadScreenshots();
    this.startAutoRefresh();
  },
  beforeUnmount() {
    this.stopAutoRefresh();
  },
  watch: {
    autoRefresh(enabled) {
      if (enabled) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    }
  },
  methods: {
    /**
     * 捕获屏幕
     */
    async captureScreen() {
      try {
        this.capturing = true;
        this.showMessage('正在请求屏幕共享权限...', 'info');

        // 请求屏幕共享
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            mediaSource: 'screen'
          }
        });

        this.showMessage('正在捕获屏幕...', 'info');

        // 获取视频轨道
        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);

        // 捕获一帧图像
        const bitmap = await imageCapture.grabFrame();

        // 创建 Canvas 并转换为图像
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);

        // 转换为 Base64
        const imageData = canvas.toDataURL('image/png');

        // 停止视频流
        stream.getTracks().forEach(track => track.stop());

        // 上传到服务器
        await this.uploadScreenshot(imageData);

      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.showMessage('用户取消了屏幕共享', 'error');
        } else if (error.name === 'NotSupportedError') {
          this.showMessage('您的浏览器不支持屏幕捕获功能', 'error');
        } else {
          this.showMessage('捕获失败: ' + error.message, 'error');
        }
        console.error('Screen capture error:', error);
      } finally {
        this.capturing = false;
      }
    },

    /**
     * 上传截图到服务器
     */
    async uploadScreenshot(imageData) {
      try {
        const response = await axios.post('/api/screenshots/upload', {
          image: imageData,
          username: this.getUsername()
        });

        if (response.data.success) {
          this.showMessage('截图上传成功！', 'success');
          // 立即刷新列表
          await this.loadScreenshots();
        } else {
          this.showMessage('上传失败: ' + response.data.message, 'error');
        }
      } catch (error) {
        this.showMessage('上传失败: ' + error.message, 'error');
        console.error('Upload error:', error);
      }
    },

    /**
     * 加载截图列表
     */
    async loadScreenshots() {
      try {
        this.loading = true;
        const response = await axios.get('/api/screenshots/list');

        if (response.data.success) {
          this.screenshots = response.data.screenshots;
          this.lastUpdate = new Date().toLocaleTimeString('zh-CN');
        }
      } catch (error) {
        console.error('Load screenshots error:', error);
        this.showMessage('加载截图列表失败', 'error');
      } finally {
        this.loading = false;
      }
    },

    /**
     * 刷新截图列表
     */
    async refreshScreenshots() {
      await this.loadScreenshots();
      this.showMessage('列表已刷新', 'success');
    },

    /**
     * 删除截图
     */
    async deleteScreenshot(id) {
      if (!confirm('确定要删除这张截图吗？')) {
        return;
      }

      try {
        const response = await axios.delete(`/api/screenshots/${id}`);

        if (response.data.success) {
          this.showMessage('删除成功', 'success');
          await this.loadScreenshots();
        } else {
          this.showMessage('删除失败: ' + response.data.message, 'error');
        }
      } catch (error) {
        this.showMessage('删除失败: ' + error.message, 'error');
        console.error('Delete error:', error);
      }
    },

    /**
     * 下载图像
     */
    downloadImage(screenshot) {
      const link = document.createElement('a');
      link.href = screenshot.image;
      link.download = `screenshot_${screenshot.username}_${screenshot.id}.png`;
      link.click();
    },

    /**
     * 获取用户名（可以从浏览器信息生成）
     */
    getUsername() {
      // 简单生成一个用户标识
      const userAgent = navigator.userAgent;
      const browser = this.getBrowserName();
      const randomId = Math.random().toString(36).substr(2, 4).toUpperCase();
      return `${browser}_${randomId}`;
    },

    /**
     * 获取浏览器名称
     */
    getBrowserName() {
      const ua = navigator.userAgent;
      if (ua.includes('Chrome')) return 'Chrome';
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Safari')) return 'Safari';
      if (ua.includes('Edge')) return 'Edge';
      return 'Browser';
    },

    /**
     * 显示消息
     */
    showMessage(text, type = 'info') {
      this.message = text;
      this.messageType = type;

      // 3秒后自动清除消息
      setTimeout(() => {
        if (this.message === text) {
          this.message = '';
        }
      }, 3000);
    },

    /**
     * 启动自动刷新
     */
    startAutoRefresh() {
      this.stopAutoRefresh();
      if (this.autoRefresh) {
        this.refreshTimer = setInterval(() => {
          this.loadScreenshots();
        }, this.refreshInterval);
      }
    },

    /**
     * 停止自动刷新
     */
    stopAutoRefresh() {
      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
    }
  }
};
</script>

<style scoped>
.screen-capture {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.header h2 {
  margin: 0;
  color: #00ff88;
  font-size: 24px;
}

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-capture {
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  color: #1a1a1a;
  font-weight: bold;
}

.btn-capture:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 136, 0.4);
}

.btn-capture:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-refresh {
  background: #333;
  color: #00ff88;
  border: 1px solid #00ff88;
}

.btn-refresh:hover:not(:disabled) {
  background: #00ff88;
  color: #1a1a1a;
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auto-refresh {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
}

.auto-refresh input[type="checkbox"] {
  cursor: pointer;
}

.message {
  padding: 12px 20px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
}

.message.info {
  background: rgba(0, 136, 255, 0.1);
  border-left: 4px solid #0088ff;
  color: #0088ff;
}

.message.success {
  background: rgba(0, 255, 136, 0.1);
  border-left: 4px solid #00ff88;
  color: #00ff88;
}

.message.error {
  background: rgba(255, 68, 68, 0.1);
  border-left: 4px solid #ff4444;
  color: #ff4444;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  font-size: 14px;
  color: #aaa;
}

.stats strong {
  color: #00ff88;
  font-weight: bold;
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.screenshot-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.screenshot-item:hover {
  border-color: #00ff88;
  box-shadow: 0 4px 20px rgba(0, 255, 136, 0.2);
  transform: translateY(-5px);
}

.screenshot-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.3);
  font-size: 12px;
}

.username {
  color: #00ff88;
  font-weight: bold;
}

.time {
  color: #888;
}

.screenshot-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screenshot-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s;
}

.screenshot-image-wrapper img:hover {
  transform: scale(1.05);
}

.screenshot-actions {
  display: flex;
  gap: 10px;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.3);
}

.screenshot-actions button {
  flex: 1;
  padding: 8px 15px;
  font-size: 12px;
}

.btn-download {
  background: #0088ff;
  color: white;
}

.btn-download:hover {
  background: #0066cc;
}

.btn-delete {
  background: #ff4444;
  color: white;
}

.btn-delete:hover {
  background: #cc0000;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state p {
  margin: 10px 0;
  font-size: 16px;
}

.empty-state .hint {
  font-size: 14px;
  color: #888;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .screenshots-grid {
    grid-template-columns: 1fr;
  }
}
</style>
