<template>
  <div class="carousel-container">
    <div class="carousel-header">
      <h1 class="title">明星写真展</h1>
      <p class="subtitle">精彩瞬间 · 璀璨星光</p>
    </div>

    <div class="carousel-wrapper">
      <div class="carousel-content" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(star, index) in stars" :key="index" class="carousel-slide">
          <div class="slide-inner">
            <img :src="star.image" :alt="star.name" class="star-image" />
            <div class="star-info">
              <h2 class="star-name">{{ star.name }}</h2>
              <p class="star-description">{{ star.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 导航按钮 -->
      <button class="carousel-btn prev-btn" @click="prevSlide" aria-label="上一张">
        <span>‹</span>
      </button>
      <button class="carousel-btn next-btn" @click="nextSlide" aria-label="下一张">
        <span>›</span>
      </button>

      <!-- 指示器 -->
      <div class="carousel-indicators">
        <button
          v-for="(star, index) in stars"
          :key="index"
          :class="['indicator', { active: currentIndex === index }]"
          @click="goToSlide(index)"
          :aria-label="`跳转到第${index + 1}张`"
        ></button>
      </div>
    </div>

    <!-- 缩略图预览 -->
    <div class="thumbnails">
      <div
        v-for="(star, index) in stars"
        :key="index"
        :class="['thumbnail', { active: currentIndex === index }]"
        @click="goToSlide(index)"
      >
        <img :src="star.image" :alt="star.name" />
        <div class="thumbnail-name">{{ star.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentIndex = ref(0)
let autoPlayInterval = null

// 明星数据（使用占位图片）
const stars = ref([
  {
    name: '奥黛丽·赫本',
    description: '经典优雅的代名词，永恒的时尚icon',
    image: 'https://picsum.photos/800/600?random=1'
  },
  {
    name: '玛丽莲·梦露',
    description: '好莱坞黄金时代的传奇巨星',
    image: 'https://picsum.photos/800/600?random=2'
  },
  {
    name: '成龙',
    description: '国际功夫巨星，中国电影的骄傲',
    image: 'https://picsum.photos/800/600?random=3'
  },
  {
    name: '周润发',
    description: '香港电影的标志性人物',
    image: 'https://picsum.photos/800/600?random=4'
  },
  {
    name: '章子怡',
    description: '国际知名女演员，演技派代表',
    image: 'https://picsum.photos/800/600?random=5'
  },
  {
    name: '巩俐',
    description: '威尼斯影后，中国影坛巨星',
    image: 'https://picsum.photos/800/600?random=6'
  }
])

// 下一张
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % stars.value.length
}

// 上一张
const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? stars.value.length - 1 : currentIndex.value - 1
}

// 跳转到指定幻灯片
const goToSlide = (index) => {
  currentIndex.value = index
}

// 自动播放
const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    nextSlide()
  }, 4000) // 每4秒切换一次
}

// 停止自动播放
const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.carousel-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
}

.title {
  font-size: 3.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(240, 147, 251, 0.3);
}

.subtitle {
  font-size: 1.3rem;
  color: #e0e0e0;
  letter-spacing: 0.3rem;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 600px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  margin-bottom: 2rem;
}

.carousel-content {
  display: flex;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.slide-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.star-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.star-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 60%, transparent 100%);
  padding: 3rem 2rem 2rem;
  color: white;
}

.star-name {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.star-description {
  font-size: 1.2rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* 导航按钮 */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.carousel-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #1a1a2e;
  transform: translateY(-50%) scale(1.1);
  border-color: white;
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

/* 指示器 */
.carousel-indicators {
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
  border: 2px solid white;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.2);
}

.indicator.active {
  background: white;
  width: 30px;
  border-radius: 6px;
}

/* 缩略图 */
.thumbnails {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 900px;
  padding: 1rem;
}

.thumbnail {
  width: 120px;
  height: 90px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.thumbnail:hover {
  opacity: 1;
  transform: translateY(-5px);
}

.thumbnail.active {
  border-color: #f093fb;
  opacity: 1;
  box-shadow: 0 5px 20px rgba(240, 147, 251, 0.5);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnail-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 0.75rem;
  padding: 0.3rem;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
    letter-spacing: 0.1rem;
  }

  .carousel-wrapper {
    height: 400px;
  }

  .star-name {
    font-size: 1.5rem;
  }

  .star-description {
    font-size: 0.9rem;
  }

  .carousel-btn {
    width: 45px;
    height: 45px;
    font-size: 1.8rem;
  }

  .prev-btn {
    left: 10px;
  }

  .next-btn {
    right: 10px;
  }

  .thumbnail {
    width: 80px;
    height: 60px;
  }

  .thumbnail-name {
    font-size: 0.6rem;
  }
}
</style>
