<template>
  <div id="app">
    <!-- 头部导航 -->
    <div class="header">
      <div class="header-right">
        <a href="javascript:void(0)">新闻</a>
        <a href="javascript:void(0)">hao123</a>
        <a href="javascript:void(0)">地图</a>
        <a href="javascript:void(0)">视频</a>
        <a href="javascript:void(0)">贴吧</a>
        <a href="javascript:void(0)">学术</a>
        <router-link to="/game" class="game-link">小恐龙游戏</router-link>
        <a href="javascript:void(0)" class="more-link">更多</a>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- Logo -->
      <div class="logo">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="270" height="129" viewBox="0 0 270 129">
          <path fill="#2529D8" d="M223.355,88.305c-6.118,0-11.084,4.961-11.084,11.084c0,6.123,4.966,11.084,11.084,11.084s11.084-4.961,11.084-11.084C234.439,93.266,229.473,88.305,223.355,88.305z"/>
          <text x="20" y="80" font-family="Arial, sans-serif" font-size="78" font-weight="bold" fill="#2319DC">百度</text>
        </svg>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <input
          type="text"
          v-model="searchText"
          @keyup.enter="handleSearch"
          placeholder="请输入搜索内容"
          class="search-input"
        />
        <button @click="handleSearch" class="search-btn">百度一下</button>
      </div>

      <!-- 底部链接 -->
      <div class="bottom-links">
        <a href="javascript:void(0)">把百度设为主页</a>
        <a href="javascript:void(0)">关于百度</a>
        <a href="javascript:void(0)">About Baidu</a>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <p>&copy; 2024 Baidu 使用百度前必读 意见反馈 京ICP证030173号</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchText = ref('');

const handleSearch = () => {
  if (searchText.value.trim()) {
    console.log('搜索内容：', searchText.value);
    alert(`您搜索的内容是：${searchText.value}`);
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, "Microsoft YaHei", sans-serif;
}

/* 头部导航 */
.header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 30px;
}

.header-right {
  display: flex;
  gap: 20px;
}

.header-right a {
  color: #333;
  text-decoration: none;
  font-size: 13px;
}

.header-right a:hover {
  color: #2319DC;
}

.game-link {
  color: #ff6b00 !important;
  font-weight: bold;
}

.game-link:hover {
  color: #ff4500 !important;
}

.more-link {
  color: #2319DC !important;
}

/* 主体内容 */
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
  margin-bottom: 30px;
}

/* 搜索框 */
.search-box {
  display: flex;
  width: 640px;
  max-width: 90%;
  margin-bottom: 30px;
}

.search-input {
  flex: 1;
  height: 44px;
  padding: 0 15px;
  border: 2px solid #c4c7ce;
  border-right: none;
  border-radius: 10px 0 0 10px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:hover,
.search-input:focus {
  border-color: #4e6ef2;
}

.search-btn {
  width: 108px;
  height: 44px;
  background-color: #4e6ef2;
  color: white;
  border: none;
  border-radius: 0 10px 10px 0;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #4662D9;
}

/* 底部链接 */
.bottom-links {
  display: flex;
  gap: 20px;
}

.bottom-links a {
  color: #999;
  font-size: 12px;
  text-decoration: none;
}

.bottom-links a:hover {
  color: #2319DC;
}

/* 页脚 */
.footer {
  width: 100%;
  padding: 20px;
  text-align: center;
  background-color: #f5f5f6;
  color: #999;
  font-size: 12px;
}
</style>
