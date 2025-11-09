<template>
  <div class="baidu-page">
    <!-- 顶部导航 -->
    <header class="top-nav">
      <div class="nav-links">
        <a href="javascript:void(0)" class="nav-link">新闻</a>
        <a href="javascript:void(0)" class="nav-link">hao123</a>
        <a href="javascript:void(0)" class="nav-link">地图</a>
        <a href="javascript:void(0)" class="nav-link">直播</a>
        <a href="javascript:void(0)" class="nav-link">视频</a>
        <a href="javascript:void(0)" class="nav-link">贴吧</a>
        <a href="javascript:void(0)" class="nav-link">学术</a>
        <a href="javascript:void(0)" class="nav-link">更多</a>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 百度 Logo -->
      <div class="logo-container">
        <h1 class="baidu-logo">
          <span class="logo-text">百度</span>
        </h1>
      </div>

      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-box">
          <input
            type="text"
            class="search-input"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder="请输入搜索内容"
          />
          <button class="search-btn" @click="handleSearch">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="search-buttons">
          <button class="btn-primary" @click="handleSearch">百度一下</button>
        </div>
      </div>

      <!-- 快捷导航 -->
      <div class="quick-links">
        <a href="javascript:void(0)" class="quick-link">百度翻译</a>
        <a href="javascript:void(0)" class="quick-link">百度网盘</a>
        <a href="javascript:void(0)" class="quick-link">百度图片</a>
        <a href="javascript:void(0)" class="quick-link">百度知道</a>
        <a href="javascript:void(0)" class="quick-link">百度文库</a>
        <a href="javascript:void(0)" class="quick-link">百度百科</a>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-links">
        <a href="javascript:void(0)" class="footer-link">把百度设为主页</a>
        <span class="separator">|</span>
        <a href="javascript:void(0)" class="footer-link">关于百度</a>
        <span class="separator">|</span>
        <a href="javascript:void(0)" class="footer-link">About Baidu</a>
        <span class="separator">|</span>
        <a href="javascript:void(0)" class="footer-link">百度营销</a>
      </div>
      <p class="footer-text">©2025 Baidu 使用百度前必读 意见反馈 京ICP证030173号</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    const baiduSearchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery.value.trim())}`
    window.open(baiduSearchUrl, '_blank')
  }
}
</script>

<style scoped>
/* 百度风格样式 */
.baidu-page {
  min-height: 100vh;
  background: var(--theme-bg-primary);
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.top-nav {
  padding: 20px 0 0;
  text-align: right;
}

.nav-links {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-link {
  color: var(--theme-text-primary);
  text-decoration: none;
  font-size: 13px;
  margin-left: 20px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #3385ff;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  margin-top: -80px;
}

/* 百度 Logo */
.logo-container {
  margin-bottom: 30px;
  text-align: center;
}

.baidu-logo {
  margin: 0;
  padding: 0;
}

.logo-text {
  font-size: 88px;
  font-weight: 500;
  color: #3385ff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  letter-spacing: 8px;
  text-shadow: 2px 2px 4px rgba(51, 133, 255, 0.2);
}

/* 搜索容器 */
.search-container {
  width: 100%;
  max-width: 640px;
}

/* 搜索框 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--theme-card-bg);
  border: 2px solid #c4c7ce;
  border-radius: 10px;
  padding: 0;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-box:hover,
.search-box:focus-within {
  border-color: #4e6ef2;
  box-shadow: 0 2px 8px rgba(78, 110, 242, 0.3);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 16px 20px;
  font-size: 16px;
  background: transparent;
  color: var(--theme-text-primary);
}

.search-input::placeholder {
  color: var(--theme-text-secondary);
}

.search-btn {
  background: transparent;
  border: none;
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  border-radius: 0 8px 8px 0;
}

.search-btn:hover {
  background: var(--theme-bg-tertiary);
}

.search-icon {
  width: 24px;
  height: 24px;
  color: var(--theme-text-secondary);
}

/* 搜索按钮 */
.search-buttons {
  margin-top: 28px;
  text-align: center;
}

.btn-primary {
  background: #3385ff;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(51, 133, 255, 0.3);
}

.btn-primary:hover {
  background: #4e6ef2;
  box-shadow: 0 4px 8px rgba(51, 133, 255, 0.4);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(51, 133, 255, 0.3);
}

/* 快捷导航 */
.quick-links {
  margin-top: 40px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.quick-link {
  color: var(--theme-text-secondary);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.quick-link:hover {
  color: #3385ff;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 30px 20px;
  background: var(--theme-bg-secondary);
  border-top: 1px solid var(--theme-border-primary);
}

.footer-links {
  margin-bottom: 12px;
}

.footer-link {
  color: var(--theme-text-secondary);
  text-decoration: none;
  font-size: 12px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #3385ff;
}

.separator {
  color: var(--theme-text-secondary);
  margin: 0 8px;
  font-size: 12px;
}

.footer-text {
  color: var(--theme-text-secondary);
  font-size: 12px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logo-text {
    font-size: 56px;
    letter-spacing: 4px;
  }

  .search-container {
    max-width: 100%;
  }

  .search-input {
    padding: 14px 16px;
    font-size: 14px;
  }

  .nav-links {
    text-align: center;
  }

  .nav-link {
    margin: 0 10px;
    font-size: 12px;
  }

  .quick-links {
    gap: 12px;
  }

  .quick-link {
    font-size: 12px;
  }

  .main-content {
    margin-top: -40px;
  }
}
</style>
