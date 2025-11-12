<template>
  <!-- 搜索栏 -->
  <div class="search-section">
    <div class="search-container">
      <input
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        @keyup.enter="$emit('search')"
        placeholder="搜索AI工具..."
        class="search-input"
      />
      <button class="search-btn" @click="$emit('search')">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 19L14.65 14.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="search-filters">
      <select :value="sortBy" @change="$emit('update:sortBy', $event.target.value)" class="filter-select">
        <option value="popularity">按热门排序</option>
        <option value="newest">按最新排序</option>
        <option value="name">按名称排序</option>
      </select>
    </div>
  </div>
</template>

<script setup>
// 组件属性定义
defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: 'popularity'
  }
});

// 组件事件定义
defineEmits(['update:searchQuery', 'update:sortBy', 'search']);
</script>

<style scoped>
/* 搜索栏 */
.search-section {
  background: #F8F8F8;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
}

.search-container {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  background: #FFFFFF;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #4A90E2;
}

.search-btn {
  padding: 12px 24px;
  background: #4A90E2;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #3a7bc8;
}

.search-filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 8px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  background: #FFFFFF;
  cursor: pointer;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .search-section {
    padding: 16px;
  }

  .search-container {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
