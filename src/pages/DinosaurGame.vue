<template>
  <div class="game-container">
    <div class="game-header">
      <router-link to="/" class="back-button">← 返回首页</router-link>
      <h1>小恐龙跳跃游戏</h1>
    </div>

    <div class="game-info">
      <div class="score">得分: {{ score }}</div>
      <div class="high-score">最高分: {{ highScore }}</div>
      <div v-if="!gameStarted && !gameOver" class="instruction">按空格键或点击开始游戏</div>
      <div v-if="gameOver" class="game-over-text">游戏结束！按空格键或点击重新开始</div>
    </div>

    <canvas
      ref="gameCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @click="handleAction"
      tabindex="0"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const gameCanvas = ref(null);
const canvasWidth = 800;
const canvasHeight = 200;

// 游戏状态
const gameStarted = ref(false);
const gameOver = ref(false);
const score = ref(0);
const highScore = ref(parseInt(localStorage.getItem('dinoHighScore') || '0'));

// 游戏对象
let ctx = null;
let animationId = null;

// 恐龙
const dino = {
  x: 50,
  y: 150,
  width: 40,
  height: 50,
  velocityY: 0,
  jumping: false
};

// 障碍物
let obstacles = [];
let obstacleTimer = 0;
const obstacleInterval = 100; // 每100帧生成一个障碍物

// 游戏参数
const gravity = 0.6;
const jumpForce = -12;
const groundY = 150;
const gameSpeed = 5;

// 初始化游戏
const initGame = () => {
  const canvas = gameCanvas.value;
  if (!canvas) return;

  ctx = canvas.getContext('2d');

  // 重置游戏状态
  dino.y = groundY;
  dino.velocityY = 0;
  dino.jumping = false;
  obstacles = [];
  obstacleTimer = 0;
  score.value = 0;
  gameStarted.value = false;
  gameOver.value = false;

  drawGame();
};

// 绘制游戏
const drawGame = () => {
  if (!ctx) return;

  // 清空画布
  ctx.fillStyle = '#f7f7f7';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 绘制地面
  ctx.strokeStyle = '#535353';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY + dino.height);
  ctx.lineTo(canvasWidth, groundY + dino.height);
  ctx.stroke();

  // 绘制恐龙
  ctx.fillStyle = '#535353';
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

  // 绘制恐龙眼睛
  ctx.fillStyle = '#fff';
  ctx.fillRect(dino.x + 25, dino.y + 10, 8, 8);

  // 绘制恐龙腿（简单动画）
  const legOffset = Math.floor(Date.now() / 100) % 2 === 0 ? 0 : 5;
  ctx.fillStyle = '#535353';
  ctx.fillRect(dino.x + 10, dino.y + dino.height, 8, 10 + legOffset);
  ctx.fillRect(dino.x + 25, dino.y + dino.height, 8, 10 - legOffset);

  // 绘制障碍物
  ctx.fillStyle = '#535353';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  // 绘制云朵（装饰）
  drawCloud(150, 30);
  drawCloud(400, 50);
  drawCloud(650, 40);
};

// 绘制云朵
const drawCloud = (x, y) => {
  if (!ctx) return;
  ctx.fillStyle = '#ccc';
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.arc(x + 20, y, 20, 0, Math.PI * 2);
  ctx.arc(x + 40, y, 15, 0, Math.PI * 2);
  ctx.fill();
};

// 跳跃
const jump = () => {
  if (!dino.jumping && dino.y === groundY) {
    dino.velocityY = jumpForce;
    dino.jumping = true;
  }
};

// 更新游戏
const updateGame = () => {
  if (!gameStarted.value || gameOver.value) return;

  // 更新恐龙位置
  dino.velocityY += gravity;
  dino.y += dino.velocityY;

  // 限制恐龙在地面上
  if (dino.y > groundY) {
    dino.y = groundY;
    dino.velocityY = 0;
    dino.jumping = false;
  }

  // 生成障碍物
  obstacleTimer++;
  if (obstacleTimer > obstacleInterval) {
    obstacles.push({
      x: canvasWidth,
      y: groundY + 20,
      width: 20,
      height: 30
    });
    obstacleTimer = 0;
  }

  // 更新障碍物位置
  obstacles = obstacles.filter(obstacle => {
    obstacle.x -= gameSpeed;

    // 移除屏幕外的障碍物
    if (obstacle.x + obstacle.width < 0) {
      score.value += 10;
      return false;
    }

    return true;
  });

  // 碰撞检测
  obstacles.forEach(obstacle => {
    if (
      dino.x < obstacle.x + obstacle.width &&
      dino.x + dino.width > obstacle.x &&
      dino.y < obstacle.y + obstacle.height &&
      dino.y + dino.height > obstacle.y
    ) {
      endGame();
    }
  });

  // 更新最高分
  if (score.value > highScore.value) {
    highScore.value = score.value;
    localStorage.setItem('dinoHighScore', highScore.value.toString());
  }
};

// 游戏循环
const gameLoop = () => {
  updateGame();
  drawGame();
  animationId = requestAnimationFrame(gameLoop);
};

// 开始游戏
const startGame = () => {
  if (gameOver.value) {
    initGame();
  }
  gameStarted.value = true;
  gameOver.value = false;
};

// 结束游戏
const endGame = () => {
  gameOver.value = true;
  gameStarted.value = false;
};

// 处理动作（跳跃或开始游戏）
const handleAction = () => {
  if (!gameStarted.value) {
    startGame();
  } else if (!gameOver.value) {
    jump();
  } else {
    startGame();
  }
};

// 键盘事件
const handleKeyPress = (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    handleAction();
  }
};

// 生命周期
onMounted(() => {
  initGame();
  gameLoop();
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.game-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #87ceeb 0%, #f7f7f7 100%);
  padding: 20px;
}

.game-header {
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-button {
  padding: 10px 20px;
  background-color: #4e6ef2;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #4662D9;
}

.game-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.game-info {
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.score,
.high-score {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.instruction,
.game-over-text {
  font-size: 16px;
  color: #ff6b00;
  font-weight: bold;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

canvas {
  border: 3px solid #333;
  border-radius: 8px;
  background-color: #f7f7f7;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

canvas:focus {
  outline: none;
}

@media (max-width: 850px) {
  canvas {
    width: 100%;
    height: auto;
  }

  .game-header h1 {
    font-size: 20px;
  }

  .game-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
