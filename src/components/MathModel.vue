<template>
  <div class="math-model-container">
    <div class="controls">
      <h2>随机动态数学模型运行轨迹</h2>
      <div class="control-panel">
        <button @click="generateNewModel" class="control-btn">生成新模型</button>
        <button @click="toggleAnimation" class="control-btn">
          {{ isAnimating ? '暂停' : '播放' }}
        </button>
        <button @click="reset" class="control-btn">重置</button>
      </div>
      <div class="info-panel">
        <div class="info-item">
          <span class="label">模型类型:</span>
          <span class="value">{{ modelName }}</span>
        </div>
        <div class="info-item">
          <span class="label">参数 σ:</span>
          <span class="value">{{ params.sigma.toFixed(2) }}</span>
        </div>
        <div class="info-item">
          <span class="label">参数 ρ:</span>
          <span class="value">{{ params.rho.toFixed(2) }}</span>
        </div>
        <div class="info-item">
          <span class="label">参数 β:</span>
          <span class="value">{{ params.beta.toFixed(2) }}</span>
        </div>
        <div class="info-item">
          <span class="label">点数:</span>
          <span class="value">{{ points.length }}</span>
        </div>
      </div>
    </div>
    <canvas ref="canvas" class="model-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import axios from 'axios';

const canvas = ref(null);
const isAnimating = ref(true);
const animationId = ref(null);
const modelName = ref('洛伦兹吸引子');

// 模型参数
const params = ref({
  sigma: 10,
  rho: 28,
  beta: 8/3
});

// 当前点位置
const currentPoint = ref({ x: 0.1, y: 0, z: 0 });
const points = ref([]);
const maxPoints = 5000;

// 时间步长
const dt = 0.005;

// 旋转角度
const rotation = ref({ x: 0, y: 0 });

// 生成新的随机模型
const generateNewModel = async () => {
  try {
    const response = await axios.get('/api/math-model/random');
    params.value = response.data.params;
    modelName.value = response.data.name;
    reset();
  } catch (error) {
    console.error('获取随机模型参数失败:', error);
    // 如果API调用失败,使用本地随机生成
    generateLocalRandomParams();
  }
};

// 本地生成随机参数
const generateLocalRandomParams = () => {
  params.value = {
    sigma: 8 + Math.random() * 4,
    rho: 20 + Math.random() * 20,
    beta: 2 + Math.random() * 2
  };
  reset();
};

// 重置模型
const reset = () => {
  points.value = [];
  currentPoint.value = {
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    z: Math.random() * 2 - 1
  };
  rotation.value = { x: 0, y: 0 };
};

// 切换动画
const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value;
};

// 计算洛伦兹吸引子的下一个点
const calculateNextPoint = () => {
  const { x, y, z } = currentPoint.value;
  const { sigma, rho, beta } = params.value;

  const dx = sigma * (y - x);
  const dy = x * (rho - z) - y;
  const dz = x * y - beta * z;

  return {
    x: x + dx * dt,
    y: y + dy * dt,
    z: z + dz * dt
  };
};

// 绘制函数
const draw = () => {
  if (!canvas.value) return;

  const ctx = canvas.value.getContext('2d');
  const width = canvas.value.width;
  const height = canvas.value.height;

  // 清空画布
  ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
  ctx.fillRect(0, 0, width, height);

  // 计算并添加新点
  if (isAnimating.value && points.value.length < maxPoints) {
    for (let i = 0; i < 3; i++) {
      const nextPoint = calculateNextPoint();
      points.value.push({ ...currentPoint.value });
      currentPoint.value = nextPoint;

      if (points.value.length > maxPoints) {
        points.value.shift();
      }
    }
  }

  // 自动旋转
  rotation.value.y += 0.003;
  rotation.value.x = Math.sin(rotation.value.y * 0.3) * 0.2;

  // 绘制轨迹
  const scale = Math.min(width, height) / 80;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
  ctx.lineWidth = 1.5;

  for (let i = 1; i < points.value.length; i++) {
    const p1 = project3D(points.value[i - 1], scale, centerX, centerY);
    const p2 = project3D(points.value[i], scale, centerX, centerY);

    // 渐变颜色
    const t = i / points.value.length;
    const hue = (200 + t * 160) % 360;
    ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${0.3 + t * 0.7})`;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  // 绘制当前点
  if (points.value.length > 0) {
    const current = project3D(currentPoint.value, scale, centerX, centerY);
    ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
    ctx.beginPath();
    ctx.arc(current.x, current.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  animationId.value = requestAnimationFrame(draw);
};

// 3D投影到2D
const project3D = (point, scale, centerX, centerY) => {
  const { x, y, z } = point;
  const { x: rotX, y: rotY } = rotation.value;

  // 旋转
  let x1 = x;
  let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
  let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);

  let x2 = x1 * Math.cos(rotY) + z1 * Math.sin(rotY);
  let y2 = y1;

  return {
    x: centerX + x2 * scale,
    y: centerY + y2 * scale
  };
};

// 设置画布大小
const resizeCanvas = () => {
  if (!canvas.value) return;
  const container = canvas.value.parentElement;
  canvas.value.width = container.clientWidth;
  canvas.value.height = container.clientHeight;
};

onMounted(() => {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 初始化时获取随机参数
  generateNewModel();

  // 开始动画
  draw();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
  if (animationId.value) {
    cancelAnimationFrame(animationId.value);
  }
});
</script>

<style scoped>
.math-model-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a0a1e 0%, #1a1a3e 100%);
  position: relative;
  overflow: hidden;
}

.controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background: rgba(20, 20, 40, 0.85);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 300px;
}

.controls h2 {
  color: #64c8ff;
  font-size: 18px;
  margin: 0 0 15px 0;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(100, 200, 255, 0.5);
}

.control-panel {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.control-btn {
  background: linear-gradient(135deg, #3a5f9f 0%, #2a4f8f 100%);
  color: white;
  border: 1px solid rgba(100, 200, 255, 0.4);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s;
  flex: 1;
  min-width: 80px;
}

.control-btn:hover {
  background: linear-gradient(135deg, #4a6faf 0%, #3a5f9f 100%);
  box-shadow: 0 4px 12px rgba(100, 200, 255, 0.3);
  transform: translateY(-2px);
}

.control-btn:active {
  transform: translateY(0);
}

.info-panel {
  background: rgba(10, 10, 30, 0.5);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #8ab4f8;
  font-weight: 500;
}

.value {
  color: #fff;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.model-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

@media (max-width: 768px) {
  .controls {
    max-width: calc(100% - 40px);
  }

  .controls h2 {
    font-size: 16px;
  }

  .control-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
