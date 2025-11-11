<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none">
            <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373Z" fill="currentColor"/>
          </svg>
          <span class="logo-text">哔哩哔哩视频</span>
        </div>
        <div class="header-info">
          <span class="video-count">共 {{ totalVideos }} 个视频</span>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="fetchVideos" class="retry-btn">重试</button>
        </div>

        <!-- 视频列表 -->
        <div v-else class="video-grid">
          <div
            v-for="video in videos"
            :key="video.id"
            class="video-card"
          >
            <!-- 视频封面 -->
            <div class="video-cover">
              <img :src="video.cover" :alt="video.title" />
              <div class="video-duration">{{ video.duration }}</div>
              <div class="video-overlay">
                <div class="play-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- 视频信息 -->
            <div class="video-info">
              <h3 class="video-title">{{ video.title }}</h3>
              <div class="video-meta">
                <div class="author-info">
                  <img :src="video.avatar" :alt="video.author" class="author-avatar" />
                  <span class="author-name">{{ video.author }}</span>
                </div>
                <div class="video-stats">
                  <span class="stat-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                    {{ formatNumber(video.views) }}
                  </span>
                  <span class="stat-item">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {{ formatNumber(video.likes) }}
                  </span>
                </div>
              </div>
              <div class="video-date">{{ video.publishTime }}</div>
            </div>
          </div>
        </div>

        <!-- 加载更多按钮 -->
        <div v-if="!loading && !error && hasMore" class="load-more">
          <button @click="loadMore" class="load-more-btn">
            加载更多
          </button>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p>数据展示仅供参考</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 响应式数据
const videos = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const totalVideos = ref(0);
const hasMore = ref(true);

// 获取视频列表
const fetchVideos = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await axios.get('/api/bilibili/videos', {
      params: {
        page: currentPage.value,
        pageSize: 12
      }
    });

    if (response.data.success) {
      const { videos: newVideos, total, totalPages } = response.data.data;
      videos.value = newVideos;
      totalVideos.value = total;
      hasMore.value = currentPage.value < totalPages;
    } else {
      error.value = '获取视频列表失败';
    }
  } catch (err) {
    console.error('获取视频列表失败:', err);
    error.value = '网络错误，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 加载更多
const loadMore = async () => {
  try {
    currentPage.value += 1;
    const response = await axios.get('/api/bilibili/videos', {
      params: {
        page: currentPage.value,
        pageSize: 12
      }
    });

    if (response.data.success) {
      const { videos: newVideos, totalPages } = response.data.data;
      videos.value = [...videos.value, ...newVideos];
      hasMore.value = currentPage.value < totalPages;
    }
  } catch (err) {
    console.error('加载更多失败:', err);
  }
};

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toString();
};

// 组件挂载时获取数据
onMounted(() => {
  fetchVideos();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F5F5F5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'HarmonyOS Sans', sans-serif;
}

/* 顶部导航栏 */
.header {
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: #00A1D6;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.video-count {
  font-size: 14px;
  color: #666666;
}

/* 主内容区 */
.main-content {
  padding: 32px 0;
  min-height: calc(100vh - 140px);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #666666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #E0F7FA;
  border-top-color: #00A1D6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误状态 */
.error {
  text-align: center;
  padding: 80px 20px;
  color: #666666;
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: #00A1D6;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #0090C0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 161, 214, 0.3);
}

/* 视频网格 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* 视频卡片 */
.video-card {
  background: #FFFFFF;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* 视频封面 */
.video-cover {
  position: relative;
  padding-top: 62.5%;
  overflow: hidden;
  background: #F0F0F0;
}

.video-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .video-cover img {
  transform: scale(1.05);
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #FFFFFF;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .video-overlay {
  opacity: 1;
}

.play-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00A1D6;
  transform: scale(0.9);
  transition: transform 0.3s ease;
}

.video-card:hover .play-icon {
  transform: scale(1);
}

.play-icon svg {
  width: 24px;
  height: 24px;
  margin-left: 3px;
}

/* 视频信息 */
.video-info {
  padding: 12px;
}

.video-title {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
}

.video-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.author-name {
  font-size: 12px;
  color: #666666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999999;
}

.stat-item svg {
  width: 14px;
  height: 14px;
}

.video-date {
  font-size: 12px;
  color: #999999;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 32px 0;
}

.load-more-btn {
  padding: 12px 48px;
  background: #FFFFFF;
  color: #00A1D6;
  border: 2px solid #00A1D6;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: #00A1D6;
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 161, 214, 0.3);
}

/* 页脚 */
.footer {
  background: #FFFFFF;
  padding: 24px;
  text-align: center;
  color: #999999;
  font-size: 14px;
  border-top: 1px solid #E0E0E0;
}

/* 响应式布局 - 平板 */
@media (max-width: 768px) {
  .header-container {
    padding: 12px 16px;
  }

  .logo-text {
    font-size: 18px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .main-content {
    padding: 20px 0;
  }

  .container {
    padding: 0 16px;
  }

  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .video-title {
    font-size: 13px;
  }
}

/* 响应式布局 - 手机 */
@media (max-width: 480px) {
  .header-container {
    padding: 10px 12px;
  }

  .logo-text {
    display: none;
  }

  .video-count {
    font-size: 12px;
  }

  .main-content {
    padding: 16px 0;
  }

  .container {
    padding: 0 12px;
  }

  .video-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .video-card {
    border-radius: 6px;
  }

  .video-info {
    padding: 10px;
  }

  .video-title {
    font-size: 13px;
    height: 38px;
  }

  .load-more-btn {
    padding: 10px 36px;
    font-size: 13px;
  }
}
</style>
