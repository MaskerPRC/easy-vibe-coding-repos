<template>
  <div class="whv-materials">
    <div class="header">
      <h1>小红书 WHV 素材库</h1>
      <p class="subtitle">每天自动搜集小红书打工度假签证(WHV)相关优质内容</p>
    </div>

    <!-- 统计信息卡片 -->
    <div class="stats-container" v-if="stats">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总素材数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ Object.keys(stats.byDate).length }}</div>
        <div class="stat-label">搜集天数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ Object.keys(stats.byTag).length }}</div>
        <div class="stat-label">标签类型</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.latestCollectedAt ? formatDate(stats.latestCollectedAt) : '-' }}</div>
        <div class="stat-label">最后更新</div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <button @click="fetchMaterials" class="btn btn-primary" :disabled="loading">
        {{ loading ? '加载中...' : '刷新列表' }}
      </button>
      <button @click="collectNow" class="btn btn-success" :disabled="collecting">
        {{ collecting ? '搜集中...' : '立即搜集' }}
      </button>
      <button @click="fetchStats" class="btn btn-info">
        更新统计
      </button>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索标题或内容..."
        class="search-input"
        @input="filterMaterials"
      />
      <select v-model="selectedTag" @change="filterMaterials" class="tag-filter">
        <option value="">所有标签</option>
        <option v-for="tag in availableTags" :key="tag" :value="tag">{{ tag }}</option>
      </select>
    </div>

    <!-- 素材列表 -->
    <div class="materials-grid" v-if="!loading && filteredMaterials.length > 0">
      <div v-for="material in filteredMaterials" :key="material.id" class="material-card">
        <div class="material-image">
          <img :src="material.imageUrl" :alt="material.title" />
        </div>
        <div class="material-content">
          <h3 class="material-title">{{ material.title }}</h3>
          <p class="material-author">作者: {{ material.author }}</p>
          <p class="material-description">{{ material.content }}</p>

          <div class="material-tags">
            <span v-for="tag in material.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="material-stats">
            <span class="stat-item">
              <span class="icon">❤️</span>
              {{ material.likes }}
            </span>
            <span class="stat-item">
              <span class="icon">💬</span>
              {{ material.comments }}
            </span>
          </div>

          <div class="material-footer">
            <span class="collect-time">{{ formatDateTime(material.collectedAt) }}</span>
            <a :href="material.sourceUrl" target="_blank" class="view-link">查看原文 →</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && filteredMaterials.length === 0" class="empty-state">
      <p>{{ searchQuery || selectedTag ? '没有找到匹配的素材' : '暂无素材数据' }}</p>
      <button @click="collectNow" class="btn btn-success">立即搜集素材</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="pagination.totalPages > 1">
      <button
        @click="changePage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="btn btn-sm"
      >
        上一页
      </button>
      <span class="page-info">
        第 {{ pagination.page }} / {{ pagination.totalPages }} 页
      </span>
      <button
        @click="changePage(pagination.page + 1)"
        :disabled="pagination.page === pagination.totalPages"
        class="btn btn-sm"
      >
        下一页
      </button>
    </div>

    <!-- 提示信息 -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'WHVMaterials',
  data() {
    return {
      materials: [],
      filteredMaterials: [],
      stats: null,
      loading: false,
      collecting: false,
      searchQuery: '',
      selectedTag: '',
      availableTags: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      },
      message: '',
      messageType: 'info'
    };
  },
  mounted() {
    this.fetchMaterials();
    this.fetchStats();
  },
  methods: {
    async fetchMaterials(page = 1) {
      this.loading = true;
      try {
        const response = await fetch(`/api/whv-materials?page=${page}&limit=${this.pagination.limit}`);
        const result = await response.json();

        if (result.success) {
          this.materials = result.data;
          this.filteredMaterials = result.data;
          this.pagination = result.pagination;
          this.updateAvailableTags();
        }
      } catch (error) {
        console.error('获取素材失败:', error);
        this.showMessage('获取素材失败', 'error');
      } finally {
        this.loading = false;
      }
    },

    async fetchStats() {
      try {
        const response = await fetch('/api/whv-materials/stats');
        const result = await response.json();

        if (result.success) {
          this.stats = result.stats;
        }
      } catch (error) {
        console.error('获取统计信息失败:', error);
      }
    },

    async collectNow() {
      this.collecting = true;
      try {
        const response = await fetch('/api/whv-materials/collect', {
          method: 'POST'
        });
        const result = await response.json();

        if (result.success) {
          this.showMessage(`成功搜集 ${result.collected} 条新素材！`, 'success');
          await this.fetchMaterials();
          await this.fetchStats();
        } else {
          this.showMessage('搜集失败: ' + result.error, 'error');
        }
      } catch (error) {
        console.error('搜集素材失败:', error);
        this.showMessage('搜集素材失败', 'error');
      } finally {
        this.collecting = false;
      }
    },

    updateAvailableTags() {
      const tagsSet = new Set();
      this.materials.forEach(material => {
        material.tags.forEach(tag => tagsSet.add(tag));
      });
      this.availableTags = Array.from(tagsSet).sort();
    },

    filterMaterials() {
      let filtered = this.materials;

      // 按标签筛选
      if (this.selectedTag) {
        filtered = filtered.filter(m => m.tags.includes(this.selectedTag));
      }

      // 按搜索词筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(m =>
          m.title.toLowerCase().includes(query) ||
          m.content.toLowerCase().includes(query) ||
          m.author.toLowerCase().includes(query)
        );
      }

      this.filteredMaterials = filtered;
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.fetchMaterials(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    },

    formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN');
    },

    showMessage(text, type = 'info') {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
};
</script>

<style scoped>
.whv-materials {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
}

.header h1 {
  margin: 0;
  font-size: 2.5em;
  font-weight: bold;
}

.subtitle {
  margin-top: 10px;
  font-size: 1.1em;
  opacity: 0.9;
}

/* 统计卡片 */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 2.5em;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 0.95em;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s;
  font-weight: 500;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-info {
  background: #3b82f6;
  color: white;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9em;
}

/* 筛选器 */
.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.search-input,
.tag-filter {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.tag-filter {
  min-width: 150px;
}

.search-input:focus,
.tag-filter:focus {
  outline: none;
  border-color: #667eea;
}

/* 素材网格 */
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.material-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.material-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.material-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
}

.material-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.material-content {
  padding: 20px;
}

.material-title {
  margin: 0 0 10px 0;
  font-size: 1.2em;
  color: #1f2937;
  line-height: 1.4;
}

.material-author {
  margin: 0 0 10px 0;
  color: #6b7280;
  font-size: 0.9em;
}

.material-description {
  margin: 0 0 15px 0;
  color: #4b5563;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.material-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background: #ede9fe;
  color: #7c3aed;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: 500;
}

.material-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #6b7280;
  font-size: 0.9em;
}

.icon {
  font-size: 1.1em;
}

.material-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collect-time {
  font-size: 0.85em;
  color: #9ca3af;
}

.view-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.view-link:hover {
  color: #764ba2;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-state p {
  margin-bottom: 20px;
  font-size: 1.1em;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 20px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 30px 0;
}

.page-info {
  color: #6b7280;
  font-size: 0.95em;
}

/* 消息提示 */
.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.message.success {
  background: #10b981;
  color: white;
}

.message.error {
  background: #ef4444;
  color: white;
}

.message.info {
  background: #3b82f6;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .materials-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 1.8em;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
