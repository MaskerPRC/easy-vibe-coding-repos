<template>
  <div class="game-container">
    <!-- 游戏主界面 -->
    <div class="game-wrapper">
      <!-- 信息面板 -->
      <div class="info-panel left-panel">
        <div class="panel-card">
          <h3>下一个</h3>
          <div class="next-piece-preview" ref="nextPieceCanvas"></div>
        </div>
        <div class="panel-card">
          <h3>操作说明</h3>
          <div class="controls-info">
            <p><span class="key">←→</span> 移动</p>
            <p><span class="key">↑</span> 旋转</p>
            <p><span class="key">↓</span> 加速下落</p>
            <p><span class="key">空格</span> 快速落下</p>
            <p><span class="key">P</span> 暂停</p>
          </div>
        </div>
      </div>

      <!-- 游戏画布 -->
      <div class="game-area">
        <canvas ref="gameCanvas"></canvas>
        <!-- 游戏状态覆盖层 -->
        <div v-if="gameState !== 'playing'" class="game-overlay">
          <div class="overlay-content">
            <h2 v-if="gameState === 'start'">重力俄罗斯方块</h2>
            <h2 v-else-if="gameState === 'paused'">游戏暂停</h2>
            <h2 v-else-if="gameState === 'gameover'">游戏结束</h2>
            <p v-if="gameState === 'gameover'">最终得分: {{ score }}</p>
            <button @click="startGame" class="game-btn">
              {{ gameState === 'start' ? '开始游戏' : gameState === 'paused' ? '继续' : '重新开始' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧信息面板 -->
      <div class="info-panel right-panel">
        <div class="panel-card score-card">
          <h3>得分</h3>
          <div class="score-value">{{ score }}</div>
        </div>
        <div class="panel-card">
          <h3>等级</h3>
          <div class="level-value">{{ level }}</div>
        </div>
        <div class="panel-card">
          <h3>消除行数</h3>
          <div class="lines-value">{{ linesCleared }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Matter from 'matter-js'

// 游戏状态
const gameState = ref('start') // 'start', 'playing', 'paused', 'gameover'
const score = ref(0)
const level = ref(1)
const linesCleared = ref(0)

// Canvas 引用
const gameCanvas = ref(null)
const nextPieceCanvas = ref(null)

// Matter.js 引擎
let engine = null
let render = null
let runner = null
let world = null

// 游戏配置
const GAME_WIDTH = 400
const GAME_HEIGHT = 600
const CELL_SIZE = 30
const COLS = Math.floor(GAME_WIDTH / CELL_SIZE)
const ROWS = Math.floor(GAME_HEIGHT / CELL_SIZE)

// 软体方块参数
const SOFT_BODY_PARTICLES = 4 // 每个单元格的粒子数
const PARTICLE_RADIUS = 6
const STIFFNESS = 0.2 // 弹簧刚度，越小越Q弹

// 俄罗斯方块形状定义
const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: '#00FFFF' },
  O: { shape: [[1, 1], [1, 1]], color: '#FFFF00' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#FF00FF' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00FF00' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#FF0000' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000FF' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#FFA500' }
}

// 渐变色配置
const GRADIENT_COLORS = {
  I: ['#00FFFF', '#0088FF'],
  O: ['#FFFF00', '#FFA500'],
  T: ['#8A2BE2', '#FF00FF'],
  S: ['#39FF14', '#00FF88'],
  Z: ['#FF0000', '#FF6600'],
  J: ['#0000FF', '#6600FF'],
  L: ['#FFA500', '#FF4500']
}

// 当前方块和下一个方块
let currentPiece = null
let nextPiece = null
let currentBodies = []
let staticBodies = []

// 下落计时器
let dropTimer = null
let dropInterval = 1000

// 键盘输入
const keys = {}

// 创建软体方块
function createSoftBody(x, y, shape, type) {
  const bodies = []
  const constraints = []
  const particles = []
  const colors = GRADIENT_COLORS[type]

  // 为形状中的每个单元格创建粒子群
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const cellX = x + colIndex * CELL_SIZE
        const cellY = y + rowIndex * CELL_SIZE
        const cellParticles = []

        // 创建单元格内的粒子
        for (let i = 0; i < SOFT_BODY_PARTICLES; i++) {
          const angle = (i / SOFT_BODY_PARTICLES) * Math.PI * 2
          const px = cellX + CELL_SIZE / 2 + Math.cos(angle) * (CELL_SIZE / 4)
          const py = cellY + CELL_SIZE / 2 + Math.sin(angle) * (CELL_SIZE / 4)

          const particle = Matter.Bodies.circle(px, py, PARTICLE_RADIUS, {
            restitution: 0.8, // 弹性
            friction: 0.3,
            frictionAir: 0.01,
            render: {
              fillStyle: colors[0],
              strokeStyle: colors[1],
              lineWidth: 2
            },
            collisionFilter: {
              group: -1 // 同组内不碰撞
            }
          })

          cellParticles.push(particle)
          particles.push(particle)
          bodies.push(particle)
        }

        // 创建中心粒子
        const centerParticle = Matter.Bodies.circle(
          cellX + CELL_SIZE / 2,
          cellY + CELL_SIZE / 2,
          PARTICLE_RADIUS * 1.5,
          {
            restitution: 0.8,
            friction: 0.3,
            frictionAir: 0.01,
            render: {
              fillStyle: colors[1],
              strokeStyle: colors[0],
              lineWidth: 3
            },
            collisionFilter: {
              group: -1
            }
          }
        )
        cellParticles.push(centerParticle)
        particles.push(centerParticle)
        bodies.push(centerParticle)

        // 连接单元格内的粒子（弹簧约束）
        for (let i = 0; i < cellParticles.length; i++) {
          for (let j = i + 1; j < cellParticles.length; j++) {
            const constraint = Matter.Constraint.create({
              bodyA: cellParticles[i],
              bodyB: cellParticles[j],
              stiffness: STIFFNESS,
              damping: 0.1,
              render: {
                visible: false
              }
            })
            constraints.push(constraint)
          }
        }
      }
    })
  })

  // 连接相邻单元格的粒子
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dist = Matter.Vector.magnitude(
        Matter.Vector.sub(particles[i].position, particles[j].position)
      )
      if (dist < CELL_SIZE * 1.5) {
        const constraint = Matter.Constraint.create({
          bodyA: particles[i],
          bodyB: particles[j],
          stiffness: STIFFNESS * 0.5,
          damping: 0.1,
          render: {
            visible: false
          }
        })
        constraints.push(constraint)
      }
    }
  }

  return { bodies, constraints, type, particles }
}

