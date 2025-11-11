<template>
  <div class="game-arena" ref="gameContainer">
    <!-- Canvas for 3D rendering -->
    <canvas ref="gameCanvas" @click="lockPointer"></canvas>

    <!-- HUD Overlay -->
    <div class="hud-overlay" v-if="!isPaused && !gameOver">
      <!-- Score Display -->
      <ScoreDisplay
        :ctScore="ctScore"
        :tScore="tScore"
        :roundTime="roundTime"
      />

      <!-- Kill Feed -->
      <KillFeed :killFeed="killFeed" />

      <!-- Mini Map -->
      <MiniMap
        :allPlayers="allPlayers"
        :mapWidth="mapWidth"
        :mapHeight="mapHeight"
      />

      <!-- Game HUD (Crosshair, Health, Ammo, Weapon Selector) -->
      <GameHUD
        :playerHealth="playerHealth"
        :playerArmor="playerArmor"
        :currentWeapon="currentWeapon"
        :currentAmmo="currentAmmo"
        :reserveAmmo="reserveAmmo"
        :isReloading="isReloading"
        :weapons="weapons"
        :currentWeaponIndex="currentWeaponIndex"
      />
    </div>

    <!-- Pause Menu -->
    <PauseMenu
      v-if="isPaused"
      @resume="resumeGameHandler"
      @settings="showSettings = true"
      @main-menu="returnToMenu"
    />

    <!-- Game Over Screen -->
    <GameOverScreen
      v-if="gameOver"
      :gameOverMessage="gameOverMessage"
      :playerKills="playerKills"
      :playerDeaths="playerDeaths"
      :kdRatio="kdRatio"
      :accuracy="accuracy"
      @play-again="playAgain"
      @main-menu="returnToMenu"
    />

    <!-- Instructions Overlay (shown initially) -->
    <InstructionsOverlay
      v-if="showInstructions"
      @start="startGameHandler"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

// Components
import ScoreDisplay from './game/ScoreDisplay.vue'
import KillFeed from './game/KillFeed.vue'
import MiniMap from './game/MiniMap.vue'
import GameHUD from './game/GameHUD.vue'
import PauseMenu from './game/PauseMenu.vue'
import GameOverScreen from './game/GameOverScreen.vue'
import InstructionsOverlay from './game/InstructionsOverlay.vue'

// Composables
import { usePlayerState } from '@/composables/usePlayerState'
import { useWeaponSystem } from '@/composables/useWeaponSystem'
import { useEnemySystem } from '@/composables/useEnemySystem'
import { useGameRenderer } from '@/composables/useGameRenderer'
import { useGameControls } from '@/composables/useGameControls'
import { useGameState } from '@/composables/useGameState'

const router = useRouter()

// Refs
const gameCanvas = ref(null)
const gameContainer = ref(null)
const showSettings = ref(false)

// Initialize composables
const {
  playerHealth,
  playerArmor,
  playerKills,
  playerDeaths,
  shotsFired,
  shotsHit,
  playerPosition,
  playerRotation,
  playerPitch,
  kdRatio,
  accuracy,
  resetPlayerState,
  updatePlayerPosition,
  updatePlayerRotation,
  recordShot,
  recordKill
} = usePlayerState()

const {
  weapons,
  currentWeaponIndex,
  currentAmmo,
  reserveAmmo,
  isReloading,
  currentWeapon,
  switchWeapon,
  reload,
  shoot: weaponShoot,
  resetWeaponState
} = useWeaponSystem()

const {
  enemies,
  mapWidth,
  mapHeight,
  getAliveEnemies,
  spawnEnemies,
  updateEnemies,
  checkHit
} = useEnemySystem()

const {
  initRenderer,
  render: renderFrame
} = useGameRenderer(gameCanvas)

const {
  pointerLocked,
  lockPointer,
  unlockPointer,
  updatePlayerRotation: updateRotation,
  updatePlayerMovement,
  registerEventListeners,
  removeEventListeners
} = useGameControls(gameCanvas)

const {
  isPaused,
  gameOver,
  showInstructions,
  gameStarted,
  gameOverMessage,
  ctScore,
  tScore,
  roundTime,
  killFeed,
  addKillToFeed,
  startRoundTimer,
  stopRoundTimer,
  startGame,
  pauseGame,
  resumeGame,
  togglePause,
  endGame,
  saveGameStats,
  resetGame,
  incrementCTScore,
  cleanup: cleanupGameState
} = useGameState()

