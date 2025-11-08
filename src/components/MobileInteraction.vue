<template>
  <div class="mobile-interaction">
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <div class="stats">
        <span>点击: {{ stats.taps }}</span>
        <span>长按: {{ stats.longPress }}</span>
        <span>滑动: {{ stats.swipes }}</span>
      </div>
      <button @click="resetStats" class="reset-btn">重置</button>
    </div>

    <!-- 互动区域 -->
    <div
      ref="interactionArea"
      class="interaction-area"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @click="handleClick"
      :style="{ background: backgroundColor }"
    >
      <!-- 点击反馈效果 -->
      <div
        v-for="ripple in ripples"
        :key="ripple.id"
        class="ripple"
        :style="{
          left: ripple.x + 'px',
          top: ripple.y + 'px'
        }"
      ></div>

      <!-- 滑动路径绘制 -->
      <svg class="touch-canvas" v-if="touchPath.length > 0">
        <path
          :d="pathData"
          stroke="#00ff00"
          stroke-width="3"
          fill="none"
          stroke-linecap="round"
        />
      </svg>

      <!-- 互动提示 -->
      <div class="hint" v-if="showHint">
        <p>{{ hintText }}</p>
      </div>

      <!-- 手势识别结果 -->
      <div class="gesture-result" v-if="lastGesture">
        <span class="gesture-icon">{{ gestureIcon }}</span>
        <span class="gesture-name">{{ lastGesture }}</span>
      </div>

      <!-- 多点触控显示 -->
      <div
        v-for="touch in activeTouches"
        :key="touch.id"
        class="touch-point"
        :style="{
          left: touch.x + 'px',
          top: touch.y + 'px'
        }"
      >
        <span class="touch-id">{{ touch.id }}</span>
      </div>
    </div>

    <!-- 底部控制面板 -->
    <div class="control-panel">
      <button
        @click="toggleDrawMode"
        :class="{ active: drawMode }"
        class="control-btn"
      >
        {{ drawMode ? '绘画模式开' : '绘画模式关' }}
      </button>
      <button @click="clearCanvas" class="control-btn">清除画布</button>
      <button @click="saveInteraction" class="control-btn">保存数据</button>
    </div>

    <!-- 互动记录 -->
    <div class="interaction-log">
      <h3>最近互动记录</h3>
      <div class="log-list">
        <div
          v-for="(log, index) in interactionLogs.slice(-5).reverse()"
          :key="index"
          class="log-item"
        >
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          <span class="log-type">{{ log.type }}</span>
          <span class="log-detail">{{ log.detail }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 统计数据
const stats = ref({
  taps: 0,
  longPress: 0,
  swipes: 0,
  doubleTaps: 0
});

// 触摸状态
const touchStartTime = ref(0);
const touchStartPos = ref({ x: 0, y: 0 });
const lastTapTime = ref(0);
const longPressTimer = ref(null);
const activeTouches = ref([]);
const touchPath = ref([]);

// 手势识别
const lastGesture = ref('');
const gestureIcon = ref('');
const drawMode = ref(false);

// 视觉反馈
const ripples = ref([]);
const backgroundColor = ref('#1a1a2e');
const showHint = ref(true);
const hintText = ref('点击、长按或滑动屏幕进行互动！');

// 互动区域引用
const interactionArea = ref(null);

// 互动日志
const interactionLogs = ref([]);

// 计算 SVG 路径
const pathData = computed(() => {
  if (touchPath.value.length === 0) return '';
  let path = `M ${touchPath.value[0].x} ${touchPath.value[0].y}`;
  for (let i = 1; i < touchPath.value.length; i++) {
    path += ` L ${touchPath.value[i].x} ${touchPath.value[i].y}`;
  }
  return path;
});

// 处理点击
const handleClick = (e) => {
  if (e.touches) return; // 忽略触摸设备的点击事件

  const now = Date.now();
  if (now - lastTapTime.value < 300) {
    handleDoubleTap(e);
  } else {
    handleTap(e);
  }
  lastTapTime.value = now;
};

// 单击处理
const handleTap = (e) => {
  stats.value.taps++;
  createRipple(e.clientX, e.clientY);
  addLog('点击', `位置: (${Math.round(e.clientX)}, ${Math.round(e.clientY)})`);
  showGesture('点击', '👆');
  flashBackground('#2a2a4e');
};

// 双击处理
const handleDoubleTap = (e) => {
  stats.value.doubleTaps++;
  createRipple(e.clientX, e.clientY);
  addLog('双击', `位置: (${Math.round(e.clientX)}, ${Math.round(e.clientY)})`);
  showGesture('双击', '👆👆');
  flashBackground('#4a2a4e');
};

// 触摸开始
const handleTouchStart = (e) => {
  e.preventDefault();

  const touch = e.touches[0];
  touchStartTime.value = Date.now();
  touchStartPos.value = { x: touch.clientX, y: touch.clientY };

  // 记录多点触控
  activeTouches.value = Array.from(e.touches).map((t, index) => ({
    id: index + 1,
    x: t.clientX,
    y: t.clientY
  }));

  // 绘画模式开始路径
  if (drawMode.value) {
    const rect = interactionArea.value.getBoundingClientRect();
    touchPath.value = [{ x: touch.clientX - rect.left, y: touch.clientY - rect.top }];
  }

  // 启动长按定时器
  longPressTimer.value = setTimeout(() => {
    handleLongPress(touch);
  }, 500);

  // 检测多点触控
  if (e.touches.length > 1) {
    clearTimeout(longPressTimer.value);
    handleMultiTouch(e.touches);
  }
};

// 触摸移动
const handleTouchMove = (e) => {
  e.preventDefault();

  clearTimeout(longPressTimer.value);

  const touch = e.touches[0];

  // 更新活动触摸点
  activeTouches.value = Array.from(e.touches).map((t, index) => ({
    id: index + 1,
    x: t.clientX,
    y: t.clientY
  }));

  // 绘画模式添加路径点
  if (drawMode.value && interactionArea.value) {
    const rect = interactionArea.value.getBoundingClientRect();
    touchPath.value.push({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  }
};

// 触摸结束
const handleTouchEnd = (e) => {
  e.preventDefault();

  clearTimeout(longPressTimer.value);

  const touchDuration = Date.now() - touchStartTime.value;
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartPos.value.x;
  const deltaY = touch.clientY - touchStartPos.value.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // 清除活动触摸点
  activeTouches.value = [];

  // 判断是滑动还是点击
  if (distance > 50) {
    handleSwipe(deltaX, deltaY, distance);
  } else if (touchDuration < 500) {
    const now = Date.now();
    if (now - lastTapTime.value < 300) {
      handleDoubleTap(touch);
    } else {
      handleTap(touch);
    }
    lastTapTime.value = now;
  }

  // 清除绘画路径（如果不在绘画模式）
  if (!drawMode.value) {
    setTimeout(() => {
      touchPath.value = [];
    }, 500);
  }
};

// 长按处理
const handleLongPress = (touch) => {
  stats.value.longPress++;
  createRipple(touch.clientX, touch.clientY, true);
  addLog('长按', `位置: (${Math.round(touch.clientX)}, ${Math.round(touch.clientY)})`);
  showGesture('长按', '👇');
  flashBackground('#4e2a2a');

  // 震动反馈（如果支持）
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
};

// 滑动处理
const handleSwipe = (deltaX, deltaY, distance) => {
  stats.value.swipes++;

  let direction = '';
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    direction = deltaX > 0 ? '右滑' : '左滑';
  } else {
    direction = deltaY > 0 ? '下滑' : '上滑';
  }

  const directionIcon = {
    '右滑': '👉',
    '左滑': '👈',
    '下滑': '👇',
    '上滑': '👆'
  };

  addLog('滑动', `${direction} 距离: ${Math.round(distance)}px`);
  showGesture(direction, directionIcon[direction]);
  flashBackground('#2a4e4e');
};

// 多点触控处理
const handleMultiTouch = (touches) => {
  const touchCount = touches.length;
  addLog('多点触控', `${touchCount} 个触摸点`);
  showGesture(`${touchCount}点触控`, '✋');
  flashBackground('#4e4e2a');
};

// 创建波纹效果
const createRipple = (x, y, isLongPress = false) => {
  const rippleId = Date.now() + Math.random();
  ripples.value.push({ id: rippleId, x, y, isLongPress });

  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== rippleId);
  }, 1000);
};

