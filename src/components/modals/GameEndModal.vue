<template>
  <div v-if="gameEndModal" class="game-end-modal">
    <div class="modal-content end-modal">
      <h2 class="end-title">
        <span v-if="gameEndModal.winner === myColor" class="win-text">🎉 胜利!</span>
        <span v-else-if="gameEndModal.winner" class="lose-text">😢 失败</span>
        <span v-else class="draw-text">⚖️ 平局</span>
      </h2>

      <div class="end-info">
        <p v-if="gameEndModal.reason === 'opponent_disconnected'">对手已断线</p>
        <p v-else-if="gameEndModal.game?.drawReason">{{ gameEndModal.game.drawReason }}</p>
        <p v-else>
          <span v-if="gameEndModal.winner === 'black'">⚫ {{ gameEndModal.game?.players?.black?.username }}</span>
          <span v-else-if="gameEndModal.winner === 'white'">⚪ {{ gameEndModal.game?.players?.white?.username }}</span>
          <span v-if="gameEndModal.winner"> 获得胜利</span>
        </p>
      </div>

      <div class="end-stats">
        <div class="stat">总手数: {{ gameEndModal.game?.moves?.length || 0 }}</div>
        <div class="stat">用时: {{ formatDuration((gameEndModal.game?.endTime || 0) - (gameEndModal.game?.startTime || 0)) }}</div>
      </div>

      <button @click="handleBackToHome" class="btn-primary">返回主界面</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  gameEndModal: Object,
  myColor: String
});

const emit = defineEmits(['back-to-home']);

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

const handleBackToHome = () => {
  emit('back-to-home');
};
</script>

<style scoped>
.game-end-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.end-modal {
  text-align: center;
  max-width: 500px;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid #8a2be2;
  box-shadow: 0 0 50px rgba(138, 43, 226, 0.5);
}

.end-title {
  font-size: 48px;
  margin-bottom: 30px;
}

.win-text {
  color: #32cd32;
  animation: celebrate 1s ease-in-out infinite;
}

.lose-text {
  color: #ff6b6b;
}

.draw-text {
  color: #ffa500;
}

@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.end-info {
  font-size: 20px;
  color: #e0e0e0;
  margin-bottom: 30px;
}

.end-stats {
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-bottom: 40px;
}

.stat {
  color: #aaa;
  font-size: 16px;
}

.btn-primary {
  padding: 12px 30px;
  background: linear-gradient(135deg, #8a2be2, #6a0dad);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(138, 43, 226, 0.5);
}
</style>
