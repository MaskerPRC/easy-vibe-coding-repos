<template>
  <div class="app">
    <!-- 顶部工具栏 -->
    <div class="toolbar" :class="{ 'toolbar-hidden': isFullscreen }">
      <div class="toolbar-container">
        <h1 class="app-title">网页浏览器</h1>

        <!-- URL 输入区域 -->
        <div class="url-bar">
          <input
            v-model="currentUrl"
            type="text"
            class="url-input"
            placeholder="请输入网址，例如: https://www.example.com"
            @keyup.enter="loadUrl"
          />
          <button @click="loadUrl" class="btn btn-primary">访问</button>
          <button @click="refreshIframe" class="btn btn-secondary" :disabled="!iframeUrl">刷新</button>
          <button @click="toggleFullscreen" class="btn btn-secondary" :disabled="!iframeUrl">
            {{ isFullscreen ? '退出全屏' : '全屏' }}
          </button>
        </div>

        <!-- 快捷网站按钮 -->
        <div class="quick-sites">
          <span class="quick-sites-label">快捷访问：</span>
          <button
            v-for="site in quickSites"
            :key="site.name"
            @click="loadQuickSite(site.url)"
            class="btn btn-small"
            :title="site.url"
          >
            {{ site.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- iframe 显示区域 -->
    <div class="iframe-container" :class="{ 'fullscreen': isFullscreen }">
      <div v-if="!iframeUrl" class="welcome-screen">
        <div class="welcome-content">
          <div class="welcome-icon">🌐</div>
          <h2>欢迎使用 iframe 浏览器</h2>
          <p>请在上方输入网址或选择快捷访问的网站</p>
          <div class="welcome-tips">
            <h3>使用提示：</h3>
            <ul>
              <li>在输入框中输入完整的网址（包含 https:// 或 http://）</li>
              <li>点击快捷按钮可以快速访问常用网站</li>
              <li>支持全屏模式，提供更好的浏览体验</li>
              <li>某些网站可能因安全策略无法在 iframe 中加载</li>
            </ul>
          </div>
        </div>
      </div>

      <iframe
        v-else
        :key="iframeKey"
        ref="iframeRef"
        :src="iframeUrl"
        class="iframe-content"
        frameborder="0"
        allowfullscreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
        @load="onIframeLoad"
        @error="onIframeError"
      ></iframe>

      <!-- 加载指示器 -->
      <div v-if="isLoading && iframeUrl" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>正在加载...</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-overlay">
        <div class="error-content">
          <div class="error-icon">⚠️</div>
          <h3>加载失败</h3>
          <p>{{ error }}</p>
          <button @click="closeError" class="btn btn-primary">关闭</button>
        </div>
      </div>
    </div>

    <!-- 全屏模式下的退出按钮 -->
    <button
      v-if="isFullscreen"
      @click="toggleFullscreen"
      class="fullscreen-exit-btn"
      title="退出全屏"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据（存储在内存中）
const currentUrl = ref('')
const iframeUrl = ref('')
const iframeKey = ref(0)
const isFullscreen = ref(false)
const isLoading = ref(false)
const error = ref('')
const iframeRef = ref(null)

// 快捷网站列表（存储在内存中）
const quickSites = ref([
  { name: '百度', url: 'https://www.baidu.com' },
  { name: '必应', url: 'https://www.bing.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' },
  { name: 'MDN', url: 'https://developer.mozilla.org' },
  { name: 'Vue.js', url: 'https://vuejs.org' },
])

// 加载 URL
const loadUrl = () => {
  let url = currentUrl.value.trim()

  if (!url) {
    error.value = '请输入网址'
    return
  }

  // 自动添加协议
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  // 验证 URL 格式
  try {
    new URL(url)
  } catch (e) {
    error.value = '网址格式不正确，请输入有效的网址'
    return
  }

  error.value = ''
  isLoading.value = true
  iframeUrl.value = url
  currentUrl.value = url
}

// 加载快捷网站
const loadQuickSite = (url) => {
  currentUrl.value = url
  loadUrl()
}

// 刷新 iframe
const refreshIframe = () => {
  if (iframeUrl.value) {
    isLoading.value = true
    iframeKey.value++
  }
}

// 切换全屏模式
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// iframe 加载完成
const onIframeLoad = () => {
  isLoading.value = false
  error.value = ''
}

// iframe 加载错误
const onIframeError = () => {
  isLoading.value = false
  error.value = '无法加载此网站。某些网站可能禁止在 iframe 中显示。'
}

// 关闭错误提示
const closeError = () => {
  error.value = ''
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 工具栏 */
.toolbar {
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  z-index: 100;
}

.toolbar-hidden {
  transform: translateY(-100%);
  position: absolute;
  width: 100%;
}

.toolbar-container {
  max-width: 1400px;
  margin: 0 auto;
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
}

/* URL 输入栏 */
.url-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.url-input {
  flex: 1;
  min-width: 200px;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.url-input:focus {
  outline: none;
  border-color: #4CAF50;
}

/* 按钮样式 */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.btn-secondary {
  background: #2196F3;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #1976D2;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.btn-small {
  padding: 8px 16px;
  font-size: 13px;
  background: #f0f0f0;
  color: #333;
}

.btn-small:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
}

/* 快捷网站 */
.quick-sites {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.quick-sites-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* iframe 容器 */
.iframe-container {
  flex: 1;
  position: relative;
  background: white;
  overflow: hidden;
}

.iframe-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}

.iframe-content {
  width: 100%;
  height: 100%;
  border: none;
}

/* 欢迎屏幕 */
.welcome-screen {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.welcome-content {
  text-align: center;
  max-width: 600px;
}

.welcome-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.welcome-content h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.welcome-content > p {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.welcome-tips {
  text-align: left;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.welcome-tips h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.welcome-tips ul {
  list-style: none;
  padding: 0;
}

.welcome-tips li {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
}

.welcome-tips li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4CAF50;
  font-weight: bold;
}

/* 加载指示器 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  font-size: 16px;
  color: #666;
}

/* 错误提示 */
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  padding: 20px;
}

.error-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
}

.error-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.error-content h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.error-content p {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
  line-height: 1.6;
}

/* 全屏退出按钮 */
.fullscreen-exit-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-exit-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .toolbar {
    padding: 15px;
  }

  .app-title {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .url-bar {
    flex-direction: column;
  }

  .url-input {
    width: 100%;
  }

  .btn {
    width: 100%;
  }

  .quick-sites {
    flex-direction: column;
    align-items: flex-start;
  }

  .quick-sites-label {
    margin-bottom: 5px;
  }

  .btn-small {
    width: 100%;
  }

  .welcome-content h2 {
    font-size: 22px;
  }

  .welcome-icon {
    font-size: 60px;
  }

  .welcome-tips {
    padding: 15px;
  }

  .fullscreen-exit-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .toolbar {
    padding: 10px;
  }

  .app-title {
    font-size: 18px;
  }

  .url-input {
    font-size: 13px;
    padding: 10px 12px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 13px;
  }

  .welcome-content h2 {
    font-size: 20px;
  }

  .welcome-tips h3 {
    font-size: 16px;
  }

  .welcome-tips li {
    font-size: 13px;
  }
}
</style>
