<template>
  <div class="game-container">
    <!-- 游戏标题 -->
    <div class="game-header">
      <h1 class="game-title">软体俄罗斯方块</h1>
      <p class="game-subtitle">物理引擎驱动的经典游戏</p>
    </div>

    <!-- 主游戏区域 -->
    <div class="game-main">
      <!-- 游戏画布 -->
      <div class="canvas-wrapper">
        <canvas ref="gameCanvas" class="game-canvas"></canvas>
        <!-- 游戏结束覆盖层 -->
        <div v-if="gameOver" class="game-over-overlay">
          <div class="game-over-content">
            <h2>游戏结束</h2>
            <p>最终得分: {{ score }}</p>
            <button @click="restartGame" class="restart-btn">重新开始</button>
          </div>
        </div>
      </div>

      <!-- 信息面板 -->
      <div class="info-panel">
        <!-- 得分卡片 -->
        <div class="info-card">
          <h3 class="card-title">得分</h3>
          <p class="card-value score-value">{{ score }}</p>
        </div>

        <!-- 等级卡片 -->
        <div class="info-card">
          <h3 class="card-title">等级</h3>
          <p class="card-value level-value">{{ level }}</p>
        </div>

        <!-- 已消除行数 -->
        <div class="info-card">
          <h3 class="card-title">已消除</h3>
          <p class="card-value lines-value">{{ linesCleared }} 行</p>
        </div>

        <!-- 控制说明 -->
        <div class="info-card controls-card">
          <h3 class="card-title">操作说明</h3>
          <ul class="controls-list">
            <li><span class="key">←</span> 左移</li>
            <li><span class="key">→</span> 右移</li>
            <li><span class="key">↓</span> 加速下落</li>
            <li><span class="key">↑</span> 旋转</li>
            <li><span class="key">空格</span> 暂停</li>
          </ul>
        </div>

        <!-- 游戏控制按钮 -->
        <div class="game-controls">
          <button @click="togglePause" class="control-btn" :class="{ 'paused': isPaused }">
            {{ isPaused ? '继续' : '暂停' }}
          </button>
          <button @click="restartGame" class="control-btn restart">
            重新开始
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Matter from 'matter-js'

// 响应式状态
const gameCanvas = ref(null)
const score = ref(0)
const level = ref(1)
const linesCleared = ref(0)
const gameOver = ref(false)
const isPaused = ref(false)

// Matter.js 引擎相关
let engine = null
let render = null
let runner = null
let world = null

// 游戏配置
const COLS = 10
const ROWS = 20
const BLOCK_SIZE = 25
const CANVAS_WIDTH = COLS * BLOCK_SIZE
const CANVAS_HEIGHT = ROWS * BLOCK_SIZE

// 方块颜色 - 根据UI设计规范
const COLORS = {
  I: '#66CCFF', // 科技蓝
  O: '#FFCC66', // 琥珀黄
  T: '#FF6699', // 桃红
  S: '#99FFCC', // 薄荷绿
  Z: '#FF6699', // 桃红
  J: '#66CCFF', // 科技蓝
  L: '#FFCC66'  // 琥珀黄
}

// 俄罗斯方块形状定义
const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
}

// 当前方块相关
let currentPiece = null
let currentPieceType = null
let currentPieceBodies = []
let pieceX = 0
let pieceY = 0
let groundBodies = []

// 游戏循环
let gameLoopInterval = null
let dropSpeed = 1000

// 初始化 Matter.js 引擎
const initEngine = () => {
  const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter

  // 创建引擎
  engine = Engine.create({
    gravity: { x: 0, y: 0.5 }
  })
  world = engine.world

  // 创建渲染器
  render = Render.create({
    canvas: gameCanvas.value,
    engine: engine,
    options: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      wireframes: false,
      background: '#1C1C2C'
    }
  })

  // 创建边界
  const wallOptions = {
    isStatic: true,
    render: {
      fillStyle: '#2C2C3C'
    }
  }

  // 底部墙
  const ground = Bodies.rectangle(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT + 25,
    CANVAS_WIDTH,
    50,
    wallOptions
  )

  // 左墙
  const leftWall = Bodies.rectangle(
    -25,
    CANVAS_HEIGHT / 2,
    50,
    CANVAS_HEIGHT,
    wallOptions
  )

  // 右墙
  const rightWall = Bodies.rectangle(
    CANVAS_WIDTH + 25,
    CANVAS_HEIGHT / 2,
    50,
    CANVAS_HEIGHT,
    wallOptions
  )

  World.add(world, [ground, leftWall, rightWall])

  // 启动渲染器和引擎
  Render.run(render)
  runner = Runner.create()
  Runner.run(runner, engine)

  // 监听碰撞事件
  Events.on(engine, 'collisionStart', handleCollision)
}

