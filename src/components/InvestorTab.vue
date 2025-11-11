<template>
  <div class="tab-content">
    <section class="section">
      <h2 class="section-title">投资人关注要点</h2>
      <p class="section-desc">了解投资人评估项目时的核心关注点,让你的商业计划更具说服力</p>

      <div class="investor-container">
        <div v-for="(item, index) in investorTips" :key="index" class="investor-card">
          <div class="investor-icon">{{ item.icon }}</div>
          <div class="investor-content">
            <h3 class="investor-title">{{ item.title }}</h3>
            <p class="investor-desc">{{ item.description }}</p>
            <div class="investor-points">
              <div v-for="(point, idx) in item.points" :key="idx" class="investor-point">
                <span class="point-icon">✓</span>
                <span class="point-text">{{ point }}</span>
              </div>
            </div>
            <div v-if="item.warning" class="investor-warning">
              <span class="warning-icon">⚠️</span>
              <span class="warning-text">{{ item.warning }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { investorTips } from '@/data/investorData';
</script>

<style scoped>
.tab-content {
  padding: 0;
}

.section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 12px;
  text-align: center;
}

.section-desc {
  font-size: 16px;
  color: #666666;
  text-align: center;
  margin-bottom: 40px;
}

/* 投资人视角容器 */
.investor-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.investor-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 24px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.investor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(41, 128, 185, 0.15);
  border-color: #2980B9;
}

.investor-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #F8F9FA, #E9ECEF);
  border-radius: 16px;
  flex-shrink: 0;
}

.investor-content {
  flex: 1;
}

.investor-title {
  font-size: 22px;
  font-weight: 600;
  color: #2980B9;
  margin: 0 0 8px 0;
}

.investor-desc {
  font-size: 15px;
  color: #666666;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.investor-points {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.investor-point {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: #555555;
  line-height: 1.6;
}

.point-icon {
  color: #2ECC71;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.point-text {
  flex: 1;
}

.investor-warning {
  background: linear-gradient(135deg, #FFF3CD, #FFF8E1);
  border-left: 4px solid #FFC107;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.warning-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.warning-text {
  font-size: 14px;
  color: #856404;
  font-weight: 500;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .investor-card {
    flex-direction: column;
    padding: 20px;
  }

  .investor-icon {
    width: 60px;
    height: 60px;
    font-size: 36px;
  }

  .investor-title {
    font-size: 18px;
  }

  .section-title {
    font-size: 24px;
  }
}
</style>
