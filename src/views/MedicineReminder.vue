<template>
  <div class="medicine-reminder">
    <div class="container">
      <h1 class="title">吃药提醒</h1>

      <div class="timer-section">
        <div class="time-display">{{ formatTime(timeLeft) }}</div>
        <div class="timer-label">距离下次吃药时间</div>
      </div>

      <!-- 沙漏动画容器 -->
      <div class="hourglass-container">
        <div class="hourglass" :class="{ flipped: isFlipped }">
          <!-- 沙漏上半部分 -->
          <div class="hourglass-top">
            <svg viewBox="0 0 200 120" class="hourglass-svg">
              <defs>
                <clipPath id="topClip">
                  <path d="M 20,20 L 180,20 L 100,100 Z" />
                </clipPath>
              </defs>
              <!-- 沙漏轮廓 -->
              <path d="M 20,20 L 180,20 L 100,100 Z"
                    fill="none"
                    stroke="#8b7355"
                    stroke-width="3"/>
              <!-- 药丸容器区域 -->
              <g clip-path="url(#topClip)">
                <rect x="20" y="20" width="160" height="80" fill="#f0e6d2" opacity="0.3"/>
              </g>
            </svg>
            <!-- 上半部分的药丸 -->
            <div class="pills-top">
              <div v-for="pill in topPills"
                   :key="pill.id"
                   class="pill"
                   :style="{
                     left: pill.x + 'px',
                     top: pill.y + 'px',
                     animationDelay: pill.delay + 's',
                     backgroundColor: pill.color
                   }">
              </div>
            </div>
          </div>

          <!-- 沙漏中间颈部 - 药丸流淌通道 -->
          <div class="hourglass-neck">
            <svg viewBox="0 0 200 40" class="neck-svg">
              <path d="M 100,0 L 90,20 L 110,20 Z"
                    fill="#8b7355"
                    opacity="0.2"/>
            </svg>
            <!-- 流淌中的药丸 -->
            <div class="pills-falling">
              <div v-for="pill in fallingPills"
                   :key="pill.id"
                   class="pill falling"
                   :style="{
                     left: pill.x + 'px',
                     top: pill.y + 'px',
                     animationDelay: pill.delay + 's',
                     animationDuration: pill.duration + 's',
                     backgroundColor: pill.color
                   }">
              </div>
            </div>
          </div>

          <!-- 沙漏下半部分 -->
          <div class="hourglass-bottom">
            <svg viewBox="0 0 200 120" class="hourglass-svg">
              <defs>
                <clipPath id="bottomClip">
                  <path d="M 100,20 L 20,100 L 180,100 Z" />
                </clipPath>
              </defs>
              <!-- 沙漏轮廓 -->
              <path d="M 100,20 L 20,100 L 180,100 Z"
                    fill="none"
                    stroke="#8b7355"
                    stroke-width="3"/>
              <!-- 药丸容器区域 -->
              <g clip-path="url(#bottomClip)">
                <rect x="20" y="20" width="160" height="80" fill="#f0e6d2" opacity="0.3"/>
              </g>
            </svg>
            <!-- 下半部分的药丸 -->
            <div class="pills-bottom">
              <div v-for="pill in bottomPills"
                   :key="pill.id"
                   class="pill"
                   :style="{
                     left: pill.x + 'px',
                     top: pill.y + 'px',
                     backgroundColor: pill.color
                   }">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="controls">
        <button @click="toggleTimer" class="btn btn-primary">
          {{ isRunning ? '暂停' : '开始' }}
        </button>
        <button @click="resetTimer" class="btn btn-secondary">
          重置
        </button>
        <button @click="flipHourglass" class="btn btn-secondary">
          翻转沙漏
        </button>
      </div>

      <!-- 提醒信息 -->
      <div class="reminder-info">
        <div class="info-card">
          <div class="info-icon">💊</div>
          <div class="info-content">
            <h3>服药时间</h3>
            <p>每天 {{ medicineTime }}</p>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon">⏰</div>
          <div class="info-content">
            <h3>提醒方式</h3>
            <p>声音 + 动画提醒</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// 定时器相关
const timeLeft = ref(300); // 默认5分钟，单位：秒
const isRunning = ref(false);
const isFlipped = ref(false);
const medicineTime = ref('08:00, 14:00, 20:00');
let timerInterval = null;

// 药丸颜色数组
const pillColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ff9ff3', '#54a0ff'];

// 上半部分的药丸
const topPills = ref([]);
// 下半部分的药丸
const bottomPills = ref([]);
// 流淌中的药丸
const fallingPills = ref([]);

