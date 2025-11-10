<template>
  <div class="weather-container">
    <div class="weather-card">
      <h2 class="weather-title">当前天气</h2>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>正在获取天气信息...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p class="error-message">{{ error }}</p>
        <button @click="fetchWeather" class="retry-button">重试</button>
      </div>

      <!-- 天气信息 -->
      <div v-else-if="weather" class="weather-content">
        <div class="weather-main">
          <div class="location-info">
            <h3 class="location-name">{{ weather.location }}</h3>
            <p class="location-region">{{ weather.region }}</p>
          </div>

          <div class="temperature-display">
            <span class="temperature">{{ weather.temperature }}</span>
            <span class="unit">°C</span>
          </div>

          <div class="weather-description">
            <span class="weather-icon">{{ weather.icon }}</span>
            <span class="weather-text">{{ weather.description }}</span>
          </div>
        </div>

        <div class="weather-details">
          <div class="detail-item">
            <span class="detail-label">体感温度</span>
            <span class="detail-value">{{ weather.feelsLike }}°C</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">湿度</span>
            <span class="detail-value">{{ weather.humidity }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">风速</span>
            <span class="detail-value">{{ weather.windSpeed }} km/h</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">气压</span>
            <span class="detail-value">{{ weather.pressure }} hPa</span>
          </div>
        </div>

        <div class="weather-footer">
          <button @click="fetchWeather" class="refresh-button">刷新天气</button>
          <span class="update-time">更新时间: {{ updateTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const weather = ref(null);
const loading = ref(false);
const error = ref(null);
const updateTime = ref('');

const fetchWeather = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get('/api/weather');

    if (response.data.success) {
      weather.value = response.data.data;
      updateTime.value = new Date().toLocaleString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } else {
      error.value = response.data.message || '获取天气信息失败';
    }
  } catch (err) {
    console.error('获取天气失败:', err);
    error.value = err.response?.data?.message || '无法连接到天气服务';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchWeather();
});
</script>

<style scoped>
.weather-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.weather-card {
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
}

.weather-title {
  margin: 0 0 25px 0;
  font-size: 28px;
  color: #00ff88;
  text-align: center;
  font-weight: 600;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid #333;
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 60px 20px;
}

.error-icon {
  font-size: 60px;
  margin-bottom: 15px;
}

.error-message {
  color: #e74c3c;
  font-size: 16px;
  margin-bottom: 20px;
}

.retry-button {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.retry-button:hover {
  transform: translateY(-2px);
}

/* 天气内容 */
.weather-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.weather-main {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
  border: 1px solid #333;
}

.location-info {
  margin-bottom: 20px;
}

.location-name {
  margin: 0;
  font-size: 32px;
  color: #e0e0e0;
  font-weight: 700;
}

.location-region {
  margin: 5px 0 0 0;
  font-size: 16px;
  color: #999;
}

.temperature-display {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 20px 0;
}

.temperature {
  font-size: 80px;
  font-weight: 700;
  color: #00ff88;
  line-height: 1;
}

.unit {
  font-size: 40px;
  color: #00ff88;
  margin-left: 5px;
  margin-top: 10px;
}

.weather-description {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.weather-icon {
  font-size: 40px;
}

.weather-text {
  font-size: 24px;
  color: #e0e0e0;
  font-weight: 500;
}

/* 详细信息 */
.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid #333;
}

.detail-label {
  font-size: 14px;
  color: #999;
  margin-bottom: 8px;
}

.detail-value {
  font-size: 24px;
  color: #00ff88;
  font-weight: 600;
}

/* 页脚 */
.weather-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #333;
  flex-wrap: wrap;
  gap: 15px;
}

.refresh-button {
  padding: 10px 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s;
}

.refresh-button:hover {
  transform: translateY(-2px);
}

.update-time {
  font-size: 13px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .weather-card {
    padding: 20px;
  }

  .weather-title {
    font-size: 24px;
  }

  .location-name {
    font-size: 28px;
  }

  .temperature {
    font-size: 60px;
  }

  .unit {
    font-size: 30px;
  }

  .weather-text {
    font-size: 20px;
  }

  .weather-icon {
    font-size: 30px;
  }

  .weather-details {
    grid-template-columns: repeat(2, 1fr);
  }

  .weather-footer {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .weather-container {
    padding: 10px;
  }

  .weather-card {
    padding: 15px;
  }

  .temperature {
    font-size: 50px;
  }

  .detail-value {
    font-size: 20px;
  }
}
</style>
