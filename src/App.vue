<template>
  <div class="app">
    <!-- 导航栏 -->
    <NavBar
      :categories="categories"
      :activeCategory="activeCategory"
      @category-change="handleCategoryChange"
      @search="handleSearch"
    />

    <!-- 主要内容区 -->
    <div class="main-container">
      <div class="content-wrapper">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-container">
          <p class="error-text">{{ error }}</p>
          <button class="retry-btn" @click="fetchNews">重试</button>
        </div>

        <!-- 新闻列表 -->
        <div v-else class="news-list">
          <NewsCard
            v-for="news in newsList"
            :key="news.id"
            :news="news"
            @click="handleNewsClick"
          />

          <!-- 空状态 -->
          <div v-if="newsList.length === 0" class="empty-container">
            <p class="empty-text">暂无新闻</p>
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore && newsList.length > 0" class="load-more">
            <button
              class="load-more-btn"
              @click="loadMore"
              :disabled="loadingMore"
            >
              {{ loadingMore ? '加载中...' : '加载更多' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 百度新闻. All rights reserved.</p>
        <p class="footer-links">
          <a href="#">关于我们</a>
          <span class="separator">|</span>
          <a href="#">联系方式</a>
          <span class="separator">|</span>
          <a href="#">隐私政策</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavBar from './components/NavBar.vue';
import NewsCard from './components/NewsCard.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    NewsCard
  },
  setup() {
    const categories = ref([]);
    const activeCategory = ref('all');
    const newsList = ref([]);
    const loading = ref(false);
    const loadingMore = ref(false);
    const error = ref(null);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const hasMore = ref(true);

    // 获取分类列表
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        if (response.data.success) {
          categories.value = response.data.data;
        }
      } catch (err) {
        console.error('获取分类失败:', err);
      }
    };

    // 获取新闻列表
    const fetchNews = async (reset = false) => {
      try {
        if (reset) {
          currentPage.value = 1;
          loading.value = true;
        } else {
          loadingMore.value = true;
        }

        error.value = null;

        const response = await axios.get('/api/news', {
          params: {
            category: activeCategory.value,
            page: currentPage.value,
            pageSize: pageSize.value
          }
        });

        if (response.data.success) {
          const { data, total: totalCount } = response.data;

          if (reset) {
            newsList.value = data;
          } else {
            newsList.value = [...newsList.value, ...data];
          }

          total.value = totalCount;
          hasMore.value = newsList.value.length < totalCount;
        }
      } catch (err) {
        console.error('获取新闻失败:', err);
        error.value = '获取新闻失败，请稍后重试';
      } finally {
        loading.value = false;
        loadingMore.value = false;
      }
    };

    // 处理分类切换
    const handleCategoryChange = (categoryId) => {
      activeCategory.value = categoryId;
      fetchNews(true);
    };

    // 处理搜索
    const handleSearch = (keyword) => {
      console.log('搜索:', keyword);
      // 这里可以实现搜索功能
      // 暂时使用简单的客户端过滤
      alert(`搜索功能开发中: "${keyword}"`);
    };

    // 处理新闻点击
    const handleNewsClick = (news) => {
      console.log('点击新闻:', news);
      alert(`查看新闻详情: ${news.title}\n\n${news.summary}`);
    };

    // 加载更多
    const loadMore = () => {
      currentPage.value += 1;
      fetchNews(false);
    };

    // 初始化
    onMounted(() => {
      fetchCategories();
      fetchNews(true);
    });

    return {
      categories,
      activeCategory,
      newsList,
      loading,
      loadingMore,
      error,
      hasMore,
      handleCategoryChange,
      handleSearch,
      handleNewsClick,
      loadMore,
      fetchNews
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

/* 主要内容区 */
.main-container {
  flex: 1;
  padding: 24px 0;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #E5E5E5;
  border-top-color: #4065D4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: #666666;
}

/* 错误状态 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.error-text {
  font-size: 16px;
  color: #CC0000;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 24px;
  background-color: #4065D4;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #2545B8;
}

/* 新闻列表 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 空状态 */
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-text {
  font-size: 16px;
  color: #999999;
}

/* 加载更多 */
.load-more {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.load-more-btn {
  padding: 12px 32px;
  background-color: #FFFFFF;
  color: #4065D4;
  border: 2px solid #4065D4;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more-btn:hover:not(:disabled) {
  background-color: #4065D4;
  color: #FFFFFF;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 页脚 */
.footer {
  background-color: #333333;
  color: #FFFFFF;
  padding: 32px 20px;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-content p {
  margin: 8px 0;
  font-size: 14px;
  color: #CCCCCC;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer-links a {
  color: #CCCCCC;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #4065D4;
}

.separator {
  color: #666666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-container {
    padding: 16px 0;
  }

  .content-wrapper {
    padding: 0 16px;
  }

  .news-list {
    gap: 12px;
  }

  .footer {
    padding: 24px 16px;
  }

  .footer-links {
    flex-direction: column;
    gap: 4px;
  }

  .separator {
    display: none;
  }
}
</style>
