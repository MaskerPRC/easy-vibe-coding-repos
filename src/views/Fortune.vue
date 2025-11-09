<template>
  <div class="fortune-page">
    <!-- 返回首页按钮 -->
    <div class="back-button">
      <button @click="goHome" class="btn-back">返回首页</button>
    </div>

    <!-- 主要内容区 -->
    <div class="fortune-container">
      <h1 class="fortune-title">
        <span class="gold-text">恭喜发财</span>
        <span class="sparkle">✨</span>
      </h1>
      <p class="fortune-subtitle">点击转盘，开启您的财富之旅</p>

      <!-- 转盘区域 -->
      <div class="wheel-container">
        <!-- 金币雨效果 -->
        <div v-if="showCoins" class="coin-rain">
          <div v-for="i in 20" :key="i" class="coin" :style="getCoinStyle(i)">💰</div>
        </div>

        <!-- 转盘 -->
        <div class="wheel-wrapper">
          <div class="wheel" :class="{ spinning: isSpinning }" :style="{ transform: `rotate(${rotation}deg)` }">
            <div
              v-for="(prize, index) in prizes"
              :key="index"
              class="prize-section"
              :style="{ transform: `rotate(${index * 60}deg)` }"
            >
              <div class="prize-content">
                <div class="prize-icon">{{ prize.icon }}</div>
                <div class="prize-text">{{ prize.name }}</div>
              </div>
            </div>
          </div>
          <!-- 指针 -->
          <div class="pointer">▼</div>
        </div>

        <!-- 抽奖按钮 -->
        <button
          @click="spin"
          :disabled="isSpinning"
          class="spin-button"
          :class="{ disabled: isSpinning }"
        >
          {{ isSpinning ? '抽奖中...' : '开始抽奖' }}
        </button>
      </div>

      <!-- 结果显示 -->
      <transition name="result-fade">
        <div v-if="showResult" class="result-card">
          <div class="result-icon">{{ currentPrize.icon }}</div>
          <h2 class="result-title">{{ currentPrize.name }}</h2>
          <p class="result-message">{{ currentPrize.blessing }}</p>
          <div class="lucky-number">幸运数字: {{ luckyNumber }}</div>
        </div>
      </transition>

      <!-- 财富统计 -->
      <div class="fortune-stats">
        <div class="stat-card">
          <div class="stat-icon">🎰</div>
          <div class="stat-value">{{ spinCount }}</div>
          <div class="stat-label">抽奖次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">{{ totalWealth }}</div>
          <div class="stat-label">累计财富</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🌟</div>
          <div class="stat-value">{{ luckLevel }}%</div>
          <div class="stat-label">幸运指数</div>
        </div>
      </div>

      <!-- 祝福语滚动 -->
      <div class="blessing-scroll">
        <div class="blessing-text" :key="blessingIndex">
          {{ blessings[blessingIndex] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 奖品配置
const prizes = ref([
  { id: 1, name: '大吉大利', icon: '🎊', blessing: '恭喜您！财运亨通，万事如意！', wealth: 888 },
  { id: 2, name: '招财进宝', icon: '💰', blessing: '财源滚滚来，金银满堂财！', wealth: 666 },
  { id: 3, name: '财源广进', icon: '💎', blessing: '生意兴隆通四海，财源广进达三江！', wealth: 999 },
  { id: 4, name: '黄金万两', icon: '🏆', blessing: '黄金万两，富贵吉祥！', wealth: 1000 },
  { id: 5, name: '福星高照', icon: '⭐', blessing: '福星高照，好运连连！', wealth: 777 },
  { id: 6, name: '心想事成', icon: '🎯', blessing: '心想事成，梦想成真！', wealth: 555 }
]);

// 祝福语列表
const blessings = [
  '💰 恭喜发财，大吉大利！',
  '🎊 财源广进，生意兴隆！',
  '✨ 金玉满堂，福禄双全！',
  '🌟 招财进宝，财运亨通！',
  '🎯 步步高升，年年有余！',
  '💎 富贵吉祥，万事如意！'
];

// 状态
const isSpinning = ref(false);
const rotation = ref(0);
const showResult = ref(false);
const showCoins = ref(false);
const currentPrize = ref(prizes.value[0]);
const spinCount = ref(0);
const totalWealth = ref(0);
const luckyNumber = ref(0);
const blessingIndex = ref(0);

// 计算幸运指数
const luckLevel = computed(() => {
  return Math.min(100, Math.floor((totalWealth.value / 100) + spinCount.value * 5));
});

// 返回首页
const goHome = () => {
  router.push('/');
};

// 获取金币样式
const getCoinStyle = (index) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 0.5}s`,
    animationDuration: `${2 + Math.random() * 2}s`
  };
};

// 开始抽奖
const spin = () => {
  if (isSpinning.value) return;

  isSpinning.value = true;
  showResult.value = false;
  showCoins.value = false;

  // 随机选择奖品
  const randomIndex = Math.floor(Math.random() * prizes.value.length);
  const targetPrize = prizes.value[randomIndex];

  // 计算旋转角度（至少转3圈 + 目标角度）
  const spins = 3 + Math.random() * 2; // 3-5圈
  const targetAngle = randomIndex * 60; // 每个奖品60度
  const totalRotation = spins * 360 + targetAngle;

  rotation.value += totalRotation;

  // 动画结束后显示结果
  setTimeout(() => {
    isSpinning.value = false;
    currentPrize.value = targetPrize;
    showResult.value = true;
    showCoins.value = true;
    spinCount.value++;
    totalWealth.value += targetPrize.wealth;
    luckyNumber.value = Math.floor(Math.random() * 9000) + 1000;

    // 隐藏金币雨
    setTimeout(() => {
      showCoins.value = false;
    }, 3000);
  }, 4000);
};

// 祝福语轮播
setInterval(() => {
  blessingIndex.value = (blessingIndex.value + 1) % blessings.length;
}, 3000);
</script>

<style scoped>
.fortune-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 装饰性背景 */
.fortune-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.back-button {
  position: relative;
  z-index: 10;
  margin-bottom: 20px;
}

.btn-back {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-back:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.fortune-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.fortune-title {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.gold-text {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.sparkle {
  display: inline-block;
  animation: sparkle 1.5s infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
}

.fortune-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: white;
  margin-bottom: 40px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* 转盘容器 */
.wheel-container {
  position: relative;
  margin: 0 auto 40px;
  max-width: 500px;
}

/* 金币雨 */
.coin-rain {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
}

.coin {
  position: absolute;
  font-size: 2rem;
  animation: fall linear forwards;
}

@keyframes fall {
  from {
    top: -50px;
    opacity: 1;
  }
  to {
    top: 100%;
    opacity: 0;
  }
}

/* 转盘 */
.wheel-wrapper {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 0 auto 30px;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.5);
  border: 10px solid #fff;
  transition: transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99);
}

.wheel.spinning {
  transition-duration: 4s;
}

.prize-section {
  position: absolute;
  width: 50%;
  height: 50%;
  top: 0;
  left: 50%;
  transform-origin: 0% 100%;
  background: conic-gradient(from 0deg, rgba(255, 215, 0, 0.8) 0deg, rgba(255, 165, 0, 0.8) 60deg);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.prize-section:nth-child(even) {
  background: conic-gradient(from 0deg, rgba(255, 165, 0, 0.9) 0deg, rgba(255, 215, 0, 0.9) 60deg);
}

.prize-content {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%) rotate(-30deg);
  text-align: center;
}

.prize-icon {
  font-size: 2rem;
  margin-bottom: 5px;
}

.prize-text {
  font-size: 0.9rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 指针 */
.pointer {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3rem;
  color: #ff0000;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
  filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.5));
}

/* 抽奖按钮 */
.spin-button {
  display: block;
  margin: 0 auto;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  border: none;
  padding: 15px 50px;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.spin-button:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(255, 107, 107, 0.6);
}

.spin-button.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 结果卡片 */
.result-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin: 40px auto;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.result-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.result-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 15px;
}

.result-message {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.6;
}

.lucky-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff6b6b;
  padding: 10px 20px;
  background: #fff5f5;
  border-radius: 10px;
  display: inline-block;
}

.result-fade-enter-active, .result-fade-leave-active {
  transition: all 0.5s;
}

.result-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.result-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 财富统计 */
.fortune-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #ffa500;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* 祝福语滚动 */
.blessing-scroll {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  margin-top: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.blessing-text {
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fortune-title {
    font-size: 2.5rem;
  }

  .wheel-wrapper {
    width: 300px;
    height: 300px;
  }

  .prize-icon {
    font-size: 1.5rem;
  }

  .prize-text {
    font-size: 0.7rem;
  }

  .fortune-stats {
    grid-template-columns: 1fr;
  }

  .result-card {
    padding: 30px 20px;
  }

  .result-title {
    font-size: 2rem;
  }
}
</style>
