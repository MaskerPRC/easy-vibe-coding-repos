<template>
  <div class="tab-content">
    <section class="section">
      <h2 class="section-title">逐条解析</h2>
      <p class="section-desc">深入理解每个关键概念背后的商业逻辑</p>

      <div class="notes-container">
        <div v-for="(note, index) in notes" :key="index" class="note-card">
          <div class="note-header">
            <h3 class="note-title">{{ note.title }}</h3>
            <span class="note-tags">{{ note.tags }}</span>
          </div>
          <div class="note-content">
            <div v-for="(point, idx) in note.points" :key="idx" class="note-point">
              <h4 v-if="point.subtitle" class="point-subtitle">{{ point.subtitle }}</h4>
              <p class="point-text">{{ point.text }}</p>
              <ul v-if="point.subItems" class="point-list">
                <li v-for="(sub, subIdx) in point.subItems" :key="subIdx">{{ sub }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { notes } from '@/data/notesData';
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

/* 笔记容器 */
.notes-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.note-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #2980B9;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.note-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

.note-tags {
  background: #E8F4F8;
  color: #2980B9;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.note-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-point {
  padding-left: 16px;
  border-left: 2px solid #EEEEEE;
}

.point-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #2980B9;
  margin: 0 0 8px 0;
}

.point-text {
  font-size: 15px;
  color: #666666;
  line-height: 1.6;
  margin: 0 0 8px 0;
}

.point-list {
  list-style: none;
  padding-left: 20px;
  margin: 0;
}

.point-list li {
  position: relative;
  padding-left: 20px;
  font-size: 14px;
  color: #666666;
  line-height: 1.8;
  margin-bottom: 6px;
}

.point-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #2ECC71;
  font-weight: 700;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-title {
    font-size: 24px;
  }
}
</style>
