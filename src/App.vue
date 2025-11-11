<template>
  <div class="app">
    <!-- 头部导航 -->
    <header class="header">
      <div class="header-content">
        <h1 class="site-title">明星写真</h1>
        <nav class="nav">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="['nav-btn', { active: selectedCategory === cat }]"
            @click="filterByCategory(cat)"
          >
            {{ cat }}
          </button>
        </nav>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="fetchPhotos" class="retry-btn">重试</button>
        </div>

        <!-- 写真网格 -->
        <div v-else class="photo-grid">
          <div
            v-for="photo in filteredPhotos"
            :key="photo.id"
            class="photo-card"
            @click="selectPhoto(photo)"
          >
            <div class="photo-image-wrapper">
              <img :src="photo.image" :alt="photo.name" class="photo-image" />
              <div class="photo-overlay">
                <div class="photo-overlay-content">
                  <h3 class="photo-name">{{ photo.name }}</h3>
                  <p class="photo-category">{{ photo.category }}</p>
                </div>
              </div>
            </div>
            <div class="photo-info">
              <h3 class="photo-title">{{ photo.name }}</h3>
              <p class="photo-desc">{{ photo.description }}</p>
              <div class="photo-tags">
                <span v-for="tag in photo.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 详情弹窗 -->
    <transition name="modal">
      <div v-if="selectedPhotoData" class="modal-backdrop" @click="closeModal">
        <div class="modal" @click.stop>
          <button class="modal-close" @click="closeModal">&times;</button>
          <div class="modal-content">
            <div class="modal-image-wrapper">
              <img :src="selectedPhotoData.image" :alt="selectedPhotoData.name" class="modal-image" />
            </div>
            <div class="modal-info">
              <h2 class="modal-title">{{ selectedPhotoData.name }}</h2>
              <p class="modal-category">分类：{{ selectedPhotoData.category }}</p>
              <p class="modal-desc">{{ selectedPhotoData.description }}</p>
              <div class="modal-tags">
                <span v-for="tag in selectedPhotoData.tags" :key="tag" class="tag tag-large">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 状态管理
const photos = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedCategory = ref('全部');
const selectedPhotoData = ref(null);

// 分类列表
const categories = ref(['全部', '时尚', '运动', '商务', '艺术', '复古']);

// 获取写真数据
const fetchPhotos = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('/api/photos');
    const result = await response.json();

    if (result.success) {
      photos.value = result.data;
    } else {
      error.value = '加载失败，请稍后重试';
    }
  } catch (err) {
    error.value = '网络错误，请检查连接';
    console.error('获取写真数据失败:', err);
  } finally {
    loading.value = false;
  }
};

// 过滤后的写真列表
const filteredPhotos = computed(() => {
  if (selectedCategory.value === '全部') {
    return photos.value;
  }
  return photos.value.filter(photo => photo.category === selectedCategory.value);
});

// 按分类筛选
const filterByCategory = (category) => {
  selectedCategory.value = category;
};

// 选择写真查看详情
const selectPhoto = (photo) => {
  selectedPhotoData.value = photo;
};

// 关闭详情弹窗
const closeModal = () => {
  selectedPhotoData.value = null;
};

// 组件挂载时获取数据
onMounted(() => {
  fetchPhotos();
});
</script>

<style scoped>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器 - 纯白背景 */
.app {
  min-height: 100vh;
  background: #FFFFFF;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans', 'Source Han Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* ========== 头部样式 ========== */
.header {
  background: #F8F8F8;
  border-bottom: 1px solid #E0E0E0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.site-title {
  font-size: 36px;
  font-weight: 700;
  color: #333333;
  text-align: center;
  letter-spacing: 2px;
}

.nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-btn {
  padding: 10px 24px;
  border: 2px solid #CCCCCC;
  background: #FFFFFF;
  color: #666666;
  font-size: 15px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  border-color: #FFD700;
  color: #333333;
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px rgba(255, 215, 0, 0.2);
}

.nav-btn.active {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-color: #FFD700;
  color: #FFFFFF;
  box-shadow: 0px 4px 12px rgba(255, 215, 0, 0.3);
}

/* ========== 主要内容区 ========== */
.main {
  padding: 48px 32px;
  background: #FFFFFF;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* ========== 加载和错误状态 ========== */
.loading,
.error {
  text-align: center;
  padding: 80px 20px;
  color: #666666;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #E0E0E0;
  border-top-color: #FFD700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p,
.error p {
  font-size: 16px;
  color: #666666;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 12px 32px;
  background: #FFD700;
  color: #333333;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #FFA500;
  transform: translateY(-2px);
  box-shadow: 0px 4px 12px rgba(255, 215, 0, 0.3);
}

/* ========== 写真网格布局 ========== */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
  padding: 16px 0;
}

/* ========== 写真卡片 ========== */
.photo-card {
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.photo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.15);
}

.photo-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 133.33%;
  overflow: hidden;
  background: #F5F5F5;
}

.photo-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-card:hover .photo-image {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
  padding: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-card:hover .photo-overlay {
  opacity: 1;
}

.photo-overlay-content {
  width: 100%;
}

.photo-name {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 6px;
}

.photo-category {
  font-size: 14px;
  color: #FFD700;
  font-weight: 500;
}

/* ========== 卡片信息区 ========== */
.photo-info {
  padding: 20px;
}

.photo-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.photo-desc {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.photo-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: #F5F5F5;
  color: #666666;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #FFD700;
  color: #333333;
  border-color: #FFD700;
}

/* ========== 详情弹窗 ========== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: #FFFFFF;
  border-radius: 8px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0px 12px 48px rgba(0, 0, 0, 0.3);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  font-size: 28px;
  color: #333333;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
}

.modal-close:hover {
  background: #FFD700;
  transform: rotate(90deg);
}

.modal-content {
  display: flex;
  flex-direction: column;
}

.modal-image-wrapper {
  width: 100%;
  max-height: 600px;
  overflow: hidden;
  background: #F5F5F5;
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  padding: 32px;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 12px;
}

.modal-category {
  font-size: 16px;
  color: #FFD700;
  font-weight: 600;
  margin-bottom: 16px;
}

.modal-desc {
  font-size: 16px;
  color: #666666;
  line-height: 1.8;
  margin-bottom: 24px;
}

.modal-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tag-large {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
}

/* ========== 弹窗动画 ========== */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.9);
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 20px 16px;
  }

  .site-title {
    font-size: 28px;
  }

  .nav-btn {
    padding: 8px 16px;
    font-size: 14px;
  }

  .main {
    padding: 32px 16px;
  }

  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }

  .modal-content {
    flex-direction: column;
  }

  .modal-info {
    padding: 24px;
  }

  .modal-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .site-title {
    font-size: 24px;
  }

  .nav {
    gap: 8px;
  }

  .nav-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .photo-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .modal-info {
    padding: 20px;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-close {
    width: 36px;
    height: 36px;
    font-size: 24px;
  }
}
</style>

