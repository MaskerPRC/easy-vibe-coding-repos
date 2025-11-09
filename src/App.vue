<template>
  <div class="google-search">
    <div class="search-container" :class="{ 'has-results': searchResults.length > 0 }">
      <div class="logo-container">
        <h1 class="google-logo">Google</h1>
      </div>

      <div class="search-box-container">
        <div class="search-box">
          <svg class="search-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            placeholder="输入搜索内容..."
            class="search-input"
            ref="searchInput"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">×</button>
        </div>

        <div class="search-buttons">
          <button @click="performSearch" class="search-btn">Google 搜索</button>
          <button @click="luckySearch" class="search-btn">手气不错</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>搜索中...</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="searchResults.length > 0" class="results-container">
      <div class="results-stats">
        找到约 {{ totalResults }} 条结果（用时 {{ searchTime }} 秒）
      </div>

      <div class="results-list">
        <div v-for="(result, index) in searchResults" :key="index" class="result-item">
          <div class="result-url">{{ result.displayLink || result.link }}</div>
          <a :href="result.link" target="_blank" class="result-title">{{ result.title }}</a>
          <div class="result-snippet" v-html="result.snippet"></div>
        </div>
      </div>

      <div v-if="hasMoreResults" class="pagination">
        <button @click="loadMore" class="load-more-btn">加载更多结果</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const loading = ref(false);
const error = ref('');
const totalResults = ref(0);
const searchTime = ref(0);
const hasMoreResults = ref(false);
const currentPage = ref(1);
const searchInput = ref(null);

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    return;
  }

  loading.value = true;
  error.value = '';
  searchResults.value = [];
  currentPage.value = 1;

  try {
    const startTime = performance.now();
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: searchQuery.value,
        page: currentPage.value
      })
    });

    const data = await response.json();
    const endTime = performance.now();
    searchTime.value = ((endTime - startTime) / 1000).toFixed(2);

    if (data.success) {
      searchResults.value = data.results || [];
      totalResults.value = data.totalResults || 0;
      hasMoreResults.value = data.hasMore || false;
    } else {
      error.value = data.error || '搜索失败';
    }
  } catch (err) {
    error.value = '搜索请求失败: ' + err.message;
    console.error('搜索失败:', err);
  } finally {
    loading.value = false;
  }
};

const luckySearch = async () => {
  if (!searchQuery.value.trim()) {
    return;
  }

  performSearch();
  // 如果有结果，自动打开第一个链接
  setTimeout(() => {
    if (searchResults.value.length > 0) {
      window.open(searchResults.value[0].link, '_blank');
    }
  }, 1000);
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  error.value = '';
  searchInput.value?.focus();
};

const loadMore = async () => {
  if (!hasMoreResults.value || loading.value) {
    return;
  }

  currentPage.value++;
  loading.value = true;

  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: searchQuery.value,
        page: currentPage.value
      })
    });

    const data = await response.json();

    if (data.success) {
      searchResults.value = [...searchResults.value, ...(data.results || [])];
      hasMoreResults.value = data.hasMore || false;
    }
  } catch (err) {
    error.value = '加载更多结果失败: ' + err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  searchInput.value?.focus();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.google-search {
  min-height: 100vh;
  background: #fff;
  font-family: Arial, sans-serif;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 140px;
  transition: padding-top 0.3s;
}

.search-container.has-results {
  padding-top: 30px;
}

.logo-container {
  margin-bottom: 30px;
}

.google-logo {
  font-size: 90px;
  font-weight: 400;
  color: #4285f4;
  margin: 0;
  font-family: 'Product Sans', Arial, sans-serif;
  letter-spacing: -2px;
}

.search-container.has-results .google-logo {
  font-size: 32px;
}

.search-box-container {
  width: 100%;
  max-width: 584px;
  padding: 0 20px;
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  padding: 10px 16px;
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  transition: box-shadow 0.2s;
}

.search-box:hover,
.search-box:focus-within {
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.4);
  border-color: rgba(223, 225, 229, 0);
}

.search-icon {
  width: 20px;
  height: 20px;
  fill: #9aa0a6;
  margin-right: 12px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #202124;
  background: transparent;
}

.clear-btn {
  background: transparent;
  border: none;
  font-size: 24px;
  color: #70757a;
  cursor: pointer;
  padding: 0 8px;
  line-height: 1;
}

.clear-btn:hover {
  color: #202124;
}

.search-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.search-btn {
  background-color: #f8f9fa;
  border: 1px solid #f8f9fa;
  border-radius: 4px;
  color: #3c4043;
  font-size: 14px;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.1s;
}

.search-btn:hover {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
  border: 1px solid #dadce0;
  color: #202124;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4285f4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin-top: 16px;
  color: #70757a;
  font-size: 14px;
}

.error-message {
  max-width: 652px;
  margin: 40px auto;
  padding: 20px;
  background: #fce8e6;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  color: #d93025;
  text-align: center;
}

.results-container {
  max-width: 652px;
  margin: 0 auto;
  padding: 20px;
}

.results-stats {
  color: #70757a;
  font-size: 14px;
  margin-bottom: 20px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.result-item {
  display: flex;
  flex-direction: column;
}

.result-url {
  font-size: 14px;
  color: #202124;
  margin-bottom: 4px;
  line-height: 1.3;
}

.result-title {
  font-size: 20px;
  color: #1a0dab;
  text-decoration: none;
  line-height: 1.3;
  margin-bottom: 4px;
  display: inline-block;
}

.result-title:hover {
  text-decoration: underline;
}

.result-title:visited {
  color: #681da8;
}

.result-snippet {
  font-size: 14px;
  color: #4d5156;
  line-height: 1.58;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding: 20px 0;
}

.load-more-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.load-more-btn:hover {
  background-color: #357ae8;
}

@media (max-width: 768px) {
  .search-container {
    padding-top: 80px;
  }

  .google-logo {
    font-size: 60px;
  }

  .search-container.has-results {
    padding-top: 20px;
  }

  .search-container.has-results .google-logo {
    font-size: 28px;
  }

  .results-container {
    padding: 12px;
  }
}
</style>

