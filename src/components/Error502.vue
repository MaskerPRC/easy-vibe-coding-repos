<template>
  <div class="error-502-container">
    <div class="error-content">
      <!-- 错误代码动画 -->
      <div class="error-code">
        <span class="code-number">502</span>
        <span class="code-text">Bad Gateway</span>
      </div>

      <!-- 错误图标 -->
      <div class="error-icon">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#ff4757" stroke-width="4" opacity="0.3"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="#ff4757" stroke-width="4" opacity="0.5"/>
          <circle cx="100" cy="100" r="40" fill="none" stroke="#ff4757" stroke-width="4" opacity="0.7"/>
          <path d="M 70 80 L 130 80 L 130 100 L 70 100 Z" fill="#ff4757"/>
          <circle cx="85" cy="90" r="8" fill="#0a0e27"/>
          <circle cx="115" cy="90" r="8" fill="#0a0e27"/>
          <path d="M 75 130 Q 100 110 125 130" stroke="#ff4757" stroke-width="4" fill="none" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- 错误信息 -->
      <div class="error-message">
        <h2>网关错误</h2>
        <p class="main-text">服务器作为网关或代理，从上游服务器收到无效响应</p>
      </div>

      <!-- 可能原因 -->
      <div class="error-details">
        <div class="detail-box">
          <h3>可能的原因：</h3>
          <ul>
            <li>后端服务器未启动或已崩溃</li>
            <li>网关配置错误</li>
            <li>上游服务器超时</li>
            <li>网络连接问题</li>
          </ul>
        </div>

        <div class="detail-box">
          <h3>解决方案：</h3>
          <ul>
            <li>检查后端服务是否正常运行</li>
            <li>验证服务器配置是否正确</li>
            <li>查看服务器日志获取详细信息</li>
            <li>尝试重启相关服务</li>
          </ul>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="btn-primary" @click="refreshPage">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
          刷新页面
        </button>
        <button class="btn-secondary" @click="goHome">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          返回首页
        </button>
      </div>

      <!-- 实时状态检测 -->
      <div class="status-check">
        <div class="status-indicator" :class="{ checking: isChecking, online: isOnline, offline: !isOnline && !isChecking }">
          <span class="status-dot"></span>
          <span class="status-text">{{ statusText }}</span>
        </div>
        <button class="btn-check" @click="checkStatus" :disabled="isChecking">检测服务状态</button>
      </div>

      <!-- 错误统计 -->
      <div class="error-stats">
        <div class="stat-item">
          <span class="stat-label">错误时间</span>
          <span class="stat-value">{{ errorTime }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">错误代码</span>
          <span class="stat-value">HTTP 502</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">尝试次数</span>
          <span class="stat-value">{{ retryCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isChecking = ref(false);
const isOnline = ref(false);
const statusText = ref('未检测');
const errorTime = ref('');
const retryCount = ref(0);

onMounted(() => {
  // 设置错误时间
  const now = new Date();
  errorTime.value = now.toLocaleString('zh-CN');
});

const refreshPage = () => {
  retryCount.value++;
  window.location.reload();
};

const goHome = () => {
  window.location.href = '/';
};

const checkStatus = async () => {
  isChecking.value = true;
  statusText.value = '检测中...';

  try {
    const response = await fetch('/api/health', {
      method: 'GET',
      timeout: 5000
    });

    if (response.ok) {
      isOnline.value = true;
      statusText.value = '服务正常';
      setTimeout(() => {
        refreshPage();
      }, 1000);
    } else {
      isOnline.value = false;
      statusText.value = '服务异常';
    }
  } catch (error) {
    isOnline.value = false;
    statusText.value = '连接失败';
  } finally {
    isChecking.value = false;
  }
};
</script>

<style scoped>
.error-502-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}

.error-content {
  max-width: 800px;
  width: 100%;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 2px solid rgba(255, 71, 87, 0.3);
  box-shadow: 0 10px 40px rgba(255, 71, 87, 0.2);
  backdrop-filter: blur(10px);
}

/* 错误代码 */
.error-code {
  text-align: center;
  margin-bottom: 30px;
}

.code-number {
  display: block;
  font-size: 8em;
  font-weight: bold;
  color: #ff4757;
  text-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
  font-family: 'Courier New', monospace;
  animation: pulse 2s ease-in-out infinite;
}

.code-text {
  display: block;
  font-size: 2em;
  color: #ff6b81;
  margin-top: 10px;
  font-family: 'Courier New', monospace;
  letter-spacing: 3px;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* 错误图标 */
.error-icon {
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 错误信息 */
.error-message {
  text-align: center;
  margin-bottom: 40px;
}

.error-message h2 {
  font-size: 2em;
  color: #ff4757;
  margin-bottom: 15px;
  font-family: 'Courier New', monospace;
}

.main-text {
  font-size: 1.2em;
  color: #a4b0be;
  line-height: 1.6;
}

/* 错误详情 */
.error-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.detail-box {
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 71, 87, 0.2);
}

.detail-box h3 {
  color: #ff6b81;
  font-size: 1.2em;
  margin-bottom: 15px;
  font-family: 'Courier New', monospace;
}

.detail-box ul {
  list-style: none;
  padding: 0;
}

.detail-box li {
  color: #a4b0be;
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  line-height: 1.5;
}

.detail-box li::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: #ff4757;
  font-weight: bold;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Courier New', monospace;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
  color: white;
  box-shadow: 0 5px 20px rgba(255, 71, 87, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 71, 87, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ff6b81;
  border: 2px solid #ff4757;
}

.btn-secondary:hover {
  background: rgba(255, 71, 87, 0.2);
  transform: translateY(-2px);
}

/* 状态检测 */
.status-check {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #a4b0be;
}

.status-indicator.checking .status-dot {
  background: #ffa502;
  animation: blink 1s infinite;
}

.status-indicator.online .status-dot {
  background: #2ed573;
  box-shadow: 0 0 10px rgba(46, 213, 115, 0.5);
}

.status-indicator.offline .status-dot {
  background: #ff4757;
  box-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-text {
  color: #a4b0be;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.btn-check {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 71, 87, 0.5);
  border-radius: 10px;
  color: #ff6b81;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-check:hover:not(:disabled) {
  background: rgba(255, 71, 87, 0.2);
  border-color: #ff4757;
  transform: translateY(-2px);
}

.btn-check:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 错误统计 */
.error-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  border: 1px solid rgba(255, 71, 87, 0.2);
}

.stat-label {
  display: block;
  color: #a4b0be;
  font-size: 0.9em;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
}

.stat-value {
  display: block;
  color: #ff6b81;
  font-size: 1.2em;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-content {
    padding: 20px;
  }

  .code-number {
    font-size: 5em;
  }

  .code-text {
    font-size: 1.5em;
  }

  .error-icon {
    width: 150px;
    height: 150px;
  }

  .error-message h2 {
    font-size: 1.5em;
  }

  .main-text {
    font-size: 1em;
  }

  .error-details {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .status-check {
    flex-direction: column;
  }
}
</style>
