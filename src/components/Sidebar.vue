<template>
  <!-- 左侧边栏分类 -->
  <aside class="sidebar">
    <div class="sidebar-content">
      <h3 class="sidebar-title">分类</h3>
      <nav class="category-list">
        <button
          v-for="category in categories"
          :key="category"
          @click="$emit('select-category', category)"
          class="category-item"
          :class="{ 'active': selectedCategory === category }"
        >
          {{ category }}
        </button>
      </nav>
    </div>
  </aside>
</template>

<script setup>
// 组件属性定义
defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: String,
    default: '全部'
  }
});

// 组件事件定义
defineEmits(['select-category']);
</script>

<style scoped>
/* 左侧边栏 */
.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.sidebar-content {
  position: sticky;
  top: 96px;
  background: #F8F8F8;
  border-radius: 12px;
  padding: 24px;
}

.sidebar-title {
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  background: transparent;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.category-item:hover {
  background: #FFFFFF;
  color: #4A90E2;
}

.category-item.active {
  background: #4A90E2;
  color: #FFFFFF;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
