<template>
  <div v-if="show" class="popup-overlay" @click="closePopup">
    <div class="popup-container ad-popup" @click.stop>
      <div class="popup-header ad-header">
        <span class="ad-badge">广告</span>
        <button class="close-btn" @click="closePopup">×</button>
      </div>
      <div class="popup-body ad-body">
        <div class="ad-content">
          <div class="ad-image">
            <div class="placeholder-image">
              <span class="icon">🎁</span>
            </div>
          </div>
          <h2 class="ad-title">{{ currentAd.title }}</h2>
          <p class="ad-description">{{ currentAd.description }}</p>
          <div class="ad-features">
            <div v-for="(feature, index) in currentAd.features" :key="index" class="feature-item">
              <span class="check-icon">✓</span>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-footer ad-footer">
        <button class="btn btn-primary" @click="handleClick">{{ currentAd.buttonText }}</button>
        <button class="btn btn-secondary" @click="closePopup">稍后再说</button>
      </div>
      <div class="ad-timer">
        {{ countdown }} 秒后可关闭
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

const ads = [
  {
    title: '限时优惠！新用户专享',
    description: '立即注册即可获得 50% 优惠！仅限今天，机会难得，不容错过！',
    features: ['免费试用 30 天', '无需信用卡', '随时取消', '24/7 客服支持'],
    buttonText: '立即领取优惠'
  },
  {
    title: '热门产品大促销',
    description: '全场商品 5 折起！超值优惠，数量有限，先到先得！',
    features: ['全场包邮', '7 天无理由退货', '正品保证', '售后无忧'],
    buttonText: '马上抢购'
  },
  {
    title: '会员专属福利',
    description: '成为会员即享专属折扣和福利，更有积分奖励等你来拿！',
    features: ['专属折扣', '生日礼品', '优先客服', '积分兑换'],
    buttonText: '立即加入'
  }
];

const currentAd = ref(ads[Math.floor(Math.random() * ads.length)]);
const countdown = ref(3);
let timer = null;

watch(() => props.show, (newVal) => {
  if (newVal) {
    currentAd.value = ads[Math.floor(Math.random() * ads.length)];
    countdown.value = 3;
    startCountdown();
  } else {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
});

const startCountdown = () => {
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
};

const closePopup = () => {
  if (countdown.value === 0) {
    emit('close');
  }
};

const handleClick = () => {
  console.log('用户点击了广告');
  emit('close');
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.popup-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
  animation: bounceIn 0.5s ease;
  position: relative;
  overflow: hidden;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.ad-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
}

.ad-badge {
  background: #ff6b6b;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
  line-height: 1;
  padding: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.ad-body {
  padding: 30px 20px;
  color: white;
}

.ad-image {
  text-align: center;
  margin-bottom: 20px;
}

.placeholder-image {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.icon {
  font-size: 60px;
}

.ad-title {
  font-size: 24px;
  margin: 0 0 15px 0;
  text-align: center;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.ad-description {
  font-size: 16px;
  margin: 0 0 20px 0;
  text-align: center;
  line-height: 1.6;
}

.ad-features {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.check-icon {
  background: #4caf50;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: bold;
  font-size: 12px;
}

.ad-footer {
  padding: 20px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-primary {
  background: #ffd700;
  color: #333;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.btn-primary:hover {
  background: #ffed4e;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.ad-timer {
  position: absolute;
  bottom: 10px;
  right: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
