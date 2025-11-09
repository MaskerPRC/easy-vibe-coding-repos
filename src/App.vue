<template>
  <div class="models-page">
    <header class="page-header">
      <h1 class="page-title">模特管理平台</h1>
      <p class="page-subtitle">优质模特资源展示</p>
    </header>

    <div class="filters-container">
      <div class="filter-group">
        <label>分类筛选：</label>
        <select v-model="selectedCategory" @change="fetchModels" class="filter-select">
          <option value="all">全部分类</option>
          <option value="时装模特">时装模特</option>
          <option value="商业模特">商业模特</option>
          <option value="平面模特">平面模特</option>
          <option value="高级定制模特">高级定制模特</option>
          <option value="电商模特">电商模特</option>
        </select>
      </div>

      <div class="filter-group">
        <label>性别筛选：</label>
        <select v-model="selectedGender" @change="fetchModels" class="filter-select">
          <option value="all">全部</option>
          <option value="女">女</option>
          <option value="男">男</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="!loading && models.length === 0 && !error" class="empty-message">
      暂无模特数据
    </div>

    <div v-if="models.length > 0" class="models-grid">
      <div
        v-for="model in models"
        :key="model.id"
        class="model-card"
        @click="showModelDetail(model)"
      >
        <div class="model-image-wrapper">
          <img :src="model.avatar" :alt="model.name" class="model-image" />
          <div class="model-overlay">
            <span class="view-detail">查看详情</span>
          </div>
        </div>
        <div class="model-info">
          <h3 class="model-name">{{ model.name }}</h3>
          <div class="model-meta">
            <span class="model-category">{{ model.category }}</span>
            <span class="model-gender">{{ model.gender }}</span>
          </div>
          <div class="model-stats">
            <span>身高: {{ model.height }}cm</span>
            <span>经验: {{ model.experience }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="selectedModel" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">×</button>
        <div class="modal-body">
          <div class="modal-image-section">
            <img :src="selectedModel.avatar" :alt="selectedModel.name" class="modal-image" />
          </div>
          <div class="modal-info-section">
            <h2 class="modal-name">{{ selectedModel.name }}</h2>
            <div class="modal-category">{{ selectedModel.category }}</div>

            <div class="detail-group">
              <h4>基本信息</h4>
              <div class="detail-item">
                <span class="detail-label">性别：</span>
                <span class="detail-value">{{ selectedModel.gender }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">年龄：</span>
                <span class="detail-value">{{ selectedModel.age }}岁</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">身高：</span>
                <span class="detail-value">{{ selectedModel.height }}cm</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">体重：</span>
                <span class="detail-value">{{ selectedModel.weight }}kg</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">三围：</span>
                <span class="detail-value">{{ selectedModel.measurements }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">从业经验：</span>
                <span class="detail-value">{{ selectedModel.experience }}</span>
              </div>
            </div>

            <div class="detail-group">
              <h4>个人简介</h4>
              <p class="detail-description">{{ selectedModel.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const models = ref([]);
const loading = ref(false);
const error = ref('');
const selectedCategory = ref('all');
const selectedGender = ref('all');
const selectedModel = ref(null);

const fetchModels = async () => {
  loading.value = true;
  error.value = '';

  try {
    const params = new URLSearchParams();
    if (selectedCategory.value !== 'all') {
      params.append('category', selectedCategory.value);
    }
    if (selectedGender.value !== 'all') {
      params.append('gender', selectedGender.value);
    }

    const response = await fetch(`/api/models?${params.toString()}`);
    const data = await response.json();

    if (data.success) {
      models.value = data.data || [];
    } else {
      error.value = data.error || '获取模特列表失败';
    }
  } catch (err) {
    error.value = '网络请求失败: ' + err.message;
    console.error('获取模特列表失败:', err);
  } finally {
    loading.value = false;
  }
};

const showModelDetail = (model) => {
  selectedModel.value = model;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  selectedModel.value = null;
  document.body.style.overflow = 'auto';
};

onMounted(() => {
  fetchModels();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.models-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.page-header {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.page-subtitle {
  font-size: 18px;
  margin: 0;
  opacity: 0.9;
}

.filters-container {
  max-width: 1200px;
  margin: 0 auto 40px;
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 14px;
}

.filter-group label {
  font-weight: 500;
}

.filter-select {
  padding: 8px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: white;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: white;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin-top: 16px;
  font-size: 16px;
}

.error-message, .empty-message {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  color: #d32f2f;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.empty-message {
  color: #666;
}

.models-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px;
}

.model-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.model-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.model-image-wrapper {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  background: #f0f0f0;
}

.model-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.model-card:hover .model-image {
  transform: scale(1.1);
}

.model-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.model-card:hover .model-overlay {
  opacity: 1;
}

.view-detail {
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  border: 2px solid white;
  border-radius: 8px;
  transition: all 0.3s;
}

.view-detail:hover {
  background: white;
  color: #667eea;
}

.model-info {
  padding: 20px;
}

.model-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #333;
}

.model-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.model-category, .model-gender {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.model-category {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.model-gender {
  background: #e3f2fd;
  color: #1976d2;
}

.model-stats {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 28px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.3s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: rotate(90deg);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.modal-image-section {
  background: #f5f5f5;
}

.modal-image {
  width: 100%;
  height: 100%;
  min-height: 500px;
  object-fit: cover;
}

.modal-info-section {
  padding: 40px;
}

.modal-name {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #333;
}

.modal-category {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 30px;
}

.detail-group {
  margin-bottom: 30px;
}

.detail-group h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
}

.detail-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #666;
  min-width: 100px;
}

.detail-value {
  color: #333;
}

.detail-description {
  color: #666;
  line-height: 1.8;
  margin: 0;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    justify-content: space-between;
  }

  .models-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .modal-body {
    grid-template-columns: 1fr;
  }

  .modal-image {
    min-height: 300px;
  }

  .modal-info-section {
    padding: 30px 20px;
  }

  .modal-name {
    font-size: 24px;
  }
}
</style>
