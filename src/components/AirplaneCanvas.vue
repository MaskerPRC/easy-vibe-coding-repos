<template>
  <div class="airplane-container">
    <h1>飞机画面</h1>
    <div class="canvas-wrapper">
      <canvas ref="airplaneCanvas" width="800" height="600"></canvas>
    </div>
    <div class="controls">
      <button @click="regenerate">重新生成</button>
      <button @click="toggleAnimation">{{ isAnimating ? '暂停动画' : '开始动画' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const airplaneCanvas = ref(null)
const isAnimating = ref(true)
let animationFrame = null
let airplaneX = 100
let airplaneY = 300
let cloudPositions = []

// 初始化云朵位置
const initClouds = () => {
  cloudPositions = []
  for (let i = 0; i < 5; i++) {
    cloudPositions.push({
      x: Math.random() * 800,
      y: Math.random() * 200 + 50,
      speed: Math.random() * 0.5 + 0.3
    })
  }
}

// 绘制飞机
const drawAirplane = (ctx, x, y) => {
  ctx.save()

  // 飞机机身
  ctx.fillStyle = '#4A90E2'
  ctx.beginPath()
  ctx.ellipse(x, y, 60, 15, 0, 0, Math.PI * 2)
  ctx.fill()

  // 飞机头部
  ctx.fillStyle = '#357ABD'
  ctx.beginPath()
  ctx.moveTo(x + 60, y)
  ctx.lineTo(x + 80, y - 5)
  ctx.lineTo(x + 80, y + 5)
  ctx.closePath()
  ctx.fill()

  // 主机翼
  ctx.fillStyle = '#5AA5E8'
  ctx.beginPath()
  ctx.moveTo(x - 20, y)
  ctx.lineTo(x - 60, y - 40)
  ctx.lineTo(x - 40, y - 40)
  ctx.lineTo(x + 20, y)
  ctx.closePath()
  ctx.fill()

  // 尾翼
  ctx.fillStyle = '#357ABD'
  ctx.beginPath()
  ctx.moveTo(x - 55, y)
  ctx.lineTo(x - 70, y - 25)
  ctx.lineTo(x - 60, y - 25)
  ctx.lineTo(x - 50, y)
  ctx.closePath()
  ctx.fill()

  // 窗户
  ctx.fillStyle = '#FFFFFF'
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(x - 30 + i * 15, y - 5, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}

// 绘制云朵
const drawCloud = (ctx, x, y) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.beginPath()
  ctx.arc(x, y, 20, 0, Math.PI * 2)
  ctx.arc(x + 25, y, 25, 0, Math.PI * 2)
  ctx.arc(x + 50, y, 20, 0, Math.PI * 2)
  ctx.arc(x + 25, y - 15, 20, 0, Math.PI * 2)
  ctx.fill()
}

// 绘制背景
const drawBackground = (ctx) => {
  // 天空渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, 600)
  gradient.addColorStop(0, '#87CEEB')
  gradient.addColorStop(1, '#E0F6FF')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 800, 600)

  // 太阳
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(700, 100, 40, 0, Math.PI * 2)
  ctx.fill()

  // 太阳光晕
  ctx.fillStyle = 'rgba(255, 215, 0, 0.3)'
  ctx.beginPath()
  ctx.arc(700, 100, 60, 0, Math.PI * 2)
  ctx.fill()
}

// 绘制场景
const drawScene = () => {
  const canvas = airplaneCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')

  // 清空画布
  ctx.clearRect(0, 0, 800, 600)

  // 绘制背景
  drawBackground(ctx)

  // 绘制云朵
  cloudPositions.forEach(cloud => {
    drawCloud(ctx, cloud.x, cloud.y)
  })

  // 绘制飞机
  drawAirplane(ctx, airplaneX, airplaneY)
}

// 动画循环
const animate = () => {
  if (!isAnimating.value) return

  // 更新飞机位置
  airplaneX += 1
  if (airplaneX > 900) {
    airplaneX = -100
  }

  // 更新云朵位置
  cloudPositions.forEach(cloud => {
    cloud.x -= cloud.speed
    if (cloud.x < -100) {
      cloud.x = 900
    }
  })

  // 飞机上下浮动
  airplaneY = 300 + Math.sin(airplaneX * 0.01) * 20

  drawScene()
  animationFrame = requestAnimationFrame(animate)
}

// 重新生成
const regenerate = () => {
  airplaneX = 100
  airplaneY = 300
  initClouds()
  drawScene()
}

// 切换动画
const toggleAnimation = () => {
  isAnimating.value = !isAnimating.value
  if (isAnimating.value) {
    animate()
  } else {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  }
}

// 组件挂载
onMounted(() => {
  initClouds()
  drawScene()
  animate()
})

// 组件卸载
onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.airplane-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e3c72, #2a5298);
  padding: 20px;
}

h1 {
  color: white;
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.canvas-wrapper {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 10px;
  margin-bottom: 20px;
}

canvas {
  display: block;
  border-radius: 5px;
}

.controls {
  display: flex;
  gap: 15px;
}

button {
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2em;
  }

  canvas {
    width: 100%;
    height: auto;
  }

  .canvas-wrapper {
    width: 100%;
    max-width: 800px;
  }
}
</style>
