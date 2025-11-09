<template>
  <div class="google-page">
    <!-- Google 风格头部 -->
    <header class="header">
      <div class="logo-section">
        <h1 class="logo">
          <span class="logo-g">G</span><span class="logo-o1">o</span><span class="logo-o2">o</span><span class="logo-g2">g</span><span class="logo-l">l</span><span class="logo-e">e</span>
        </h1>
        <p class="tagline">探索更大的世界</p>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 导航卡片网格 -->
      <div class="nav-grid">
        <!-- 搜索引擎 -->
        <div class="nav-card">
          <div class="card-icon search-icon">🔍</div>
          <h3 class="card-title">搜索引擎</h3>
          <div class="card-links">
            <router-link to="/search" class="link-item featured">搜索工具</router-link>
            <a href="https://www.google.com" target="_blank" class="link-item">Google</a>
            <a href="https://www.bing.com" target="_blank" class="link-item">Bing</a>
            <a href="https://www.baidu.com" target="_blank" class="link-item">百度</a>
            <a href="https://duckduckgo.com" target="_blank" class="link-item">DuckDuckGo</a>
          </div>
        </div>

        <!-- 新闻资讯 -->
        <div class="nav-card">
          <div class="card-icon news-icon">📰</div>
          <h3 class="card-title">新闻资讯</h3>
          <div class="card-links">
            <a href="https://news.ycombinator.com" target="_blank" class="link-item">Hacker News</a>
            <a href="https://www.bbc.com" target="_blank" class="link-item">BBC News</a>
            <a href="https://www.reuters.com" target="_blank" class="link-item">Reuters</a>
            <a href="https://techcrunch.com" target="_blank" class="link-item">TechCrunch</a>
          </div>
        </div>

        <!-- 社交网络 -->
        <div class="nav-card">
          <div class="card-icon social-icon">👥</div>
          <h3 class="card-title">社交网络</h3>
          <div class="card-links">
            <a href="https://twitter.com" target="_blank" class="link-item">Twitter</a>
            <a href="https://www.reddit.com" target="_blank" class="link-item">Reddit</a>
            <a href="https://github.com" target="_blank" class="link-item">GitHub</a>
            <a href="https://stackoverflow.com" target="_blank" class="link-item">Stack Overflow</a>
          </div>
        </div>

        <!-- 学习教育 -->
        <div class="nav-card">
          <div class="card-icon education-icon">📚</div>
          <h3 class="card-title">学习教育</h3>
          <div class="card-links">
            <a href="https://www.wikipedia.org" target="_blank" class="link-item">Wikipedia</a>
            <a href="https://www.coursera.org" target="_blank" class="link-item">Coursera</a>
            <a href="https://www.khanacademy.org" target="_blank" class="link-item">Khan Academy</a>
            <a href="https://developer.mozilla.org" target="_blank" class="link-item">MDN Web Docs</a>
          </div>
        </div>

        <!-- 娱乐休闲 -->
        <div class="nav-card">
          <div class="card-icon entertainment-icon">🎮</div>
          <h3 class="card-title">娱乐休闲</h3>
          <div class="card-links">
            <router-link to="/fluid-art" class="link-item featured">流体艺术</router-link>
            <a href="https://www.youtube.com" target="_blank" class="link-item">YouTube</a>
            <a href="https://www.spotify.com" target="_blank" class="link-item">Spotify</a>
            <a href="https://www.twitch.tv" target="_blank" class="link-item">Twitch</a>
            <a href="https://www.imdb.com" target="_blank" class="link-item">IMDB</a>
          </div>
        </div>

        <!-- 实用工具 -->
        <div class="nav-card">
          <div class="card-icon tools-icon">🔧</div>
          <h3 class="card-title">实用工具</h3>
          <div class="card-links">
            <router-link to="/random-site" class="link-item featured">随机网站</router-link>
            <a href="https://mail.google.com" target="_blank" class="link-item">Gmail</a>
            <a href="https://translate.google.com" target="_blank" class="link-item">Google Translate</a>
            <a href="https://drive.google.com" target="_blank" class="link-item">Google Drive</a>
            <a href="https://www.notion.so" target="_blank" class="link-item">Notion</a>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p class="footer-text">© 2025 网络导航中心 - 您的互联网入口</p>
    </footer>
  </div>
</template>

<script setup>
// Google 风格首页 - 简洁设计
</script>

<style scoped>
/* Google Material Design 风格 */
.google-page {
  min-height: 100vh;
  background: var(--theme-bg-secondary);
  display: flex;
  flex-direction: column;
}

/* Google Logo 样式 */
.header {
  padding: 60px 0 40px;
  text-align: center;
}

.logo {
  font-size: 72px;
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

.tagline {
  color: var(--theme-text-secondary);
  font-size: 16px;
  margin-top: 8px;
  font-weight: 400;
}

/* 主内容区 */
.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px 60px;
}

/* 导航卡片网格 */
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

/* 导航卡片 */
.nav-card {
  background: var(--theme-card-bg);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--theme-border-primary);
}

.nav-card:hover {
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
  transform: translateY(-4px);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
  text-align: center;
}

.card-title {
  font-size: 20px;
  font-weight: 500;
  color: var(--theme-text-primary);
  margin: 0 0 20px 0;
  text-align: center;
  letter-spacing: 0.25px;
}

.card-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-item {
  color: var(--theme-primary);
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  display: block;
  background: var(--theme-bg-secondary);
}

.link-item:hover {
  background: var(--theme-bg-tertiary);
  transform: translateX(4px);
}

.link-item.featured {
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  color: white;
}

.link-item.featured:hover {
  box-shadow: 0 2px 4px rgba(66, 133, 244, 0.3);
  transform: translateX(4px) translateY(-2px);
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 32px 24px;
  background: var(--theme-bg-primary);
  border-top: 1px solid var(--theme-border-primary);
}

.footer-text {
  color: var(--theme-text-secondary);
  font-size: 14px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .logo {
    font-size: 48px;
  }

  .nav-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .header {
    padding: 40px 0 24px;
  }
}
</style>
