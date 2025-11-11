import { ref } from 'vue'
import { clamp } from '@/utils/gameUtils'

/**
 * 游戏控制系统
 */
export function useGameControls(canvasRef) {
  const keys = {}
  let mouseX = 0
  let mouseY = 0
  const pointerLocked = ref(false)

  // 锁定指针
  const lockPointer = () => {
    canvasRef.value?.requestPointerLock()
  }

  // 解锁指针
  const unlockPointer = () => {
    document.exitPointerLock()
  }

  // 指针锁定状态改变
  const handlePointerLockChange = () => {
    pointerLocked.value = document.pointerLockElement === canvasRef.value
  }

  // 键盘按下
  const handleKeyDown = (e, callbacks = {}) => {
    keys[e.key] = true

    // ESC - 暂停
    if (e.key === 'Escape' && callbacks.onPause) {
      callbacks.onPause()
    }

    // R - 装弹
    if ((e.key === 'r' || e.key === 'R') && callbacks.onReload) {
      callbacks.onReload()
    }

    // 1-3 - 切换武器
    if (e.key >= '1' && e.key <= '3' && callbacks.onSwitchWeapon) {
      callbacks.onSwitchWeapon(parseInt(e.key) - 1)
    }
  }

  // 键盘抬起
  const handleKeyUp = (e) => {
    keys[e.key] = false
  }

  // 鼠标移动
  const handleMouseMove = (e) => {
    if (pointerLocked.value) {
      mouseX += e.movementX
      mouseY += e.movementY
    }
  }

  // 鼠标点击
  const handleClick = (callbacks = {}) => {
    if (pointerLocked.value && callbacks.onShoot) {
      callbacks.onShoot()
    }
  }

  // 更新玩家旋转
  const updatePlayerRotation = (currentRotation, currentPitch, sensitivity = 1.0) => {
    if (!pointerLocked.value) {
      return { rotation: currentRotation, pitch: currentPitch }
    }

    const newRotation = currentRotation + mouseX * 0.002 * sensitivity
    const newPitch = clamp(
      currentPitch + mouseY * 0.002 * sensitivity,
      -Math.PI / 2,
      Math.PI / 2
    )

    // 重置鼠标增量
    mouseX = 0
    mouseY = 0

    return { rotation: newRotation, pitch: newPitch }
  }

  // 更新玩家位置
  const updatePlayerMovement = (currentX, currentZ, rotation) => {
    const moveSpeed = 0.5
    let moveX = 0
    let moveZ = 0

    if (keys['w'] || keys['W']) {
      moveZ -= Math.cos(rotation) * moveSpeed
      moveX -= Math.sin(rotation) * moveSpeed
    }
    if (keys['s'] || keys['S']) {
      moveZ += Math.cos(rotation) * moveSpeed
      moveX += Math.sin(rotation) * moveSpeed
    }
    if (keys['a'] || keys['A']) {
      moveX -= Math.sin(rotation - Math.PI / 2) * moveSpeed
      moveZ -= Math.cos(rotation - Math.PI / 2) * moveSpeed
    }
    if (keys['d'] || keys['D']) {
      moveX -= Math.sin(rotation + Math.PI / 2) * moveSpeed
      moveZ -= Math.cos(rotation + Math.PI / 2) * moveSpeed
    }

    // 应用边界限制
    const newX = clamp(currentX + moveX, 5, 95)
    const newZ = clamp(currentZ + moveZ, 5, 95)

    return { x: newX, z: newZ }
  }

  // 注册事件监听器
  const registerEventListeners = (callbacks = {}) => {
    document.addEventListener('keydown', (e) => handleKeyDown(e, callbacks))
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', () => handleClick(callbacks))
    document.addEventListener('pointerlockchange', handlePointerLockChange)
  }

  // 移除事件监听器
  const removeEventListeners = (callbacks = {}) => {
    document.removeEventListener('keydown', (e) => handleKeyDown(e, callbacks))
    document.removeEventListener('keyup', handleKeyUp)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('click', () => handleClick(callbacks))
    document.removeEventListener('pointerlockchange', handlePointerLockChange)
  }

  return {
    pointerLocked,
    lockPointer,
    unlockPointer,
    updatePlayerRotation,
    updatePlayerMovement,
    registerEventListeners,
    removeEventListeners
  }
}
