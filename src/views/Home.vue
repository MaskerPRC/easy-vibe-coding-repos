<template>
  <div class="home">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <h1 class="banner-title">发现精选好物</h1>
        <p class="banner-subtitle">品质生活，从这里开始</p>
      </div>
    </div>

    <!-- 筛选和排序 -->
    <div class="filter-section">
      <div class="container">
        <!-- 分类筛选 -->
        <div class="categories">
          <button
            :class="['category-btn', { active: selectedCategory === '' }]"
            @click="selectCategory('')"
          >
            全部
          </button>
          <button
            v-for="category in categories"
            :key="category"
            :class="['category-btn', { active: selectedCategory === category }]"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>

        <!-- 排序 -->
        <div class="sort-section">
          <label class="sort-label">排序：</label>
          <select v-model="sortType" @change="fetchProducts" class="sort-select">
            <option value="">默认</option>
            <option value="sales">销量优先</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="container">
      <div v-if="loading" class="loading">加载中...</div>

      <div v-else-if="products.length === 0" class="empty">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>暂无商品</p>
      </div>

      <div v-else class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const products = ref([]);
const categories = ref([]);
const selectedCategory = ref('');
const sortType = ref('');
const loading = ref(true);

// 获取分类
const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    if (response.data.success) {
      categories.value = response.data.data;
    }
  } catch (error) {
    console.error('获取分类失败:', error);
  }
};

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = {};
    if (selectedCategory.value) {
      params.category = selectedCategory.value;
    }
    if (route.query.search) {
      params.search = route.query.search;
    }
    if (sortType.value) {
      params.sort = sortType.value;
    }

    const response = await axios.get('/api/products', { params });
    if (response.data.success) {
      products.value = response.data.data;
    }
  } catch (error) {
    console.error('获取商品失败:', error);
  } finally {
    loading.value = false;
  }
};

// 选择分类
const selectCategory = (category) => {
  selectedCategory.value = category;
  fetchProducts();
};

// 监听路由变化（搜索）
watch(() => route.query.search, () => {
  fetchProducts();
});

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #F8F8F8;
}

.banner {
  background: linear-gradient(135deg, #FF6B6B 0%, #FFD166 100%);
  padding: 80px 24px;
  text-align: center;
  margin-bottom: 32px;
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
}

.banner-title {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
  font-family: 'PingFang SC', sans-serif;
}

.banner-subtitle {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-family: 'PingFang SC', sans-serif;
}

.filter-section {
  background: white;
  padding: 24px 0;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.category-btn {
  padding: 8px 20px;
  background: #F8F8F8;
  border: 2px solid transparent;
  border-radius: 20px;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.category-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #FF6B6B;
}

.category-btn.active {
  background: #FF6B6B;
  color: white;
  border-color: #FF6B6B;
}

.sort-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label {
  font-size: 14px;
  color: #666666;
  font-weight: 500;
  font-family: 'PingFang SC', sans-serif;
}

.sort-select {
  padding: 8px 16px;
  border: 2px solid #F8F8F8;
  border-radius: 8px;
  font-size: 14px;
  color: #333333;
  background: white;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  font-family: 'PingFang SC', sans-serif;
}

.sort-select:focus {
  border-color: #FF6B6B;
}

.loading {
  text-align: center;
  padding: 80px 20px;
  font-size: 16px;
  color: #666666;
  font-family: 'PingFang SC', sans-serif;
}

.empty {
  text-align: center;
  padding: 80px 20px;
  color: #999999;
}

.empty svg {
  margin-bottom: 16px;
}

.empty p {
  font-size: 16px;
  margin: 0;
  font-family: 'PingFang SC', sans-serif;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding-bottom: 48px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .banner {
    padding: 60px 24px;
  }

  .banner-title {
    font-size: 36px;
  }

  .banner-subtitle {
    font-size: 16px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .banner {
    padding: 40px 16px;
  }

  .banner-title {
    font-size: 28px;
  }

  .banner-subtitle {
    font-size: 14px;
  }

  .container {
    padding: 0 16px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
</style>