// 初始化药丸位置
const initializePills = () => {
  topPills.value = [];
  bottomPills.value = [];
  fallingPills.value = [];

  // 创建上半部分的药丸（三角形区域内）
  for (let i = 0; i < 15; i++) {
    const x = 40 + Math.random() * 120;
    const maxY = (180 - x) * 0.5; // 三角形边界
    const y = 25 + Math.random() * Math.min(maxY - 25, 50);

    topPills.value.push({
      id: `top-${i}`,
      x: x,
      y: y,
      delay: Math.random() * 2,
      color: pillColors[Math.floor(Math.random() * pillColors.length)]
    });
  }

  // 创建下半部分的药丸（初始为空，随着流淌逐渐增加）
  for (let i = 0; i < 5; i++) {
    const x = 60 + Math.random() * 80;
    const y = 60 + Math.random() * 30;

    bottomPills.value.push({
      id: `bottom-${i}`,
      x: x,
      y: y,
      color: pillColors[Math.floor(Math.random() * pillColors.length)]
    });
  }

  // 创建流淌的药丸
  createFallingPills();
};

// 创建流淌的药丸动画
const createFallingPills = () => {
  fallingPills.value = [];
  for (let i = 0; i < 8; i++) {
    fallingPills.value.push({
      id: `falling-${i}`,
      x: 95 + (Math.random() - 0.5) * 10,
      y: -10,
      delay: i * 0.8,
      duration: 2 + Math.random() * 1,
      color: pillColors[Math.floor(Math.random() * pillColors.length)]
    });
  }
};

// 格式化时间显示
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// 开始/暂停定时器
const toggleTimer = () => {
  isRunning.value = !isRunning.value;

  if (isRunning.value) {
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;

        // 每隔一段时间移动药丸
        if (timeLeft.value % 10 === 0) {
          movePillsDown();
        }
      } else {
        // 时间到了，提醒吃药
        isRunning.value = false;
        clearInterval(timerInterval);
        alert('⏰ 该吃药了！');
        resetTimer();
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
  }
};

// 重置定时器
const resetTimer = () => {
  isRunning.value = false;
  clearInterval(timerInterval);
  timeLeft.value = 300;
  initializePills();
};

// 翻转沙漏
const flipHourglass = () => {
  isFlipped.value = !isFlipped.value;
  // 交换上下药丸
  const temp = topPills.value;
  topPills.value = bottomPills.value;
  bottomPills.value = temp;
  createFallingPills();
};

// 模拟药丸下落
const movePillsDown = () => {
  if (topPills.value.length > 0) {
    // 从上面移除一个药丸
    const movedPill = topPills.value.pop();

    // 添加到下面
    bottomPills.value.push({
      id: `bottom-${Date.now()}`,
      x: 60 + Math.random() * 80,
      y: 60 + Math.random() * 30,
      color: movedPill.color
    });

    // 保持下面药丸数量不超过20个
    if (bottomPills.value.length > 20) {
      bottomPills.value.shift();
    }
  }
};

// 组件挂载时初始化
onMounted(() => {
  initializePills();
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
.medicine-reminder {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.timer-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.time-display {
  font-size: 4rem;
  font-weight: bold;
  color: #667eea;
  font-family: 'Courier New', monospace;
}

.timer-label {
  font-size: 1.2rem;
  color: #666;
  margin-top: 10px;
}

/* 沙漏容器 */
.hourglass-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 40px 0;
}

.hourglass {
  position: relative;
  width: 200px;
  height: 280px;
  transition: transform 1s ease-in-out;
}

.hourglass.flipped {
  transform: rotate(180deg);
}

.hourglass-top,
.hourglass-bottom,
.hourglass-neck {
  position: absolute;
  width: 100%;
}

.hourglass-top {
  top: 0;
  height: 120px;
}

.hourglass-neck {
  top: 120px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hourglass-bottom {
  top: 160px;
  height: 120px;
}

.hourglass-svg,
.neck-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 药丸样式 */
.pills-top,
.pills-bottom,
.pills-falling {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.pill {
  position: absolute;
  width: 12px;
  height: 8px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pillFloat 3s ease-in-out infinite;
}

@keyframes pillFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(180deg);
  }
}

.pill.falling {
  animation: pillFall linear infinite;
}

@keyframes pillFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(160px) rotate(720deg);
    opacity: 0.5;
  }
}

/* 控制按钮 */
.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
}

.btn {
  padding: 12px 30px;
  font-size: 1.1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: white;
  color: #667eea;
}

.btn-secondary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
}

/* 提醒信息卡片 */
.reminder-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-icon {
  font-size: 3rem;
}

.info-content h3 {
  color: #667eea;
  margin: 0 0 5px 0;
  font-size: 1.2rem;
}

.info-content p {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .time-display {
    font-size: 3rem;
  }

  .hourglass {
    width: 150px;
    height: 210px;
  }

  .controls {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
