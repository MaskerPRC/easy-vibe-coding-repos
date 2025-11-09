<template>
  <div class="gallery-container">
    <!-- 轮播图主体 -->
    <div class="carousel-wrapper">
      <!-- 主图片显示区域 -->
      <div class="carousel-main">
        <transition name="fade">
          <div
            class="carousel-item"
            :key="currentIndex"
            :style="{ backgroundImage: `url(${currentImage.url})` }"
          >
            <div class="image-overlay">
              <h2 class="star-name">{{ currentImage.name }}</h2>
              <p class="star-description">{{ currentImage.description }}</p>
            </div>
          </div>
        </transition>

        <!-- 左右切换按钮 -->
        <button class="nav-btn prev-btn" @click="prevImage" aria-label="上一张">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="nav-btn next-btn" @click="nextImage" aria-label="下一张">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <!-- 指示器 -->
        <div class="indicators">
          <button
            v-for="(image, index) in images"
            :key="index"
            class="indicator"
            :class="{ active: index === currentIndex }"
            @click="goToImage(index)"
            :aria-label="`切换到第 ${index + 1} 张`"
          ></button>
        </div>
      </div>

      <!-- 缩略图列表 -->
      <div class="thumbnail-list">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="thumbnail-item"
          :class="{ active: index === currentIndex }"
          @click="goToImage(index)"
          :style="{ backgroundImage: `url(${image.url})` }"
        >
          <div class="thumbnail-overlay">
            <span class="thumbnail-name">{{ image.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <button class="control-btn" @click="toggleAutoPlay" :title="isAutoPlay ? '暂停自动播放' : '开始自动播放'">
        <svg v-if="!isAutoPlay" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>

      <button class="control-btn" @click="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
        <svg v-if="!isFullscreen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
        </svg>
      </button>

      <button class="control-btn" @click="goToChat" title="进入聊天室">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </div>

    <!-- 网站标题 -->
    <div class="site-header">
      <h1 class="site-title">明星写真画廊</h1>
      <p class="site-subtitle">欣赏精彩瞬间</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentIndex = ref(0);
const isAutoPlay = ref(true);
const isFullscreen = ref(false);
let autoPlayTimer = null;

// 明星写真数据 - 使用高质量占位图片
const images = ref([
  {
    name: '时尚芭莎',
    description: '优雅时尚的红毯造型',
    url: 'https://picsum.photos/id/1011/1200/800'
  },
  {
    name: '阳光海滩',
    description: '清新自然的海边写真',
    url: 'https://picsum.photos/id/1012/1200/800'
  },
  {
    name: '都市风情',
    description: '现代都市时尚大片',
    url: 'https://picsum.photos/id/1013/1200/800'
  },
  {
    name: '复古魅力',
    description: '经典复古造型展示',
    url: 'https://picsum.photos/id/1014/1200/800'
  },
  {
    name: '运动活力',
    description: '活力四射运动风采',
    url: 'https://picsum.photos/id/1015/1200/800'
  },
  {
    name: '优雅晚礼',
    description: '华丽优雅晚礼服造型',
    url: 'https://picsum.photos/id/1016/1200/800'
  },
  {
    name: '街拍时尚',
    description: '潮流街拍精彩瞬间',
    url: 'https://picsum.photos/id/1018/1200/800'
  },
  {
    name: '艺术写真',
    description: '独特艺术风格展现',
    url: 'https://picsum.photos/id/1019/1200/800'
  }
]);

const currentImage = ref(images.value[0]);

// 切换到下一张
const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
  currentImage.value = images.value[currentIndex.value];
};

// 切换到上一张
const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length;
  currentImage.value = images.value[currentIndex.value];
};

// 跳转到指定图片
const goToImage = (index) => {
  currentIndex.value = index;
  currentImage.value = images.value[index];
};

// 自动播放控制
const toggleAutoPlay = () => {
  isAutoPlay.value = !isAutoPlay.value;
  if (isAutoPlay.value) {
    startAutoPlay();
  } else {
    stopAutoPlay();
  }
};

// 开始自动播放
const startAutoPlay = () => {
  stopAutoPlay();
  autoPlayTimer = setInterval(() => {
    nextImage();
  }, 4000);
};

// 停止自动播放
const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
};

// 全屏切换
const toggleFullscreen = () => {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(err => {
      console.error('无法进入全屏模式:', err);
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    });
  }
};

// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// 进入聊天室
const goToChat = () => {
  router.push('/chat');
};

// 键盘控制
const handleKeyPress = (e) => {
  switch(e.key) {
    case 'ArrowLeft':
      prevImage();
      break;
    case 'ArrowRight':
      nextImage();
      break;
    case ' ':
      e.preventDefault();
      toggleAutoPlay();
      break;
    case 'f':
    case 'F':
      toggleFullscreen();
      break;
  }
};

