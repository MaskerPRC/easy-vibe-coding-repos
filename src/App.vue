<template>
  <div class="app">
    <!-- 浮动小花装饰 -->
    <div class="floating-flowers">
      <div class="flower flower-1">🌻</div>
      <div class="flower flower-2">🌼</div>
      <div class="flower flower-3">🌸</div>
      <div class="flower flower-4">🌺</div>
    </div>

    <!-- 主容器 -->
    <div class="construction-container">
      <div class="construction-box">
        <!-- 蜡笔小新头像装饰 -->
        <div class="shinnosuke-face">
          <div class="face">
            <div class="eyes">
              <div class="eye left-eye">
                <div class="pupil"></div>
              </div>
              <div class="eye right-eye">
                <div class="pupil"></div>
              </div>
            </div>
            <div class="eyebrows">
              <div class="eyebrow left-brow"></div>
              <div class="eyebrow right-brow"></div>
            </div>
            <div class="mouth"></div>
          </div>
        </div>

        <h1 class="construction-title">网站正在搭建中哦！</h1>
        <p class="construction-text">小新正在努力建设这个网站呢~</p>
        <p class="construction-subtitle">请稍后再来玩吧！ ヾ(≧▽≦*)o</p>

        <!-- 动感条纹 -->
        <div class="animated-stripes">
          <div class="stripe"></div>
          <div class="stripe"></div>
          <div class="stripe"></div>
        </div>
      </div>
    </div>

    <!-- 云朵装饰 -->
    <div class="clouds">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>
  </div>
</template>

<script setup>
// 蜡笔小新主题页面 - 可爱活泼风格
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Comic Sans MS', sans-serif;
  position: relative;
  overflow: hidden;
}

/* 浮动小花装饰 */
.floating-flowers {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.flower {
  position: absolute;
  font-size: 40px;
  animation: float 4s ease-in-out infinite;
  opacity: 0.7;
}

.flower-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.flower-2 {
  top: 20%;
  right: 15%;
  animation-delay: 1s;
  font-size: 35px;
}

.flower-3 {
  bottom: 15%;
  left: 15%;
  animation-delay: 2s;
  font-size: 38px;
}

.flower-4 {
  bottom: 20%;
  right: 10%;
  animation-delay: 3s;
  font-size: 32px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* 云朵装饰 */
.clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
  animation: cloud-drift 20s linear infinite;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 100px;
}

.cloud-1 {
  width: 100px;
  height: 40px;
  top: 10%;
  left: -100px;
  animation-duration: 25s;
}

.cloud-1::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 20px;
}

.cloud-1::after {
  width: 60px;
  height: 40px;
  top: -15px;
  right: 20px;
}

.cloud-2 {
  width: 120px;
  height: 45px;
  top: 60%;
  left: -120px;
  animation-duration: 30s;
  animation-delay: 5s;
}

.cloud-2::before {
  width: 55px;
  height: 55px;
  top: -28px;
  left: 25px;
}

.cloud-2::after {
  width: 65px;
  height: 45px;
  top: -18px;
  right: 25px;
}

.cloud-3 {
  width: 90px;
  height: 35px;
  top: 80%;
  left: -90px;
  animation-duration: 35s;
  animation-delay: 10s;
}

.cloud-3::before {
  width: 45px;
  height: 45px;
  top: -22px;
  left: 18px;
}

.cloud-3::after {
  width: 50px;
  height: 35px;
  top: -12px;
  right: 18px;
}

@keyframes cloud-drift {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(100vw + 200px));
  }
}

