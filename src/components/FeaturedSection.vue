<template>
  <!-- 今日产品专区 -->
  <section v-if="featuredTools.length > 0" class="featured-section">
    <h2 class="section-title">今日产品</h2>
    <div class="featured-grid">
      <div
        v-for="tool in featuredTools"
        :key="tool.id"
        class="featured-card"
      >
        <img :src="tool.logo" :alt="tool.name" class="featured-logo" @error="handleImageError" />
        <div class="featured-info">
          <h3 class="featured-name">{{ tool.name }}</h3>
          <p class="featured-description">{{ tool.description }}</p>
          <a :href="tool.website" target="_blank" class="featured-link">访问网站 →</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// 组件属性定义
defineProps({
  featuredTools: {
    type: Array,
    default: () => []
  }
});

// 图片加载错误处理
const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EAI%3C/text%3E%3C/svg%3E';
};
</script>

<style scoped>
/* 今日产品专区 */
.featured-section {
  margin-bottom: 48px;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.featured-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.featured-logo {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  background: #FFFFFF;
  padding: 8px;
}

.featured-info {
  flex: 1;
}

.featured-name {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.featured-description {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
  line-height: 1.5;
}

.featured-link {
  font-size: 13px;
  color: #FFFFFF;
  text-decoration: none;
  font-weight: 500;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .featured-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 24px;
  }
}
</style>
