<template>
  <div class="blog-page">
    <!-- 导航栏 -->
    <header class="header">
      <div class="container">
        <nav class="nav">
          <div class="logo" @click="goHome">
            <span class="logo-icon">🚀</span>
            <span class="logo-text">MyApp</span>
          </div>
          <ul class="nav-menu">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/products">产品</router-link></li>
            <li><router-link to="/blog" class="active">博客</router-link></li>
            <li><router-link to="/login">登录</router-link></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">技术博客</h1>
        <p class="page-subtitle">分享技术见解，记录成长历程</p>
      </div>
    </section>

    <!-- 博客内容 -->
    <section class="blog-section">
      <div class="container">
        <div class="blog-layout">
          <!-- 博客列表 -->
          <div class="blog-list">
            <article
              v-for="post in posts"
              :key="post.id"
              class="blog-card"
              @click="viewPost(post)"
            >
              <div class="blog-image">
                <div class="image-placeholder" :style="{ background: post.color }">
                  <div class="blog-icon">{{ post.icon }}</div>
                </div>
                <div class="blog-category">{{ post.category }}</div>
              </div>
              <div class="blog-content">
                <h2 class="blog-title">{{ post.title }}</h2>
                <p class="blog-excerpt">{{ post.excerpt }}</p>
                <div class="blog-meta">
                  <div class="meta-item">
                    <span class="meta-icon">👤</span>
                    <span>{{ post.author }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">📅</span>
                    <span>{{ post.date }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-icon">👁️</span>
                    <span>{{ post.views }}</span>
                  </div>
                </div>
                <div class="blog-tags">
                  <span v-for="tag in post.tags" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </article>
          </div>

          <!-- 侧边栏 -->
          <aside class="sidebar">
            <!-- 搜索框 -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">搜索文章</h3>
              <div class="search-box">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索关键词..."
                  class="search-input"
                />
                <button class="search-btn">🔍</button>
              </div>
            </div>

            <!-- 热门标签 -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">热门标签</h3>
              <div class="tags-cloud">
                <span
                  v-for="tag in popularTags"
                  :key="tag.name"
                  class="tag-cloud-item"
                  :style="{ fontSize: tag.size + 'px' }"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>

            <!-- 最新文章 -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">最新文章</h3>
              <div class="recent-posts">
                <div
                  v-for="post in recentPosts"
                  :key="post.id"
                  class="recent-post"
                  @click="viewPost(post)"
                >
                  <div class="recent-post-title">{{ post.title }}</div>
                  <div class="recent-post-date">{{ post.date }}</div>
                </div>
              </div>
            </div>

            <!-- 分类统计 -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">文章分类</h3>
              <div class="categories">
                <div v-for="cat in categoryStats" :key="cat.name" class="category-item">
                  <span>{{ cat.name }}</span>
                  <span class="category-count">{{ cat.count }}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 MyApp. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

// 博客文章
const posts = ref([
  {
    id: 1,
    title: 'Vue 3 组合式 API 完全指南',
    excerpt: '深入解析 Vue 3 的 Composition API，从基础到进阶，带你全面掌握这个强大的特性。包含实际项目案例和最佳实践。',
    author: '张三',
    date: '2024-01-15',
    views: '1.2k',
    category: '前端开发',
    icon: '📱',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tags: ['Vue', 'JavaScript', '前端']
  },
  {
    id: 2,
    title: 'Node.js 性能优化实战',
    excerpt: '分享在生产环境中优化 Node.js 应用性能的经验和技巧，包括内存管理、并发处理、缓存策略等方面。',
    author: '李四',
    date: '2024-01-12',
    views: '980',
    category: '后端开发',
    icon: '⚡',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tags: ['Node.js', '性能优化', '后端']
  },
  {
    id: 3,
    title: 'Docker 容器化部署指南',
    excerpt: '从零开始学习 Docker，掌握容器化部署的核心概念和实践技巧，让应用部署变得简单高效。',
    author: '王五',
    date: '2024-01-10',
    views: '1.5k',
    category: '运维部署',
    icon: '🐳',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    tags: ['Docker', 'DevOps', '容器化']
  },
  {
    id: 4,
    title: 'TypeScript 高级类型系统',
    excerpt: 'TypeScript 类型系统的高级用法，包括泛型、映射类型、条件类型等，提升代码质量和开发效率。',
    author: '赵六',
    date: '2024-01-08',
    views: '850',
    category: '前端开发',
    icon: '📘',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    tags: ['TypeScript', 'JavaScript', '类型系统']
  },
  {
    id: 5,
    title: 'RESTful API 设计最佳实践',
    excerpt: '深入探讨 RESTful API 的设计原则和最佳实践，包括资源设计、HTTP 方法使用、错误处理等。',
    author: '钱七',
    date: '2024-01-05',
    views: '1.1k',
    category: '后端开发',
    icon: '🔌',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    tags: ['API', 'REST', '架构设计']
  },
  {
    id: 6,
    title: 'CSS Grid 布局完全指南',
    excerpt: '全面学习 CSS Grid 布局，从基础概念到复杂应用，打造现代化的响应式网页布局。',
    author: '孙八',
    date: '2024-01-03',
    views: '720',
    category: '前端开发',
    icon: '🎨',
    color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    tags: ['CSS', '布局', '响应式']
  }
]);

// 热门标签
const popularTags = ref([
  { name: 'Vue', size: 18 },
  { name: 'JavaScript', size: 16 },
  { name: 'Node.js', size: 15 },
  { name: 'TypeScript', size: 14 },
  { name: 'Docker', size: 13 },
  { name: 'CSS', size: 12 },
  { name: 'API', size: 11 },
  { name: 'DevOps', size: 10 }
]);

// 最新文章
const recentPosts = computed(() => posts.value.slice(0, 5));

// 分类统计
const categoryStats = ref([
  { name: '前端开发', count: 15 },
  { name: '后端开发', count: 12 },
  { name: '运维部署', count: 8 },
  { name: '架构设计', count: 6 },
  { name: '数据库', count: 5 }
]);

// 返回首页
const goHome = () => {
  router.push('/');
};

// 查看文章详情
const viewPost = (post) => {
  console.log('查看文章:', post);
  alert(`文章标题: ${post.title}\n作者: ${post.author}\n发布日期: ${post.date}\n\n${post.excerpt}`);
};
</script>

<style scoped>
.blog-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 导航栏 */
.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  cursor: pointer;
}

.logo-icon {
  font-size: 2rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover,
.nav-menu a.active {
  color: #667eea;
}

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
}

/* 博客布局 */
.blog-section {
  padding: 4rem 0;
}

.blog-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
}

