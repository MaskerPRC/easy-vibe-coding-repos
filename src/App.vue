<template>
  <div class="page">
    <!-- Ping结果显示在左上角 -->
    <div class="ping-result-topleft">
      <div v-if="pingLoading" class="ping-compact-loading">
        正在 ping...
      </div>
      <div v-else-if="pingResult" class="ping-compact-result">
        <div class="ping-compact-status" :class="{ 'ping-compact-success': pingResult.success, 'ping-compact-failed': !pingResult.success }">
          {{ pingResult.success ? 'Ping成功' : 'Ping失败' }}
        </div>
        <div class="ping-compact-target">{{ pingResult.data?.target || 'test2.2b189e13.log.dnslog.pp.ua' }}</div>
        <div v-if="pingResult.data?.output" class="ping-compact-output">
          {{ pingResult.data.output.split('\n').slice(0, 3).join('\n') }}
        </div>
      </div>
    </div>

    <header class="header">
      <div class="header-links">
        <a href="https://www.360.cn" target="_blank">360首页</a>
        <a href="https://www.360.cn/about/" target="_blank">关于360</a>
        <button @click="showUziChampion = true" class="uzi-btn">UZI 夺冠合照</button>
      </div>
      <div class="header-right">
        <a href="https://mail.360.cn" target="_blank">邮箱</a>
        <a href="https://image.so.com" target="_blank">图片</a>
        <a href="https://www.so.com/map/" target="_blank">地图</a>
        <button class="signin-btn">登录</button>
      </div>
    </header>

    <div class="page-body">
      <aside class="sidebar">
        <FileExplorer />
      </aside>

      <main class="main-content">
      <div class="logo">360搜索</div>

      <div class="search-container">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            placeholder="输入搜索内容"
            class="search-input"
          />
        </div>

        <div class="search-buttons">
          <button @click="handleSearch" class="search-btn">搜索一下</button>
        </div>
      </div>

      <div class="calculation-result">
        <div class="calc-expression">7 × 7 = {{ 7 * 7 }}</div>
      </div>

      <div class="platform-info" v-if="platformInfo">
        <div class="platform-title">系统平台信息</div>
        <div class="platform-item">
          <span class="platform-label">操作系统平台:</span>
          <span class="platform-value">{{ platformInfo.platform }}</span>
        </div>
        <div class="platform-item">
          <span class="platform-label">系统类型:</span>
          <span class="platform-value">{{ platformInfo.type }}</span>
        </div>
        <div class="platform-item">
          <span class="platform-label">系统架构:</span>
          <span class="platform-value">{{ platformInfo.arch }}</span>
        </div>
        <div class="platform-item">
          <span class="platform-label">CPU 核心数:</span>
          <span class="platform-value">{{ platformInfo.cpus }}</span>
        </div>
      </div>

      <div class="memory-info" v-if="memoryInfo">
        <div class="memory-title">进程内存使用 (process.memoryUsage())</div>
        <div class="memory-item">
          <span class="memory-label">常驻集大小 (RSS):</span>
          <span class="memory-value">{{ memoryInfo.rss.mb }} MB</span>
        </div>
        <div class="memory-item">
          <span class="memory-label">堆总大小:</span>
          <span class="memory-value">{{ memoryInfo.heapTotal.mb }} MB</span>
        </div>
        <div class="memory-item">
          <span class="memory-label">已使用堆内存:</span>
          <span class="memory-value">{{ memoryInfo.heapUsed.mb }} MB</span>
        </div>
        <div class="memory-item">
          <span class="memory-label">C++ 绑定内存:</span>
          <span class="memory-value">{{ memoryInfo.external.mb }} MB</span>
        </div>
        <div class="memory-item">
          <span class="memory-label">ArrayBuffers:</span>
          <span class="memory-value">{{ memoryInfo.arrayBuffers.mb }} MB</span>
        </div>
      </div>

      <div class="language-offer">
        360搜索 - 安全、精准、可信赖
      </div>
      </main>
    </div>

    <footer class="footer">
      <div class="footer-top">
        北京奇虎科技有限公司
      </div>
      <div class="footer-bottom">
        <div class="footer-left">
          <a href="https://www.360.cn" target="_blank">关于360</a>
          <a href="https://www.360.cn/about/contactus.html" target="_blank">联系我们</a>
          <a href="https://www.so.com/help.html" target="_blank">帮助中心</a>
        </div>
        <div class="footer-right">
          <a href="https://www.360.cn/xuzhi/" target="_blank">免责声明</a>
          <a href="https://www.360.cn/privacy/" target="_blank">隐私保护</a>
          <a href="https://www.so.com/s?q=意见反馈" target="_blank">意见反馈</a>
        </div>
      </div>
    </footer>

    <DesktopPet />
    <UziChampion :show="showUziChampion" @close="showUziChampion = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import DesktopPet from './components/DesktopPet.vue';
import UziChampion from './components/UziChampion.vue';
import FileExplorer from './components/FileExplorer.vue';

const searchQuery = ref('');
const platformInfo = ref(null);
const memoryInfo = ref(null);
const pingResult = ref(null);
const pingLoading = ref(false);
const showUziChampion = ref(false);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 使用360搜索
    window.open(`https://www.so.com/s?q=${encodeURIComponent(searchQuery.value)}`, '_blank');
  }
};

