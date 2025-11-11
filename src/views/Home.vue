<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="hero-slider">
      <div class="slider-container">
        <div class="slider-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div v-for="(slide, index) in slides" :key="index" class="slide">
            <div class="slide-content">
              <div class="slide-text">
                <h1>{{ slide.title }}</h1>
                <p>{{ slide.subtitle }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="slider-dots">
          <span
            v-for="(slide, index) in slides"
            :key="index"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>
    </div>

    <!-- 精选内容 -->
    <div class="featured-content">
      <div class="container">
        <h2 class="section-title">精选内容</h2>
        <div class="cards-grid">
          <div v-for="card in featuredCards" :key="card.id" class="card">
            <div class="card-icon">{{ card.icon }}</div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-description">{{ card.description }}</p>
            <router-link :to="card.link" class="card-link">了解更多 →</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新动态 -->
    <div class="latest-news">
      <div class="container">
        <h2 class="section-title">最新动态</h2>
        <div class="news-list">
          <div v-for="news in latestNews" :key="news.id" class="news-item">
            <div class="news-date">{{ news.date }}</div>
            <div class="news-content">
              <h3>{{ news.title }}</h3>
              <p>{{ news.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 蔡徐坤个人印象站 | 粉丝自发创建</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentSlide = ref(0);
const slides = ref([
  {
    title: '蔡徐坤',
    subtitle: '音乐制作人 | 演员 | 歌手'
  },
  {
    title: '用音乐传递态度',
    subtitle: '始终坚持原创，用作品说话'
  },
  {
    title: '与粉丝一起成长',
    subtitle: '感恩每一份支持与陪伴'
  }
]);

const featuredCards = ref([
  {
    id: 1,
    icon: '🏆',
    title: '辉煌事迹',
    description: '记录蔡徐坤在音乐、舞蹈、影视等领域的重要成就',
    link: '/achievements'
  },
  {
    id: 2,
    icon: '📈',
    title: '成长历程',
    description: '从练习生到艺人，见证每一步的成长与蜕变',
    link: '/timeline'
  },
  {
    id: 3,
    icon: '💛',
    title: '粉丝生态',
    description: '了解粉丝应援文化，感受温暖的粉丝社群',
    link: '/fans'
  }
]);

const latestNews = ref([
  {
    id: 1,
    date: '2024-11',
    title: '新专辑筹备中',
    content: '蔡徐坤正在筹备全新音乐专辑，敬请期待'
  },
  {
    id: 2,
    date: '2024-10',
    title: '公益活动',
    content: '参与多项公益活动，用影响力传递正能量'
  },
  {
    id: 3,
    date: '2024-09',
    title: '演唱会巡演',
    content: '全国巡回演唱会圆满落幕，感谢粉丝的支持'
  }
]);

let slideInterval = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});
</script>

<style scoped>
.home {
  padding-top: 64px;
}

/* 轮播图样式 */
.hero-slider {
  width: 100%;
  height: 500px;
  overflow: hidden;
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  position: relative;
}

.slider-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.slider-track {
  display: flex;
  height: 100%;
  transition: transform 0.6s ease;
}

.slide {
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-content {
  text-align: center;
  color: #FFFFFF;
  padding: 48px;
}

.slide-text h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.slide-text p {
  font-size: 24px;
  font-weight: 400;
  opacity: 0.95;
}

.slider-dots {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.slider-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
}

.slider-dots span.active {
  background: #FFD700;
  width: 32px;
  border-radius: 6px;
}

/* 内容区域 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: #333333;
  text-align: center;
  margin-bottom: 48px;
}

/* 精选内容 */
.featured-content {
  padding: 80px 0;
  background: #F5F5F5;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  text-align: center;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.15);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.card-description {
  font-size: 16px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.card-link {
  color: #007AFF;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.card-link:hover {
  color: #FFD700;
}

/* 最新动态 */
.latest-news {
  padding: 80px 0;
  background: #FFFFFF;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.news-item {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: #F5F5F5;
  border-radius: 8px;
  border-left: 4px solid #007AFF;
  transition: all 0.3s;
}

.news-item:hover {
  background: #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.news-date {
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 600;
  color: #007AFF;
  min-width: 80px;
}

.news-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.news-content p {
  font-size: 16px;
  color: #666666;
  line-height: 1.6;
}

/* 页脚 */
.footer {
  background: #333333;
  color: #FFFFFF;
  text-align: center;
  padding: 32px 0;
}

.footer p {
  margin: 0;
  opacity: 0.8;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .hero-slider {
    height: 400px;
  }

  .slide-text h1 {
    font-size: 32px;
  }

  .slide-text p {
    font-size: 18px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 32px;
  }

  .featured-content,
  .latest-news {
    padding: 48px 0;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .news-item {
    flex-direction: column;
    gap: 12px;
  }

  .news-date {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .hero-slider {
    height: 300px;
  }

  .slide-text h1 {
    font-size: 24px;
  }

  .slide-text p {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .card {
    padding: 24px;
  }
}
</style>