/* 主容器 */
.construction-container {
  width: 100%;
  max-width: 600px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.construction-box {
  background: linear-gradient(135deg, #FFE66D 0%, #FFD93D 100%);
  border: 6px solid #FF6B6B;
  border-radius: 30px;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(255, 107, 107, 0.4);
  transform: rotate(-1deg);
  transition: transform 0.3s ease;
}

.construction-box:hover {
  transform: rotate(0deg) scale(1.02);
}

/* 蜡笔小新脸部 */
.shinnosuke-face {
  margin: 0 auto 40px;
  display: flex;
  justify-content: center;
}

.face {
  width: 120px;
  height: 140px;
  background: #FFD9A0;
  border-radius: 50% 50% 45% 45%;
  position: relative;
  animation: bounce 2s ease-in-out infinite;
  border: 4px solid #8B4513;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 眼睛 */
.eyes {
  position: absolute;
  top: 45px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 25px;
}

.eye {
  width: 28px;
  height: 35px;
  background: #FFFFFF;
  border: 3px solid #000000;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  position: relative;
}

.pupil {
  width: 12px;
  height: 12px;
  background: #000000;
  border-radius: 50%;
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  animation: blink 3s infinite;
}

@keyframes blink {
  0%, 96%, 100% {
    transform: translateX(-50%) scaleY(1);
  }
  98% {
    transform: translateX(-50%) scaleY(0.1);
  }
}

/* 眉毛 */
.eyebrows {
  position: absolute;
  top: 35px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 25px;
}

.eyebrow {
  width: 30px;
  height: 6px;
  background: #000000;
  border-radius: 3px;
}

.left-brow {
  transform: rotate(-10deg);
}

.right-brow {
  transform: rotate(10deg);
}

/* 嘴巴 */
.mouth {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 20px;
  border: 3px solid #000000;
  border-top: none;
  border-radius: 0 0 40px 40px;
  background: #FF6B9D;
}

/* 标题文本 */
.construction-title {
  font-size: 36px;
  font-weight: 900;
  color: #FF6B6B;
  margin-bottom: 15px;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
  animation: title-wiggle 1.5s ease-in-out infinite;
}

@keyframes title-wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
}

.construction-text {
  font-size: 18px;
  color: #D35400;
  line-height: 1.6;
  margin-bottom: 10px;
  font-weight: 600;
}

.construction-subtitle {
  font-size: 16px;
  color: #E67E22;
  font-weight: 500;
  margin-top: 10px;
}

/* 动感条纹 */
.animated-stripes {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  display: flex;
  overflow: hidden;
}

.stripe {
  flex: 1;
  background: linear-gradient(
    90deg,
    #FF6B6B 0%,
    #4ECDC4 33%,
    #95E1D3 66%,
    #FF6B6B 100%
  );
  animation: stripe-slide 3s linear infinite;
}

.stripe:nth-child(2) {
  animation-delay: -1s;
}

.stripe:nth-child(3) {
  animation-delay: -2s;
}

@keyframes stripe-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .construction-box {
    padding: 40px 25px;
    border-radius: 25px;
    border-width: 5px;
  }

  .face {
    width: 100px;
    height: 120px;
  }

  .eyes {
    top: 38px;
    gap: 20px;
  }

  .eye {
    width: 24px;
    height: 30px;
  }

  .pupil {
    width: 10px;
    height: 10px;
  }

  .eyebrows {
    top: 30px;
    gap: 20px;
  }

  .eyebrow {
    width: 25px;
    height: 5px;
  }

  .mouth {
    width: 35px;
    height: 18px;
    bottom: 20px;
  }

  .construction-title {
    font-size: 28px;
    margin-bottom: 12px;
  }

  .construction-text {
    font-size: 16px;
  }

  .construction-subtitle {
    font-size: 14px;
  }

  .flower {
    font-size: 30px;
  }
}

@media (max-width: 480px) {
  .construction-box {
    padding: 30px 20px;
    border-radius: 20px;
  }

  .face {
    width: 80px;
    height: 100px;
  }

  .eyes {
    top: 32px;
    gap: 18px;
  }

  .eye {
    width: 20px;
    height: 25px;
  }

  .pupil {
    width: 8px;
    height: 8px;
  }

  .eyebrows {
    top: 25px;
    gap: 18px;
  }

  .eyebrow {
    width: 22px;
    height: 4px;
  }

  .mouth {
    width: 30px;
    height: 15px;
    bottom: 18px;
  }

  .construction-title {
    font-size: 22px;
  }

  .construction-text {
    font-size: 14px;
  }

  .construction-subtitle {
    font-size: 13px;
  }

  .flower {
    font-size: 25px;
  }

  .animated-stripes {
    height: 20px;
  }
}
</style>
