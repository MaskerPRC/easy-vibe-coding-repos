<template>
  <div class="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-content">
        <h1 class="logo">贪吃蛇游戏</h1>
        <div class="nav-buttons">
          <button @click="showLeaderboard = !showLeaderboard" class="nav-btn">
            <span class="btn-icon">🏆</span>
            <span>排行榜</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主游戏区域 -->
    <div class="main-container">
      <div class="game-area">
        <!-- 游戏信息卡片 -->
        <div class="info-card">
          <div class="info-item">
            <span class="info-label">分数</span>
            <span class="info-value">{{ score }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">最高分</span>
            <span class="info-value">{{ highScore }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">等级</span>
            <span class="info-value">{{ level }}</span>
          </div>
        </div>

        <!-- 游戏画布卡片 -->
        <div class="game-card">
          <canvas
            ref="gameCanvas"
            :width="canvasWidth"
            :height="canvasHeight"
            @click="handleCanvasClick"
          ></canvas>

          <!-- 游戏暂停/结束遮罩 -->
          <div v-if="gameState !== 'playing'" class="game-overlay">
            <div class="overlay-content">
              <h2 class="overlay-title">{{ overlayTitle }}</h2>
              <p class="overlay-text">{{ overlayText }}</p>
              <button @click="startGame" class="primary-btn">
                {{ gameState === 'ready' ? '开始游戏' : '重新开始' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 游戏控制说明卡片 -->
        <div class="control-card">
          <h3 class="control-title">游戏控制</h3>
          <div class="control-grid">
            <div class="control-item">
              <span class="control-key">↑ ↓ ← →</span>
              <span class="control-desc">方向键移动</span>
            </div>
            <div class="control-item">
              <span class="control-key">空格</span>
              <span class="control-desc">暂停/继续</span>
            </div>
            <div class="control-item">
              <span class="control-key">移动端</span>
              <span class="control-desc">触摸滑动</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 排行榜侧边栏 -->
      <transition name="slide">
        <div v-if="showLeaderboard" class="leaderboard-sidebar">
          <div class="leaderboard-header">
            <h2 class="leaderboard-title">排行榜</h2>
            <button @click="showLeaderboard = false" class="close-btn">×</button>
          </div>
          <div class="leaderboard-content">
            <div v-if="leaderboard.length === 0" class="empty-state">
              暂无记录
            </div>
            <div v-else class="leaderboard-list">
              <div
                v-for="(entry, index) in leaderboard"
                :key="index"
                class="leaderboard-item"
                :class="{ 'top-rank': index < 3 }"
              >
                <span class="rank">{{ index + 1 }}</span>
                <span class="player-name">{{ entry.name }}</span>
                <span class="player-score">{{ entry.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 虚拟方向键（移动端） -->
    <div v-if="isMobile" class="virtual-controls">
      <button @click="changeDirection('up')" class="virtual-btn btn-up">↑</button>
      <button @click="changeDirection('left')" class="virtual-btn btn-left">←</button>
      <button @click="changeDirection('down')" class="virtual-btn btn-down">↓</button>
      <button @click="changeDirection('right')" class="virtual-btn btn-right">→</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';

// 游戏状态
const gameState = ref('ready'); // ready, playing, paused, gameover
const score = ref(0);
const highScore = ref(0);
const level = ref(1);
const showLeaderboard = ref(false);
const leaderboard = ref([]);

// 画布配置
const gameCanvas = ref(null);
const canvasWidth = 600;
const canvasHeight = 600;
const gridSize = 20;
const gridCount = canvasWidth / gridSize;

// 游戏数据
let snake = [];
let food = null;
let direction = 'right';
let nextDirection = 'right';
let gameLoop = null;
let touchStartX = 0;
let touchStartY = 0;

// 移动端检测
const isMobile = ref(false);

// 覆盖层文本
const overlayTitle = computed(() => {
  if (gameState.value === 'ready') return '贪吃蛇';
  if (gameState.value === 'paused') return '游戏暂停';
  if (gameState.value === 'gameover') return '游戏结束';
  return '';
});

const overlayText = computed(() => {
  if (gameState.value === 'ready') return '使用方向键控制蛇的移动，吃到食物获得分数';
  if (gameState.value === 'paused') return '按空格键继续游戏';
  if (gameState.value === 'gameover') return `您的得分：${score.value}`;
  return '';
});

// 初始化游戏
const initGame = () => {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  direction = 'right';
  nextDirection = 'right';
  score.value = 0;
  level.value = 1;
  spawnFood();
};

// 生成食物
const spawnFood = () => {
  while (true) {
    food = {
      x: Math.floor(Math.random() * gridCount),
      y: Math.floor(Math.random() * gridCount)
    };

    // 确保食物不在蛇身上
    const onSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
    if (!onSnake) break;
  }
};

// 开始游戏
const startGame = () => {
  initGame();
  gameState.value = 'playing';

  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(update, 150 - (level.value - 1) * 10);
};

// 游戏更新
const update = () => {
  if (gameState.value !== 'playing') return;

  direction = nextDirection;

  // 计算新头部位置
  const head = { ...snake[0] };

  switch (direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }

  // 检查碰撞
  if (checkCollision(head)) {
    gameOver();
    return;
  }

  // 添加新头部
  snake.unshift(head);

  // 检查是否吃到食物
  if (head.x === food.x && head.y === food.y) {
    score.value += 10;
    level.value = Math.floor(score.value / 50) + 1;
    spawnFood();

    // 更新游戏速度
    if (gameLoop) {
      clearInterval(gameLoop);
      gameLoop = setInterval(update, 150 - (level.value - 1) * 10);
    }
  } else {
    // 移除尾部
    snake.pop();
  }

  draw();
};

// 检查碰撞
const checkCollision = (head) => {
  // 检查墙壁
  if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
    return true;
  }

  // 检查自身
  return snake.some(segment => segment.x === head.x && segment.y === head.y);
};

// 游戏结束
const gameOver = async () => {
  gameState.value = 'gameover';
  if (gameLoop) clearInterval(gameLoop);

  // 更新最高分
  if (score.value > highScore.value) {
    highScore.value = score.value;
  }

  // 提交分数
  try {
    await axios.post('/api/leaderboard', {
      name: '玩家',
      score: score.value
    });
    await loadLeaderboard();
  } catch (error) {
    console.error('提交分数失败:', error);
  }
};

// 绘制游戏
const draw = () => {
  const canvas = gameCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // 清空画布
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 绘制网格线（可选）
  ctx.strokeStyle = '#34495E';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= gridCount; i++) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvasHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvasWidth, i * gridSize);
    ctx.stroke();
  }

  // 绘制食物
  if (food) {
    ctx.fillStyle = '#F27979';
    ctx.shadowColor = '#F27979';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
      food.x * gridSize + gridSize / 2,
      food.y * gridSize + gridSize / 2,
      gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 绘制蛇
  snake.forEach((segment, index) => {
    if (index === 0) {
      // 蛇头
      ctx.fillStyle = '#E8D5B5';
      ctx.shadowColor = '#E8D5B5';
      ctx.shadowBlur = 8;
    } else {
      // 蛇身
      ctx.fillStyle = '#6A8EAE';
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.roundRect(
      segment.x * gridSize + 1,
      segment.y * gridSize + 1,
      gridSize - 2,
      gridSize - 2,
      4
    );
    ctx.fill();
  });

  ctx.shadowBlur = 0;
};

// 方向改变
const changeDirection = (newDirection) => {
  const opposites = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };

  if (opposites[newDirection] !== direction) {
    nextDirection = newDirection;
  }
};

// 键盘事件
const handleKeyDown = (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (gameState.value === 'playing') {
      gameState.value = 'paused';
    } else if (gameState.value === 'paused') {
      gameState.value = 'playing';
    }
    return;
  }

  if (gameState.value !== 'playing') return;

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      changeDirection('up');
      break;
    case 'ArrowDown':
      e.preventDefault();
      changeDirection('down');
      break;
    case 'ArrowLeft':
      e.preventDefault();
      changeDirection('left');
      break;
    case 'ArrowRight':
      e.preventDefault();
      changeDirection('right');
      break;
  }
};

// 触摸事件
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

const handleTouchEnd = (e) => {
  if (gameState.value !== 'playing') return;

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // 水平滑动
    if (deltaX > 30) {
      changeDirection('right');
    } else if (deltaX < -30) {
      changeDirection('left');
    }
  } else {
    // 垂直滑动
    if (deltaY > 30) {
      changeDirection('down');
    } else if (deltaY < -30) {
      changeDirection('up');
    }
  }
};