// 创建简化的软体方块（用于预览）
function createPreviewPiece(type) {
  const tetromino = TETROMINOS[type]
  const shape = tetromino.shape
  const color = tetromino.color

  return { type, shape, color }
}

// 随机选择方块类型
function getRandomPieceType() {
  const types = Object.keys(TETROMINOS)
  return types[Math.floor(Math.random() * types.length)]
}

// 生成新方块
function spawnPiece() {
  if (nextPiece) {
    currentPiece = nextPiece
  } else {
    currentPiece = createPreviewPiece(getRandomPieceType())
  }
  nextPiece = createPreviewPiece(getRandomPieceType())

  // 计算生成位置
  const shape = TETROMINOS[currentPiece.type].shape
  const pieceWidth = shape[0].length * CELL_SIZE
  const startX = (GAME_WIDTH - pieceWidth) / 2
  const startY = -CELL_SIZE

  // 创建软体
  const softBody = createSoftBody(startX, startY, shape, currentPiece.type)
  currentBodies = softBody.bodies

  // 添加到世界
  Matter.Composite.add(world, [...softBody.bodies, ...softBody.constraints])

  // 绘制下一个方块预览
  drawNextPiece()
}

// 绘制下一个方块预览
function drawNextPiece() {
  if (!nextPieceCanvas.value || !nextPiece) return

  const canvas = nextPieceCanvas.value
  const ctx = canvas.getContext('2d')

  // 设置画布大小
  canvas.width = 120
  canvas.height = 120

  // 清除画布
  ctx.fillStyle = 'rgba(26, 26, 46, 0.8)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const shape = TETROMINOS[nextPiece.type].shape
  const colors = GRADIENT_COLORS[nextPiece.type]
  const cellSize = 25

  // 计算居中偏移
  const offsetX = (canvas.width - shape[0].length * cellSize) / 2
  const offsetY = (canvas.height - shape.length * cellSize) / 2

  // 绘制方块
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        const x = offsetX + colIndex * cellSize
        const y = offsetY + rowIndex * cellSize

        // 创建渐变
        const gradient = ctx.createRadialGradient(
          x + cellSize / 2, y + cellSize / 2, 0,
          x + cellSize / 2, y + cellSize / 2, cellSize / 2
        )
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(1, colors[1])

        // 绘制圆形（模拟软体）
        ctx.beginPath()
        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
        ctx.strokeStyle = colors[1]
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
  })
}

// 移动当前方块
function movePiece(dx, dy) {
  if (!currentBodies.length) return

  currentBodies.forEach(body => {
    Matter.Body.setPosition(body, {
      x: body.position.x + dx,
      y: body.position.y + dy
    })
  })
}

