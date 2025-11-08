<template>
  <div class="drawing-board">
    <div class="header">
      <h1>画图面板</h1>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="tool-group">
        <label>工具:</label>
        <button
          v-for="tool in tools"
          :key="tool.type"
          :class="['tool-btn', { active: currentTool === tool.type }]"
          @click="selectTool(tool.type)"
          :title="tool.name"
        >
          {{ tool.icon }}
        </button>
      </div>

      <div class="tool-group">
        <label>颜色:</label>
        <input
          type="color"
          v-model="currentColor"
          class="color-picker"
        />
        <div class="color-presets">
          <button
            v-for="color in presetColors"
            :key="color"
            class="preset-color"
            :style="{ backgroundColor: color }"
            @click="currentColor = color"
          ></button>
        </div>
      </div>

      <div class="tool-group">
        <label>粗细:</label>
        <input
          type="range"
          v-model.number="lineWidth"
          min="1"
          max="50"
          class="width-slider"
        />
        <span class="width-value">{{ lineWidth }}px</span>
      </div>

      <div class="tool-group actions">
        <button @click="undo" :disabled="historyIndex < 0" class="action-btn">
          ↶ 撤销
        </button>
        <button @click="redo" :disabled="historyIndex >= history.length - 1" class="action-btn">
          ↷ 重做
        </button>
        <button @click="clearCanvas" class="action-btn clear-btn">
          🗑️ 清空
        </button>
        <button @click="downloadImage" class="action-btn download-btn">
          ⬇️ 下载
        </button>
      </div>
    </div>

    <!-- 画布区域 -->
    <div class="canvas-container">
      <canvas
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="stopDrawing"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

// 工具列表
const tools = [
  { type: 'pen', name: '画笔', icon: '✏️' },
  { type: 'eraser', name: '橡皮擦', icon: '🧹' },
  { type: 'line', name: '直线', icon: '📏' },
  { type: 'rectangle', name: '矩形', icon: '▭' },
  { type: 'circle', name: '圆形', icon: '⭕' },
  { type: 'fill', name: '填充', icon: '🎨' }
]

// 预设颜色
const presetColors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'
]

// 画布引用
const canvas = ref(null)
let ctx = null

// 当前工具和属性
const currentTool = ref('pen')
const currentColor = ref('#000000')
const lineWidth = ref(3)

// 绘图状态
const isDrawing = ref(false)
const startX = ref(0)
const startY = ref(0)

// 历史记录
const history = ref([])
const historyIndex = ref(-1)

// 临时画布（用于预览）
let tempCanvas = null
let tempCtx = null

// 初始化画布
onMounted(() => {
  initCanvas()
})

function initCanvas() {
  const canvasEl = canvas.value
  if (!canvasEl) return

  // 设置画布大小
  const container = canvasEl.parentElement
  canvasEl.width = container.clientWidth
  canvasEl.height = container.clientHeight

  ctx = canvasEl.getContext('2d')
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // 填充白色背景
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)

  // 创建临时画布
  tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvasEl.width
  tempCanvas.height = canvasEl.height
  tempCtx = tempCanvas.getContext('2d')

  // 保存初始状态
  saveState()
}

// 选择工具
function selectTool(tool) {
  currentTool.value = tool
}

// 获取鼠标位置
function getMousePos(e) {
  const rect = canvas.value.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

// 获取触摸位置
function getTouchPos(e) {
  const rect = canvas.value.getBoundingClientRect()
  return {
    x: e.touches[0].clientX - rect.left,
    y: e.touches[0].clientY - rect.top
  }
}

// 开始绘图
function startDrawing(e) {
  const pos = getMousePos(e)
  isDrawing.value = true
  startX.value = pos.x
  startY.value = pos.y

  if (currentTool.value === 'pen' || currentTool.value === 'eraser') {
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  } else if (currentTool.value === 'fill') {
    floodFill(Math.floor(pos.x), Math.floor(pos.y), currentColor.value)
    saveState()
    isDrawing.value = false
  } else {
    // 保存当前画布到临时画布
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
    tempCtx.drawImage(canvas.value, 0, 0)
  }
}

// 绘图
function draw(e) {
  if (!isDrawing.value) return

  const pos = getMousePos(e)

  ctx.strokeStyle = currentColor.value
  ctx.lineWidth = lineWidth.value

  if (currentTool.value === 'pen') {
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  } else if (currentTool.value === 'eraser') {
    ctx.strokeStyle = '#ffffff'
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  } else if (currentTool.value === 'line') {
    // 恢复临时画布内容
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.drawImage(tempCanvas, 0, 0)
    // 绘制预览
    ctx.beginPath()
    ctx.moveTo(startX.value, startY.value)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  } else if (currentTool.value === 'rectangle') {
    // 恢复临时画布内容
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.drawImage(tempCanvas, 0, 0)
    // 绘制预览
    const width = pos.x - startX.value
    const height = pos.y - startY.value
    ctx.strokeRect(startX.value, startY.value, width, height)
  } else if (currentTool.value === 'circle') {
    // 恢复临时画布内容
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.drawImage(tempCanvas, 0, 0)
    // 绘制预览
    const radius = Math.sqrt(
      Math.pow(pos.x - startX.value, 2) + Math.pow(pos.y - startY.value, 2)
    )
    ctx.beginPath()
    ctx.arc(startX.value, startY.value, radius, 0, 2 * Math.PI)
    ctx.stroke()
  }
}

// 停止绘图
function stopDrawing() {
  if (isDrawing.value) {
    isDrawing.value = false
    saveState()
  }
}

// 触摸事件处理
function handleTouchStart(e) {
  e.preventDefault()
  const pos = getTouchPos(e)
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: e.touches[0].clientX,
    clientY: e.touches[0].clientY
  })
  startDrawing(mouseEvent)
}

