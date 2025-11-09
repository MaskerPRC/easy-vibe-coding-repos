<template>
  <div class="fluid-art-container" ref="container">
    <!-- WebGL 流体模拟背景 -->
    <canvas ref="fluidCanvas" class="fluid-canvas"></canvas>

    <!-- 渐变背景层 -->
    <div class="gradient-overlay" :style="{ background: currentGradient }"></div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 玻璃拟态卡片 -->
      <div
        class="glass-card"
        :style="parallaxStyle"
        @mouseenter="hoveredCard = true"
        @mouseleave="hoveredCard = false"
      >
        <h1 class="title">流体艺术空间</h1>
        <p class="subtitle">鼠标移动感受流体的魅力</p>

        <!-- 液体金属质感按钮 -->
        <div class="button-group">
          <button
            class="liquid-metal-btn"
            @mouseenter="onButtonHover($event, 0)"
            @mouseleave="onButtonLeave(0)"
            @mousemove="onButtonMove($event, 0)"
          >
            <span class="btn-content">探索世界</span>
            <div class="liquid-shine" :style="buttonShineStyles[0]"></div>
          </button>

          <button
            class="liquid-metal-btn secondary"
            @mouseenter="onButtonHover($event, 1)"
            @mouseleave="onButtonLeave(1)"
            @mousemove="onButtonMove($event, 1)"
          >
            <span class="btn-content">了解更多</span>
            <div class="liquid-shine" :style="buttonShineStyles[1]"></div>
          </button>
        </div>
      </div>

      <!-- 悬浮装饰元素 -->
      <div
        v-for="(orb, index) in floatingOrbs"
        :key="index"
        class="floating-orb"
        :style="getOrbStyle(orb, index)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const container = ref(null)
const fluidCanvas = ref(null)
let fluidContext = null
let animationId = null

// 鼠标位置
const mouseX = ref(0)
const mouseY = ref(0)
const hoveredCard = ref(false)

// 渐变色配置
const gradients = [
  'linear-gradient(45deg, rgba(255, 0, 150, 0.3), rgba(0, 204, 255, 0.3))',
  'linear-gradient(135deg, rgba(142, 45, 226, 0.3), rgba(74, 0, 224, 0.3))',
  'linear-gradient(225deg, rgba(0, 242, 254, 0.3), rgba(0, 119, 182, 0.3))',
  'linear-gradient(315deg, rgba(255, 61, 113, 0.3), rgba(255, 154, 0, 0.3))'
]

const currentGradientIndex = ref(0)
const gradientProgress = ref(0)

const currentGradient = computed(() => gradients[currentGradientIndex.value])

// 悬浮装饰球
const floatingOrbs = ref([
  { x: 20, y: 30, size: 150, speed: 0.5, hue: 280 },
  { x: 80, y: 60, size: 100, speed: 0.7, hue: 200 },
  { x: 50, y: 80, size: 120, speed: 0.6, hue: 320 },
  { x: 10, y: 70, size: 80, speed: 0.8, hue: 180 },
  { x: 90, y: 20, size: 90, speed: 0.65, hue: 240 }
])

