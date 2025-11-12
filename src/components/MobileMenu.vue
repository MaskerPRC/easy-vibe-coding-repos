<template>
  <!-- 移动端菜单 -->
  <div class="mobile-menu" :class="{ 'mobile-menu-open': isOpen }">
    <div class="mobile-menu-content">
      <button class="mobile-menu-close" @click="$emit('close')">×</button>
      <nav class="mobile-nav">
        <a href="#analytics" class="mobile-nav-link">Analytics</a>
        <a href="#submit" @click.prevent="handleSubmit" class="mobile-nav-link">Submit Tool</a>
        <a href="#login" class="mobile-nav-link">Login / Register</a>
        <a href="#subscribe" class="mobile-nav-link">Subscribe</a>
      </nav>
      <div class="mobile-categories">
        <h3 class="mobile-categories-title">分类</h3>
        <div class="mobile-category-list">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="handleCategorySelect(cat)"
            class="mobile-category-item"
            :class="{ 'active': selectedCategory === cat }"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 组件属性定义
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
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
const emit = defineEmits(['close', 'select-category', 'open-submit-modal']);

// 处理分类选择
const handleCategorySelect = (category) => {
  emit('select-category', category);
  emit('close');
};

// 处理提交工具点击
const handleSubmit = () => {
  emit('open-submit-modal');
  emit('close');
};
</script>

<style scoped>
/* 移动端菜单 */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.mobile-menu-open {
  opacity: 1;
  pointer-events: all;
}

.mobile-menu-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 85%;
  max-width: 320px;
  height: 100%;
  background: #FFFFFF;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s;
  overflow-y: auto;
  padding: 24px;
}

.mobile-menu-open .mobile-menu-content {
  transform: translateX(0);
}

.mobile-menu-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #333333;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 48px;
  margin-bottom: 32px;
}

.mobile-nav-link {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  text-decoration: none;
  padding: 12px 0;
  border-bottom: 1px solid #E0E0E0;
}

.mobile-categories {
  margin-top: 24px;
}

.mobile-categories-title {
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16px;
}

.mobile-category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-category-item {
  background: #F8F8F8;
  border: 1px solid #E0E0E0;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.mobile-category-item:hover,
.mobile-category-item.active {
  background: #4A90E2;
  color: #FFFFFF;
  border-color: #4A90E2;
}
</style>
