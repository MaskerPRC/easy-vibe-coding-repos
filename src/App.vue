<template>
  <div class="app">
    <div class="clock-container">
      <div class="time-display">
        <div class="main-time">{{ currentTime }}</div>
        <div class="date-display">{{ currentDate }}</div>
        <div class="period">{{ period }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref('');
const currentDate = ref('');
const period = ref('');
let timer = null;

const updateTime = () => {
  const now = new Date();

  // 格式化时间 (HH:MM:SS)
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;

  // 格式化日期
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekday = weekdays[now.getDay()];
  currentDate.value = `${year}年${month}月${day}日 ${weekday}`;

  // 时段
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) {
    period.value = '上午';
  } else if (hour >= 12 && hour < 18) {
    period.value = '下午';
  } else {
    period.value = '晚上';
  }
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
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
  padding: 20px;
  font-family: 'Inter', 'SF Pro Display', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.clock-container {
  width: 100%;
  max-width: 1200px;
  text-align: center;
}

.time-display {
  position: relative;
}

.main-time {
  font-size: 120px;
  font-weight: 600;
  color: #333333;
  letter-spacing: 0.05em;
  line-height: 1.2;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  font-variant-numeric: tabular-nums;
}

.date-display {
  font-size: 24px;
  font-weight: 400;
  color: #333333;
  opacity: 0.85;
  margin-bottom: 16px;
  letter-spacing: 0.02em;
}

.period {
  font-size: 20px;
  font-weight: 500;
  color: #3366CC;
  opacity: 0.9;
  letter-spacing: 0.05em;
}

/* 平板适配 */
@media (max-width: 1024px) {
  .main-time {
    font-size: 96px;
  }

  .date-display {
    font-size: 22px;
  }

  .period {
    font-size: 18px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .main-time {
    font-size: 72px;
    margin-bottom: 20px;
  }

  .date-display {
    font-size: 20px;
    margin-bottom: 14px;
  }

  .period {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .app {
    padding: 15px;
  }

  .main-time {
    font-size: 56px;
    margin-bottom: 16px;
  }

  .date-display {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .period {
    font-size: 14px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  .main-time {
    font-size: 48px;
  }

  .date-display {
    font-size: 16px;
  }

  .period {
    font-size: 13px;
  }
}
</style>
