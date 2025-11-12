<template>
  <!-- 工具列表区域 -->
  <section class="tools-section">
    <div class="tools-header">
      <h2 class="section-title">
        {{ selectedCategory === '全部' ? '所有AI工具' : selectedCategory }}
        <span class="tools-count">({{ totalTools }})</span>
      </h2>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 工具网格 -->
    <div v-else-if="tools.length > 0" class="tools-grid">
      <ToolCard
        v-for="tool in tools"
        :key="tool.id"
        :tool="tool"
      />
    </div>

    <!-- 无结果 -->
    <div v-else class="no-results">
      <p>未找到相关工具</p>
    </div>

    <!-- 分页 -->
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @go-to-page="$emit('go-to-page', $event)"
    />
  </section>
</template>

<script setup>
import ToolCard from './ToolCard.vue';
import Pagination from './Pagination.vue';

// 组件属性定义
defineProps({
  tools: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedCategory: {
    type: String,
    default: '全部'
  },
  totalTools: {
    type: Number,
    default: 0
  },
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
</script>

<style scoped>
/* 工具列表区域 */
.tools-section {
  margin-bottom: 48px;
}

.tools-header {
  margin-bottom: 24px;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #333333;
}

.tools-count {
  font-size: 18px;
  color: #666666;
  font-weight: 400;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #E0E0E0;
  border-top-color: #4A90E2;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666666;
  font-size: 16px;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .section-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}
</style>