function handleTouchMove(e) {
  e.preventDefault()
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: e.touches[0].clientX,
    clientY: e.touches[0].clientY
  })
  draw(mouseEvent)
}

// 填充功能（简化版）
function floodFill(x, y, fillColor) {
  const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
  const targetColor = getPixelColor(imageData, x, y)
  const fillColorRGB = hexToRgb(fillColor)

  if (colorsMatch(targetColor, fillColorRGB)) return

  const pixelsToCheck = [{ x, y }]
  const visited = new Set()

  while (pixelsToCheck.length > 0) {
    const { x: currentX, y: currentY } = pixelsToCheck.pop()
    const key = `${currentX},${currentY}`

    if (visited.has(key)) continue
    if (currentX < 0 || currentX >= canvas.value.width || currentY < 0 || currentY >= canvas.value.height) continue

    const currentColor = getPixelColor(imageData, currentX, currentY)
    if (!colorsMatch(currentColor, targetColor)) continue

    visited.add(key)
    setPixelColor(imageData, currentX, currentY, fillColorRGB)

    pixelsToCheck.push({ x: currentX + 1, y: currentY })
    pixelsToCheck.push({ x: currentX - 1, y: currentY })
    pixelsToCheck.push({ x: currentX, y: currentY + 1 })
    pixelsToCheck.push({ x: currentX, y: currentY - 1 })

    // 限制迭代次数防止卡顿
    if (visited.size > 50000) break
  }

  ctx.putImageData(imageData, 0, 0)
}

function getPixelColor(imageData, x, y) {
  const index = (y * imageData.width + x) * 4
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3]
  }
}

function setPixelColor(imageData, x, y, color) {
  const index = (y * imageData.width + x) * 4
  imageData.data[index] = color.r
  imageData.data[index + 1] = color.g
  imageData.data[index + 2] = color.b
  imageData.data[index + 3] = 255
}

function colorsMatch(color1, color2) {
  return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

// 保存状态
function saveState() {
  // 删除当前索引之后的历史记录
  history.value = history.value.slice(0, historyIndex.value + 1)
  // 保存当前状态
  history.value.push(canvas.value.toDataURL())
  historyIndex.value++
  // 限制历史记录数量
  if (history.value.length > 20) {
    history.value.shift()
    historyIndex.value--
  }
}

// 撤销
function undo() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    restoreState()
  }
}

// 重做
function redo() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    restoreState()
  }
}

// 恢复状态
function restoreState() {
  const img = new Image()
  img.src = history.value[historyIndex.value]
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.drawImage(img, 0, 0)
  }
}

// 清空画布
function clearCanvas() {
  if (confirm('确定要清空画布吗？')) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
    saveState()
  }
}

// 下载图片
function downloadImage() {
  const link = document.createElement('a')
  link.download = `drawing-${Date.now()}.png`
  link.href = canvas.value.toDataURL()
  link.click()
}
</script>

<style scoped>
.drawing-board {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #667eea;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  padding: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  color: white;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  align-items: center;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tool-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.tool-btn {
  width: 45px;
  height: 45px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.tool-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-color: #667eea;
}

.tool-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.color-picker {
  width: 50px;
  height: 45px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.color-presets {
  display: flex;
  gap: 5px;
}

.preset-color {
  width: 30px;
  height: 30px;
  border: 2px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.preset-color:hover {
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.width-slider {
  width: 120px;
  cursor: pointer;
}

.width-value {
  font-weight: 600;
  color: #667eea;
  min-width: 45px;
}

.actions {
  margin-left: auto;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  background: #f5576c;
}

.download-btn {
  background: #00f2fe;
}

.canvas-container {
  flex: 1;
  margin: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

@media (max-width: 768px) {
  .toolbar {
    gap: 10px;
    padding: 10px;
  }

  .tool-group {
    gap: 5px;
  }

  .tool-btn {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .color-picker {
    width: 40px;
    height: 40px;
  }

  .width-slider {
    width: 80px;
  }

  .action-btn {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }
}
</style>
