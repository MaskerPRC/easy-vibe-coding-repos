<template>
  <div
    class="table-card"
    :class="{ 'table-full': table.players >= table.maxPlayers }"
    @click="$emit('join', table)"
  >
    <div class="table-card-shine"></div>
    <div class="table-header">
      <span class="table-id">房间 #{{ table.id }}</span>
      <span class="table-status" :class="table.status">
        {{ table.status === 'waiting' ? '等待中' : '游戏中' }}
      </span>
    </div>
    <div class="table-info">
      <div class="table-detail">
        <span class="detail-label">底注</span>
        <span class="detail-value">{{ table.baseScore }}分</span>
      </div>
      <div class="table-detail">
        <span class="detail-label">人数</span>
        <span class="detail-value">{{ table.players }}/{{ table.maxPlayers }}</span>
      </div>
      <div class="table-detail" v-if="table.hasAI">
        <span class="detail-label">类型</span>
        <span class="detail-value ai-tag">AI对战</span>
      </div>
    </div>
    <div class="table-players">
      <div
        v-for="i in table.maxPlayers"
        :key="i"
        class="player-slot"
        :class="{ 'occupied': i <= table.players }"
      >
        <span v-if="i <= table.players">👤</span>
        <span v-else>+</span>
      </div>
    </div>
    <button
      class="join-btn"
      :disabled="table.players >= table.maxPlayers"
    >
      {{ table.players >= table.maxPlayers ? '已满' : '加入游戏' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  table: {
    type: Object,
    required: true
  }
})

defineEmits(['join'])
</script>

<style scoped>
.table-card {
  position: relative;
  background: linear-gradient(145deg, #1e2a3a, #2a3a4f);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.table-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 215, 0, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.table-card.table-full {
  opacity: 0.7;
}

.table-card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.table-card:hover .table-card-shine {
  left: 100%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-id {
  font-size: 18px;
  font-weight: 600;
  color: #FFD700;
}

.table-status {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.table-status.waiting {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.table-status.playing {
  background: rgba(251, 146, 60, 0.2);
  color: #fb923c;
}

.table-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.table-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #94a3b8;
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
  color: #f0f0f0;
}

.ai-tag {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.table-players {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.player-slot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

.player-slot.occupied {
  background: rgba(255, 215, 0, 0.2);
  border: 2px solid rgba(255, 215, 0, 0.5);
}

.join-btn {
  width: 100%;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.join-btn:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.4);
}

.join-btn:disabled {
  background: #4a5568;
  cursor: not-allowed;
}
</style>
