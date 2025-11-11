<template>
  <div class="main-menu">
    <div class="background-overlay"></div>

    <div class="menu-container">
      <!-- Logo/Title -->
      <div class="game-title">
        <h1>COUNTER-STRIKE</h1>
        <p class="subtitle">WEB EDITION</p>
      </div>

      <!-- Main Menu Buttons -->
      <div class="menu-buttons">
        <button class="menu-btn primary" @click="startGame">
          <span class="btn-icon">▶</span>
          <span class="btn-text">START GAME</span>
        </button>

        <button class="menu-btn" @click="showSettings = !showSettings">
          <span class="btn-icon">⚙</span>
          <span class="btn-text">SETTINGS</span>
        </button>

        <button class="menu-btn" @click="showStats = !showStats">
          <span class="btn-icon">📊</span>
          <span class="btn-text">STATISTICS</span>
        </button>

        <button class="menu-btn" @click="showInfo = !showInfo">
          <span class="btn-icon">ℹ</span>
          <span class="btn-text">HOW TO PLAY</span>
        </button>
      </div>

      <!-- Player Info -->
      <div class="player-info">
        <div class="player-name">{{ playerName }}</div>
        <div class="player-stats">
          <span>Rank: {{ playerRank }}</span>
          <span>Wins: {{ wins }}</span>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettings" class="modal-overlay" @click="showSettings = false">
      <div class="modal-content" @click.stop>
        <h2>SETTINGS</h2>
        <div class="settings-group">
          <label>Player Name:</label>
          <input v-model="playerName" type="text" class="settings-input" />
        </div>
        <div class="settings-group">
          <label>Mouse Sensitivity:</label>
          <input v-model.number="sensitivity" type="range" min="0.1" max="2" step="0.1" class="settings-slider" />
          <span>{{ sensitivity.toFixed(1) }}</span>
        </div>
        <div class="settings-group">
          <label>Sound Volume:</label>
          <input v-model.number="volume" type="range" min="0" max="100" step="5" class="settings-slider" />
          <span>{{ volume }}%</span>
        </div>
        <button class="menu-btn primary" @click="saveSettings">SAVE</button>
      </div>
    </div>

    <!-- How to Play Modal -->
    <div v-if="showInfo" class="modal-overlay" @click="showInfo = false">
      <div class="modal-content" @click.stop>
        <h2>HOW TO PLAY</h2>
        <div class="info-section">
          <h3>CONTROLS</h3>
          <ul class="control-list">
            <li><strong>W/A/S/D</strong> - Move forward/left/backward/right</li>
            <li><strong>Mouse</strong> - Look around</li>
            <li><strong>Left Click</strong> - Shoot</li>
            <li><strong>R</strong> - Reload</li>
            <li><strong>1/2/3</strong> - Switch weapons</li>
            <li><strong>Shift</strong> - Sprint</li>
            <li><strong>Space</strong> - Jump</li>
            <li><strong>Tab</strong> - Show scoreboard</li>
            <li><strong>ESC</strong> - Pause menu</li>
          </ul>
          <h3>OBJECTIVE</h3>
          <p>Eliminate all enemy players to win the round. Each kill earns points. First team to reach the score limit wins!</p>
        </div>
        <button class="menu-btn primary" @click="showInfo = false">CLOSE</button>
      </div>
    </div>

    <!-- Statistics Modal -->
    <div v-if="showStats" class="modal-overlay" @click="showStats = false">
      <div class="modal-content" @click.stop>
        <h2>STATISTICS</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ wins }}</div>
            <div class="stat-label">Wins</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ losses }}</div>
            <div class="stat-label">Losses</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ totalKills }}</div>
            <div class="stat-label">Total Kills</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ totalDeaths }}</div>
            <div class="stat-label">Total Deaths</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ kdRatio }}</div>
            <div class="stat-label">K/D Ratio</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ accuracy }}%</div>
            <div class="stat-label">Accuracy</div>
          </div>
        </div>
        <button class="menu-btn primary" @click="showStats = false">CLOSE</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// Player data
const playerName = ref('Player')
const playerRank = ref('Silver I')
const wins = ref(0)
const losses = ref(0)
const totalKills = ref(0)
const totalDeaths = ref(0)
const accuracy = ref(0)

// Settings
const sensitivity = ref(1.0)
const volume = ref(70)

// Modal states
const showSettings = ref(false)
const showStats = ref(false)
const showInfo = ref(false)

// Computed stats
const kdRatio = computed(() => {
  if (totalDeaths.value === 0) return totalKills.value.toFixed(2)
  return (totalKills.value / totalDeaths.value).toFixed(2)
})

// Load player stats
const loadPlayerStats = async () => {
  try {
    const response = await axios.get('/api/player/stats')
    if (response.data) {
      wins.value = response.data.wins || 0
      losses.value = response.data.losses || 0
      totalKills.value = response.data.kills || 0
      totalDeaths.value = response.data.deaths || 0
      accuracy.value = response.data.accuracy || 0
      playerRank.value = response.data.rank || 'Silver I'
    }
  } catch (error) {
    console.log('Could not load player stats')
  }
}

