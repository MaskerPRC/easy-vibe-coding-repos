<template>
  <div class="product-detail">
    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="!product" class="error">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      <p>商品不存在</p>
      <button @click="$router.push('/')" class="back-btn">返回首页</button>
    </div>

    <div v-else class="container">
      <!-- 返回按钮 -->
      <button @click="$router.back()" class="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回
      </button>

      <div class="detail-content">
        <!-- 左侧：商品图片 -->
        <div class="image-section">
          <div class="main-image">
            <img :src="product.image" :alt="product.name" />
            <div v-if="product.isHot" class="hot-badge">热销</div>
          </div>
        </div>

        <!-- 右侧：商品信息 -->
        <div class="info-section">
          <h1 class="product-title">{{ product.name }}</h1>

          <div class="product-category">
            <span class="category-label">分类：</span>
            <span class="category-value">{{ product.category }}</span>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <!-- 价格区域 -->
          <div class="price-area">
            <div class="price-row">
              <span class="price-label">售价</span>
              <div class="price-values">
                <span class="current-price">¥{{ product.price }}</span>
                <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
              </div>
            </div>

            <div v-if="product.originalPrice" class="discount-info">
              已优惠 ¥{{ product.originalPrice - product.price }}
            </div>
          </div>

          <!-- 销量和库存 -->
          <div class="stats-area">
            <div class="stat-item">
              <span class="stat-label">销量</span>
              <span class="stat-value">{{ formatSales(product.sales) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">库存</span>
              <span class="stat-value">{{ product.stock }}</span>
            </div>
          </div>

          <!-- 数量选择 -->
          <div class="quantity-area">
            <label class="quantity-label">数量</label>
            <div class="quantity-control">
              <button
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="quantity-btn"
              >
                -
              </button>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                :max="product.stock"
                class="quantity-input"
              />
              <button
                @click="increaseQuantity"
                :disabled="quantity >= product.stock"
                class="quantity-btn"
              >
                +
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button @click="addToCart" class="add-cart-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              加入购物车
            </button>
            <button @click="buyNow" class="buy-now-btn">
              立即购买
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const product = ref(null);
const loading = ref(true);
const quantity = ref(1);

// 获取商品详情
const fetchProductDetail = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/products/${route.params.id}`);
    if (response.data.success) {
      product.value = response.data.data;
    }
  } catch (error) {
    console.error('获取商品详情失败:', error);
  } finally {
    loading.value = false;
  }
};

// 格式化销量
const formatSales = (sales) => {
  if (sales >= 10000) {
    return (sales / 10000).toFixed(1) + '万';
  }
  return sales;
};

// 增加数量
const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++;
  }
};

// 减少数量
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// 添加到购物车
const addToCart = async () => {
  try {
    const response = await axios.post('/api/cart', {
      productId: product.value.id,
      quantity: quantity.value
    });

    if (response.data.success) {
      alert('已添加到购物车');
      quantity.value = 1;
    }
  } catch (error) {
    console.error('添加购物车失败:', error);
    alert(error.response?.data?.message || '添加购物车失败');
  }
};

// 立即购买
const buyNow = async () => {
  await addToCart();
  router.push('/cart');
};

onMounted(() => {
  fetchProductDetail();
});
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  background: #F8F8F8;
  padding: 32px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.loading,
.error {
  text-align: center;
  padding: 80px 20px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
}

.error svg {
  margin-bottom: 16px;
}

.error p {
  font-size: 16px;
  margin: 0 0 24px 0;
}

.back-btn {
  padding: 10px 24px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'PingFang SC', sans-serif;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: none;
  border-radius: 8px;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.back-link:hover {
  color: #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.image-section {
  position: relative;
}

.main-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #F8F8F8;
}

.main-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hot-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #FF6B6B;
  color: white;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'PingFang SC', sans-serif;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-title {
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin: 0;
  font-family: 'PingFang SC', sans-serif;
}

.product-category {
  font-size: 14px;
  font-family: 'PingFang SC', sans-serif;
}

.category-label {
  color: #999999;
}

.category-value {
  color: #FF6B6B;
  font-weight: 600;
}

.product-description {
  font-size: 15px;
  color: #666666;
  line-height: 1.8;
  margin: 0;
  font-family: 'PingFang SC', sans-serif;
}

.price-area {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(255, 209, 102, 0.05) 100%);
  padding: 24px;
  border-radius: 12px;
  border: 2px solid rgba(255, 107, 107, 0.1);
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.price-label {
  font-size: 14px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
}

.price-values {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.current-price {
  font-size: 36px;
  font-weight: 700;
  color: #FF6B6B;
  font-family: 'PingFang SC', sans-serif;
}

.original-price {
  font-size: 18px;
  color: #999999;
  text-decoration: line-through;
  font-family: 'PingFang SC', sans-serif;
}

.discount-info {
  font-size: 13px;
  color: #FFD166;
  font-weight: 600;
  background: rgba(255, 209, 102, 0.2);
  padding: 4px 12px;
  border-radius: 6px;
  display: inline-block;
  font-family: 'PingFang SC', sans-serif;
}

.stats-area {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 13px;
  color: #999999;
  font-family: 'PingFang SC', sans-serif;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
}

.quantity-area {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quantity-label {
  font-size: 15px;
  font-weight: 600;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0;
  border: 2px solid #F8F8F8;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  background: #F8F8F8;
  border: none;
  color: #333333;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background: #FF6B6B;
  color: white;
}

.quantity-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  outline: none;
  font-family: 'PingFang SC', sans-serif;
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: auto;
}

.add-cart-btn,
.buy-now-btn {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.add-cart-btn {
  background: #4ECDC4;
  color: white;
}

.add-cart-btn:hover {
  background: #3dbdb5;
  transform: translateY(-2px);
}

.buy-now-btn {
  background: #FF6B6B;
  color: white;
}

.buy-now-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px;
  }

  .product-title {
    font-size: 24px;
  }

  .current-price {
    font-size: 28px;
  }

  .action-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .detail-content {
    padding: 20px;
    gap: 24px;
  }

  .product-title {
    font-size: 20px;
  }

  .current-price {
    font-size: 24px;
  }
}
</style>
