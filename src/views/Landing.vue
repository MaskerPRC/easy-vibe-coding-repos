<template>
  <div class="google-search-page">
    <!-- 顶部导航 -->
    <header class="top-nav">
      <div class="nav-links">
        <a href="#">Gmail</a>
        <a href="#">图片</a>
      </div>
    </header>

    <!-- 主搜索区域 -->
    <main class="search-container">
      <!-- Google Logo -->
      <div class="google-logo">
        <svg viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#EA4335" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
          <path fill="#FBBC05" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
          <path fill="#4285F4" d="M225 3v65h-9.5V3h9.5z"/>
          <path fill="#34A853" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
          <path fill="#EA4335" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"/>
        </svg>
      </div>

      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <form @submit.prevent="handleSearch">
          <div class="search-box">
            <svg class="search-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              class="search-input"
              autocomplete="off"
              @focus="inputFocused = true"
              @blur="inputFocused = false"
            />
            <svg v-if="searchQuery" @click="clearSearch" class="clear-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
          </div>

          <!-- 搜索按钮 -->
          <div class="search-buttons">
            <button type="submit" class="search-btn">Google 搜索</button>
            <button type="button" class="search-btn" @click="handleLuckySearch">手气不错</button>
          </div>
        </form>
      </div>

      <!-- 语言提示 -->
      <div class="language-tip">
        Google 提供: <a href="#">English</a>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-country">中国</div>
      <div class="footer-divider"></div>
      <div class="footer-links">
        <div class="footer-left">
          <a href="#">关于</a>
          <a href="#">广告</a>
          <a href="#">商务</a>
          <a href="#">搜索的运作方式</a>
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
import { ref } from 'vue';

const searchQuery = ref('');
const inputFocused = ref(false);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 跳转到百度搜索
    window.location.href = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`;
  }
};

const handleLuckySearch = () => {
  if (searchQuery.value.trim()) {
    // "手气不错"也跳转到百度
    window.location.href = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.google-search-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: arial, sans-serif;
}

/* 顶部导航 */
.top-nav {
  display: flex;
  justify-content: flex-end;
  padding: 15px 30px;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  color: #000;
  text-decoration: none;
  font-size: 13px;
  opacity: 0.75;
  transition: opacity 0.2s;
}

.nav-links a:hover {
  opacity: 1;
  text-decoration: underline;
}

/* 主搜索区域 */
.search-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: -100px;
}

/* Google Logo */
.google-logo {
  margin-bottom: 30px;
}

.google-logo svg {
  width: 272px;
  height: 92px;
}

/* 搜索框包装器 */
.search-box-wrapper {
  width: 100%;
  max-width: 584px;
}

.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  padding: 0 15px;
  transition: box-shadow 0.2s;
  background: #fff;
}

.search-box:hover {
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  border-color: rgba(223, 225, 229, 0);
}

.search-icon,
.clear-icon {
  width: 20px;
  height: 20px;
  fill: #9aa0a6;
  flex-shrink: 0;
}

.clear-icon {
  cursor: pointer;
  padding: 2px;
  transition: opacity 0.2s;
}

.clear-icon:hover {
  opacity: 0.7;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 0 15px;
  background: transparent;
}

/* 搜索按钮 */
.search-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}

.search-btn {
  background-color: #f8f9fa;
  border: 1px solid #f8f9fa;
  border-radius: 4px;
  color: #3c4043;
  font-size: 14px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.1s;
}

.search-btn:hover {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
  border: 1px solid #dadce0;
  color: #202124;
}

.search-btn:active {
  border: 1px solid #4285f4;
}

/* 语言提示 */
.language-tip {
  margin-top: 30px;
  font-size: 13px;
  color: #3c4043;
}

.language-tip a {
  color: #1a0dab;
  text-decoration: none;
  padding: 0 3px;
}

.language-tip a:hover {
  text-decoration: underline;
}

/* 底部 */
.footer {
  background-color: #f2f2f2;
  margin-top: auto;
}

.footer-country {
  padding: 15px 30px;
  border-bottom: 1px solid #dadce0;
  color: #70757a;
  font-size: 15px;
}

.footer-divider {
  height: 0;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 20px;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 27px;
  padding: 15px;
}

.footer-links a {
  color: #70757a;
  text-decoration: none;
  font-size: 14px;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-container {
    margin-top: -50px;
  }

  .google-logo svg {
    width: 200px;
    height: 68px;
  }

  .search-buttons {
    flex-direction: column;
    align-items: center;
  }

  .search-btn {
    width: 200px;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
  }

  .footer-left,
  .footer-right {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