// Game loop variables
let animationId = null
let gameLoopRunning = false

// Computed - All players for minimap
const allPlayers = computed(() => {
  return [
    {
      id: 'player',
      x: playerPosition.value.x,
      z: playerPosition.value.z,
      team: 'ct'
    },
    ...getAliveEnemies.value
  ]
})

// Initialize game
const initGame = () => {
  if (!gameCanvas.value) return

  // Initialize renderer
  initRenderer()

  // Spawn enemies
  spawnEnemies()

  // Register event listeners
  registerEventListeners({
    onPause: handlePause,
    onReload: reload,
    onSwitchWeapon: switchWeapon,
    onShoot: handleShoot
  })

  // Start game loop
  gameLoopRunning = true
  gameLoop()

  // Start round timer
  startRoundTimer(handleTimeUp)
}

// Game loop
const gameLoop = () => {
  if (!gameLoopRunning) return

  if (!isPaused.value && !gameOver.value && gameStarted.value) {
    // Update player rotation
    const sensitivity = parseFloat(localStorage.getItem('sensitivity') || 1.0)
    const { rotation, pitch } = updateRotation(
      playerRotation.value,
      playerPitch.value,
      sensitivity
    )
    updatePlayerRotation(rotation, pitch)

    // Update player movement
    const { x, z } = updatePlayerMovement(
      playerPosition.value.x,
      playerPosition.value.z,
      playerRotation.value
    )
    updatePlayerPosition(x, z)

    // Update enemies
    updateEnemies()

    // Render game
    renderFrame(
      playerPosition.value.x,
      playerPosition.value.z,
      playerRotation.value,
      getAliveEnemies.value
    )
  }

  animationId = requestAnimationFrame(gameLoop)
}

// Handle pause
const handlePause = () => {
  togglePause()
  if (isPaused.value) {
    unlockPointer()
  }
}

// Handle shooting
const handleShoot = () => {
  if (!pointerLocked.value || isPaused.value || gameOver.value) return

  const shotSuccess = weaponShoot()
  if (!shotSuccess) return

  recordShot(false)

  // Check for hits
  const hitResult = checkHit(
    playerPosition.value.x,
    playerPosition.value.z,
    playerRotation.value,
    currentWeapon.value.damage
  )

  if (hitResult.hit) {
    recordShot(true) // Override to record as hit

    if (hitResult.killed) {
      recordKill()
      incrementCTScore()

      // Add to kill feed
      addKillToFeed('Player', currentWeapon.value.icon, `Enemy ${hitResult.enemyId + 1}`)

      // Check win condition
      if (ctScore.value >= 5) {
        handleGameEnd('COUNTER-TERRORISTS WIN!')
      }
    }
  }
}

// Handle time up
const handleTimeUp = () => {
  handleGameEnd("TIME'S UP - TERRORISTS WIN!")
}

// Handle game end
const handleGameEnd = (message) => {
  endGame(message)
  unlockPointer()

  // Save stats to backend
  saveGameStats(
    playerKills.value,
    playerDeaths.value,
    accuracy.value,
    message.includes('COUNTER-TERRORISTS WIN')
  )
}

// Start game handler
const startGameHandler = () => {
  startGame()
  lockPointer()
}

// Resume game
const resumeGameHandler = () => {
  resumeGame()
  lockPointer()
}

// Return to main menu
const returnToMenu = () => {
  router.push('/')
}

// Play again
const playAgain = () => {
  // Reset all states
  resetPlayerState()
  resetWeaponState()
  resetGame()

  spawnEnemies()
  startRoundTimer(handleTimeUp)
  lockPointer()
}

// Cleanup
onMounted(() => {
  initGame()
})

onUnmounted(() => {
  gameLoopRunning = false
  if (animationId) cancelAnimationFrame(animationId)

  stopRoundTimer()
  cleanupGameState()
  removeEventListeners()
})
</script>

<style scoped>
.game-arena {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  font-family: 'Roboto', 'Montserrat', sans-serif;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: none;
}

.hud-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
</style>
