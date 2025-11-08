<template>
  <div class="hacker-container">
    <!-- 矩阵雨背景 -->
    <canvas ref="matrixCanvas" class="matrix-bg"></canvas>

    <!-- 主要内容 -->
    <div class="content-overlay">
      <div class="terminal-window">
        <div class="terminal-header">
          <div class="terminal-buttons">
            <span class="btn red"></span>
            <span class="btn yellow"></span>
            <span class="btn green"></span>
          </div>
          <div class="terminal-title">root@system:~</div>
        </div>

        <div class="terminal-body">
          <div class="terminal-line" v-for="(line, index) in terminalLines" :key="index">
            <span class="prompt" v-if="line.prompt">{{ line.prompt }}</span>
            <span :class="line.class">{{ line.text }}</span>
          </div>
          <div class="terminal-line">
            <span class="prompt">root@system:~$</span>
            <span class="cursor">_</span>
          </div>
        </div>
      </div>

      <!-- 系统信息面板 -->
      <div class="info-panels">
        <div class="panel">
          <div class="panel-header">SYSTEM STATUS</div>
          <div class="panel-content">
            <div class="status-item">
              <span class="label">CPU:</span>
              <span class="value">{{ systemStats.cpu }}%</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: systemStats.cpu + '%' }"></div>
              </div>
            </div>
            <div class="status-item">
              <span class="label">MEMORY:</span>
              <span class="value">{{ systemStats.memory }}%</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: systemStats.memory + '%' }"></div>
              </div>
            </div>
            <div class="status-item">
              <span class="label">NETWORK:</span>
              <span class="value">{{ systemStats.network }}%</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: systemStats.network + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">ACCESS LOG</div>
          <div class="panel-content log-content">
            <div v-for="(log, index) in accessLogs" :key="index" class="log-line">
              <span class="log-time">[{{ log.time }}]</span>
              <span :class="'log-' + log.type">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部信息 -->
      <div class="footer-info">
        <div class="glitch" data-text="SYSTEM ACCESS GRANTED">SYSTEM ACCESS GRANTED</div>
        <div class="timestamp">{{ currentTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const matrixCanvas = ref(null);
const currentTime = ref('');
const systemStats = ref({
  cpu: 0,
  memory: 0,
  network: 0
});

const terminalLines = ref([
  { prompt: 'root@system:~$', text: 'accessing mainframe...', class: 'command' },
  { text: 'Connecting to secure server...', class: 'output' },
  { text: '> Establishing encrypted tunnel...', class: 'success' },
  { text: '> Authentication successful', class: 'success' },
  { text: '> Loading system modules...', class: 'output' },
  { text: 'WARNING: Unauthorized access detected', class: 'warning' },
  { text: 'Firewall bypassed [OK]', class: 'success' },
  { text: 'Decrypting database...', class: 'output' },
  { text: '████████████████████ 100%', class: 'success' },
  { prompt: 'root@system:~$', text: 'status --all', class: 'command' },
  { text: 'All systems operational', class: 'success' },
  { text: 'Kernel: 5.15.0-hacker', class: 'output' },
  { text: 'Uptime: 1337 days', class: 'output' },
]);

const accessLogs = ref([
  { time: '13:37:01', type: 'success', message: 'SSH connection established' },
  { time: '13:37:15', type: 'warning', message: 'Multiple login attempts detected' },
  { time: '13:37:42', type: 'success', message: 'Root access granted' },
  { time: '13:38:23', type: 'info', message: 'Scanning network ports...' },
  { time: '13:38:56', type: 'success', message: 'Port 8080 open' },
  { time: '13:39:12', type: 'error', message: 'Intrusion detection bypassed' },
]);

let matrixInterval = null;
let statsInterval = null;
let timeInterval = null;

// 矩阵雨效果
const initMatrix = () => {
  const canvas = matrixCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  };

  matrixInterval = setInterval(draw, 33);
};

// 更新系统统计
const updateStats = () => {
  systemStats.value.cpu = Math.floor(Math.random() * 30) + 50;
  systemStats.value.memory = Math.floor(Math.random() * 25) + 60;
  systemStats.value.network = Math.floor(Math.random() * 40) + 30;
};

// 更新时间
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-US', { hour12: false });
};

// 窗口大小改变时重新初始化矩阵
const handleResize = () => {
  if (matrixCanvas.value) {
    matrixCanvas.value.width = window.innerWidth;
    matrixCanvas.value.height = window.innerHeight;
  }
};

