<template>
  <div class="search-results-page">
    <!-- 顶部搜索栏 -->
    <header class="search-header">
      <div class="header-content">
        <!-- Google Logo -->
        <div class="header-logo" @click="goHome">
          <span class="logo-g">G</span>
          <span class="logo-o1">o</span>
          <span class="logo-o2">o</span>
          <span class="logo-g2">g</span>
          <span class="logo-l">l</span>
          <span class="logo-e">e</span>
        </div>

        <!-- 搜索框 -->
        <div class="header-search">
          <div class="header-search-input-wrapper">
            <svg class="search-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="header-search-input"
              @keyup.enter="handleSearch"
              autocomplete="off"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- 搜索结果内容 -->
    <main class="results-main">
      <div class="results-container">
        <!-- 结果统计 -->
        <div class="results-stats" v-if="!loading && results.length > 0">
          找到约 {{ totalResults.toLocaleString() }} 条结果 （用时 {{ searchTime }} 秒）
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <div>搜索中...</div>
        </div>

        <!-- 搜索结果列表 -->
        <div v-else-if="results.length > 0" class="results-list">
          <div v-for="(result, index) in results" :key="index" class="result-item">
            <div class="result-url">{{ result.url }}</div>
            <a :href="result.link" class="result-title" target="_blank">{{ result.title }}</a>
            <div class="result-description">{{ result.description }}</div>
          </div>
        </div>

        <!-- 无结果 -->
        <div v-else class="no-results">
          <p>找不到和您查询的"<strong>{{ currentQuery }}</strong>"相符的内容或信息。</p>
          <p class="no-results-suggestions">建议：</p>
          <ul class="no-results-list">
            <li>请检查输入字词有无错误</li>
            <li>请尝试其他查询词</li>
            <li>请尝试较常见的字词</li>
          </ul>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="results-footer">
      <div class="footer-country">中国</div>
      <div class="footer-links">
        <div class="footer-left">
          <a href="#">关于</a>
          <a href="#">广告</a>
          <a href="#">商务</a>
        </div>
        <div class="footer-right">
          <a href="#">隐私权</a>
          <a href="#">条款</a>
          <a href="#">设置</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const searchQuery = ref('');
const currentQuery = ref('');
const results = ref([]);
const totalResults = ref(0);
const searchTime = ref(0);
const loading = ref(false);

// 执行搜索
const performSearch = async (query) => {
  if (!query || !query.trim()) return;

  loading.value = true;
  currentQuery.value = query;
  searchQuery.value = query;

  try {
    const startTime = Date.now();
    const response = await axios.get('/api/search', {
      params: { q: query }
    });
    const endTime = Date.now();

    results.value = response.data.results || [];
    totalResults.value = response.data.total || 0;
    searchTime.value = ((endTime - startTime) / 1000).toFixed(2);
  } catch (error) {
    console.error('搜索失败:', error);
    results.value = [];
    totalResults.value = 0;
  } finally {
    loading.value = false;
  }
};

// 处理新搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    });
  }
};

// 返回首页
const goHome = () => {
  router.push('/');
};

// 监听路由变化
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    performSearch(newQuery);
  }
}, { immediate: true });

onMounted(() => {
  const query = route.query.q;
  if (query) {
    performSearch(query);
  }
});
</script>

<style scoped>
.search-results-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: arial, sans-serif;
}

/* 顶部搜索栏 */
.search-header {
  border-bottom: 1px solid #ebebeb;
  padding: 20px 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-logo {
  font-size: 32px;
  font-weight: 400;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.logo-g {
  color: #4285f4;
}

.logo-o1 {
  color: #ea4335;
}

.logo-o2 {
  color: #fbbc04;
}

.logo-g2 {
  color: #4285f4;
}

.logo-l {
  color: #34a853;
}

.logo-e {
  color: #ea4335;
}

.header-search {
  flex: 1;
  max-width: 690px;
}

.header-search-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  padding: 0 14px;
  height: 44px;
  transition: box-shadow 0.2s;
}

.header-search-input-wrapper:hover,
.header-search-input-wrapper:focus-within {
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  border-color: rgba(223, 225, 229, 0);
}

.search-icon {
  width: 20px;
  height: 20px;
  fill: #9aa0a6;
  margin-right: 13px;
  flex-shrink: 0;
}

.header-search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #202124;
  background: transparent;
  font-family: arial, sans-serif;
}

/* 搜索结果内容 */
.results-main {
  flex: 1;
  padding: 20px;
}

.results-container {
  max-width: 650px;
  margin: 0 auto;
  padding-left: 165px;
}

.results-stats {
  color: #70757a;
  font-size: 14px;
  margin-bottom: 26px;
}

/* 加载中 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #70757a;
  font-size: 14px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 搜索结果列表 */
.results-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-url {
  color: #202124;
  font-size: 14px;
  line-height: 20px;
}

.result-title {
  color: #1a0dab;
  font-size: 20px;
  line-height: 26px;
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
}

.result-title:hover {
  text-decoration: underline;
}

.result-title:visited {
  color: #681da8;
}

.result-description {
  color: #4d5156;
  font-size: 14px;
  line-height: 22px;
  max-width: 600px;
}

/* 无结果 */
.no-results {
  padding: 40px 0;
  color: #202124;
}

.no-results p {
  margin-bottom: 20px;
  line-height: 22px;
}

.no-results-suggestions {
  font-weight: bold;
  margin-top: 30px;
}

.no-results-list {
  margin-left: 20px;
  line-height: 26px;
  color: #70757a;
}

/* 页脚 */
.results-footer {
  background-color: #f2f2f2;
  margin-top: auto;
}

.footer-country {
  padding: 15px 30px;
  border-bottom: 1px solid #dadce0;
  font-size: 15px;
  color: #70757a;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  flex-wrap: wrap;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 27px;
  padding: 15px;
}

.results-footer a {
  color: #70757a;
  text-decoration: none;
  font-size: 14px;
}

.results-footer a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .header-logo {
    font-size: 28px;
    text-align: center;
  }

  .header-search {
    max-width: 100%;
  }

  .results-container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .footer-links {
    flex-direction: column;
  }

  .footer-left,
  .footer-right {
    justify-content: center;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .header-logo {
    font-size: 24px;
  }

  .result-title {
    font-size: 18px;
  }
}
</style>