// 画布点击
const handleCanvasClick = () => {
  if (gameState.value === 'ready') {
    startGame();
  }
};

// 加载排行榜
const loadLeaderboard = async () => {
  try {
    const response = await axios.get('/api/leaderboard');
    leaderboard.value = response.data;
  } catch (error) {
    console.error('加载排行榜失败:', error);
  }
};

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 生命周期
onMounted(() => {
  initGame();
  draw();
  loadLeaderboard();
  checkMobile();

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  if (gameLoop) clearInterval(gameLoop);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchend', handleTouchEnd);
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: #2C3E50;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #ECF0F1;
}

/* 导航栏 */
.navbar {
  background: rgba(44, 62, 80, 0.95);
  border-bottom: 2px solid #6A8EAE;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #E8D5B5;
  letter-spacing: 2px;
}

.nav-buttons {
  display: flex;
  gap: 16px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #6A8EAE;
  color: #ECF0F1;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #5A7E9E;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(106, 142, 174, 0.4);
}

.btn-icon {
  font-size: 18px;
}

/* 主容器 */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  gap: 24px;
  position: relative;
}

/* 游戏区域 */
.game-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片样式 */
.info-card,
.game-card,
.control-card {
  background: rgba(52, 73, 94, 0.8);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(106, 142, 174, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* 信息卡片 */
.info-card {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: #BDC3C7;
  font-weight: 500;
}

.info-value {
  font-size: 32px;
  font-weight: 700;
  color: #E8D5B5;
  text-shadow: 0 2px 8px rgba(232, 213, 181, 0.3);
}

/* 游戏画布卡片 */
.game-card {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

canvas {
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 62, 80, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.overlay-content {
  text-align: center;
  padding: 32px;
}

.overlay-title {
  font-size: 48px;
  font-weight: 700;
  color: #E8D5B5;
  margin-bottom: 16px;
  text-shadow: 0 4px 16px rgba(232, 213, 181, 0.5);
}

.overlay-text {
  font-size: 18px;
  color: #BDC3C7;
  margin-bottom: 32px;
  line-height: 1.6;
}

.primary-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #6A8EAE, #5A7E9E);
  color: #ECF0F1;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(106, 142, 174, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 24px rgba(106, 142, 174, 0.5);
}

.primary-btn:active {
  transform: translateY(0) scale(0.98);
}

/* 控制说明卡片 */
.control-card {
  padding: 20px;
}

.control-title {
  font-size: 18px;
  font-weight: 600;
  color: #E8D5B5;
  margin-bottom: 16px;
  text-align: center;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(44, 62, 80, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(106, 142, 174, 0.2);
}

.control-key {
  font-size: 14px;
  font-weight: 600;
  color: #A0D2DB;
  padding: 6px 12px;
  background: rgba(160, 210, 219, 0.1);
  border-radius: 6px;
}

.control-desc {
  font-size: 13px;
  color: #BDC3C7;
}

/* 排行榜侧边栏 */
.leaderboard-sidebar {
  width: 320px;
  background: rgba(52, 73, 94, 0.9);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(106, 142, 174, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-height: calc(100vh - 150px);
  overflow-y: auto;
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.leaderboard-title {
  font-size: 22px;
  font-weight: 700;
  color: #E8D5B5;
}

.close-btn {
  width: 32px;
  height: 32px;
  background: rgba(242, 121, 121, 0.2);
  color: #F27979;
  border: none;
  border-radius: 8px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(242, 121, 121, 0.3);
  transform: rotate(90deg);
}

.leaderboard-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #BDC3C7;
  font-size: 14px;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(44, 62, 80, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(106, 142, 174, 0.2);
  transition: all 0.3s ease;
}

.leaderboard-item:hover {
  background: rgba(44, 62, 80, 0.8);
  transform: translateX(4px);
}

.leaderboard-item.top-rank {
  border-color: #E8D5B5;
  background: rgba(232, 213, 181, 0.1);
}

.rank {
  font-size: 18px;
  font-weight: 700;
  color: #E8D5B5;
  min-width: 30px;
}

.top-rank .rank {
  color: #F27979;
}

.player-name {
  flex: 1;
  font-size: 14px;
  color: #ECF0F1;
}

.player-score {
  font-size: 16px;
  font-weight: 600;
  color: #6A8EAE;
}

/* 虚拟方向键 */
.virtual-controls {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: grid;
  grid-template-areas:
    ". up ."
    "left . right"
    ". down .";
  gap: 8px;
  z-index: 50;
}

.virtual-btn {
  width: 56px;
  height: 56px;
  background: rgba(106, 142, 174, 0.9);
  color: #ECF0F1;
  border: 2px solid rgba(232, 213, 181, 0.3);
  border-radius: 12px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.virtual-btn:active {
  transform: scale(0.9);
  background: rgba(90, 126, 158, 0.9);
}

.btn-up { grid-area: up; }
.btn-down { grid-area: down; }
.btn-left { grid-area: left; }
.btn-right { grid-area: right; }

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .leaderboard-sidebar {
    position: fixed;
    right: 0;
    top: 80px;
    bottom: 0;
    width: 300px;
    max-height: none;
    border-radius: 16px 0 0 16px;
    z-index: 90;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 16px;
  }

  .logo {
    font-size: 18px;
  }

  .nav-btn span:not(.btn-icon) {
    display: none;
  }

  canvas {
    max-width: 100%;
    height: auto;
  }

  .info-card {
    flex-direction: row;
    justify-content: space-around;
  }

  .info-value {
    font-size: 24px;
  }

  .overlay-title {
    font-size: 32px;
  }

  .overlay-text {
    font-size: 14px;
  }

  .control-grid {
    grid-template-columns: 1fr;
  }

  .leaderboard-sidebar {
    width: 280px;
  }

  .virtual-controls {
    bottom: 16px;
    right: 16px;
  }

  .virtual-btn {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .nav-content {
    padding: 0 16px;
  }

  .info-label {
    font-size: 12px;
  }

  .info-value {
    font-size: 20px;
  }

  .overlay-title {
    font-size: 28px;
  }

  .control-card {
    padding: 16px;
  }

  .control-title {
    font-size: 16px;
  }
}

/* 滚动条样式 */
.leaderboard-sidebar::-webkit-scrollbar {
  width: 6px;
}

.leaderboard-sidebar::-webkit-scrollbar-track {
  background: rgba(44, 62, 80, 0.5);
  border-radius: 3px;
}

.leaderboard-sidebar::-webkit-scrollbar-thumb {
  background: rgba(106, 142, 174, 0.6);
  border-radius: 3px;
}

.leaderboard-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(106, 142, 174, 0.8);
}
</style>
