<template>
  <div class="error-page">
    <div class="error-content">
      <div class="icon-wrapper">
        <svg class="icon-offline" width="150" height="150" viewBox="0 0 200 200">
          <!-- Dinosaur Icon -->
          <path d="M 40 120 L 40 100 L 50 90 L 60 85 L 80 85 L 90 90 L 100 85 L 110 85 L 120 90 L 130 100 L 140 120 L 140 140 L 130 150 L 120 155 L 110 155 L 100 150 L 90 155 L 80 155 L 70 150 L 60 145 L 50 140 L 40 130 Z" fill="#595959"/>
          <!-- Eye -->
          <circle cx="75" cy="100" r="3" fill="white"/>
          <!-- Legs -->
          <rect x="65" y="145" width="8" height="20" fill="#595959"/>
          <rect x="95" y="145" width="8" height="20" fill="#595959"/>
        </svg>
      </div>

      <h1>无法访问此网站</h1>
      <p class="error-code">ERR_INTERNET_DISCONNECTED</p>

      <div class="error-info">
        <ul>
          <li>检查网络连接</li>
          <li>检查代理服务器和防火墙</li>
          <li>运行 Windows 网络诊断</li>
        </ul>
      </div>

      <button class="reload-button" @click="reloadPage">重新加载</button>

      <p class="hint">按 <strong>空格键</strong> 开始游戏</p>
    </div>

    <!-- Dinosaur Game Canvas -->
    <canvas
      ref="gameCanvas"
      class="game-canvas"
      @click="startGame"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const gameCanvas = ref(null)
let ctx = null
let gameLoop = null
let isGameRunning = false
let isGameOver = false
let score = 0
let highScore = 0

// Game objects
const dino = {
  x: 50,
  y: 0,
  width: 40,
  height: 43,
  velocityY: 0,
  isJumping: false
}

const obstacles = []
const clouds = []

// Game constants
const GRAVITY = 0.6
const JUMP_FORCE = -12
const GAME_SPEED = 6
const GROUND_Y = 150

// Initialize game
const initGame = () => {
  const canvas = gameCanvas.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = 200

  dino.y = GROUND_Y

  // Load high score from localStorage
  const savedHighScore = localStorage.getItem('dinoHighScore')
  if (savedHighScore) {
    highScore = parseInt(savedHighScore)
  }

  // Add initial clouds
  for (let i = 0; i < 3; i++) {
    clouds.push({
      x: Math.random() * canvas.width,
      y: 20 + Math.random() * 60,
      width: 46,
      height: 14
    })
  }

  drawGame()
}

// Draw dinosaur
const drawDino = () => {
  ctx.fillStyle = '#535353'

  // Body
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height)

  // Eye
  ctx.fillStyle = '#fff'
  ctx.fillRect(dino.x + 28, dino.y + 8, 4, 4)

  // Legs (simple animation)
  const legOffset = Math.floor(score / 5) % 2 === 0 ? 0 : 4
  ctx.fillStyle = '#535353'
  ctx.fillRect(dino.x + 10, dino.y + 43, 6, 10)
  ctx.fillRect(dino.x + 24 + legOffset, dino.y + 43, 6, 10)
}

// Draw obstacle (cactus)
const drawObstacle = (obstacle) => {
  ctx.fillStyle = '#535353'

  // Cactus body
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)

  // Cactus arms
  if (obstacle.type === 'large') {
    ctx.fillRect(obstacle.x - 6, obstacle.y + 10, 6, 15)
    ctx.fillRect(obstacle.x + obstacle.width, obstacle.y + 10, 6, 15)
  }
}

// Draw cloud
const drawCloud = (cloud) => {
  ctx.fillStyle = '#ccc'
  ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height)
  ctx.fillRect(cloud.x + 10, cloud.y - 6, 26, 6)
  ctx.fillRect(cloud.x + 16, cloud.y - 12, 14, 6)
}

// Draw ground
const drawGround = () => {
  const groundY = GROUND_Y + dino.height
  ctx.strokeStyle = '#535353'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, groundY)
  ctx.lineTo(gameCanvas.value.width, groundY)
  ctx.stroke()

  // Ground dots
  for (let i = 0; i < gameCanvas.value.width; i += 20) {
    ctx.fillRect(i + (Math.floor(score) % 20), groundY + 2, 2, 2)
  }
}

// Draw score
const drawScore = () => {
  ctx.fillStyle = '#535353'
  ctx.font = '16px monospace'
  ctx.textAlign = 'right'

  const scoreText = 'Score: ' + Math.floor(score).toString().padStart(5, '0')
  ctx.fillText(scoreText, gameCanvas.value.width - 20, 30)

  if (highScore > 0) {
    const hiText = 'HI: ' + highScore.toString().padStart(5, '0')
    ctx.fillText(hiText, gameCanvas.value.width - 20, 50)
  }
}

// Draw game over message
const drawGameOver = () => {
  ctx.fillStyle = '#535353'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('GAME OVER', gameCanvas.value.width / 2, 80)

  ctx.font = '16px Arial'
  ctx.fillText('按空格键重新开始', gameCanvas.value.width / 2, 110)
}

