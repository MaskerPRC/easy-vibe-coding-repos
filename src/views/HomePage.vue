<template>
  <div class="home-page">
    <!-- 促销条 -->
    <div class="promo-banner" :class="{ 'is-hidden': !promoBannerVisible }">
      <div class="promo-content">
        <span class="promo-icon">🎉</span>
        <span class="promo-text">限时优惠：全场商品8折起！</span>
        <span class="promo-icon">🎉</span>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 id="hero-title" class="hero-title">{{ heroTitle }}</h1>
        <p id="sub-title" class="sub-title">{{ subTitle }}</p>
        <div class="hero-buttons">
          <button class="btn btn-primary">开始体验</button>
          <button class="btn btn-secondary">了解更多</button>
        </div>
      </div>
    </div>

    <!-- 特性展示区 -->
    <div class="features-section">
      <div class="feature-card">
        <div class="feature-icon">🚀</div>
        <h3>快速高效</h3>
        <p>闪电般的响应速度</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>安全可靠</h3>
        <p>企业级安全保障</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💡</div>
        <h3>智能创新</h3>
        <p>AI驱动的智能服务</p>
      </div>
    </div>

    <!-- 右下角交互浮窗 -->
    <TransformWidget />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TransformWidget from '../components/TransformWidget.vue';
import { transformExecutor } from '../utils/transformExecutor';

// 初始文案
const heroTitle = ref('欢迎来到我们的平台');
const subTitle = ref('为您提供最优质的服务体验');
const promoBannerVisible = ref(true);

// 初始化变换执行器
onMounted(() => {
  transformExecutor.init({
    onRestore: () => {
      console.log('页面已恢复初始状态');
    }
  });
});
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 促销条样式 */
.promo-banner {
  background: var(--color-primary, #4a90e2);
  color: white;
  padding: 12px 20px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.promo-banner.is-hidden {
  display: none;
}

.promo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.promo-icon {
  font-size: 18px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.promo-text {
  font-size: 15px;
  letter-spacing: 0.5px;
}

/* 主内容区样式 */
.hero-section {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.hero-content {
  text-align: center;
  color: white;
  max-width: 800px;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s ease;
}

.sub-title {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 40px;
  opacity: 0.95;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s ease 0.2s backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease 0.4s backwards;
}

.btn {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: var(--color-primary, #4a90e2);
  color: white;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
}

.btn-primary:hover {
  background: var(--color-primary-hover, #357abd);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.5);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 特性展示区 */
.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .sub-title {
    font-size: 18px;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
  }

  .features-section {
    padding: 40px 20px;
    gap: 20px;
  }

  .promo-text {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 28px;
  }

  .sub-title {
    font-size: 16px;
  }

  .feature-card {
    padding: 30px 20px;
  }
}
</style>