// 显示手势结果
const showGesture = (gesture, icon) => {
  lastGesture.value = gesture;
  gestureIcon.value = icon;
  showHint.value = false;

  setTimeout(() => {
    lastGesture.value = '';
    gestureIcon.value = '';
  }, 2000);
};

// 背景闪烁效果
const flashBackground = (color) => {
  backgroundColor.value = color;
  setTimeout(() => {
    backgroundColor.value = '#1a1a2e';
  }, 200);
};

// 添加日志
const addLog = (type, detail) => {
  interactionLogs.value.push({
    type,
    detail,
    timestamp: Date.now()
  });

  // 只保留最近50条记录
  if (interactionLogs.value.length > 50) {
    interactionLogs.value.shift();
  }
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

// 切换绘画模式
const toggleDrawMode = () => {
  drawMode.value = !drawMode.value;
  if (!drawMode.value) {
    touchPath.value = [];
  }
};

// 清除画布
const clearCanvas = () => {
  touchPath.value = [];
  ripples.value = [];
  addLog('系统', '清除画布');
};

// 重置统计
const resetStats = () => {
  stats.value = {
    taps: 0,
    longPress: 0,
    swipes: 0,
    doubleTaps: 0
  };
  interactionLogs.value = [];
  addLog('系统', '重置统计数据');
};

// 保存互动数据到服务器
const saveInteraction = async () => {
  try {
    const response = await fetch('/api/mobile-interaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        stats: stats.value,
        logs: interactionLogs.value,
        timestamp: Date.now()
      })
    });

    if (response.ok) {
      addLog('系统', '数据已保存到服务器');
      alert('互动数据已保存！');
    } else {
      addLog('系统', '保存失败');
      alert('保存失败，请重试');
    }
  } catch (error) {
    console.error('保存失败:', error);
    addLog('系统', '保存出错: ' + error.message);
  }
};

