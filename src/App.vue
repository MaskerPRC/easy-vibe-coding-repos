<template>
  <div class="app">
    <div class="stars-background">
      <div class="star" v-for="n in 50" :key="n" :style="getStarStyle(n)"></div>
    </div>

    <div class="countdown-container">
      <!-- 标题 -->
      <h1 class="title">
        <span class="title-highlight">中国</span>登月倒计时
      </h1>

      <!-- 倒计时数字 -->
      <div class="countdown-digits">
        <div class="digit-group">
          <div class="digit-value">{{ days }}</div>
          <div class="digit-label">天</div>
        </div>

        <div class="digit-separator">:</div>

        <div class="digit-group">
          <div class="digit-value">{{ hours }}</div>
          <div class="digit-label">时</div>
        </div>

        <div class="digit-separator">:</div>

        <div class="digit-group">
          <div class="digit-value">{{ minutes }}</div>
          <div class="digit-label">分</div>
        </div>

        <div class="digit-separator">:</div>

        <div class="digit-group">
          <div class="digit-value">{{ seconds }}</div>
          <div class="digit-label">秒</div>
        </div>
      </div>

      <!-- 目标日期 -->
      <div class="target-date">
        目标时间：<span class="date-highlight">2030年1月1日</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 倒计时数据
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

// 目标时间：2030年1月1日 00:00:00
const targetDate = new Date('2030-01-01T00:00:00').getTime();

// 更新倒计时
const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance > 0) {
    days.value = Math.floor(distance / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((distance % (1000 * 60)) / 1000);
  } else {
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
  }
};

// 生成星星样式
const getStarStyle = (n) => {
  const seed = n * 9301 + 49297;
  const left = (seed % 100);
  const top = ((seed * 233) % 100);
  const size = (seed % 3) + 1;
  const duration = (seed % 10) + 5;

  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${(seed % 5)}s`
  };
};

let timer = null;

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
/* 导入科技感字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+SC:wght@400;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(180deg, #0A192A 0%, #0D47A1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 星空背景 */
.stars-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.star {
  position: absolute;
  background: #ffffff;
  border-radius: 50%;
  opacity: 0.8;
  animation: twinkle linear infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 倒计时容器 */
.countdown-container {
  width: 100%;
  max-width: 1200px;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 标题 */
.title {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #E0E0E0;
  margin-bottom: 64px;
  letter-spacing: 8px;
  text-shadow: 0 0 20px rgba(66, 165, 245, 0.5);
}

.title-highlight {
  color: #FFD700;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
}

/* 倒计时数字区域 */
.countdown-digits {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 64px;
}

.digit-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.digit-value {
  font-family: 'Orbitron', monospace;
  font-size: 120px;
  font-weight: 900;
  color: #42A5F5;
  line-height: 1;
  text-shadow:
    0 0 20px rgba(66, 165, 245, 0.8),
    0 0 40px rgba(66, 165, 245, 0.5),
    0 0 60px rgba(66, 165, 245, 0.3);
  min-width: 180px;
  background: linear-gradient(180deg, #42A5F5 0%, #1976D2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

.digit-label {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 24px;
  font-weight: 400;
  color: #E0E0E0;
  letter-spacing: 4px;
}

.digit-separator {
  font-family: 'Orbitron', monospace;
  font-size: 80px;
  font-weight: 700;
  color: #42A5F5;
  opacity: 0.6;
  margin: 0 8px;
  align-self: flex-start;
  margin-top: 20px;
}

/* 目标日期 */
.target-date {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 28px;
  color: #E0E0E0;
  letter-spacing: 2px;
  opacity: 0.9;
}

.date-highlight {
  color: #FFD700;
  font-weight: 700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

/* 响应式设计 - 平板 */
@media (max-width: 1024px) {
  .title {
    font-size: 40px;
    margin-bottom: 48px;
    letter-spacing: 6px;
  }

  .countdown-digits {
    gap: 16px;
    margin-bottom: 48px;
  }

  .digit-value {
    font-size: 90px;
    min-width: 140px;
  }

  .digit-label {
    font-size: 20px;
  }

  .digit-separator {
    font-size: 60px;
    margin-top: 15px;
  }

  .target-date {
    font-size: 24px;
  }
}

/* 响应式设计 - 手机横屏 */
@media (max-width: 768px) {
  .title {
    font-size: 32px;
    margin-bottom: 40px;
    letter-spacing: 4px;
  }

  .countdown-digits {
    gap: 12px;
    margin-bottom: 40px;
  }

  .digit-value {
    font-size: 64px;
    min-width: 100px;
  }

  .digit-label {
    font-size: 16px;
    letter-spacing: 2px;
  }

  .digit-separator {
    font-size: 40px;
    margin: 0 4px;
    margin-top: 10px;
  }

  .target-date {
    font-size: 20px;
  }
}

/* 响应式设计 - 手机竖屏 */
@media (max-width: 480px) {
  .app {
    padding: 15px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 32px;
    letter-spacing: 2px;
  }

  .countdown-digits {
    gap: 8px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  .digit-value {
    font-size: 48px;
    min-width: 75px;
  }

  .digit-label {
    font-size: 14px;
    letter-spacing: 1px;
  }

  .digit-separator {
    font-size: 32px;
    margin: 0 2px;
    margin-top: 8px;
  }

  .target-date {
    font-size: 16px;
    letter-spacing: 1px;
  }
}
</style>
