<template>
  <div class="minecraft-game">
    <!-- 3D画布容器 -->
    <div ref="gameContainer" class="game-container"></div>

    <!-- 游戏UI -->
    <div class="game-ui">
      <!-- 十字准星 -->
      <div class="crosshair">
        <div class="crosshair-line crosshair-horizontal"></div>
        <div class="crosshair-line crosshair-vertical"></div>
      </div>

      <!-- 方块选择器 -->
      <div class="block-selector">
        <div
          v-for="(block, index) in blockTypes"
          :key="index"
          :class="['block-item', { active: selectedBlock === index }]"
          :style="{ backgroundColor: block.color }"
          @click="selectBlock(index)"
        >
          <span>{{ index + 1 }}</span>
          <div class="block-name">{{ block.name }}</div>
        </div>
      </div>

      <!-- 控制说明 -->
      <div class="controls-help" v-if="showHelp">
        <h3>游戏控制</h3>
        <ul>
          <li><strong>移动：</strong>W/A/S/D 键</li>
          <li><strong>跳跃：</strong>空格键</li>
          <li><strong>视角：</strong>鼠标移动</li>
          <li><strong>破坏方块：</strong>左键点击</li>
          <li><strong>放置方块：</strong>右键点击</li>
          <li><strong>选择方块：</strong>1-6 数字键 或 点击下方方块</li>
          <li><strong>帮助：</strong>H 键</li>
        </ul>
        <button @click="showHelp = false">关闭</button>
      </div>

      <!-- 帮助按钮 -->
      <button class="help-button" @click="showHelp = !showHelp">
        {{ showHelp ? '隐藏帮助' : '显示帮助(H)' }}
      </button>

      <!-- 锁定提示 -->
      <div class="lock-notice" v-if="!isPointerLocked">
        <p>点击游戏区域开始游戏</p>
        <p class="small-text">点击后可以使用鼠标和键盘控制</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// 游戏状态
const gameContainer = ref(null)
const isPointerLocked = ref(false)
const showHelp = ref(true)
const selectedBlock = ref(0)

// 方块类型定义
const blockTypes = [
  { name: '草地', color: '#7cb342', top: '#7cb342', side: '#8d6e63', bottom: '#6d4c41' },
  { name: '泥土', color: '#8d6e63', top: '#8d6e63', side: '#8d6e63', bottom: '#6d4c41' },
  { name: '石头', color: '#757575', top: '#757575', side: '#616161', bottom: '#424242' },
  { name: '木板', color: '#a1887f', top: '#a1887f', side: '#8d6e63', bottom: '#795548' },
  { name: '树叶', color: '#558b2f', top: '#558b2f', side: '#689f38', bottom: '#33691e' },
  { name: '沙子', color: '#fdd835', top: '#fdd835', side: '#fbc02d', bottom: '#f9a825' }
]

// Three.js 变量
let scene, camera, renderer, raycaster, mouse
let world = new Map() // 存储方块数据 (key: "x,y,z", value: blockType)
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, canJump = false
let velocity = new THREE.Vector3()
let direction = new THREE.Vector3()
const blockSize = 1
let clock = new THREE.Clock()

// 玩家相机设置
let yaw = 0, pitch = 0
const moveSpeed = 5
const jumpSpeed = 8
const gravity = 20

// 选择方块
const selectBlock = (index) => {
  selectedBlock.value = index
}

// 初始化Three.js场景
const initScene = () => {
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x87ceeb) // 天空蓝
  scene.fog = new THREE.Fog(0x87ceeb, 0, 100)

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 10, 10)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  gameContainer.value.appendChild(renderer.domElement)

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(50, 100, 50)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  // Raycaster用于检测方块
  raycaster = new THREE.Raycaster()
  raycaster.far = 10
  mouse = new THREE.Vector2(0, 0) // 屏幕中心

  // 生成初始世界
  generateWorld()

  // 设置指针锁定
  setupPointerLock()

  // 开始动画循环
  animate()
}

// 生成初始世界
const generateWorld = () => {
  // 创建地面层
  for (let x = -15; x <= 15; x++) {
    for (let z = -15; z <= 15; z++) {
      // 地面（草地）
      addBlock(x, 0, z, 0)
      // 地下层（泥土）
      addBlock(x, -1, z, 1)
      addBlock(x, -2, z, 1)
      // 底层（石头）
      addBlock(x, -3, z, 2)
    }
  }

  // 添加一些随机的树
  addTree(5, 1, 5)
  addTree(-8, 1, 3)
  addTree(10, 1, -10)
  addTree(-5, 1, -8)
  addTree(0, 1, 12)

  // 添加一些装饰方块
  addBlock(3, 1, 3, 2)
  addBlock(4, 1, 3, 2)
  addBlock(3, 2, 3, 2)
  addBlock(-3, 1, -3, 5)
  addBlock(-3, 1, -2, 5)
  addBlock(-2, 1, -3, 5)
}

