<template>
  <div class="canva-editor" :class="{ 'dark-mode': isDarkMode }">
    <!-- 顶部工具栏 -->
    <header class="toolbar">
      <div class="toolbar-left">
        <h1 class="logo">🎨 Design Studio</h1>
        <button @click="newProject" class="btn-icon" title="新建项目">
          <span class="material-icons">add</span>
        </button>
        <button @click="saveProject" class="btn-icon" title="保存">
          <span class="material-icons">save</span>
        </button>
        <button @click="loadProject" class="btn-icon" title="加载">
          <span class="material-icons">folder_open</span>
        </button>
      </div>

      <div class="toolbar-center">
        <button @click="undo" :disabled="!canUndo" class="btn-icon" title="撤销">
          <span class="material-icons">undo</span>
        </button>
        <button @click="redo" :disabled="!canRedo" class="btn-icon" title="重做">
          <span class="material-icons">redo</span>
        </button>
        <div class="zoom-controls">
          <button @click="zoomOut" class="btn-icon">
            <span class="material-icons">zoom_out</span>
          </button>
          <span class="zoom-level">{{ Math.round(zoom * 100) }}%</span>
          <button @click="zoomIn" class="btn-icon">
            <span class="material-icons">zoom_in</span>
          </button>
        </div>
      </div>

      <div class="toolbar-right">
        <button @click="showTemplates = true" class="btn-primary">
          <span class="material-icons">dashboard</span>
          模板库
        </button>
        <button @click="exportDesign" class="btn-primary">
          <span class="material-icons">download</span>
          导出
        </button>
        <button @click="toggleDarkMode" class="btn-icon">
          <span class="material-icons">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</span>
        </button>
      </div>
    </header>

    <div class="editor-container">
      <!-- 左侧工具面板 -->
      <aside class="left-panel">
        <div class="tool-section">
          <h3>工具</h3>
          <div class="tool-grid">
            <button
              v-for="tool in tools"
              :key="tool.id"
              @click="activeTool = tool.id"
              :class="{ active: activeTool === tool.id }"
              class="tool-btn"
              :title="tool.name"
            >
              <span class="material-icons">{{ tool.icon }}</span>
              <span class="tool-name">{{ tool.name }}</span>
            </button>
          </div>
        </div>

        <div class="tool-section">
          <h3>形状</h3>
          <div class="shape-grid">
            <button
              v-for="shape in shapes"
              :key="shape.type"
              @click="addShape(shape.type)"
              class="shape-btn"
              :title="shape.name"
            >
              <span class="material-icons">{{ shape.icon }}</span>
            </button>
          </div>
        </div>

        <div class="tool-section" v-if="selectedElement">
          <h3>属性</h3>
          <div class="properties">
            <div class="property-group">
              <label>颜色</label>
              <div class="color-picker-container">
                <input
                  type="color"
                  v-model="selectedElement.fill"
                  @input="updateElement"
                  class="color-input"
                />
                <input
                  type="text"
                  v-model="selectedElement.fill"
                  @input="updateElement"
                  class="color-text"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div class="property-group" v-if="selectedElement.type !== 'text'">
              <label>边框</label>
              <div class="color-picker-container">
                <input
                  type="color"
                  v-model="selectedElement.stroke"
                  @input="updateElement"
                  class="color-input"
                />
                <input
                  type="number"
                  v-model="selectedElement.strokeWidth"
                  @input="updateElement"
                  min="0"
                  max="20"
                  class="number-input"
                  placeholder="宽度"
                />
              </div>
            </div>

            <div class="property-group">
              <label>透明度</label>
              <input
                type="range"
                v-model="selectedElement.opacity"
                @input="updateElement"
                min="0"
                max="1"
                step="0.1"
                class="range-input"
              />
              <span class="range-value">{{ Math.round(selectedElement.opacity * 100) }}%</span>
            </div>

            <div class="property-group" v-if="selectedElement.type === 'text'">
              <label>字体大小</label>
              <input
                type="range"
                v-model="selectedElement.fontSize"
                @input="updateElement"
                min="12"
                max="120"
                class="range-input"
              />
              <span class="range-value">{{ selectedElement.fontSize }}px</span>
            </div>

            <div class="property-group" v-if="selectedElement.type === 'text'">
              <label>字体</label>
              <select v-model="selectedElement.fontFamily" @change="updateElement" class="select-input">
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Impact">Impact</option>
              </select>
            </div>

            <div class="property-group">
              <label>旋转</label>
              <input
                type="range"
                v-model="selectedElement.rotation"
                @input="updateElement"
                min="0"
                max="360"
                class="range-input"
              />
              <span class="range-value">{{ selectedElement.rotation }}°</span>
            </div>

            <div class="property-group">
              <label>阴影</label>
              <input
                type="range"
                v-model="selectedElement.shadow"
                @input="updateElement"
                min="0"
                max="50"
                class="range-input"
              />
              <span class="range-value">{{ selectedElement.shadow }}px</span>
            </div>

            <button @click="deleteElement" class="btn-danger full-width">
              <span class="material-icons">delete</span>
              删除元素
            </button>
          </div>
        </div>

        <div class="tool-section">
          <h3>特效实验室</h3>
          <div class="effects-grid">
            <button
              v-for="effect in effects"
              :key="effect.id"
              @click="applyEffect(effect.id)"
              class="effect-btn"
              :title="effect.name"
            >
              {{ effect.icon }} {{ effect.name }}
            </button>
          </div>
        </div>
      </aside>

      <!-- 中央画布区域 -->
      <main class="canvas-area">
        <div class="canvas-wrapper" ref="canvasWrapper">
          <svg
            ref="canvas"
            class="canvas"
            :width="canvasWidth * zoom"
            :height="canvasHeight * zoom"
            :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
            @mousedown="canvasMouseDown"
            @mousemove="canvasMouseMove"
            @mouseup="canvasMouseUp"
            @click="canvasClick"
          >
            <!-- 背景网格 -->
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="none" />
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" stroke-width="0.5"/>
              </pattern>

              <!-- 渐变定义 -->
              <linearGradient v-for="grad in gradients" :key="grad.id" :id="grad.id" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" :style="`stop-color:${grad.start};stop-opacity:1`" />
                <stop offset="100%" :style="`stop-color:${grad.end};stop-opacity:1`" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" :fill="showGrid ? 'url(#grid)' : canvasBackground" />

            <!-- 渲染所有元素 -->
            <g v-for="(element, index) in elements" :key="element.id">
              <!-- 矩形 -->
              <rect
                v-if="element.type === 'rectangle'"
                :x="element.x"
                :y="element.y"
                :width="element.width"
                :height="element.height"
                :fill="element.fill"
                :stroke="element.stroke"
                :stroke-width="element.strokeWidth"
                :opacity="element.opacity"
                :rx="element.rounded || 0"
                :transform="`rotate(${element.rotation} ${element.x + element.width/2} ${element.y + element.height/2})`"
                :filter="element.shadow > 0 ? `drop-shadow(0 ${element.shadow/2}px ${element.shadow}px rgba(0,0,0,0.3))` : ''"
                @mousedown.stop="selectElement(element, $event)"
                class="draggable"
              />

              <!-- 圆形 -->
              <ellipse
                v-if="element.type === 'circle'"
                :cx="element.x + element.width/2"
                :cy="element.y + element.height/2"
                :rx="element.width/2"
                :ry="element.height/2"
                :fill="element.fill"
                :stroke="element.stroke"
                :stroke-width="element.strokeWidth"
                :opacity="element.opacity"
                :transform="`rotate(${element.rotation} ${element.x + element.width/2} ${element.y + element.height/2})`"
                :filter="element.shadow > 0 ? `drop-shadow(0 ${element.shadow/2}px ${element.shadow}px rgba(0,0,0,0.3))` : ''"
                @mousedown.stop="selectElement(element, $event)"
                class="draggable"
              />

              <!-- 三角形 -->
              <polygon
                v-if="element.type === 'triangle'"
                :points="`${element.x + element.width/2},${element.y} ${element.x + element.width},${element.y + element.height} ${element.x},${element.y + element.height}`"
                :fill="element.fill"
                :stroke="element.stroke"
                :stroke-width="element.strokeWidth"
                :opacity="element.opacity"
                :transform="`rotate(${element.rotation} ${element.x + element.width/2} ${element.y + element.height/2})`"
                :filter="element.shadow > 0 ? `drop-shadow(0 ${element.shadow/2}px ${element.shadow}px rgba(0,0,0,0.3))` : ''"
                @mousedown.stop="selectElement(element, $event)"
                class="draggable"
              />

              <!-- 星形 -->
              <polygon
                v-if="element.type === 'star'"
                :points="getStarPoints(element)"
                :fill="element.fill"
                :stroke="element.stroke"
                :stroke-width="element.strokeWidth"
                :opacity="element.opacity"
                :transform="`rotate(${element.rotation} ${element.x + element.width/2} ${element.y + element.height/2})`"
                :filter="element.shadow > 0 ? `drop-shadow(0 ${element.shadow/2}px ${element.shadow}px rgba(0,0,0,0.3))` : ''"
                @mousedown.stop="selectElement(element, $event)"
                class="draggable"
              />

              <!-- 文本 -->
              <text
                v-if="element.type === 'text'"
                :x="element.x"
                :y="element.y + element.fontSize"
                :fill="element.fill"
                :font-size="element.fontSize"
                :font-family="element.fontFamily"
                :opacity="element.opacity"
                :transform="`rotate(${element.rotation} ${element.x} ${element.y + element.fontSize})`"
                :filter="element.shadow > 0 ? `drop-shadow(0 ${element.shadow/2}px ${element.shadow}px rgba(0,0,0,0.3))` : ''"
                @mousedown.stop="selectElement(element, $event)"
                @dblclick="editText(element)"
                class="draggable"
              >
                {{ element.text }}
              </text>

              <!-- 选中框 -->
              <g v-if="selectedElement && selectedElement.id === element.id">
                <rect
                  :x="element.x - 2"
                  :y="element.y - 2"
                  :width="element.width + 4"
                  :height="element.height + 4"
                  fill="none"
                  stroke="#4285f4"
                  stroke-width="2"
                  stroke-dasharray="5,5"
                  class="selection-box"
                />

                <!-- 调整大小手柄 -->
                <circle
                  v-for="handle in resizeHandles"
                  :key="handle.position"
                  :cx="element.x + element.width * handle.x"
                  :cy="element.y + element.height * handle.y"
                  r="6"
                  fill="#4285f4"
                  stroke="white"
                  stroke-width="2"
                  class="resize-handle"
                  @mousedown.stop="startResize(element, handle.position, $event)"
                />
              </g>
            </g>
          </svg>
        </div>

        <!-- 画布配置 -->
        <div class="canvas-config">
          <button @click="showGrid = !showGrid" class="btn-icon" :title="showGrid ? '隐藏网格' : '显示网格'">
            <span class="material-icons">grid_on</span>
          </button>
          <label class="canvas-bg-label">
            背景:
            <input type="color" v-model="canvasBackground" class="color-input" />
          </label>
        </div>
      </main>

      <!-- 右侧图层面板 -->
      <aside class="right-panel">
        <div class="panel-section">
          <h3>图层</h3>
          <div class="layers-list">
            <div
              v-for="(element, index) in reversedElements"
              :key="element.id"
              @click="selectElementById(element.id)"
              :class="{ active: selectedElement && selectedElement.id === element.id }"
              class="layer-item"
            >
              <span class="material-icons layer-icon">{{ getLayerIcon(element.type) }}</span>
              <span class="layer-name">{{ getLayerName(element) }}</span>
              <div class="layer-actions">
                <button @click.stop="toggleElementVisibility(element)" class="btn-icon-sm">
                  <span class="material-icons">{{ element.visible !== false ? 'visibility' : 'visibility_off' }}</span>
                </button>
                <button @click.stop="moveLayer(index, -1)" :disabled="index === 0" class="btn-icon-sm">
                  <span class="material-icons">arrow_upward</span>
                </button>
                <button @click.stop="moveLayer(index, 1)" :disabled="index === elements.length - 1" class="btn-icon-sm">
                  <span class="material-icons">arrow_downward</span>
                </button>
              </div>
            </div>
            <div v-if="elements.length === 0" class="empty-state">
              暂无图层
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3>快捷操作</h3>
          <div class="quick-actions">
            <button @click="duplicateElement" :disabled="!selectedElement" class="btn-secondary full-width">
              <span class="material-icons">content_copy</span>
              复制元素
            </button>
            <button @click="alignElements('left')" :disabled="!selectedElement" class="btn-secondary">
              <span class="material-icons">format_align_left</span>
            </button>
            <button @click="alignElements('center')" :disabled="!selectedElement" class="btn-secondary">
              <span class="material-icons">format_align_center</span>
            </button>
            <button @click="alignElements('right')" :disabled="!selectedElement" class="btn-secondary">
              <span class="material-icons">format_align_right</span>
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- 模板库对话框 -->
    <div v-if="showTemplates" class="modal-overlay" @click="showTemplates = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>设计模板</h2>
          <button @click="showTemplates = false" class="btn-icon">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="templates-grid">
          <div
            v-for="template in templates"
            :key="template.id"
            @click="loadTemplate(template)"
            class="template-card"
          >
            <div class="template-preview" :style="{ background: template.preview }">
              <span class="template-icon">{{ template.icon }}</span>
            </div>
            <h4>{{ template.name }}</h4>
            <p>{{ template.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 导出对话框 -->
    <div v-if="showExportDialog" class="modal-overlay" @click="showExportDialog = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>导出设计</h2>
          <button @click="showExportDialog = false" class="btn-icon">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="export-options">
          <button @click="exportAs('png')" class="export-btn">
            <span class="material-icons">image</span>
            <div>
              <h4>PNG 图片</h4>
              <p>适合分享和打印</p>
            </div>
          </button>
          <button @click="exportAs('svg')" class="export-btn">
            <span class="material-icons">code</span>
            <div>
              <h4>SVG 矢量</h4>
              <p>无损缩放</p>
            </div>
          </button>
          <button @click="exportAs('json')" class="export-btn">
            <span class="material-icons">data_object</span>
            <div>
              <h4>JSON 数据</h4>
              <p>保存项目文件</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 画布配置
const canvasWidth = ref(1200)
const canvasHeight = ref(800)
const canvasBackground = ref('#ffffff')
const showGrid = ref(true)
const zoom = ref(1)

// 元素数组
const elements = ref([])
const selectedElement = ref(null)
const activeTool = ref('select')

// 历史记录
const history = ref([])
const historyIndex = ref(-1)

// UI状态
const isDarkMode = ref(false)
const showTemplates = ref(false)
const showExportDialog = ref(false)

// 拖拽状态
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const isResizing = ref(false)
const resizeHandle = ref(null)

// 工具定义
const tools = [
  { id: 'select', name: '选择', icon: 'near_me' },
  { id: 'text', name: '文本', icon: 'text_fields' },
  { id: 'draw', name: '画笔', icon: 'brush' },
  { id: 'eraser', name: '橡皮', icon: 'auto_fix_high' },
]

// 形状定义
const shapes = [
  { type: 'rectangle', name: '矩形', icon: 'crop_square' },
  { type: 'circle', name: '圆形', icon: 'circle' },
  { type: 'triangle', name: '三角形', icon: 'change_history' },
  { type: 'star', name: '星形', icon: 'star' },
]

// 特效定义
const effects = [
  { id: 'glow', name: '发光', icon: '✨' },
  { id: 'blur', name: '模糊', icon: '🌫️' },
  { id: 'pixelate', name: '像素化', icon: '🎮' },
  { id: 'rainbow', name: '彩虹', icon: '🌈' },
  { id: 'neon', name: '霓虹', icon: '💡' },
]

// 渐变定义
const gradients = ref([
  { id: 'gradient1', start: '#667eea', end: '#764ba2' },
  { id: 'gradient2', start: '#f093fb', end: '#f5576c' },
  { id: 'gradient3', start: '#4facfe', end: '#00f2fe' },
])

// 模板定义
const templates = [
  {
    id: 'social',
    name: '社交媒体',
    description: '适合Instagram和Facebook',
    icon: '📱',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    elements: [
      { type: 'rectangle', x: 50, y: 50, width: 300, height: 300, fill: 'url(#gradient1)', stroke: 'none', strokeWidth: 0, opacity: 1, rotation: 0, shadow: 20 },
      { type: 'text', x: 80, y: 180, text: '你的标题', fill: '#ffffff', fontSize: 48, fontFamily: 'Impact', opacity: 1, rotation: 0, shadow: 10 },
    ]
  },
  {
    id: 'poster',
    name: '海报设计',
    description: '活动宣传海报',
    icon: '🎪',
    preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    elements: [
      { type: 'rectangle', x: 0, y: 0, width: 1200, height: 800, fill: '#f5576c', stroke: 'none', strokeWidth: 0, opacity: 1, rotation: 0, shadow: 0 },
      { type: 'circle', x: 400, y: 250, width: 400, height: 400, fill: 'rgba(255,255,255,0.1)', stroke: 'none', strokeWidth: 0, opacity: 1, rotation: 0, shadow: 0 },
      { type: 'text', x: 100, y: 100, text: '精彩活动', fill: '#ffffff', fontSize: 72, fontFamily: 'Impact', opacity: 1, rotation: -5, shadow: 15 },
    ]
  },
  {
    id: 'card',
    name: '名片设计',
    description: '专业商务名片',
    icon: '💼',
    preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    elements: [
      { type: 'rectangle', x: 0, y: 0, width: 1200, height: 800, fill: '#1a1a2e', stroke: 'none', strokeWidth: 0, opacity: 1, rotation: 0, shadow: 0 },
      { type: 'rectangle', x: 50, y: 50, width: 300, height: 200, fill: 'url(#gradient3)', stroke: 'none', strokeWidth: 0, opacity: 1, rotation: 0, shadow: 20, rounded: 10 },
      { type: 'text', x: 80, y: 120, text: '您的名字', fill: '#ffffff', fontSize: 32, fontFamily: 'Arial', opacity: 1, rotation: 0, shadow: 5 },
    ]
  },
  {
    id: 'abstract',
    name: '抽象艺术',
    description: '现代抽象设计',
    icon: '🎨',
    preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    elements: [
      { type: 'circle', x: 100, y: 100, width: 300, height: 300, fill: '#fa709a', stroke: 'none', strokeWidth: 0, opacity: 0.7, rotation: 0, shadow: 30 },
      { type: 'circle', x: 300, y: 200, width: 400, height: 400, fill: '#fee140', stroke: 'none', strokeWidth: 0, opacity: 0.6, rotation: 0, shadow: 30 },
      { type: 'triangle', x: 500, y: 150, width: 300, height: 300, fill: '#4facfe', stroke: 'none', strokeWidth: 0, opacity: 0.5, rotation: 45, shadow: 30 },
    ]
  },
  {
    id: 'geometric',
    name: '几何图形',
    description: '简约几何风格',
    icon: '📐',
    preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    elements: [
      { type: 'rectangle', x: 100, y: 100, width: 200, height: 200, fill: '#667eea', stroke: '#ffffff', strokeWidth: 4, opacity: 1, rotation: 45, shadow: 15 },
      { type: 'circle', x: 400, y: 200, width: 250, height: 250, fill: '#f093fb', stroke: '#ffffff', strokeWidth: 4, opacity: 1, rotation: 0, shadow: 15 },
      { type: 'triangle', x: 700, y: 150, width: 200, height: 200, fill: '#4facfe', stroke: '#ffffff', strokeWidth: 4, opacity: 1, rotation: 0, shadow: 15 },
    ]
  },
  {
    id: 'neon',
    name: '霓虹风格',
    description: '赛博朋克霓虹',
    icon: '💫',
    preview: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    elements: [
      { type: 'rectangle', x: 0, y: 0, width: 1200, height: 800, fill: '#0f0c29', stroke: 'none', strokeWidth: 0, opacity: 1, rotation: 0, shadow: 0 },
      { type: 'text', x: 200, y: 300, text: 'NEON', fill: '#ff006e', fontSize: 120, fontFamily: 'Impact', opacity: 1, rotation: 0, shadow: 40 },
      { type: 'rectangle', x: 150, y: 350, width: 600, height: 8, fill: '#00f5ff', stroke: 'none', strokeWidth: 0, opacity: 1, rotation: 0, shadow: 25 },
    ]
  },
]

// 调整大小手柄
const resizeHandles = [
  { position: 'nw', x: 0, y: 0 },
  { position: 'ne', x: 1, y: 0 },
  { position: 'sw', x: 0, y: 1 },
  { position: 'se', x: 1, y: 1 },
]

// 计算属性
const reversedElements = computed(() => {
  return [...elements.value].reverse()
})

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

// 方法
const addShape = (type) => {
  const newElement = {
    id: Date.now(),
    type,
    x: Math.random() * (canvasWidth.value - 200) + 50,
    y: Math.random() * (canvasHeight.value - 200) + 50,
    width: 200,
    height: 200,
    fill: getRandomColor(),
    stroke: '#000000',
    strokeWidth: 2,
    opacity: 1,
    rotation: 0,
    shadow: 0,
    visible: true,
  }

  if (type === 'text') {
    newElement.text = '双击编辑文本'
    newElement.fontSize = 32
    newElement.fontFamily = 'Arial'
    newElement.stroke = 'none'
    newElement.strokeWidth = 0
  }

  elements.value.push(newElement)
  saveHistory()
}

const getRandomColor = () => {
  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#fa709a', '#fee140']
  return colors[Math.floor(Math.random() * colors.length)]
}

const selectElement = (element, event) => {
  selectedElement.value = element
  isDragging.value = true
  const rect = event.target.getBoundingClientRect()
  dragStart.value = {
    x: event.clientX / zoom.value - element.x,
    y: event.clientY / zoom.value - element.y,
  }
}

const selectElementById = (id) => {
  selectedElement.value = elements.value.find(el => el.id === id)
}

const canvasMouseDown = (event) => {
  if (activeTool.value === 'text') {
    addShape('text')
    activeTool.value = 'select'
  }
}

const canvasMouseMove = (event) => {
  if (isDragging.value && selectedElement.value) {
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / zoom.value
    const y = (event.clientY - rect.top) / zoom.value

    selectedElement.value.x = x - dragStart.value.x
    selectedElement.value.y = y - dragStart.value.y
  }

  if (isResizing.value && selectedElement.value) {
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / zoom.value
    const y = (event.clientY - rect.top) / zoom.value

    const el = selectedElement.value

    if (resizeHandle.value === 'se') {
      el.width = Math.max(20, x - el.x)
      el.height = Math.max(20, y - el.y)
    } else if (resizeHandle.value === 'sw') {
      const newWidth = Math.max(20, el.x + el.width - x)
      el.x = x
      el.width = newWidth
      el.height = Math.max(20, y - el.y)
    } else if (resizeHandle.value === 'ne') {
      el.width = Math.max(20, x - el.x)
      const newHeight = Math.max(20, el.y + el.height - y)
      el.y = y
      el.height = newHeight
    } else if (resizeHandle.value === 'nw') {
      const newWidth = Math.max(20, el.x + el.width - x)
      const newHeight = Math.max(20, el.y + el.height - y)
      el.x = x
      el.y = y
      el.width = newWidth
      el.height = newHeight
    }
  }
}

const canvasMouseUp = () => {
  if (isDragging.value || isResizing.value) {
    saveHistory()
  }
  isDragging.value = false
  isResizing.value = false
  resizeHandle.value = null
}

const canvasClick = (event) => {
  if (event.target === event.currentTarget) {
    selectedElement.value = null
  }
}

const startResize = (element, handle, event) => {
  event.stopPropagation()
  selectedElement.value = element
  isResizing.value = true
  resizeHandle.value = handle
}

const updateElement = () => {
  saveHistory()
}

const deleteElement = () => {
  if (selectedElement.value) {
    const index = elements.value.findIndex(el => el.id === selectedElement.value.id)
    if (index !== -1) {
      elements.value.splice(index, 1)
      selectedElement.value = null
      saveHistory()
    }
  }
}

const duplicateElement = () => {
  if (selectedElement.value) {
    const newElement = JSON.parse(JSON.stringify(selectedElement.value))
    newElement.id = Date.now()
    newElement.x += 20
    newElement.y += 20
    elements.value.push(newElement)
    selectedElement.value = newElement
    saveHistory()
  }
}

const editText = (element) => {
  const newText = prompt('编辑文本:', element.text)
  if (newText !== null) {
    element.text = newText
    saveHistory()
  }
}

const toggleElementVisibility = (element) => {
  element.visible = element.visible !== false ? false : true
}

const moveLayer = (index, direction) => {
  const actualIndex = elements.value.length - 1 - index
  const newIndex = actualIndex + direction

  if (newIndex >= 0 && newIndex < elements.value.length) {
    const element = elements.value.splice(actualIndex, 1)[0]
    elements.value.splice(newIndex, 0, element)
    saveHistory()
  }
}

const alignElements = (alignment) => {
  if (!selectedElement.value) return

  const el = selectedElement.value
  if (alignment === 'left') {
    el.x = 50
  } else if (alignment === 'center') {
    el.x = (canvasWidth.value - el.width) / 2
  } else if (alignment === 'right') {
    el.x = canvasWidth.value - el.width - 50
  }
  saveHistory()
}

const getStarPoints = (element) => {
  const cx = element.x + element.width / 2
  const cy = element.y + element.height / 2
  const outerRadius = Math.min(element.width, element.height) / 2
  const innerRadius = outerRadius * 0.4
  const points = []

  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (i * Math.PI) / 5 - Math.PI / 2
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  }

  return points.join(' ')
}

const getLayerIcon = (type) => {
  const icons = {
    rectangle: 'crop_square',
    circle: 'circle',
    triangle: 'change_history',
    star: 'star',
    text: 'text_fields',
  }
  return icons[type] || 'layers'
}

const getLayerName = (element) => {
  if (element.type === 'text') {
    return element.text.substring(0, 20)
  }
  return element.type.charAt(0).toUpperCase() + element.type.slice(1)
}

const applyEffect = (effectId) => {
  if (!selectedElement.value) {
    alert('请先选择一个元素')
    return
  }

  const el = selectedElement.value

  switch (effectId) {
    case 'glow':
      el.shadow = 30
      break
    case 'blur':
      el.opacity = 0.6
      break
    case 'rainbow':
      el.fill = 'url(#gradient1)'
      break
    case 'neon':
      el.shadow = 40
      el.fill = '#ff006e'
      break
    case 'pixelate':
      // 简单模拟像素化效果
      el.opacity = 0.9
      break
  }

  saveHistory()
}

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.1, 2)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.1, 0.5)
}

