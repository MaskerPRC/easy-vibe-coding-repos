<template>
  <div class="tab-content">
    <section class="section">
      <h2 class="section-title">四个核心问题</h2>
      <p class="section-desc">清晰回答这四个问题,让你的商业计划更具说服力</p>

      <div class="card-grid">
        <div v-for="(framework, index) in frameworks" :key="index" class="card">
          <div class="card-header">
            <div class="card-number">{{ index + 1 }}</div>
            <h3 class="card-title">{{ framework.title }}</h3>
          </div>
          <ul class="card-list">
            <li v-for="(item, idx) in framework.items" :key="idx" class="card-list-item">
              <strong>{{ item.label }}:</strong> {{ item.content }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { frameworks } from '@/data/frameworkData';
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

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(41, 128, 185, 0.15);
  border-color: #2980B9;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.card-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3498DB, #2980B9);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  line-height: 1.4;
  margin: 0;
}

.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-list-item {
  padding: 12px 0;
  border-bottom: 1px solid #EEEEEE;
  font-size: 14px;
  color: #666666;
  line-height: 1.6;
}

.card-list-item:last-child {
  border-bottom: none;
}

.card-list-item strong {
  color: #2980B9;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 24px;
  }
}
</style>
