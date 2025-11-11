<template>
  <div class="v2ex-app">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-container">
        <div class="header-left">
          <h1 class="logo">V2EX</h1>
          <nav class="nav">
            <a href="#" class="nav-link active">首页</a>
            <a href="#" class="nav-link">节点</a>
            <a href="#" class="nav-link">最热</a>
            <a href="#" class="nav-link">全部</a>
          </nav>
        </div>
        <div class="header-right">
          <button class="btn-login">登录</button>
          <button class="btn-signup">注册</button>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="main-wrapper">
      <div class="container">
        <!-- 左侧主内容区 -->
        <main class="main-content">
          <!-- 热门节点导航 -->
          <div class="hot-nodes-box" v-if="hotNodes.length > 0">
            <div class="hot-nodes">
              <a
                v-for="node in hotNodes"
                :key="node.id"
                href="#"
                class="node-tag"
              >
                {{ node.name }}
              </a>
            </div>
          </div>

          <!-- 帖子列表 -->
          <div class="topic-list">
            <div
              v-for="topic in topics"
              :key="topic.id"
              class="topic-item"
            >
              <div class="topic-avatar">
                <img :src="topic.avatar" :alt="topic.author" />
              </div>
              <div class="topic-main">
                <div class="topic-header">
                  <a href="#" class="topic-node">{{ topic.node }}</a>
                  <span class="topic-meta">•</span>
                  <span class="topic-author">{{ topic.author }}</span>
                  <span class="topic-meta">•</span>
                  <span class="topic-time">{{ topic.lastReplyTime }}</span>
                </div>
                <h2 class="topic-title">
                  <a href="#">{{ topic.title }}</a>
                </h2>
              </div>
              <div class="topic-info">
                <div class="topic-replies" v-if="topic.replies > 0">
                  {{ topic.replies }}
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- 右侧边栏 -->
        <aside class="sidebar">
          <!-- 网站统计 -->
          <div class="sidebar-box">
            <div class="sidebar-title">社区统计</div>
            <div class="stats-list">
              <div class="stats-item">
                <span class="stats-label">主题</span>
                <span class="stats-value">{{ stats.topics }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">节点</span>
                <span class="stats-value">{{ stats.nodes }}</span>
              </div>
              <div class="stats-item">
                <span class="stats-label">用户</span>
                <span class="stats-value">{{ stats.members }}</span>
              </div>
            </div>
          </div>

          <!-- 热门节点 -->
          <div class="sidebar-box">
            <div class="sidebar-title">热门节点</div>
            <div class="node-list">
              <a
                v-for="node in hotNodes.slice(0, 4)"
                :key="node.id"
                href="#"
                class="node-item"
              >
                <span class="node-name">{{ node.name }}</span>
                <span class="node-topics">{{ node.topics }}</span>
              </a>
            </div>
          </div>

          <!-- 关于 -->
          <div class="sidebar-box">
            <div class="sidebar-title">关于</div>
            <div class="about-text">
              这是一个技术社区,讨论编程、设计、硬件、游戏等话题。
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <span class="footer-text">V2EX 社区</span>
          <span class="footer-separator">•</span>
          <a href="#" class="footer-link">关于</a>
          <span class="footer-separator">•</span>
          <a href="#" class="footer-link">FAQ</a>
          <span class="footer-separator">•</span>
          <a href="#" class="footer-link">API</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 响应式数据
const topics = ref([]);
const hotNodes = ref([]);
const stats = ref({
  members: 0,
  topics: 0,
  nodes: 0
});

// 加载数据
const loadData = async () => {
  try {
    // 并行请求多个接口
    const [topicsRes, nodesRes, statsRes] = await Promise.all([
      axios.get('/api/topics'),
      axios.get('/api/nodes/hot'),
      axios.get('/api/stats')
    ]);

    topics.value = topicsRes.data;
    hotNodes.value = nodesRes.data;
    stats.value = statsRes.data;
  } catch (error) {
    console.error('加载数据失败:', error);
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.v2ex-app {
  min-height: 100vh;
  background: #f0f0f0;
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333333;
}

/* 顶部导航栏 */
.header {
  background: #ffffff;
  border-bottom: 1px solid #e2e2e2;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  letter-spacing: 1px;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #778087;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: #333333;
}

.header-right {
  display: flex;
  gap: 10px;
}

.btn-login,
.btn-signup {
  padding: 6px 16px;
  border: 1px solid #e2e2e2;
  background: #ffffff;
  color: #333333;
  font-size: 13px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login:hover,
.btn-signup:hover {
  border-color: #333333;
}

.btn-signup {
  background: #333333;
  color: #ffffff;
  border-color: #333333;
}

.btn-signup:hover {
  background: #000000;
}

/* 主体容器 */
.main-wrapper {
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* 主内容区 */
.main-content {
  flex: 1;
  min-width: 0;
}

/* 热门节点盒子 */
.hot-nodes-box {
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #e2e2e2;
  padding: 15px;
  margin-bottom: 20px;
}

.hot-nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.node-tag {
  display: inline-block;
  padding: 5px 12px;
  background: #f9f9f9;
  color: #778087;
  text-decoration: none;
  font-size: 13px;
  border-radius: 3px;
  transition: all 0.2s;
}

.node-tag:hover {
  background: #333333;
  color: #ffffff;
}

/* 帖子列表 */
.topic-list {
  background: #ffffff;
  border: 1px solid #e2e2e2;
  border-radius: 3px;
  overflow: hidden;
}

.topic-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.topic-item:last-child {
  border-bottom: none;
}

.topic-item:hover {
  background: #f9f9f9;
}

.topic-avatar {
  flex-shrink: 0;
}

.topic-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 3px;
  display: block;
}

.topic-main {
  flex: 1;
  min-width: 0;
}

.topic-header {
  font-size: 12px;
  color: #999999;
  margin-bottom: 5px;
}

.topic-node {
  color: #778087;
  text-decoration: none;
  padding: 2px 6px;
  background: #f9f9f9;
  border-radius: 2px;
  transition: all 0.2s;
}

.topic-node:hover {
  background: #333333;
  color: #ffffff;
}

.topic-meta {
  margin: 0 5px;
  color: #cccccc;
}

.topic-author {
  color: #778087;
}

.topic-time {
  color: #cccccc;
}

.topic-title {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

.topic-title a {
  color: #333333;
  text-decoration: none;
  transition: color 0.2s;
}

.topic-title a:hover {
  color: #000000;
}

.topic-info {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.topic-replies {
  min-width: 36px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #f0f0f0;
  color: #778087;
  font-size: 12px;
  border-radius: 12px;
  padding: 0 10px;
}

/* 侧边栏 */
.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.sidebar-box {
  background: #ffffff;
  border: 1px solid #e2e2e2;
  border-radius: 3px;
  margin-bottom: 20px;
  overflow: hidden;
}

.sidebar-title {
  padding: 12px 15px;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  border-bottom: 1px solid #f0f0f0;
}

/* 统计信息 */
.stats-list {
  padding: 15px;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stats-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.stats-label {
  color: #778087;
  font-size: 13px;
}

.stats-value {
  color: #333333;
  font-weight: 600;
  font-size: 14px;
}

/* 节点列表 */
.node-list {
  padding: 10px 15px;
}

.node-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #333333;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.node-item:hover {
  color: #000000;
}

.node-name {
  color: #333333;
}

.node-topics {
  color: #cccccc;
  font-size: 12px;
}

/* 关于 */
.about-text {
  padding: 15px;
  font-size: 13px;
  color: #778087;
  line-height: 1.8;
}

/* 底部 */
.footer {
  background: #ffffff;
  border-top: 1px solid #e2e2e2;
  margin-top: 40px;
  padding: 20px 0;
}

.footer-content {
  text-align: center;
  font-size: 12px;
  color: #999999;
}

.footer-text {
  color: #778087;
}

.footer-separator {
  margin: 0 10px;
  color: #e2e2e2;
}

.footer-link {
  color: #778087;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #333333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 15px;
  }

  .header-left {
    gap: 15px;
  }

  .nav {
    gap: 12px;
  }

  .nav-link {
    font-size: 13px;
  }

  .container {
    flex-direction: column;
    padding: 0 15px;
  }

  .sidebar {
    width: 100%;
  }

  .topic-avatar img {
    width: 40px;
    height: 40px;
  }

  .topic-title {
    font-size: 15px;
  }

  .hot-nodes-box {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 18px;
  }

  .nav {
    display: none;
  }

  .btn-login,
  .btn-signup {
    padding: 5px 12px;
    font-size: 12px;
  }

  .topic-item {
    padding: 12px;
    gap: 10px;
  }

  .topic-avatar img {
    width: 36px;
    height: 36px;
  }

  .topic-title {
    font-size: 14px;
  }

  .hot-nodes {
    gap: 8px;
  }

  .node-tag {
    padding: 4px 10px;
    font-size: 12px;
  }
}
</style>