// Update game state
const update = () => {
  if (!isGameRunning || isGameOver) return

  // Update score
  score += 0.1

  // Update dinosaur
  if (dino.isJumping) {
    dino.velocityY += GRAVITY
    dino.y += dino.velocityY

    if (dino.y >= GROUND_Y) {
      dino.y = GROUND_Y
      dino.velocityY = 0
      dino.isJumping = false
    }
  }

  // Update obstacles
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= GAME_SPEED

    // Remove off-screen obstacles
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1)
    }

    // Check collision
    if (checkCollision(dino, obstacle)) {
      gameOver()
    }
  })

  // Add new obstacles
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < gameCanvas.value.width - 300) {
    const type = Math.random() > 0.5 ? 'large' : 'small'
    obstacles.push({
      x: gameCanvas.value.width,
      y: type === 'large' ? GROUND_Y - 30 : GROUND_Y - 20,
      width: type === 'large' ? 20 : 14,
      height: type === 'large' ? 50 : 40,
      type: type
    })
  }

  // Update clouds
  clouds.forEach((cloud, index) => {
    cloud.x -= 0.5

    if (cloud.x + cloud.width < 0) {
      cloud.x = gameCanvas.value.width
      cloud.y = 20 + Math.random() * 60
    }
  })
}

// Draw game
const drawGame = () => {
  // Clear canvas
  ctx.fillStyle = '#f7f7f7'
  ctx.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height)

  // Draw clouds
  clouds.forEach(cloud => drawCloud(cloud))

  // Draw ground
  drawGround()

  // Draw dinosaur
  drawDino()

  // Draw obstacles
  obstacles.forEach(obstacle => drawObstacle(obstacle))

  // Draw score
  drawScore()

  // Draw game over
  if (isGameOver) {
    drawGameOver()
  }
}

// Main game loop
const gameLoopFunction = () => {
  update()
  drawGame()
  gameLoop = requestAnimationFrame(gameLoopFunction)
}

// Check collision
const checkCollision = (dino, obstacle) => {
  return (
    dino.x < obstacle.x + obstacle.width - 5 &&
    dino.x + dino.width - 5 > obstacle.x &&
    dino.y < obstacle.y + obstacle.height &&
    dino.y + dino.height > obstacle.y
  )
}

// Jump function
const jump = () => {
  if (!dino.isJumping && !isGameOver) {
    if (!isGameRunning) {
      startGame()
    }
    dino.isJumping = true
    dino.velocityY = JUMP_FORCE
  }
}

// Start game
const startGame = () => {
  if (isGameOver) {
    // Reset game
    isGameOver = false
    score = 0
    obstacles.length = 0
    dino.y = GROUND_Y
    dino.velocityY = 0
    dino.isJumping = false
  }

  if (!isGameRunning) {
    isGameRunning = true
    gameLoopFunction()
  }
}

// Game over
const gameOver = () => {
  isGameOver = true

  // Update high score
  if (Math.floor(score) > highScore) {
    highScore = Math.floor(score)
    localStorage.setItem('dinoHighScore', highScore.toString())
  }
}

// Reload page
const reloadPage = () => {
  window.location.reload()
}

// Keyboard controls
const handleKeyDown = (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault()
    jump()
  }
}

// Resize handler
const handleResize = () => {
  if (gameCanvas.value) {
    gameCanvas.value.width = window.innerWidth
    drawGame()
  }
}

onMounted(() => {
  initGame()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (gameLoop) {
    cancelAnimationFrame(gameLoop)
  }
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: #f7f7f7;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  padding-top: 100px;
}

.error-content {
  text-align: center;
  max-width: 600px;
  padding: 0 20px;
}

.icon-wrapper {
  margin-bottom: 30px;
}

.icon-offline {
  opacity: 0.3;
}

h1 {
  font-size: 28px;
  font-weight: normal;
  color: #333;
  margin-bottom: 16px;
}

.error-code {
  font-size: 14px;
  color: #646464;
  margin-bottom: 32px;
  font-family: monospace;
}

.error-info {
  text-align: left;
  margin-bottom: 32px;
}

.error-info ul {
  list-style: none;
  padding-left: 0;
}

.error-info li {
  color: #646464;
  font-size: 14px;
  line-height: 1.8;
  padding-left: 20px;
  position: relative;
}

.error-info li:before {
  content: "•";
  position: absolute;
  left: 0;
}

.reload-button {
  background: #4285f4;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 24px;
}

.reload-button:hover {
  background: #3367d6;
}

.reload-button:active {
  background: #2851a3;
}

.hint {
  color: #646464;
  font-size: 13px;
  margin-top: 16px;
}

.hint strong {
  color: #333;
  font-weight: 600;
}

.game-canvas {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  cursor: pointer;
  background: #f7f7f7;
}

@media (max-width: 768px) {
  .error-page {
    padding-top: 60px;
  }

  h1 {
    font-size: 22px;
  }

  .icon-offline {
    width: 100px;
    height: 100px;
  }
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

#app {
  height: 100%;
}
</style>