const saveSettings = () => {
  localStorage.setItem('playerName', playerName.value)
  localStorage.setItem('sensitivity', sensitivity.value)
  localStorage.setItem('volume', volume.value)
  showSettings.value = false
}

const startGame = () => {
  saveSettings()
  router.push('/game')
}

onMounted(() => {
  // Load settings from localStorage
  const savedName = localStorage.getItem('playerName')
  const savedSensitivity = localStorage.getItem('sensitivity')
  const savedVolume = localStorage.getItem('volume')

  if (savedName) playerName.value = savedName
  if (savedSensitivity) sensitivity.value = parseFloat(savedSensitivity)
  if (savedVolume) volume.value = parseInt(savedVolume)

  loadPlayerStats()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-menu {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a2332 50%, #0d1421 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', 'Montserrat', 'Open Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.02) 0px,
      transparent 1px,
      transparent 2px,
      rgba(255, 255, 255, 0.02) 3px
    ),
    radial-gradient(circle at 50% 50%, rgba(26, 43, 60, 0.3), transparent 70%);
  pointer-events: none;
}

.menu-container {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 40px;
  background: rgba(18, 18, 18, 0.7);
  border: 2px solid rgba(255, 140, 0, 0.3);
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.game-title h1 {
  font-size: 64px;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 8px;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(255, 140, 0, 0.5),
               0 4px 8px rgba(0, 0, 0, 0.8);
}

.game-title .subtitle {
  font-size: 20px;
  font-weight: 400;
  color: #ff8c00;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 40px;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
  min-width: 400px;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(85, 85, 85, 0.3);
  border: 2px solid rgba(170, 170, 170, 0.3);
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.menu-btn::before {
  content: '';
  position: absolute;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 140, 0, 0.2), transparent);
  transition: left 0.5s ease;
}

.menu-btn:hover::before {
  left: 100%;
}

.menu-btn:hover {
  background: rgba(85, 85, 85, 0.5);
  border-color: #ff8c00;
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.3);
  transform: translateX(8px);
}

.menu-btn.primary {
  background: rgba(255, 140, 0, 0.2);
  border-color: #ff8c00;
}

.menu-btn.primary:hover {
  background: rgba(255, 140, 0, 0.4);
  box-shadow: 0 0 30px rgba(255, 140, 0, 0.5);
}

.btn-icon {
  font-size: 24px;
  min-width: 32px;
}

.btn-text {
  flex: 1;
  text-align: left;
}

.player-info {
  padding: 20px;
  background: rgba(26, 43, 60, 0.5);
  border: 1px solid rgba(170, 170, 170, 0.2);
  border-radius: 4px;
}

.player-name {
  font-size: 24px;
  font-weight: 600;
  color: #ff8c00;
  margin-bottom: 8px;
}

.player-stats {
  display: flex;
  gap: 24px;
  justify-content: center;
  font-size: 14px;
  color: #aaaaaa;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #1a2332;
  border: 2px solid #ff8c00;
  border-radius: 4px;
  padding: 40px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
}

.modal-content h2 {
  font-size: 32px;
  color: #ffffff;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 3px;
  border-bottom: 2px solid #ff8c00;
  padding-bottom: 12px;
}

.modal-content h3 {
  font-size: 20px;
  color: #ff8c00;
  margin: 20px 0 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.settings-group {
  margin-bottom: 24px;
}

.settings-group label {
  display: block;
  color: #cccccc;
  font-size: 14px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.settings-input {
  width: 100%;
  padding: 12px;
  background: rgba(85, 85, 85, 0.3);
  border: 2px solid rgba(170, 170, 170, 0.3);
  color: #ffffff;
  font-size: 16px;
  border-radius: 2px;
  transition: border-color 0.3s ease;
}

.settings-input:focus {
  outline: none;
  border-color: #ff8c00;
}

.settings-slider {
  width: calc(100% - 60px);
  margin-right: 12px;
}

.settings-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #ff8c00;
  cursor: pointer;
  border-radius: 2px;
}

.settings-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #ff8c00;
  cursor: pointer;
  border-radius: 2px;
  border: none;
}

.control-list {
  list-style: none;
  padding: 0;
}

.control-list li {
  color: #cccccc;
  padding: 8px 0;
  border-bottom: 1px solid rgba(170, 170, 170, 0.1);
}

.control-list strong {
  color: #ff8c00;
  display: inline-block;
  min-width: 150px;
}

.info-section p {
  color: #cccccc;
  line-height: 1.6;
  margin: 12px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-item {
  background: rgba(85, 85, 85, 0.3);
  border: 2px solid rgba(170, 170, 170, 0.2);
  padding: 20px;
  text-align: center;
  border-radius: 4px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #ff8c00;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: #aaaaaa;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Responsive */
@media (max-width: 768px) {
  .game-title h1 {
    font-size: 40px;
    letter-spacing: 4px;
  }

  .menu-buttons {
    min-width: 300px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .menu-container {
    padding: 20px;
  }

  .game-title h1 {
    font-size: 32px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
