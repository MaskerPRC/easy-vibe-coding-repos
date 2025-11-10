<template>
  <div class="star-carousel">
    <div class="carousel-header">
      <h1 class="title">明星写真展示</h1>
      <p class="subtitle">精选明星艺术照片欣赏</p>
    </div>

    <div class="carousel-container">
      <!-- 左侧箭头 -->
      <button class="carousel-btn prev" @click="prevSlide" aria-label="上一张">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <!-- 轮播图主体 -->
      <div class="carousel-wrapper">
        <transition-group name="slide" tag="div" class="carousel-slides">
          <div
            v-for="(star, index) in stars"
            :key="star.id"
            v-show="index === currentIndex"
            class="carousel-slide"
          >
            <div class="image-container">
              <img :src="star.image" :alt="star.name" class="star-image" />
              <div class="image-overlay">
                <h2 class="star-name">{{ star.name }}</h2>
                <p class="star-desc">{{ star.description }}</p>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 右侧箭头 -->
      <button class="carousel-btn next" @click="nextSlide" aria-label="下一张">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- 指示器 -->
    <div class="carousel-indicators">
      <button
        v-for="(star, index) in stars"
        :key="`indicator-${star.id}`"
        :class="['indicator', { active: index === currentIndex }]"
        @click="goToSlide(index)"
        :aria-label="`跳转到第 ${index + 1} 张`"
      ></button>
    </div>

    <!-- 缩略图预览 -->
    <div class="thumbnail-list">
      <div
        v-for="(star, index) in stars"
        :key="`thumb-${star.id}`"
        :class="['thumbnail', { active: index === currentIndex }]"
        @click="goToSlide(index)"
      >
        <img :src="star.image" :alt="star.name" />
        <span class="thumbnail-name">{{ star.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentIndex = ref(0);
let autoPlayTimer = null;

// 明星数据（使用占位图片）
const stars = ref([
  {
    id: 1,
    name: '刘亦菲',
    description: '中国知名女演员，神仙姐姐',
    image: 'https://picsum.photos/800/600?random=1'
  },
  {
    id: 2,
    name: '胡歌',
    description: '中国知名男演员，实力派',
    image: 'https://picsum.photos/800/600?random=2'
  },
  {
    id: 3,
    name: '杨幂',
    description: '中国知名女演员，大幂幂',
    image: 'https://picsum.photos/800/600?random=3'
  },
  {
    id: 4,
    name: '周杰伦',
    description: '华语乐坛天王，才华横溢',
    image: 'https://picsum.photos/800/600?random=4'
  },
  {
    id: 5,
    name: '赵丽颖',
    description: '中国知名女演员，演技精湛',
    image: 'https://picsum.photos/800/600?random=5'
  },
  {
    id: 6,
    name: '易烊千玺',
    description: '中国新生代演员，多才多艺',
    image: 'https://picsum.photos/800/600?random=6'
  }
]);

// 下一张
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % stars.value.length;
};

// 上一张
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + stars.value.length) % stars.value.length;
};

// 跳转到指定幻灯片
const goToSlide = (index) => {
  currentIndex.value = index;
};

// 自动播放
const startAutoPlay = () => {
  autoPlayTimer = setInterval(() => {
    nextSlide();
  }, 4000); // 每4秒切换一次
};

// 停止自动播放
const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
};

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
.star-carousel {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.carousel-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.carousel-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
}

.carousel-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.carousel-slides {
  position: relative;
  width: 100%;
  height: 600px;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.star-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  padding: 40px 30px 30px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.carousel-slide:hover .image-overlay {
  transform: translateY(0);
}

.star-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.star-desc {
  font-size: 1.1rem;
  opacity: 0.95;
}

.carousel-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.carousel-btn:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.carousel-btn:active {
  transform: scale(0.95);
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 30px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator.active {
  background: white;
  transform: scale(1.3);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
}

.thumbnail-list {
  max-width: 1000px;
  margin: 40px auto 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.thumbnail {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  background: white;
}

.thumbnail:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.thumbnail.active {
  border-color: #ffd700;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
}

.thumbnail img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.thumbnail-name {
  display: block;
  padding: 10px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  background: white;
}

/* 过渡动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.6s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .carousel-container {
    gap: 10px;
  }

  .carousel-slides {
    height: 400px;
  }

  .carousel-btn {
    width: 40px;
    height: 40px;
  }

  .star-name {
    font-size: 1.5rem;
  }

  .star-desc {
    font-size: 0.95rem;
  }

  .thumbnail-list {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 10px;
  }

  .thumbnail img {
    height: 80px;
  }

  .thumbnail-name {
    font-size: 0.8rem;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.5rem;
  }

  .carousel-slides {
    height: 300px;
  }

  .carousel-btn {
    width: 35px;
    height: 35px;
  }

  .image-overlay {
    padding: 20px 15px 15px;
  }

  .star-name {
    font-size: 1.2rem;
  }

  .star-desc {
    font-size: 0.85rem;
  }
}
</style>
