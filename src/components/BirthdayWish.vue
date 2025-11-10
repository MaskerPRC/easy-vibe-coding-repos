<template>
  <div class="birthday-container">
    <!-- 背景装饰 -->
    <div class="confetti-container">
      <div v-for="i in 50" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
    </div>

    <!-- 气球 -->
    <div class="balloons">
      <div v-for="i in 6" :key="i" class="balloon" :style="getBalloonStyle(i)">
        <div class="balloon-string"></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content">
      <div class="cake-container">
        <div class="cake">
          <div class="candle" v-for="i in 5" :key="i">
            <div class="flame"></div>
          </div>
          <div class="cake-layer cake-top"></div>
          <div class="cake-layer cake-middle"></div>
          <div class="cake-layer cake-bottom"></div>
        </div>
      </div>

      <h1 class="title">
        <span v-for="(char, index) in title" :key="index" :style="{ animationDelay: index * 0.1 + 's' }" class="letter">
          {{ char }}
        </span>
      </h1>

      <div class="wish-text">
        <p class="wish-line">愿你的每一天都充满欢笑</p>
        <p class="wish-line">愿你的梦想都能实现</p>
        <p class="wish-line">愿幸福永远伴随着你</p>
      </div>

      <div class="fireworks">
        <div v-for="i in 3" :key="i" class="firework" :style="getFireworkStyle(i)">
          <div class="explosion"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('生日快乐！'.split(''));

const getConfettiStyle = (index) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
  return {
    left: Math.random() * 100 + '%',
    animationDelay: Math.random() * 5 + 's',
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    animationDuration: (Math.random() * 3 + 2) + 's'
  };
};

const getBalloonStyle = (index) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
  const positions = [10, 20, 30, 70, 80, 90];
  return {
    left: positions[index - 1] + '%',
    backgroundColor: colors[index - 1],
    animationDelay: index * 0.5 + 's',
    animationDuration: (3 + index * 0.3) + 's'
  };
};

const getFireworkStyle = (index) => {
  const positions = [
    { left: '20%', top: '30%' },
    { left: '50%', top: '20%' },
    { left: '80%', top: '35%' }
  ];
  return {
    ...positions[index - 1],
    animationDelay: index * 1.5 + 's'
  };
};
</script>

<style scoped>
.birthday-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 彩纸效果 */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  opacity: 0.8;
  animation: confetti-fall linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 气球效果 */
.balloons {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.balloon {
  position: absolute;
  bottom: -150px;
  width: 80px;
  height: 100px;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  opacity: 0.9;
  animation: balloon-float ease-in-out infinite;
}

.balloon::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 15px solid currentColor;
}

.balloon-string {
  position: absolute;
  bottom: -80px;
  left: 50%;
  width: 2px;
  height: 80px;
  background: rgba(255, 255, 255, 0.5);
  transform: translateX(-50%);
}

@keyframes balloon-float {
  0% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-100vh) rotate(5deg);
  }
  100% {
    transform: translateY(-200vh) rotate(-5deg);
  }
}

/* 主要内容 */
.content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 40px;
}

/* 蛋糕 */
.cake-container {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  animation: cake-appear 1s ease-out;
}

@keyframes cake-appear {
  0% {
    transform: scale(0) rotate(180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.cake {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cake-layer {
  border-radius: 10px;
  position: relative;
}

.cake-top {
  width: 120px;
  height: 30px;
  background: linear-gradient(to bottom, #ff6b9d, #c44569);
  margin-bottom: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.cake-middle {
  width: 140px;
  height: 35px;
  background: linear-gradient(to bottom, #ffeaa7, #fdcb6e);
  margin-bottom: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.cake-bottom {
  width: 160px;
  height: 40px;
  background: linear-gradient(to bottom, #74b9ff, #0984e3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* 蜡烛 */
.candle {
  position: absolute;
  top: -40px;
  width: 8px;
  height: 30px;
  background: linear-gradient(to bottom, #fff, #f8f8f8);
  border-radius: 4px 4px 0 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.candle:nth-child(1) { left: 20px; }
.candle:nth-child(2) { left: 40px; }
.candle:nth-child(3) { left: 60px; }
.candle:nth-child(4) { left: 80px; }
.candle:nth-child(5) { left: 100px; }

/* 火焰 */
.flame {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 15px;
  background: #ff9800;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  box-shadow: 0 0 10px #ff9800, 0 0 20px #ff5722;
  animation: flame-flicker 0.3s ease-in-out infinite alternate;
}

.flame::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 10px;
  background: #ffd54f;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}

@keyframes flame-flicker {
  0% {
    transform: translateX(-50%) scale(1);
  }
  100% {
    transform: translateX(-50%) scale(1.1);
  }
}

/* 标题 */
.title {
  font-size: 72px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5),
               0 0 40px rgba(255, 215, 0, 0.5);
  margin: 30px 0;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.letter {
  display: inline-block;
  animation: letter-bounce 0.8s ease-in-out infinite;
}

@keyframes letter-bounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.2);
  }
}

/* 祝福语 */
.wish-text {
  margin-top: 40px;
  animation: fade-in 2s ease-out;
}

.wish-line {
  font-size: 24px;
  color: #fff;
  margin: 15px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: slide-in 1s ease-out backwards;
}

.wish-line:nth-child(1) { animation-delay: 0.5s; }
.wish-line:nth-child(2) { animation-delay: 1s; }
.wish-line:nth-child(3) { animation-delay: 1.5s; }

@keyframes slide-in {
  0% {
    transform: translateX(-50px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 烟花效果 */
.fireworks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.firework {
  position: absolute;
  animation: firework-launch 3s ease-out infinite;
}

.explosion {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow:
    0 0 20px 10px #ff6b6b,
    0 0 40px 20px #4ecdc4,
    0 0 60px 30px #45b7d1,
    0 0 80px 40px #f9ca24;
  animation: explode 1s ease-out infinite;
}

@keyframes firework-launch {
  0% {
    transform: translateY(100vh);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0;
  }
}

@keyframes explode {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .title {
    font-size: 48px;
  }

  .wish-line {
    font-size: 18px;
  }

  .cake-top {
    width: 80px;
    height: 20px;
  }

  .cake-middle {
    width: 100px;
    height: 25px;
  }

  .cake-bottom {
    width: 120px;
    height: 30px;
  }

  .balloon {
    width: 50px;
    height: 65px;
  }
}
</style>
