<template>
  <div class="history-view">
    <div class="view-header">
      <h2>历史对局</h2>
      <button @click="handleBack" class="btn-back">返回</button>
    </div>

    <div class="history-list">
      <div
        v-for="historyItem in historyList"
        :key="historyItem.id"
        @click="handleViewHistory(historyItem.id)"
        class="history-item"
      >
        <div class="history-players">
          <span class="player-black">⚫ {{ historyItem.players.black }}</span>
          <span class="vs">VS</span>
          <span class="player-white">⚪ {{ historyItem.players.white }}</span>
        </div>
        <div class="history-result">
          <span v-if="historyItem.winner === 'black'" class="winner">⚫胜</span>
          <span v-else-if="historyItem.winner === 'white'" class="winner">⚪胜</span>
          <span v-else class="draw">平局</span>
        </div>
        <div class="history-meta">
          <span>{{ historyItem.moves }}手</span>
          <span>{{ formatDuration(historyItem.duration) }}</span>
        </div>
      </div>

      <div v-if="historyList.length === 0" class="empty-state">
        暂无历史对局
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  historyList: Array
});

const emit = defineEmits(['back', 'view-history']);

// 格式化时间
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
  } else {
    return `${seconds}秒`;
  }
}

const handleBack = () => {
  emit('back');
};

const handleViewHistory = (gameId) => {
  emit('view-history', gameId);
};
</script>

<style scoped>
.history-view {
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.view-header h2 {
  color: #8a2be2;
  font-size: 32px;
}

.btn-back {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
  border: 1px solid #666;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(138, 43, 226, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: rgba(138, 43, 226, 0.1);
  border-color: #8a2be2;
  transform: translateX(5px);
}

.history-players {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
}

.player-black {
  color: #e0e0e0;
}

.vs {
  color: #ffa500;
  font-weight: 700;
}

.player-white {
  color: #e0e0e0;
}

.history-result {
  margin-bottom: 10px;
}

.winner {
  color: #32cd32;
  font-weight: 700;
  font-size: 16px;
}

.draw {
  color: #ffa500;
  font-weight: 700;
  font-size: 16px;
}

.history-meta {
  display: flex;
  gap: 20px;
  color: #aaa;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  color: #aaa;
  padding: 60px 20px;
  font-size: 18px;
}
</style>
