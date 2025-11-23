<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <span class="logo-icon">🛍️</span>
        <span class="logo-text">时尚商城</span>
      </router-link>

      <!-- 搜索框 -->
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          placeholder="搜索商品..."
          class="search-input"
        />
        <button @click="handleSearch" class="search-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>

      <!-- 导航链接 -->
      <div class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/cart" class="nav-link cart-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="cart-text">购物车</span>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </router-link>
        <router-link to="/user" class="nav-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>我的</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const searchQuery = ref('');
const cartCount = ref(0);

// 获取购物车数量
const fetchCartCount = async () => {
  try {
    const response = await axios.get('/api/cart');
    if (response.data.success) {
      cartCount.value = response.data.data.reduce((sum, item) => sum + item.quantity, 0);
    }
  } catch (error) {
    console.error('获取购物车失败:', error);
  }
};

// 搜索处理
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Home', query: { search: searchQuery.value } });
  }
};

onMounted(() => {
  fetchCartCount();
  // 每5秒更新一次购物车数量
  setInterval(fetchCartCount, 5000);
});
</script>

<style scoped>
.navbar {
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 16px 0;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
  color: #FF6B6B;
  white-space: nowrap;
  transition: transform 0.2s;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-family: 'PingFang SC', sans-serif;
}

.search-box {
  flex: 1;
  max-width: 500px;
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #F8F8F8;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.search-input:focus {
  border-color: #FF6B6B;
  background: #FFFFFF;
}

.search-btn {
  padding: 10px 20px;
  background: #FF6B6B;
  border: none;
  border-radius: 24px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.search-btn:hover {
  background: #ff5252;
  transform: translateY(-1px);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: #333333;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-radius: 20px;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: 'PingFang SC', sans-serif;
}

.nav-link:hover {
  background: #F8F8F8;
  color: #FF6B6B;
}

.nav-link.router-link-active {
  color: #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: 2px;
  right: 8px;
  background: #FF6B6B;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  font-weight: 600;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
    gap: 16px;
  }

  .logo {
    font-size: 20px;
  }

  .logo-icon {
    font-size: 24px;
  }

  .search-box {
    order: 3;
    width: 100%;
    max-width: 100%;
  }

  .nav-links {
    gap: 12px;
  }

  .nav-link {
    padding: 6px 12px;
    font-size: 14px;
  }

  .cart-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 12px 0;
  }

  .navbar-container {
    padding: 0 16px;
  }

  .logo-text {
    font-size: 18px;
  }

  .nav-link {
    padding: 6px 8px;
  }
}
</style>