/* 博客列表 */
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.blog-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s;
  cursor: pointer;
  display: grid;
  grid-template-columns: 300px 1fr;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.blog-image {
  position: relative;
  height: 250px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blog-icon {
  font-size: 5rem;
}

.blog-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.blog-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.blog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.blog-excerpt {
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  flex: 1;
}

.blog-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
  font-size: 0.9rem;
}

.meta-icon {
  font-size: 1rem;
}

.blog-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f3f4f6;
  color: #667eea;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.sidebar-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #667eea;
}

/* 搜索框 */
.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s;
}

.search-btn:hover {
  transform: scale(1.05);
}

/* 标签云 */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.tag-cloud-item {
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.tag-cloud-item:hover {
  color: #764ba2;
  transform: scale(1.1);
}

/* 最新文章 */
.recent-posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recent-post {
  padding: 0.75rem;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.3s;
}

.recent-post:hover {
  background: #f3f4f6;
  transform: translateX(5px);
}

.recent-post-title {
  color: #1f2937;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.recent-post-date {
  color: #9ca3af;
  font-size: 0.85rem;
}

/* 分类统计 */
.categories {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: #f9fafb;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background: #f3f4f6;
  color: #667eea;
}

.category-count {
  background: #667eea;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}

/* 页脚 */
.footer {
  background: #1f2937;
  color: white;
  padding: 2rem 0;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }

  .blog-card {
    grid-template-columns: 1fr;
  }

  .blog-image {
    height: 200px;
  }

  .sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .nav-menu {
    display: none;
  }

  .sidebar {
    grid-template-columns: 1fr;
  }

  .blog-card {
    grid-template-columns: 1fr;
  }
}
</style>
