<template>
  <div class="app">
    <div class="game-container">
      <div class="game-info">
        <h1>飞机游戏</h1>
        <p>使用方向键 ↑ ↓ ← → 控制飞机移动</p>
      </div>
      <div class="game-area" ref="gameAreaRef">
        <div
          class="plane"
          :style="{
            left: planePosition.x + 'px',
            top: planePosition.y + 'px'
          }"
        >
          ✈️
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 游戏区域引用
const gameAreaRef = ref(null)

// 飞机位置（像素）
const planePosition = ref({
  x: 300, // 初始x坐标
  y: 250  // 初始y坐标
})

// 移动速度（像素/次）
const moveSpeed = 20

// 飞机尺寸
const planeSize = { width: 40, height: 40 }

// 键盘事件处理
const handleKeyDown = (event) => {
  // 防止默认行为（如页面滚动）
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
  }

  if (!gameAreaRef.value) return

  const gameRect = gameAreaRef.value.getBoundingClientRect()
  const maxX = gameRect.width - planeSize.width
  const maxY = gameRect.height - planeSize.height

  // 根据按键更新位置
  switch (event.key) {
    case 'ArrowUp':
      // 向上移动
      planePosition.value.y = Math.max(0, planePosition.value.y - moveSpeed)
      break
    case 'ArrowDown':
      // 向下移动
      planePosition.value.y = Math.min(maxY, planePosition.value.y + moveSpeed)
      break
    case 'ArrowLeft':
      // 向左移动
      planePosition.value.x = Math.max(0, planePosition.value.x - moveSpeed)
      break
    case 'ArrowRight':
      // 向右移动
      planePosition.value.x = Math.min(maxX, planePosition.value.x + moveSpeed)
      break
  }
}

// 组件挂载时添加键盘监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

// 组件卸载时移除键盘监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e3a8a, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.game-container {
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.game-info {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.game-info h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 10px;
}

.game-info p {
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
}

.game-area {
  width: 100%;
  height: 500px;
  background: linear-gradient(to bottom, #bae6fd, #e0f2fe);
  border: 3px solid #0284c7;
  border-radius: 0 0 10px 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.plane {
  position: absolute;
  width: 40px;
  height: 40px;
  font-size: 32px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.plane:hover {
  transform: scale(1.1);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .game-container {
    max-width: 100%;
  }

  .game-info {
    padding: 15px;
  }

  .game-info h1 {
    font-size: 22px;
    margin-bottom: 8px;
  }

  .game-info p {
    font-size: 14px;
  }

  .game-area {
    height: 400px;
  }

  .plane {
    width: 35px;
    height: 35px;
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .app {
    padding: 10px;
  }

  .game-info {
    padding: 12px;
  }

  .game-info h1 {
    font-size: 18px;
  }

  .game-info p {
    font-size: 12px;
  }

  .game-area {
    height: 350px;
  }

  .plane {
    width: 30px;
    height: 30px;
    font-size: 24px;
  }
}
</style>

