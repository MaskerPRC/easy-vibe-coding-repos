<template>
  <div class="running-alpaca-container" @keydown.enter="accelerate" tabindex="0" ref="container">
    <div class="sky">
      <div class="clouds">
        <div class="cloud" style="left: 20%; animation-delay: 0s;"></div>
        <div class="cloud" style="left: 60%; animation-delay: 2s;"></div>
        <div class="cloud" style="left: 80%; animation-delay: 4s;"></div>
      </div>
    </div>

    <div class="ground">
      <div class="grass" :style="{ animationDuration: grassSpeed + 's' }"></div>
    </div>

    <div class="alpaca" :class="{ running: isRunning }" @click="accelerate" title="点击我加速！">
      <div class="alpaca-body">
        <div class="alpaca-head">
          <div class="alpaca-ear left"></div>
          <div class="alpaca-ear right"></div>
          <div class="alpaca-face">
            <div class="eye left"></div>
            <div class="eye right"></div>
            <div class="nose"></div>
          </div>
        </div>
        <div class="alpaca-neck"></div>
        <div class="alpaca-torso">
          <div class="alpaca-fur"></div>
        </div>
        <div class="legs">
          <div class="leg front-left" :style="{ animationDuration: legSpeed + 's' }"></div>
          <div class="leg front-right" :style="{ animationDuration: legSpeed + 's' }"></div>
          <div class="leg back-left" :style="{ animationDuration: legSpeed + 's' }"></div>
          <div class="leg back-right" :style="{ animationDuration: legSpeed + 's' }"></div>
        </div>
      </div>
    </div>

    <div class="instructions">
      <p>点击草泥马加速！</p>
      <p class="speed-info">当前速度: {{ speedLevel }}x</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const container = ref(null);
const isRunning = ref(true);
const speedLevel = ref(1);
const grassSpeed = ref(20);
const legSpeed = ref(0.5);

const accelerate = () => {
  if (speedLevel.value < 5) {
    speedLevel.value += 0.5;
    grassSpeed.value = 20 / speedLevel.value;
    legSpeed.value = 0.5 / speedLevel.value;
  }
};

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    accelerate();
  }
};

onMounted(() => {
  container.value?.focus();
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.running-alpaca-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom, #87CEEB 0%, #87CEEB 70%, #90EE90 70%, #90EE90 100%);
  position: relative;
  overflow: hidden;
  outline: none;
}

/* 天空和云朵 */
.sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70%;
}

.clouds {
  width: 100%;
  height: 100%;
  position: relative;
}

.cloud {
  position: absolute;
  top: 15%;
  width: 100px;
  height: 40px;
  background: white;
  border-radius: 50px;
  animation: cloudMove 30s linear infinite;
  opacity: 0.8;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 50%;
}

.cloud::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
}

.cloud::after {
  width: 60px;
  height: 60px;
  top: -30px;
  right: 10px;
}

@keyframes cloudMove {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-120vw);
  }
}

/* 地面 */
.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: #228B22;
  overflow: hidden;
}

.grass {
  width: 200%;
  height: 100%;
  background: repeating-linear-gradient(
    90deg,
    #228B22 0px,
    #228B22 10px,
    #2E8B57 10px,
    #2E8B57 20px,
    #32CD32 20px,
    #32CD32 30px
  );
  animation: grassMove 20s linear infinite;
  position: absolute;
  bottom: 0;
}

@keyframes grassMove {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* 草泥马 */
.alpaca {
  position: absolute;
  bottom: 30%;
  left: 30%;
  transform: scale(1.5);
  cursor: pointer;
  transition: transform 0.2s;
}

.alpaca:hover {
  transform: scale(1.6);
}

.alpaca-body {
  position: relative;
  width: 80px;
  height: 100px;
}

/* 头部 */
.alpaca-head {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 35px;
  background: #F5DEB3;
  border-radius: 15px 15px 10px 10px;
  z-index: 10;
}

/* 耳朵 */
.alpaca-ear {
  position: absolute;
  width: 8px;
  height: 15px;
  background: #F5DEB3;
  border-radius: 50% 50% 0 0;
  top: -5px;
}

.alpaca-ear.left {
  left: 5px;
  transform: rotate(-15deg);
}

.alpaca-ear.right {
  right: 5px;
  transform: rotate(15deg);
}

/* 脸部 */
.alpaca-face {
  position: relative;
  width: 100%;
  height: 100%;
}

.eye {
  position: absolute;
  width: 5px;
  height: 5px;
  background: #000;
  border-radius: 50%;
  top: 12px;
}

.eye.left {
  left: 8px;
}

.eye.right {
  right: 8px;
}

.nose {
  position: absolute;
  width: 4px;
  height: 3px;
  background: #D2691E;
  border-radius: 50%;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
}

/* 脖子 */
.alpaca-neck {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 25px;
  background: #F5DEB3;
  z-index: 5;
}

/* 躯干 */
.alpaca-torso {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 35px;
  background: #F5DEB3;
  border-radius: 25px 25px 15px 15px;
}

.alpaca-fur {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 45px;
  height: 25px;
  background: #DEB887;
  border-radius: 20px;
}

/* 腿部 */
.legs {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
}

.leg {
  position: absolute;
  bottom: 0;
  width: 8px;
  height: 30px;
  background: #F5DEB3;
  border-radius: 4px;
  transform-origin: top center;
}

.leg.front-left {
  left: 20px;
  animation: legMove 0.5s ease-in-out infinite;
}

.leg.front-right {
  left: 30px;
  animation: legMove 0.5s ease-in-out infinite 0.25s;
}

.leg.back-left {
  right: 30px;
  animation: legMove 0.5s ease-in-out infinite 0.25s;
}

.leg.back-right {
  right: 20px;
  animation: legMove 0.5s ease-in-out infinite;
}

@keyframes legMove {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(25deg);
  }
}

/* 奔跑时身体轻微跳动 */
.alpaca.running {
  animation: bounce 0.5s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) scale(1.5);
  }
  50% {
    transform: translateY(-10px) scale(1.5);
  }
}

/* 说明文字 */
.instructions {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px 40px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.instructions p {
  margin: 10px 0;
  font-size: 20px;
  color: #333;
  font-weight: bold;
}

.speed-info {
  color: #FF6B6B;
  font-size: 24px;
}

kbd {
  background: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
</style>