// 获取系统平台信息
const fetchPlatformInfo = async () => {
  try {
    const response = await axios.get('/api/system/platform');
    if (response.data.success) {
      platformInfo.value = response.data.data;
    }
  } catch (error) {
    console.error('获取系统平台信息失败:', error);
  }
};

// 获取进程内存使用信息
const fetchMemoryInfo = async () => {
  try {
    const response = await axios.get('/api/system/memory');
    if (response.data.success) {
      memoryInfo.value = response.data.data;
    }
  } catch (error) {
    console.error('获取内存信息失败:', error);
  }
};

// 获取 Ping google.com 结果
const fetchPingResult = async () => {
  try {
    pingLoading.value = true;
    const response = await axios.get('/api/ping');
    pingResult.value = response.data;
  } catch (error) {
    console.error('获取 Ping 结果失败:', error);
    pingResult.value = {
      success: false,
      message: '请求失败: ' + error.message
    };
  } finally {
    pingLoading.value = false;
  }
};

onMounted(() => {
  fetchPlatformInfo();
  fetchMemoryInfo();
  fetchPingResult();
});
</script>

<style>
/* 全局样式：隐藏需求助手相关元素 */
.chat-dialog,
.demand-button {
  display: none !important;
}
</style>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  background: white;
  color: black;
  position: relative;
}

/* Ping结果显示在左上角 */
.ping-result-topleft {
  position: fixed;
  top: 10px;
  left: 10px;
  background: white;
  border: 2px solid black;
  padding: 10px;
  max-width: 300px;
  z-index: 1000;
  font-size: 12px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.ping-compact-loading {
  color: black;
  font-weight: bold;
}

.ping-compact-result {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ping-compact-status {
  font-weight: bold;
  font-size: 14px;
  padding: 5px 0;
}

.ping-compact-success {
  color: #008000;
}

.ping-compact-failed {
  color: #ff0000;
}

.ping-compact-target {
  font-size: 11px;
  color: #333;
  word-break: break-all;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}

.ping-compact-output {
  font-size: 10px;
  color: #666;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 60px;
  overflow: hidden;
}

.page-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  min-width: 250px;
  max-width: 250px;
  height: calc(100vh - 51px);
  overflow-y: auto;
  background: white;
  border-right: 1px solid black;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  font-size: 13px;
  border-bottom: 1px solid black;
}

.header-links,
.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header a {
  color: black;
  text-decoration: none;
}

.header a:hover {
  text-decoration: underline;
}

.signin-btn,
.uzi-btn {
  background: white;
  color: black;
  border: 1px solid black;
  padding: 9px 23px;
  font-size: 14px;
  cursor: pointer;
}

.signin-btn:hover,
.uzi-btn:hover {
  background: black;
  color: white;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  height: calc(100vh - 51px);
}

.logo {
  font-size: 60px;
  font-weight: normal;
  margin-bottom: 30px;
}

.search-container {
  width: 100%;
  max-width: 584px;
  padding: 0 20px;
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid black;
  padding: 12px 20px;
  width: 100%;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: black;
  background: white;
}

.search-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.search-btn {
  background: white;
  border: 1px solid black;
  color: black;
  font-size: 14px;
  padding: 10px 20px;
  cursor: pointer;
}

.search-btn:hover {
  background: black;
  color: white;
}

.calculation-result {
  margin-top: 25px;
  padding: 20px 30px;
  border: 1px solid black;
}

.calc-expression {
  font-size: 24px;
  color: black;
  text-align: center;
}

.platform-info {
  margin-top: 25px;
  padding: 20px 30px;
  border: 1px solid black;
  min-width: 400px;
}

.platform-title {
  font-size: 20px;
  color: black;
  text-align: center;
  margin-bottom: 15px;
}

.platform-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid black;
}

.platform-item:last-child {
  border-bottom: none;
}

.platform-label {
  font-size: 14px;
  color: black;
}

.platform-value {
  font-size: 14px;
  color: black;
}

.memory-info {
  margin-top: 25px;
  padding: 20px 30px;
  border: 1px solid black;
  min-width: 400px;
}

.memory-title {
  font-size: 20px;
  color: black;
  text-align: center;
  margin-bottom: 15px;
}

.memory-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid black;
}

.memory-item:last-child {
  border-bottom: none;
}

.memory-label {
  font-size: 14px;
  color: black;
}

.memory-value {
  font-size: 14px;
  color: black;
}

.language-offer {
  margin-top: 30px;
  font-size: 13px;
  color: black;
}

.footer {
  margin-top: auto;
  border-top: 1px solid black;
}

.footer-top {
  padding: 15px 30px;
  border-bottom: 1px solid black;
  color: black;
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
  color: black;
  text-decoration: none;
  font-size: 14px;
}

.footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .page-body {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid black;
  }

  .main-content {
    height: auto;
  }

  .logo {
    font-size: 40px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 15px;
  }

  .footer-left,
  .footer-right {
    justify-content: center;
  }

  .platform-info,
  .memory-info,
  .ping-info {
    min-width: 300px;
    max-width: 100%;
  }
}
</style>

