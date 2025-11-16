<template>
  <div class="game-container">
    <!-- 3D游戏画布 -->
    <div ref="gameCanvas" class="game-canvas"></div>

    <!-- HUD界面 -->
    <div class="hud" v-if="gameState.isPlaying && !gameState.isGameOver">
      <!-- 左上角 - 分数和等级 -->
      <div class="hud-panel hud-top-left">
        <div class="stat-item">
          <span class="stat-label">分数</span>
          <span class="stat-value">{{ formatNumber(gameState.score) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">等级</span>
          <span class="stat-value">{{ gameState.level }}</span>
        </div>
        <div class="stat-item" v-if="gameState.combo > 1">
          <span class="stat-label">连击</span>
          <span class="stat-value combo">x{{ gameState.combo }}</span>
        </div>
      </div>

      <!-- 右上角 - 生命值 -->
      <div class="hud-panel hud-top-right">
        <div class="health-bar">
          <span class="health-label">生命值</span>
          <div class="health-bar-container">
            <div
              class="health-bar-fill"
              :style="{ width: gameState.health + '%' }"
              :class="{
                'health-low': gameState.health <= 30,
                'health-medium': gameState.health > 30 && gameState.health <= 60
              }"
            ></div>
          </div>
          <span class="health-value">{{ gameState.health }}%</span>
        </div>
      </div>

      <!-- 底部 - 控制提示 -->
      <div class="hud-panel hud-bottom">
        <div class="controls-hint">
          <span class="control-key">WASD/方向键</span> 移动 |
          <span class="control-key">空格/鼠标点击</span> 射击 |
          <span class="control-key">P</span> 暂停
        </div>
      </div>
    </div>

    <!-- 暂停界面 -->
    <div class="overlay" v-if="gameState.isPaused">
      <div class="menu-panel">
        <h2 class="menu-title">游戏暂停</h2>
        <div class="pause-stats">
          <div class="pause-stat">
            <span class="pause-label">当前分数</span>
            <span class="pause-value">{{ formatNumber(gameState.score) }}</span>
          </div>
          <div class="pause-stat">
            <span class="pause-label">当前等级</span>
            <span class="pause-value">{{ gameState.level }}</span>
          </div>
          <div class="pause-stat">
            <span class="pause-label">消灭敌人</span>
            <span class="pause-value">{{ gameState.enemiesDestroyed }}</span>
          </div>
        </div>
        <div class="menu-buttons">
          <button class="btn btn-primary" @click="resumeGame">继续游戏</button>
          <button class="btn btn-secondary" @click="restartGame">重新开始</button>
        </div>
      </div>
    </div>

    <!-- 游戏结束界面 -->
    <div class="overlay" v-if="gameState.isGameOver">
      <div class="menu-panel game-over-panel">
        <h2 class="menu-title game-over-title">游戏结束</h2>
        <div class="final-stats">
          <div class="final-stat">
            <span class="final-label">最终分数</span>
            <span class="final-value highlight">{{ formatNumber(gameState.score) }}</span>
          </div>
          <div class="final-stat">
            <span class="final-label">到达等级</span>
            <span class="final-value">{{ gameState.level }}</span>
          </div>
          <div class="final-stat">
            <span class="final-label">消灭敌人</span>
            <span class="final-value">{{ gameState.enemiesDestroyed }}</span>
          </div>
          <div class="final-stat">
            <span class="final-label">最高连击</span>
            <span class="final-value">{{ maxCombo }}x</span>
          </div>
        </div>
        <div class="menu-buttons">
          <button class="btn btn-primary btn-large" @click="restartGame">再来一局</button>
        </div>
      </div>
    </div>

    <!-- 开始菜单 -->
    <div class="overlay start-overlay" v-if="!gameState.isPlaying && !gameState.isGameOver">
      <div class="menu-panel start-panel">
        <h1 class="game-title">太空猎手</h1>
        <p class="game-subtitle">3D太空射击游戏</p>

        <div class="game-description">
          <p>驾驶你的战舰，在无尽的太空中消灭敌人！</p>
          <p>生存越久，敌人越强，挑战你的极限！</p>
        </div>

        <div class="how-to-play">
          <h3>操作说明</h3>
          <ul class="controls-list">
            <li><span class="key">W A S D</span> 或 <span class="key">↑ ← ↓ →</span> 移动飞船</li>
            <li><span class="key">空格键</span> 或 <span class="key">鼠标点击</span> 发射子弹</li>
            <li><span class="key">P</span> 暂停游戏</li>
          </ul>
        </div>

        <div class="enemy-types">
          <h3>敌人类型</h3>
          <div class="enemy-list">
            <div class="enemy-item">
              <div class="enemy-icon red"></div>
              <span>快速小型 - 100分</span>
            </div>
            <div class="enemy-item">
              <div class="enemy-icon yellow"></div>
              <span>中型敌人 - 200分</span>
            </div>
            <div class="enemy-item">
              <div class="enemy-icon green"></div>
              <span>大型坚固 - 300分</span>
            </div>
          </div>
        </div>

        <button class="btn btn-primary btn-start" @click="startGame">
          开始游戏
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { GameEngine } from '../game/GameEngine.js';

export default {
  name: 'SpaceHunterGame',
  setup() {
    const gameCanvas = ref(null);
    const gameEngine = ref(null);
    const maxCombo = ref(0);

    const gameState = reactive({
      score: 0,
      health: 100,
      level: 1,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      enemiesDestroyed: 0,
      combo: 0
    });

    // 格式化数字
    const formatNumber = (num) => {
      return num.toLocaleString('zh-CN');
    };

    // 初始化游戏引擎
    const initGame = () => {
      if (gameCanvas.value) {
        gameEngine.value = new GameEngine(gameCanvas.value);
        gameEngine.value.init();

        // 监听状态变化
        gameEngine.value.onStateChange = (newState) => {
          Object.assign(gameState, newState);
          if (newState.combo > maxCombo.value) {
            maxCombo.value = newState.combo;
          }
        };

        // 监听游戏结束
        gameEngine.value.onGameOver = (finalState) => {
          console.log('游戏结束，最终分数:', finalState.score);
        };

        // 监听暂停按键
        window.addEventListener('keydown', handleKeyDown);
      }
    };

    // 键盘事件处理
    const handleKeyDown = (e) => {
      if (e.code === 'KeyP' && gameState.isPlaying && !gameState.isGameOver) {
        togglePause();
      }
    };

    // 开始游戏
    const startGame = () => {
      if (gameEngine.value) {
        maxCombo.value = 0;
        gameEngine.value.start();
      }
    };

    // 暂停/继续
    const togglePause = () => {
      if (gameEngine.value) {
        gameEngine.value.togglePause();
      }
    };

    // 继续游戏
    const resumeGame = () => {
      if (gameEngine.value && gameState.isPaused) {
        gameEngine.value.togglePause();
      }
    };

    // 重新开始
    const restartGame = () => {
      if (gameEngine.value) {
        maxCombo.value = 0;
        gameEngine.value.start();
      }
    };

    onMounted(() => {
      initGame();
    });

    onUnmounted(() => {
      if (gameEngine.value) {
        gameEngine.value.dispose();
      }
      window.removeEventListener('keydown', handleKeyDown);
    });

    return {
      gameCanvas,
      gameState,
      maxCombo,
      formatNumber,
      startGame,
      togglePause,
      resumeGame,
      restartGame
    };
  }
};
</script>

<style scoped>
/* 主容器 */
.game-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #1A1A2E;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* 游戏画布 */
.game-canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* HUD面板基础样式 */
.hud-panel {
  position: absolute;
  background: rgba(43, 43, 71, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 196, 255, 0.3);
  border-radius: 8px;
  padding: 16px;
  color: #E0E0E0;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.2);
}

/* 左上角面板 */
.hud-top-left {
  top: 20px;
  left: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 14px;
  color: #A0A0A0;
  margin-right: 16px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #00C4FF;
}

.stat-value.combo {
  color: #FFC107;
  animation: pulse 0.5s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

/* 右上角面板 */
.hud-top-right {
  top: 20px;
  right: 20px;
}

.health-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.health-label {
  font-size: 14px;
  color: #A0A0A0;
  margin-bottom: 8px;
}

.health-bar-container {
  width: 200px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.health-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #28A745, #00C4FF);
  border-radius: 10px;
  transition: width 0.3s ease, background 0.3s ease;
}

.health-bar-fill.health-medium {
  background: linear-gradient(90deg, #FFC107, #FF9800);
}

.health-bar-fill.health-low {
  background: linear-gradient(90deg, #DC3545, #FF5722);
  animation: health-warning 0.5s ease-in-out infinite alternate;
}

@keyframes health-warning {
  from { opacity: 0.7; }
  to { opacity: 1; }
}

.health-value {
  font-size: 16px;
  font-weight: bold;
  color: #E0E0E0;
  margin-top: 4px;
}

/* 底部控制提示 */
.hud-bottom {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
}

.controls-hint {
  font-size: 14px;
  color: #A0A0A0;
}

.control-key {
  color: #00C4FF;
  font-weight: bold;
}

/* 覆盖层 */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(26, 26, 46, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.start-overlay {
  background: radial-gradient(ellipse at center, rgba(0, 123, 255, 0.1) 0%, rgba(26, 26, 46, 0.95) 70%);
}

/* 菜单面板 */
.menu-panel {
  background: rgba(43, 43, 71, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(0, 196, 255, 0.4);
  border-radius: 16px;
  padding: 40px;
  color: #E0E0E0;
  box-shadow: 0 8px 40px rgba(0, 123, 255, 0.3);
  max-width: 500px;
  width: 90%;
  text-align: center;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.start-panel {
  max-width: 600px;
}

.game-over-panel {
  border-color: rgba(220, 53, 69, 0.5);
  box-shadow: 0 8px 40px rgba(220, 53, 69, 0.3);
}

.menu-title {
  font-size: 32px;
  font-weight: bold;
  color: #00C4FF;
  margin: 0 0 24px 0;
}

.game-over-title {
  color: #DC3545;
}

.game-title {
  font-size: 48px;
  font-weight: bold;
  color: #00C4FF;
  margin: 0;
  text-shadow: 0 0 20px rgba(0, 196, 255, 0.5);
}

.game-subtitle {
  font-size: 18px;
  color: #A0A0A0;
  margin: 8px 0 32px 0;
}

.game-description {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.game-description p {
  margin: 8px 0;
  color: #E0E0E0;
}

.how-to-play {
  margin-bottom: 24px;
}

.how-to-play h3 {
  color: #00C4FF;
  font-size: 20px;
  margin: 0 0 16px 0;
}

.controls-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.controls-list li {
  margin-bottom: 12px;
  color: #E0E0E0;
}

.key {
  display: inline-block;
  background: rgba(0, 123, 255, 0.3);
  color: #00C4FF;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
}

.enemy-types {
  margin-bottom: 32px;
}

.enemy-types h3 {
  color: #00C4FF;
  font-size: 20px;
  margin: 0 0 16px 0;
}

.enemy-list {
  display: flex;
  justify-content: space-around;
}

.enemy-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.enemy-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.enemy-icon.red {
  background: #DC3545;
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
}

.enemy-icon.yellow {
  background: #FFC107;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
}

.enemy-icon.green {
  background: #28A745;
  box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
}

.enemy-item span {
  font-size: 14px;
  color: #A0A0A0;
}

/* 统计信息 */
.pause-stats,
.final-stats {
  margin-bottom: 32px;
}

.pause-stat,
.final-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pause-stat:last-child,
.final-stat:last-child {
  border-bottom: none;
}

.pause-label,
.final-label {
  font-size: 16px;
  color: #A0A0A0;
}

.pause-value,
.final-value {
  font-size: 24px;
  font-weight: bold;
  color: #00C4FF;
}

.final-value.highlight {
  font-size: 32px;
  color: #FFC107;
  text-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
}

/* 按钮 */
.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(135deg, #007BFF, #00C4FF);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.6);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: transparent;
  color: #00C4FF;
  border: 2px solid #00C4FF;
}

.btn-secondary:hover {
  background: rgba(0, 196, 255, 0.1);
}

.btn-start {
  font-size: 20px;
  padding: 18px 48px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
  }
  to {
    box-shadow: 0 6px 30px rgba(0, 196, 255, 0.7);
  }
}

.btn-large {
  font-size: 18px;
  padding: 16px 32px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hud-panel {
    padding: 12px;
  }

  .stat-value {
    font-size: 18px;
  }

  .health-bar-container {
    width: 150px;
  }

  .menu-panel {
    padding: 24px;
  }

  .game-title {
    font-size: 36px;
  }

  .enemy-list {
    flex-direction: column;
    gap: 12px;
  }

  .hud-bottom {
    display: none;
  }
}

@media (max-width: 480px) {
  .hud-top-left,
  .hud-top-right {
    padding: 8px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-value {
    font-size: 16px;
  }

  .health-bar-container {
    width: 120px;
    height: 16px;
  }

  .menu-panel {
    padding: 16px;
  }

  .game-title {
    font-size: 28px;
  }
}
</style>
