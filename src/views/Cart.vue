<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">购物车</h1>

      <div v-if="loading" class="loading">加载中...</div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p class="empty-text">购物车是空的</p>
        <button @click="$router.push('/')" class="go-shopping-btn">去购物</button>
      </div>

      <div v-else class="cart-content">
        <!-- 购物车列表 -->
        <div class="cart-items">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="cart-item"
          >
            <!-- 商品图片 -->
            <div class="item-image" @click="goToProduct(item.product.id)">
              <img :src="item.product.image" :alt="item.product.name" />
            </div>

            <!-- 商品信息 -->
            <div class="item-info">
              <h3 class="item-name" @click="goToProduct(item.product.id)">
                {{ item.product.name }}
              </h3>
              <p class="item-desc">{{ item.product.description }}</p>
              <div class="item-price">¥{{ item.product.price }}</div>
            </div>

            <!-- 数量控制 -->
            <div class="item-quantity">
              <button
                @click="updateQuantity(item, item.quantity - 1)"
                :disabled="item.quantity <= 1"
                class="quantity-btn"
              >
                -
              </button>
              <span class="quantity-value">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item, item.quantity + 1)"
                :disabled="item.quantity >= item.product.stock"
                class="quantity-btn"
              >
                +
              </button>
            </div>

            <!-- 小计 -->
            <div class="item-subtotal">
              ¥{{ (item.product.price * item.quantity).toFixed(2) }}
            </div>

            <!-- 删除按钮 -->
            <button @click="removeItem(item)" class="remove-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 结算区域 -->
        <div class="checkout-section">
          <div class="checkout-card">
            <h2 class="checkout-title">订单摘要</h2>

            <div class="checkout-row">
              <span class="checkout-label">商品数量</span>
              <span class="checkout-value">{{ totalItems }} 件</span>
            </div>

            <div class="checkout-row">
              <span class="checkout-label">商品总价</span>
              <span class="checkout-value">¥{{ totalPrice.toFixed(2) }}</span>
            </div>

            <div class="checkout-divider"></div>

            <div class="checkout-row total-row">
              <span class="checkout-label">合计</span>
              <span class="checkout-total">¥{{ totalPrice.toFixed(2) }}</span>
            </div>

            <button @click="showCheckoutForm = true" class="checkout-btn">
              去结算
            </button>

            <button @click="clearCart" class="clear-btn">
              清空购物车
            </button>
          </div>
        </div>
      </div>

      <!-- 结算表单弹窗 -->
      <div v-if="showCheckoutForm" class="modal-overlay" @click="showCheckoutForm = false">
        <div class="modal-content" @click.stop>
          <h2 class="modal-title">填写订单信息</h2>

          <form @submit.prevent="submitOrder" class="checkout-form">
            <div class="form-group">
              <label class="form-label">收货人姓名</label>
              <input v-model="orderForm.name" type="text" required class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">联系电话</label>
              <input v-model="orderForm.phone" type="tel" required class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">收货地址</label>
              <textarea v-model="orderForm.address" required class="form-textarea"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" @click="showCheckoutForm = false" class="cancel-btn">
                取消
              </button>
              <button type="submit" class="submit-btn">
                确认下单
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const cartItems = ref([]);
const loading = ref(true);
const showCheckoutForm = ref(false);
const orderForm = ref({
  name: '',
  phone: '',
  address: ''
});

// 计算总数量
const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
});

// 计算总价
const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
});

// 获取购物车
const fetchCart = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/cart');
    if (response.data.success) {
      cartItems.value = response.data.data;
    }
  } catch (error) {
    console.error('获取购物车失败:', error);
  } finally {
    loading.value = false;
  }
};

// 更新数量
const updateQuantity = async (item, newQuantity) => {
  if (newQuantity < 1 || newQuantity > item.product.stock) {
    return;
  }

  try {
    const response = await axios.put(`/api/cart/${item.id}`, { quantity: newQuantity });
    if (response.data.success) {
      await fetchCart();
    }
  } catch (error) {
    console.error('更新数量失败:', error);
    alert(error.response?.data?.message || '更新失败');
  }
};

// 删除商品
const removeItem = async (item) => {
  if (!confirm('确定要删除这件商品吗？')) {
    return;
  }

  try {
    const response = await axios.delete(`/api/cart/${item.id}`);
    if (response.data.success) {
      await fetchCart();
    }
  } catch (error) {
    console.error('删除失败:', error);
    alert('删除失败');
  }
};

