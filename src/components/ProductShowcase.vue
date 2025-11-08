<template>
  <section class="showcase">
    <div class="showcase-content">
      <h2 class="section-title">探索 Google Pixel 产品家族</h2>
      <p class="section-subtitle">为你的生活带来更多可能</p>

      <div class="products-grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
          :style="{ backgroundColor: product.bgColor }"
        >
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-tagline">{{ product.tagline }}</p>
            <p class="product-price">{{ product.price }}</p>
            <div class="product-actions">
              <button class="btn-learn-more">了解更多</button>
              <button class="btn-buy">购买</button>
            </div>
          </div>
          <div class="product-image">
            <div :class="['device-mockup', product.type]">
              <div class="device-screen" :style="{ background: product.screenGradient }">
                <div v-if="product.type === 'phone'" class="device-notch"></div>
                <div v-if="product.type === 'watch'" class="watch-face">
                  <div class="watch-time">10:09</div>
                  <div class="watch-rings">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" class="ring ring-1"/>
                      <circle cx="50" cy="50" r="32" class="ring ring-2"/>
                      <circle cx="50" cy="50" r="24" class="ring ring-3"/>
                    </svg>
                  </div>
                </div>
                <div v-if="product.type === 'buds'" class="buds-case">
                  <div class="bud bud-left"></div>
                  <div class="bud bud-right"></div>
                </div>
                <div v-if="product.type === 'tablet'" class="tablet-content">
                  <div class="app-icons">
                    <div class="app-icon" v-for="i in 12" :key="i"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const products = ref([
  {
    id: 1,
    name: 'Pixel 9',
    tagline: '强大性能，纯粹体验',
    price: '¥4,799 起',
    type: 'phone',
    bgColor: '#f5f5f7',
    screenGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: 'Pixel Watch 2',
    tagline: '健康助手，时刻相伴',
    price: '¥2,799 起',
    type: 'watch',
    bgColor: '#fbfbfd',
    screenGradient: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
  },
  {
    id: 3,
    name: 'Pixel Buds Pro',
    tagline: '主动降噪，沉浸音质',
    price: '¥1,399 起',
    type: 'buds',
    bgColor: '#f5f5f7',
    screenGradient: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)'
  },
  {
    id: 4,
    name: 'Pixel Tablet',
    tagline: '智能中枢，家庭娱乐',
    price: '¥3,299 起',
    type: 'tablet',
    bgColor: '#fbfbfd',
    screenGradient: 'linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%)'
  }
]);
</script>

<style scoped>
.showcase {
  padding: 80px 20px;
  background: #ffffff;
}

.showcase-content {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 48px;
  font-weight: 600;
  color: #1d1d1f;
  text-align: center;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 24px;
  font-weight: 400;
  color: #6e6e73;
  text-align: center;
  margin: 0 0 60px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-card {
  border-radius: 18px;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 500px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: scale(1.02);
}

.product-info {
  position: relative;
  z-index: 2;
}

.product-name {
  font-size: 40px;
  font-weight: 600;
  color: #1d1d1f;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.product-tagline {
  font-size: 21px;
  font-weight: 400;
  color: #6e6e73;
  margin: 0 0 16px;
}

.product-price {
  font-size: 17px;
  color: #1d1d1f;
  margin: 0 0 24px;
}

.product-actions {
  display: flex;
  gap: 16px;
}

.btn-learn-more,
.btn-buy {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 980px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
  border: none;
}

.btn-learn-more {
  background: transparent;
  color: #4285f4;
  border: 1px solid #4285f4;
}

.btn-learn-more:hover {
  background: rgba(66, 133, 244, 0.08);
}

.btn-buy {
  background: #4285f4;
  color: #ffffff;
}

.btn-buy:hover {
  background: #3367d6;
}

.product-image {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex: 1;
  margin-top: 40px;
}

/* 设备模型样式 */
.device-mockup {
  position: relative;
}

.device-mockup.phone .device-screen {
  width: 160px;
  height: 320px;
  background: #1d1d1f;
  border-radius: 32px;
  padding: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.device-mockup.phone .device-screen > div:first-child {
  width: 100%;
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
}

.device-notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 18px;
  background: #1d1d1f;
  border-radius: 0 0 12px 12px;
  z-index: 3;
}

.device-mockup.watch .device-screen {
  width: 180px;
  height: 220px;
  background: #1d1d1f;
  border-radius: 50px;
  padding: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.watch-face {
  width: 100%;
  height: 100%;
  border-radius: 38px;
  background: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.watch-time {
  font-size: 32px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
}

.watch-rings svg {
  width: 80px;
  height: 80px;
}

.ring {
  fill: none;
  stroke-width: 4;
  stroke-linecap: round;
}

.ring-1 {
  stroke: #ff0055;
  stroke-dasharray: 200;
  stroke-dashoffset: 50;
}

.ring-2 {
  stroke: #00ff88;
  stroke-dasharray: 160;
  stroke-dashoffset: 40;
}

.ring-3 {
  stroke: #00aaff;
  stroke-dasharray: 120;
  stroke-dashoffset: 30;
}

.device-mockup.buds .device-screen {
  width: 200px;
  height: 120px;
  border-radius: 60px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.buds-case {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.bud {
  width: 40px;
  height: 50px;
  background: #ffffff;
  border-radius: 20px 20px 50% 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
}

.bud::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: #4285f4;
  border-radius: 50%;
}

.device-mockup.tablet .device-screen {
  width: 260px;
  height: 180px;
  background: #1d1d1f;
  border-radius: 24px;
  padding: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.tablet-content {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%);
  overflow: hidden;
  padding: 20px;
}

.app-icons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.app-icon {
  aspect-ratio: 1;
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-icon:nth-child(2) {
  background: linear-gradient(135deg, #ea4335 0%, #fbbc04 100%);
}

.app-icon:nth-child(3) {
  background: linear-gradient(135deg, #34a853 0%, #4285f4 100%);
}

.app-icon:nth-child(4) {
  background: linear-gradient(135deg, #fbbc04 0%, #ea4335 100%);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .section-title {
    font-size: 32px;
  }

  .section-subtitle {
    font-size: 19px;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .product-card {
    padding: 40px 30px;
    min-height: 450px;
  }

  .product-name {
    font-size: 32px;
  }

  .product-tagline {
    font-size: 17px;
  }
}
</style>
