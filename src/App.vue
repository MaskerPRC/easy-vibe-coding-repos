<template>
  <div class="aiverse-app">
    <!-- 顶部导航栏 -->
    <TopNavbar
      @open-submit-modal="showSubmitModal = true"
      @toggle-mobile-menu="mobileMenuOpen = !mobileMenuOpen"
    />

    <!-- 移动端菜单 -->
    <MobileMenu
      :is-open="mobileMenuOpen"
      :categories="categories"
      :selected-category="selectedCategory"
      @close="mobileMenuOpen = false"
      @select-category="selectCategory"
      @open-submit-modal="showSubmitModal = true"
    />

    <div class="main-layout">
      <!-- 左侧边栏分类 -->
      <Sidebar
        :categories="categories"
        :selected-category="selectedCategory"
        @select-category="selectCategory"
      />

      <!-- 主内容区域 -->
      <main class="main-content">
        <!-- 搜索栏 -->
        <SearchBar
          v-model:search-query="searchQuery"
          v-model:sort-by="sortBy"
          @search="handleSearch"
        />

        <!-- 今日产品专区 -->
        <FeaturedSection
          v-if="featuredTools.length > 0 && !searchQuery && selectedCategory === '全部'"
          :featured-tools="featuredTools"
        />

        <!-- 工具列表区域 -->
        <ToolsSection
          :tools="tools"
          :loading="loading"
          :selected-category="selectedCategory"
          :total-tools="totalTools"
          :current-page="currentPage"
          :total-pages="totalPages"
          @go-to-page="goToPage"
        />
      </main>
    </div>

    <!-- 页脚 -->
    <Footer />

    <!-- 提交工具模态框 -->
    <SubmitModal
      :is-open="showSubmitModal"
      :categories="categories"
      @close="showSubmitModal = false"
      @submit-success="loadTools"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TopNavbar from './components/TopNavbar.vue';
import MobileMenu from './components/MobileMenu.vue';
import Sidebar from './components/Sidebar.vue';
import SearchBar from './components/SearchBar.vue';
import FeaturedSection from './components/FeaturedSection.vue';
import ToolsSection from './components/ToolsSection.vue';
import Footer from './components/Footer.vue';
import SubmitModal from './components/SubmitModal.vue';

// 状态管理
const categories = ref(['全部', '人工智能', '生产力', '营销', '开发者工具', '设计', 'SEO', '聊天机器人', '社交媒体', '内容创作', '无代码', '写作', '客户支持', '博客', '销售', '产品化服务', '网站构建器', '分析', 'iOS', '开发者API', '视频', '产品开发', 'Mac', '反馈工具', '教育', '电子邮件']);
const selectedCategory = ref('全部');
const searchQuery = ref('');
const sortBy = ref('popularity');
const tools = ref([]);
const featuredTools = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalTools = ref(0);
const mobileMenuOpen = ref(false);
const showSubmitModal = ref(false);

// 加载工具列表
const loadTools = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      limit: 24,
      search: searchQuery.value,
      category: selectedCategory.value === '全部' ? '' : selectedCategory.value,
      sort: sortBy.value
    };

    const response = await axios.get('/api/tools', { params });
    if (response.data.success) {
      tools.value = response.data.data.tools;
      totalTools.value = response.data.data.total;
      totalPages.value = response.data.data.totalPages;
    }
  } catch (error) {
    console.error('加载工具失败:', error);
  } finally {
    loading.value = false;
  }
};

// 加载今日产品
const loadFeaturedTools = async () => {
  try {
    const response = await axios.get('/api/tools/featured');
    if (response.data.success) {
      featuredTools.value = response.data.data;
    }
  } catch (error) {
    console.error('加载今日产品失败:', error);
  }
};

// 选择分类
const selectCategory = (category) => {
  selectedCategory.value = category;
  currentPage.value = 1;
  loadTools();
};

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1;
  loadTools();
};

// 翻页
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    loadTools();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 初始化
onMounted(() => {
  loadTools();
  loadFeaturedTools();
});
</script>

<style scoped>
/* 全局样式 */
.aiverse-app {
  min-height: 100vh;
  background: #FFFFFF;
  color: #333333;
}

/* 主布局 */
.main-layout {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 32px;
  padding: 32px 24px;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  min-width: 0;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .main-layout {
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
    padding: 24px 16px;
  }
}
</style>
