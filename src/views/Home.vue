<template>
  <div class="google-home">
    <div class="logo-container">
      <h1 class="logo">Google</h1>
    </div>

    <div class="search-container">
      <div class="search-box">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          placeholder="在Google上搜索，或者输入一个网址"
          class="search-input"
        >
      </div>

      <div class="button-container">
        <button @click="handleSearch" class="search-button">Google 搜索</button>
        <button @click="handleLucky" class="search-button">手气不错</button>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-content">
        <span>关于</span>
        <span>广告</span>
        <span>商务</span>
        <span>隐私权</span>
        <span>条款</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`, '_blank');
  }
};

const handleLucky = () => {
  if (searchQuery.value.trim()) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}&btnI=1`, '_blank');
  }
};
</script>

<style scoped>
.google-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #fff;
  font-family: Arial, sans-serif;
  position: relative;
  padding: 20px;
}

.logo-container {
  margin-bottom: 30px;
  margin-top: -100px;
}

.logo {
  font-size: 90px;
  font-weight: normal;
  margin: 0;
  background: linear-gradient(to right,
    #4285f4 0%, #4285f4 25%,
    #ea4335 25%, #ea4335 50%,
    #fbbc05 50%, #fbbc05 75%,
    #34a853 75%, #34a853 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -5px;
}

.search-container {
  width: 100%;
  max-width: 580px;
}

.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  background: #fff;
  border: 1px solid #dfe1e5;
  border-radius: 24px;
  padding: 0 15px;
  box-shadow: none;
  transition: box-shadow 0.2s ease;
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
  color: #9aa0a6;
  margin-right: 10px;
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

.search-input::placeholder {
  color: #9aa0a6;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.search-button {
  background-color: #f8f9fa;
  border: 1px solid #f8f9fa;
  border-radius: 4px;
  color: #3c4043;
  font-family: Arial, sans-serif;
  font-size: 14px;
  height: 36px;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.search-button:hover {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #f8f9fa;
  border: 1px solid #dadce0;
  color: #202124;
}

.search-button:active {
  border: 1px solid #4285f4;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f2f2f2;
  border-top: 1px solid #e4e4e4;
}

.footer-content {
  display: flex;
  justify-content: center;
  gap: 25px;
  padding: 15px;
  font-size: 14px;
  color: #70757a;
}

.footer-content span {
  cursor: pointer;
}

.footer-content span:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .logo {
    font-size: 60px;
  }

  .search-container {
    max-width: 90%;
  }

  .button-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-button {
    width: 100%;
  }
}
</style>
