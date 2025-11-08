<template>
  <div class="doom-game">
    <div class="game-container">
      <canvas ref="gameCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>

      <div class="game-ui">
        <div class="health-bar">
          <div class="health-label">HEALTH</div>
          <div class="health-value">{{ player.health }}%</div>
          <div class="bar">
            <div class="bar-fill health" :style="{ width: player.health + '%' }"></div>
          </div>
        </div>

        <div class="ammo-counter">
          <div class="ammo-label">AMMO</div>
          <div class="ammo-value">{{ player.ammo }}</div>
        </div>

        <div class="crosshair">+</div>
      </div>

      <div v-if="!gameStarted" class="start-screen">
        <h1 class="game-title">DOOM</h1>
        <p class="game-subtitle">Web Edition</p>
        <button @click="startGame" class="start-button">START GAME</button>
        <div class="controls-info">
          <p><strong>Controls:</strong></p>
          <p>WASD - Move</p>
          <p>Arrow Keys - Look Around</p>
          <p>Space - Shoot</p>
          <p>ESC - Pause</p>
        </div>
      </div>

      <div v-if="gamePaused && gameStarted" class="pause-screen">
        <h2>PAUSED</h2>
        <button @click="resumeGame" class="resume-button">Resume</button>
        <button @click="resetGame" class="reset-button">Restart</button>
      </div>

      <div v-if="gameOver" class="game-over-screen">
        <h2>GAME OVER</h2>
        <p>You were defeated!</p>
        <button @click="resetGame" class="restart-button">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const gameCanvas = ref(null);
const canvasWidth = 800;
const canvasHeight = 600;
const gameStarted = ref(false);
const gamePaused = ref(false);
const gameOver = ref(false);

let ctx = null;
let animationId = null;

// 玩家数据
const player = ref({
  x: 300,
  y: 300,
  angle: 0,
  health: 100,
  ammo: 50,
  speed: 2,
  rotationSpeed: 0.05
});

// 游戏地图 (1 = 墙, 0 = 空)
const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const TILE_SIZE = 64;
const FOV = Math.PI / 3;
const NUM_RAYS = canvasWidth / 2;
const MAX_DEPTH = 800;

// 敌人列表
const enemies = ref([
  { x: 400, y: 400, health: 100, alive: true },
  { x: 600, y: 200, health: 100, alive: true },
  { x: 200, y: 500, health: 100, alive: true }
]);

// 射击效果
const shots = ref([]);

// 键盘状态
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
  Space: false
};

// 光线投射函数
function castRay(angle) {
  let x = player.value.x;
  let y = player.value.y;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);

  let distance = 0;
  let hitWall = false;
  let wallType = 0;

  while (!hitWall && distance < MAX_DEPTH) {
    distance += 1;
    x += dx;
    y += dy;

    const mapX = Math.floor(x / TILE_SIZE);
    const mapY = Math.floor(y / TILE_SIZE);

    if (mapX < 0 || mapX >= map[0].length || mapY < 0 || mapY >= map.length) {
      hitWall = true;
      wallType = 1;
    } else if (map[mapY][mapX] === 1) {
      hitWall = true;
      wallType = 1;
    }
  }

  return { distance, wallType };
}

// 渲染 3D 场景
function render3D() {
  if (!ctx) return;

  // 清空画布
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 绘制天花板
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight / 2);

  // 绘制地板
  ctx.fillStyle = '#555';
  ctx.fillRect(0, canvasHeight / 2, canvasWidth, canvasHeight / 2);

  // 投射光线
  for (let i = 0; i < NUM_RAYS; i++) {
    const rayAngle = player.value.angle - FOV / 2 + (i / NUM_RAYS) * FOV;
    const ray = castRay(rayAngle);

    // 修正鱼眼效果
    const correctedDistance = ray.distance * Math.cos(rayAngle - player.value.angle);

    // 计算墙的高度
    const wallHeight = (TILE_SIZE * canvasHeight) / (correctedDistance + 0.0001);

    // 根据距离调整颜色（深度着色）
    const brightness = Math.max(0, 1 - correctedDistance / MAX_DEPTH);
    const color = Math.floor(brightness * 200);

    // 绘制墙条
    ctx.fillStyle = `rgb(${color}, ${color * 0.5}, ${color * 0.3})`;
    const wallTop = (canvasHeight - wallHeight) / 2;
    ctx.fillRect(i * 2, wallTop, 2, wallHeight);
  }

  // 绘制敌人
  renderEnemies();

  // 绘制射击效果
  renderShots();
}

