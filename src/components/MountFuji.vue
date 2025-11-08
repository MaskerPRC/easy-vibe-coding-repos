<template>
  <div class="fuji-container">
    <h1 class="title">Berg Fuji / Mount Fuji</h1>
    <canvas ref="canvas" width="800" height="600"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const canvas = ref(null);

const drawMountFuji = (ctx) => {
  const width = 800;
  const height = 600;

  // 绘制天空渐变背景
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  skyGradient.addColorStop(0, '#87CEEB');
  skyGradient.addColorStop(0.5, '#B0E0E6');
  skyGradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height * 0.6);

  // 绘制地面
  ctx.fillStyle = '#8FBC8F';
  ctx.fillRect(0, height * 0.6, width, height * 0.4);

  // 绘制远处的山峦
  ctx.fillStyle = '#9370DB';
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.5);
  ctx.lineTo(200, height * 0.4);
  ctx.lineTo(400, height * 0.5);
  ctx.lineTo(0, height * 0.6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(800, height * 0.5);
  ctx.lineTo(600, height * 0.4);
  ctx.lineTo(400, height * 0.5);
  ctx.lineTo(800, height * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // 绘制富士山主体
  const fujiCenterX = width / 2;
  const fujiBaseY = height * 0.6;
  const fujiPeakY = height * 0.15;
  const fujiWidth = 350;

  // 富士山左侧
  const leftGradient = ctx.createLinearGradient(
    fujiCenterX - fujiWidth / 2, fujiBaseY,
    fujiCenterX, fujiPeakY
  );
  leftGradient.addColorStop(0, '#4682B4');
  leftGradient.addColorStop(0.6, '#5F9EA0');
  leftGradient.addColorStop(1, '#708090');

  ctx.fillStyle = leftGradient;
  ctx.beginPath();
  ctx.moveTo(fujiCenterX - fujiWidth / 2, fujiBaseY);
  ctx.lineTo(fujiCenterX, fujiPeakY);
  ctx.lineTo(fujiCenterX, fujiBaseY);
  ctx.closePath();
  ctx.fill();

  // 富士山右侧
  const rightGradient = ctx.createLinearGradient(
    fujiCenterX + fujiWidth / 2, fujiBaseY,
    fujiCenterX, fujiPeakY
  );
  rightGradient.addColorStop(0, '#36648B');
  rightGradient.addColorStop(0.6, '#4682B4');
  rightGradient.addColorStop(1, '#5F9EA0');

  ctx.fillStyle = rightGradient;
  ctx.beginPath();
  ctx.moveTo(fujiCenterX + fujiWidth / 2, fujiBaseY);
  ctx.lineTo(fujiCenterX, fujiPeakY);
  ctx.lineTo(fujiCenterX, fujiBaseY);
  ctx.closePath();
  ctx.fill();

  // 绘制雪顶
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(fujiCenterX, fujiPeakY);
  ctx.lineTo(fujiCenterX - 80, fujiPeakY + 120);
  ctx.lineTo(fujiCenterX - 60, fujiPeakY + 120);
  ctx.lineTo(fujiCenterX - 40, fujiPeakY + 100);
  ctx.lineTo(fujiCenterX - 20, fujiPeakY + 110);
  ctx.lineTo(fujiCenterX, fujiPeakY + 90);
  ctx.lineTo(fujiCenterX + 20, fujiPeakY + 110);
  ctx.lineTo(fujiCenterX + 40, fujiPeakY + 100);
  ctx.lineTo(fujiCenterX + 60, fujiPeakY + 120);
  ctx.lineTo(fujiCenterX + 80, fujiPeakY + 120);
  ctx.closePath();
  ctx.fill();

  // 添加雪的阴影效果
  ctx.fillStyle = '#F0F8FF';
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(fujiCenterX, fujiPeakY);
  ctx.lineTo(fujiCenterX + 80, fujiPeakY + 120);
  ctx.lineTo(fujiCenterX + 60, fujiPeakY + 120);
  ctx.lineTo(fujiCenterX + 40, fujiPeakY + 100);
  ctx.lineTo(fujiCenterX + 20, fujiPeakY + 110);
  ctx.lineTo(fujiCenterX, fujiPeakY + 90);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // 绘制太阳
  const sunGradient = ctx.createRadialGradient(650, 120, 10, 650, 120, 50);
  sunGradient.addColorStop(0, '#FFD700');
  sunGradient.addColorStop(0.5, '#FFA500');
  sunGradient.addColorStop(1, '#FF8C00');
  ctx.fillStyle = sunGradient;
  ctx.beginPath();
  ctx.arc(650, 120, 45, 0, Math.PI * 2);
  ctx.fill();

  // 绘制云朵
  const drawCloud = (x, y, scale = 1) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(x, y, 25 * scale, 0, Math.PI * 2);
    ctx.arc(x + 25 * scale, y, 30 * scale, 0, Math.PI * 2);
    ctx.arc(x + 50 * scale, y, 25 * scale, 0, Math.PI * 2);
    ctx.arc(x + 25 * scale, y - 15 * scale, 25 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  drawCloud(100, 100, 0.8);
  drawCloud(600, 80, 1);
  drawCloud(250, 150, 0.6);

  // 绘制前景树木
  const drawTree = (x, y) => {
    // 树干
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 5, y, 10, 40);

    // 树冠
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x - 20, y + 10);
    ctx.lineTo(x + 20, y + 10);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x - 18, y + 15);
    ctx.lineTo(x + 18, y + 15);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 15, y + 20);
    ctx.lineTo(x + 15, y + 20);
    ctx.closePath();
    ctx.fill();
  };

  drawTree(100, height * 0.7);
  drawTree(700, height * 0.7);
  drawTree(150, height * 0.75);
  drawTree(650, height * 0.72);

  // 绘制湖面
  ctx.fillStyle = '#4682B4';
  ctx.globalAlpha = 0.4;
  ctx.fillRect(0, height * 0.8, width, height * 0.2);
  ctx.globalAlpha = 1;

  // 绘制富士山在湖中的倒影
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.translate(0, height * 1.6);
  ctx.scale(1, -1);

  // 倒影 - 左侧
  const reflectionLeftGradient = ctx.createLinearGradient(
    fujiCenterX - fujiWidth / 2, fujiBaseY,
    fujiCenterX, fujiPeakY
  );
  reflectionLeftGradient.addColorStop(0, '#4682B4');
  reflectionLeftGradient.addColorStop(1, '#708090');
  ctx.fillStyle = reflectionLeftGradient;
  ctx.beginPath();
  ctx.moveTo(fujiCenterX - fujiWidth / 2, fujiBaseY);
  ctx.lineTo(fujiCenterX, fujiPeakY);
  ctx.lineTo(fujiCenterX, fujiBaseY);
  ctx.closePath();
  ctx.fill();

  // 倒影 - 右侧
  const reflectionRightGradient = ctx.createLinearGradient(
    fujiCenterX + fujiWidth / 2, fujiBaseY,
    fujiCenterX, fujiPeakY
  );
  reflectionRightGradient.addColorStop(0, '#36648B');
  reflectionRightGradient.addColorStop(1, '#5F9EA0');
  ctx.fillStyle = reflectionRightGradient;
  ctx.beginPath();
  ctx.moveTo(fujiCenterX + fujiWidth / 2, fujiBaseY);
  ctx.lineTo(fujiCenterX, fujiPeakY);
  ctx.lineTo(fujiCenterX, fujiBaseY);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
};

onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  drawMountFuji(ctx);
});
</script>

<style scoped>
.fuji-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #e3f2fd 0%, #fff9c4 100%);
  padding: 20px;
}

.title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

canvas {
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  background: white;
}

@media (max-width: 850px) {
  canvas {
    width: 100%;
    height: auto;
  }

  .title {
    font-size: 1.8rem;
  }
}
</style>
