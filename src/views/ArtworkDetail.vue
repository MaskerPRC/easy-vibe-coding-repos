<template>
  <div class="detail-container">
    <!-- 返回按钮 -->
    <button class="back-btn" @click="goBack">
      <span class="back-icon">←</span>
      <span>返回画廊</span>
    </button>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchArtwork" class="retry-btn">重试</button>
    </div>

    <!-- 作品详情 -->
    <div v-else-if="artwork" class="artwork-detail">
      <div class="detail-content">
        <!-- 作品图片 -->
        <div class="image-section">
          <div class="image-container">
            <img :src="artwork.image" :alt="artwork.title" />
          </div>
        </div>

        <!-- 作品信息 -->
        <div class="info-section">
          <div class="category-badge">{{ artwork.category }}</div>

          <h1 class="artwork-title">{{ artwork.title }}</h1>

          <div class="artist-info">
            <span class="label">艺术家</span>
            <span class="value">{{ artwork.artist }}</span>
          </div>

          <div class="price-section">
            <span class="price-label">价格</span>
            <span class="price-value">¥{{ artwork.price.toLocaleString() }}</span>
          </div>

          <div class="divider"></div>

          <div class="description-section">
            <h3 class="section-title">作品描述</h3>
            <p class="description-text">{{ artwork.description }}</p>
          </div>

          <div class="meta-section">
            <div class="meta-item">
              <span class="meta-label">尺寸</span>
              <span class="meta-value">{{ artwork.dimensions }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">年份</span>
              <span class="meta-value">{{ artwork.year }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">媒介</span>
              <span class="meta-value">{{ artwork.medium }}</span>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn btn-primary">联系购买</button>
            <button class="btn btn-secondary">收藏作品</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

// 响应式数据
const artwork = ref(null)
const loading = ref(true)
const error = ref(null)

// 获取作品详情
const fetchArtwork = async () => {
  try {
    loading.value = true
    error.value = null
    const id = route.params.id
    const response = await axios.get(`/api/artworks/${id}`)
    artwork.value = response.data
  } catch (err) {
    error.value = '加载作品详情失败，请稍后重试'
    console.error('获取作品详情失败:', err)
  } finally {
    loading.value = false
  }
}

// 返回画廊
const goBack = () => {
  router.push({ name: 'Gallery' })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchArtwork()
})
</script>

<style scoped>
/* 导入字体 */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

/* 全局容器 */
.detail-container {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 2rem;
  font-family: 'Lato', 'Microsoft YaHei', sans-serif;
}

/* 返回按钮 */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #34495E;
  border: 2px solid #34495E;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.back-btn:hover {
  background-color: #34495E;
  color: white;
}

.back-icon {
  font-size: 1.3rem;
  line-height: 1;
}

/* 作品详情 */
.artwork-detail {
  max-width: 1400px;
  margin: 0 auto;
}

.detail-content {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

/* 图片部分 */
.image-section {
  background-color: #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.image-container {
  width: 100%;
  max-width: 600px;
}

.image-container img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 信息部分 */
.info-section {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-badge {
  display: inline-block;
  width: fit-content;
  padding: 0.5rem 1.2rem;
  background-color: #2ECC71;
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.artwork-title {
  font-family: 'Montserrat', 'Microsoft YaHei', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2C3E50;
  margin: 0;
  line-height: 1.3;
}

.artist-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.artist-info .label {
  font-size: 0.95rem;
  color: #7F8C8D;
  font-weight: 500;
}

.artist-info .value {
  font-size: 1.15rem;
  color: #34495E;
  font-weight: 600;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #FFF5F5;
  border-radius: 8px;
  border-left: 4px solid #E74C3C;
}

.price-label {
  font-size: 1rem;
  color: #7F8C8D;
  font-weight: 500;
}

.price-value {
  font-size: 2rem;
  font-weight: 700;
  color: #E74C3C;
}

.divider {
  height: 1px;
  background-color: #E0E0E0;
  margin: 1rem 0;
}

.description-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-family: 'Montserrat', 'Microsoft YaHei', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2C3E50;
  margin: 0;
}

.description-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #5A5A5A;
  margin: 0;
}

.meta-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #F8F8F8;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-label {
  font-size: 0.95rem;
  color: #7F8C8D;
  font-weight: 500;
}

.meta-value {
  font-size: 1rem;
  color: #2C3E50;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #34495E;
  color: white;
}

.btn-primary:hover {
  background-color: #2C3E50;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 73, 94, 0.3);
}

.btn-secondary {
  background-color: white;
  color: #34495E;
  border: 2px solid #34495E;
}

.btn-secondary:hover {
  background-color: #F8F8F8;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .detail-content {
    grid-template-columns: 1fr;
  }

  .image-section {
    padding: 2rem;
  }

  .info-section {
    padding: 2rem;
  }

  .artwork-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .detail-container {
    padding: 1rem;
  }

  .image-section {
    padding: 1.5rem;
  }

  .info-section {
    padding: 1.5rem;
  }

  .artwork-title {
    font-size: 1.75rem;
  }

  .price-value {
    font-size: 1.75rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
