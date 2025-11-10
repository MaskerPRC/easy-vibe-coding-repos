<template>
  <div class="app">
    <div class="timer-container">
      <div class="timer-box">
        <!-- 计时器显示 -->
        <div class="timer-display">{{ formattedTime }}</div>

        <!-- 开始时间提示 -->
        <div class="timer-info" v-if="startTime">
          开始时间: {{ formatStartTime }}
        </div>

        <!-- 操作按钮 -->
        <div class="button-group">
          <button
            v-if="!isRunning"
            @click="startTimer"
            class="btn btn-start"
            :disabled="loading"
          >
            {{ startTime ? '继续' : '开始' }}
          </button>
          <button
            v-if="isRunning"
            @click="pauseTimer"
            class="btn btn-pause"
            :disabled="loading"
          >
            暂停
          </button>
          <button
            @click="resetTimer"
            class="btn btn-reset"
            :disabled="loading"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

// 状态
const isRunning = ref(false);
const startTime = ref(null);
const elapsedTime = ref(0);
const loading = ref(false);
let intervalId = null;

// 格式化时间显示（HH:MM:SS）
const formattedTime = computed(() => {
  const totalSeconds = Math.floor(elapsedTime.value / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// 格式化开始时间
const formatStartTime = computed(() => {
  if (!startTime.value) return '';
  const date = new Date(startTime.value);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
});

// 获取计时器状态
const fetchStatus = async () => {
  try {
    const response = await axios.get('/api/timer/status');
    isRunning.value = response.data.isRunning;
    startTime.value = response.data.startTime;
    elapsedTime.value = response.data.elapsedTime;
  } catch (error) {
    console.error('获取状态失败:', error);
  }
};

// 开始计时
const startTimer = async () => {
  loading.value = true;
  try {
    await axios.post('/api/timer/start');
    await fetchStatus();
    startInterval();
  } catch (error) {
    console.error('开始计时失败:', error);
  } finally {
    loading.value = false;
  }
};

// 暂停计时
const pauseTimer = async () => {
  loading.value = true;
  try {
    await axios.post('/api/timer/pause');
    await fetchStatus();
    stopInterval();
  } catch (error) {
    console.error('暂停计时失败:', error);
  } finally {
    loading.value = false;
  }
};

// 重置计时
const resetTimer = async () => {
  loading.value = true;
  try {
    await axios.post('/api/timer/reset');
    await fetchStatus();
    stopInterval();
  } catch (error) {
    console.error('重置计时失败:', error);
  } finally {
    loading.value = false;
  }
};

// 启动定时更新
const startInterval = () => {
  if (intervalId) return;
  intervalId = setInterval(() => {
    fetchStatus();
  }, 100); // 每100毫秒更新一次
};

// 停止定时更新
const stopInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// 组件挂载时获取初始状态
onMounted(async () => {
  await fetchStatus();
  if (isRunning.value) {
    startInterval();
  }
});

// 组件卸载时清理定时器
onUnmounted(() => {
  stopInterval();
});
</script>

<style scoped>
/* 导入字体 */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: 'Roboto', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.timer-container {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.timer-box {
  background: #FFFFFF;
  padding: 48px 32px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
}

/* 计时器显示 */
.timer-display {
  font-size: 64px;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 24px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.05em;
  font-family: 'Roboto', monospace;
}

/* 开始时间提示 */
.timer-info {
  font-size: 14px;
  color: #666666;
  margin-bottom: 32px;
  font-weight: 400;
}

/* 按钮组 */
.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 按钮通用样式 */
.btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Roboto', sans-serif;
  min-width: 100px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 开始按钮 */
.btn-start {
  background: #4CAF50;
  color: #FFFFFF;
}

.btn-start:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0px 4px 8px rgba(76, 175, 80, 0.3);
}

.btn-start:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0px 2px 4px rgba(76, 175, 80, 0.3);
}

/* 暂停按钮 */
.btn-pause {
  background: #FFC107;
  color: #333333;
}

.btn-pause:hover:not(:disabled) {
  background: #ffb300;
  transform: translateY(-1px);
  box-shadow: 0px 4px 8px rgba(255, 193, 7, 0.3);
}

.btn-pause:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0px 2px 4px rgba(255, 193, 7, 0.3);
}

/* 重置按钮 */
.btn-reset {
  background: #E0E0E0;
  color: #333333;
}

.btn-reset:hover:not(:disabled) {
  background: #d5d5d5;
  transform: translateY(-1px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-reset:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timer-box {
    padding: 40px 24px;
  }

  .timer-display {
    font-size: 56px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 15px;
    min-width: 90px;
  }
}

@media (max-width: 480px) {
  .app {
    padding: 16px;
  }

  .timer-box {
    padding: 32px 20px;
  }

  .timer-display {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .timer-info {
    font-size: 13px;
    margin-bottom: 24px;
  }

  .button-group {
    gap: 12px;
  }

  .btn {
    padding: 10px 18px;
    font-size: 14px;
    min-width: 80px;
  }
}
</style>
