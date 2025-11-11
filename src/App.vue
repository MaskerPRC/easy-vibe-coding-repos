<template>
  <div class="app">
    <div class="iframe-grid-container">
      <div
        v-for="index in totalIframes"
        :key="index"
        class="iframe-wrapper"
        :data-index="index"
      >
        <div
          class="iframe-placeholder"
          :ref="el => setIframeRef(el, index)"
        >
          <iframe
            v-if="loadedIframes.has(index)"
            :src="iframeUrl"
            class="iframe-content"
            :title="`Frame ${index}`"
            frameborder="0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
          <div v-else class="loading-placeholder">
            <div class="loading-spinner"></div>
            <span class="loading-text">{{ index }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 配置
const totalIframes = 1000;
const iframeUrl = 'https://play.apexstone.ai/';

// 状态管理
const loadedIframes = ref(new Set());
const iframeRefs = new Map();

// 设置 iframe 引用
const setIframeRef = (el, index) => {
  if (el) {
    iframeRefs.set(index, el);
  } else {
    iframeRefs.delete(index);
  }
};

// Intersection Observer 配置
let observer = null;

// 初始化 Intersection Observer
const initObserver = () => {
  const options = {
    root: null, // 使用视口作为根元素
    rootMargin: '200px', // 提前 200px 开始加载
    threshold: 0.01 // 当 1% 可见时触发
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.dataset.index || entry.target.closest('.iframe-wrapper')?.dataset.index);
        if (index && !loadedIframes.value.has(index)) {
          loadedIframes.value.add(index);
        }
      }
    });
  }, options);

  // 观察所有 iframe 占位符
  iframeRefs.forEach((el) => {
    if (el) {
      observer.observe(el);
    }
  });
};

// 生命周期钩子
onMounted(() => {
  // 延迟初始化 observer，确保所有元素都已渲染
  setTimeout(() => {
    initObserver();
  }, 100);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #F8F8F8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Source Han Sans', 'Hiragino Sans GB', 'Microsoft YaHei', 'Arial', 'Helvetica', sans-serif;
}

.iframe-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 24px;
  max-width: 100%;
  margin: 0 auto;
}

.iframe-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 200px;
}

.iframe-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  overflow: hidden;
}

.iframe-content {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.loading-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  color: #666666;
  gap: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #E0E0E0;
  border-top-color: #999999;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: #999999;
}

/* 响应式设计 */
@media (max-width: 1920px) {
  .iframe-grid-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 1440px) {
  .iframe-grid-container {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    padding: 20px;
  }
}

@media (max-width: 1024px) {
  .iframe-grid-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .iframe-grid-container {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
    padding: 12px;
  }

  .iframe-wrapper {
    min-height: 150px;
  }
}

@media (max-width: 480px) {
  .iframe-grid-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px;
    padding: 8px;
  }

  .iframe-wrapper {
    min-height: 120px;
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border-width: 2px;
  }

  .loading-text {
    font-size: 12px;
  }
}

/* 性能优化：减少重绘 */
.iframe-content {
  will-change: contents;
  transform: translateZ(0);
}
</style>
