<template>
  <div class="random-site-container" :style="containerStyle">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>正在生成网站...</p>
    </div>

    <!-- 网站内容 -->
    <div v-else-if="siteConfig" class="site-content">
      <!-- 顶部导航栏 -->
      <header class="site-header" :style="headerStyle">
        <div class="header-content">
          <h1>{{ siteConfig.content.title }}</h1>
          <p class="subtitle">{{ siteConfig.content.subtitle }}</p>
        </div>
        <div class="header-info">
          <span class="theme-badge" :style="badgeStyle">{{ siteConfig.theme }}</span>
          <span class="layout-badge">{{ siteConfig.layout }}</span>
        </div>
      </header>

      <!-- 网站描述 -->
      <section class="description-section">
        <div class="container">
          <p class="description">{{ siteConfig.description }}</p>
          <div class="countdown">
            <span>距离下次刷新: {{ countdown }}秒</span>
            <button @click="refreshSite" class="refresh-btn" :style="buttonStyle">
              立即刷新
            </button>
          </div>
        </div>
      </section>

      <!-- 特色功能 -->
      <section class="features-section">
        <div class="container">
          <h2 class="section-title">{{ siteConfig.content.sections[0].title }}</h2>
          <div class="features-grid">
            <div
              v-for="(item, index) in siteConfig.content.sections[0].items"
              :key="index"
              class="feature-card"
              :style="cardStyle"
            >
              <div class="feature-icon" :style="iconStyle">✨</div>
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 精选推荐 -->
      <section class="showcase-section" :style="sectionStyle">
        <div class="container">
          <h2 class="section-title">{{ siteConfig.content.sections[1].title }}</h2>
          <div :class="getLayoutClass()">
            <div
              v-for="item in siteConfig.content.sections[1].items"
              :key="item.id"
              class="showcase-card"
              :style="cardStyle"
            >
              <div class="image-wrapper">
                <img :src="item.image" :alt="item.title" />
              </div>
              <div class="card-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
                <button class="action-btn" :style="buttonStyle">了解更多</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 用户评价 -->
      <section class="reviews-section">
        <div class="container">
          <h2 class="section-title">{{ siteConfig.content.sections[2].title }}</h2>
          <div class="reviews-grid">
            <div
              v-for="(item, index) in siteConfig.content.sections[2].items"
              :key="index"
              class="review-card"
              :style="cardStyle"
            >
              <div class="rating">
                <span v-for="n in item.rating" :key="n" class="star" :style="starStyle">★</span>
              </div>
              <p class="comment">"{{ item.comment }}"</p>
              <p class="user">- {{ item.user }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 页脚 -->
      <footer class="site-footer" :style="footerStyle">
        <div class="container">
          <p>{{ siteConfig.content.footer.copyright }}</p>
          <div class="footer-links">
            <a v-for="link in siteConfig.content.footer.links" :key="link" href="#" :style="linkStyle">
              {{ link }}
            </a>
          </div>
        </div>
      </footer>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="refreshSite" class="retry-btn">重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const siteConfig = ref(null);
const loading = ref(false);
const error = ref(null);
const countdown = ref(300); // 5分钟 = 300秒

// 定时器引用
let refreshTimer = null;
let countdownTimer = null;

// 计算样式
const containerStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    backgroundColor: siteConfig.value.colors.bg,
    minHeight: '100vh',
  };
});

const headerStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    background: `linear-gradient(135deg, ${siteConfig.value.colors.primary}, ${siteConfig.value.colors.secondary})`,
    color: '#fff',
  };
});

const badgeStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    backgroundColor: siteConfig.value.colors.accent,
  };
});

const buttonStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    backgroundColor: siteConfig.value.colors.primary,
    color: '#fff',
  };
});

const cardStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    borderColor: siteConfig.value.colors.primary + '33',
  };
});

const iconStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    color: siteConfig.value.colors.primary,
  };
});

const sectionStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    backgroundColor: siteConfig.value.colors.primary + '0a',
  };
});

const footerStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    backgroundColor: siteConfig.value.colors.primary + '22',
  };
});

const starStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    color: siteConfig.value.colors.accent,
  };
});

const linkStyle = computed(() => {
  if (!siteConfig.value) return {};
  return {
    color: siteConfig.value.colors.primary,
  };
});

// 获取布局类名
const getLayoutClass = () => {
  if (!siteConfig.value) return 'grid-layout';

  const layout = siteConfig.value.layout;
  if (layout === '卡片式') return 'card-layout';
  if (layout === '列表式') return 'list-layout';
  if (layout === '瀑布流') return 'masonry-layout';
  if (layout === '网格式') return 'grid-layout';
  if (layout === '杂志式') return 'magazine-layout';
  return 'grid-layout';
};

