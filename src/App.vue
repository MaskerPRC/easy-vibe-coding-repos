<template>
  <div class="app">
    <!-- 星空背景 -->
    <div class="stars"></div>
    <div class="stars2"></div>
    <div class="stars3"></div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="main-title">
          <span class="spacex-logo">SPACE<span class="x-letter">X</span></span>
          <span class="subtitle">发射倒计时</span>
        </h1>
      </div>

      <!-- 倒计时模块 -->
      <div class="countdown-module card">
        <div v-if="loading" class="loading">
          <div class="loader"></div>
          <p>正在加载发射数据...</p>
        </div>

        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
        </div>

        <div v-else-if="launchData" class="countdown-content">
          <!-- 任务信息 -->
          <div class="mission-info">
            <h2 class="mission-name">{{ launchData.name }}</h2>
            <p class="launch-date">
              发射时间: {{ formatDate(launchData.date_utc) }}
            </p>
            <p v-if="launchData.details" class="mission-details">
              {{ launchData.details }}
            </p>
          </div>

          <!-- 倒计时数字 -->
          <div class="countdown-timer">
            <div class="time-unit">
              <span class="time-number">{{ countdown.days }}</span>
              <span class="time-label">天</span>
            </div>
            <div class="time-separator">:</div>
            <div class="time-unit">
              <span class="time-number">{{ countdown.hours }}</span>
              <span class="time-label">时</span>
            </div>
            <div class="time-separator">:</div>
            <div class="time-unit">
              <span class="time-number">{{ countdown.minutes }}</span>
              <span class="time-label">分</span>
            </div>
            <div class="time-separator">:</div>
            <div class="time-unit">
              <span class="time-number">{{ countdown.seconds }}</span>
              <span class="time-label">秒</span>
            </div>
          </div>

          <!-- 发射地点 -->
          <div v-if="launchData.launchpad" class="launch-location">
            <span class="location-icon">📍</span>
            <span>{{ getLaunchpadName() }}</span>
          </div>
        </div>
      </div>

      <!-- 天气预报模块 -->
      <div class="weather-module card">
        <h3 class="weather-title">
          <span class="weather-icon">☀️</span>
          肯尼迪航天中心天气
        </h3>

        <div v-if="weatherLoading" class="loading">
          <div class="loader"></div>
          <p>正在加载天气数据...</p>
        </div>

        <div v-else-if="weatherError" class="error">
          <p>{{ weatherError }}</p>
        </div>

        <div v-else-if="weatherData" class="weather-content">
          <!-- 当前天气 -->
          <div class="current-weather">
            <div class="weather-main">
              <div class="weather-code-icon">{{ getWeatherIcon(weatherData.current.weather_code) }}</div>
              <div class="temperature">
                <span class="temp-value">{{ Math.round(weatherData.current.temperature_2m) }}</span>
                <span class="temp-unit">°C</span>
              </div>
            </div>

            <div class="weather-details">
              <div class="weather-detail-item">
                <span class="detail-icon">💧</span>
                <span class="detail-label">湿度</span>
                <span class="detail-value">{{ weatherData.current.relative_humidity_2m }}%</span>
              </div>
              <div class="weather-detail-item">
                <span class="detail-icon">💨</span>
                <span class="detail-label">风速</span>
                <span class="detail-value">{{ weatherData.current.wind_speed_10m }} km/h</span>
              </div>
            </div>
          </div>

          <!-- 未来天气 -->
          <div class="forecast">
            <div v-for="(day, index) in getForecastDays()" :key="index" class="forecast-day">
              <p class="forecast-date">{{ day.date }}</p>
              <div class="forecast-icon">{{ getWeatherIcon(day.weatherCode) }}</div>
              <p class="forecast-temp">
                <span class="temp-max">{{ day.max }}°</span>
                <span class="temp-min">{{ day.min }}°</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 发射数据
const launchData = ref(null);
const loading = ref(true);
const error = ref(null);

// 天气数据
const weatherData = ref(null);
const weatherLoading = ref(true);
const weatherError = ref(null);

// 倒计时
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});

let countdownInterval = null;

// 获取 SpaceX 发射数据
const fetchLaunchData = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await fetch('/api/spacex/next-launch');
    if (!response.ok) throw new Error('获取发射数据失败');
    launchData.value = await response.json();
    startCountdown();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 获取天气数据
const fetchWeatherData = async () => {
  try {
    weatherLoading.value = true;
    weatherError.value = null;
    const response = await fetch('/api/weather');
    if (!response.ok) throw new Error('获取天气数据失败');
    weatherData.value = await response.json();
  } catch (err) {
    weatherError.value = err.message;
  } finally {
    weatherLoading.value = false;
  }
};