// 处理碰撞
const handleCollision = (event) => {
  const pairs = event.pairs

  for (let pair of pairs) {
    // 检查当前方块是否碰到了地面或其他方块
    const bodyA = pair.bodyA
    const bodyB = pair.bodyB

    if (currentPieceBodies.includes(bodyA) || currentPieceBodies.includes(bodyB)) {
      // 方块已经停止移动，等待稳定后生成新方块
      setTimeout(() => {
        if (!isPaused.value && !gameOver.value) {
          lockPiece()
        }
      }, 300)
    }
  }
}

// 锁定当前方块
const lockPiece = () => {
  // 将当前方块添加到地面方块列表
  groundBodies.push(...currentPieceBodies)
  currentPieceBodies = []

  // 检查是否消除行
  checkLines()

  // 检查游戏是否结束
  if (checkGameOver()) {
    gameOver.value = true
    stopGame()
    return
  }

  // 生成新方块
  spawnPiece()
}

// 检查并消除完整的行
const checkLines = () => {
  // 简化版：根据方块数量给分
  const bodiesInGame = groundBodies.length
  if (bodiesInGame > 0 && bodiesInGame % 10 === 0) {
    const linesToClear = Math.floor(bodiesInGame / 40)
    if (linesToClear > linesCleared.value) {
      const newLines = linesToClear - linesCleared.value
      linesCleared.value = linesToClear
      score.value += newLines * 100 * level.value

      // 更新等级
      level.value = Math.floor(linesCleared.value / 5) + 1
      dropSpeed = Math.max(100, 1000 - (level.value - 1) * 100)
    }
  }

  // 每放置一个方块给基础分
  score.value += 10
}

// 检查游戏是否结束
const checkGameOver = () => {
  for (let body of groundBodies) {
    if (body.position.y < BLOCK_SIZE * 2) {
      return true
    }
  }
  return false
}

// 生成新方块
const spawnPiece = () => {
  const { Bodies, World, Body } = Matter

  const types = Object.keys(SHAPES)
  currentPieceType = types[Math.floor(Math.random() * types.length)]
  currentPiece = SHAPES[currentPieceType]

  pieceX = Math.floor(COLS / 2) - 1
  pieceY = 0

  currentPieceBodies = []

  const color = COLORS[currentPieceType]

  // 创建方块的各个部分
  for (let row = 0; row < currentPiece.length; row++) {
    for (let col = 0; col < currentPiece[row].length; col++) {
      if (currentPiece[row][col]) {
        const x = (pieceX + col) * BLOCK_SIZE + BLOCK_SIZE / 2
        const y = (pieceY + row) * BLOCK_SIZE + BLOCK_SIZE / 2

        // 创建软体效果的方块（使用圆角矩形模拟）
        const block = Bodies.rectangle(x, y, BLOCK_SIZE - 2, BLOCK_SIZE - 2, {
          chamfer: { radius: 5 }, // 圆角效果
          render: {
            fillStyle: color,
            strokeStyle: '#FFFFFF',
            lineWidth: 1
          },
          friction: 0.8,
          restitution: 0.2, // 弹性
          density: 0.001
        })

        currentPieceBodies.push(block)
        World.add(world, block)
      }
    }
  }
}

// 移动方块
const movePiece = (dx) => {
  if (isPaused.value || gameOver.value || currentPieceBodies.length === 0) return

  const { Body } = Matter

  // 检查边界
  for (let body of currentPieceBodies) {
    const newX = body.position.x + dx * BLOCK_SIZE
    if (newX < BLOCK_SIZE / 2 || newX > CANVAS_WIDTH - BLOCK_SIZE / 2) {
      return
    }
  }

  // 移动所有方块部分
  for (let body of currentPieceBodies) {
    Body.setPosition(body, {
      x: body.position.x + dx * BLOCK_SIZE,
      y: body.position.y
    })
  }
}

// 加速下落
const dropPiece = () => {
  if (isPaused.value || gameOver.value || currentPieceBodies.length === 0) return

  const { Body } = Matter

  // 给所有方块一个向下的速度
  for (let body of currentPieceBodies) {
    Body.setVelocity(body, { x: 0, y: 5 })
  }
}

// 旋转方块
const rotatePiece = () => {
  if (isPaused.value || gameOver.value || currentPieceBodies.length === 0) return

  const { Body } = Matter

  // 计算中心点
  let centerX = 0
  let centerY = 0

  for (let body of currentPieceBodies) {
    centerX += body.position.x
    centerY += body.position.y
  }

  centerX /= currentPieceBodies.length
  centerY /= currentPieceBodies.length

  // 旋转每个方块
  for (let body of currentPieceBodies) {
    const dx = body.position.x - centerX
    const dy = body.position.y - centerY

    // 90度旋转
    const newX = centerX - dy
    const newY = centerY + dx

    // 检查边界
    if (newX < BLOCK_SIZE / 2 || newX > CANVAS_WIDTH - BLOCK_SIZE / 2) {
      return
    }

    Body.setPosition(body, { x: newX, y: newY })
    Body.rotate(body, Math.PI / 2)
  }
}

