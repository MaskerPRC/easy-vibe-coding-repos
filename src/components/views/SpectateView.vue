<template>
  <div class="spectate-view">
    <div class="view-header">
      <h2>观战大厅</h2>
      <button @click="handleBack" class="btn-back">返回</button>
    </div>

    <div class="games-list">
      <div
        v-for="gameItem in gamesList"
        :key="gameItem.id"
        @click="handleSpectateGame(gameItem.id)"
        class="game-item"
      >
        <div class="game-players">
          <span class="player-black">⚫ {{ gameItem.players.black }}</span>
          <span class="vs">VS</span>
          <span class="player-white">⚪ {{ gameItem.players.white }}</span>
        </div>
        <div class="game-meta">
          <span>{{ gameItem.moves }}手</span>
          <span>{{ gameItem.spectators }}人观战</span>
        </div>
      </div>

      <div v-if="gamesList.length === 0" class="empty-state">
        暂无进行中的对局
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  gamesList: Array
});

const emit = defineEmits(['back', 'spectate-game']);

const handleBack = () => {
  emit('back');
};

const handleSpectateGame = (gameId) => {
  emit('spectate-game', gameId);
};
</script>

<style scoped>
.spectate-view {
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

.games-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.game-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(138, 43, 226, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.game-item:hover {
  background: rgba(138, 43, 226, 0.1);
  border-color: #8a2be2;
  transform: translateX(5px);
}

.game-players {
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

.game-meta {
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
