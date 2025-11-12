<template>
  <div class="clock-container">
    <canvas
      ref="canvas"
      :width="canvasSize"
      :height="canvasSize"
      class="clock-canvas"
    ></canvas>
    <!-- 音频元素用于滴答声 -->
    <audio ref="tickSound" preload="auto">
      <!-- 使用 Web Audio API 生成的音效 -->
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
const tickSound = ref(null);
const canvasSize = 800;
let ctx = null;
let animationId = null;
let lastSecond = -1;
let audioContext = null;
let tickBuffer = null;

// 生成滴答音效
function createTickSound() {
  // 创建 AudioContext
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // 创建一个短促的滴答声
  const sampleRate = audioContext.sampleRate;
  const duration = 0.05; // 50毫秒
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);

  // 生成短促的正弦波
  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate;
    // 使用包络和正弦波生成清脆的滴答声
    const envelope = Math.exp(-t * 50); // 快速衰减
    data[i] = Math.sin(2 * Math.PI * 1200 * t) * envelope * 0.3;
  }

  tickBuffer = buffer;
}

// 播放滴答音效
function playTickSound() {
  if (!audioContext || !tickBuffer) return;

  try {
    const source = audioContext.createBufferSource();
    source.buffer = tickBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (e) {
    console.log('音效播放失败:', e);
  }
}

// 绘制时钟
function drawClock() {
  if (!ctx) return;

  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;
  const radius = canvasSize * 0.42;

  // 清空画布
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // 绘制背景
  ctx.fillStyle = '#f5f5f0';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // 绘制外圈阴影
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
  ctx.fillStyle = '#d0d0c8';
  ctx.fill();
  ctx.restore();

  // 绘制金属外框
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
  const metalGradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
  metalGradient.addColorStop(0, '#c0c0c0');
  metalGradient.addColorStop(0.3, '#e8e8e8');
  metalGradient.addColorStop(0.5, '#ffffff');
  metalGradient.addColorStop(0.7, '#e8e8e8');
  metalGradient.addColorStop(1, '#a8a8a8');
  ctx.fillStyle = metalGradient;
  ctx.fill();
  ctx.restore();

  // 绘制表盘背景（米白色带渐变）
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  const faceGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  faceGradient.addColorStop(0, '#ffffff');
  faceGradient.addColorStop(0.7, '#fefefe');
  faceGradient.addColorStop(1, '#f0f0eb');
  ctx.fillStyle = faceGradient;
  ctx.fill();
  ctx.restore();

  // 绘制表盘边框
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#888888';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // 绘制刻度
  for (let i = 0; i < 60; i++) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((i * 6) * Math.PI / 180);

    ctx.beginPath();
    if (i % 5 === 0) {
      // 小时刻度（粗）
      ctx.moveTo(0, -radius + 10);
      ctx.lineTo(0, -radius + 30);
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 3;
    } else {
      // 分钟刻度（细）
      ctx.moveTo(0, -radius + 10);
      ctx.lineTo(0, -radius + 20);
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 1.5;
    }
    ctx.stroke();
    ctx.restore();
  }

  // 绘制数字（1-12）
  ctx.save();
  ctx.fillStyle = '#222222';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const numberRadius = radius * 0.72;
    const x = centerX + Math.cos(angle) * numberRadius;
    const y = centerY + Math.sin(angle) * numberRadius;

    // 绘制数字阴影
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillText(numbers[i].toString(), x + 1, y + 1);
    ctx.restore();

    // 绘制数字
    ctx.fillText(numbers[i].toString(), x, y);
  }
  ctx.restore();

  // 获取当前时间
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds(); // 使用整数秒，不加毫秒

  // 检测秒针跳动并播放音效
  if (seconds !== lastSecond) {
    playTickSound();
    lastSecond = seconds;
  }

  // 计算角度
  const hourAngle = ((hours + minutes / 60) * 30 - 90) * Math.PI / 180;
  const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180;
  const secondAngle = (seconds * 6 - 90) * Math.PI / 180; // 秒针跳动，不使用毫秒

  // 绘制时针
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(hourAngle);
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.lineTo(-10, -radius * 0.5);
  ctx.lineTo(0, -radius * 0.52);
  ctx.lineTo(10, -radius * 0.5);
  ctx.lineTo(15, 0);
  ctx.closePath();

  // 时针渐变
  const hourGradient = ctx.createLinearGradient(0, -radius * 0.5, 0, 0);
  hourGradient.addColorStop(0, '#1a1a1a');
  hourGradient.addColorStop(1, '#3a3a3a');
  ctx.fillStyle = hourGradient;
  ctx.fill();

  // 时针描边
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // 绘制分针
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(minuteAngle);
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-8, -radius * 0.7);
  ctx.lineTo(0, -radius * 0.72);
  ctx.lineTo(8, -radius * 0.7);
  ctx.lineTo(12, 0);
  ctx.closePath();

  // 分针渐变
  const minuteGradient = ctx.createLinearGradient(0, -radius * 0.7, 0, 0);
  minuteGradient.addColorStop(0, '#2a2a2a');
  minuteGradient.addColorStop(1, '#4a4a4a');
  ctx.fillStyle = minuteGradient;
  ctx.fill();

  // 分针描边
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // 绘制秒针
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(secondAngle);

  // 秒针主体
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.lineTo(-3, -radius * 0.75);
  ctx.lineTo(0, -radius * 0.78);
  ctx.lineTo(3, -radius * 0.75);
  ctx.lineTo(0, 20);
  ctx.closePath();
  ctx.fillStyle = '#c41e3a'; // 红色秒针
  ctx.fill();
  ctx.strokeStyle = '#8b0000';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // 秒针尾部圆点
  ctx.beginPath();
  ctx.arc(0, 15, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#c41e3a';
  ctx.fill();
  ctx.strokeStyle = '#8b0000';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();

  // 绘制中心圆点
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
  const centerGradient = ctx.createRadialGradient(centerX - 3, centerY - 3, 0, centerX, centerY, 12);
  centerGradient.addColorStop(0, '#6a6a6a');
  centerGradient.addColorStop(0.5, '#3a3a3a');
  centerGradient.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = centerGradient;
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // 绘制中心高光
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX - 2, centerY - 2, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fill();
  ctx.restore();
}

// 动画循环
function animate() {
  drawClock();
  animationId = requestAnimationFrame(animate);
}

// 初始化
function init() {
  const canvasEl = canvas.value;
  ctx = canvasEl.getContext('2d');

  // 启用抗锯齿
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 生成音效
  createTickSound();

  // 开始动画
  animate();
}

// 生命周期钩子
onMounted(() => {
  init();

  // 点击画布启用音频（浏览器要求用户交互后才能播放音频）
  const canvasEl = canvas.value;
  const enableAudio = () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    canvasEl.removeEventListener('click', enableAudio);
  };
  canvasEl.addEventListener('click', enableAudio);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (audioContext) {
    audioContext.close();
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.clock-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.clock-canvas {
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  height: 800px;
  cursor: pointer;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.clock-canvas:hover {
  transform: scale(1.02);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .clock-canvas {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
}

@media (max-width: 480px) {
  .clock-container {
    padding: 10px;
  }
}
</style>
