<template>
  <div class="chrome-error-page">
    <div class="error-content">
      <div class="error-icon">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="#9aa0a6" stroke-width="3"/>
          <path d="M 25 40 L 55 40 M 40 25 L 40 55" stroke="#9aa0a6" stroke-width="3" stroke-linecap="round"/>
        </svg>
      </div>
      <h1>无法访问此网站</h1>
      <p class="error-code">ERR_INTERNET_DISCONNECTED</p>
      <ul class="suggestions">
        <li>检查网络连接</li>
        <li>检查代理服务器和防火墙</li>
        <li>运行 Windows 网络诊断</li>
      </ul>
      <button @click="reloadPage" class="reload-button">重新加载</button>

      <div class="game-hint">
        按空格键开始游戏
      </div>

      <!-- 恐龙游戏 -->
      <div class="dino-game" ref="gameContainer" tabindex="0" @keydown="handleKeyDown">
        <canvas ref="canvas" width="600" height="150"></canvas>
        <div v-if="gameOver" class="game-over">
          <p>游戏结束！</p>
          <p>分数: {{ score }}</p>
          <button @click="restartGame">重新开始</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
const gameContainer = ref(null);
const gameStarted = ref(false);
const gameOver = ref(false);
const score = ref(0);

let ctx = null;
let animationId = null;

// 游戏对象
const dino = {
  x: 50,
  y: 100,
  width: 20,
  height: 40,
  jumping: false,
  velocityY: 0,
  gravity: 0.6
};

const obstacles = [];
let frameCount = 0;
let gameSpeed = 5;

const reloadPage = () => {
  window.location.reload();
};

const handleKeyDown = (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (!gameStarted.value) {
      startGame();
    } else if (!gameOver.value && !dino.jumping) {
      jump();
    } else if (gameOver.value) {
      restartGame();
    }
  }
};

const jump = () => {
  if (!dino.jumping) {
    dino.jumping = true;
    dino.velocityY = -12;
  }
};

const startGame = () => {
  gameStarted.value = true;
  gameOver.value = false;
  score.value = 0;
  obstacles.length = 0;
  frameCount = 0;
  gameSpeed = 5;
  dino.y = 100;
  dino.jumping = false;
  dino.velocityY = 0;
  gameLoop();
};

const restartGame = () => {
  gameOver.value = false;
  startGame();
};

const drawDino = () => {
  ctx.fillStyle = '#535353';
  // 身体
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
  // 头
  ctx.fillRect(dino.x, dino.y - 10, dino.width, 10);
  // 眼睛
  ctx.fillStyle = '#fff';
  ctx.fillRect(dino.x + 12, dino.y - 7, 3, 3);
  // 腿
  ctx.fillStyle = '#535353';
  if (Math.floor(frameCount / 10) % 2 === 0) {
    ctx.fillRect(dino.x + 3, dino.y + dino.height, 5, 10);
    ctx.fillRect(dino.x + 12, dino.y + dino.height, 5, 10);
  } else {
    ctx.fillRect(dino.x + 5, dino.y + dino.height, 5, 10);
    ctx.fillRect(dino.x + 10, dino.y + dino.height, 5, 10);
  }
};

const drawObstacle = (obstacle) => {
  ctx.fillStyle = '#535353';
  // 仙人掌
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  ctx.fillRect(obstacle.x + 5, obstacle.y - 10, 5, 10);
  ctx.fillRect(obstacle.x + obstacle.width - 10, obstacle.y - 8, 5, 8);
};

const updateDino = () => {
  if (dino.jumping) {
    dino.velocityY += dino.gravity;
    dino.y += dino.velocityY;

    if (dino.y >= 100) {
      dino.y = 100;
      dino.jumping = false;
      dino.velocityY = 0;
    }
  }
};

const updateObstacles = () => {
  // 生成新障碍物
  if (frameCount % 100 === 0) {
    obstacles.push({
      x: 600,
      y: 110,
      width: 15,
      height: 30
    });
  }

  // 更新障碍物位置
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= gameSpeed;

    // 移除屏幕外的障碍物
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score.value += 10;
      // 增加难度
      if (score.value % 100 === 0) {
        gameSpeed += 0.5;
      }
    }
  }
};

const checkCollision = () => {
  for (let obstacle of obstacles) {
    if (
      dino.x < obstacle.x + obstacle.width &&
      dino.x + dino.width > obstacle.x &&
      dino.y < obstacle.y + obstacle.height &&
      dino.y + dino.height > obstacle.y
    ) {
      return true;
    }
  }
  return false;
};

const drawGround = () => {
  ctx.strokeStyle = '#535353';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 145);
  ctx.lineTo(600, 145);
  ctx.stroke();
};

const drawScore = () => {
  ctx.fillStyle = '#535353';
  ctx.font = '16px Arial';
  ctx.fillText(`分数: ${score.value}`, 500, 30);
};

const gameLoop = () => {
  if (gameOver.value) {
    return;
  }

  // 清空画布
  ctx.clearRect(0, 0, 600, 150);

  // 绘制地面
  drawGround();

  // 更新和绘制恐龙
  updateDino();
  drawDino();

  // 更新和绘制障碍物
  updateObstacles();
  obstacles.forEach(drawObstacle);

  // 绘制分数
  drawScore();

  // 检查碰撞
  if (checkCollision()) {
    gameOver.value = true;
    return;
  }

  frameCount++;
  animationId = requestAnimationFrame(gameLoop);
};

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
  }
  if (gameContainer.value) {
    gameContainer.value.focus();
  }
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style scoped>
.chrome-error-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.error-content {
  text-align: center;
  max-width: 600px;
  padding: 20px;
}

.error-icon {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

h1 {
  font-size: 24px;
  font-weight: 400;
  color: #202124;
  margin-bottom: 10px;
}

.error-code {
  color: #5f6368;
  font-size: 14px;
  margin-bottom: 30px;
}

.suggestions {
  text-align: left;
  color: #5f6368;
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 30px;
  padding-left: 20px;
}

.suggestions li {
  margin-bottom: 8px;
}

.reload-button {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reload-button:hover {
  background-color: #1557b0;
}

.game-hint {
  margin-top: 40px;
  margin-bottom: 10px;
  color: #9aa0a6;
  font-size: 12px;
}

.dino-game {
  margin-top: 20px;
  position: relative;
  display: inline-block;
  outline: none;
}

canvas {
  border: 1px solid #e0e0e0;
  display: block;
  background-color: #fff;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.game-over p {
  margin: 10px 0;
  color: #202124;
  font-size: 18px;
}

.game-over button {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 8px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.2s;
}

.game-over button:hover {
  background-color: #1557b0;
}

@media (max-width: 768px) {
  canvas {
    width: 100%;
    height: auto;
  }

  .error-content {
    padding: 10px;
  }
}
</style>