// 快速下落
function hardDrop() {
  if (!currentBodies.length) return

  currentBodies.forEach(body => {
    Matter.Body.setVelocity(body, { x: 0, y: 15 })
  })
}

// 检查是否到达底部
function checkLanding() {
  if (!currentBodies.length) return false

  // 检查是否有方块接触底部或其他静态方块
  for (const body of currentBodies) {
    if (body.position.y > GAME_HEIGHT - CELL_SIZE) {
      return true
    }
    // 检查速度是否接近0（已稳定）
    if (Math.abs(body.velocity.y) < 0.1 && body.position.y > CELL_SIZE) {
      return true
    }
  }
  return false
}

// 锁定当前方块
function lockPiece() {
  if (!currentBodies.length) return

  // 将当前方块添加到静态方块列表
  currentBodies.forEach(body => {
    body.collisionFilter.group = 0 // 恢复碰撞
    staticBodies.push(body)
  })
  currentBodies = []

  // 检查消除行
  checkLines()

  // 检查游戏结束
  if (checkGameOver()) {
    gameOver()
    return
  }

  // 生成新方块
  spawnPiece()
}

// 检查消除行
function checkLines() {
  // 简化版本：基于高度分布检测满行
  const heightMap = new Map()

  staticBodies.forEach(body => {
    const row = Math.floor(body.position.y / CELL_SIZE)
    if (!heightMap.has(row)) {
      heightMap.set(row, [])
    }
    heightMap.get(row).push(body)
  })

  let linesRemoved = 0
  heightMap.forEach((bodies, row) => {
    // 如果一行有足够多的粒子，认为是满行
    if (bodies.length >= COLS * 3) {
      linesRemoved++
      // 移除这些粒子
      bodies.forEach(body => {
        Matter.Composite.remove(world, body)
        staticBodies = staticBodies.filter(b => b !== body)
      })

      // 创建消除特效
      createClearEffect(row * CELL_SIZE)
    }
  })

  if (linesRemoved > 0) {
    // 更新分数
    const points = [0, 100, 300, 500, 800]
    score.value += points[Math.min(linesRemoved, 4)] * level.value
    linesCleared.value += linesRemoved

    // 检查升级
    if (linesCleared.value >= level.value * 10) {
      level.value++
      dropInterval = Math.max(100, 1000 - (level.value - 1) * 100)
    }
  }
}

// 创建消除特效
function createClearEffect(y) {
  // 创建粒子爆炸效果
  for (let i = 0; i < 20; i++) {
    const particle = Matter.Bodies.circle(
      Math.random() * GAME_WIDTH,
      y,
      3,
      {
        restitution: 0.9,
        friction: 0,
        frictionAir: 0.02,
        render: {
          fillStyle: '#39FF14'
        }
      }
    )
    Matter.Body.setVelocity(particle, {
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20
    })
    Matter.Composite.add(world, particle)

    // 延迟移除
    setTimeout(() => {
      Matter.Composite.remove(world, particle)
    }, 1000)
  }
}

// 检查游戏结束
function checkGameOver() {
  return staticBodies.some(body => body.position.y < CELL_SIZE * 2)
}

// 游戏结束
function gameOver() {
  gameState.value = 'gameover'
  if (dropTimer) {
    clearInterval(dropTimer)
    dropTimer = null
  }
}

// 初始化游戏
function initGame() {
  const canvas = gameCanvas.value
  if (!canvas) return

  // 创建 Matter.js 引擎
  engine = Matter.Engine.create({
    gravity: { x: 0, y: 1 }
  })
  world = engine.world

  // 创建渲染器
  render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      wireframes: false,
      background: '#1A1A2E',
      pixelRatio: window.devicePixelRatio || 1
    }
  })

  // 创建边界
  const wallOptions = {
    isStatic: true,
    render: {
      fillStyle: '#2A2A4E',
      strokeStyle: '#3A3A6E',
      lineWidth: 2
    }
  }

  // 左墙
  Matter.Composite.add(world, Matter.Bodies.rectangle(
    -10, GAME_HEIGHT / 2, 20, GAME_HEIGHT, wallOptions
  ))
  // 右墙
  Matter.Composite.add(world, Matter.Bodies.rectangle(
    GAME_WIDTH + 10, GAME_HEIGHT / 2, 20, GAME_HEIGHT, wallOptions
  ))
  // 底部
  Matter.Composite.add(world, Matter.Bodies.rectangle(
    GAME_WIDTH / 2, GAME_HEIGHT + 10, GAME_WIDTH, 20, wallOptions
  ))

  // 创建运行器
  runner = Matter.Runner.create()
}

