<template>
  <div class="not-found-page">
    <!-- Logo或网站名 -->
    <div class="header">
      <h2 class="site-name">我的网站</h2>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 404 提示 -->
      <div class="error-info">
        <h1 class="error-code">404</h1>
        <p class="error-message">页面丢失了</p>
        <p class="error-hint">别担心,你可以玩个小游戏放松一下!</p>
      </div>

      <!-- 游戏区域 -->
      <div class="game-container">
        <div class="game-header">
          <div class="score-display">
            <span class="score-label">当前分数:</span>
            <span class="score-value">{{ score }}</span>
          </div>
          <div class="high-score-display">
            <span class="score-label">最高分:</span>
            <span class="score-value">{{ highScore }}</span>
          </div>
        </div>

        <canvas
          ref="gameCanvas"
          :width="canvasWidth"
          :height="canvasHeight"
          @click="handleJump"
          @keydown="handleJump"
          tabindex="0"
        ></canvas>

        <div class="game-info">
          <p v-if="!gameStarted && !gameOver" class="game-hint">
            点击或按空格键开始游戏
          </p>
          <p v-if="gameOver" class="game-over-text">
            游戏结束! 点击或按空格键重新开始
          </p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <button class="action-btn primary" @click="goHome">返回首页</button>
        <button class="action-btn secondary" @click="restartGame">重新开始</button>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <p class="copyright">&copy; 2024 我的网站. 保留所有权利.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// 游戏配置
const canvasWidth = 600
const canvasHeight = 200
const gameCanvas = ref(null)
let ctx = null

// 游戏状态
const gameStarted = ref(false)
const gameOver = ref(false)
const score = ref(0)
const highScore = ref(0)

// 游戏对象
let dino = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  velocityY: 0,
  gravity: 0.6,
  jumpPower: -12,
  isJumping: false
}

let obstacles = []
let animationId = null
let gameSpeed = 5
let frameCount = 0

// 导航到首页
const goHome = () => {
  router.push('/')
}

// 重新开始游戏
const restartGame = () => {
  resetGame()
  startGame()
}

// 处理跳跃
const handleJump = (event) => {
  if (event.type === 'keydown' && event.code !== 'Space') {
    return
  }

  event.preventDefault()

  if (!gameStarted.value) {
    startGame()
    return
  }

  if (gameOver.value) {
    restartGame()
    return
  }

  jump()
}

// 跳跃
const jump = () => {
  if (!dino.isJumping) {
    dino.velocityY = dino.jumpPower
    dino.isJumping = true
  }
}

// 开始游戏
const startGame = () => {
  gameStarted.value = true
  gameOver.value = false
  score.value = 0
  obstacles = []
  frameCount = 0
  gameSpeed = 5
  gameLoop()
}

// 重置游戏
const resetGame = () => {
  dino.y = 150
  dino.velocityY = 0
  dino.isJumping = false
  obstacles = []
  frameCount = 0
  gameSpeed = 5
}

// 生成障碍物
const generateObstacle = () => {
  const obstacle = {
    x: canvasWidth,
    y: 160,
    width: 20,
    height: 30
  }
  obstacles.push(obstacle)
}

// 更新游戏状态
const update = () => {
  // 更新恐龙位置
  dino.velocityY += dino.gravity
  dino.y += dino.velocityY

  // 地面碰撞检测
  if (dino.y >= 150) {
    dino.y = 150
    dino.velocityY = 0
    dino.isJumping = false
  }

  // 生成障碍物
  frameCount++
  if (frameCount % 100 === 0) {
    generateObstacle()
  }

  // 更新障碍物位置
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= gameSpeed

    // 移除屏幕外的障碍物
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1)
      score.value += 10

      // 逐渐增加游戏速度
      if (score.value % 100 === 0) {
        gameSpeed += 0.5
      }
    }

    // 碰撞检测
    if (checkCollision(dino, obstacle)) {
      endGame()
    }
  })
}

// 碰撞检测
const checkCollision = (dino, obstacle) => {
  return (
    dino.x < obstacle.x + obstacle.width &&
    dino.x + dino.width > obstacle.x &&
    dino.y < obstacle.y + obstacle.height &&
    dino.y + dino.height > obstacle.y
  )
}

// 绘制游戏
const draw = () => {
  // 清空画布
  ctx.fillStyle = '#F8F8F8'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // 绘制地面
  ctx.fillStyle = '#4A4A4A'
  ctx.fillRect(0, 190, canvasWidth, 2)

  // 绘制恐龙
  ctx.fillStyle = '#7B7B7B'
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height)

  // 绘制恐龙眼睛
  ctx.fillStyle = '#333333'
  ctx.fillRect(dino.x + 25, dino.y + 8, 5, 5)

  // 绘制恐龙腿部(简单矩形)
  ctx.fillStyle = '#7B7B7B'
  const legY = dino.y + dino.height
  ctx.fillRect(dino.x + 8, legY - 10, 6, 10)
  ctx.fillRect(dino.x + 26, legY - 10, 6, 10)

  // 绘制障碍物
  obstacles.forEach(obstacle => {
    ctx.fillStyle = '#4A4A4A'
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
  })
}

