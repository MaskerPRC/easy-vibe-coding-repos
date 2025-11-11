<template>
  <div class="game-over-screen">
    <div class="game-over-content">
      <h1 class="game-over-title">{{ gameOverMessage }}</h1>
      <div class="final-stats">
        <div class="stat-row">
          <span>Kills:</span>
          <span class="stat-value">{{ playerKills }}</span>
        </div>
        <div class="stat-row">
          <span>Deaths:</span>
          <span class="stat-value">{{ playerDeaths }}</span>
        </div>
        <div class="stat-row">
          <span>K/D Ratio:</span>
          <span class="stat-value">{{ kdRatio }}</span>
        </div>
        <div class="stat-row">
          <span>Accuracy:</span>
          <span class="stat-value">{{ accuracy }}%</span>
        </div>
      </div>
      <button class="menu-btn primary" @click="$emit('play-again')">PLAY AGAIN</button>
      <button class="menu-btn" @click="$emit('main-menu')">MAIN MENU</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  gameOverMessage: {
    type: String,
    required: true
  },
  playerKills: {
    type: Number,
    required: true
  },
  playerDeaths: {
    type: Number,
    required: true
  },
  kdRatio: {
    type: String,
    required: true
  },
  accuracy: {
    type: String,
    required: true
  }
})

defineEmits(['play-again', 'main-menu'])
</script>

<style scoped>
.game-over-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

.game-over-content {
  text-align: center;
  background: rgba(26, 35, 50, 0.95);
  padding: 50px 70px;
  border: 2px solid #ff8c00;
  border-radius: 4px;
  max-width: 500px;
}

.game-over-title {
  font-size: 40px;
  font-weight: 700;
  color: #ff8c00;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 0 0 20px rgba(255, 140, 0, 0.5);
}

.final-stats {
  margin-bottom: 30px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(170, 170, 170, 0.2);
  color: #cccccc;
}

.stat-value {
  color: #ff8c00;
  font-weight: 700;
}

.menu-btn {
  display: block;
  width: 100%;
  padding: 15px 30px;
  margin: 10px 0;
  background: rgba(85, 85, 85, 0.3);
  border: 2px solid rgba(170, 170, 170, 0.3);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
}

.menu-btn:hover {
  background: rgba(85, 85, 85, 0.5);
  border-color: #ff8c00;
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.3);
}

.menu-btn.primary {
  background: rgba(255, 140, 0, 0.3);
  border-color: #ff8c00;
}

.menu-btn.primary:hover {
  background: rgba(255, 140, 0, 0.5);
  box-shadow: 0 0 30px rgba(255, 140, 0, 0.5);
}
</style>
