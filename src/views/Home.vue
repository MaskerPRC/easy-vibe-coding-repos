<template>
  <div class="home">
    <header class="header">
      <div class="container">
        <h1 class="title">AI编程失败案例集合</h1>
        <p class="subtitle">记录那些AI生成的"美丽"错误</p>
      </div>
    </header>

    <div class="container">
      <!-- 分类筛选 -->
      <div class="filter-section">
        <button
          :class="['filter-btn', { active: activeCategory === 'all' }]"
          @click="filterByCategory('all')"
        >
          全部案例 ({{ stats.total }})
        </button>
        <button
          :class="['filter-btn', { active: activeCategory === 'ai-taste' }]"
          @click="filterByCategory('ai-taste')"
        >
          AI味道 ({{ stats.byCategory['ai-taste'] }})
        </button>
        <button
          :class="['filter-btn', { active: activeCategory === 'mechanical' }]"
          @click="filterByCategory('mechanical')"
        >
          机械理解 ({{ stats.byCategory.mechanical }})
        </button>
        <button
          :class="['filter-btn', { active: activeCategory === 'reality' }]"
          @click="filterByCategory('reality')"
        >
          缺乏现实体验 ({{ stats.byCategory.reality }})
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        加载中...
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- 案例列表 -->
      <div v-else class="cases-grid">
        <div
          v-for="caseItem in cases"
          :key="caseItem.id"
          class="case-card"
          @click="goToDetail(caseItem.id)"
        >
          <div class="case-header">
            <span :class="['category-badge', caseItem.category]">
              {{ caseItem.categoryLabel }}
            </span>
          </div>
          <h3 class="case-title">{{ caseItem.title }}</h3>

          <div class="case-section">
            <div class="section-label">使用的提示词：</div>
            <div class="prompt-text">{{ caseItem.prompt }}</div>
          </div>

          <div class="case-section">
            <div class="section-label">失败原因：</div>
            <div class="failure-reason">{{ caseItem.failureReason }}</div>
          </div>

          <div class="view-detail">
            点击查看失败效果 →
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && !error && cases.length === 0" class="empty-state">
        <p>暂无案例</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const cases = ref([]);
const stats = ref({
  total: 0,
  byCategory: {
    'ai-taste': 0,
    'mechanical': 0,
    'reality': 0
  }
});
const loading = ref(true);
const error = ref(null);
const activeCategory = ref('all');

// 获取统计信息
const fetchStats = async () => {
  try {
    const response = await axios.get('/api/stats');
    if (response.data.success) {
      stats.value = response.data.data;
    }
  } catch (err) {
    console.error('获取统计信息失败:', err);
  }
};

// 获取案例列表
const fetchCases = async (category = 'all') => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get('/api/cases', {
      params: { category }
    });

    if (response.data.success) {
      cases.value = response.data.data;
    } else {
      error.value = '获取案例失败';
    }
  } catch (err) {
    console.error('获取案例失败:', err);
    error.value = '网络错误，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 按分类筛选
const filterByCategory = (category) => {
  activeCategory.value = category;
  fetchCases(category);
};

// 跳转到详情页
const goToDetail = (id) => {
  router.push(`/case/${id}`);
};

onMounted(async () => {
  await fetchStats();
  await fetchCases();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 60px;
}

.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 40px 20px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filter-section {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid white;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 25px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.loading, .error-message, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: white;
  font-size: 18px;
}

.error-message {
  background: rgba(255, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.case-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.case-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.case-header {
  margin-bottom: 16px;
}

.category-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.category-badge.ai-taste {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.category-badge.mechanical {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.category-badge.reality {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.case-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 16px;
  line-height: 1.4;
}

.case-section {
  margin-bottom: 16px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: #718096;
  margin-bottom: 6px;
}

.prompt-text {
  font-size: 14px;
  color: #4a5568;
  background: #f7fafc;
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #667eea;
  font-style: italic;
}

.failure-reason {
  font-size: 14px;
  color: #e53e3e;
  line-height: 1.6;
  font-weight: 500;
}

.view-detail {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .cases-grid {
    grid-template-columns: 1fr;
  }

  .filter-section {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }
}
</style>
