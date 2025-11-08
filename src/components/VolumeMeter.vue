<template>
  <div class="volume-meter-container">
    <div class="volume-meter-title">响度表</div>
    <div class="volume-meter">
      <div class="meter-bar-container">
        <div class="meter-label">L</div>
        <div class="meter-bar">
          <canvas ref="leftCanvas" class="meter-canvas"></canvas>
          <div class="meter-scale">
            <span class="scale-mark">0dB</span>
            <span class="scale-mark">-6</span>
            <span class="scale-mark">-12</span>
            <span class="scale-mark">-18</span>
            <span class="scale-mark">-24</span>
            <span class="scale-mark">-30</span>
            <span class="scale-mark">-inf</span>
          </div>
        </div>
        <div class="meter-peak">{{ leftPeak }}</div>
      </div>

      <div class="meter-bar-container">
        <div class="meter-label">R</div>
        <div class="meter-bar">
          <canvas ref="rightCanvas" class="meter-canvas"></canvas>
          <div class="meter-scale">
            <span class="scale-mark">0dB</span>
            <span class="scale-mark">-6</span>
            <span class="scale-mark">-12</span>
            <span class="scale-mark">-18</span>
            <span class="scale-mark">-24</span>
            <span class="scale-mark">-30</span>
            <span class="scale-mark">-inf</span>
          </div>
        </div>
        <div class="meter-peak">{{ rightPeak }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  audioContext: {
    type: Object,
    default: null
  },
  sourceNode: {
    type: Object,
    default: null
  },
  isPlaying: {
    type: Boolean,
    default: false
  }
});

const leftCanvas = ref(null);
const rightCanvas = ref(null);
const leftPeak = ref('-inf');
const rightPeak = ref('-inf');

let analyserNode = null;
let splitterNode = null;
let leftAnalyser = null;
let rightAnalyser = null;
let animationFrameId = null;
let leftPeakValue = -Infinity;
let rightPeakValue = -Infinity;
let peakHoldTime = 2000; // 峰值保持时间（毫秒）
let leftPeakTimeout = null;
let rightPeakTimeout = null;

// 初始化分析器
const initAnalyser = () => {
  if (!props.audioContext || !props.sourceNode) return;

  try {
    // 创建分离器节点以分离左右声道
    splitterNode = props.audioContext.createChannelSplitter(2);

    // 创建左右声道分析器
    leftAnalyser = props.audioContext.createAnalyser();
    rightAnalyser = props.audioContext.createAnalyser();

    // 配置分析器
    leftAnalyser.fftSize = 2048;
    leftAnalyser.smoothingTimeConstant = 0.8;
    rightAnalyser.fftSize = 2048;
    rightAnalyser.smoothingTimeConstant = 0.8;

    // 连接音频节点
    props.sourceNode.connect(splitterNode);
    splitterNode.connect(leftAnalyser, 0);
    splitterNode.connect(rightAnalyser, 1);

    // 开始绘制
    drawMeter();
  } catch (err) {
    console.error('初始化分析器失败:', err);
  }
};

// 清理分析器
const cleanupAnalyser = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (leftPeakTimeout) clearTimeout(leftPeakTimeout);
  if (rightPeakTimeout) clearTimeout(rightPeakTimeout);

  if (splitterNode) {
    try {
      splitterNode.disconnect();
    } catch (e) {
      // 忽略断开连接错误
    }
    splitterNode = null;
  }

  if (leftAnalyser) {
    try {
      leftAnalyser.disconnect();
    } catch (e) {
      // 忽略断开连接错误
    }
    leftAnalyser = null;
  }

  if (rightAnalyser) {
    try {
      rightAnalyser.disconnect();
    } catch (e) {
      // 忽略断开连接错误
    }
    rightAnalyser = null;
  }

  leftPeakValue = -Infinity;
  rightPeakValue = -Infinity;
  leftPeak.value = '-inf';
  rightPeak.value = '-inf';
};

// 计算 RMS（均方根）值转换为 dB
const calculateRMS = (dataArray) => {
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const normalized = (dataArray[i] - 128) / 128;
    sum += normalized * normalized;
  }
  const rms = Math.sqrt(sum / dataArray.length);
  const db = 20 * Math.log10(rms);
  return isFinite(db) ? db : -Infinity;
};

