<template>
  <div class="matrix-container" ref="containerRef">
    <canvas ref="canvasRef"></canvas>
    <button
      class="fullscreen-btn"
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
const containerRef = ref(null);
const isFullscreen = ref(false);

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

.fullscreen-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0, 255, 0, 0.2);
  border: 2px solid #0F0;
  color: #0F0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;
}

.fullscreen-btn:hover {
  background-color: rgba(0, 255, 0, 0.4);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
}

.fullscreen-btn:active {
  transform: scale(0.95);
}

.fullscreen-btn svg {
  width: 24px;
  height: 24px;
}
</style>