onMounted(() => {
  // 开始自动播放
  if (isAutoPlay.value) {
    startAutoPlay();
  }

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyPress);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  stopAutoPlay();
  window.removeEventListener('keydown', handleKeyPress);
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<style scoped>
.gallery-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Arial', 'Microsoft YaHei', sans-serif;
}

/* 网站标题 */
.site-header {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 100;
  pointer-events: none;
}

.site-title {
  font-size: 48px;
  font-weight: bold;
  color: #fff;
  margin: 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 4px;
}

.site-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 8px 0 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}

/* 轮播图包装器 */
.carousel-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1200px;
  margin-top: 40px;
}

/* 主轮播区域 */
.carousel-main {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* 轮播项 */
.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 图片遮罩层 */
.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 40px 30px 30px;
  color: #fff;
}

.star-name {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.star-description {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 导航按钮 */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  color: #fff;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.nav-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

/* 指示器 */
.indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.2);
}

.indicator.active {
  background: #fff;
  width: 30px;
  border-radius: 6px;
}

/* 缩略图列表 */
.thumbnail-list {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  overflow-x: auto;
  padding: 10px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.thumbnail-list::-webkit-scrollbar {
  height: 6px;
}

.thumbnail-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.thumbnail-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.thumbnail-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.thumbnail-item {
  flex-shrink: 0;
  width: 140px;
  height: 100px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  overflow: hidden;
}

.thumbnail-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.thumbnail-item.active {
  border-color: #fff;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
}

.thumbnail-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 8px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.thumbnail-item:hover .thumbnail-overlay,
.thumbnail-item.active .thumbnail-overlay {
  transform: translateY(0);
}

.thumbnail-name {
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 控制面板 */
.control-panel {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  gap: 15px;
  z-index: 100;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.control-btn:active {
  transform: scale(0.95);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 - 平板 */
@media screen and (max-width: 768px) {
  .site-title {
    font-size: 32px;
    letter-spacing: 2px;
  }

  .site-subtitle {
    font-size: 14px;
  }

  .carousel-wrapper {
    width: 95%;
    margin-top: 20px;
  }

  .carousel-main {
    height: 350px;
  }

  .star-name {
    font-size: 24px;
  }

  .star-description {
    font-size: 14px;
  }

  .nav-btn {
    width: 50px;
    height: 50px;
  }

  .nav-btn svg {
    width: 30px;
    height: 30px;
  }

  .prev-btn {
    left: 10px;
  }

  .next-btn {
    right: 10px;
  }

  .thumbnail-item {
    width: 100px;
    height: 70px;
  }

  .control-panel {
    bottom: 20px;
    right: 20px;
    gap: 10px;
  }

  .control-btn {
    width: 44px;
    height: 44px;
  }
}

/* 响应式设计 - 手机 */
@media screen and (max-width: 480px) {
  .site-header {
    top: 15px;
  }

  .site-title {
    font-size: 24px;
    letter-spacing: 1px;
  }

  .site-subtitle {
    font-size: 12px;
  }

  .carousel-wrapper {
    width: 100%;
    margin-top: 10px;
  }

  .carousel-main {
    height: 280px;
    border-radius: 0;
  }

  .image-overlay {
    padding: 20px 15px 15px;
  }

  .star-name {
    font-size: 20px;
    margin-bottom: 5px;
  }

  .star-description {
    font-size: 12px;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }

  .nav-btn svg {
    width: 24px;
    height: 24px;
  }

  .prev-btn {
    left: 5px;
  }

  .next-btn {
    right: 5px;
  }

  .indicators {
    bottom: 10px;
    gap: 6px;
  }

  .indicator {
    width: 8px;
    height: 8px;
  }

  .indicator.active {
    width: 20px;
  }

  .thumbnail-list {
    gap: 10px;
    margin-top: 15px;
  }

  .thumbnail-item {
    width: 80px;
    height: 60px;
  }

  .thumbnail-name {
    font-size: 10px;
  }

  .control-panel {
    bottom: 15px;
    right: 15px;
    gap: 8px;
  }

  .control-btn {
    width: 40px;
    height: 40px;
  }

  .control-btn svg {
    width: 20px;
    height: 20px;
  }
}

/* 横屏优化 */
@media screen and (max-height: 500px) and (orientation: landscape) {
  .site-header {
    top: 10px;
  }

  .site-title {
    font-size: 20px;
  }

  .site-subtitle {
    font-size: 10px;
  }

  .carousel-wrapper {
    margin-top: 5px;
  }

  .carousel-main {
    height: 250px;
  }

  .thumbnail-list {
    margin-top: 10px;
  }

  .control-panel {
    bottom: 10px;
    right: 10px;
  }
}
</style>
