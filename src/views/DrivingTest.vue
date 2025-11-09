<template>
  <div class="driving-test">
    <div class="container">
      <header class="header">
        <router-link to="/" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回首页
        </router-link>
        <h1 class="title">专车司机驾驶稳定性测试</h1>
      </header>

      <div class="content">
        <div v-if="!isSupported" class="alert alert-error">
          <p>抱歉，您的设备不支持运动传感器</p>
          <p class="small">请使用移动设备并允许访问传感器权限</p>
        </div>

        <div v-else>
          <div class="status-card">
            <div class="status-indicator" :class="{ active: isTesting }">
              {{ isTesting ? '测试进行中...' : '准备就绪' }}
            </div>
            <div v-if="isTesting" class="timer">测试时长: {{ testDuration }}秒</div>
          </div>

          <div class="sensor-data" v-if="isTesting || hasResult">
            <h3>实时数据</h3>
            <div class="data-grid">
              <div class="data-item">
                <div class="data-label">加速度 X</div>
                <div class="data-value">{{ acceleration.x.toFixed(2) }} m/s²</div>
              </div>
              <div class="data-item">
                <div class="data-label">加速度 Y</div>
                <div class="data-value">{{ acceleration.y.toFixed(2) }} m/s²</div>
              </div>
              <div class="data-item">
                <div class="data-label">加速度 Z</div>
                <div class="data-value">{{ acceleration.z.toFixed(2) }} m/s²</div>
              </div>
              <div class="data-item">
                <div class="data-label">角度 Alpha</div>
                <div class="data-value">{{ orientation.alpha.toFixed(2) }}°</div>
              </div>
              <div class="data-item">
                <div class="data-label">角度 Beta</div>
                <div class="data-value">{{ orientation.beta.toFixed(2) }}°</div>
              </div>
              <div class="data-item">
                <div class="data-label">角度 Gamma</div>
                <div class="data-value">{{ orientation.gamma.toFixed(2) }}°</div>
              </div>
            </div>

            <div class="stability-metrics">
              <h3>稳定性指标</h3>
              <div class="metrics-grid">
                <div class="metric-item">
                  <div class="metric-label">加速度波动</div>
                  <div class="metric-bar">
                    <div class="metric-fill" :style="{ width: `${Math.min(accelerationVariance * 10, 100)}%`, backgroundColor: getColorForVariance(accelerationVariance) }"></div>
                  </div>
                  <div class="metric-value">{{ accelerationVariance.toFixed(2) }}</div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">角度波动</div>
                  <div class="metric-bar">
                    <div class="metric-fill" :style="{ width: `${Math.min(orientationVariance / 2, 100)}%`, backgroundColor: getColorForVariance(orientationVariance / 10) }"></div>
                  </div>
                  <div class="metric-value">{{ orientationVariance.toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="result-card" v-if="hasResult">
            <h2>测试结果</h2>
            <div class="score-display">
              <div class="score-circle" :class="getScoreClass(finalScore)">
                <span class="score-number">{{ finalScore }}</span>
                <span class="score-label">分</span>
              </div>
              <div class="score-grade">{{ getScoreGrade(finalScore) }}</div>
              <div class="score-description">{{ getScoreDescription(finalScore) }}</div>
            </div>
            <div class="result-details">
              <div class="detail-item">
                <span class="detail-label">测试时长:</span>
                <span class="detail-value">{{ testDuration }}秒</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">平均加速度波动:</span>
                <span class="detail-value">{{ accelerationVariance.toFixed(2) }} m/s²</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">平均角度波动:</span>
                <span class="detail-value">{{ orientationVariance.toFixed(2) }}°</span>
              </div>
            </div>
          </div>

          <div class="control-buttons">
            <button
              v-if="!isTesting && !hasResult"
              @click="requestPermissionAndStart"
              class="btn btn-primary btn-large"
            >
              开始测试
            </button>
            <button
              v-if="isTesting"
              @click="stopTest"
              class="btn btn-danger btn-large"
            >
              停止测试
            </button>
            <button
              v-if="hasResult"
              @click="resetTest"
              class="btn btn-primary btn-large"
            >
              重新测试
            </button>
          </div>

          <div class="instructions">
            <h3>使用说明</h3>
            <ul>
              <li>请在车辆中使用移动设备进行测试</li>
              <li>将手机固定在车内合适位置（如仪表台）</li>
              <li>点击"开始测试"后开始正常驾驶</li>
              <li>建议测试时间至少30秒以获得准确结果</li>
              <li>测试会根据加速度和角度变化评估驾驶稳定性</li>
              <li>得分越高表示驾驶越平稳</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';

const isSupported = ref(true);
const isTesting = ref(false);
const hasResult = ref(false);
const testDuration = ref(0);
const finalScore = ref(0);

const acceleration = ref({ x: 0, y: 0, z: 0 });
const orientation = ref({ alpha: 0, beta: 0, gamma: 0 });

const accelerationHistory = ref([]);
const orientationHistory = ref([]);
const accelerationVariance = ref(0);
const orientationVariance = ref(0);

let motionHandler = null;
let orientationHandler = null;
let testTimer = null;
let metricsTimer = null;

const checkSupport = () => {
  const hasMotion = 'DeviceMotionEvent' in window;
  const hasOrientation = 'DeviceOrientationEvent' in window;
  isSupported.value = hasMotion && hasOrientation;
};

const requestPermissionAndStart = async () => {
  // iOS 13+ requires permission for motion and orientation
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const motionPermission = await DeviceMotionEvent.requestPermission();
      const orientationPermission = await DeviceOrientationEvent.requestPermission();

      if (motionPermission === 'granted' && orientationPermission === 'granted') {
        startTest();
      } else {
        alert('需要传感器权限才能进行测试');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      alert('获取传感器权限失败: ' + error.message);
    }
  } else {
    // For non-iOS or older iOS versions
    startTest();
  }
};

const startTest = () => {
  isTesting.value = true;
  hasResult.value = false;
  testDuration.value = 0;
  accelerationHistory.value = [];
  orientationHistory.value = [];

  // Start listening to motion events
  motionHandler = (event) => {
    if (event.accelerationIncludingGravity) {
      acceleration.value = {
        x: event.accelerationIncludingGravity.x || 0,
        y: event.accelerationIncludingGravity.y || 0,
        z: event.accelerationIncludingGravity.z || 0
      };

      const magnitude = Math.sqrt(
        Math.pow(acceleration.value.x, 2) +
        Math.pow(acceleration.value.y, 2) +
        Math.pow(acceleration.value.z, 2)
      );
      accelerationHistory.value.push(magnitude);

      // Keep only last 100 readings
      if (accelerationHistory.value.length > 100) {
        accelerationHistory.value.shift();
      }
    }
  };

  orientationHandler = (event) => {
    orientation.value = {
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0
    };

    const totalRotation = Math.abs(event.alpha || 0) + Math.abs(event.beta || 0) + Math.abs(event.gamma || 0);
    orientationHistory.value.push(totalRotation);

    // Keep only last 100 readings
    if (orientationHistory.value.length > 100) {
      orientationHistory.value.shift();
    }
  };

  window.addEventListener('devicemotion', motionHandler);
  window.addEventListener('deviceorientation', orientationHandler);

  // Timer for test duration
  testTimer = setInterval(() => {
    testDuration.value++;
  }, 1000);

  // Calculate metrics every 500ms
  metricsTimer = setInterval(() => {
    calculateMetrics();
  }, 500);
};

const stopTest = () => {
  isTesting.value = false;
  hasResult.value = true;

  clearInterval(testTimer);
  clearInterval(metricsTimer);

  if (motionHandler) {
    window.removeEventListener('devicemotion', motionHandler);
  }
  if (orientationHandler) {
    window.removeEventListener('deviceorientation', orientationHandler);
  }

  calculateFinalScore();
};

const resetTest = () => {
  hasResult.value = false;
  testDuration.value = 0;
  finalScore.value = 0;
  acceleration.value = { x: 0, y: 0, z: 0 };
  orientation.value = { alpha: 0, beta: 0, gamma: 0 };
  accelerationHistory.value = [];
  orientationHistory.value = [];
  accelerationVariance.value = 0;
  orientationVariance.value = 0;
};

const calculateMetrics = () => {
  if (accelerationHistory.value.length > 1) {
    accelerationVariance.value = calculateVariance(accelerationHistory.value);
  }

  if (orientationHistory.value.length > 1) {
    orientationVariance.value = calculateVariance(orientationHistory.value);
  }
};

const calculateVariance = (data) => {
  if (data.length === 0) return 0;

  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;

  return Math.sqrt(variance); // Return standard deviation
};

const calculateFinalScore = () => {
  // Score based on stability (lower variance = higher score)
  // Base score is 100, deduct points for variance

  const accScore = Math.max(0, 50 - accelerationVariance.value * 5);
  const oriScore = Math.max(0, 50 - orientationVariance.value * 0.5);

  finalScore.value = Math.round(Math.min(100, accScore + oriScore));
};

const getScoreClass = (score) => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
};