// 按钮光泽效果
const buttonShineStyles = ref([
  { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
  { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 }
])

// WebGL 流体模拟
class FluidSimulation {
  constructor(canvas) {
    this.canvas = canvas
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

    if (!this.gl) {
      console.error('WebGL not supported')
      return
    }

    this.particles = []
    this.ripples = []
    this.time = 0

    this.initWebGL()
    this.createParticles()
  }

  initWebGL() {
    const gl = this.gl

    // 顶点着色器
    const vertexShaderSource = `
      attribute vec2 position;
      attribute vec4 color;
      varying vec4 vColor;

      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        gl_PointSize = 3.0;
        vColor = color;
      }
    `

    // 片段着色器
    const fragmentShaderSource = `
      precision mediump float;
      varying vec4 vColor;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float alpha = 1.0 - (dist * 2.0);
        gl_FragColor = vec4(vColor.rgb, vColor.a * alpha);
      }
    `

    // 编译着色器
    const vertexShader = this.compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = this.compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)

    // 创建程序
    this.program = gl.createProgram()
    gl.attachShader(this.program, vertexShader)
    gl.attachShader(this.program, fragmentShader)
    gl.linkProgram(this.program)
    gl.useProgram(this.program)

    // 启用混合
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  }

  compileShader(gl, source, type) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  createParticles() {
    const count = 1000
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        hue: Math.random() * 60 + 200,
        alpha: Math.random() * 0.5 + 0.3
      })
    }
  }

  addRipple(x, y) {
    this.ripples.push({
      x: (x / this.canvas.width) * 2 - 1,
      y: 1 - (y / this.canvas.height) * 2,
      radius: 0,
      maxRadius: 0.3,
      alpha: 1
    })

    // 限制波纹数量
    if (this.ripples.length > 20) {
      this.ripples.shift()
    }
  }

  update() {
    this.time += 0.01

    // 更新粒子
    this.particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy

      // 边界反弹
      if (p.x > 1 || p.x < -1) p.vx *= -1
      if (p.y > 1 || p.y < -1) p.vy *= -1

      // 波纹影响
      this.ripples.forEach(r => {
        const dx = p.x - r.x
        const dy = p.y - r.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < r.radius && dist > r.radius - 0.1) {
          const force = 0.01
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }
      })
    })

    // 更新波纹
    this.ripples = this.ripples.filter(r => {
      r.radius += 0.01
      r.alpha -= 0.02
      return r.alpha > 0
    })
  }

  render() {
    const gl = this.gl

    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // 准备粒子数据
    const positions = []
    const colors = []

    this.particles.forEach(p => {
      positions.push(p.x, p.y)

      const h = p.hue
      const s = 70
      const l = 60
      const rgb = this.hslToRgb(h, s, l)

      colors.push(rgb[0], rgb[1], rgb[2], p.alpha)
    })

    // 波纹粒子
    this.ripples.forEach(r => {
      const segments = 32
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const x = r.x + Math.cos(angle) * r.radius
        const y = r.y + Math.sin(angle) * r.radius

        positions.push(x, y)
        colors.push(0.5, 0.8, 1.0, r.alpha)
      }
    })

    // 创建缓冲区
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const positionLocation = gl.getAttribLocation(this.program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

    const colorLocation = gl.getAttribLocation(this.program, 'color')
    gl.enableVertexAttribArray(colorLocation)
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0)

    // 绘制
    gl.drawArrays(gl.POINTS, 0, positions.length / 2)
  }

  hslToRgb(h, s, l) {
    h = h / 360
    s = s / 100
    l = l / 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return [r, g, b]
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }
}

let fluidSim = null

// 视差效果计算
const parallaxStyle = computed(() => {
  const offsetX = (mouseX.value - 50) * 0.3
  const offsetY = (mouseY.value - 50) * 0.3

  return {
    transform: `translate(${offsetX}px, ${offsetY}px) scale(${hoveredCard.value ? 1.05 : 1})`,
    transition: hoveredCard.value ? 'transform 0.3s ease' : 'transform 0.5s ease'
  }
})

// 悬浮球样式计算
const getOrbStyle = (orb, index) => {
  const parallaxFactor = orb.speed * 0.5
  const offsetX = (mouseX.value - 50) * parallaxFactor
  const offsetY = (mouseY.value - 50) * parallaxFactor

  const angle = (Date.now() * 0.0001 * orb.speed) + index * 1.2
  const floatX = Math.sin(angle) * 20
  const floatY = Math.cos(angle) * 20

  return {
    left: `calc(${orb.x}% + ${offsetX + floatX}px)`,
    top: `calc(${orb.y}% + ${offsetY + floatY}px)`,
    width: `${orb.size}px`,
    height: `${orb.size}px`,
    background: `radial-gradient(circle at 30% 30%,
      hsla(${orb.hue}, 70%, 70%, 0.4),
      hsla(${orb.hue + 30}, 60%, 50%, 0.2))`,
    boxShadow: `0 0 ${orb.size * 0.5}px hsla(${orb.hue}, 80%, 60%, 0.3)`
  }
}

