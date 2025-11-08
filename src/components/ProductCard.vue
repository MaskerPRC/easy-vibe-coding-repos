<template>
  <div class="product-card" :style="{ backgroundColor: product.color }" @click="handleClick">
    <div class="product-content">
      <div class="new-badge" v-if="product.id === 1">新品</div>
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-tagline">{{ product.tagline }}</p>
      <p class="product-price">{{ product.price }}</p>
      <div class="product-links">
        <a href="#" class="link-primary" @click.stop>了解更多 ></a>
        <a href="#" class="link-secondary" @click.stop>购买 ></a>
      </div>
    </div>
    <div class="product-visual">
      <div class="phone-mockup" :class="product.image">
        <div class="phone-screen"></div>
        <div class="phone-notch"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.product);
};
</script>

<style scoped>
.product-card {
  border-radius: 18px;
  padding: 40px 30px;
  min-height: 580px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.product-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.new-badge {
  display: inline-block;
  background: #ff9500;
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.product-name {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1d1d1f;
}

.product-tagline {
  font-size: 17px;
  color: #6e6e73;
  margin-bottom: 12px;
}

.product-price {
  font-size: 14px;
  color: #1d1d1f;
  margin-bottom: 16px;
  font-weight: 500;
}

.product-links {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-top: 16px;
}

.product-links a {
  color: #0071e3;
  text-decoration: none;
  font-size: 17px;
  transition: all 0.3s;
  position: relative;
}

.product-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #0071e3;
  transition: width 0.3s;
}

.product-links a:hover::after {
  width: 100%;
}

.product-visual {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex: 1;
  margin-top: 30px;
  position: relative;
}

.phone-mockup {
  width: 180px;
  height: 360px;
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
  border-radius: 38px;
  padding: 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: transform 0.3s;
}

.product-card:hover .phone-mockup {
  transform: scale(1.05);
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 30px;
  position: relative;
  overflow: hidden;
}

.phone-notch {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 22px;
  background: #1a1a1a;
  border-radius: 0 0 12px 12px;
  z-index: 10;
}

/* iPhone 15 Pro - 紫色渐变 */
.phone-mockup.iphone-15-pro .phone-screen {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* iPhone 15 - 粉色渐变 */
.phone-mockup.iphone-15 .phone-screen {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

/* iPhone 14 - 蓝色渐变 */
.phone-mockup.iphone-14 .phone-screen {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* iPhone SE - 绿色渐变 */
.phone-mockup.iphone-se .phone-screen {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* 深色背景的产品卡片 - 调整文字颜色 */
.product-card[style*="#1d1d1f"] .product-name,
.product-card[style*="#1d1d1f"] .product-price {
  color: #f5f5f7;
}

.product-card[style*="#1d1d1f"] .product-tagline {
  color: #a1a1a6;
}

.product-card[style*="#1d1d1f"] .product-links a {
  color: #2997ff;
}

.product-card[style*="#1d1d1f"] .product-links a::after {
  background: #2997ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-card {
    min-height: 500px;
    padding: 30px 20px;
  }

  .product-name {
    font-size: 28px;
  }

  .phone-mockup {
    width: 150px;
    height: 300px;
  }
}

@media (max-width: 480px) {
  .product-card {
    min-height: 450px;
  }

  .product-name {
    font-size: 24px;
  }

  .product-links {
    flex-direction: column;
    gap: 12px;
  }

  .phone-mockup {
    width: 130px;
    height: 260px;
  }
}
</style>