// 渲染敌人
function renderEnemies() {
  enemies.value.forEach(enemy => {
    if (!enemy.alive) return;

    // 计算敌人相对于玩家的角度和距离
    const dx = enemy.x - player.value.x;
    const dy = enemy.y - player.value.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) - player.value.angle;

    // 确保角度在 -π 到 π 之间
    let normalizedAngle = angle;
    while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
    while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;

    // 检查敌人是否在视野内
    if (Math.abs(normalizedAngle) < FOV / 2 && distance < MAX_DEPTH) {
      // 计算敌人在屏幕上的位置
      const screenX = (normalizedAngle / FOV + 0.5) * canvasWidth;
      const enemyHeight = (TILE_SIZE * canvasHeight) / (distance + 0.0001);
      const enemyWidth = enemyHeight;

      // 绘制敌人（简单的红色矩形）
      const brightness = Math.max(0, 1 - distance / MAX_DEPTH);
      ctx.fillStyle = `rgba(255, 0, 0, ${brightness})`;
      ctx.fillRect(
        screenX - enemyWidth / 2,
        canvasHeight / 2 - enemyHeight / 2,
        enemyWidth,
        enemyHeight
      );
    }
  });
}

// 渲染射击效果
function renderShots() {
  shots.value = shots.value.filter(shot => shot.time > 0);
  shots.value.forEach(shot => {
    const alpha = shot.time / 10;
    ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    shot.time--;
  });
}

// 移动玩家
function movePlayer() {
  const moveSpeed = player.value.speed;
  let newX = player.value.x;
  let newY = player.value.y;

  // 前进/后退
  if (keys.w || keys.ArrowUp) {
    newX += Math.cos(player.value.angle) * moveSpeed;
    newY += Math.sin(player.value.angle) * moveSpeed;
  }
  if (keys.s || keys.ArrowDown) {
    newX -= Math.cos(player.value.angle) * moveSpeed;
    newY -= Math.sin(player.value.angle) * moveSpeed;
  }

  // 左右平移
  if (keys.a) {
    newX += Math.cos(player.value.angle - Math.PI / 2) * moveSpeed;
    newY += Math.sin(player.value.angle - Math.PI / 2) * moveSpeed;
  }
  if (keys.d) {
    newX += Math.cos(player.value.angle + Math.PI / 2) * moveSpeed;
    newY += Math.sin(player.value.angle + Math.PI / 2) * moveSpeed;
  }

  // 碰撞检测
  const mapX = Math.floor(newX / TILE_SIZE);
  const mapY = Math.floor(newY / TILE_SIZE);

  if (mapX >= 0 && mapX < map[0].length && mapY >= 0 && mapY < map.length) {
    if (map[mapY][mapX] === 0) {
      player.value.x = newX;
      player.value.y = newY;
    }
  }

  // 旋转
  if (keys.ArrowLeft) {
    player.value.angle -= player.value.rotationSpeed;
  }
  if (keys.ArrowRight) {
    player.value.angle += player.value.rotationSpeed;
  }

  // 射击
  if (keys.Space && player.value.ammo > 0) {
    shoot();
    keys.Space = false; // 防止连发
  }
}

// 射击
function shoot() {
  player.value.ammo--;
  shots.value.push({ time: 10 });

  // 检测是否击中敌人
  enemies.value.forEach(enemy => {
    if (!enemy.alive) return;

    const dx = enemy.x - player.value.x;
    const dy = enemy.y - player.value.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) - player.value.angle;

    let normalizedAngle = angle;
    while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
    while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;

    // 如果敌人在准星附近
    if (Math.abs(normalizedAngle) < 0.1 && distance < MAX_DEPTH) {
      enemy.health -= 50;
      if (enemy.health <= 0) {
        enemy.alive = false;
      }
    }
  });
}

