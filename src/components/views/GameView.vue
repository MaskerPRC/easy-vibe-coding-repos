<template>
  <div class="game-view">
    <div class="game-header">
      <div class="player-info player-black">
        <div class="player-avatar">⚫</div>
        <div class="player-details">
          <div class="player-name">{{ game?.players?.black?.username }}</div>
          <div class="player-province">{{ game?.players?.black?.province }}</div>
        </div>
        <div class="player-status" :class="{ active: game?.currentTurn === 'black' }">
          {{ game?.currentTurn === 'black' ? '思考中...' : '' }}
        </div>
      </div>

      <div class="game-status">
        <div class="turn-indicator">
          <span v-if="game?.currentTurn === myColor" class="your-turn">你的回合</span>
          <span v-else class="opponent-turn">对手回合</span>
        </div>
        <div class="move-count">第 {{ game?.moves?.length || 0 }} 手</div>
      </div>

      <div class="player-info player-white">
        <div class="player-avatar">⚪</div>
        <div class="player-details">
          <div class="player-name">{{ game?.players?.white?.username }}</div>
          <div class="player-province">{{ game?.players?.white?.province }}</div>
        </div>
        <div class="player-status" :class="{ active: game?.currentTurn === 'white' }">
          {{ game?.currentTurn === 'white' ? '思考中...' : '' }}
        </div>
      </div>
    </div>

    <div class="game-main">
      <slot name="board"></slot>

      <!-- 右侧面板 -->
      <div class="side-panel">
        <slot name="skills"></slot>
        <slot name="chat"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  game: Object,
  myColor: String
});
</script>

<style scoped>
.game-view {
  min-height: 100vh;
  padding: 20px;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.player-avatar {
  font-size: 48px;
}

.player-details {
  flex: 1;
}

.player-name {
  font-size: 20px;
  font-weight: 600;
  color: #e0e0e0;
}

.player-province {
  font-size: 14px;
  color: #aaa;
}

.player-status {
  font-size: 14px;
  color: #32cd32;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.player-status.active {
  opacity: 1;
}

.game-status {
  text-align: center;
  padding: 0 40px;
}

.turn-indicator {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.your-turn {
  color: #32cd32;
  animation: pulse 1.5s ease-in-out infinite;
}

.opponent-turn {
  color: #ffa500;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.move-count {
  color: #aaa;
  font-size: 14px;
}

.game-main {
  display: flex;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  justify-content: center;
}

.side-panel {
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 1200px) {
  .game-main {
    flex-direction: column;
    align-items: center;
  }

  .side-panel {
    width: 100%;
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 20px;
  }

  .player-info {
    width: 100%;
  }
}
</style>
