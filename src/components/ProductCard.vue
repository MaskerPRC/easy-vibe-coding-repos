<template>
  <div class="product-card" @click="goToDetail">
    <!-- 商品图片 -->
    <div class="product-image-wrapper">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div v-if="product.isHot" class="hot-badge">热销</div>
      <div v-if="showDiscount" class="discount-badge">
        省{{ discount }}元
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-desc">{{ product.description }}</p>

      <!-- 价格 -->
      <div class="price-section">
        <div class="price-wrapper">
          <span class="current-price">¥{{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
        </div>
        <span class="sales-count">已售{{ formatSales(product.sales) }}</span>
      </div>

      <!-- 操作按钮 -->
      <button @click.stop="addToCart" class="add-cart-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        加入购物车
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();

// 计算优惠金额
const discount = computed(() => {
  if (props.product.originalPrice) {
    return props.product.originalPrice - props.product.price;
  }
  return 0;
});

// 是否显示优惠标签
const showDiscount = computed(() => {
  return discount.value > 0;
});

// 格式化销量
const formatSales = (sales) => {
  if (sales >= 10000) {
    return (sales / 10000).toFixed(1) + '万';
  }
  return sales;
};

// 跳转到详情页
const goToDetail = () => {
  router.push({ name: 'ProductDetail', params: { id: props.product.id } });
};

// 添加到购物车
const addToCart = async () => {
  try {
    const response = await axios.post('/api/cart', {
      productId: props.product.id,
      quantity: 1
    });

    if (response.data.success) {
      alert('已添加到购物车');
    }
  } catch (error) {
    console.error('添加购物车失败:', error);
    alert(error.response?.data?.message || '添加购物车失败');
  }
};
</script>

<style scoped>
.product-card {
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 1:1 宽高比 */
  overflow: hidden;
  background: #F8F8F8;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.hot-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #FF6B6B;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'PingFang SC', sans-serif;
}

.discount-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #FFD166;
  color: #333333;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'PingFang SC', sans-serif;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'PingFang SC', sans-serif;
}

.product-desc {
  font-size: 13px;
  color: #666666;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  height: 39px;
  font-family: 'PingFang SC', sans-serif;
}

.price-section {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 12px;
}

.price-wrapper {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.current-price {
  font-size: 24px;
  font-weight: 700;
  color: #FF6B6B;
  font-family: 'PingFang SC', sans-serif;
}

.original-price {
  font-size: 14px;
  color: #999999;
  text-decoration: line-through;
  font-family: 'PingFang SC', sans-serif;
}

.sales-count {
  font-size: 12px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
}

.add-cart-btn {
  width: 100%;
  padding: 10px;
  background: #4ECDC4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.add-cart-btn:hover {
  background: #3dbdb5;
  transform: translateY(-1px);
}

.add-cart-btn:active {
  transform: translateY(0);
}
</style>
