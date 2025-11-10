<template>
  <div class="flower-generator">
    <div class="control-panel">
      <h2 class="panel-title">🌸 花朵生成器</h2>
      <div class="controls">
        <div class="control-group">
          <label>花瓣数量:</label>
          <input
            v-model.number="petalCount"
            type="range"
            min="5"
            max="20"
            @input="generateFlower"
          />
          <span class="value">{{ petalCount }}</span>
        </div>

        <div class="control-group">
          <label>花瓣颜色:</label>
          <input
            v-model="petalColor"
            type="color"
            @input="generateFlower"
          />
        </div>

        <div class="control-group">
          <label>花心颜色:</label>
          <input
            v-model="centerColor"
            type="color"
            @input="generateFlower"
          />
        </div>

        <div class="control-group">
          <label>花朵大小:</label>
          <input
            v-model.number="flowerSize"
            type="range"
            min="50"
            max="200"
            @input="generateFlower"
          />
          <span class="value">{{ flowerSize }}</span>
        </div>

        <button @click="randomizeFlower" class="btn-random">
          🎲 随机生成
        </button>
      </div>
    </div>

    <div class="canvas-container">
      <canvas
        ref="flowerCanvas"
        width="800"
        height="600"
        class="flower-canvas"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const flowerCanvas = ref(null);
const petalCount = ref(8);
const petalColor = ref('#FF69B4');
const centerColor = ref('#FFD700');
const flowerSize = ref(100);

// 生成花朵
const generateFlower = () => {
  const canvas = flowerCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // 清空画布
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制茎
  drawStem(ctx, centerX, centerY);

  // 绘制叶子
  drawLeaves(ctx, centerX, centerY);

  // 绘制花瓣
  drawPetals(ctx, centerX, centerY - 50, petalCount.value, flowerSize.value, petalColor.value);

  // 绘制花心
  drawCenter(ctx, centerX, centerY - 50, flowerSize.value * 0.3, centerColor.value);

  // 添加装饰细节
  addDetails(ctx, centerX, centerY - 50, flowerSize.value);
};

// 绘制茎
const drawStem = (ctx, x, y) => {
  ctx.strokeStyle = '#228B22';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x - 20, y + 100, x - 10, y + 200);
  ctx.stroke();
};

// 绘制叶子
const drawLeaves = (ctx, x, y) => {
  // 左叶子
  ctx.fillStyle = '#32CD32';
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 80);
  ctx.quadraticCurveTo(x - 60, y + 100, x - 50, y + 130);
  ctx.quadraticCurveTo(x - 40, y + 110, x - 10, y + 100);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#228B22';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 右叶子
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 150);
  ctx.quadraticCurveTo(x + 40, y + 160, x + 50, y + 190);
  ctx.quadraticCurveTo(x + 30, y + 180, x - 10, y + 170);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// 绘制花瓣
const drawPetals = (ctx, x, y, count, size, color) => {
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    const angle = angleStep * i - Math.PI / 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // 创建渐变
    const gradient = ctx.createRadialGradient(0, -size / 2, 0, 0, -size / 2, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, lightenColor(color, 20));
    gradient.addColorStop(1, lightenColor(color, 40));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, -size / 2, size / 3, size, 0, 0, Math.PI * 2);
    ctx.fill();

    // 花瓣边框
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
};

// 绘制花心
const drawCenter = (ctx, x, y, radius, color) => {
  // 外圈
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, lightenColor(color, 30));
  gradient.addColorStop(1, color);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // 花心纹理
  ctx.fillStyle = darkenColor(color, 30);
  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 * i) / 20;
    const r = radius * 0.6;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }
};

// 添加装饰细节
const addDetails = (ctx, x, y, size) => {
  // 添加光晕效果
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, size * 2, 0, Math.PI * 2);
  ctx.fill();
};

// 颜色变亮
const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + percent);
  const g = Math.min(255, ((num >> 8) & 0xff) + percent);
  const b = Math.min(255, (num & 0xff) + percent);
  return `rgb(${r}, ${g}, ${b})`;
};

// 颜色变暗
const darkenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - percent);
  const g = Math.max(0, ((num >> 8) & 0xff) - percent);
  const b = Math.max(0, (num & 0xff) - percent);
  return `rgb(${r}, ${g}, ${b})`;
};

// 随机生成花朵
const randomizeFlower = () => {
  petalCount.value = Math.floor(Math.random() * 16) + 5;
  flowerSize.value = Math.floor(Math.random() * 150) + 50;

  const randomColor = () => {
    const colors = ['#FF69B4', '#FF1493', '#FF6347', '#FFA500', '#FFD700',
                    '#9370DB', '#8A2BE2', '#FF00FF', '#FF69B4', '#FF4500'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  petalColor.value = randomColor();
  centerColor.value = randomColor();

  generateFlower();
};

onMounted(() => {
  generateFlower();
});
</script>

<style scoped>
.flower-generator {
  display: flex;
  height: 100%;
  background: #1a1a1a;
  gap: 20px;
  padding: 20px;
}

.control-panel {
  width: 300px;
  background: #2d2d2d;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #444;
  height: fit-content;
}

.panel-title {
  color: #00ff88;
  margin: 0 0 20px 0;
  font-size: 20px;
  text-align: center;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
}

.control-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #1a1a1a;
  outline: none;
  -webkit-appearance: none;
}

.control-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #00ff88;
  cursor: pointer;
}

.control-group input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #00ff88;
  cursor: pointer;
  border: none;
}

.control-group input[type="color"] {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: #1a1a1a;
}

.value {
  color: #00ff88;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
}

.btn-random {
  padding: 12px 20px;
  background: #00ff88;
  color: #1a1a1a;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.btn-random:hover {
  background: #00cc6a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 255, 136, 0.3);
}

.btn-random:active {
  transform: translateY(0);
}

.canvas-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2d2d2d;
  border-radius: 8px;
  border: 1px solid #444;
  overflow: hidden;
}

.flower-canvas {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .flower-generator {
    flex-direction: column;
  }

  .control-panel {
    width: 100%;
  }

  .canvas-container {
    height: 400px;
  }
}
</style>
