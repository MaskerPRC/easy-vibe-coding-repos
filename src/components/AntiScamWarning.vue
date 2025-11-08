<template>
  <div class="anti-scam-warning">
    <div class="warning-container">
      <!-- 顶部标题栏 -->
      <div class="header-bar">
        <div class="badge">
          <span class="badge-icon">🛡️</span>
          <span class="badge-text">国家安全反诈中心</span>
        </div>
      </div>

      <!-- 警告图标 -->
      <div class="warning-icon-container">
        <div class="warning-icon-pulse"></div>
        <div class="warning-icon">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <!-- 警告三角形 -->
            <polygon points="50,10 90,80 10,80" fill="#ff3838" stroke="#fff" stroke-width="3"/>
            <polygon points="50,15 85,75 15,75" fill="#ffa500" stroke="none"/>
            <!-- 感叹号 -->
            <rect x="47" y="30" width="6" height="28" fill="#fff" rx="3"/>
            <circle cx="50" cy="65" r="4" fill="#fff"/>
          </svg>
        </div>
      </div>

      <!-- 警告标题 -->
      <h1 class="warning-title">网络安全警告</h1>
      <h2 class="warning-subtitle">您正在访问违禁页面</h2>

      <!-- 警告内容 -->
      <div class="warning-content">
        <div class="warning-message">
          <p class="message-main">
            根据《中华人民共和国网络安全法》《中华人民共和国反电信网络诈骗法》相关规定，
            您正在访问的页面涉嫌违反国家法律法规。
          </p>
          <div class="danger-list">
            <div class="danger-item">
              <span class="danger-icon">⚠️</span>
              <span>该页面可能包含诈骗信息</span>
            </div>
            <div class="danger-item">
              <span class="danger-icon">⚠️</span>
              <span>可能导致个人信息泄露</span>
            </div>
            <div class="danger-item">
              <span class="danger-icon">⚠️</span>
              <span>可能造成财产损失</span>
            </div>
            <div class="danger-item">
              <span class="danger-icon">⚠️</span>
              <span>访问违禁内容可能承担法律责任</span>
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="tips-box">
          <h3 class="tips-title">🔒 安全提示</h3>
          <ul class="tips-list">
            <li>请勿轻信网络陌生人的投资理财建议</li>
            <li>请勿向陌生人转账汇款</li>
            <li>请勿泄露个人身份信息、银行卡号、验证码等</li>
            <li>遇到可疑情况请立即拨打 110 或 96110 反诈专线</li>
          </ul>
        </div>

        <!-- 按钮区域 -->
        <div class="action-buttons">
          <button class="btn btn-primary" @click="goBack">
            <span class="btn-icon">⬅️</span>
            立即返回安全页面
          </button>
          <button class="btn btn-secondary" @click="showReport">
            <span class="btn-icon">📢</span>
            举报此页面
          </button>
        </div>

        <!-- 举报对话框 -->
        <div v-if="reportVisible" class="report-modal">
          <div class="report-content">
            <h3>感谢您的举报</h3>
            <p>您的举报已记录，我们会尽快处理。</p>
            <p class="report-hotline">反诈专线：96110</p>
            <button class="btn btn-small" @click="reportVisible = false">关闭</button>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="footer-info">
        <p>国家安全反诈中心提醒您：网络诈骗套路多，不听不信不转账</p>
        <p class="footer-copyright">本页面由国家安全反诈中心提供技术支持</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const reportVisible = ref(false)

const goBack = () => {
  window.history.back()
}

const showReport = () => {
  reportVisible.value = true
  setTimeout(() => {
    reportVisible.value = false
  }, 3000)
}
</script>

<style scoped>
.anti-scam-warning {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
               'Microsoft YaHei', sans-serif;
  position: relative;
  overflow: hidden;
}

/* 背景动画效果 */
.anti-scam-warning::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 56, 56, 0.03) 10px,
    rgba(255, 56, 56, 0.03) 20px
  );
  animation: warningBg 20s linear infinite;
}

@keyframes warningBg {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.warning-container {
  max-width: 800px;
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  padding: 40px;
  position: relative;
  z-index: 1;
  border: 3px solid #ff3838;
}

/* 顶部徽章 */
.header-bar {
  text-align: center;
  margin-bottom: 30px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 18px;
  box-shadow: 0 4px 15px rgba(211, 47, 47, 0.4);
}

.badge-icon {
  font-size: 24px;
}

/* 警告图标容器 */
.warning-icon-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
}

.warning-icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(255, 56, 56, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.5;
  }
}

.warning-icon {
  position: relative;
  width: 200px;
  height: 200px;
  animation: shake 3s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-5deg); }
  20%, 40%, 60%, 80% { transform: rotate(5deg); }
}

.warning-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 10px 20px rgba(255, 56, 56, 0.5));
}

/* 警告标题 */
.warning-title {
  text-align: center;
  font-size: 36px;
  font-weight: 900;
  color: #d32f2f;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.warning-subtitle {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #ff5722;
  margin: 0 0 30px 0;
  animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 警告内容 */
.warning-content {
  margin-top: 30px;
}

.warning-message {
  background: #fff3e0;
  border-left: 5px solid #ff9800;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
}

.message-main {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin: 0 0 20px 0;
  font-weight: 500;
}

.danger-list {
  display: grid;
  gap: 12px;
}

.danger-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #d84315;
  font-weight: 600;
}

.danger-icon {
  font-size: 20px;
  flex-shrink: 0;
}

/* 提示框 */
.tips-box {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  border: 2px solid #2196f3;
}

.tips-title {
  font-size: 20px;
  color: #1565c0;
  margin: 0 0 15px 0;
  font-weight: bold;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  color: #0d47a1;
}

.tips-list li {
  margin-bottom: 10px;
  line-height: 1.6;
  font-size: 15px;
}

/* 按钮 */
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.btn {
  padding: 15px 35px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
}

.btn-small {
  padding: 10px 25px;
  font-size: 14px;
}

/* 举报对话框 */
.report-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.report-content {
  background: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.report-content h3 {
  color: #4caf50;
  margin: 0 0 15px 0;
  font-size: 24px;
}

.report-content p {
  color: #666;
  margin: 10px 0;
  line-height: 1.6;
}

.report-hotline {
  font-size: 20px;
  font-weight: bold;
  color: #d32f2f;
  margin: 20px 0 !important;
}

/* 底部信息 */
.footer-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
  text-align: center;
}

.footer-info p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}

.footer-copyright {
  font-size: 12px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .warning-container {
    padding: 30px 20px;
  }

  .warning-icon-container {
    width: 150px;
    height: 150px;
  }

  .warning-icon {
    width: 150px;
    height: 150px;
  }

  .warning-icon-pulse {
    width: 140px;
    height: 140px;
  }

  .warning-title {
    font-size: 28px;
  }

  .warning-subtitle {
    font-size: 22px;
  }

  .badge {
    font-size: 16px;
    padding: 10px 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
