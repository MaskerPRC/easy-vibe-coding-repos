<template>
  <div class="navbar">
    <div class="navbar-container">
      <!-- Logo 和品牌名 -->
      <div class="navbar-logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4065D4"/>
          <path d="M2 17L12 22L22 17" stroke="#4065D4" stroke-width="2"/>
          <path d="M2 12L12 17L22 12" stroke="#4065D4" stroke-width="2"/>
        </svg>
        <span class="logo-text">百度新闻</span>
      </div>

      <!-- 搜索框 -->
      <div class="navbar-search">
        <input
          type="text"
          class="search-input"
          placeholder="搜索新闻..."
          v-model="searchKeyword"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- 导航链接 -->
      <div class="navbar-links">
        <a href="#" class="nav-link">首页</a>
        <a href="#" class="nav-link">视频</a>
        <a href="#" class="nav-link">图片</a>
      </div>
    </div>

    <!-- 分类导航 -->
    <div class="navbar-categories">
      <div class="categories-container">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-btn', { active: activeCategory === category.id }]"
          @click="handleCategoryChange(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    activeCategory: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      searchKeyword: ''
    }
  },
  methods: {
    handleSearch() {
      if (this.searchKeyword.trim()) {
        this.$emit('search', this.searchKeyword);
      }
    },
    handleCategoryChange(categoryId) {
      this.$emit('category-change', categoryId);
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 24px;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #4065D4;
  white-space: nowrap;
}

/* 搜索框 */
.navbar-search {
  flex: 1;
  max-width: 500px;
  display: flex;
  gap: 0;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #4065D4;
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #2545B8;
}

.search-input::placeholder {
  color: #999999;
}

.search-btn {
  padding: 10px 20px;
  background-color: #4065D4;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background-color: #2545B8;
}

.search-btn svg {
  width: 20px;
  height: 20px;
}

/* 导航链接 */
.navbar-links {
  display: flex;
  gap: 24px;
  flex-shrink: 0;
}

.nav-link {
  color: #333333;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
  white-space: nowrap;
}

.nav-link:hover {
  color: #4065D4;
}

/* 分类导航 */
.navbar-categories {
  background-color: #F8F8F8;
  border-top: 1px solid #E5E5E5;
}

.categories-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.categories-container::-webkit-scrollbar {
  display: none;
}

.category-btn {
  padding: 8px 16px;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  color: #666666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
}

.category-btn:hover {
  background-color: #E8EEFF;
  color: #4065D4;
}

.category-btn.active {
  background-color: #4065D4;
  color: #FFFFFF;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
    padding: 12px 16px;
    gap: 12px;
  }

  .navbar-logo {
    width: 100%;
    justify-content: center;
  }

  .navbar-search {
    max-width: 100%;
    order: 3;
    width: 100%;
  }

  .navbar-links {
    width: 100%;
    justify-content: center;
    order: 2;
  }

  .categories-container {
    padding: 8px 16px;
  }

  .logo-text {
    font-size: 18px;
  }
}
</style>