// 开始倒计时
const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval);

  const updateCountdown = () => {
    if (!launchData.value) return;

    const now = new Date().getTime();
    const launchTime = new Date(launchData.value.date_utc).getTime();
    const distance = launchTime - now;

    if (distance < 0) {
      countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      clearInterval(countdownInterval);
      return;
    }

    countdown.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  };

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

// 获取发射地点名称
const getLaunchpadName = () => {
  // 简化的发射场ID映射
  const launchpadNames = {
    '5e9e4502f509094188566f88': '肯尼迪航天中心 LC-39A',
    '5e9e4501f509092b78566f87': '范登堡空军基地 SLC-4E',
    '5e9e4502f5090995de566f86': '卡纳维拉尔角 SLC-40'
  };
  return launchpadNames[launchData.value.launchpad] || '发射场';
};

// 获取天气图标
const getWeatherIcon = (code) => {
  const weatherIcons = {
    0: '☀️',  // 晴朗
    1: '🌤️',  // 主要晴朗
    2: '⛅',  // 部分多云
    3: '☁️',  // 阴天
    45: '🌫️', // 雾
    48: '🌫️', // 结霜雾
    51: '🌦️', // 小雨
    53: '🌧️', // 中雨
    55: '🌧️', // 大雨
    61: '🌧️', // 小雨
    63: '🌧️', // 中雨
    65: '🌧️', // 大雨
    71: '🌨️', // 小雪
    73: '🌨️', // 中雪
    75: '🌨️', // 大雪
    77: '🌨️', // 雪粒
    80: '🌦️', // 阵雨
    81: '🌧️', // 阵雨
    82: '⛈️', // 强阵雨
    85: '🌨️', // 阵雪
    86: '🌨️', // 强阵雪
    95: '⛈️', // 雷暴
    96: '⛈️', // 雷暴带雨
    99: '⛈️'  // 雷暴带大雨
  };
  return weatherIcons[code] || '🌤️';
};

// 获取未来几天天气
const getForecastDays = () => {
  if (!weatherData.value || !weatherData.value.daily) return [];

  const days = [];
  const today = new Date();

  for (let i = 1; i < 4 && i < weatherData.value.daily.time.length; i++) {
    const date = new Date(weatherData.value.daily.time[i]);
    days.push({
      date: `${date.getMonth() + 1}月${date.getDate()}日`,
      weatherCode: weatherData.value.daily.weather_code[i],
      max: Math.round(weatherData.value.daily.temperature_2m_max[i]),
      min: Math.round(weatherData.value.daily.temperature_2m_min[i])
    });
  }

  return days;
};