// 按钮交互
const onButtonHover = (event, index) => {
  updateButtonShine(event, index, true)
}

const onButtonMove = (event, index) => {
  updateButtonShine(event, index, true)
}

const onButtonLeave = (index) => {
  buttonShineStyles.value[index] = {
    transform: 'translate(-50%, -50%) scale(0)',
    opacity: 0
  }
}

const updateButtonShine = (event, index, isHovered) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  buttonShineStyles.value[index] = {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%) scale(1)',
    opacity: isHovered ? 1 : 0
  }
}

// 鼠标移动处理
const handleMouseMove = (event) => {
  const rect = container.value.getBoundingClientRect()
  mouseX.value = ((event.clientX - rect.left) / rect.width) * 100
  mouseY.value = ((event.clientY - rect.top) / rect.height) * 100

  // 创建波纹
  if (fluidSim && Math.random() > 0.9) {
    fluidSim.addRipple(event.clientX, event.clientY)
  }
}

// 渐变色动画
const animateGradient = () => {
  gradientProgress.value += 0.001

  if (gradientProgress.value >= 1) {
    gradientProgress.value = 0
    currentGradientIndex.value = (currentGradientIndex.value + 1) % gradients.length
  }
}

// 动画循环
const animate = () => {
  if (fluidSim) {
    fluidSim.update()
    fluidSim.render()
  }

  animateGradient()

  animationId = requestAnimationFrame(animate)
}

// 窗口调整
const handleResize = () => {
  if (fluidSim) {
    fluidSim.resize()
  }
}

onMounted(() => {
  if (fluidCanvas.value) {
    fluidSim = new FluidSimulation(fluidCanvas.value)
    fluidSim.resize()
    animate()
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.fluid-art-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 100%);
}

.fluid-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  transition: background 3s ease;
  pointer-events: none;
}

.content-wrapper {
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 玻璃拟态卡片 */
.glass-card {
  position: relative;
  padding: 60px 80px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  will-change: transform;
}

.title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #fff, #a0a0ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(160, 160, 255, 0.5);
}

.subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 40px 0;
  letter-spacing: 2px;
}

/* 按钮组 */
.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* 液体金属质感按钮 */
.liquid-metal-btn {
  position: relative;
  padding: 18px 40px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg,
    rgba(100, 200, 255, 0.8),
    rgba(150, 100, 255, 0.8));
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 15px rgba(100, 150, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

.liquid-metal-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent);
  transition: left 0.5s ease;
}

.liquid-metal-btn:hover::before {
  left: 100%;
}

.liquid-metal-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 25px rgba(100, 150, 255, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

.liquid-metal-btn.secondary {
  background: linear-gradient(135deg,
    rgba(255, 100, 200, 0.8),
    rgba(255, 150, 100, 0.8));
  box-shadow:
    0 4px 15px rgba(255, 100, 150, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
}

.liquid-metal-btn.secondary:hover {
  box-shadow:
    0 6px 25px rgba(255, 100, 150, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
}

.btn-content {
  position: relative;
  z-index: 2;
}

.liquid-shine {
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle,
    rgba(255, 255, 255, 0.6) 0%,
    transparent 70%);
  pointer-events: none;
  transition: all 0.3s ease;
}

/* 悬浮装饰球 */
.floating-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
  transition: all 0.1s ease;
  will-change: transform;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .glass-card {
    padding: 40px 30px;
    margin: 20px;
  }

  .title {
    font-size: 32px;
  }

  .subtitle {
    font-size: 14px;
  }

  .button-group {
    flex-direction: column;
    gap: 15px;
  }

  .liquid-metal-btn {
    width: 100%;
  }
}
</style>
