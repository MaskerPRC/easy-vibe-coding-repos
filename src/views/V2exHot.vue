<template>
  <div class="v2ex-container">
    <header class="header">
      <h1>V2EX 热门主题</h1>
      <div class="header-actions">
        <button @click="switchTab('hot')" :class="{ active: activeTab === 'hot' }">热门</button>
        <button @click="switchTab('latest')" :class="{ active: activeTab === 'latest' }">最新</button>
        <button @click="fetchTopics" :disabled="loading" class="refresh-btn">
          {{ loading ? '加载中...' : '刷新' }}
        </button>
      </div>
    </header>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="loading && !topics.length" class="loading">
      加载中...
    </div>

    <div v-else class="topics-list">
      <div
        v-for="topic in topics"
        :key="topic.id"
        class="topic-card"
      >
        <div class="topic-header">
          <div class="node-info">
            <span class="node-name">{{ topic.node?.title || topic.node?.name || '未知节点' }}</span>
            <span class="username">{{ topic.member?.username || '匿名' }}</span>
          </div>
          <span class="time">{{ formatTime(topic.created) }}</span>
        </div>

        <h2 class="topic-title">
          <a :href="topic.url" target="_blank" rel="noopener noreferrer">
            {{ topic.title }}
          </a>
        </h2>

        <div v-if="topic.content" class="topic-content" v-html="topic.content"></div>

        <div class="topic-footer">
          <span class="replies">
            回复: {{ topic.replies || 0 }}
          </span>
          <span v-if="topic.last_reply_by" class="last-reply">
            最后回复: {{ topic.last_reply_by }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="!loading && topics.length === 0" class="no-data">
      暂无数据
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'V2exHot',
  setup() {
    const topics = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const activeTab = ref('hot');

    const fetchTopics = async () => {
      loading.value = true;
      error.value = null;

      try {
        const endpoint = activeTab.value === 'hot' ? '/api/v2ex/hot' : '/api/v2ex/latest';
        const response = await fetch(endpoint);
        const result = await response.json();

        if (result.success) {
          topics.value = result.data;
        } else {
          error.value = result.message || '获取数据失败';
        }
      } catch (err) {
        error.value = '网络请求失败: ' + err.message;
        console.error('获取主题失败:', err);
      } finally {
        loading.value = false;
      }
    };

    const switchTab = (tab) => {
      if (activeTab.value !== tab) {
        activeTab.value = tab;
        fetchTopics();
      }
    };

    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000);

      if (diff < 60) return '刚刚';
      if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
      if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
      if (diff < 2592000) return Math.floor(diff / 86400) + ' 天前';

      return date.toLocaleDateString('zh-CN');
    };

    onMounted(() => {
      fetchTopics();
    });

    return {
      topics,
      loading,
      error,
      activeTab,
      fetchTopics,
      switchTab,
      formatTime
    };
  }
};
</script>

<style scoped>
.v2ex-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.header-actions button:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #999;
}

.header-actions button.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.header-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn {
  background: #52c41a !important;
  color: white !important;
  border-color: #52c41a !important;
}

.refresh-btn:hover:not(:disabled) {
  background: #73d13d !important;
  border-color: #73d13d !important;
}

.error-message {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  padding: 12px 16px;
  margin-bottom: 20px;
  color: #cf1322;
}

.loading,
.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

.topics-list {
  display: grid;
  gap: 20px;
}

.topic-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
}

.topic-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #1890ff;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  color: #999;
}

.node-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.node-name {
  background: #f5f5f5;
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 12px;
  color: #666;
}

.username {
  color: #1890ff;
  font-weight: 500;
}

.time {
  color: #999;
  font-size: 12px;
}

.topic-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  line-height: 1.6;
}

.topic-title a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.topic-title a:hover {
  color: #1890ff;
}

.topic-content {
  color: #666;
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.topic-footer {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #999;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.replies {
  color: #52c41a;
  font-weight: 500;
}

@media (max-width: 768px) {
  .v2ex-container {
    padding: 10px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header h1 {
    font-size: 22px;
  }

  .topic-card {
    padding: 15px;
  }

  .topic-title {
    font-size: 16px;
  }
}
</style>
