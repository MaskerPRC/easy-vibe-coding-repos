<template>
  <div class="search-page">
    <!-- Google 风格搜索页面 -->
    <div class="search-container">
      <!-- Logo -->
      <div class="logo-section">
        <h1 class="logo">
          <span class="logo-g">G</span><span class="logo-o1">o</span><span class="logo-o2">o</span><span class="logo-g2">g</span><span class="logo-l">l</span><span class="logo-e">e</span>
        </h1>
      </div>

      <!-- 搜索框 -->
      <form @submit.prevent="performSearch" class="search-form">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            v-model="searchQuery"
            class="search-input"
            placeholder="搜索 Google 或输入网址"
            autofocus
          >
          <button v-if="searchQuery" @click="clearSearch" type="button" class="clear-btn">✕</button>
        </div>

        <div class="search-buttons">
          <button type="submit" class="search-btn">Google 搜索</button>
          <button type="button" @click="feelingLucky" class="search-btn">手气不错</button>
        </div>
      </form>

      <!-- 搜索引擎选择 -->
      <div class="engine-selector">
        <button
          v-for="engine in engines"
          :key="engine.value"
          @click="selectedEngine = engine.value"
          :class="['engine-btn', { active: selectedEngine === engine.value }]"
        >
          {{ engine.label }}
        </button>
      </div>

      <!-- 搜索历史 -->
      <div v-if="searchHistory.length > 0" class="history-section">
        <div class="history-header">
          <h3>最近搜索</h3>
          <button @click="clearHistory" class="clear-history-btn">清空</button>
        </div>
        <div class="history-list">
          <div
            v-for="(item, index) in searchHistory.slice(0, 5)"
            :key="index"
            @click="searchAgain(item)"
            class="history-item"
          >
            <span class="history-icon">🕐</span>
            <span class="history-query">{{ item.query }}</span>
            <span class="history-engine">{{ getEngineName(item.engine) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回首页 -->
    <div class="back-home">
      <router-link to="/" class="back-link">← 返回首页</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const searchQuery = ref('');
const selectedEngine = ref('google');
const searchHistory = ref([]);

const engines = [
  { label: 'Google', value: 'google' },
  { label: 'Bing', value: 'bing' },
  { label: '搜狗', value: 'sogou' },
  { label: '360', value: '360' }
];

const performSearch = () => {
  if (!searchQuery.value.trim()) {
    return;
  }

  const searchEngines = {
    google: `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`,
    bing: `https://www.bing.com/search?q=${encodeURIComponent(searchQuery.value)}`,
    sogou: `https://www.sogou.com/web?query=${encodeURIComponent(searchQuery.value)}`,
    360: `https://www.so.com/s?q=${encodeURIComponent(searchQuery.value)}`
  };

  const url = searchEngines[selectedEngine.value];
  saveSearchHistory(searchQuery.value, selectedEngine.value);
  window.open(url, '_blank');
};

const feelingLucky = () => {
  if (searchQuery.value.trim()) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}&btnI`, '_blank');
  }
};

const clearSearch = () => {
  searchQuery.value = '';
};

const saveSearchHistory = async (query, engine) => {
  const historyItem = {
    query,
    engine,
    timestamp: new Date().toISOString()
  };

  searchHistory.value.unshift(historyItem);

  if (searchHistory.value.length > 20) {
    searchHistory.value = searchHistory.value.slice(0, 20);
  }

  try {
    await fetch('/api/search-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchHistory.value)
    });
  } catch (error) {
    console.error('保存搜索历史失败:', error);
  }
};

const loadSearchHistory = async () => {
  try {
    const response = await fetch('/api/search-history');
    if (response.ok) {
      const data = await response.json();
      searchHistory.value = data || [];
    }
  } catch (error) {
    console.error('加载搜索历史失败:', error);
  }
};

const clearHistory = async () => {
  searchHistory.value = [];
  try {
    await fetch('/api/search-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    });
  } catch (error) {
    console.error('清空搜索历史失败:', error);
  }
};

const searchAgain = (item) => {
  searchQuery.value = item.query;
  selectedEngine.value = item.engine;
  performSearch();
};

const getEngineName = (engine) => {
  const names = {
    google: 'Google',
    bing: 'Bing',
    sogou: '搜狗',
    360: '360'
  };
  return names[engine] || engine;
};

onMounted(() => {
  loadSearchHistory();
});
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: var(--theme-bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
}

.search-container {
  width: 100%;
  max-width: 600px;
  margin-top: 100px;
}

/* Logo */
.logo-section {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  font-size: 64px;
  font-weight: 400;
  margin: 0;
  letter-spacing: -2px;
  font-family: 'Product Sans', 'Google Sans', Roboto, Arial, sans-serif;
}

.logo-g { color: #4285f4; }
.logo-o1 { color: #ea4335; }
.logo-o2 { color: #fbbc04; }
.logo-g2 { color: #4285f4; }
.logo-l { color: #34a853; }
.logo-e { color: #ea4335; }

/* 搜索框 */
.search-form {
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-border-primary);
  border-radius: 24px;
  padding: 12px 20px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-box:hover {
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
}

.search-box:focus-within {
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
  border-color: var(--theme-primary);
}

.search-icon {
  font-size: 20px;
  margin-right: 12px;
  color: var(--theme-text-tertiary);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: var(--theme-text-primary);
  font-family: Roboto, Arial, sans-serif;
}

.search-input::placeholder {
  color: var(--theme-text-tertiary);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--theme-text-tertiary);
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: var(--theme-text-primary);
}

/* 搜索按钮 */
.search-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

.search-btn {
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-border-primary);
  color: var(--theme-text-primary);
  padding: 10px 24px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.search-btn:hover {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.15);
  border-color: var(--theme-border-secondary);
}

.search-btn:active {
  transform: scale(0.98);
}

/* 搜索引擎选择器 */
.engine-selector {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.engine-btn {
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-border-primary);
  color: var(--theme-text-secondary);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.engine-btn:hover {
  border-color: var(--theme-primary);
  color: var(--theme-primary);
}

.engine-btn.active {
  background: var(--theme-primary);
  border-color: var(--theme-primary);
  color: white;
}

/* 搜索历史 */
.history-section {
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-border-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: var(--theme-text-primary);
  margin: 0;
}

.clear-history-btn {
  background: none;
  border: none;
  color: var(--theme-primary);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.clear-history-btn:hover {
  background: var(--theme-bg-tertiary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: var(--theme-bg-secondary);
}

.history-icon {
  font-size: 18px;
  color: var(--theme-text-tertiary);
}

.history-query {
  flex: 1;
  color: var(--theme-text-primary);
  font-size: 14px;
}

.history-engine {
  color: var(--theme-text-tertiary);
  font-size: 12px;
}

/* 返回首页 */
.back-home {
  margin-top: 40px;
}

.back-link {
  color: var(--theme-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.2s;
}

.back-link:hover {
  background: var(--theme-bg-tertiary);
}

/* 响应式 */
@media (max-width: 768px) {
  .search-container {
    margin-top: 60px;
  }

  .logo {
    font-size: 48px;
  }

  .search-buttons {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }
}
</style>
