<template>
  <div class="user-center">
    <div class="container">
      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="avatar">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="user-info">
          <h2 class="user-name">尊贵的用户</h2>
          <p class="user-desc">欢迎来到时尚商城</p>
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="orders-section">
        <h2 class="section-title">我的订单</h2>

        <div v-if="loading" class="loading">加载中...</div>

        <div v-else-if="orders.length === 0" class="empty-orders">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <p class="empty-text">还没有订单</p>
          <button @click="$router.push('/')" class="go-shopping-btn">去购物</button>
        </div>

        <div v-else class="orders-list">
          <div
            v-for="order in orders"
            :key="order.id"
            class="order-card"
          >
            <!-- 订单头部 -->
            <div class="order-header">
              <div class="order-info">
                <span class="order-number">订单号：{{ order.orderNo }}</span>
                <span class="order-time">{{ formatTime(order.createTime) }}</span>
              </div>
              <div :class="['order-status', `status-${order.status}`]">
                {{ getStatusText(order.status) }}
              </div>
            </div>

            <!-- 订单商品列表 -->
            <div class="order-items">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="order-item"
              >
                <div class="item-name">{{ getProductName(item.productId) }}</div>
                <div class="item-quantity">x{{ item.quantity }}</div>
                <div class="item-price">¥{{ item.price }}</div>
              </div>
            </div>

            <!-- 订单底部 -->
            <div class="order-footer">
              <div class="delivery-info">
                <div class="info-row">
                  <span class="info-label">收货人：</span>
                  <span class="info-value">{{ order.name }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">电话：</span>
                  <span class="info-value">{{ order.phone }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">地址：</span>
                  <span class="info-value">{{ order.address }}</span>
                </div>
              </div>
              <div class="order-total">
                <span class="total-label">订单总额：</span>
                <span class="total-amount">¥{{ order.totalAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const loading = ref(true);
const productsMap = ref({});

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/orders');
    if (response.data.success) {
      orders.value = response.data.data.reverse(); // 最新订单在前
    }
  } catch (error) {
    console.error('获取订单失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取商品信息（用于显示商品名称）
const fetchProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    if (response.data.success) {
      response.data.data.forEach(product => {
        productsMap.value[product.id] = product;
      });
    }
  } catch (error) {
    console.error('获取商品信息失败:', error);
  }
};

// 获取商品名称
const getProductName = (productId) => {
  return productsMap.value[productId]?.name || `商品 #${productId}`;
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

// 格式化时间
const formatTime = (time) => {
  const date = new Date(time);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchProducts();
  fetchOrders();
});
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  background: #F8F8F8;
  padding: 32px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.user-card {
  background: linear-gradient(135deg, #FF6B6B 0%, #FFD166 100%);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.2);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  font-family: 'PingFang SC', sans-serif;
}

.user-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-family: 'PingFang SC', sans-serif;
}

.orders-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 24px 0;
  font-family: 'PingFang SC', sans-serif;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  font-size: 16px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
}

.empty-orders {
  text-align: center;
  padding: 60px 20px;
}

.empty-orders svg {
  margin-bottom: 24px;
}

.empty-text {
  font-size: 16px;
  color: #666666;
  margin: 0 0 32px 0;
  font-family: 'PingFang SC', sans-serif;
}

.go-shopping-btn {
  padding: 12px 32px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.go-shopping-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 2px solid #F8F8F8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.order-card:hover {
  border-color: #FF6B6B;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.1);
}

.order-header {
  background: #F8F8F8;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-number {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
}

.order-time {
  font-size: 12px;
  color: #999999;
  font-family: 'PingFang SC', sans-serif;
}

.order-status {
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'PingFang SC', sans-serif;
}

.status-pending {
  background: rgba(255, 209, 102, 0.2);
  color: #FFD166;
}

.status-paid {
  background: rgba(78, 205, 196, 0.2);
  color: #4ECDC4;
}

.status-shipped {
  background: rgba(78, 205, 196, 0.2);
  color: #4ECDC4;
}

.status-completed {
  background: rgba(102, 187, 106, 0.2);
  color: #66BB6A;
}

.status-cancelled {
  background: rgba(158, 158, 158, 0.2);
  color: #9E9E9E;
}

.order-items {
  padding: 20px;
  background: white;
}

.order-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #F8F8F8;
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  font-size: 14px;
  color: #333333;
  font-weight: 500;
  font-family: 'PingFang SC', sans-serif;
}

.item-quantity {
  font-size: 14px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
}

.item-price {
  font-size: 14px;
  font-weight: 600;
  color: #FF6B6B;
  font-family: 'PingFang SC', sans-serif;
}

.order-footer {
  padding: 20px;
  background: white;
  border-top: 2px solid #F8F8F8;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  font-size: 13px;
  font-family: 'PingFang SC', sans-serif;
}

.info-label {
  color: #999999;
}

.info-value {
  color: #666666;
}

.order-total {
  text-align: right;
}

.total-label {
  font-size: 14px;
  color: #666666;
  margin-right: 8px;
  font-family: 'PingFang SC', sans-serif;
}

.total-amount {
  font-size: 24px;
  font-weight: 700;
  color: #FF6B6B;
  font-family: 'PingFang SC', sans-serif;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .user-card {
    padding: 24px;
    gap: 16px;
  }

  .avatar {
    width: 60px;
    height: 60px;
  }

  .avatar svg {
    width: 36px;
    height: 36px;
  }

  .user-name {
    font-size: 20px;
  }

  .orders-section {
    padding: 24px;
  }

  .section-title {
    font-size: 20px;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .order-total {
    text-align: left;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .user-card {
    padding: 20px;
  }

  .orders-section {
    padding: 20px;
  }

  .order-header,
  .order-items,
  .order-footer {
    padding: 16px;
  }
}
</style>
