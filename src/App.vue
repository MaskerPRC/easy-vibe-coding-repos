<template>
  <div class="app">
    <div class="container">
      <!-- 头部 -->
      <header class="header">
        <h1 class="header-title">医药商品列表</h1>
        <p class="header-subtitle">优质医药产品，健康生活必备</p>
      </header>

      <!-- 商品列表 -->
      <div class="product-list">
        <div
          v-for="product in products"
          :key="product.id"
          class="product-card"
        >
          <!-- 商品主要信息 -->
          <div class="product-main">
            <div class="product-info">
              <h3 class="product-name">
                {{ product.name }}
                <span v-if="product.isPrescription" class="prescription-badge">处方药</span>
              </h3>
              <p class="product-spec">{{ product.spec }}</p>
            </div>

            <!-- 价格信息 -->
            <div class="product-prices">
              <div class="price-row">
                <span class="price-label">优惠价</span>
                <span class="discount-price">¥{{ product.discountPrice.toFixed(2) }}</span>
              </div>
              <div class="price-row">
                <span class="original-price">¥{{ product.price.toFixed(2) }}</span>
              </div>
            </div>

            <!-- 数量控制 -->
            <div class="product-quantity">
              <button
                class="quantity-btn"
                @click="decreaseQuantity(product)"
                :disabled="product.quantity <= 1"
              >-</button>
              <span class="quantity-value">x{{ product.quantity }}</span>
              <button
                class="quantity-btn"
                @click="increaseQuantity(product)"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 总计信息 -->
      <div class="summary">
        <div class="summary-row">
          <span class="summary-label">商品总数：</span>
          <span class="summary-value">{{ totalItems }} 件</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">原价总计：</span>
          <span class="summary-original">¥{{ totalOriginalPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span class="summary-label">优惠总计：</span>
          <span class="summary-discount">¥{{ totalDiscountPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row savings">
          <span class="savings-label">已节省：</span>
          <span class="savings-value">¥{{ totalSavings.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);

// 计算属性
const totalItems = computed(() => {
  return products.value.reduce((sum, product) => sum + product.quantity, 0);
});

const totalOriginalPrice = computed(() => {
  return products.value.reduce((sum, product) => sum + product.price * product.quantity, 0);
});

const totalDiscountPrice = computed(() => {
  return products.value.reduce((sum, product) => sum + product.discountPrice * product.quantity, 0);
});

const totalSavings = computed(() => {
  return totalOriginalPrice.value - totalDiscountPrice.value;
});

// 加载商品数据
const loadProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    if (response.data.success) {
      products.value = response.data.data;
    }
  } catch (error) {
    console.error('加载商品失败:', error);
  }
};

// 增加数量
const increaseQuantity = async (product) => {
  try {
    const response = await axios.put(`/api/products/${product.id}/quantity`, {
      quantity: product.quantity + 1
    });
    if (response.data.success) {
      product.quantity++;
    }
  } catch (error) {
    console.error('更新数量失败:', error);
  }
};

// 减少数量
const decreaseQuantity = async (product) => {
  if (product.quantity <= 1) return;

  try {
    const response = await axios.put(`/api/products/${product.id}/quantity`, {
      quantity: product.quantity - 1
    });
    if (response.data.success) {
      product.quantity--;
    }
  } catch (error) {
    console.error('更新数量失败:', error);
  }
};

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F8F9FA;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  padding: 24px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

/* 头部样式 */
.header {
  background: #FFFFFF;
  padding: 32px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-title {
  font-size: 28px;
  font-weight: 600;
  color: #1A73E8;
  margin-bottom: 8px;
}

.header-subtitle {
  font-size: 14px;
  color: #666666;
  line-height: 1.5;
}

/* 商品列表 */
.product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.product-card {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 6px;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.prescription-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #EA4335;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 500;
  border-radius: 4px;
}

.product-spec {
  font-size: 13px;
  color: #666666;
  line-height: 1.5;
}

/* 价格信息 */
.product-prices {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-label {
  font-size: 12px;
  color: #666666;
}

.discount-price {
  font-size: 20px;
  font-weight: 700;
  color: #FF9800;
}

.original-price {
  font-size: 14px;
  color: #999999;
  text-decoration: line-through;
}

/* 数量控制 */
.product-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F8F9FA;
  padding: 6px 12px;
  border-radius: 6px;
}

.quantity-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #1A73E8;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover:not(:disabled) {
  background: #1557B0;
}

.quantity-btn:disabled {
  background: #CCCCCC;
  cursor: not-allowed;
}

.quantity-value {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  min-width: 32px;
  text-align: center;
}

/* 总计信息 */
.summary {
  background: #FFFFFF;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #E9ECEF;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.total {
  padding-top: 16px;
  margin-top: 8px;
  border-top: 2px solid #E9ECEF;
}

.summary-row.savings {
  background: #FFF3E0;
  margin: 16px -24px -24px;
  padding: 16px 24px;
  border-bottom: none;
  border-radius: 0 0 8px 8px;
}

.summary-label {
  font-size: 14px;
  color: #666666;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.summary-original {
  font-size: 16px;
  color: #999999;
  text-decoration: line-through;
}

.summary-discount {
  font-size: 24px;
  font-weight: 700;
  color: #FF9800;
}

.savings-label {
  font-size: 15px;
  font-weight: 600;
  color: #F57C00;
}

.savings-value {
  font-size: 20px;
  font-weight: 700;
  color: #F57C00;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .app {
    padding: 16px;
  }

  .header {
    padding: 24px 16px;
  }

  .header-title {
    font-size: 22px;
  }

  .product-card {
    padding: 16px;
  }

  .product-main {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .product-prices {
    align-items: flex-start;
  }

  .product-quantity {
    align-self: flex-end;
  }

  .summary {
    padding: 20px 16px;
  }

  .summary-row.savings {
    margin: 16px -16px -20px;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .app {
    padding: 12px;
  }

  .header {
    padding: 20px 12px;
    margin-bottom: 16px;
  }

  .header-title {
    font-size: 20px;
  }

  .header-subtitle {
    font-size: 13px;
  }

  .product-list {
    gap: 12px;
  }

  .product-card {
    padding: 12px;
  }

  .product-name {
    font-size: 15px;
  }

  .product-spec {
    font-size: 12px;
  }

  .discount-price {
    font-size: 18px;
  }

  .summary {
    padding: 16px 12px;
  }

  .summary-discount {
    font-size: 20px;
  }
}
</style>
