<template>
  <div class="google-home">
    <div class="google-container">
      <!-- Google Logo -->
      <div class="google-logo">
        <span class="logo-g">G</span>
        <span class="logo-o1">o</span>
        <span class="logo-o2">o</span>
        <span class="logo-g2">g</span>
        <span class="logo-l">l</span>
        <span class="logo-e">e</span>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <div class="search-input-wrapper">
          <svg class="search-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            @keyup.enter="handleSearch"
            placeholder=""
            autocomplete="off"
          />
        </div>
        <div class="search-buttons">
          <button class="search-btn" @click="handleSearch">Google 搜索</button>
          <button class="search-btn" @click="handleLucky">手气不错</button>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="google-footer">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    });
  }
};

const handleLucky = () => {
  // 手气不错功能 - 直接跳转到第一个结果
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim(), lucky: '1' }
    });
  }
};
</script>

<style scoped>
.google-home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: arial, sans-serif;
}

.google-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: -10vh;
}

/* Google Logo */
.google-logo {
  font-size: 90px;
  font-weight: 400;
  margin-bottom: 30px;
  user-select: none;
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

/* 搜索框 */
.search-box {
  width: 100%;
  max-width: 584px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  padding: 0 14px;
  height: 44px;
  transition: box-shadow 0.2s;
}

.search-input-wrapper:hover {
  box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  border-color: rgba(223, 225, 229, 0);
}

.search-input-wrapper:focus-within {
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

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #202124;
  background: transparent;
  font-family: arial, sans-serif;
}

/* 搜索按钮 */
.search-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 18px;
}

.search-btn {
  background-color: #f8f9fa;
  border: 1px solid #f8f9fa;
  border-radius: 4px;
  color: #3c4043;
  font-family: arial, sans-serif;
  font-size: 14px;
  margin: 0;
  padding: 0 16px;
  height: 36px;
  cursor: pointer;
  user-select: none;
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

/* 页脚 */
.google-footer {
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

.google-footer a {
  color: #70757a;
  text-decoration: none;
  font-size: 14px;
}

.google-footer a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .google-logo {
    font-size: 60px;
    margin-bottom: 25px;
  }

  .search-box {
    max-width: 100%;
  }

  .search-buttons {
    flex-direction: row;
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
  .google-logo {
    font-size: 50px;
  }

  .search-input-wrapper {
    height: 40px;
  }

  .search-btn {
    padding: 0 12px;
    font-size: 13px;
  }
}
</style>