// 清空购物车
const clearCart = async () => {
  if (!confirm('确定要清空购物车吗？')) {
    return;
  }

  try {
    const response = await axios.delete('/api/cart');
    if (response.data.success) {
      await fetchCart();
    }
  } catch (error) {
    console.error('清空购物车失败:', error);
    alert('清空失败');
  }
};

// 提交订单
const submitOrder = async () => {
  try {
    const orderData = {
      items: cartItems.value.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: totalPrice.value,
      ...orderForm.value
    };

    const response = await axios.post('/api/orders', orderData);
    if (response.data.success) {
      alert('订单创建成功！');
      showCheckoutForm.value = false;
      orderForm.value = { name: '', phone: '', address: '' };
      await fetchCart();
      router.push('/user');
    }
  } catch (error) {
    console.error('创建订单失败:', error);
    alert(error.response?.data?.message || '创建订单失败');
  }
};

// 跳转到商品详情
const goToProduct = (id) => {
  router.push({ name: 'ProductDetail', params: { id } });
};

onMounted(() => {
  fetchCart();
});
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: #F8F8F8;
  padding: 32px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 32px 0;
  font-family: 'PingFang SC', sans-serif;
}

.loading {
  text-align: center;
  padding: 80px 20px;
  font-size: 16px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
}

.empty-cart svg {
  margin-bottom: 24px;
}

.empty-text {
  font-size: 18px;
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

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto auto auto;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.item-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #F8F8F8;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.item-image:hover img {
  transform: scale(1.05);
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 8px 0;
  cursor: pointer;
  transition: color 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.item-name:hover {
  color: #FF6B6B;
}

.item-desc {
  font-size: 13px;
  color: #666666;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'PingFang SC', sans-serif;
}

.item-price {
  font-size: 18px;
  font-weight: 700;
  color: #FF6B6B;
  font-family: 'PingFang SC', sans-serif;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0;
  border: 2px solid #F8F8F8;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  background: #F8F8F8;
  border: none;
  color: #333333;
  font-size: 16px;
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

.quantity-value {
  width: 50px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
}

.item-subtotal {
  font-size: 20px;
  font-weight: 700;
  color: #FF6B6B;
  min-width: 100px;
  text-align: right;
  font-family: 'PingFang SC', sans-serif;
}

.remove-btn {
  background: none;
  border: none;
  color: #999999;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s;
}

.remove-btn:hover {
  color: #FF6B6B;
}

.checkout-section {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.checkout-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.checkout-title {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 24px 0;
  font-family: 'PingFang SC', sans-serif;
}

.checkout-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.checkout-label {
  font-size: 14px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
}

.checkout-value {
  font-size: 14px;
  color: #333333;
  font-weight: 600;
  font-family: 'PingFang SC', sans-serif;
}

.checkout-divider {
  height: 1px;
  background: #F8F8F8;
  margin: 20px 0;
}

.total-row {
  margin-bottom: 24px;
}

.checkout-total {
  font-size: 24px;
  font-weight: 700;
  color: #FF6B6B;
  font-family: 'PingFang SC', sans-serif;
}

.checkout-btn {
  width: 100%;
  padding: 14px;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;
  font-family: 'PingFang SC', sans-serif;
}

.checkout-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

.clear-btn {
  width: 100%;
  padding: 12px;
  background: white;
  color: #666666;
  border: 2px solid #F8F8F8;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.clear-btn:hover {
  border-color: #FF6B6B;
  color: #FF6B6B;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 24px 0;
  font-family: 'PingFang SC', sans-serif;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  font-family: 'PingFang SC', sans-serif;
}

.form-input,
.form-textarea {
  padding: 12px;
  border: 2px solid #F8F8F8;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #FF6B6B;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.cancel-btn {
  background: #F8F8F8;
  color: #666666;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

.submit-btn {
  background: #FF6B6B;
  color: white;
}

.submit-btn:hover {
  background: #ff5252;
}

/* 移动端适配 */
@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .checkout-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 12px;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .item-quantity {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .item-subtotal {
    grid-column: 1 / -1;
    text-align: left;
  }

  .remove-btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .modal-content {
    padding: 24px;
  }
}
</style>
