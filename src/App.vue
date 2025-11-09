<template>
  <div class="google-page">
    <header class="header">
      <div class="header-links">
        <a href="https://www.baidu.com" target="_blank">关于</a>
        <a href="https://www.baidu.com" target="_blank">商店</a>
      </div>
      <div class="header-right">
        <a href="https://www.baidu.com" target="_blank">Gmail</a>
        <a href="https://www.baidu.com" target="_blank">图片</a>
        <button class="apps-btn">⋮⋮⋮</button>
        <button class="signin-btn">登录</button>
      </div>
    </header>

    <main class="main-content">
      <div class="logo">
        <span class="logo-g">G</span>
        <span class="logo-o1">o</span>
        <span class="logo-o2">o</span>
        <span class="logo-g2">g</span>
        <span class="logo-l">l</span>
        <span class="logo-e">e</span>
      </div>

      <div class="search-container">
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
          <svg class="voice-icon" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path>
            <path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path>
            <path fill="#fbbc05" d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path>
            <path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
          </svg>
        </div>

        <div class="search-buttons">
          <button @click="handleSearch" class="search-btn">Google 搜索</button>
          <button @click="handleLucky" class="search-btn">手气不错</button>
        </div>
      </div>

      <div class="language-offer">
        Google 提供: <a href="#">English</a>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-top">
        中国
      </div>
      <div class="footer-bottom">
        <div class="footer-left">
          <a href="https://www.baidu.com" target="_blank">广告</a>
          <a href="https://www.baidu.com" target="_blank">商务</a>
          <a href="https://www.baidu.com" target="_blank">Google 的运作方式</a>
        </div>
        <div class="footer-right">
          <a href="https://www.baidu.com" target="_blank">隐私权</a>
          <a href="https://www.baidu.com" target="_blank">条款</a>
          <a href="https://www.baidu.com" target="_blank">设置</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 实际上使用百度搜索
    window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`, '_blank');
  }
};

const handleLucky = () => {
  if (searchQuery.value.trim()) {
    // 手气不错也使用百度搜索
    window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value)}`, '_blank');
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.google-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-links,
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header a {
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  transition: text-decoration 0.3s;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header a:hover {
  text-decoration: underline;
}

.apps-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 20px;
  color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
  backdrop-filter: blur(5px);
}

.apps-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.signin-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 9px 23px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.signin-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 100px;
}

/* Logo */
.logo {
  font-size: 90px;
  font-weight: 400;
  margin-bottom: 30px;
  font-family: 'Product Sans', Arial, sans-serif;
  user-select: none;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(255, 255, 255, 0.3);
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}

.logo-g {
  color: #4285f4;
}

.logo-o1 {
  color: #ea4335;
}

.logo-o2 {
  color: #fbbc05;
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

/* Search Container */
.search-container {
  width: 100%;
  max-width: 584px;
  padding: 0 20px;
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 12px 20px;
  width: 100%;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.search-box:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.search-box:focus-within {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.search-icon {
  width: 20px;
  height: 20px;
  fill: rgba(255, 255, 255, 0.8);
  margin-right: 13px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: white;
  background: transparent;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.voice-icon {
  width: 24px;
  height: 24px;
  margin-left: 8px;
  cursor: pointer;
  flex-shrink: 0;
}

.search-buttons {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-top: 30px;
}

.search-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: Arial, sans-serif;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

.search-btn:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.language-offer {
  margin-top: 30px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.language-offer a {
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  margin-left: 5px;
  font-weight: 500;
}

.language-offer a:hover {
  text-decoration: underline;
}

/* Footer */
.footer {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
}

.footer-top {
  padding: 15px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  flex-wrap: wrap;
}

.footer-left,
.footer-right {
  display: flex;
  gap: 27px;
}

.footer a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.footer a:hover {
  text-decoration: underline;
  color: rgba(255, 255, 255, 0.95);
}

@media (max-width: 768px) {
  .logo {
    font-size: 60px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 15px;
  }

  .footer-left,
  .footer-right {
    justify-content: center;
  }
}
</style>