// 游戏循环
function gameLoop() {
  if (!gamePaused.value && !gameOver.value) {
    movePlayer();
    render3D();

    // 检查游戏结束条件
    if (player.value.health <= 0) {
      gameOver.value = true;
    }
  }

  animationId = requestAnimationFrame(gameLoop);
}

// 键盘事件
function handleKeyDown(e) {
  if (e.key === 'Escape') {
    gamePaused.value = !gamePaused.value;
  }
  if (e.key in keys || e.key === ' ') {
    e.preventDefault();
    if (e.key === ' ') {
      keys.Space = true;
    } else {
      keys[e.key] = true;
    }
  }
}

function handleKeyUp(e) {
  if (e.key in keys || e.key === ' ') {
    if (e.key === ' ') {
      keys.Space = false;
    } else {
      keys[e.key] = false;
    }
  }
}

// 开始游戏
function startGame() {
  gameStarted.value = true;
  gamePaused.value = false;
  gameLoop();
}

// 恢复游戏
function resumeGame() {
  gamePaused.value = false;
}

// 重置游戏
function resetGame() {
  player.value = {
    x: 300,
    y: 300,
    angle: 0,
    health: 100,
    ammo: 50,
    speed: 2,
    rotationSpeed: 0.05
  };

  enemies.value = [
    { x: 400, y: 400, health: 100, alive: true },
    { x: 600, y: 200, health: 100, alive: true },
    { x: 200, y: 500, health: 100, alive: true }
  ];

  shots.value = [];
  gameOver.value = false;
  gamePaused.value = false;

  if (!gameStarted.value) {
    startGame();
  }
}

onMounted(() => {
  ctx = gameCanvas.value.getContext('2d');
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style scoped>
.doom-game {
  min-height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', monospace;
}

.game-container {
  position: relative;
  display: inline-block;
}

canvas {
  display: block;
  border: 4px solid #8B0000;
  box-shadow: 0 0 20px rgba(139, 0, 0, 0.5);
}

.game-ui {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  padding: 0 20px;
  pointer-events: none;
}

.health-bar {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 15px;
  border: 2px solid #8B0000;
  min-width: 200px;
}

.health-label,
.ammo-label {
  color: #FF0000;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
}

.health-value {
  color: #FFF;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.bar {
  height: 20px;
  background: #333;
  border: 1px solid #666;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s;
}

.bar-fill.health {
  background: linear-gradient(90deg, #FF0000, #FF6600);
}

.ammo-counter {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 20px;
  border: 2px solid #8B0000;
  text-align: center;
}

.ammo-value {
  color: #FFF;
  font-size: 32px;
  font-weight: bold;
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #00FF00;
  font-size: 32px;
  font-weight: bold;
  text-shadow: 0 0 10px #00FF00;
  pointer-events: none;
}

.start-screen,
.pause-screen,
.game-over-screen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #FFF;
  pointer-events: all;
}

.game-title {
  font-size: 72px;
  color: #FF0000;
  text-shadow: 0 0 20px #FF0000, 0 0 40px #FF0000;
  margin-bottom: 10px;
  font-weight: bold;
  letter-spacing: 8px;
}

.game-subtitle {
  font-size: 24px;
  color: #CCC;
  margin-bottom: 40px;
}

.start-button,
.resume-button,
.reset-button,
.restart-button {
  background: linear-gradient(180deg, #8B0000, #FF0000);
  color: #FFF;
  border: 3px solid #FF0000;
  padding: 15px 40px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 10px;
  font-family: 'Courier New', monospace;
}

.start-button:hover,
.resume-button:hover,
.reset-button:hover,
.restart-button:hover {
  background: linear-gradient(180deg, #FF0000, #FF4444);
  box-shadow: 0 0 20px #FF0000;
  transform: scale(1.05);
}

.controls-info {
  margin-top: 40px;
  text-align: center;
  color: #AAA;
  line-height: 1.8;
}

.controls-info p {
  margin: 5px 0;
}

.controls-info strong {
  color: #FFF;
  font-size: 18px;
}

.pause-screen h2,
.game-over-screen h2 {
  font-size: 48px;
  color: #FF0000;
  text-shadow: 0 0 20px #FF0000;
  margin-bottom: 30px;
  letter-spacing: 4px;
}

.game-over-screen p {
  font-size: 20px;
  color: #CCC;
  margin-bottom: 30px;
}
</style>
