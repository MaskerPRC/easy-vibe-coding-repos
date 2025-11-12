<template>
  <div class="app">
    <div class="flag-ceremony">
      <!-- 天空背景 -->
      <div class="sky">
        <div class="sun"></div>
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>

      <!-- 旗杆 -->
      <div class="flagpole"></div>

      <!-- 国旗 -->
      <div class="flag-container">
        <div class="flag">
          <!-- 大五角星 -->
          <div class="star star-big"></div>
          <!-- 四颗小五角星 -->
          <div class="star star-small star-1"></div>
          <div class="star star-small star-2"></div>
          <div class="star star-small star-3"></div>
          <div class="star star-small star-4"></div>
        </div>
      </div>

      <!-- 地面 -->
      <div class="ground"></div>

      <!-- 标题 -->
      <div class="title">
        <h1>升国旗仪式</h1>
        <p>起来！不愿做奴隶的人们！</p>
        <button @click="restartAnimation" class="restart-btn">重新播放</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 重新播放动画
const restartAnimation = () => {
  window.location.reload();
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.flag-ceremony {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 天空和太阳 */
.sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.sun {
  position: absolute;
  top: 50px;
  right: 100px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #FFD700 0%, #FFA500 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
  animation: sun-glow 3s ease-in-out infinite;
}

@keyframes sun-glow {
  0%, 100% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.6);
  }
  50% {
    box-shadow: 0 0 60px rgba(255, 215, 0, 0.8);
  }
}

/* 云朵 */
.cloud {
  position: absolute;
  background: white;
  border-radius: 100px;
  opacity: 0.8;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 100px;
}

.cloud-1 {
  width: 100px;
  height: 40px;
  top: 80px;
  left: 10%;
  animation: cloud-drift-1 20s linear infinite;
}

.cloud-1::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
}

.cloud-1::after {
  width: 60px;
  height: 35px;
  top: -15px;
  right: 10px;
}

.cloud-2 {
  width: 120px;
  height: 45px;
  top: 150px;
  right: 20%;
  animation: cloud-drift-2 25s linear infinite;
}

.cloud-2::before {
  width: 55px;
  height: 55px;
  top: -28px;
  left: 15px;
}

.cloud-2::after {
  width: 65px;
  height: 40px;
  top: -18px;
  right: 15px;
}

.cloud-3 {
  width: 90px;
  height: 35px;
  top: 120px;
  left: 50%;
  animation: cloud-drift-3 30s linear infinite;
}

.cloud-3::before {
  width: 45px;
  height: 45px;
  top: -22px;
  left: 12px;
}

.cloud-3::after {
  width: 50px;
  height: 32px;
  top: -14px;
  right: 12px;
}

@keyframes cloud-drift-1 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100vw);
  }
}

@keyframes cloud-drift-2 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100vw);
  }
}

@keyframes cloud-drift-3 {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(80vw);
  }
}

/* 旗杆 */
.flagpole {
  position: absolute;
  left: 50%;
  bottom: 100px;
  width: 8px;
  height: 500px;
  background: linear-gradient(to right, #888 0%, #ccc 50%, #888 100%);
  transform: translateX(-50%);
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* 国旗容器 */
.flag-container {
  position: absolute;
  left: 50%;
  bottom: 600px;
  transform: translateX(-50%);
  z-index: 2;
  animation: flag-raise 8s ease-in-out forwards;
}

@keyframes flag-raise {
  0% {
    bottom: 100px;
    opacity: 0.8;
  }
  100% {
    bottom: 600px;
    opacity: 1;
  }
}

/* 国旗 */
.flag {
  width: 300px;
  height: 200px;
  background: #DE2910;
  position: relative;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  animation: flag-wave 3s ease-in-out infinite;
  transform-origin: left center;
}

@keyframes flag-wave {
  0%, 100% {
    transform: perspective(400px) rotateY(0deg);
  }
  25% {
    transform: perspective(400px) rotateY(-5deg);
  }
  75% {
    transform: perspective(400px) rotateY(5deg);
  }
}

/* 五角星样式 */
.star {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 22px solid #FFDE00;
  transform: rotate(35deg);
}

.star::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  top: 3px;
  left: -15px;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 22px solid #FFDE00;
  transform: rotate(-70deg);
}

/* 大五角星 */
.star-big {
  left: 50px;
  top: 40px;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 36px solid #FFDE00;
}

.star-big::before {
  left: -25px;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 36px solid #FFDE00;
}

/* 小五角星 */
.star-small {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 15px solid #FFDE00;
}

.star-small::before {
  left: -10px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 15px solid #FFDE00;
}

.star-1 {
  left: 140px;
  top: 20px;
  transform: rotate(10deg);
}

.star-2 {
  left: 160px;
  top: 45px;
  transform: rotate(25deg);
}

.star-3 {
  left: 160px;
  top: 80px;
  transform: rotate(40deg);
}

.star-4 {
  left: 140px;
  top: 105px;
  transform: rotate(55deg);
}

/* 地面 */
.ground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, #228B22 0%, #1a6b1a 100%);
  z-index: 0;
}

