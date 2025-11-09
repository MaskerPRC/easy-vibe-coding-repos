<template>
  <div class="matrix-container" ref="containerRef">
    <canvas ref="canvasRef"></canvas>

    <!-- 游戏入口按钮 -->
    <div class="game-entrance">
      <h1 class="game-title">王者荣耀</h1>
      <p class="game-subtitle">网页版MOBA游戏</p>
      <button class="play-btn" @click="goToGame">开始游戏</button>
    </div>

    <!-- FAB按钮组 -->
    <div class="fab-container">
      <!-- 全屏按钮 - 绿色 -->
      <button
        class="fab-btn fab-fullscreen"
        @click="toggleFullscreen"
        :title="isFullscreen ? '退出全屏' : '全屏'"
      >
        <svg v-if="!isFullscreen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
        </svg>
      </button>

      <!-- 主题切换按钮 - 蓝色 -->
      <button
        class="fab-btn fab-theme"
        @click="toggleTheme"
        :title="isDarkTheme ? '切换到亮色主题' : '切换到暗色主题'"
      >
        <svg v-if="isDarkTheme" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>

      <!-- 音乐开关按钮 - 紫色 -->
      <button
        class="fab-btn fab-music"
        @click="toggleMusic"
        :title="isMusicPlaying ? '关闭音乐' : '开启音乐'"
      >
        <svg v-if="isMusicPlaying" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      </button>

      <!-- 帮助按钮 - 橙色 -->
      <button
        class="fab-btn fab-help"
        @click="showHelp"
        title="帮助"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </button>

      <!-- 设置按钮 - 红色 -->
      <button
        class="fab-btn fab-settings"
        @click="showSettings"
        title="设置"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m0-12l-3-3m3 3l3-3M1 12h6m6 0h6m-12 0l-3 3m3-3l-3-3m18 3l-3 3m3-3l-3-3"></path>
        </svg>
      </button>
    </div>

    <!-- 帮助对话框 -->
    <div v-if="isHelpVisible" class="modal-overlay" @click="isHelpVisible = false">
      <div class="modal-content" @click.stop>
        <h2>游戏帮助</h2>
        <ul>
          <li>点击"开始游戏"进入游戏</li>
          <li>使用鼠标点击移动英雄</li>
          <li>使用技能键（Q、W、E、R）释放技能</li>
          <li>击败敌人获得经验和金币</li>
          <li>摧毁敌方基地获得胜利</li>
        </ul>
        <button class="close-btn" @click="isHelpVisible = false">关闭</button>
      </div>
    </div>

    <!-- 设置对话框 -->
    <div v-if="isSettingsVisible" class="modal-overlay" @click="isSettingsVisible = false">
      <div class="modal-content" @click.stop>
        <h2>设置</h2>
        <div class="settings-item">
          <label>音乐音量</label>
          <input type="range" v-model="musicVolume" min="0" max="100" />
          <span>{{ musicVolume }}%</span>
        </div>
        <div class="settings-item">
          <label>音效音量</label>
          <input type="range" v-model="soundVolume" min="0" max="100" />
          <span>{{ soundVolume }}%</span>
        </div>
        <div class="settings-item">
          <label>画质</label>
          <select v-model="graphicsQuality">
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
        <button class="close-btn" @click="isSettingsVisible = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const canvasRef = ref(null);
const containerRef = ref(null);
const isFullscreen = ref(false);
const isDarkTheme = ref(true);
const isMusicPlaying = ref(false);
const isHelpVisible = ref(false);
const isSettingsVisible = ref(false);
const musicVolume = ref(50);
const soundVolume = ref(70);
const graphicsQuality = ref('high');

const goToGame = () => {
  router.push('/game');
};

let animationId = null;
let columns = [];
let fontSize = 16;

// 字符集：包含数字、英文字母、日文片假名等
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

const initMatrix = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // 设置canvas尺寸为窗口大小
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 计算列数
    const columnCount = Math.floor(canvas.width / fontSize);

    // 初始化每列的y坐标
    columns = [];
    for (let i = 0; i < columnCount; i++) {
      columns[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
  };

  resize();
  window.addEventListener('resize', resize);

  const draw = () => {
    // 使用半透明黑色覆盖画布，产生拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置字体样式和颜色
    ctx.fillStyle = '#0F0'; // 绿色
    ctx.font = `${fontSize}px monospace`;

    // 绘制字符
    for (let i = 0; i < columns.length; i++) {
      // 随机选择一个字符
      const char = characters[Math.floor(Math.random() * characters.length)];

      // 绘制字符
      const x = i * fontSize;
      const y = columns[i] * fontSize;
      ctx.fillText(char, x, y);

      // 随机重置列，让字符从顶部重新开始
      if (y > canvas.height && Math.random() > 0.975) {
        columns[i] = 0;
      }

      // 向下移动
      columns[i]++;
    }

    animationId = requestAnimationFrame(draw);
  };

  // draw(); // 已停止字符流动动画

  return () => {
    window.removeEventListener('resize', resize);
  };
};