// 获取网站配置
const fetchSiteConfig = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('/api/random-site');
    const data = await response.json();

    if (data.success) {
      siteConfig.value = data.data;
      resetCountdown();
    } else {
      error.value = data.message || '获取网站配置失败';
    }
  } catch (err) {
    error.value = '网络请求失败: ' + err.message;
  } finally {
    loading.value = false;
  }
};

// 手动刷新网站
const refreshSite = () => {
  fetchSiteConfig();
};

// 重置倒计时
const resetCountdown = () => {
  countdown.value = 300;
};

// 启动定时器
const startTimers = () => {
  // 5分钟刷新定时器
  refreshTimer = setInterval(() => {
    fetchSiteConfig();
  }, 5 * 60 * 1000); // 5分钟

  // 倒计时定时器
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      countdown.value = 300;
    }
  }, 1000); // 1秒
};

// 清除定时器
const clearTimers = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
};

// 生命周期
onMounted(() => {
  fetchSiteConfig();
  startTimers();
});

onUnmounted(() => {
  clearTimers();
});
</script>

<style scoped>
.random-site-container {
  transition: background-color 0.3s ease;
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 头部 */
.site-header {
  padding: 60px 20px;
  text-align: center;
  position: relative;
}

.header-content h1 {
  font-size: 3rem;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.header-info {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.theme-badge, .layout-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.theme-badge {
  color: #fff;
}

.layout-badge {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 描述区域 */
.description-section {
  padding: 40px 20px;
  text-align: center;
}

.description {
  font-size: 1.1rem;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 30px;
  color: #333;
}

.countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.countdown span {
  font-size: 1rem;
  color: #666;
}

/* 按钮 */
.refresh-btn, .action-btn, .retry-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover, .action-btn:hover, .retry-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 区块 */
section {
  padding: 60px 20px;
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin: 0 0 40px 0;
  color: #333;
}

/* 特色功能 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  border: 2px solid;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 布局样式 */
.grid-layout, .card-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.list-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.masonry-layout {
  columns: 3;
  column-gap: 30px;
}

.masonry-layout .showcase-card {
  break-inside: avoid;
  margin-bottom: 30px;
}

.magazine-layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 30px;
}

.magazine-layout .showcase-card:nth-child(1) {
  grid-column: span 8;
}

.magazine-layout .showcase-card:nth-child(2) {
  grid-column: span 4;
}

.magazine-layout .showcase-card:nth-child(3),
.magazine-layout .showcase-card:nth-child(4) {
  grid-column: span 6;
}

.magazine-layout .showcase-card:nth-child(5),
.magazine-layout .showcase-card:nth-child(6) {
  grid-column: span 4;
}

/* 卡片 */
.showcase-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid;
  transition: all 0.3s ease;
}

.list-layout .showcase-card {
  display: flex;
  gap: 20px;
}

.list-layout .image-wrapper {
  flex: 0 0 300px;
}

.showcase-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.showcase-card:hover .image-wrapper img {
  transform: scale(1.05);
}

.card-content {
  padding: 20px;
}

.card-content h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.card-content p {
  color: #666;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

/* 评价 */
.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.review-card {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  border: 2px solid;
  text-align: center;
}

.rating {
  margin-bottom: 15px;
}

.star {
  font-size: 1.5rem;
}

.comment {
  font-style: italic;
  color: #333;
  margin: 0 0 15px 0;
  line-height: 1.6;
}

.user {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

/* 页脚 */
.site-footer {
  padding: 40px 20px;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.footer-links a {
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.footer-links a:hover {
  opacity: 0.7;
}

/* 错误状态 */
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
  padding: 20px;
}

.error p {
  color: #e74c3c;
  font-size: 1.1rem;
}

.retry-btn {
  background-color: #3498db;
  color: #fff;
}

/* 响应式 */
@media (max-width: 768px) {
  .header-content h1 {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .features-grid, .reviews-grid {
    grid-template-columns: 1fr;
  }

  .masonry-layout {
    columns: 1;
  }

  .magazine-layout {
    grid-template-columns: 1fr;
  }

  .magazine-layout .showcase-card {
    grid-column: span 1 !important;
  }

  .list-layout .showcase-card {
    flex-direction: column;
  }

  .list-layout .image-wrapper {
    flex: none;
    width: 100%;
  }
}
</style>