const saveHistory = () => {
  const state = JSON.parse(JSON.stringify(elements.value))

  // 删除当前索引之后的历史记录
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }

  history.value.push(state)
  historyIndex.value++

  // 限制历史记录数量
  if (history.value.length > 50) {
    history.value.shift()
    historyIndex.value--
  }
}

const undo = () => {
  if (canUndo.value) {
    historyIndex.value--
    elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }
}

const redo = () => {
  if (canRedo.value) {
    historyIndex.value++
    elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
  }
}

const newProject = () => {
  if (confirm('确定要创建新项目吗？未保存的更改将丢失。')) {
    elements.value = []
    selectedElement.value = null
    history.value = []
    historyIndex.value = -1
    canvasBackground.value = '#ffffff'
    saveHistory()
  }
}

const saveProject = async () => {
  const project = {
    canvasWidth: canvasWidth.value,
    canvasHeight: canvasHeight.value,
    canvasBackground: canvasBackground.value,
    elements: elements.value,
  }

  try {
    const response = await fetch('/api/canva/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    })

    if (response.ok) {
      const data = await response.json()
      alert(`项目已保存！ID: ${data.id}`)
    } else {
      throw new Error('保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    // 降级到本地存储
    localStorage.setItem('canva_project', JSON.stringify(project))
    alert('项目已保存到本地浏览器')
  }
}

const loadProject = async () => {
  try {
    // 尝试从本地存储加载
    const saved = localStorage.getItem('canva_project')
    if (saved) {
      const project = JSON.parse(saved)
      canvasWidth.value = project.canvasWidth
      canvasHeight.value = project.canvasHeight
      canvasBackground.value = project.canvasBackground
      elements.value = project.elements
      saveHistory()
      alert('项目已加载')
    } else {
      alert('没有找到保存的项目')
    }
  } catch (error) {
    console.error('加载失败:', error)
    alert('加载项目失败')
  }
}

const loadTemplate = (template) => {
  elements.value = JSON.parse(JSON.stringify(template.elements))
  saveHistory()
  showTemplates.value = false
}

const exportDesign = () => {
  showExportDialog.value = true
}

const exportAs = (format) => {
  if (format === 'png') {
    exportAsPNG()
  } else if (format === 'svg') {
    exportAsSVG()
  } else if (format === 'json') {
    exportAsJSON()
  }
  showExportDialog.value = false
}

const exportAsPNG = () => {
  const canvas = document.querySelector('.canvas')
  const svgData = new XMLSerializer().serializeToString(canvas)
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  const img = new Image()
  img.onload = () => {
    const pngCanvas = document.createElement('canvas')
    pngCanvas.width = canvasWidth.value
    pngCanvas.height = canvasHeight.value
    const ctx = pngCanvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    pngCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `design-${Date.now()}.png`
      a.click()
      URL.revokeObjectURL(url)
    })

    URL.revokeObjectURL(url)
  }
  img.src = url
}

const exportAsSVG = () => {
  const canvas = document.querySelector('.canvas')
  const svgData = new XMLSerializer().serializeToString(canvas)
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `design-${Date.now()}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

const exportAsJSON = () => {
  const project = {
    canvasWidth: canvasWidth.value,
    canvasHeight: canvasHeight.value,
    canvasBackground: canvasBackground.value,
    elements: elements.value,
  }
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `design-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

// 初始化
onMounted(() => {
  saveHistory()

  // 键盘快捷键
  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault()
        undo()
      } else if (e.key === 'y') {
        e.preventDefault()
        redo()
      } else if (e.key === 's') {
        e.preventDefault()
        saveProject()
      } else if (e.key === 'd') {
        e.preventDefault()
        duplicateElement()
      }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedElement.value) {
        e.preventDefault()
        deleteElement()
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<style scoped>
.canva-editor {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
}

.dark-mode {
  background: #1a1a1a;
  color: #e0e0e0;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.dark-mode .toolbar {
  background: #2a2a2a;
  border-bottom-color: #404040;
}

.toolbar-left,
.toolbar-center,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  margin: 0 16px 0 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-icon,
.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-icon {
  background: transparent;
  color: #666;
  padding: 8px;
}

.btn-icon:hover:not(:disabled) {
  background: #f0f0f0;
  color: #333;
}

.dark-mode .btn-icon {
  color: #aaa;
}

.dark-mode .btn-icon:hover:not(:disabled) {
  background: #3a3a3a;
  color: #fff;
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.dark-mode .btn-secondary {
  background: #3a3a3a;
  color: #e0e0e0;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
}

.zoom-level {
  min-width: 50px;
  text-align: center;
  font-weight: 600;
  font-size: 13px;
}

/* 编辑器容器 */
.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧面板 */
.left-panel {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 16px;
}

.dark-mode .left-panel {
  background: #2a2a2a;
  border-right-color: #404040;
}

.tool-section {
  margin-bottom: 24px;
}

.tool-section h3 {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: #999;
  margin: 0 0 12px 0;
}

.tool-grid,
.shape-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.tool-btn,
.shape-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.dark-mode .tool-btn,
.dark-mode .shape-btn {
  background: #1a1a1a;
  border-color: #404040;
}

.tool-btn:hover,
.shape-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.tool-btn.active {
  border-color: #667eea;
  background: #f0f4ff;
}

.dark-mode .tool-btn.active {
  background: #2a2a4a;
}

.tool-name {
  font-size: 11px;
  margin-top: 4px;
  font-weight: 500;
}

.shape-btn .material-icons {
  font-size: 32px;
  color: #667eea;
}

.properties {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.property-group label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.dark-mode .property-group label {
  color: #aaa;
}

.color-picker-container {
  display: flex;
  gap: 8px;
}

.color-input {
  width: 50px;
  height: 36px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
}

.color-text {
  flex: 1;
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
}

.dark-mode .color-text {
  background: #1a1a1a;
  border-color: #404040;
  color: #e0e0e0;
}

.number-input {
  width: 80px;
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
}

.dark-mode .number-input {
  background: #1a1a1a;
  border-color: #404040;
  color: #e0e0e0;
}

.range-input {
  width: 100%;
}

.range-value {
  font-size: 12px;
  color: #666;
  text-align: right;
}

.select-input {
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  background: white;
}

.dark-mode .select-input {
  background: #1a1a1a;
  border-color: #404040;
  color: #e0e0e0;
}

.btn-danger {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #d32f2f;
  transform: translateY(-1px);
}

.full-width {
  width: 100%;
}

.effects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}

.effect-btn {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  transition: all 0.2s;
}

.dark-mode .effect-btn {
  background: #1a1a1a;
  border-color: #404040;
}

.effect-btn:hover {
  border-color: #667eea;
  transform: translateX(4px);
}

/* 画布区域 */
.canvas-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: #f9f9f9;
  position: relative;
}

.dark-mode .canvas-area {
  background: #1a1a1a;
}

.canvas-wrapper {
  padding: 40px;
}

.canvas {
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  background: white;
  cursor: crosshair;
}

.draggable {
  cursor: move;
}

.selection-box {
  pointer-events: none;
  animation: dash 20s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: -100;
  }
}

.resize-handle {
  cursor: nwse-resize;
}

.canvas-config {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.dark-mode .canvas-config {
  background: #2a2a2a;
}

.canvas-bg-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

/* 右侧面板 */
.right-panel {
  width: 280px;
  background: white;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 16px;
}

.dark-mode .right-panel {
  background: #2a2a2a;
  border-left-color: #404040;
}

.panel-section {
  margin-bottom: 24px;
}

.panel-section h3 {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: #999;
  margin: 0 0 12px 0;
}

.layers-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.layer-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.layer-item:hover {
  background: #f5f5f5;
}

.dark-mode .layer-item:hover {
  background: #3a3a3a;
}

.layer-item.active {
  background: #f0f4ff;
  border-color: #667eea;
}

.dark-mode .layer-item.active {
  background: #2a2a4a;
}

.layer-icon {
  font-size: 20px;
  color: #667eea;
}

.layer-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-actions {
  display: flex;
  gap: 2px;
}

.btn-icon-sm {
  padding: 4px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.btn-icon-sm:hover:not(:disabled) {
  background: #e0e0e0;
  color: #333;
}

.btn-icon-sm:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-icon-sm .material-icons {
  font-size: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 13px;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
}

.quick-actions .full-width {
  grid-column: 1 / -1;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 900px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
}

.dark-mode .modal-content {
  background: #2a2a2a;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.template-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.dark-mode .template-card {
  border-color: #404040;
}

.template-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.template-preview {
  width: 100%;
  height: 120px;
  border-radius: 6px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-icon {
  font-size: 48px;
}

.template-card h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
}

.template-card p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.dark-mode .template-card p {
  color: #aaa;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.dark-mode .export-btn {
  background: #1a1a1a;
  border-color: #404040;
}

.export-btn:hover {
  border-color: #667eea;
  transform: translateX(8px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.export-btn .material-icons {
  font-size: 48px;
  color: #667eea;
}

.export-btn h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
}

.export-btn p {
  margin: 0;
  font-size: 13px;
  color: #666;
}

.dark-mode .export-btn p {
  color: #aaa;
}

/* 滚动条样式 */
.left-panel::-webkit-scrollbar,
.right-panel::-webkit-scrollbar,
.canvas-area::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.left-panel::-webkit-scrollbar-track,
.right-panel::-webkit-scrollbar-track,
.canvas-area::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dark-mode .left-panel::-webkit-scrollbar-track,
.dark-mode .right-panel::-webkit-scrollbar-track,
.dark-mode .canvas-area::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.left-panel::-webkit-scrollbar-thumb,
.right-panel::-webkit-scrollbar-thumb,
.canvas-area::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.left-panel::-webkit-scrollbar-thumb:hover,
.right-panel::-webkit-scrollbar-thumb:hover,
.canvas-area::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
