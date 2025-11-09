<template>
  <div class="chrome-game">
    <canvas ref="gameCanvas" width="600" height="200"></canvas>
    <div v-if="!gameStarted" class="start-hint">按空格键开始游戏</div>
    <div v-if="gameOver" class="game-over">
      <p>游戏结束!</p>
      <p>得分: {{ score }}</p>
      <p>按空格键重新开始</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const gameCanvas = ref(null)
const gameStarted = ref(false)
const gameOver = ref(false)
const score = ref(0)

let ctx = null
let animationId = null

// 游戏对象
let dino = {
  x: 50,
  y: 150,
  width: 20,
  height: 40,
  dy: 0,
  gravity: 0.6,
  jumpPower: -12,
  grounded: true
}

let obstacles = []
let gameSpeed = 3
let frameCount = 0

const initGame = () => {
  if (!gameCanvas.value) return

  ctx = gameCanvas.value.getContext('2d')
  gameStarted.value = false
  gameOver.value = false
  score.value = 0
  dino.y = 150
  dino.dy = 0
  dino.grounded = true
  obstacles = []
  gameSpeed = 3
  frameCount = 0
}

const jump = () => {
  if (dino.grounded) {
    dino.dy = dino.jumpPower
    dino.grounded = false
  }
}

const handleKeyPress = (e) => {
  if (e.code === 'Space') {
    e.preventDefault()

    if (!gameStarted.value) {
      gameStarted.value = true
      gameLoop()
    } else if (gameOver.value) {
      initGame()
      gameStarted.value = true
      gameLoop()
    } else {
      jump()
    }
  }
}

const createObstacle = () => {
  obstacles.push({
    x: 600,
    y: 160,
    width: 20,
    height: 30
  })
}

const updateGame = () => {
  // 更新恐龙
  dino.dy += dino.gravity
  dino.y += dino.dy

  if (dino.y >= 150) {
    dino.y = 150
    dino.dy = 0
    dino.grounded = true
  }

  // 创建障碍物
  frameCount++
  if (frameCount % 100 === 0) {
    createObstacle()
  }

  // 更新障碍物
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= gameSpeed

    // 检测碰撞
    if (
      dino.x < obstacles[i].x + obstacles[i].width &&
      dino.x + dino.width > obstacles[i].x &&
      dino.y < obstacles[i].y + obstacles[i].height &&
      dino.y + dino.height > obstacles[i].y
    ) {
      gameOver.value = true
      cancelAnimationFrame(animationId)
      return
    }

    // 移除屏幕外的障碍物
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1)
      score.value++
    }
  }

  // 增加难度
  if (frameCount % 500 === 0 && gameSpeed < 8) {
    gameSpeed += 0.5
  }
}

const drawGame = () => {
  if (!ctx) return

  // 清空画布
  ctx.fillStyle = '#f7f7f7'
  ctx.fillRect(0, 0, 600, 200)

  // 画地面
  ctx.strokeStyle = '#535353'
  ctx.beginPath()
  ctx.moveTo(0, 190)
  ctx.lineTo(600, 190)
  ctx.stroke()

  // 画恐龙
  ctx.fillStyle = '#535353'
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height)

  // 画障碍物
  obstacles.forEach(obstacle => {
    ctx.fillStyle = '#535353'
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
  })

  // 画分数
  ctx.fillStyle = '#535353'
  ctx.font = '16px Arial'
  ctx.fillText(`分数: ${score.value}`, 10, 30)
}

const gameLoop = () => {
  if (gameOver.value) return

  updateGame()
  drawGame()

  animationId = requestAnimationFrame(gameLoop)
}

onMounted(() => {
  initGame()
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.chrome-game {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7f7f7;
  position: relative;
}

canvas {
  border: 2px solid #ddd;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.start-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: #535353;
  pointer-events: none;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.game-over p {
  margin: 10px 0;
  font-size: 18px;
  color: #535353;
}
</style>