/* 标题区域 */
.title {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  animation: title-fade-in 2s ease-in-out;
}

@keyframes title-fade-in {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.title h1 {
  font-size: 48px;
  font-weight: 700;
  color: #DE2910;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 5px;
}

.title p {
  font-size: 20px;
  color: #333;
  font-weight: 500;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.restart-btn {
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: #DE2910;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(222, 41, 16, 0.3);
  transition: all 0.3s ease;
  animation: button-appear 1s ease-in-out 8s both;
}

@keyframes button-appear {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.restart-btn:hover {
  background: #c41e0a;
  box-shadow: 0 6px 15px rgba(222, 41, 16, 0.5);
  transform: translateY(-2px);
}

.restart-btn:active {
  transform: translateY(0);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .sun {
    top: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
  }

  .flagpole {
    height: 350px;
  }

  .flag-container {
    bottom: 450px;
  }

  @keyframes flag-raise {
    0% {
      bottom: 100px;
      opacity: 0.8;
    }
    100% {
      bottom: 450px;
      opacity: 1;
    }
  }

  .flag {
    width: 200px;
    height: 133px;
  }

  .star-big {
    left: 35px;
    top: 25px;
    border-left: 18px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 26px solid #FFDE00;
  }

  .star-big::before {
    left: -18px;
    border-left: 18px solid transparent;
    border-right: 18px solid transparent;
    border-bottom: 26px solid #FFDE00;
  }

  .star-small {
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 12px solid #FFDE00;
  }

  .star-small::before {
    left: -8px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 12px solid #FFDE00;
  }

  .star-1 {
    left: 95px;
    top: 15px;
  }

  .star-2 {
    left: 110px;
    top: 32px;
  }

  .star-3 {
    left: 110px;
    top: 55px;
  }

  .star-4 {
    left: 95px;
    top: 72px;
  }

  .title h1 {
    font-size: 32px;
    letter-spacing: 3px;
  }

  .title p {
    font-size: 16px;
  }

  .restart-btn {
    padding: 10px 24px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .flagpole {
    height: 280px;
  }

  .flag-container {
    bottom: 380px;
  }

  @keyframes flag-raise {
    0% {
      bottom: 100px;
      opacity: 0.8;
    }
    100% {
      bottom: 380px;
      opacity: 1;
    }
  }

  .flag {
    width: 150px;
    height: 100px;
  }

  .star-big {
    left: 25px;
    top: 18px;
    border-left: 13px solid transparent;
    border-right: 13px solid transparent;
    border-bottom: 19px solid #FFDE00;
  }

  .star-big::before {
    left: -13px;
    border-left: 13px solid transparent;
    border-right: 13px solid transparent;
    border-bottom: 19px solid #FFDE00;
  }

  .star-small {
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 9px solid #FFDE00;
  }

  .star-small::before {
    left: -6px;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 9px solid #FFDE00;
  }

  .star-1 {
    left: 70px;
    top: 10px;
  }

  .star-2 {
    left: 82px;
    top: 23px;
  }

  .star-3 {
    left: 82px;
    top: 40px;
  }

  .star-4 {
    left: 70px;
    top: 53px;
  }

  .title h1 {
    font-size: 24px;
    letter-spacing: 2px;
  }

  .title p {
    font-size: 14px;
  }

  .restart-btn {
    padding: 8px 20px;
    font-size: 13px;
  }
}
</style>