// 开始游戏
function startGame() {
  // 重置状态
  score.value = 0
  level.value = 1
  linesCleared.value = 0
  currentBodies = []
  staticBodies = []

  // 清除世界中的动态物体
  if (world) {
    const allBodies = Matter.Composite.allBodies(world)
    allBodies.forEach(body => {
      if (!body.isStatic) {
        Matter.Composite.remove(world, body)
      }
    })
  }

  gameState.value = 'playing'

  // 启动渲染和物理引擎
  Matter.Render.run(render)
  Matter.Runner.run(runner, engine)

  // 生成第一个方块
  nextPiece = createPreviewPiece(getRandomPieceType())
  spawnPiece()

  // 启动下落计时器
  dropInterval = 1000
  dropTimer = setInterval(() => {
    if (gameState.value === 'playing') {
      gameLoop()
    }
  }, 50)
}

// 游戏主循环
function gameLoop() {
  if (gameState.value !== 'playing') return

  // 处理输入
  if (keys['ArrowLeft']) {
    movePiece(-5, 0)
  }
  if (keys['ArrowRight']) {
    movePiece(5, 0)
  }
  if (keys['ArrowDown']) {
    movePiece(0, 3)
  }

  // 检查方块是否稳定
  if (checkLanding()) {
    setTimeout(() => {
      if (checkLanding()) {
        lockPiece()
      }
    }, 500)
  }
}

// 键盘事件处理
function handleKeyDown(e) {
  keys[e.key] = true

  if (gameState.value === 'playing') {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        break
      case 'ArrowUp':
        e.preventDefault()
        // 旋转逻辑（简化版：给一个旋转力矩）
        currentBodies.forEach(body => {
          Matter.Body.setAngularVelocity(body, 0.2)
        })
        break
      case ' ':
        e.preventDefault()
        hardDrop()
        break
      case 'p':
      case 'P':
        e.preventDefault()
        gameState.value = 'paused'
        break
    }
  } else if (gameState.value === 'paused' && (e.key === 'p' || e.key === 'P')) {
    gameState.value = 'playing'
  }
}

function handleKeyUp(e) {
  keys[e.key] = false
}

// 生命周期钩子
onMounted(() => {
  initGame()
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('keyup', handleKeyUp)
})

onUnmounted(() => {
  if (dropTimer) {
    clearInterval(dropTimer)
  }
  if (render) {
    Matter.Render.stop(render)
  }
  if (runner) {
    Matter.Runner.stop(runner)
  }
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('keyup', handleKeyUp)
})
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0A0A1A 0%, #1A1A2E 50%, #0A0A1A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
}

.game-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 150px;
}

.panel-card {
  background: rgba(42, 42, 78, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.panel-card h3 {
  color: #FFFFFF;
  font-size: 14px;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

.next-piece-preview {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.next-piece-preview canvas {
  width: 100%;
  height: 100%;
}

.controls-info {
  font-size: 11px;
  color: #AAAAAA;
}

.controls-info p {
  margin: 6px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.key {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  color: #00FFFF;
  font-size: 10px;
}

.score-value,
.level-value,
.lines-value {
  font-size: 28px;
  font-weight: bold;
  color: #FFFFFF;
  text-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
}

.score-value {
  color: #39FF14;
}

.level-value {
  color: #00FFFF;
}

.lines-value {
  color: #FF00FF;
}

.game-area {
  position: relative;
  border: 3px solid rgba(138, 43, 226, 0.5);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 0 30px rgba(138, 43, 226, 0.3),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
}

.game-area canvas {
  display: block;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 26, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  text-align: center;
  color: #FFFFFF;
}

.overlay-content h2 {
  font-size: 32px;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #8A2BE2, #FF00FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
}

.overlay-content p {
  font-size: 18px;
  margin: 0 0 30px 0;
  color: #AAAAAA;
}

.game-btn {
  background: linear-gradient(135deg, #8A2BE2, #FF00FF);
  border: none;
  color: #FFFFFF;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(138, 43, 226, 0.5);
}

.game-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(138, 43, 226, 0.7);
}

.game-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .info-panel {
    flex-direction: row;
    width: auto;
  }

  .left-panel {
    order: 2;
  }

  .game-area {
    order: 1;
  }

  .right-panel {
    order: 3;
  }

  .panel-card {
    padding: 10px;
  }

  .score-value,
  .level-value,
  .lines-value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .game-container {
    padding: 10px;
  }

  .info-panel {
    gap: 8px;
  }

  .panel-card {
    padding: 8px;
  }

  .panel-card h3 {
    font-size: 12px;
    margin-bottom: 5px;
  }

  .controls-info {
    display: none;
  }
}
</style>