// 防止页面滚动
onMounted(() => {
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';
});

onUnmounted(() => {
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
});
</script>

<style scoped>
.mobile-interaction {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f0f1e;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.stats {
  display: flex;
  gap: 15px;
  font-size: 14px;
  font-weight: 500;
}

.stats span {
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 12px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.7);
}

/* 互动区域 */
.interaction-area {
  flex: 1;
  position: relative;
  background: #1a1a2e;
  transition: background 0.2s ease;
  overflow: hidden;
}

/* 波纹效果 */
.ripple {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%);
  transform: translate(-50%, -50%) scale(0);
  animation: ripple-animation 1s ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

/* 触摸画布 */
.touch-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 提示文本 */
.hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 手势结果显示 */
.gesture-result {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: zoom-in 0.3s ease-out;
}

.gesture-icon {
  font-size: 80px;
  animation: bounce 0.5s ease-out;
}

.gesture-name {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

@keyframes zoom-in {
  from {
    transform: translate(-50%, -50%) scale(0);
  }
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 触摸点显示 */
.touch-point {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px solid #00ff00;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: touch-pulse 1s infinite;
}

.touch-id {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 700;
  color: #00ff00;
}

@keyframes touch-pulse {
  0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
}

/* 控制面板 */
.control-panel {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: #16213e;
  border-top: 2px solid #0f3460;
}

.control-btn {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
  color: #fff;
  border: 2px solid #0f3460;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.control-btn.active {
  background: linear-gradient(135deg, #e94560 0%, #533483 100%);
  border-color: #e94560;
}

/* 互动记录 */
.interaction-log {
  background: #0f0f1e;
  padding: 15px;
  border-top: 2px solid #667eea;
  max-height: 200px;
  overflow-y: auto;
}

.interaction-log h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #667eea;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 5px;
  font-size: 12px;
}

.log-time {
  color: #888;
  min-width: 60px;
}

.log-type {
  color: #667eea;
  font-weight: 600;
  min-width: 60px;
}

.log-detail {
  color: #ccc;
  flex: 1;
}

/* 滚动条样式 */
.interaction-log::-webkit-scrollbar {
  width: 6px;
}

.interaction-log::-webkit-scrollbar-track {
  background: #0f0f1e;
}

.interaction-log::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 3px;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .stats {
    font-size: 12px;
    gap: 8px;
  }

  .stats span {
    padding: 4px 8px;
  }

  .control-btn {
    font-size: 12px;
    padding: 10px;
  }

  .gesture-icon {
    font-size: 60px;
  }

  .gesture-name {
    font-size: 20px;
  }
}
</style>
