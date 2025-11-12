<template>
  <div class="search-page">
    <div class="header">
      <div class="header-content">
        <div class="logo" @click="goHome">百度搜索</div>
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="请输入搜索内容"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">搜索</button>
        </div>
      </div>
    </div>

    <div class="results-container">
      <div v-if="loading" class="loading">搜索中...</div>

      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else-if="results.length === 0" class="no-results">
        <p>未找到相关结果</p>
        <p class="tip">建议：</p>
        <ul class="tips">
          <li>检查输入的文字是否有误</li>
          <li>尝试使用其他关键词</li>
          <li>使用更通用的关键词</li>
        </ul>
      </div>

      <div v-else class="results">
        <div class="results-info">
          找到约 {{ totalResults }} 条相关结果（用时 {{ searchTime }} 秒）
        </div>

        <div
          v-for="(result, index) in results"
          :key="index"
          class="result-item"
        >
          <h3 class="result-title">
            <a :href="result.url" target="_blank">{{ result.title }}</a>
          </h3>
          <p class="result-url">{{ result.url }}</p>
          <p class="result-description">{{ result.description }}</p>
        </div>

        <div class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          <span class="page-info">第 {{ currentPage }} 页</span>
          <button
            class="page-btn"
            :disabled="currentPage * 10 >= totalResults"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const results = ref([])
const loading = ref(false)
const error = ref('')
const totalResults = ref(0)
const searchTime = ref(0)
const currentPage = ref(1)

const fetchSearchResults = async () => {
  const query = route.query.q
  if (!query) {
    router.push('/')
    return
  }

  searchQuery.value = query
  loading.value = true
  error.value = ''

  try {
    const startTime = Date.now()
    const response = await axios.get('/api/search', {
      params: {
        q: query,
        page: currentPage.value
      }
    })

    const endTime = Date.now()
    searchTime.value = ((endTime - startTime) / 1000).toFixed(2)

    results.value = response.data.results
    totalResults.value = response.data.total
  } catch (err) {
    error.value = '搜索失败，请稍后重试'
    console.error('搜索错误:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    currentPage.value = 1
    router.push({
      name: 'search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const goHome = () => {
  router.push('/')
}

const changePage = (page) => {
  currentPage.value = page
  fetchSearchResults()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => route.query.q, () => {
  if (route.name === 'search') {
    currentPage.value = 1
    fetchSearchResults()
  }
})

onMounted(() => {
  fetchSearchResults()
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #fff;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #2932e1;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.search-box {
  flex: 1;
  display: flex;
  gap: 10px;
  max-width: 600px;
}

.search-input {
  flex: 1;
  height: 40px;
  padding: 0 15px;
  font-size: 15px;
  border: 1px solid #c4c7ce;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #4e6ef2;
  box-shadow: 0 0 0 2px rgba(78, 110, 242, 0.1);
}

.search-btn {
  height: 40px;
  padding: 0 25px;
  background: #4e6ef2;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.search-btn:hover {
  background: #3d5ee1;
}

.results-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.loading,
.error,
.no-results {
  text-align: center;
  padding: 60px 20px;
  font-size: 16px;
  color: #666;
}

.no-results .tip {
  margin-top: 30px;
  font-weight: 600;
  color: #333;
}

.tips {
  margin-top: 15px;
  text-align: left;
  display: inline-block;
  list-style-position: inside;
}

.tips li {
  margin: 8px 0;
}

.results-info {
  font-size: 14px;
  color: #999;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.result-item {
  margin-bottom: 30px;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s;
}

.result-item:hover {
  background: #f9f9f9;
}

.result-title {
  margin-bottom: 8px;
}

.result-title a {
  color: #1a0dab;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.result-title a:hover {
  text-decoration: underline;
  color: #4e6ef2;
}

.result-url {
  color: #006621;
  font-size: 14px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-description {
  color: #545454;
  font-size: 15px;
  line-height: 1.6;
}

.pagination {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.page-btn {
  padding: 10px 20px;
  background: #4e6ef2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #3d5ee1;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 15px;
  color: #666;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .logo {
    font-size: 20px;
    text-align: center;
  }

  .search-box {
    max-width: 100%;
  }

  .results-container {
    padding: 20px 15px;
  }

  .result-title a {
    font-size: 18px;
  }

  .result-description {
    font-size: 14px;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
