<template>
  <div class="tables-section">
    <div class="section-header">
      <h2>游戏牌桌</h2>
      <button class="create-table-btn" @click="$emit('createTable')">
        <span>+</span> 创建房间
      </button>
    </div>
    <div class="tables-grid">
      <TableCard
        v-for="table in tables"
        :key="table.id"
        :table="table"
        @join="handleJoin"
      />
    </div>
  </div>
</template>

<script setup>
import TableCard from './TableCard.vue'

defineProps({
  tables: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['createTable', 'joinTable'])

const handleJoin = (table) => {
  emit('joinTable', table)
}
</script>

<style scoped>
.tables-section {
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #f0f0f0;
}

.create-table-btn {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #1a1a1a;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.create-table-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .tables-grid {
    grid-template-columns: 1fr;
  }
}
</style>