const getScoreGrade = (score) => {
  if (score >= 90) return '优秀';
  if (score >= 75) return '良好';
  if (score >= 60) return '及格';
  return '需要改进';
};

const getScoreDescription = (score) => {
  if (score >= 90) return '驾驶非常平稳，乘客体验极佳！';
  if (score >= 75) return '驾驶较为平稳，继续保持！';
  if (score >= 60) return '驾驶基本平稳，还有提升空间';
  return '驾驶波动较大，需要注意平稳性';
};

const getColorForVariance = (variance) => {
  if (variance < 2) return '#4caf50';
  if (variance < 5) return '#ff9800';
  return '#f44336';
};

// Check support on mount
checkSupport();

// Cleanup on unmount
onUnmounted(() => {
  if (isTesting.value) {
    stopTest();
  }
});
</script>

<style scoped>
.driving-test {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 20px;
  transition: background 0.3s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.title {
  color: white;
  font-size: 32px;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.alert {
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef5350;
}

.alert p {
  margin: 5px 0;
}

.alert .small {
  font-size: 14px;
  opacity: 0.8;
}

.status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  text-align: center;
}

.status-indicator {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.status-indicator.active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.timer {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
}

.sensor-data {
  margin: 30px 0;
}

.sensor-data h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 20px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.data-item {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.data-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stability-metrics {
  margin-top: 30px;
}

.metrics-grid {
  display: grid;
  gap: 20px;
}

.metric-item {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.metric-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.metric-bar {
  height: 30px;
  background: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 8px;
}

.metric-fill {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
  border-radius: 15px;
}

.metric-value {
  text-align: right;
  font-size: 14px;
  color: #666;
}

.result-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 30px;
  border-radius: 12px;
  margin: 30px 0;
  text-align: center;
}

.result-card h2 {
  color: #333;
  margin-bottom: 20px;
}

.score-display {
  margin: 30px 0;
}

.score-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  border: 8px solid;
  background: white;
}

.score-circle.excellent {
  border-color: #4caf50;
  color: #4caf50;
}

.score-circle.good {
  border-color: #2196f3;
  color: #2196f3;
}

.score-circle.fair {
  border-color: #ff9800;
  color: #ff9800;
}

.score-circle.poor {
  border-color: #f44336;
  color: #f44336;
}

.score-number {
  font-size: 48px;
  font-weight: bold;
  line-height: 1;
}

.score-label {
  font-size: 18px;
}

.score-grade {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.score-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.result-details {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #666;
}

.detail-value {
  font-weight: bold;
  color: #333;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-large {
  padding: 15px 40px;
  font-size: 18px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(244, 67, 54, 0.4);
}

.instructions {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 30px;
}

.instructions h3 {
  color: #333;
  margin-bottom: 15px;
}

.instructions ul {
  margin: 0;
  padding-left: 25px;
  color: #666;
}

.instructions li {
  margin-bottom: 8px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  .data-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .score-circle {
    width: 120px;
    height: 120px;
  }

  .score-number {
    font-size: 36px;
  }

  .content {
    padding: 20px;
  }
}
</style>
