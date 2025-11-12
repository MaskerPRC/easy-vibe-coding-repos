<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="title">AI依赖程度数据看板</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link active">数据看板</router-link>
        <router-link to="/test" class="nav-link">测试页面</router-link>
      </nav>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="dashboard-content">
      <!-- 统计摘要 -->
      <div class="summary-section">
        <div class="summary-card">
          <div class="card-title">总用户数</div>
          <div class="card-value">{{ stats.summary.totalUsers }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">总测试次数</div>
          <div class="card-value">{{ stats.summary.totalTests }}</div>
        </div>
        <div class="summary-card">
          <div class="card-title">平均依赖程度</div>
          <div class="card-value">{{ stats.summary.avgDependency }}</div>
        </div>
      </div>

      <!-- 用户AI依赖程度分布 -->
      <div class="section">
        <h2 class="section-title">用户AI依赖程度分布</h2>
        <div class="chart-container">
          <div class="bar-chart">
            <div
              v-for="(count, level) in stats.dependencyDistribution"
              :key="level"
              class="bar-item"
            >
              <div class="bar-wrapper">
                <div
                  class="bar"
                  :style="{ height: getBarHeight(count, maxDependencyCount) + '%' }"
                  :class="'level-' + level.replace('level', '')"
                >
                  <span class="bar-value">{{ count }}</span>
                </div>
              </div>
              <div class="bar-label">{{ getDependencyLabel(level) }}</div>
            </div>
          </div>
          <div class="legend">
            <div class="legend-item">
              <span class="legend-color level-1"></span>
              <span>1分 - 完全独立</span>
            </div>
            <div class="legend-item">
              <span class="legend-color level-2"></span>
              <span>2分 - 较少依赖</span>
            </div>
            <div class="legend-item">
              <span class="legend-color level-3"></span>
              <span>3分 - 中等依赖</span>
            </div>
            <div class="legend-item">
              <span class="legend-color level-4"></span>
              <span>4分 - 较多依赖</span>
            </div>
            <div class="legend-item">
              <span class="legend-color level-5"></span>
              <span>5分 - 完全依赖</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 不同场景下的AI依赖程度 -->
      <div class="section">
        <h2 class="section-title">不同场景下的AI依赖程度</h2>
        <div class="scenario-grid">
          <div
            v-for="(stats, scenario) in stats.scenarioStats"
            :key="scenario"
            class="scenario-card"
          >
            <div class="scenario-name">{{ scenario }}</div>
            <div class="scenario-stats">
              <div class="stat-item">
                <span class="stat-label">平均依赖度:</span>
                <span class="stat-value">{{ stats.avgDependency }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">测试次数:</span>
                <span class="stat-value">{{ stats.count }}</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: (stats.avgDependency / 5 * 100) + '%' }"
                  :class="getProgressClass(stats.avgDependency)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const stats = ref({
  dependencyDistribution: {},
  scenarioStats: {},
  summary: {
    totalUsers: 0,
    totalTests: 0,
    avgDependency: 0
  }
});
const loading = ref(true);
const error = ref(null);

// 计算最大值用于柱状图高度
const maxDependencyCount = computed(() => {
  return Math.max(...Object.values(stats.value.dependencyDistribution));
});

// 获取柱状图高度百分比
const getBarHeight = (count, max) => {
  if (max === 0) return 0;
  return (count / max) * 100;
};

// 获取依赖程度标签
const getDependencyLabel = (level) => {
  const labels = {
    level1: '1分',
    level2: '2分',
    level3: '3分',
    level4: '4分',
    level5: '5分'
  };
  return labels[level] || level;
};

// 获取进度条颜色类
const getProgressClass = (avgDependency) => {
  const value = parseFloat(avgDependency);
  if (value <= 1.5) return 'low';
  if (value <= 2.5) return 'medium-low';
  if (value <= 3.5) return 'medium';
  if (value <= 4.5) return 'medium-high';
  return 'high';
};

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get('/api/dashboard/stats');
    if (response.data.success) {
      stats.value = response.data.data;
    } else {
      error.value = '获取数据失败';
    }
  } catch (err) {
    console.error('加载数据失败:', err);
    error.value = '加载数据失败: ' + (err.response?.data?.error || err.message);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.nav {
  display: flex;
  gap: 15px;
}

.nav-link {
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: #f0f0f0;
  color: #333;
}

.nav-link.active {
  background: #667eea;
  color: white;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 15px;
  font-size: 18px;
}

.error {
  color: #e74c3c;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.summary-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.summary-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  color: #667eea;
}

.section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 300px;
  padding: 20px 0;
  background: #f8f9fa;
  border-radius: 10px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.bar-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 10px;
}

.bar {
  width: 60px;
  max-width: 80%;
  background: #667eea;
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: all 0.3s ease;
  min-height: 20px;
}

.bar:hover {
  opacity: 0.8;
  transform: translateY(-5px);
}

.bar.level-1 { background: #27ae60; }
.bar.level-2 { background: #2ecc71; }
.bar.level-3 { background: #f39c12; }
.bar.level-4 { background: #e67e22; }
.bar.level-5 { background: #e74c3c; }

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.bar-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.level-1 { background: #27ae60; }
.legend-color.level-2 { background: #2ecc71; }
.legend-color.level-3 { background: #f39c12; }
.legend-color.level-4 { background: #e67e22; }
.legend-color.level-5 { background: #e74c3c; }

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.scenario-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.scenario-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.scenario-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.scenario-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 5px;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.progress-fill.low { background: #27ae60; }
.progress-fill.medium-low { background: #2ecc71; }
.progress-fill.medium { background: #f39c12; }
.progress-fill.medium-high { background: #e67e22; }
.progress-fill.high { background: #e74c3c; }

@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }

  .title {
    font-size: 22px;
  }

  .section {
    padding: 20px;
  }

  .bar-chart {
    height: 200px;
  }

  .bar {
    width: 40px;
  }

  .scenario-grid {
    grid-template-columns: 1fr;
  }
}
</style>
