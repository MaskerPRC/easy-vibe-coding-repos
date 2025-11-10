<template>
  <div class="home">
    <!-- Banner区域 -->
    <div class="banner">
      <div class="banner-content">
        <h1 class="banner-title">常用药物药理知识库</h1>
        <p class="banner-subtitle">科学用药，健康生活</p>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="container">
        <div class="search-box">
          <input
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="搜索药物名称..."
            @keyup.enter="handleSearch"
          />
          <button class="search-button" @click="handleSearch">搜索</button>
        </div>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="categories-section">
      <div class="container">
        <div class="categories">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="category-btn"
            :class="{ active: currentCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }} ({{ cat.count }})
          </button>
        </div>
      </div>
    </div>

    <!-- 药物卡片列表 -->
    <div class="medicines-section">
      <div class="container">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="filteredMedicines.length === 0" class="no-data">
          暂无数据
        </div>
        <div v-else class="medicines-grid">
          <div
            v-for="medicine in filteredMedicines"
            :key="medicine.id"
            class="medicine-card"
            @click="goToDetail(medicine.id)"
          >
            <div class="card-icon">{{ medicine.image }}</div>
            <h3 class="card-title">{{ medicine.name }}</h3>
            <div class="card-category">{{ medicine.category }}</div>
            <p class="card-desc">{{ medicine.shortDesc }}</p>
            <div class="card-footer">
              <span class="view-detail">查看详情 →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const medicines = ref([]);
const categories = ref([]);
const currentCategory = ref('all');
const searchKeyword = ref('');
const loading = ref(false);

// 根据搜索关键字和分类过滤药物
const filteredMedicines = computed(() => {
  if (searchKeyword.value) {
    return medicines.value.filter(
      (m) =>
        m.name.includes(searchKeyword.value) ||
        m.category.includes(searchKeyword.value) ||
        m.shortDesc.includes(searchKeyword.value)
    );
  }
  return medicines.value;
});

// 获取分类数据
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

// 获取药物数据
const fetchMedicines = async (category = 'all') => {
  loading.value = true;
  try {
    const response = await axios.get('/api/medicines', {
      params: { category }
    });
    if (response.data.success) {
      medicines.value = response.data.data;
    }
  } catch (error) {
    console.error('获取药物列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 选择分类
const selectCategory = (categoryId) => {
  currentCategory.value = categoryId;
  searchKeyword.value = '';
  fetchMedicines(categoryId);
};

// 搜索处理
const handleSearch = () => {
  if (!searchKeyword.value) {
    fetchMedicines(currentCategory.value);
  }
};

// 跳转到详情页
const goToDetail = (id) => {
  router.push({ name: 'MedicineDetail', params: { id } });
};

onMounted(() => {
  fetchCategories();
  fetchMedicines();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home {
  min-height: 100vh;
  background: #f8f8f8;
}

/* Banner区域 */
.banner {
  background: linear-gradient(135deg, #2f80ed 0%, #1e5fc4 100%);
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
}

.banner-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.banner-subtitle {
  font-size: 18px;
  opacity: 0.95;
  font-weight: 400;
}

/* 搜索区域 */
.search-section {
  background: white;
  padding: 24px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: 8px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 15px;
  color: #333333;
  transition: border-color 0.3s;
  font-family: 'Microsoft YaHei', sans-serif;
}

.search-input:focus {
  outline: none;
  border-color: #2f80ed;
}

.search-button {
  padding: 12px 32px;
  background: #2f80ed;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.search-button:hover {
  background: #1e5fc4;
}

/* 分类导航 */
.categories-section {
  padding: 24px 20px;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.category-btn {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333333;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.category-btn:hover {
  border-color: #2f80ed;
  color: #2f80ed;
}

.category-btn.active {
  background: #2f80ed;
  color: white;
  border-color: #2f80ed;
}

/* 药物列表 */
.medicines-section {
  padding: 32px 20px;
}

.loading,
.no-data {
  text-align: center;
  padding: 60px 20px;
  font-size: 16px;
  color: #828282;
}

.medicines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.medicine-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.medicine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(47, 128, 237, 0.15);
}

.card-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  text-align: center;
  margin-bottom: 8px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.card-category {
  text-align: center;
  font-size: 13px;
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  margin: 0 auto 12px;
  width: fit-content;
  display: block;
}

.card-desc {
  font-size: 14px;
  color: #828282;
  line-height: 1.6;
  margin-bottom: 16px;
  text-align: center;
}

.card-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.view-detail {
  color: #2f80ed;
  font-size: 14px;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .banner-title {
    font-size: 28px;
  }

  .banner-subtitle {
    font-size: 16px;
  }

  .medicines-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .medicine-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .banner {
    padding: 40px 20px;
  }

  .banner-title {
    font-size: 24px;
  }

  .banner-subtitle {
    font-size: 14px;
  }

  .search-box {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }

  .medicines-grid {
    grid-template-columns: 1fr;
  }
}
</style>
