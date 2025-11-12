<template>
  <!-- 分页组件 -->
  <div v-if="totalPages > 1" class="pagination">
    <button
      @click="$emit('go-to-page', currentPage - 1)"
      :disabled="currentPage === 1"
      class="pagination-btn"
    >
      上一页
    </button>
    <div class="pagination-pages">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="$emit('go-to-page', page)"
        class="pagination-page"
        :class="{ 'active': page === currentPage }"
      >
        {{ page }}
      </button>
    </div>
    <button
      @click="$emit('go-to-page', currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="pagination-btn"
    >
      下一页
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// 组件属性定义
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  }
});

// 组件事件定义
defineEmits(['go-to-page']);

// 可见页码计算
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, props.currentPage - 2);
  const end = Math.min(props.totalPages, props.currentPage + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});
</script>

<style scoped>
/* 分页 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 48px;
}

.pagination-btn {
  padding: 10px 20px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  color: #333333;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #4A90E2;
  color: #FFFFFF;
  border-color: #4A90E2;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 8px;
}

.pagination-page {
  width: 40px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  color: #333333;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.pagination-page:hover {
  background: #F8F8F8;
  border-color: #4A90E2;
}

.pagination-page.active {
  background: #4A90E2;
  color: #FFFFFF;
  border-color: #4A90E2;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .pagination {
    flex-wrap: wrap;
    gap: 8px;
  }

  .pagination-btn {
    padding: 8px 16px;
  }
}

@media (max-width: 480px) {
  .pagination-pages {
    gap: 4px;
  }

  .pagination-page {
    width: 36px;
    height: 36px;
    font-size: 13px;
  }
}
</style>
