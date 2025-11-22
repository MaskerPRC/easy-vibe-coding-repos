<template>
  <div class="app">
    <!-- 网格背景 -->
    <div class="grid-background"></div>

    <!-- 故障效果层 -->
    <div class="glitch-overlay"></div>

    <!-- 主容器 -->
    <div class="neural-container">
      <!-- 顶部终端栏 -->
      <div class="terminal-header">
        <span class="terminal-indicator"></span>
        <span class="terminal-text">SYSTEM/NEURAL_TEA_LAB/v2.0</span>
      </div>

      <!-- 主标题区域 -->
      <div class="main-title-area">
        <h1 class="glitch-title" data-text="NEURAL TEA LAB">NEURAL TEA LAB</h1>
        <div class="subtitle">神经元茶室 // 碳基充电站</div>
      </div>

      <!-- 状态面板 -->
      <div class="status-panel">
        <div class="status-item">
          <span class="status-label">&gt; 系统状态:</span>
          <span class="status-value status-online">ONLINE</span>
        </div>
        <div class="status-item">
          <span class="status-label">&gt; 算力中心:</span>
          <span class="status-value status-active">ACTIVE</span>
        </div>
        <div class="status-item">
          <span class="status-label">&gt; 液体芯片:</span>
          <span class="status-value status-ready">READY</span>
        </div>
      </div>

      <!-- 代码终端区域 -->
      <div class="code-terminal">
        <div class="code-line">
          <span class="code-prompt">$</span>
          <span class="code-text">init --neural-tea-protocol</span>
        </div>
        <div class="code-line">
          <span class="code-comment">// 茶 = 液体芯片</span>
        </div>
        <div class="code-line">
          <span class="code-comment">// 喝茶 = 碳基生物充电</span>
        </div>
        <div class="code-line">
          <span class="code-prompt">$</span>
          <span class="code-text typing-effect">加载神经网络...</span>
        </div>
      </div>

      <!-- 数据可视化面板 -->
      <div class="data-viz">
        <div class="data-bar" v-for="i in 12" :key="i" :style="{animationDelay: (i * 0.1) + 's'}"></div>
      </div>

      <!-- 底部信息 -->
      <div class="footer-info">
        <div class="info-text">
          <span class="neon-green">// </span>
          <span>碳基生物充电中枢 - CARBON BASED CHARGING HUB</span>
        </div>
        <div class="info-text">
          <span class="neon-purple">// </span>
          <span>算力空间正在初始化 - COMPUTING SPACE INITIALIZING</span>
        </div>
      </div>
    </div>

    <!-- 扫描线效果 -->
    <div class="scan-line"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // 添加随机故障效果
  setInterval(() => {
    const glitchOverlay = document.querySelector('.glitch-overlay');
    if (glitchOverlay && Math.random() > 0.7) {
      glitchOverlay.style.opacity = '1';
      setTimeout(() => {
        glitchOverlay.style.opacity = '0';
      }, 100);
    }
  }, 3000);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Fira Code', 'JetBrains Mono', 'Courier New', monospace;
  position: relative;
  overflow: hidden;
}

/* 网格背景 */
.grid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(0, 255, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 0, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

/* 故障效果层 */
.glitch-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 0, 0.1) 0px,
    rgba(191, 0, 255, 0.1) 2px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.1s;
  z-index: 10;
}

/* 扫描线 */
.scan-line {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to bottom, transparent, rgba(0, 255, 0, 0.8), transparent);
  animation: scan 4s linear infinite;
  pointer-events: none;
  z-index: 5;
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}

/* 主容器 */
.neural-container {
  width: 100%;
  max-width: 900px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00FF00;
  box-shadow:
    0 0 20px rgba(0, 255, 0, 0.5),
    0 0 40px rgba(0, 255, 0, 0.3),
    inset 0 0 60px rgba(0, 255, 0, 0.1);
  padding: 30px;
  position: relative;
  backdrop-filter: blur(10px);
  z-index: 1;
}

/* 终端头部 */
.terminal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);
}