const toggleFullscreen = () => {
  const container = containerRef.value;
  if (!container) return;

  if (!document.fullscreenElement) {
    container.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(err => {
      console.error('无法进入全屏模式:', err);
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    });
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// 主题切换
const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  const container = containerRef.value;
  if (container) {
    if (isDarkTheme.value) {
      container.style.backgroundColor = '#000';
      container.style.filter = 'none';
    } else {
      container.style.backgroundColor = '#f0f0f0';
      container.style.filter = 'invert(1) hue-rotate(180deg)';
    }
  }
};

// 音乐开关
const toggleMusic = () => {
  isMusicPlaying.value = !isMusicPlaying.value;
  if (isMusicPlaying.value) {
    console.log('音乐已开启');
    // 这里可以添加实际的音乐播放逻辑
  } else {
    console.log('音乐已关闭');
    // 这里可以添加实际的音乐停止逻辑
  }
};

// 显示帮助
const showHelp = () => {
  isHelpVisible.value = true;
};

// 显示设置
const showSettings = () => {
  isSettingsVisible.value = true;
};

onMounted(() => {
  const cleanup = initMatrix();
  document.addEventListener('fullscreenchange', handleFullscreenChange);

  onUnmounted(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (cleanup) {
      cleanup();
    }
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });
});
</script>

<style scoped>
.matrix-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  margin: 0;
  padding: 0;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* FAB按钮容器 */
.fab-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

/* FAB按钮基础样式 */
.fab-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.fab-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.fab-btn:hover::before {
  width: 100%;
  height: 100%;
}

.fab-btn:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.fab-btn:active {
  transform: scale(0.95);
}

.fab-btn svg {
  width: 24px;
  height: 24px;
  position: relative;
  z-index: 1;
}

/* 全屏按钮 - 绿色 */
.fab-fullscreen {
  background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
  color: #fff;
  animation: pulse-green 2s ease-in-out infinite;
}

.fab-fullscreen:hover {
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.6);
}

@keyframes pulse-green {
  0%, 100% {
    box-shadow: 0 4px 8px rgba(0, 255, 0, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(0, 255, 0, 0.6);
  }
}

/* 主题按钮 - 蓝色 */
.fab-theme {
  background: linear-gradient(135deg, #00bfff 0%, #0080ff 100%);
  color: #fff;
  animation: rotate-slow 10s linear infinite;
}

.fab-theme:hover {
  box-shadow: 0 0 30px rgba(0, 191, 255, 0.6);
  animation: rotate-fast 1s linear infinite;
}

@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate-fast {
  from {
    transform: rotate(0deg) scale(1.1);
  }
  to {
    transform: rotate(360deg) scale(1.1);
  }
}

/* 音乐按钮 - 紫色 */
.fab-music {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  color: #fff;
  animation: bounce 2s ease-in-out infinite;
}

.fab-music:hover {
  box-shadow: 0 0 30px rgba(155, 89, 182, 0.6);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 帮助按钮 - 橙色 */
.fab-help {
  background: linear-gradient(135deg, #ff9500 0%, #ff6500 100%);
  color: #fff;
  animation: shake 3s ease-in-out infinite;
}

.fab-help:hover {
  box-shadow: 0 0 30px rgba(255, 149, 0, 0.6);
}

@keyframes shake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

/* 设置按钮 - 红色 */
.fab-settings {
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
  color: #fff;
  animation: pulse-red 2s ease-in-out infinite;
}

.fab-settings:hover {
  box-shadow: 0 0 30px rgba(255, 71, 87, 0.6);
  animation: spin 1s linear infinite;
}

@keyframes pulse-red {
  0%, 100% {
    box-shadow: 0 4px 8px rgba(255, 71, 87, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.6);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg) scale(1.1);
  }
  to {
    transform: rotate(360deg) scale(1.1);
  }
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(50, 50, 50, 0.95) 100%);
  padding: 40px;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 215, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content h2 {
  color: #ffd700;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 28px;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.modal-content ul {
  color: #fff;
  list-style-position: inside;
  line-height: 1.8;
  margin-bottom: 30px;
}

.modal-content li {
  margin-bottom: 10px;
  color: #0F0;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.settings-item {
  margin-bottom: 20px;
  color: #fff;
}

.settings-item label {
  display: block;
  margin-bottom: 8px;
  color: #ffd700;
  font-weight: bold;
}

.settings-item input[type="range"] {
  width: 100%;
  margin-right: 10px;
}

.settings-item select {
  width: 100%;
  padding: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #ffd700;
  color: #fff;
  border-radius: 5px;
}

.settings-item span {
  color: #0F0;
  font-weight: bold;
}

.close-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: none;
  border-radius: 10px;
  color: #333;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
}

.close-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 215, 0, 0.5);
}

.game-entrance {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 999;
}

.game-title {
  font-size: 72px;
  color: #ffd700;
  margin-bottom: 20px;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
               0 0 60px rgba(255, 215, 0, 0.5);
  font-weight: bold;
  letter-spacing: 10px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.6),
                 0 0 40px rgba(255, 215, 0, 0.4);
  }
  to {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.9),
                 0 0 60px rgba(255, 215, 0, 0.6),
                 0 0 90px rgba(255, 215, 0, 0.3);
  }
}

.game-subtitle {
  font-size: 24px;
  color: #0F0;
  margin-bottom: 40px;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
  letter-spacing: 5px;
}

.play-btn {
  padding: 20px 60px;
  font-size: 28px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: 3px solid #ffa500;
  border-radius: 50px;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
  letter-spacing: 3px;
  text-transform: uppercase;
}

.play-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.6),
              0 0 40px rgba(255, 215, 0, 0.4);
  background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
}

.play-btn:active {
  transform: scale(1.05);
}
</style>
