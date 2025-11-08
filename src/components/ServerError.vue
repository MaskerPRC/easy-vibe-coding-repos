<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      <h1 class="error-code">404</h1>
      <h2 class="error-title">服务器无法访问</h2>
      <p class="error-message">抱歉，服务器已关闭或无法连接。</p>

      <div class="error-details">
        <div class="detail-item">
          <span class="detail-label">错误代码:</span>
          <span class="detail-value">ERR_CONNECTION_REFUSED</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">状态:</span>
          <span class="detail-value">服务器未响应</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">时间:</span>
          <span class="detail-value">{{ currentTime }}</span>
        </div>
      </div>

      <div class="error-suggestions">
        <h3>可能的原因:</h3>
        <ul>
          <li>服务器正在维护中</li>
          <li>网络连接已断开</li>
          <li>服务已停止运行</li>
          <li>请求的资源不存在</li>
        </ul>
      </div>

      <div class="error-actions">
        <button @click="reload" class="action-btn primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          重新加载
        </button>
        <button @click="goBack" class="action-btn secondary">返回首页</button>
      </div>

      <div class="error-footer">
        <p class="footer-text">如果问题持续存在，请联系系统管理员。</p>
        <p class="footer-code">HTTP ERROR 404</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref('');
let timeInterval = null;

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

const reload = () => {
  window.location.reload();
};

const goBack = () => {
  window.location.href = '/';
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  padding: 20px;
}

.error-container {
  max-width: 700px;
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 60px 40px;
  text-align: center;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon {
  color: #ff3b30;
  margin-bottom: 30px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 20px 0;
  line-height: 1;
  background: linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 16px 0;
}

.error-message {
  font-size: 18px;
  color: #6e6e73;
  margin: 0 0 40px 0;
  line-height: 1.5;
}

.error-details {
  background: #f5f5f7;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 14px;
}

.detail-value {
  color: #6e6e73;
  font-size: 14px;
  font-family: 'Monaco', 'Courier New', monospace;
}

.error-suggestions {
  background: #fff4e6;
  border-left: 4px solid #ff9500;
  border-radius: 4px;
  padding: 20px 24px;
  margin-bottom: 32px;
  text-align: left;
}

.error-suggestions h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 12px 0;
}

.error-suggestions ul {
  margin: 0;
  padding-left: 20px;
  color: #6e6e73;
}

.error-suggestions li {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.error-suggestions li:last-child {
  margin-bottom: 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
}

.action-btn {
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
}

.action-btn.primary {
  background: #0071e3;
  color: #ffffff;
}

.action-btn.primary:hover {
  background: #0077ed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
}

.action-btn.secondary {
  background: #f5f5f7;
  color: #1d1d1f;
}

.action-btn.secondary:hover {
  background: #e8e8ed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error-footer {
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.footer-text {
  font-size: 14px;
  color: #6e6e73;
  margin: 0 0 8px 0;
}

.footer-code {
  font-size: 12px;
  color: #a0a0a0;
  font-family: 'Monaco', 'Courier New', monospace;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-container {
    padding: 40px 30px;
  }

  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-message {
    font-size: 16px;
  }

  .error-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .error-container {
    padding: 30px 20px;
  }

  .error-code {
    font-size: 60px;
  }

  .error-title {
    font-size: 20px;
  }

  .detail-item {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
