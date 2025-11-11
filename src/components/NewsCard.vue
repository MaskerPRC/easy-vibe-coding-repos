<template>
  <div class="news-card" @click="handleClick">
    <!-- 新闻图片 -->
    <div class="news-image">
      <img :src="news.image" :alt="news.title" @error="handleImageError" />
      <span v-if="news.isHot" class="hot-badge">热</span>
    </div>

    <!-- 新闻内容 -->
    <div class="news-content">
      <!-- 标题 -->
      <h3 class="news-title">{{ news.title }}</h3>

      <!-- 摘要 -->
      <p class="news-summary">{{ news.summary }}</p>

      <!-- 底部信息 -->
      <div class="news-meta">
        <span class="news-category">{{ news.category }}</span>
        <span class="news-source">{{ news.source }}</span>
        <span class="news-time">{{ news.time }}</span>
        <span class="news-views">{{ formatViews(news.views) }}阅读</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsCard',
  props: {
    news: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.news);
    },
    handleImageError(e) {
      // 图片加载失败时使用默认占位图
      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgZmlsbD0iI0Y1RjVGNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7mlrDpl7vlm77niYc8L3RleHQ+PC9zdmc+';
    },
    formatViews(views) {
      if (views >= 10000) {
        return (views / 10000).toFixed(1) + '万';
      }
      return views;
    }
  }
}
</script>

<style scoped>
.news-card {
  background-color: #FFFFFF;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #E5E5E5;
  display: flex;
  gap: 16px;
  padding: 16px;
}

.news-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 新闻图片 */
.news-image {
  position: relative;
  width: 200px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #F5F5F5;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.hot-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #CC0000;
  color: #FFFFFF;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
}

/* 新闻内容 */
.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s;
}

.news-card:hover .news-title {
  color: #4065D4;
}

.news-summary {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 底部信息 */
.news-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999999;
  flex-wrap: wrap;
}

.news-category {
  color: #4065D4;
  background-color: #E8EEFF;
  padding: 2px 8px;
  border-radius: 2px;
  font-weight: 500;
}

.news-source,
.news-time,
.news-views {
  display: flex;
  align-items: center;
}

.news-source::before {
  content: '•';
  margin-right: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .news-card {
    flex-direction: column;
    padding: 12px;
  }

  .news-image {
    width: 100%;
    height: 180px;
  }

  .news-title {
    font-size: 16px;
  }

  .news-summary {
    font-size: 13px;
  }

  .news-meta {
    gap: 8px;
  }
}
</style>