// 添加树
const addTree = (x, y, z) => {
  // 树干
  addBlock(x, y, z, 3)
  addBlock(x, y + 1, z, 3)
  addBlock(x, y + 2, z, 3)
  addBlock(x, y + 3, z, 3)

  // 树叶
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      for (let dy = 0; dy <= 1; dy++) {
        if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue
        addBlock(x + dx, y + 4 + dy, z + dz, 4)
      }
    }
  }
  // 树顶
  addBlock(x, y + 6, z, 4)
  addBlock(x + 1, y + 6, z, 4)
  addBlock(x - 1, y + 6, z, 4)
  addBlock(x, y + 6, z + 1, 4)
  addBlock(x, y + 6, z - 1, 4)
}

// 添加方块
const addBlock = (x, y, z, type) => {
  const key = `${x},${y},${z}`
  if (world.has(key)) return

  const blockType = blockTypes[type]
  const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize)

  // 创建材质（每个面不同颜色）
  const materials = [
    new THREE.MeshLambertMaterial({ color: blockType.side }), // 右
    new THREE.MeshLambertMaterial({ color: blockType.side }), // 左
    new THREE.MeshLambertMaterial({ color: blockType.top }), // 上
    new THREE.MeshLambertMaterial({ color: blockType.bottom }), // 下
    new THREE.MeshLambertMaterial({ color: blockType.side }), // 前
    new THREE.MeshLambertMaterial({ color: blockType.side })  // 后
  ]

  const mesh = new THREE.Mesh(geometry, materials)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.userData = { key, type }

  scene.add(mesh)
  world.set(key, { mesh, type })
}

// 移除方块
const removeBlock = (x, y, z) => {
  const key = `${x},${y},${z}`
  const block = world.get(key)
  if (block) {
    scene.remove(block.mesh)
    block.mesh.geometry.dispose()
    if (Array.isArray(block.mesh.material)) {
      block.mesh.material.forEach(mat => mat.dispose())
    } else {
      block.mesh.material.dispose()
    }
    world.delete(key)
  }
}

// 设置指针锁定
const setupPointerLock = () => {
  const element = renderer.domElement

  element.addEventListener('click', () => {
    element.requestPointerLock()
  })

  document.addEventListener('pointerlockchange', () => {
    isPointerLocked.value = document.pointerLockElement === element
  })

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('contextmenu', (e) => e.preventDefault())
}

// 鼠标移动
const onMouseMove = (event) => {
  if (!isPointerLocked.value) return

  const movementX = event.movementX || 0
  const movementY = event.movementY || 0

  yaw -= movementX * 0.002
  pitch -= movementY * 0.002
  pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch))

  camera.rotation.order = 'YXZ'
  camera.rotation.y = yaw
  camera.rotation.x = pitch
}

// 鼠标点击
const onMouseDown = (event) => {
  if (!isPointerLocked.value) return

  // 设置raycaster从相机中心发射
  raycaster.setFromCamera(mouse, camera)

  // 获取所有方块
  const objects = []
  world.forEach(block => objects.push(block.mesh))

  const intersects = raycaster.intersectObjects(objects)

  if (intersects.length > 0) {
    const intersect = intersects[0]

    if (event.button === 0) {
      // 左键 - 破坏方块
      const key = intersect.object.userData.key
      const [x, y, z] = key.split(',').map(Number)
      removeBlock(x, y, z)
    } else if (event.button === 2) {
      // 右键 - 放置方块
      const normal = intersect.face.normal
      const pos = intersect.object.position.clone()
      pos.x += normal.x
      pos.y += normal.y
      pos.z += normal.z

      // 检查是否与玩家碰撞
      const playerPos = camera.position.clone()
      const distance = playerPos.distanceTo(pos)
      if (distance > 1.5) {
        addBlock(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z), selectedBlock.value)
      }
    }
  }
}

// 键盘控制
const onKeyDown = (event) => {
  switch (event.code) {
    case 'KeyW': moveForward = true; break
    case 'KeyS': moveBackward = true; break
    case 'KeyA': moveLeft = true; break
    case 'KeyD': moveRight = true; break
    case 'Space': if (canJump) velocity.y = jumpSpeed; break
    case 'KeyH': showHelp.value = !showHelp.value; break
    case 'Digit1': selectBlock(0); break
    case 'Digit2': selectBlock(1); break
    case 'Digit3': selectBlock(2); break
    case 'Digit4': selectBlock(3); break
    case 'Digit5': selectBlock(4); break
    case 'Digit6': selectBlock(5); break
  }
}

const onKeyUp = (event) => {
  switch (event.code) {
    case 'KeyW': moveForward = false; break
    case 'KeyS': moveBackward = false; break
    case 'KeyA': moveLeft = false; break
    case 'KeyD': moveRight = false; break
  }
}

