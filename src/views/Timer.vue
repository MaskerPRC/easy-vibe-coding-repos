<template>
  <div class="timer-container">
    <div class="timer-card">
      <h1 class="timer-title">计时器</h1>
      <div class="timer-display">
        <div class="time-block">
          <span class="time-value">{{ formattedHours }}</span>
          <span class="time-label">小时</span>
        </div>
        <span class="time-separator">:</span>
        <div class="time-block">
          <span class="time-value">{{ formattedMinutes }}</span>
          <span class="time-label">分钟</span>
        </div>
        <span class="time-separator">:</span>
        <div class="time-block">
          <span class="time-value">{{ formattedSeconds }}</span>
          <span class="time-label">秒</span>
        </div>
      </div>
      <div class="timer-controls">
        <button
          @click="toggleTimer"
          :class="['btn', 'btn-primary', { 'btn-pause': isRunning }]"
        >
          {{ isRunning ? '暂停' : '开始' }}
        </button>
        <button @click="resetTimer" class="btn btn-secondary">
          重置
        </button>
      </div>
      <div class="timer-laps" v-if="laps.length > 0">
        <h3 class="laps-title">计次记录</h3>
        <button @click="addLap" class="btn btn-lap" v-if="isRunning">
          记录
        </button>
        <div class="laps-list">
          <div v-for="(lap, index) in laps" :key="index" class="lap-item">
            <span class="lap-number">#{{ laps.length - index }}</span>
            <span class="lap-time">{{ formatTime(lap) }}</span>
          </div>
        </div>
      </div>
      <button v-else-if="isRunning" @click="addLap" class="btn btn-lap">
        记录计次
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const seconds = ref(0);
const isRunning = ref(false);
let intervalId = null;
const laps = ref([]);

const formattedHours = computed(() => {
  return String(Math.floor(seconds.value / 3600)).padStart(2, '0');
});

const formattedMinutes = computed(() => {
  return String(Math.floor((seconds.value % 3600) / 60)).padStart(2, '0');
});

const formattedSeconds = computed(() => {
  return String(seconds.value % 60).padStart(2, '0');
});

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(intervalId);
    intervalId = null;
  } else {
    intervalId = setInterval(() => {
      seconds.value++;
    }, 1000);
  }
  isRunning.value = !isRunning.value;
};

const resetTimer = () => {
  clearInterval(intervalId);
  intervalId = null;
  seconds.value = 0;
  isRunning.value = false;
  laps.value = [];
};

const addLap = () => {
  laps.value.unshift(seconds.value);
};

const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.timer-container {
  min-height: calc(100vh - 70px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.timer-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
}

.timer-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 40px;
  font-weight: 700;
}

.timer-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 16px;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-value {
  font-size: 4rem;
  font-weight: 700;
  color: #667eea;
  font-family: 'Courier New', monospace;
  line-height: 1;
}

.time-label {
  font-size: 0.875rem;
  color: #666;
  margin-top: 8px;
  font-weight: 500;
}

.time-separator {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
  margin: 0 5px;
  align-self: flex-start;
  margin-top: 5px;
}

.timer-controls {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  padding: 16px 40px;
  font-size: 1.125rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-pause {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-secondary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-lap {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  width: 100%;
  margin-bottom: 20px;
}

.timer-laps {
  margin-top: 30px;
}

.laps-title {
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.laps-list {
  max-height: 300px;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 10px;
}

.lap-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.lap-item:last-child {
  margin-bottom: 0;
}

.lap-number {
  font-weight: 600;
  color: #667eea;
  font-size: 1rem;
}

.lap-time {
  font-family: 'Courier New', monospace;
  font-size: 1.125rem;
  color: #333;
  font-weight: 500;
}

@media (max-width: 768px) {
  .timer-card {
    padding: 30px 20px;
  }

  .timer-title {
    font-size: 2rem;
  }

  .time-value {
    font-size: 3rem;
  }

  .time-separator {
    font-size: 2rem;
  }

  .timer-controls {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    padding: 14px;
  }
}

.laps-list::-webkit-scrollbar {
  width: 8px;
}

.laps-list::-webkit-scrollbar-track {
  background: #e9ecef;
  border-radius: 4px;
}

.laps-list::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.laps-list::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}
</style>
