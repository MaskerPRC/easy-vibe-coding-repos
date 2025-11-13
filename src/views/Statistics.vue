<template>
  <div class="page-container">
    <div class="header">
      <div class="title">统计</div>
      <div class="month-selector">
        <div class="month-text">{{ currentYear }}年{{ String(currentMonth).padStart(2, '0') }}月</div>
      </div>
    </div>

    <div class="content">
      <div class="stats-card main-card">
        <div class="stats-header">
          <div class="stats-label">月收入</div>
        </div>
        <div class="stats-sections">
          <div class="stats-row">
            <div class="stats-item-label">月总收入</div>
            <div class="stats-item-value total">¥{{ statistics.totalIncome.toFixed(0) }}</div>
          </div>
          <div class="stats-row">
            <div class="stats-item-label">基本收入</div>
            <div class="stats-item-value">¥{{ statistics.totalIncome.toFixed(0) }}</div>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-sections">
          <div class="stats-row highlight">
            <div class="stats-item-label">计件收入</div>
            <div class="stats-item-value piecework">¥{{ statistics.pieceworkIncome.toFixed(0) }}</div>
          </div>
          <div class="stats-row highlight">
            <div class="stats-item-label">计时收入</div>
            <div class="stats-item-value timework">¥{{ statistics.timeIncome.toFixed(0) }}</div>
          </div>
          <div class="stats-row highlight">
            <div class="stats-item-label">基本工资</div>
            <div class="stats-item-value">¥{{ statistics.basicSalary.toFixed(0) }}</div>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-header">
          <div class="stats-label">社保项目</div>
        </div>
        <div class="stats-sections">
          <div class="stats-row">
            <div class="stats-item-label">社保</div>
            <div class="stats-item-value">¥{{ statistics.socialSecurity.total.toFixed(0) }}</div>
          </div>
          <div class="stats-row sub">
            <div class="stats-item-label">养老</div>
            <div class="stats-item-value">¥{{ statistics.socialSecurity.pension.toFixed(0) }}</div>
          </div>
          <div class="stats-row sub">
            <div class="stats-item-label">医疗</div>
            <div class="stats-item-value">¥{{ statistics.socialSecurity.medical.toFixed(0) }}</div>
          </div>
          <div class="stats-row sub">
            <div class="stats-item-label">工伤</div>
            <div class="stats-item-value">¥{{ statistics.socialSecurity.injury.toFixed(0) }}</div>
          </div>
          <div class="stats-row sub">
            <div class="stats-item-label">失业</div>
            <div class="stats-item-value">¥{{ statistics.socialSecurity.unemployment.toFixed(0) }}</div>
          </div>
        </div>
      </div>

      <div class="summary-section">
        <div class="summary-item">
          <div class="summary-icon piecework-icon">件</div>
          <div class="summary-content">
            <div class="summary-label">计件总数</div>
            <div class="summary-value">{{ statistics.pieceworkCount }} 件</div>
          </div>
        </div>
        <div class="summary-item">
          <div class="summary-icon timework-icon">时</div>
          <div class="summary-content">
            <div class="summary-label">计时总数</div>
            <div class="summary-value">{{ statistics.timeHours.toFixed(1) }} 小时</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { statisticsAPI } from '../api';

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);

const statistics = ref({
  totalIncome: 0,
  pieceworkIncome: 0,
  timeIncome: 0,
  basicSalary: 0,
  socialSecurity: {
    total: 0,
    pension: 0,
    medical: 0,
    unemployment: 0,
    injury: 0
  },
  pieceworkCount: 0,
  timeHours: 0
});

const loadStatistics = async () => {
  try {
    const response = await statisticsAPI.get(currentYear.value, currentMonth.value);
    statistics.value = response.data.data;
  } catch (error) {
    console.error('加载统计数据失败:', error);
    alert('加载统计数据失败');
  }
};

onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #F8F8F8;
  padding-bottom: 80px;
}

.header {
  background: #FFFFFF;
  padding: 16px 20px;
  border-bottom: 1px solid #E0E0E0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 12px;
}

.month-selector {
  display: flex;
  align-items: center;
  justify-content: center;
}

.month-text {
  font-size: 16px;
  color: #1A73E8;
  font-weight: 500;
}

.content {
  padding: 16px;
}

.stats-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stats-card.main-card {
  background: linear-gradient(135deg, #1A73E8 0%, #1565C0 100%);
  color: #FFFFFF;
}

.stats-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.main-card .stats-header {
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

.stats-label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

.stats-sections {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.stats-row.highlight {
  padding: 16px;
  background: #F8F8F8;
  border-radius: 8px;
  margin: 4px 0;
}

.stats-row.sub {
  padding-left: 20px;
  opacity: 0.8;
}

.stats-item-label {
  font-size: 15px;
  color: #333333;
}

.main-card .stats-item-label {
  color: #FFFFFF;
}

.stats-item-value {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.stats-item-value.total {
  font-size: 32px;
  color: #FFFFFF;
}

.stats-item-value.piecework {
  color: #FF9800;
}

.stats-item-value.timework {
  color: #4CAF50;
}

.main-card .stats-item-value {
  color: #FFFFFF;
}

.summary-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.summary-item {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
}

.piecework-icon {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.timework-icon {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
}

.summary-content {
  flex: 1;
}

.summary-label {
  font-size: 13px;
  color: #999999;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

@media (max-width: 480px) {
  .stats-item-value.total {
    font-size: 28px;
  }

  .summary-section {
    grid-template-columns: 1fr;
  }

  .summary-icon {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
}
</style>
