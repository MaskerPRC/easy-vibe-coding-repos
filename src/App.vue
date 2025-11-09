<template>
  <div class="app">
    <!-- 头部区域 -->
    <header class="header">
      <div class="logo-section">
        <div class="logo">🌍</div>
        <h1 class="title">World App</h1>
        <p class="subtitle">自动代码修改系统</p>
      </div>
      <div class="tagline">用自然语言，实时改造你的网站</div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <!-- 简介卡片 -->
      <section class="intro-card card">
        <h2>什么是 World App？</h2>
        <p class="intro-text">
          这是一个创新的系统，允许用户通过网页界面提交需求，系统会自动使用 <strong>Claude Code</strong> 修改应用项目的代码。
        </p>
        <p class="intro-text">
          打开网站，右下角用自然语言"提需求"，整个站点会按你的描述被实时"改造"，不仅仅支持前端，<strong>后端也是支持的</strong>。
        </p>
      </section>

      <!-- 天气卡片 -->
      <section class="weather-card card">
        <h2>🌤️ 当地天气</h2>

        <!-- 加载状态 -->
        <div v-if="loading" class="weather-loading">
          <div class="loading-spinner"></div>
          <p>正在获取您的位置和天气信息...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="weather-error">
          <p>{{ error }}</p>
        </div>

        <!-- 天气内容 -->
        <div v-else-if="weatherData && location" class="weather-content">
          <!-- 位置信息 -->
          <div class="location-info">
            <span class="location-icon">📍</span>
            <span class="location-text">{{ location.city }}, {{ location.country }}</span>
          </div>

          <!-- 空气质量 -->
          <div v-if="weatherData.airQuality" class="air-quality">
            <span class="aqi-label">空气质量：</span>
            <span class="aqi-value" :style="{ background: getAQILevel(weatherData.airQuality.us_aqi).color }">
              {{ getAQILevel(weatherData.airQuality.us_aqi).level }}
              (AQI: {{ weatherData.airQuality.us_aqi || 'N/A' }})
            </span>
            <div class="aqi-details">
              <span v-if="weatherData.airQuality.pm2_5">PM2.5: {{ weatherData.airQuality.pm2_5.toFixed(1) }} μg/m³</span>
              <span v-if="weatherData.airQuality.pm10">PM10: {{ weatherData.airQuality.pm10.toFixed(1) }} μg/m³</span>
            </div>
          </div>

          <!-- 标签切换 -->
          <div class="weather-tabs">
            <button
              class="tab-button"
              :class="{ active: activeTab === 'hourly' }"
              @click="activeTab = 'hourly'"
            >
              24小时预报
            </button>
            <button
              class="tab-button"
              :class="{ active: activeTab === 'daily' }"
              @click="activeTab = 'daily'"
            >
              7天预报
            </button>
          </div>

          <!-- 24小时预报 -->
          <div v-if="activeTab === 'hourly'" class="hourly-forecast">
            <div class="forecast-scroll">
              <div
                v-for="(hour, index) in weatherData.hourly.slice(0, 24)"
                :key="index"
                class="hour-item"
              >
                <div class="hour-time">{{ formatTime(hour.time) }}</div>
                <div class="hour-icon">{{ getWeatherInfo(hour.weather_code).icon }}</div>
                <div class="hour-temp">{{ Math.round(hour.temperature) }}°C</div>
                <div class="hour-details">
                  <div class="detail-item">💧 {{ hour.humidity }}%</div>
                  <div class="detail-item">🌬️ {{ hour.wind_speed }}km/h</div>
                  <div class="detail-item">{{ getWindDirection(hour.wind_direction) }}</div>
                  <div class="detail-item" v-if="hour.precipitation_probability">
                    ☔ {{ hour.precipitation_probability }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 7天预报 -->
          <div v-if="activeTab === 'daily'" class="daily-forecast">
            <div
              v-for="(day, index) in weatherData.daily"
              :key="index"
              class="day-item"
            >
              <div class="day-date">{{ formatDate(day.date) }}</div>
              <div class="day-icon">{{ getWeatherInfo(day.weather_code).icon }}</div>
              <div class="day-weather">{{ getWeatherInfo(day.weather_code).text }}</div>
              <div class="day-temp">
                <span class="temp-max">{{ Math.round(day.temperature_max) }}°</span>
                <span class="temp-divider">/</span>
                <span class="temp-min">{{ Math.round(day.temperature_min) }}°</span>
              </div>
              <div class="day-details">
                <div class="detail-row">
                  <span class="detail-label">💨 风速：</span>
                  <span class="detail-value">{{ day.wind_speed_max }}km/h {{ getWindDirection(day.wind_direction) }}</span>
                </div>
                <div class="detail-row" v-if="day.precipitation_sum > 0">
                  <span class="detail-label">☔ 降水：</span>
                  <span class="detail-value">{{ day.precipitation_sum }}mm ({{ day.precipitation_probability }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 特性列表 -->
      <section class="features-card card">
        <h2>核心特性</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">💬</div>
            <h3>自然语言交互</h3>
            <p>用自然语言描述你的需求，AI 自动理解并实现</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <h3>实时代码修改</h3>
            <p>提交需求后，代码会被自动修改并实时生效</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h3>公共画布</h3>
            <p>后来的需求会覆盖前面的作品，人人都能参与创作</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <h3>版本保存</h3>
            <p>代码会保存到 GitHub 仓库，以 tag 名称区分</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌐</div>
            <h3>全栈支持</h3>
            <p>不仅支持前端，后端代码也可以修改</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🚀</div>
            <h3>即时预览</h3>
            <p>修改完成后立即看到效果，无需手动部署</p>
          </div>
        </div>
      </section>

      <!-- 使用说明 -->
      <section class="usage-card card">
        <h2>如何使用</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>找到对话框</h3>
              <p>在页面右下角找到对话框入口（通常是一个聊天图标）</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>描述你的需求</h3>
              <p>用自然语言描述你想要的功能或修改，例如："把背景改成蓝色"、"添加一个计时器"等</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>等待AI处理</h3>
              <p>系统会自动使用 Claude Code 分析需求并修改代码</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>查看效果</h3>
              <p>修改完成后，页面会自动更新，你可以立即看到效果</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 网友案例 -->
      <section class="examples-card card">
        <h2>网友贡献案例</h2>
        <p class="examples-intro">
          已经被网友玩成各种有趣的版本：
        </p>
        <div class="examples-list">
          <div class="example-tag">🔮 算命</div>
          <div class="example-tag">📸 写真馆</div>
          <div class="example-tag">🍜 吃了么点菜</div>
          <div class="example-tag">🎮 小游戏</div>
          <div class="example-tag">🔄 重启网站</div>
          <div class="example-tag">💼 个人简历</div>
          <div class="example-tag">📝 待办事项</div>
          <div class="example-tag">🎨 在线画板</div>
        </div>
      </section>

      <!-- GitHub仓库信息 -->
      <section class="repo-card card">
        <h2>代码仓库</h2>
        <p>用户的 vibe coding 代码会保存到这个仓库，并以 tag 名称来区分：</p>
        <a href="https://github.com/MaskerPRC/easy-vibe-coding-repos" target="_blank" class="repo-link">
          <span class="repo-icon">📦</span>
          https://github.com/MaskerPRC/easy-vibe-coding-repos
        </a>
      </section>

      <!-- 未来计划 -->
      <section class="roadmap-card card">
        <h2>未来计划</h2>
        <ul class="roadmap-list">
          <li>✅ 开源项目代码</li>
          <li>✅ 补充自建脚本</li>
          <li>✅ 添加沙箱/回滚能力</li>
          <li>✅ 画廊形式查看所有历史页面</li>
          <li>✅ 更多功能等待社区贡献</li>
        </ul>
      </section>

      <!-- 致谢 -->
      <section class="footer-card card">
        <p class="footer-text">
          这是一个有趣的人机共创小实验，欢迎体验并提出改进建议！
        </p>
        <p class="footer-text">
          感谢 <strong>Claude Code</strong> 提供的强大 AI 能力
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// 天气数据状态
const location = ref(null);
const weatherData = ref(null);
const loading = ref(true);
const error = ref(null);
const activeTab = ref('hourly'); // 'hourly' 或 'daily'

// 天气代码映射
const weatherCodeMap = {
  0: { text: '晴朗', icon: '☀️' },
  1: { text: '基本晴朗', icon: '🌤️' },
  2: { text: '部分多云', icon: '⛅' },
  3: { text: '多云', icon: '☁️' },
  45: { text: '有雾', icon: '🌫️' },
  48: { text: '冻雾', icon: '🌫️' },
  51: { text: '小雨', icon: '🌦️' },
  53: { text: '中雨', icon: '🌧️' },
  55: { text: '大雨', icon: '🌧️' },
  61: { text: '小雨', icon: '🌦️' },
  63: { text: '中雨', icon: '🌧️' },
  65: { text: '大雨', icon: '🌧️' },
  71: { text: '小雪', icon: '🌨️' },
  73: { text: '中雪', icon: '❄️' },
  75: { text: '大雪', icon: '❄️' },
  77: { text: '雪粒', icon: '🌨️' },
  80: { text: '阵雨', icon: '🌦️' },
  81: { text: '中阵雨', icon: '🌧️' },
  82: { text: '大阵雨', icon: '⛈️' },
  95: { text: '雷暴', icon: '⛈️' },
  96: { text: '雷暴伴冰雹', icon: '⛈️' },
  99: { text: '强雷暴伴冰雹', icon: '⛈️' }
};

// 获取天气描述
const getWeatherInfo = (code) => {
  return weatherCodeMap[code] || { text: '未知', icon: '🌡️' };
};

// 获取风向
const getWindDirection = (degree) => {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
  const index = Math.round(degree / 45) % 8;
  return directions[index];
};

// 获取空气质量等级
const getAQILevel = (aqi) => {
  if (!aqi) return { level: '未知', color: '#999' };
  if (aqi <= 50) return { level: '优', color: '#00e400' };
  if (aqi <= 100) return { level: '良', color: '#ffff00' };
  if (aqi <= 150) return { level: '轻度污染', color: '#ff7e00' };
  if (aqi <= 200) return { level: '中度污染', color: '#ff0000' };
  if (aqi <= 300) return { level: '重度污染', color: '#99004c' };
  return { level: '严重污染', color: '#7e0023' };
};

// 格式化时间
const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  return `${date.getHours()}:00`;
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日 ${weekday}`;
};

// 获取位置和天气数据
const fetchWeatherData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 1. 获取位置信息
    const locationResponse = await fetch('/api/location');
    const locationData = await locationResponse.json();
    location.value = locationData;

    console.log('位置信息:', locationData);

    // 2. 获取天气数据
    const weatherResponse = await fetch(`/api/weather?lat=${locationData.lat}&lon=${locationData.lon}`);
    const weather = await weatherResponse.json();
    weatherData.value = weather;

    console.log('天气数据:', weather);
  } catch (err) {
    console.error('获取天气数据失败:', err);
    error.value = '获取天气数据失败，请刷新页面重试';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 页面加载时的初始化逻辑
  console.log('World App - 自动代码修改系统已加载');

  // 获取天气数据
  fetchWeatherData();

  // 定义一个函数,用于查找并隐藏按钮
  const hideButton = () => {
    const chatButton = document.querySelector('.chat-button');
    if (chatButton && chatButton.style.display !== 'none') {
      chatButton.style.display = 'none';
    }
  };

  // 立即尝试执行一次,以防按钮已经存在
  hideButton();

  // 创建一个观察器实例
  const observer = new MutationObserver((mutationsList) => {
    // 检查每次DOM变化,看是否需要隐藏按钮
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        hideButton();
      }
    }
  });

  // 配置观察器需要观察的变动
  const config = { childList: true, subtree: true };

  // 指定观察目标为整个文档的body
  observer.observe(document.body, config);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 头部样式 */
.header {
  text-align: center;
  margin-bottom: 60px;
  padding: 40px 20px;
}

.logo-section {
  margin-bottom: 20px;
}

.logo {
  font-size: 80px;
  margin-bottom: 10px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.title {
  font-size: 56px;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.95);
  margin: 10px 0 0 0;
  font-weight: 500;
}

.tagline {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 20px;
  font-weight: 300;
  letter-spacing: 1px;
}

/* 主内容区域 */
.main {
  max-width: 1000px;
  margin: 0 auto;
}

/* 卡片通用样式 */
.card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.card h2 {
  color: #667eea;
  margin: 0 0 20px 0;
  font-size: 28px;
  font-weight: 700;
  border-bottom: 3px solid #667eea;
  padding-bottom: 10px;
}

/* 简介卡片 */
.intro-text {
  color: #333;
  line-height: 1.8;
  margin-bottom: 15px;
  font-size: 16px;
}

.intro-text strong {
  color: #667eea;
  font-weight: 600;
}

/* 天气卡片样式 */
.weather-loading {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.weather-loading p {
  color: #666;
  font-size: 16px;
}

.weather-error {
  text-align: center;
  padding: 20px;
  color: #ff0000;
  font-size: 16px;
}

.weather-content {
  margin-top: 20px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 500;
}

.location-icon {
  font-size: 24px;
}

.air-quality {
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 12px;
}

.aqi-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-right: 10px;
}

.aqi-value {
  display: inline-block;
  padding: 6px 15px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.aqi-details {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.weather-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  color: #667eea;
}

.tab-button.active {
  color: #667eea;
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hourly-forecast {
  margin-top: 20px;
}

.forecast-scroll {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 15px;
}

.forecast-scroll::-webkit-scrollbar {
  height: 8px;
}

.forecast-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.forecast-scroll::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 10px;
}

.hour-item {
  flex-shrink: 0;
  width: 140px;
  padding: 15px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease;
}

.hour-item:hover {
  transform: translateY(-5px);
}

.hour-time {
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 10px;
}

.hour-icon {
  font-size: 40px;
  margin: 10px 0;
}

.hour-temp {
  font-size: 20px;
  color: #333;
  font-weight: 700;
  margin-bottom: 10px;
}

.hour-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-item {
  font-size: 12px;
  color: #666;
}

.daily-forecast {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.day-item {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  display: grid;
  grid-template-columns: 150px 60px 1fr 120px;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.day-item:hover {
  transform: translateX(5px);
}

.day-date {
  font-size: 16px;
  color: #667eea;
  font-weight: 600;
}

.day-icon {
  font-size: 36px;
  text-align: center;
}

.day-weather {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.day-temp {
  font-size: 18px;
  font-weight: 700;
  text-align: right;
}

.temp-max {
  color: #ff6b6b;
}

.temp-divider {
  color: #999;
  margin: 0 5px;
}

.temp-min {
  color: #4dabf7;
}

.day-details {
  grid-column: 1 / -1;
  display: flex;
  gap: 20px;
  padding-top: 10px;
  border-top: 1px solid rgba(102, 126, 234, 0.2);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.detail-label {
  color: #666;
  font-weight: 500;
}

.detail-value {
  color: #333;
}

/* 特性网格 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.feature-item {
  text-align: center;
  padding: 25px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: scale(1.05);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.feature-item h3 {
  color: #667eea;
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
}

.feature-item p {
  color: #555;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

/* 使用步骤 */
.steps {
  margin-top: 30px;
}

.step {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.step-content h3 {
  color: #667eea;
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 600;
}

.step-content p {
  color: #555;
  margin: 0;
  line-height: 1.6;
  font-size: 15px;
}

/* 案例展示 */
.examples-intro {
  color: #555;
  margin-bottom: 20px;
  font-size: 16px;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.example-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
  transition: transform 0.2s ease;
}

.example-tag:hover {
  transform: scale(1.1);
}

/* GitHub仓库 */
.repo-card p {
  color: #555;
  margin-bottom: 20px;
  font-size: 16px;
}

.repo-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #24292e;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  transition: background 0.3s ease;
}

.repo-link:hover {
  background: #667eea;
}

.repo-icon {
  font-size: 24px;
}

/* 路线图 */
.roadmap-list {
  list-style: none;
  padding: 0;
  margin: 20px 0 0 0;
}

.roadmap-list li {
  color: #555;
  font-size: 16px;
  line-height: 2;
  padding-left: 10px;
}

/* 底部 */
.footer-card {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.footer-card h2 {
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.footer-text {
  color: white;
  margin: 15px 0;
  font-size: 16px;
  line-height: 1.8;
}

.footer-text strong {
  color: #fff;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 40px;
  }

  .subtitle {
    font-size: 18px;
  }

  .tagline {
    font-size: 16px;
  }

  .card {
    padding: 25px;
  }

  .card h2 {
    font-size: 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .step {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .day-item {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .day-temp {
    text-align: center;
  }

  .day-details {
    flex-direction: column;
    gap: 10px;
  }

  .hour-item {
    width: 120px;
  }
}
</style>

<style>
.chat-button {
  display: none !important;
}
</style>