onMounted(() => {
  initMatrix();
  updateTime();
  updateStats();

  statsInterval = setInterval(updateStats, 2000);
  timeInterval = setInterval(updateTime, 1000);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (matrixInterval) clearInterval(matrixInterval);
  if (statsInterval) clearInterval(statsInterval);
  if (timeInterval) clearInterval(timeInterval);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.hacker-container {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  background-color: #000;
  overflow: hidden;
  font-family: 'Courier New', monospace;
}

.matrix-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.content-overlay {
  position: relative;
  z-index: 2;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
}

/* 终端窗口 */
.terminal-window {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #0f0;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.terminal-header {
  background: #1a1a1a;
  padding: 10px 15px;
  border-bottom: 1px solid #0f0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.terminal-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.btn.red { background: #ff5f56; }
.btn.yellow { background: #ffbd2e; }
.btn.green { background: #27c93f; }

.terminal-title {
  color: #0f0;
  font-size: 14px;
  flex: 1;
  text-align: center;
}

.terminal-body {
  padding: 20px;
  color: #0f0;
  font-size: 14px;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
}

.terminal-line {
  margin-bottom: 5px;
}

.prompt {
  color: #00ff00;
  margin-right: 8px;
}

.command {
  color: #00ff00;
}

.output {
  color: #0ff;
}

.success {
  color: #0f0;
}

.warning {
  color: #ff0;
}

.error {
  color: #f00;
}

.cursor {
  color: #0f0;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* 信息面板 */
.info-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.panel {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #0f0;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
  overflow: hidden;
}

.panel-header {
  background: #0a0a0a;
  color: #0f0;
  padding: 12px 15px;
  font-weight: bold;
  border-bottom: 1px solid #0f0;
  text-align: center;
  letter-spacing: 2px;
}

.panel-content {
  padding: 15px;
  color: #0ff;
  font-size: 13px;
}

.status-item {
  margin-bottom: 15px;
}

.label {
  color: #0f0;
  margin-right: 10px;
}

.value {
  color: #0ff;
  float: right;
}

.progress-bar {
  background: #1a1a1a;
  height: 8px;
  border-radius: 4px;
  margin-top: 5px;
  overflow: hidden;
  border: 1px solid #0f0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f0, #0ff);
  transition: width 0.5s ease;
  box-shadow: 0 0 10px #0f0;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
}

.log-line {
  margin-bottom: 8px;
  font-size: 12px;
}

.log-time {
  color: #666;
  margin-right: 8px;
}

.log-success { color: #0f0; }
.log-warning { color: #ff0; }
.log-error { color: #f00; }
.log-info { color: #0ff; }

/* 底部信息 */
.footer-info {
  text-align: center;
  margin-top: auto;
  padding: 20px;
}

.glitch {
  color: #0f0;
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 5px;
  position: relative;
  animation: glitch 2s infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  right: 0;
}

.glitch::before {
  animation: glitch-1 0.3s infinite;
  color: #f0f;
  z-index: -1;
}

.glitch::after {
  animation: glitch-2 0.3s infinite;
  color: #0ff;
  z-index: -2;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  33% { transform: translate(-2px, 2px); }
  66% { transform: translate(2px, -2px); }
}

@keyframes glitch-1 {
  0%, 100% { clip-path: inset(0 0 0 0); }
  20% { clip-path: inset(20% 0 60% 0); }
  40% { clip-path: inset(60% 0 10% 0); }
  60% { clip-path: inset(10% 0 80% 0); }
  80% { clip-path: inset(80% 0 5% 0); }
}

@keyframes glitch-2 {
  0%, 100% { clip-path: inset(0 0 0 0); }
  20% { clip-path: inset(40% 0 40% 0); }
  40% { clip-path: inset(80% 0 5% 0); }
  60% { clip-path: inset(5% 0 70% 0); }
  80% { clip-path: inset(70% 0 20% 0); }
}

.timestamp {
  color: #0f0;
  font-size: 18px;
  margin-top: 15px;
  letter-spacing: 3px;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #0f0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-overlay {
    padding: 10px;
  }

  .terminal-body {
    font-size: 12px;
    padding: 15px;
  }

  .glitch {
    font-size: 24px;
  }

  .info-panels {
    grid-template-columns: 1fr;
  }
}
</style>
