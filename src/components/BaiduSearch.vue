<template>
  <div class="baidu-search">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="baidu-logo">百度一下</div>
      <div class="search-box-container">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="请输入搜索内容"
            @keyup.enter="performSearch"
          />
          <button class="search-button" @click="performSearch">
            <span>百度一下</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">搜索中...</div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 搜索结果 -->
    <div v-if="!loading && searchResults.length > 0" class="search-results">
      <div class="results-info">
        找到约 {{ totalResults }} 条结果 (按优先级倒序显示)
      </div>

      <div
        v-for="(result, index) in searchResults"
        :key="index"
        class="result-item"
      >
        <div class="result-header">
          <a :href="result.url" target="_blank" class="result-title">
            {{ result.title }}
          </a>
          <span class="result-priority">优先级: {{ result.priority }}</span>
        </div>
        <div class="result-url">{{ result.displayUrl }}</div>
        <div class="result-snippet">{{ result.snippet }}</div>
      </div>
    </div>

    <!-- 无结果提示 -->
    <div v-if="!loading && searched && searchResults.length === 0" class="no-results">
      <div class="no-results-icon">😕</div>
      <div class="no-results-text">抱歉，没有找到相关结果</div>
      <div class="no-results-hint">建议：</div>
      <ul class="no-results-suggestions">
        <li>检查输入的关键词是否有误</li>
        <li>尝试更换关键词</li>
        <li>使用更简洁的关键词</li>
      </ul>
    </div>

    <!-- 初始状态 -->
    <div v-if="!loading && !searched" class="initial-state">
      <div class="initial-icon">🔍</div>
      <div class="initial-text">在上方输入关键词开始搜索</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const searchQuery = ref('');
const searchResults = ref([]);
const loading = ref(false);
const error = ref('');
const searched = ref(false);
const totalResults = ref(0);

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    error.value = '请输入搜索内容';
    return;
  }

  loading.value = true;
  error.value = '';
  searched.value = true;
  searchResults.value = [];

  try {
    const response = await axios.get('/api/search', {
      params: {
        q: searchQuery.value.trim()
      }
    });

    if (response.data.success) {
      searchResults.value = response.data.results;
      totalResults.value = response.data.total || searchResults.value.length;
    } else {
      error.value = response.data.message || '搜索失败，请稍后重试';
    }
  } catch (err) {
    console.error('搜索错误:', err);
    error.value = '搜索失败，请检查网络连接后重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.baidu-search {
  width: 100%;
  min-height: 100%;
  background: #ffffff;
  color: #333;
}

/* 搜索头部 */
.search-header {
  background: #ffffff;
  padding: 30px 0;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
  position: sticky;
  top: 0;
  z-index: 100;
}

.baidu-logo {
  font-size: 42px;
  font-weight: bold;
  color: #2932e1;
  margin-bottom: 25px;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(41, 50, 225, 0.2);
}

.search-box-container {
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.search-box {
  display: flex;
  width: 100%;
  max-width: 650px;
  height: 44px;
  border: 2px solid #c4c7ce;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-box:focus-within {
  border-color: #4e6ef2;
  box-shadow: 0 2px 12px rgba(78, 110, 242, 0.3);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0 15px;
  font-size: 16px;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  width: 120px;
  background: linear-gradient(to bottom, #4e6ef2, #3a5bdb);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
  letter-spacing: 1px;
}

.search-button:hover {
  background: linear-gradient(to bottom, #3a5bdb, #2d4ac7);
}

.search-button:active {
  transform: scale(0.98);
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e6e6e6;
  border-top-color: #4e6ef2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 20px;
  font-size: 16px;
  color: #666;
}

/* 错误提示 */
.error-message {
  background: #fff3f3;
  color: #d32f2f;
  padding: 15px 20px;
  margin: 20px;
  border-radius: 8px;
  border-left: 4px solid #d32f2f;
  text-align: center;
}

/* 搜索结果 */
.search-results {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.results-info {
  font-size: 13px;
  color: #666;
  padding: 10px 0;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 20px;
}

.result-item {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child {
  border-bottom: none;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 5px;
}

.result-title {
  font-size: 18px;
  color: #2932e1;
  text-decoration: none;
  font-weight: 500;
  flex: 1;
  line-height: 1.4;
}

.result-title:hover {
  text-decoration: underline;
}

.result-title:visited {
  color: #609;
}

.result-priority {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.result-url {
  font-size: 14px;
  color: #006621;
  margin-bottom: 5px;
  word-break: break-all;
}

.result-snippet {
  font-size: 14px;
  color: #545454;
  line-height: 1.6;
}

/* 无结果提示 */
.no-results {
  text-align: center;
  padding: 80px 20px;
}

.no-results-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-results-text {
  font-size: 20px;
  color: #333;
  margin-bottom: 30px;
  font-weight: 500;
}

.no-results-hint {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
}

.no-results-suggestions {
  display: inline-block;
  text-align: left;
  color: #666;
  font-size: 14px;
  line-height: 2;
}

.no-results-suggestions li {
  margin-bottom: 8px;
}

/* 初始状态 */
.initial-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 20px;
}

.initial-icon {
  font-size: 80px;
  margin-bottom: 30px;
  opacity: 0.3;
}

.initial-text {
  font-size: 18px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .baidu-logo {
    font-size: 32px;
    margin-bottom: 20px;
  }

  .search-box {
    max-width: 100%;
    height: 40px;
  }

  .search-input {
    font-size: 14px;
  }

  .search-button {
    width: 100px;
    font-size: 14px;
  }

  .search-results {
    padding: 15px;
  }

  .result-title {
    font-size: 16px;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .result-priority {
    align-self: flex-start;
  }
}
</style>