// 检查碰撞
const checkCollision = (position) => {
  const playerBox = new THREE.Box3(
    new THREE.Vector3(position.x - 0.3, position.y - 1.5, position.z - 0.3),
    new THREE.Vector3(position.x + 0.3, position.y + 0.3, position.z + 0.3)
  )

  for (let [key, block] of world) {
    const blockBox = new THREE.Box3().setFromObject(block.mesh)
    if (playerBox.intersectsBox(blockBox)) {
      return true
    }
  }
  return false
}

// 更新玩家移动
const updateMovement = (delta) => {
  velocity.x -= velocity.x * 10.0 * delta
  velocity.z -= velocity.z * 10.0 * delta
  velocity.y -= gravity * delta

  direction.z = Number(moveForward) - Number(moveBackward)
  direction.x = Number(moveRight) - Number(moveLeft)
  direction.normalize()

  if (moveForward || moveBackward) velocity.z -= direction.z * moveSpeed * delta
  if (moveLeft || moveRight) velocity.x -= direction.x * moveSpeed * delta

  const newPosition = camera.position.clone()

  // 应用旋转到移动方向
  const moveVector = new THREE.Vector3(-velocity.x, 0, -velocity.z)
  moveVector.applyEuler(new THREE.Euler(0, yaw, 0))

  newPosition.x += moveVector.x
  newPosition.z += moveVector.z

  // 检查水平碰撞
  if (!checkCollision(newPosition)) {
    camera.position.x = newPosition.x
    camera.position.z = newPosition.z
  }

  newPosition.copy(camera.position)
  newPosition.y += velocity.y * delta

  // 检查垂直碰撞
  if (!checkCollision(newPosition)) {
    camera.position.y = newPosition.y
    canJump = false
  } else {
    if (velocity.y < 0) canJump = true
    velocity.y = 0
  }

  // 防止掉出世界
  if (camera.position.y < -5) {
    camera.position.set(0, 10, 10)
    velocity.set(0, 0, 0)
  }
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)

  const delta = clock.getDelta()

  if (isPointerLocked.value) {
    updateMovement(delta)
  }

  renderer.render(scene, camera)
}

// 窗口大小调整
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 组件挂载
onMounted(() => {
  initScene()
  window.addEventListener('resize', onWindowResize)
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
})

// 组件卸载
onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mousedown', onMouseDown)

  // 清理资源
  if (renderer) {
    renderer.dispose()
  }
  world.forEach(block => {
    if (block.mesh.geometry) block.mesh.geometry.dispose()
    if (Array.isArray(block.mesh.material)) {
      block.mesh.material.forEach(mat => mat.dispose())
    } else if (block.mesh.material) {
      block.mesh.material.dispose()
    }
  })
  world.clear()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.minecraft-game {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Minecraft', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.game-container {
  width: 100%;
  height: 100%;
}

.game-ui {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 十字准星 */
.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.crosshair-line {
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
}

.crosshair-horizontal {
  width: 20px;
  height: 2px;
  left: -10px;
  top: -1px;
}

.crosshair-vertical {
  width: 2px;
  height: 20px;
  left: -1px;
  top: -10px;
}

/* 方块选择器 */
.block-selector {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  pointer-events: auto;
}

.block-item {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.block-item:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.9);
}

.block-item.active {
  border-color: #fff;
  border-width: 4px;
  transform: scale(1.15);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.block-name {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
}

.block-item:hover .block-name {
  opacity: 1;
}

/* 控制说明 */
.controls-help {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 300px;
  pointer-events: auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.controls-help h3 {
  margin-bottom: 15px;
  font-size: 20px;
  border-bottom: 2px solid #7cb342;
  padding-bottom: 10px;
}

.controls-help ul {
  list-style: none;
  margin-bottom: 15px;
}

.controls-help li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.controls-help button {
  width: 100%;
  padding: 10px;
  background: #7cb342;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.3s;
}

.controls-help button:hover {
  background: #689f38;
}

/* 帮助按钮 */
.help-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid #7cb342;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  pointer-events: auto;
  transition: all 0.3s;
}

.help-button:hover {
  background: rgba(124, 179, 66, 0.3);
  border-color: #689f38;
}

/* 锁定提示 */
.lock-notice {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 30px 50px;
  border-radius: 10px;
  text-align: center;
  pointer-events: none;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.lock-notice p {
  font-size: 20px;
  margin-bottom: 10px;
}

.small-text {
  font-size: 14px;
  opacity: 0.7;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .block-selector {
    bottom: 10px;
    gap: 5px;
  }

  .block-item {
    width: 45px;
    height: 45px;
    font-size: 16px;
  }

  .controls-help {
    top: 10px;
    right: 10px;
    padding: 15px;
    max-width: 250px;
    font-size: 12px;
  }

  .help-button {
    top: 10px;
    right: 10px;
    padding: 8px 15px;
    font-size: 12px;
  }

  .lock-notice {
    padding: 20px 30px;
  }

  .lock-notice p {
    font-size: 16px;
  }
}
</style>
