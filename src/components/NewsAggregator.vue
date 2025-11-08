<template>
  <div class="news-aggregator">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="container">
        <h1 class="logo">🌍 全球新闻聚合</h1>
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索新闻..."
            @input="handleSearch"
            class="search-input"
          />
          <button @click="handleSearch" class="search-btn">🔍</button>
        </div>
      </div>
    </header>

    <!-- 分类导航 -->
    <nav class="categories">
      <div class="container">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-btn', { active: selectedCategory === category.id }]"
          @click="selectCategory(category.id)"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>
    </nav>

    <!-- 新闻列表 -->
    <main class="main-content">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>正在加载新闻...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="fetchNews" class="retry-btn">重试</button>
        </div>

        <!-- 新闻网格 -->
        <div v-else class="news-grid">
          <article
            v-for="article in filteredNews"
            :key="article.id"
            class="news-card"
          >
            <div class="news-image" v-if="article.image">
              <img :src="article.image" :alt="article.title" />
              <span class="news-source">{{ article.source }}</span>
            </div>
            <div class="news-content">
              <div class="news-meta">
                <span class="category-tag">{{ article.category }}</span>
                <span class="news-time">{{ formatTime(article.publishedAt) }}</span>
              </div>
              <h2 class="news-title">{{ article.title }}</h2>
              <p class="news-description">{{ article.description }}</p>
              <div class="news-footer">
                <span class="news-author" v-if="article.author">✍️ {{ article.author }}</span>
                <a :href="article.url" target="_blank" class="read-more">阅读全文 →</a>
              </div>
            </div>
          </article>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && !error && filteredNews.length === 0" class="empty-state">
          <p>📭 暂无新闻</p>
        </div>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <p>© 2025 全球新闻聚合 | 实时获取全球资讯</p>
        <p class="update-time">最后更新: {{ lastUpdateTime }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'NewsAggregator',
  setup() {
    const news = ref([])
    const loading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const selectedCategory = ref('all')
    const lastUpdateTime = ref('')

    const categories = [
      { id: 'all', name: '全部', icon: '🌐' },
      { id: 'technology', name: '科技', icon: '💻' },
      { id: 'business', name: '商业', icon: '💼' },
      { id: 'sports', name: '体育', icon: '⚽' },
      { id: 'entertainment', name: '娱乐', icon: '🎬' },
      { id: 'health', name: '健康', icon: '🏥' },
      { id: 'science', name: '科学', icon: '🔬' },
    ]

    // 过滤新闻
    const filteredNews = computed(() => {
      let result = news.value

      // 分类过滤
      if (selectedCategory.value !== 'all') {
        result = result.filter(item => item.category === selectedCategory.value)
      }

      // 搜索过滤
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.author && item.author.toLowerCase().includes(query))
        )
      }

      return result
    })

    // 格式化时间
    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = Math.floor((now - date) / 1000) // 秒

      if (diff < 60) return '刚刚'
      if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
      if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
      if (diff < 604800) return `${Math.floor(diff / 86400)}天前`

      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // 获取新闻
    const fetchNews = async () => {
      loading.value = true
      error.value = null

      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('获取新闻失败')
        }
        const data = await response.json()
        news.value = data.news || []
        lastUpdateTime.value = new Date().toLocaleString('zh-CN')
      } catch (err) {
        error.value = err.message
        console.error('获取新闻错误:', err)
      } finally {
        loading.value = false
      }
    }

    // 选择分类
    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId
    }

    // 搜索处理
    const handleSearch = () => {
      // 搜索逻辑已在 computed 中处理
    }

    // 组件挂载时获取新闻
    onMounted(() => {
      fetchNews()
      // 每5分钟自动刷新
      setInterval(fetchNews, 300000)
    })

    return {
      news,
      loading,
      error,
      searchQuery,
      selectedCategory,
      categories,
      filteredNews,
      lastUpdateTime,
      formatTime,
      fetchNews,
      selectCategory,
      handleSearch
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.news-aggregator {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 顶部导航 */
.header {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #e0e0e0;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  white-space: nowrap;
}

.search-bar {
  display: flex;
  gap: 10px;
  flex: 1;
  max-width: 500px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
  background: #ffffff;
  color: #333;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  padding: 12px 20px;
  background: #667eea;
  border: 1px solid #667eea;
  border-radius: 25px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

/* 分类导航 */
.categories {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px 0;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e0e0e0;
}

.categories .container {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 5px 0;
}

.category-btn {
  padding: 10px 20px;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  color: #333;
}

.category-btn:hover {
  border-color: #667eea;
  background: #f0f0f0;
  transform: translateY(-2px);
}

.category-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

/* 主内容 */
.main-content {
  padding: 20px 0 40px;
  min-height: 60vh;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 60px 20px;
  color: #333;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 错误状态 */
.error {
  text-align: center;
  padding: 60px 20px;
  color: #dc3545;
}

.error p {
  font-size: 18px;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 12px 30px;
  background: #667eea;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
  font-size: 18px;
}

/* 新闻网格 */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.news-card {
  background: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.news-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-source {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
}

.news-content {
  padding: 20px;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.category-tag {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #667eea;
}

.news-time {
  color: #999;
  font-size: 12px;
}

.news-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.news-author {
  color: #999;
  font-size: 13px;
}

.read-more {
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s;
}

.read-more:hover {
  color: #5568d3;
  transform: translateX(5px);
}

/* 底部 */
.footer {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px 0;
  text-align: center;
  color: #666;
  margin-top: 40px;
  border-top: 1px solid #e0e0e0;
}

.footer p {
  margin: 5px 0;
  font-size: 14px;
}

.update-time {
  color: #999;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
  }

  .logo {
    font-size: 20px;
  }

  .search-bar {
    width: 100%;
    max-width: 100%;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .categories .container {
    gap: 8px;
  }

  .category-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
