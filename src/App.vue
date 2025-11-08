<template>
  <div class="app">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <h1 class="logo">数字游民生活指南</h1>
        <nav class="nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['nav-btn', { active: activeTab === tab.id }]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="main">
      <div class="container">
        <!-- 首页 -->
        <div v-if="activeTab === 'home'" class="section">
          <div class="hero">
            <h2 class="hero-title">探索自由的数字游民生活</h2>
            <p class="hero-subtitle">边旅行边工作，体验世界各地的文化与风景</p>
          </div>

          <div class="intro-cards">
            <div class="intro-card">
              <div class="intro-icon">🌍</div>
              <h3>什么是数字游民</h3>
              <p>数字游民是利用互联网技术进行远程工作，不受地理位置限制，可以在世界各地生活和工作的人群。</p>
            </div>
            <div class="intro-card">
              <div class="intro-icon">💼</div>
              <h3>自由与灵活</h3>
              <p>自主选择工作地点和时间，平衡工作与生活，探索不同文化，拓展视野和人脉。</p>
            </div>
            <div class="intro-card">
              <div class="intro-icon">✈️</div>
              <h3>全球化生活</h3>
              <p>体验不同国家的生活方式，结识来自世界各地的朋友，在旅行中成长和学习。</p>
            </div>
          </div>
        </div>

        <!-- 热门目的地 -->
        <div v-if="activeTab === 'destinations'" class="section">
          <h2 class="section-title">热门数字游民目的地</h2>
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else class="destinations-grid">
            <div v-for="dest in destinations" :key="dest.id" class="destination-card">
              <div class="dest-image">{{ dest.image }}</div>
              <h3 class="dest-name">{{ dest.name }}</h3>
              <p class="dest-country">{{ dest.country }}</p>
              <p class="dest-description">{{ dest.description }}</p>
              <div class="dest-info">
                <div class="info-item">
                  <span class="info-label">月预算:</span>
                  <span class="info-value">¥{{ dest.monthlyBudget }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">网络:</span>
                  <span class="info-value">{{ dest.wifi }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 工作类型 -->
        <div v-if="activeTab === 'jobs'" class="section">
          <h2 class="section-title">适合数字游民的工作类型</h2>
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else class="jobs-grid">
            <div v-for="job in jobTypes" :key="job.id" class="job-card">
              <div class="job-icon">{{ job.icon }}</div>
              <h3 class="job-title">{{ job.title }}</h3>
              <p class="job-description">{{ job.description }}</p>
            </div>
          </div>
        </div>

        <!-- 社区留言 -->
        <div v-if="activeTab === 'community'" class="section">
          <h2 class="section-title">社区留言板</h2>

          <!-- 留言表单 -->
          <div class="message-form">
            <h3>分享你的数字游民故事</h3>
            <input
              v-model="newMessage.username"
              type="text"
              placeholder="你的昵称"
              class="form-input"
            />
            <textarea
              v-model="newMessage.content"
              placeholder="分享你的经历、心得或建议..."
              class="form-textarea"
              rows="4"
            ></textarea>
            <button @click="submitMessage" class="submit-btn">发布留言</button>
            <p v-if="messageStatus" class="message-status">{{ messageStatus }}</p>
          </div>

          <!-- 留言列表 -->
          <div class="messages-list">
            <h3>最新留言</h3>
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="messages.length === 0" class="no-messages">
              暂无留言，快来成为第一个分享的人吧！
            </div>
            <div v-else class="message-items">
              <div v-for="msg in messages.slice().reverse()" :key="msg.id" class="message-item">
                <div class="message-header">
                  <span class="message-author">{{ msg.username }}</span>
                  <span class="message-time">{{ msg.timestamp }}</span>
                </div>
                <p class="message-content">{{ msg.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>数字游民生活指南 - 开启你的自由工作之旅</p>
        <p class="backend-status">
          后端状态: <span :class="backendStatus">{{ backendStatusText }}</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 标签页
const tabs = [
  { id: 'home', name: '首页' },
  { id: 'destinations', name: '热门目的地' },
  { id: 'jobs', name: '工作类型' },
  { id: 'community', name: '社区留言' }
];

const activeTab = ref('home');
const loading = ref(false);
const backendStatus = ref('checking');
const backendStatusText = ref('检查中...');

// 数据
const destinations = ref([]);
const jobTypes = ref([]);
const messages = ref([]);

// 新留言
const newMessage = ref({
  username: '',
  content: ''
});
const messageStatus = ref('');

// 检查后端状态
const checkBackend = async () => {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    if (data.status === 'ok') {
      backendStatus.value = 'online';
      backendStatusText.value = '在线';
    }
  } catch (error) {
    backendStatus.value = 'offline';
    backendStatusText.value = '离线';
    console.error('后端连接失败:', error);
  }
};

// 获取所有数据
const fetchAllData = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/data');
    const result = await response.json();
    if (result.success) {
      destinations.value = result.data.destinations || [];
      jobTypes.value = result.data.jobTypes || [];
      messages.value = result.data.messages || [];
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 提交留言
const submitMessage = async () => {
  if (!newMessage.value.username.trim() || !newMessage.value.content.trim()) {
    messageStatus.value = '请填写昵称和留言内容';
    return;
  }

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: newMessage.value.username,
        content: newMessage.value.content
      })
    });

    const result = await response.json();
    if (result.success) {
      messageStatus.value = '留言发布成功！';
      // 清空表单
      newMessage.value.username = '';
      newMessage.value.content = '';
      // 重新获取留言列表
      await fetchAllData();
      // 3秒后清除状态消息
      setTimeout(() => {
        messageStatus.value = '';
      }, 3000);
    } else {
      messageStatus.value = '发布失败: ' + result.message;
    }
  } catch (error) {
    messageStatus.value = '发布失败: ' + error.message;
    console.error('提交留言失败:', error);
  }
};