// 游戏循环
const gameLoop = () => {
  if (gameOver.value) {
    return
  }

  update()
  draw()
  animationId = requestAnimationFrame(gameLoop)
}

// 结束游戏
const endGame = async () => {
  gameOver.value = true
  gameStarted.value = false

  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  // 保存最高分
  if (score.value > highScore.value) {
    highScore.value = score.value
    await saveHighScore(score.value)
  }
}

// 保存最高分到后端
const saveHighScore = async (newScore) => {
  try {
    await axios.post('/api/scores', { score: newScore })
  } catch (error) {
    console.error('保存分数失败:', error)
  }
}

// 从后端获取最高分
const loadHighScore = async () => {
  try {
    const response = await axios.get('/api/scores')
    if (response.data && response.data.highScore) {
      highScore.value = response.data.highScore
    }
  } catch (error) {
    console.error('获取最高分失败:', error)
  }
}

// 键盘事件监听
const handleKeyPress = (event) => {
  if (event.code === 'Space') {
    handleJump(event)
  }
}

// 组件挂载
onMounted(() => {
  const canvas = gameCanvas.value
  if (canvas) {
    ctx = canvas.getContext('2d')

    // 绘制初始状态
    ctx.fillStyle = '#F8F8F8'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 绘制地面
    ctx.fillStyle = '#4A4A4A'
    ctx.fillRect(0, 190, canvasWidth, 2)

    // 绘制初始恐龙
    ctx.fillStyle = '#7B7B7B'
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height)
    ctx.fillStyle = '#333333'
    ctx.fillRect(dino.x + 25, dino.y + 8, 5, 5)
    ctx.fillStyle = '#7B7B7B'
    ctx.fillRect(dino.x + 8, dino.y + dino.height - 10, 6, 10)
    ctx.fillRect(dino.x + 26, dino.y + dino.height - 10, 6, 10)

    canvas.focus()
  }

  // 加载最高分
  loadHighScore()

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyPress)
})

// 组件卸载
onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: #F8F8F8;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 头部 */
.header {
  padding: 24px 32px;
  text-align: center;
}

.site-name {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
  margin: 0;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

/* 错误信息 */
.error-info {
  text-align: center;
  margin-bottom: 48px;
}

.error-code {
  font-size: 96px;
  font-weight: 700;
  color: #4A4A4A;
  margin: 0 0 16px 0;
  line-height: 1;
  letter-spacing: -2px;
}

.error-message {
  font-size: 28px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 16px 0;
}

.error-hint {
  font-size: 16px;
  color: #888888;
  margin: 0;
}

/* 游戏容器 */
.game-container {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(74, 74, 74, 0.1);
  margin-bottom: 48px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 24px;
}

.score-display,
.high-score-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-label {
  font-size: 14px;
  color: #888888;
  font-weight: 500;
}

.score-value {
  font-size: 24px;
  font-weight: 700;
  color: #FFD700;
}

canvas {
  display: block;
  border: 2px solid #4A4A4A;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  background: #F8F8F8;
}

.game-info {
  margin-top: 16px;
  text-align: center;
  min-height: 24px;
}

.game-hint,
.game-over-text {
  font-size: 14px;
  color: #888888;
  margin: 0;
  font-weight: 500;
}

.game-over-text {
  color: #FFD700;
  font-weight: 600;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.action-btn.primary {
  background: #FFD700;
  color: #333333;
}

.action-btn.primary:hover {
  background: #FFC700;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 215, 0, 0.3);
}

.action-btn.secondary {
  background: #7B7B7B;
  color: #FFFFFF;
}

.action-btn.secondary:hover {
  background: #6B6B6B;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(123, 123, 123, 0.3);
}

.action-btn:active {
  transform: translateY(0);
}

/* 底部 */
.footer {
  padding: 24px 32px;
  text-align: center;
  border-top: 1px solid #E0E0E0;
}

.copyright {
  font-size: 14px;
  color: #888888;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-code {
    font-size: 72px;
  }

  .error-message {
    font-size: 24px;
  }

  .error-hint {
    font-size: 14px;
  }

  .game-container {
    padding: 16px;
    width: 100%;
    max-width: 100%;
  }

  canvas {
    width: 100%;
    height: auto;
  }

  .game-header {
    flex-direction: column;
    gap: 12px;
  }

  .actions {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 56px;
  }

  .error-message {
    font-size: 20px;
  }

  .error-hint {
    font-size: 13px;
  }

  .site-name {
    font-size: 20px;
  }

  .score-label {
    font-size: 12px;
  }

  .score-value {
    font-size: 20px;
  }
}
</style>