.terminal-indicator {
  width: 12px;
  height: 12px;
  background: #00FF00;
  border-radius: 50%;
  box-shadow: 0 0 10px #00FF00;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.terminal-text {
  color: #00FF00;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* 主标题区域 */
.main-title-area {
  text-align: center;
  margin-bottom: 40px;
}

.glitch-title {
  font-size: 48px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 8px;
  text-transform: uppercase;
  position: relative;
  animation: glitch-anim 5s infinite;
  text-shadow:
    0 0 10px #00FF00,
    0 0 20px #00FF00,
    0 0 30px #00FF00;
}

.glitch-title::before,
.glitch-title::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-title::before {
  animation: glitch-anim-1 3s infinite;
  color: #00FF00;
  z-index: -1;
}

.glitch-title::after {
  animation: glitch-anim-2 2s infinite;
  color: #BF00FF;
  z-index: -2;
}

@keyframes glitch-anim {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-2px, 2px);
  }
  94% {
    transform: translate(2px, -2px);
  }
  96% {
    transform: translate(-2px, -2px);
  }
}

@keyframes glitch-anim-1 {
  0%, 90%, 100% {
    clip-path: inset(0 0 0 0);
  }
  92% {
    clip-path: inset(10% 0 85% 0);
  }
  94% {
    clip-path: inset(80% 0 15% 0);
  }
}

@keyframes glitch-anim-2 {
  0%, 90%, 100% {
    clip-path: inset(0 0 0 0);
  }
  91% {
    clip-path: inset(40% 0 55% 0);
  }
  93% {
    clip-path: inset(20% 0 70% 0);
  }
}

.subtitle {
  color: #BF00FF;
  font-size: 18px;
  margin-top: 15px;
  letter-spacing: 4px;
  text-shadow: 0 0 10px #BF00FF;
}

/* 状态面板 */
.status-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.status-item {
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.3);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.status-item:hover {
  background: rgba(0, 255, 0, 0.1);
  border-color: #00FF00;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
}

.status-label {
  color: #00FF00;
  font-size: 14px;
}

.status-value {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 2px;
}

.status-online {
  color: #00FF00;
  text-shadow: 0 0 5px #00FF00;
}

.status-active {
  color: #BF00FF;
  text-shadow: 0 0 5px #BF00FF;
}

.status-ready {
  color: #FFFFFF;
  text-shadow: 0 0 5px #FFFFFF;
}

/* 代码终端 */
.code-terminal {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 255, 0, 0.3);
  padding: 20px;
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 1.8;
}

.code-line {
  color: #00FF00;
  margin-bottom: 8px;
}

.code-prompt {
  color: #BF00FF;
  margin-right: 10px;
  font-weight: 700;
}

.code-text {
  color: #FFFFFF;
}

.code-comment {
  color: rgba(0, 255, 0, 0.6);
  font-style: italic;
}

.typing-effect {
  animation: typing 2s steps(20) infinite;
  border-right: 2px solid #00FF00;
  padding-right: 5px;
}

@keyframes typing {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* 数据可视化 */
.data-viz {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 100px;
  margin-bottom: 30px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(191, 0, 255, 0.3);
}

.data-bar {
  flex: 1;
  background: linear-gradient(to top, #BF00FF, #00FF00);
  margin: 0 2px;
  animation: bar-pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(191, 0, 255, 0.5);
}

@keyframes bar-pulse {
  0%, 100% {
    height: 20%;
  }
  50% {
    height: 80%;
  }
}

/* 底部信息 */
.footer-info {
  border-top: 1px solid rgba(0, 255, 0, 0.3);
  padding-top: 20px;
  font-size: 12px;
  line-height: 1.8;
}

.info-text {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.neon-green {
  color: #00FF00;
  text-shadow: 0 0 5px #00FF00;
}

.neon-purple {
  color: #BF00FF;
  text-shadow: 0 0 5px #BF00FF;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .neural-container {
    padding: 20px;
  }

  .glitch-title {
    font-size: 32px;
    letter-spacing: 4px;
  }

  .subtitle {
    font-size: 14px;
    letter-spacing: 2px;
  }

  .status-panel {
    grid-template-columns: 1fr;
  }

  .code-terminal {
    font-size: 12px;
    padding: 15px;
  }

  .data-viz {
    height: 80px;
  }

  .footer-info {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .neural-container {
    padding: 15px;
  }

  .glitch-title {
    font-size: 24px;
    letter-spacing: 2px;
  }

  .subtitle {
    font-size: 12px;
  }

  .terminal-header {
    margin-bottom: 20px;
  }

  .terminal-text {
    font-size: 10px;
  }

  .status-item {
    padding: 10px;
  }

  .status-label,
  .status-value {
    font-size: 11px;
  }

  .code-terminal {
    font-size: 11px;
    padding: 12px;
  }

  .data-viz {
    height: 60px;
  }
}

/* 角落装饰 */
.neural-container::before,
.neural-container::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #BF00FF;
  box-shadow: 0 0 10px #BF00FF;
}

.neural-container::before {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.neural-container::after {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}
</style>
