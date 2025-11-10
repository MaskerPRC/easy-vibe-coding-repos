<template>
  <div class="cat-gallery">
    <!-- 头部 -->
    <header class="header">
      <div class="header-content">
        <h1 class="title">猫图站</h1>
        <p class="subtitle">可爱的猫咪图片集合</p>
      </div>
      <div class="header-actions">
        <router-link to="/search" class="nav-link">360搜索</router-link>
        <button @click="loadCats" class="refresh-btn" :disabled="loading">
          {{ loading ? '加载中...' : '换一批' }}
        </button>
      </div>
    </header>

    <!-- 加载状态 -->
    <div v-if="loading && cats.length === 0" class="loading">
      <div class="loader"></div>
      <p>正在加载猫咪图片...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadCats" class="retry-btn">重试</button>
    </div>

    <!-- 猫图网格 -->
    <div v-if="!loading || cats.length > 0" class="gallery-grid">
      <div v-for="cat in cats" :key="cat.id" class="cat-card">
        <div class="image-wrapper">
          <img :src="cat.url" :alt="cat.breed || '可爱的猫咪'" @load="onImageLoad" />
          <div class="overlay">
            <button @click="likeCat(cat.id)" class="like-btn" :class="{ liked: cat.liked }">
              {{ cat.liked ? '❤️' : '🤍' }}
            </button>
          </div>
        </div>
        <div class="cat-info">
          <p class="cat-breed">{{ cat.breed || '猫咪' }}</p>
          <p class="cat-likes">{{ cat.likes || 0 }} 喜欢</p>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="cats.length > 0 && !loading" class="load-more">
      <button @click="loadMoreCats" class="load-more-btn">加载更多</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const cats = ref([]);
const loading = ref(false);
const error = ref('');
const page = ref(1);

// 加载猫图
const loadCats = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.get('/api/cats');
    cats.value = response.data.cats || [];
    page.value = 1;
  } catch (err) {
    error.value = '加载失败，请稍后重试';
    console.error('加载猫图失败:', err);
  } finally {
    loading.value = false;
  }
};

// 加载更多猫图
const loadMoreCats = async () => {
  loading.value = true;

  try {
    const response = await axios.get(`/api/cats?page=${page.value + 1}`);
    cats.value = [...cats.value, ...(response.data.cats || [])];
    page.value += 1;
  } catch (err) {
    error.value = '加载失败，请稍后重试';
    console.error('加载更多猫图失败:', err);
  } finally {
    loading.value = false;
  }
};

// 喜欢猫咪
const likeCat = async (catId) => {
  const cat = cats.value.find(c => c.id === catId);
  if (!cat) return;

  cat.liked = !cat.liked;
  cat.likes = (cat.likes || 0) + (cat.liked ? 1 : -1);

  try {
    await axios.post('/api/cats/like', { catId, liked: cat.liked });
  } catch (err) {
    console.error('点赞失败:', err);
  }
};

// 图片加载完成
const onImageLoad = (event) => {
  event.target.classList.add('loaded');
};

// 页面加载时获取猫图
onMounted(() => {
  loadCats();
});
</script>

<style scoped>
.cat-gallery {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  color: white;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.nav-link {
  padding: 12px 24px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  display: inline-block;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.refresh-btn {
  padding: 12px 32px;
  font-size: 16px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  color: white;
  padding: 60px 20px;
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  color: white;
  padding: 40px 20px;
}

.error p {
  font-size: 18px;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 10px 24px;
  font-size: 16px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.cat-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.cat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f0f0f0;
  overflow: hidden;
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-wrapper img.loaded {
  opacity: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-wrapper:hover .overlay {
  opacity: 1;
}

.like-btn {
  width: 60px;
  height: 60px;
  font-size: 30px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.like-btn:hover {
  transform: scale(1.1);
}

.like-btn.liked {
  animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.cat-info {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cat-breed {
  font-weight: bold;
  color: #333;
  margin: 0;
  font-size: 16px;
}

.cat-likes {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.load-more {
  text-align: center;
  padding: 40px 20px;
}

.load-more-btn {
  padding: 14px 40px;
  font-size: 16px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .title {
    font-size: 36px;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
    padding: 10px;
  }
}
</style>
