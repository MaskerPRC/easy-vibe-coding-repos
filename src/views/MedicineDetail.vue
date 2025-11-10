<template>
  <div class="medicine-detail">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!medicine" class="error">
      <div class="error-content">
        <h2>未找到药物信息</h2>
        <button class="back-btn" @click="goBack">返回首页</button>
      </div>
    </div>
    <div v-else class="detail-container">
      <!-- 头部信息 -->
      <div class="detail-header">
        <button class="back-button" @click="goBack">← 返回</button>
        <div class="header-content">
          <div class="medicine-icon">{{ medicine.image }}</div>
          <h1 class="medicine-name">{{ medicine.name }}</h1>
          <div class="medicine-category">{{ medicine.category }}</div>
          <p class="medicine-short-desc">{{ medicine.shortDesc }}</p>
        </div>
      </div>

      <!-- 详细内容 -->
      <div class="detail-body">
        <div class="container">
          <!-- 药理作用 -->
          <section class="info-section">
            <h2 class="section-title">药理作用</h2>
            <div class="section-content">
              <p>{{ medicine.pharmacology }}</p>
            </div>
          </section>

          <!-- 适应症 -->
          <section class="info-section">
            <h2 class="section-title">适应症</h2>
            <div class="section-content">
              <p>{{ medicine.indications }}</p>
            </div>
          </section>

          <!-- 用法用量 -->
          <section class="info-section highlight">
            <h2 class="section-title">用法用量</h2>
            <div class="section-content">
              <p>{{ medicine.dosage }}</p>
            </div>
          </section>

          <!-- 禁忌症 -->
          <section class="info-section warning">
            <h2 class="section-title">禁忌症</h2>
            <div class="section-content">
              <p>{{ medicine.contraindications }}</p>
            </div>
          </section>

          <!-- 不良反应 -->
          <section class="info-section">
            <h2 class="section-title">不良反应</h2>
            <div class="section-content">
              <p>{{ medicine.sideEffects }}</p>
            </div>
          </section>

          <!-- 注意事项 -->
          <section class="info-section">
            <h2 class="section-title">注意事项</h2>
            <div class="section-content">
              <p>{{ medicine.precautions }}</p>
            </div>
          </section>

          <!-- 免责声明 -->
          <div class="disclaimer">
            <p>
              <strong>免责声明：</strong>本网站提供的药物信息仅供参考和学习，不能作为诊断及医疗的依据。
              用药前请咨询医生或药师，并仔细阅读药品说明书。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const medicine = ref(null);
const loading = ref(false);

// 获取药物详情
const fetchMedicineDetail = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`/api/medicines/${route.params.id}`);
    if (response.data.success) {
      medicine.value = response.data.data;
    }
  } catch (error) {
    console.error('获取药物详情失败:', error);
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.push({ name: 'Home' });
};

onMounted(() => {
  fetchMedicineDetail();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.medicine-detail {
  min-height: 100vh;
  background: #f8f8f8;
}

.loading,
.error {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #828282;
}

.error-content {
  text-align: center;
}

.error-content h2 {
  color: #333333;
  margin-bottom: 24px;
  font-size: 24px;
}

.back-btn {
  padding: 12px 32px;
  background: #2f80ed;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #1e5fc4;
}

/* 头部区域 */
.detail-header {
  background: linear-gradient(135deg, #2f80ed 0%, #1e5fc4 100%);
  color: white;
  padding: 24px 20px 60px;
  position: relative;
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.3s;
  margin-bottom: 24px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.medicine-icon {
  font-size: 72px;
  margin-bottom: 16px;
}

.medicine-name {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.medicine-category {
  display: inline-block;
  background: rgba(39, 174, 96, 0.9);
  color: white;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  margin-bottom: 16px;
}

.medicine-short-desc {
  font-size: 16px;
  opacity: 0.95;
  line-height: 1.6;
}

/* 详情内容 */
.detail-body {
  padding: 32px 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.info-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.info-section.highlight {
  border-left: 4px solid #2f80ed;
}

.info-section.warning {
  border-left: 4px solid #ff6b6b;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.section-content {
  font-size: 15px;
  color: #333333;
  line-height: 1.8;
}

.section-content p {
  margin: 0;
}

/* 免责声明 */
.disclaimer {
  background: #fff9e6;
  border: 1px solid #ffe082;
  border-radius: 8px;
  padding: 20px;
  margin-top: 32px;
}

.disclaimer p {
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
  margin: 0;
}

.disclaimer strong {
  color: #333333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .medicine-icon {
    font-size: 56px;
  }

  .medicine-name {
    font-size: 28px;
  }

  .medicine-short-desc {
    font-size: 15px;
  }

  .info-section {
    padding: 20px;
  }

  .section-title {
    font-size: 18px;
  }

  .section-content {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .detail-header {
    padding: 20px 16px 40px;
  }

  .medicine-icon {
    font-size: 48px;
  }

  .medicine-name {
    font-size: 24px;
  }

  .info-section {
    padding: 16px;
    margin-bottom: 16px;
  }

  .disclaimer {
    padding: 16px;
  }
}
</style>
