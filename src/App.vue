<template>
  <div class="google-page">
    <div class="search-container">
      <!-- Logo -->
      <div class="logo">
        <span class="logo-g">G</span>
        <span class="logo-o1">o</span>
        <span class="logo-o2">o</span>
        <span class="logo-g2">g</span>
        <span class="logo-l">l</span>
        <span class="logo-e">e</span>
      </div>

      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <div class="search-box">
          <svg class="search-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder=""
            class="search-input"
          />
          <svg v-if="searchQuery" class="clear-icon" @click="clearSearch" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="button-wrapper">
        <button class="search-button" @click="handleSearch">Google 搜索</button>
        <button class="lucky-button" @click="handleLucky">手气不错</button>
      </div>
    </div>

    <!-- 底部链接 -->
    <footer class="footer">
      <div class="footer-links">
        <a href="javascript:void(0)">关于</a>
        <a href="javascript:void(0)">广告</a>
        <a href="javascript:void(0)">商务</a>
        <a href="javascript:void(0)">隐私权</a>
        <a href="javascript:void(0)">条款</a>
        <a href="javascript:void(0)">设置</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 实际使用百度搜索
    window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`, '_blank');
  }
};

const handleLucky = () => {
  if (searchQuery.value.trim()) {
    // 手气不错也跳转到百度
    window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`, '_blank');
  }
};

const clearSearch = () => {
  searchQuery.value = '';
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.google-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  background-color: #fff;
  position: relative;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 584px;
  padding: 20px;
}

/* Logo 样式 */
.logo {
  font-size: 90px;
  font-weight: 500;
  margin-bottom: 25px;
  letter-spacing: -5px;
  user-select: none;
}

.logo-g {
  color: #4285F4;
}

.logo-o1 {
  color: #EA4335;
}

.logo-o2 {
  color: #FBBC05;
}

.logo-g2 {
  color: #4285F4;
}

.logo-l {
  color: #34A853;
}

.logo-e {
  color: #EA4335;
}

/* 搜索框样式 */
.search-box-wrapper {
  width: 100%;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  padding: 0 14px;
  transition: box-shadow 0.2s;
}

.search-box:hover {
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  border-color: rgba(223, 225, 229, 0);
}

.search-box:focus-within {
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  border-color: rgba(223, 225, 229, 0);
}

.search-icon {
  width: 20px;
  height: 20px;
  fill: #9aa0a6;
  flex-shrink: 0;
  margin-right: 13px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  color: #202124;
}

.clear-icon {
  width: 24px;
  height: 24px;
  fill: #70757a;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
  margin-left: 10px;
}

.clear-icon:hover {
  fill: #202124;
}

/* 按钮样式 */
.button-wrapper {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.search-button,
.lucky-button {
  background-color: #f8f9fa;
  border: 1px solid #f8f9fa;
  border-radius: 4px;
  color: #3c4043;
  font-size: 14px;
  padding: 0 16px;
  height: 36px;
  cursor: pointer;
  transition: all 0.1s;
  font-family: Arial, sans-serif;
}

.search-button:hover,
.lucky-button:hover {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
  border: 1px solid #dadce0;
  color: #202124;
}

.search-button:active,
.lucky-button:active {
  border: 1px solid #4285f4;
}

/* 底部链接 */
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #f2f2f2;
  border-top: 1px solid #e4e4e4;
}

.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 15px;
  gap: 27px;
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
  .logo {
    font-size: 60px;
  }

  .search-container {
    max-width: 90%;
  }

  .button-wrapper {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .search-button,
  .lucky-button {
    width: 100%;
  }

  .footer-links {
    gap: 15px;
    font-size: 12px;
  }
}
</style>
