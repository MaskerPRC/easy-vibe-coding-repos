<template>
  <!-- 工具卡片 -->
  <div class="tool-card">
    <div class="tool-card-inner">
      <img :src="tool.logo" :alt="tool.name" class="tool-logo" @error="handleImageError" />
      <div class="tool-content">
        <div class="tool-header">
          <h3 class="tool-name">{{ tool.name }}</h3>
          <span v-if="tool.tag" class="tool-tag" :class="getTagClass(tool.tag)">
            {{ tool.tag }}
          </span>
        </div>
        <p class="tool-description">{{ tool.description }}</p>
        <div class="tool-footer">
          <span class="tool-category">{{ tool.category }}</span>
          <a :href="tool.website" target="_blank" class="tool-link">查看 →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件属性定义
defineProps({
  tool: {
    type: Object,
    required: true
  }
});

// 标签样式映射
const getTagClass = (tag) => {
  const tagMap = {
    '热门': 'tag-hot',
    '优惠': 'tag-deal',
    '新品': 'tag-new',
    '推荐': 'tag-featured'
  };
  return tagMap[tag] || '';
};

// 图片加载错误处理
const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23999"%3EAI%3C/text%3E%3C/svg%3E';
};
</script>

<style scoped>
/* 工具卡片 */
.tool-card {
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #4A90E2;
}

.tool-card-inner {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tool-logo {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  background: #F8F8F8;
}

.tool-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tool-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tool-name {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.tool-tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.tag-hot {
  background: #6DD400;
  color: #FFFFFF;
}

.tag-deal {
  background: #FFC107;
  color: #333333;
}

.tag-new {
  background: #4A90E2;
  color: #FFFFFF;
}

.tag-featured {
  background: #E0E0E0;
  color: #333333;
}

.tool-description {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
}

.tool-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #E0E0E0;
}

.tool-category {
  font-size: 12px;
  color: #666666;
  background: #F8F8F8;
  padding: 4px 10px;
  border-radius: 4px;
}

.tool-link {
  font-size: 14px;
  color: #4A90E2;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.tool-link:hover {
  color: #3a7bc8;
}
</style>