// 页面加载时
onMounted(async () => {
  checkBackend();
  await fetchAllData();
  // 每10秒检查一次后端状态
  setInterval(checkBackend, 10000);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 头部导航 */
.header {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px 0;
  backdrop-filter: blur(10px);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.logo {
  font-size: 24px;
  margin: 0;
  font-weight: bold;
}

.nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.nav-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
}

/* 主要内容 */
.main {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

.section {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* 首页英雄区 */
.hero {
  text-align: center;
  padding: 60px 20px;
}

.hero-title {
  font-size: 48px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 20px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.intro-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.intro-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  transition: transform 0.3s;
}

.intro-card:hover {
  transform: translateY(-10px);
}

.intro-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.intro-card h3 {
  font-size: 24px;
  margin-bottom: 15px;
}

.intro-card p {
  line-height: 1.8;
  opacity: 0.9;
}

/* 目的地网格 */
.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.destination-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  color: #333;
  transition: transform 0.3s, box-shadow 0.3s;
}

.destination-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dest-image {
  font-size: 60px;
  text-align: center;
  margin-bottom: 20px;
}

.dest-name {
  font-size: 24px;
  margin-bottom: 5px;
  color: #667eea;
}

.dest-country {
  color: #999;
  margin-bottom: 15px;
}

.dest-description {
  line-height: 1.6;
  margin-bottom: 20px;
  color: #666;
}

.dest-info {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.info-label {
  color: #999;
}

.info-value {
  font-weight: bold;
  color: #667eea;
}

/* 工作类型网格 */
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.job-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  color: #333;
  transition: transform 0.3s;
}

.job-card:hover {
  transform: scale(1.05);
}

.job-icon {
  font-size: 50px;
  margin-bottom: 15px;
}

.job-title {
  font-size: 20px;
  margin-bottom: 10px;
  color: #667eea;
}

.job-description {
  color: #666;
  line-height: 1.6;
}

/* 留言板 */
.message-form {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  color: #333;
}

.message-form h3 {
  margin-bottom: 20px;
  color: #667eea;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  background: #667eea;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #5568d3;
}

.message-status {
  margin-top: 10px;
  color: #667eea;
  font-weight: bold;
}

/* 留言列表 */
.messages-list {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  color: #333;
}

.messages-list h3 {
  margin-bottom: 20px;
  color: #667eea;
}

.message-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-item {
  border-left: 4px solid #667eea;
  padding-left: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.message-author {
  font-weight: bold;
  color: #667eea;
}

.message-time {
  color: #999;
  font-size: 14px;
}

.message-content {
  line-height: 1.6;
  color: #666;
}

.no-messages {
  text-align: center;
  color: #999;
  padding: 40px;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

/* 页脚 */
.footer {
  background: rgba(0, 0, 0, 0.3);
  padding: 30px 0;
  text-align: center;
  backdrop-filter: blur(10px);
}

.footer p {
  margin: 5px 0;
  opacity: 0.9;
}

.backend-status {
  font-size: 14px;
}

.backend-status span {
  font-weight: bold;
}

.backend-status .checking {
  color: #ffd700;
}

.backend-status .online {
  color: #00ff00;
}

.backend-status .offline {
  color: #ff4444;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .intro-cards,
  .destinations-grid,
  .jobs-grid {
    grid-template-columns: 1fr;
  }

  .header .container {
    flex-direction: column;
    text-align: center;
  }

  .nav {
    justify-content: center;
  }
}
</style>