// 组件挂载时获取数据
onMounted(() => {
  fetchLaunchData();
  fetchWeatherData();
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
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
  background: #0A1930;
  position: relative;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 星空背景动画 */
.stars,
.stars2,
.stars3 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.stars {
  background: transparent url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PC9zdmc+') repeat;
  animation: animateStars 100s linear infinite;
}

.stars2 {
  background: transparent url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMyIgaGVpZ2h0PSIzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+') repeat;
  animation: animateStars 150s linear infinite;
}

.stars3 {
  background: transparent url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+') repeat;
  animation: animateStars 200s linear infinite;
}

@keyframes animateStars {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

/* 主内容区 */
.main-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.main-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spacex-logo {
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 8px;
  color: #E0E6F0;
  text-transform: uppercase;
}

.x-letter {
  color: #00C6FF;
}

.subtitle {
  font-size: 24px;
  font-weight: 300;
  color: #A0B0C0;
  letter-spacing: 4px;
}

/* 卡片样式 */
.card {
  background: linear-gradient(135deg, #1A2B42 0%, #0D1829 100%);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 198, 255, 0.1),
              0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 198, 255, 0.2);
  margin-bottom: 40px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 70px rgba(0, 198, 255, 0.2),
              0 0 2px rgba(255, 255, 255, 0.2);
}

/* 加载和错误状态 */
.loading,
.error {
  text-align: center;
  padding: 40px 20px;
  color: #A0B0C0;
}

.loader {
  border: 4px solid #1A2B42;
  border-top: 4px solid #00C6FF;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #ff6b6b;
}

/* 倒计时模块 */
.countdown-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.mission-info {
  text-align: center;
}

.mission-name {
  font-size: 32px;
  font-weight: 700;
  color: #E0E6F0;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #00C6FF 0%, #0052D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.launch-date {
  font-size: 18px;
  color: #A0B0C0;
  margin-bottom: 16px;
}

.mission-details {
  font-size: 16px;
  color: #A0B0C0;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

/* 倒计时数字 */
.countdown-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.time-number {
  font-size: 72px;
  font-weight: 900;
  color: #00C6FF;
  text-shadow: 0 0 20px rgba(0, 198, 255, 0.5);
  min-width: 120px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.time-label {
  font-size: 16px;
  color: #A0B0C0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.time-separator {
  font-size: 48px;
  color: #0052D4;
  font-weight: 700;
  margin: 0 -8px;
  align-self: flex-start;
  margin-top: 10px;
}

/* 发射地点 */
.launch-location {
  text-align: center;
  font-size: 18px;
  color: #A0B0C0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.location-icon {
  font-size: 24px;
}

/* 天气模块 */
.weather-title {
  font-size: 28px;
  font-weight: 700;
  color: #E0E6F0;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-icon {
  font-size: 32px;
}

.weather-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 当前天气 */
.current-weather {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 24px;
}

.weather-code-icon {
  font-size: 80px;
}

.temperature {
  display: flex;
  align-items: flex-start;
}

.temp-value {
  font-size: 80px;
  font-weight: 900;
  color: #FFD700;
  line-height: 1;
}

.temp-unit {
  font-size: 32px;
  color: #A0B0C0;
  margin-top: 8px;
  margin-left: 4px;
}

.weather-details {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.weather-detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.detail-icon {
  font-size: 32px;
}

.detail-label {
  font-size: 14px;
  color: #A0B0C0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-value {
  font-size: 24px;
  font-weight: 700;
  color: #E0E6F0;
}

/* 未来天气预报 */
.forecast {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
  padding-top: 32px;
  border-top: 1px solid rgba(160, 176, 192, 0.2);
}

.forecast-day {
  text-align: center;
  padding: 20px;
  background: rgba(26, 43, 66, 0.5);
  border-radius: 16px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.forecast-day:hover {
  transform: translateY(-5px);
  background: rgba(26, 43, 66, 0.8);
}

.forecast-date {
  font-size: 14px;
  color: #A0B0C0;
  margin-bottom: 12px;
}

.forecast-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.forecast-temp {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 18px;
}

.temp-max {
  color: #FFD700;
  font-weight: 700;
}

.temp-min {
  color: #00C6FF;
  font-weight: 700;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    padding: 40px 24px;
  }

  .card {
    padding: 32px 24px;
  }

  .time-number {
    font-size: 56px;
    min-width: 100px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 32px 20px;
  }

  .page-header {
    margin-bottom: 40px;
  }

  .spacex-logo {
    font-size: 40px;
    letter-spacing: 4px;
  }

  .subtitle {
    font-size: 18px;
  }

  .card {
    padding: 24px 20px;
    margin-bottom: 32px;
  }

  .mission-name {
    font-size: 24px;
  }

  .launch-date,
  .launch-location {
    font-size: 16px;
  }

  .mission-details {
    font-size: 14px;
  }

  .countdown-timer {
    gap: 16px;
  }

  .time-number {
    font-size: 48px;
    min-width: 80px;
  }

  .time-label {
    font-size: 14px;
  }

  .time-separator {
    font-size: 36px;
  }

  .weather-title {
    font-size: 24px;
  }

  .current-weather {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }

  .weather-main {
    width: 100%;
    justify-content: center;
  }

  .weather-details {
    width: 100%;
    justify-content: space-around;
  }

  .temp-value {
    font-size: 64px;
  }

  .forecast {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .spacex-logo {
    font-size: 32px;
  }

  .subtitle {
    font-size: 16px;
  }

  .card {
    padding: 20px 16px;
  }

  .mission-name {
    font-size: 20px;
  }

  .countdown-timer {
    gap: 12px;
  }

  .time-number {
    font-size: 36px;
    min-width: 60px;
  }

  .time-label {
    font-size: 12px;
  }

  .time-separator {
    font-size: 28px;
    margin: 0 -12px;
  }

  .weather-code-icon {
    font-size: 60px;
  }

  .temp-value {
    font-size: 52px;
  }

  .temp-unit {
    font-size: 24px;
  }

  .detail-icon {
    font-size: 24px;
  }

  .detail-value {
    font-size: 20px;
  }

  .forecast {
    grid-template-columns: 1fr;
  }

  .forecast-icon {
    font-size: 40px;
  }
}
</style>