// 键盘事件处理
const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      movePiece(-1)
      event.preventDefault()
      break
    case 'ArrowRight':
      movePiece(1)
      event.preventDefault()
      break
    case 'ArrowDown':
      dropPiece()
      event.preventDefault()
      break
    case 'ArrowUp':
      rotatePiece()
      event.preventDefault()
      break
    case ' ':
      togglePause()
      event.preventDefault()
      break
  }
}

// 暂停/继续游戏
const togglePause = () => {
  isPaused.value = !isPaused.value

  if (isPaused.value) {
    if (runner) {
      Matter.Runner.stop(runner)
    }
  } else {
    if (runner) {
      Matter.Runner.run(runner, engine)
    }
  }
}

// 重新开始游戏
const restartGame = () => {
  // 清除所有方块
  if (world) {
    const { World } = Matter

    for (let body of currentPieceBodies) {
      World.remove(world, body)
    }

    for (let body of groundBodies) {
      World.remove(world, body)
    }
  }

  // 重置状态
  currentPieceBodies = []
  groundBodies = []
  score.value = 0
  level.value = 1
  linesCleared.value = 0
  gameOver.value = false
  isPaused.value = false
  dropSpeed = 1000

  // 重新启动引擎
  if (runner) {
    Matter.Runner.run(runner, engine)
  }

  // 生成新方块
  spawnPiece()
}

// 停止游戏
const stopGame = () => {
  if (runner) {
    Matter.Runner.stop(runner)
  }
}

// 组件挂载时初始化
onMounted(() => {
  initEngine()
  spawnPiece()

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeydown)
})

// 组件卸载时清理
onUnmounted(() => {
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeydown)

  // 停止 Matter.js
  if (runner) {
    Matter.Runner.stop(runner)
  }

  if (render) {
    Matter.Render.stop(render)
  }

  if (gameLoopInterval) {
    clearInterval(gameLoopInterval)
  }
})
</script>

<style scoped>
/* 游戏容器 */
.game-container {
  min-height: 100vh;
  background: #1C1C2C;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 游戏标题 */
.game-header {
  text-align: center;
  margin-bottom: 30px;
}

.game-title {
  font-size: 36px;
  font-weight: 700;
  color: #66CCFF;
  margin: 0 0 10px 0;
  text-shadow: 0 0 20px rgba(102, 204, 255, 0.5);
}

.game-subtitle {
  font-size: 14px;
  color: #CCCCCC;
  margin: 0;
}

/* 主游戏区域 */
.game-main {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* 画布包装器 */
.canvas-wrapper {
  position: relative;
  border: 3px solid #66CCFF;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(102, 204, 255, 0.3);
}

.game-canvas {
  display: block;
}

/* 游戏结束覆盖层 */
.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(28, 28, 44, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-over-content {
  text-align: center;
  padding: 30px;
}

.game-over-content h2 {
  font-size: 28px;
  color: #FF6699;
  margin: 0 0 15px 0;
}

.game-over-content p {
  font-size: 18px;
  color: #FFFFFF;
  margin: 0 0 20px 0;
}

.restart-btn {
  background: #66CCFF;
  color: #1C1C2C;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.restart-btn:hover {
  background: #99FFCC;
  transform: scale(1.05);
}

/* 信息面板 */
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 180px;
}

/* 信息卡片 */
.info-card {
  background: #2C2C3C;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid rgba(102, 204, 255, 0.2);
}

.card-title {
  font-size: 12px;
  color: #CCCCCC;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.score-value {
  color: #FFCC66;
}

.level-value {
  color: #66CCFF;
}

.lines-value {
  color: #99FFCC;
  font-size: 18px;
}

/* 控制说明卡片 */
.controls-card {
  padding: 12px;
}

.controls-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: #CCCCCC;
}

.controls-list li {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.key {
  background: #1C1C2C;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 11px;
  color: #66CCFF;
  border: 1px solid #66CCFF;
}

/* 游戏控制按钮 */
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-btn {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #66CCFF;
  color: #1C1C2C;
}

.control-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(102, 204, 255, 0.4);
}

.control-btn.paused {
  background: #FF6699;
}

.control-btn.restart {
  background: #99FFCC;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .game-main {
    flex-direction: column;
    align-items: center;
  }

  .game-title {
    font-size: 28px;
  }

  .info-panel {
    flex-direction: row;
    flex-wrap: wrap;
    width: auto;
    justify-content: center;
  }

  .info-card {
    min-width: 80px;
  }

  .controls-card {
    display: none;
  }
}

@media (max-width: 480px) {
  .game-container {
    padding: 10px;
  }

  .game-title {
    font-size: 24px;
  }

  .game-header {
    margin-bottom: 15px;
  }
}
</style>
