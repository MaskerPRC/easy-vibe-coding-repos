<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">Google Pixel 9 Pro</h1>
      <p class="hero-subtitle">由 Google AI 驱动。为你而生。</p>
      <div class="hero-pricing">
        <p class="price">¥6,299 起</p>
      </div>
      <div class="hero-cta">
        <button class="btn-primary">立即购买</button>
        <button class="btn-secondary">进一步了解</button>
      </div>
      <div class="hero-image">
        <div class="phone-mockup">
          <div class="phone-screen">
            <div class="phone-notch"></div>
            <div class="phone-content">
              <div class="gradient-bg"></div>
              <div class="phone-text">
                <p class="phone-tagline">AI 摄影大师</p>
                <p class="phone-desc">魔法橡皮擦 • 最佳相片 • 夜视模式</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 60px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 1000px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 56px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
  line-height: 1.07;
}

.hero-subtitle {
  font-size: 28px;
  font-weight: 400;
  color: #6e6e73;
  margin: 0 0 24px;
  line-height: 1.14;
}

.hero-pricing {
  margin-bottom: 24px;
}

.price {
  font-size: 17px;
  color: #1d1d1f;
  margin: 0;
}

.hero-cta {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 60px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  font-size: 17px;
  font-weight: 400;
  border-radius: 980px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.btn-primary {
  background: #4285f4;
  color: #ffffff;
}

.btn-primary:hover {
  background: #3367d6;
  transform: scale(1.02);
}

.btn-secondary {
  background: transparent;
  color: #4285f4;
  border: 1px solid #4285f4;
}

.btn-secondary:hover {
  background: rgba(66, 133, 244, 0.08);
  transform: scale(1.02);
}

.hero-image {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  perspective: 1000px;
}

.phone-mockup {
  position: relative;
  animation: float 6s ease-in-out infinite;
}

.phone-screen {
  width: 340px;
  height: 680px;
  background: #1d1d1f;
  border-radius: 48px;
  padding: 12px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  position: relative;
}

.phone-notch {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 28px;
  background: #1d1d1f;
  border-radius: 0 0 20px 20px;
  z-index: 3;
}

.phone-content {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 36px;
  overflow: hidden;
  position: relative;
}

.gradient-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: absolute;
  top: 0;
  left: 0;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  }
  33% {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd364 100%);
  }
  66% {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #667eea 100%);
  }
}

.phone-text {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  padding: 0 30px;
  z-index: 2;
}

.phone-tagline {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.phone-desc {
  font-size: 14px;
  font-weight: 400;
  margin: 0;
  opacity: 0.95;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotateY(0deg);
  }
  25% {
    transform: translateY(-15px) rotateY(5deg);
  }
  50% {
    transform: translateY(0) rotateY(0deg);
  }
  75% {
    transform: translateY(-10px) rotateY(-5deg);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .hero {
    padding: 60px 20px 40px;
  }

  .hero-title {
    font-size: 40px;
  }

  .hero-subtitle {
    font-size: 21px;
  }

  .hero-cta {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
  }

  .phone-screen {
    width: 280px;
    height: 560px;
    border-radius: 40px;
    padding: 10px;
  }

  .phone-notch {
    width: 100px;
    height: 24px;
  }

  .phone-tagline {
    font-size: 24px;
  }

  .phone-desc {
    font-size: 12px;
  }
}
</style>