// 绘制响度表
const drawMeter = () => {
  if (!leftAnalyser || !rightAnalyser || !leftCanvas.value || !rightCanvas.value) {
    return;
  }

  // 获取音频数据
  const leftData = new Uint8Array(leftAnalyser.frequencyBinCount);
  const rightData = new Uint8Array(rightAnalyser.frequencyBinCount);
  leftAnalyser.getByteTimeDomainData(leftData);
  rightAnalyser.getByteTimeDomainData(rightData);

  // 计算 dB 值
  const leftDb = calculateRMS(leftData);
  const rightDb = calculateRMS(rightData);

  // 更新峰值
  if (leftDb > leftPeakValue) {
    leftPeakValue = leftDb;
    leftPeak.value = leftDb > -60 ? leftDb.toFixed(1) + 'dB' : '-inf';
    if (leftPeakTimeout) clearTimeout(leftPeakTimeout);
    leftPeakTimeout = setTimeout(() => {
      leftPeakValue = -Infinity;
      leftPeak.value = '-inf';
    }, peakHoldTime);
  }

  if (rightDb > rightPeakValue) {
    rightPeakValue = rightDb;
    rightPeak.value = rightDb > -60 ? rightDb.toFixed(1) + 'dB' : '-inf';
    if (rightPeakTimeout) clearTimeout(rightPeakTimeout);
    rightPeakTimeout = setTimeout(() => {
      rightPeakValue = -Infinity;
      rightPeak.value = '-inf';
    }, peakHoldTime);
  }

  // 绘制左声道
  drawBar(leftCanvas.value, leftDb, leftPeakValue);

  // 绘制右声道
  drawBar(rightCanvas.value, rightDb, rightPeakValue);

  // 继续动画
  animationFrameId = requestAnimationFrame(drawMeter);
};

// 绘制单个柱状图
const drawBar = (canvas, currentDb, peakDb) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // 清空画布
  ctx.clearRect(0, 0, width, height);

  // 绘制背景
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, width, height);

  // dB 范围：0 到 -60
  const minDb = -60;
  const maxDb = 0;

  // 计算当前响度的高度（从底部开始）
  const normalizedDb = Math.max(minDb, Math.min(maxDb, currentDb));
  const barHeight = ((normalizedDb - minDb) / (maxDb - minDb)) * height;

  // 绘制渐变柱状图
  const gradient = ctx.createLinearGradient(0, height, 0, 0);
  gradient.addColorStop(0, '#00ff00');    // 底部：绿色（低响度）
  gradient.addColorStop(0.5, '#ffff00');  // 中间：黄色（中等响度）
  gradient.addColorStop(0.75, '#ff9900'); // 较高：橙色
  gradient.addColorStop(1, '#ff0000');    // 顶部：红色（高响度/削波）

  ctx.fillStyle = gradient;
  ctx.fillRect(2, height - barHeight, width - 4, barHeight);

  // 绘制峰值指示线
  if (peakDb > minDb) {
    const normalizedPeak = Math.max(minDb, Math.min(maxDb, peakDb));
    const peakY = height - ((normalizedPeak - minDb) / (maxDb - minDb)) * height;

    ctx.strokeStyle = peakDb > -6 ? '#ff0000' : '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, peakY);
    ctx.lineTo(width, peakY);
    ctx.stroke();
  }

  // 绘制刻度线
  const scalePositions = [0, -6, -12, -18, -24, -30, -60];
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;

  scalePositions.forEach(db => {
    const y = height - ((db - minDb) / (maxDb - minDb)) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  });

  // 绘制边框
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);
};

// 监听播放状态
watch(() => props.isPlaying, (newVal) => {
  if (newVal && props.sourceNode) {
    cleanupAnalyser();
    initAnalyser();
  } else {
    cleanupAnalyser();
    // 清空画布
    if (leftCanvas.value) {
      const ctx = leftCanvas.value.getContext('2d');
      ctx.clearRect(0, 0, leftCanvas.value.width, leftCanvas.value.height);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, leftCanvas.value.width, leftCanvas.value.height);
    }
    if (rightCanvas.value) {
      const ctx = rightCanvas.value.getContext('2d');
      ctx.clearRect(0, 0, rightCanvas.value.width, rightCanvas.value.height);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, rightCanvas.value.width, rightCanvas.value.height);
    }
  }
});

// 监听音频源变化
watch(() => props.sourceNode, (newVal) => {
  if (newVal && props.isPlaying) {
    cleanupAnalyser();
    initAnalyser();
  }
});

onMounted(() => {
  // 初始化画布尺寸
  if (leftCanvas.value) {
    leftCanvas.value.width = 40;
    leftCanvas.value.height = 300;
  }
  if (rightCanvas.value) {
    rightCanvas.value.width = 40;
    rightCanvas.value.height = 300;
  }

  if (props.isPlaying && props.sourceNode) {
    initAnalyser();
  }
});

onUnmounted(() => {
  cleanupAnalyser();
});
</script>

<style scoped>
.volume-meter-container {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.volume-meter-title {
  font-size: 14px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 15px;
  text-align: center;
}

.volume-meter {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
}

.meter-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.meter-label {
  font-size: 14px;
  font-weight: 600;
  color: #aaa;
  text-align: center;
}

.meter-bar {
  position: relative;
  display: flex;
  gap: 10px;
}

.meter-canvas {
  display: block;
  border-radius: 4px;
  background: #1a1a1a;
}

.meter-scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 300px;
  padding: 2px 0;
}

.scale-mark {
  font-size: 10px;
  color: #666;
  line-height: 1;
  white-space: nowrap;
}

.meter-peak {
  font-size: 12px;
  font-weight: 600;
  color: #00ff00;
  background: #0a0a0a;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 50px;
  text-align: center;
  font-family: 'Courier New', monospace;
}
</style>
