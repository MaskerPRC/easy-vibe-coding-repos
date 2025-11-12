<template>
  <div class="gallery-container">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="gallery-title">艺术画廊</h1>
        <div class="nav-controls">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索作品..."
            class="search-input"
          />
        </div>
      </div>
    </nav>

    <!-- 筛选区 -->
    <div class="filter-section">
      <div class="filter-content">
        <button
          v-for="category in categories"
          :key="category"
          :class="['filter-btn', { active: selectedCategory === category }]"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchArtworks" class="retry-btn">重试</button>
    </div>

    <!-- 作品展示区 -->
    <div v-else class="artworks-grid">
      <div
        v-for="artwork in filteredArtworks"
        :key="artwork.id"
        class="artwork-card"
        @click="goToDetail(artwork.id)"
      >
        <div class="artwork-image">
          <img :src="artwork.image" :alt="artwork.title" />
          <div class="overlay">
            <span class="view-details">查看详情</span>
          </div>
        </div>
        <div class="artwork-info">
          <h3 class="artwork-title">{{ artwork.title }}</h3>
          <p class="artwork-artist">{{ artwork.artist }}</p>
          <div class="artwork-meta">
            <span class="artwork-category">{{ artwork.category }}</span>
            <span class="artwork-price">¥{{ artwork.price.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && !error && filteredArtworks.length === 0" class="empty-state">
      <p>暂无作品</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 响应式数据
const artworks = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('全部')
const categories = ref(['全部'])

// 获取作品列表
const fetchArtworks = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get('/api/artworks')
    artworks.value = response.data

    // 提取所有分类
    const allCategories = ['全部', ...new Set(response.data.map(a => a.category))]
    categories.value = allCategories
  } catch (err) {
    error.value = '加载作品失败，请稍后重试'
    console.error('获取作品失败:', err)
  } finally {
    loading.value = false
  }
}

// 筛选后的作品
const filteredArtworks = computed(() => {
  let filtered = artworks.value

  // 按分类筛选
  if (selectedCategory.value !== '全部') {
    filtered = filtered.filter(a => a.category === selectedCategory.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.artist.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 跳转到详情页
const goToDetail = (id) => {
  router.push({ name: 'ArtworkDetail', params: { id } })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchArtworks()
})
</script>

<style scoped>
/* 导入字体 */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

/* 全局容器 */
.gallery-container {
  min-height: 100vh;
  background-color: #F8F8F8;
  font-family: 'Lato', 'Microsoft YaHei', sans-serif;
}

/* 导航栏 */
.navbar {
  position: sticky;
  top: 0;
  background-color: #34495E;
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.gallery-title {
  font-family: 'Montserrat', 'Microsoft YaHei', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.search-input {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  width: 300px;
  background-color: rgba(255, 255, 255, 0.95);
  color: #2C3E50;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  background-color: white;
}

.search-input::placeholder {
  color: #7F8C8D;
}

/* 筛选区 */
.filter-section {
  background-color: white;
  padding: 1.5rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.6rem 1.5rem;
  border: 2px solid #E0E0E0;
  background-color: white;
  color: #2C3E50;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: #34495E;
  background-color: #f5f5f5;
}

.filter-btn.active {
  background-color: #34495E;
  color: white;
  border-color: #34495E;
}

/* 作品网格 */
.artworks-grid {
  max-width: 1400px;
  margin: 3rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

/* 作品卡片 */
.artwork-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.artwork-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.artwork-image {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.artwork-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.artwork-card:hover .artwork-image img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(52, 73, 94, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.artwork-card:hover .overlay {
  opacity: 1;
}

.view-details {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.artwork-info {
  padding: 1.5rem;
}

.artwork-title {
  font-family: 'Montserrat', 'Microsoft YaHei', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.artwork-artist {
  font-size: 0.95rem;
  color: #7F8C8D;
  margin: 0 0 1rem 0;
}

.artwork-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #E0E0E0;
}

.artwork-category {
  display: inline-block;
  padding: 0.35rem 0.9rem;
  background-color: #2ECC71;
  color: white;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.artwork-price {
  font-size: 1.15rem;
  font-weight: 700;
  color: #E74C3C;
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  color: #7F8C8D;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #E0E0E0;
  border-top: 4px solid #34495E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-message {
  text-align: center;
  padding: 5rem 2rem;
  color: #E74C3C;
}

.error-message p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.retry-btn {
  padding: 0.75rem 2rem;
  background-color: #34495E;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background-color: #2C3E50;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: #7F8C8D;
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    gap: 1rem;
  }

  .gallery-title {
    font-size: 1.5rem;
  }

  .search-input {
    width: 100%;
  }

  .artworks-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin: 2rem auto;
  }

  .filter-content {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .artworks-grid {
    grid-template-columns: 1fr;
  }
}
</style>
