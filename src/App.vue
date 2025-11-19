<template>
  <div class="chess-game">
    <!-- 标题栏 -->
    <div class="title-bar">
      <h1 class="game-title">融合棋局 - 中国象棋 × 国际象棋</h1>
      <div class="turn-indicator">
        <span class="turn-label">当前回合：</span>
        <span class="turn-value" :class="`turn-${currentTurn}`">{{ getTurnName(currentTurn) }}</span>
      </div>
    </div>

    <!-- 主游戏区域 -->
    <div class="game-container">
      <!-- 中国象棋区域 -->
      <div class="board-section chinese-section">
        <div class="section-header">
          <h2>中国象棋</h2>
          <div class="player-info">
            <div class="player red">红方</div>
            <div class="player black">黑方</div>
          </div>
        </div>
        <div class="board-wrapper chinese-board">
          <div class="chinese-grid">
            <!-- 横线 -->
            <svg class="grid-lines" viewBox="0 0 800 900">
              <!-- 横线 -->
              <line v-for="i in 10" :key="`h${i}`"
                    :x1="50" :y1="50 + (i - 1) * 90"
                    :x2="750" :y2="50 + (i - 1) * 90"
                    stroke="#B87333" stroke-width="2"/>
              <!-- 竖线 -->
              <line v-for="i in 9" :key="`v${i}`"
                    :x1="50 + (i - 1) * 87.5" :y1="50"
                    :x2="50 + (i - 1) * 87.5" :y2="860"
                    stroke="#B87333" stroke-width="2"/>
              <!-- 楚河汉界 -->
              <text x="200" y="475" fill="#B87333" font-size="32" font-weight="bold">楚河</text>
              <text x="500" y="475" fill="#B87333" font-size="32" font-weight="bold">汉界</text>
              <!-- 九宫格斜线 -->
              <line x1="312.5" y1="50" x2="487.5" y2="230" stroke="#B87333" stroke-width="2"/>
              <line x1="487.5" y1="50" x2="312.5" y2="230" stroke="#B87333" stroke-width="2"/>
              <line x1="312.5" y1="680" x2="487.5" y2="860" stroke="#B87333" stroke-width="2"/>
              <line x1="487.5" y1="680" x2="312.5" y2="860" stroke="#B87333" stroke-width="2"/>
            </svg>
            <!-- 棋子 -->
            <div v-for="(row, rowIndex) in chineseBoard" :key="`row-${rowIndex}`" class="board-row">
              <div v-for="(piece, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`"
                   class="board-cell"
                   :class="{
                     'selected': selectedPiece?.boardType === 'chinese' && selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex,
                     'valid-move': isValidMove('chinese', rowIndex, colIndex)
                   }"
                   @click="handleCellClick('chinese', rowIndex, colIndex)"
                   :style="{
                     left: `${50 + colIndex * 87.5}px`,
                     top: `${50 + rowIndex * 90}px`
                   }">
                <div v-if="piece" class="piece" :class="`piece-${piece.side}`">
                  {{ piece.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 国际象棋区域 -->
      <div class="board-section international-section">
        <div class="section-header">
          <h2>国际象棋</h2>
          <div class="player-info">
            <div class="player white">白方</div>
            <div class="player dark">黑方</div>
          </div>
        </div>
        <div class="board-wrapper international-board">
          <div class="international-grid">
            <!-- 棋盘格子 -->
            <div v-for="(row, rowIndex) in internationalBoard" :key="`i-row-${rowIndex}`" class="board-row">
              <div v-for="(piece, colIndex) in row" :key="`i-cell-${rowIndex}-${colIndex}`"
                   class="board-cell"
                   :class="{
                     'light': (rowIndex + colIndex) % 2 === 0,
                     'dark': (rowIndex + colIndex) % 2 === 1,
                     'selected': selectedPiece?.boardType === 'international' && selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex,
                     'valid-move': isValidMove('international', rowIndex, colIndex)
                   }"
                   @click="handleCellClick('international', rowIndex, colIndex)">
                <div v-if="piece" class="piece" :class="`piece-${piece.side}`">
                  {{ piece.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <button class="control-btn reset-btn" @click="resetGame">重新开始</button>
      <button class="control-btn undo-btn" @click="undoMove" :disabled="moveHistory.length === 0">悔棋</button>
      <div class="move-counter">
        移动次数：{{ moveHistory.length }}
      </div>
    </div>

    <!-- 移动历史 -->
    <div class="history-panel" v-if="moveHistory.length > 0">
      <h3>移动历史</h3>
      <div class="history-list">
        <div v-for="(move, index) in moveHistory.slice(-5)" :key="index" class="history-item">
          <span class="move-number">{{ moveHistory.length - 4 + index }}.</span>
          <span class="move-detail">
            {{ move.boardType === 'chinese' ? '中' : '国' }} -
            {{ move.piece.name }}
            ({{ move.from.row }},{{ move.from.col }}) →
            ({{ move.to.row }},{{ move.to.col }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// 游戏状态
const chineseBoard = ref([]);
const internationalBoard = ref([]);
const currentTurn = ref('red');
const selectedPiece = ref(null);
const validMoves = ref([]);
const moveHistory = ref([]);
const gameStatus = ref('playing');

// 获取回合名称
const getTurnName = (turn) => {
  const names = {
    'red': '红方（中国象棋）',
    'black': '黑方（中国象棋）',
    'white': '白方（国际象棋）',
    'dark': '黑方（国际象棋）'
  };
  return names[turn] || turn;
};

// 检查是否是有效移动
const isValidMove = (boardType, row, col) => {
  if (!selectedPiece.value || selectedPiece.value.boardType !== boardType) {
    return false;
  }
  return validMoves.value.some(move => move.row === row && move.col === col);
};

// 加载游戏状态
const loadGameState = async () => {
  try {
    const response = await fetch('/api/game/state');
    const data = await response.json();
    chineseBoard.value = data.chineseBoard;
    internationalBoard.value = data.internationalBoard;
    currentTurn.value = data.currentTurn;
    moveHistory.value = data.moveHistory;
    gameStatus.value = data.gameStatus;
  } catch (error) {
    console.error('加载游戏状态失败:', error);
  }
};

// 处理格子点击
const handleCellClick = async (boardType, row, col) => {
  const board = boardType === 'chinese' ? chineseBoard.value : internationalBoard.value;
  const piece = board[row][col];

  // 如果已经选中了棋子
  if (selectedPiece.value) {
    // 如果点击的是有效移动位置
    if (isValidMove(boardType, row, col)) {
      await movePiece(boardType, selectedPiece.value.row, selectedPiece.value.col, row, col);
      selectedPiece.value = null;
      validMoves.value = [];
    }
    // 如果点击的是同方棋子，重新选择
    else if (piece && piece.side === currentTurn.value) {
      selectedPiece.value = { boardType, row, col };
      await loadValidMoves(boardType, row, col);
    }
    // 否则取消选择
    else {
      selectedPiece.value = null;
      validMoves.value = [];
    }
  }
  // 如果没有选中棋子，且点击的是当前回合的棋子
  else if (piece && piece.side === currentTurn.value) {
    selectedPiece.value = { boardType, row, col };
    await loadValidMoves(boardType, row, col);
  }
};

// 加载可移动位置
const loadValidMoves = async (boardType, row, col) => {
  try {
    const response = await fetch('/api/game/valid-moves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardType, row, col })
    });
    const data = await response.json();
    validMoves.value = data.validMoves || [];
  } catch (error) {
    console.error('加载可移动位置失败:', error);
    validMoves.value = [];
  }
};

// 移动棋子
const movePiece = async (boardType, fromRow, fromCol, toRow, toCol) => {
  try {
    const response = await fetch('/api/game/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        boardType,
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol }
      })
    });
    const data = await response.json();
    if (data.success) {
      await loadGameState();
    } else {
      alert('移动失败：' + (data.error || '未知错误'));
    }
  } catch (error) {
    console.error('移动棋子失败:', error);
    alert('移动失败：' + error.message);
  }
};

// 重置游戏
const resetGame = async () => {
  if (confirm('确定要重新开始游戏吗？')) {
    try {
      const response = await fetch('/api/game/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        await loadGameState();
        selectedPiece.value = null;
        validMoves.value = [];
      }
    } catch (error) {
      console.error('重置游戏失败:', error);
    }
  }
};

// 悔棋（简化版）
const undoMove = () => {
  alert('悔棋功能暂未实现，请使用重新开始');
};

// 初始化
onMounted(() => {
  loadGameState();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.chess-game {
  min-height: 100vh;
  background: linear-gradient(135deg, #2F3640 0%, #4E342E 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 标题栏 */
.title-bar {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 2px solid #B87333;
}

.game-title {
  font-size: 36px;
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 3px;
}

.turn-indicator {
  font-size: 20px;
  color: #F5F5DC;
}

.turn-label {
  color: #B87333;
  margin-right: 10px;
}

.turn-value {
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 5px;
  display: inline-block;
}

.turn-red { background: #B62B2B; color: white; }
.turn-black { background: #2C3E50; color: white; }
.turn-white { background: #F5F5DC; color: #2C3E50; }
.turn-dark { background: #2A568D; color: white; }

/* 主游戏区域 */
.game-container {
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.board-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 25px;
  border: 3px solid #B87333;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.chinese-section {
  border-color: #B62B2B;
  background: linear-gradient(135deg, rgba(182, 43, 43, 0.1) 0%, rgba(44, 62, 80, 0.1) 100%);
}

.international-section {
  border-color: #2A568D;
  background: linear-gradient(135deg, rgba(42, 86, 141, 0.1) 0%, rgba(245, 245, 220, 0.1) 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 28px;
  color: #FFD700;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.player-info {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.player {
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
}

.player.red {
  background: #B62B2B;
  color: white;
}

.player.black {
  background: #2C3E50;
  color: white;
}

.player.white {
  background: #F5F5DC;
  color: #2C3E50;
}

.player.dark {
  background: #2A568D;
  color: white;
}

/* 中国象棋棋盘 */
.chinese-board {
  background: linear-gradient(135deg, #F5DEB3 0%, #DEB887 100%);
  border: 5px solid #8B4513;
  border-radius: 10px;
  padding: 10px;
}

.chinese-grid {
  width: 800px;
  height: 900px;
  position: relative;
  background: #F5DEB3;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 国际象棋棋盘 */
.international-board {
  background: #4A4A4A;
  border: 5px solid #2C3E50;
  border-radius: 10px;
  padding: 10px;
}

.international-grid {
  width: 640px;
  height: 640px;
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  background: transparent;
}

.international-grid .board-row {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
}

.international-grid .board-cell {
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.international-grid .board-cell.light {
  background: #F5F5DC;
}

.international-grid .board-cell.dark {
  background: #2A568D;
}

.international-grid .board-cell:hover {
  filter: brightness(1.2);
}

/* 棋子样式 */
.chinese-grid .board-cell {
  width: 70px;
  height: 70px;
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.piece {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  border: 3px solid;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  user-select: none;
}

.chinese-grid .piece {
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent);
}

.chinese-grid .piece-red {
  background-color: #B62B2B;
  color: #FFD700;
  border-color: #8B0000;
}

.chinese-grid .piece-black {
  background-color: #2C3E50;
  color: #F5F5DC;
  border-color: #1C1C1C;
}

.international-grid .piece {
  font-size: 50px;
  width: 70px;
  height: 70px;
  background: transparent;
  border: none;
  box-shadow: none;
}

.international-grid .piece-white {
  color: #FFFFFF;
  text-shadow:
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000,
    2px 2px 0 #000;
}

.international-grid .piece-dark {
  color: #000000;
  text-shadow:
    -2px -2px 0 #FFF,
    2px -2px 0 #FFF,
    -2px 2px 0 #FFF,
    2px 2px 0 #FFF;
}

/* 选中和可移动状态 */
.board-cell.selected {
  background: rgba(255, 215, 0, 0.3) !important;
  border: 3px solid #FFD700;
  z-index: 20;
}

.board-cell.valid-move {
  background: rgba(102, 187, 106, 0.3) !important;
}

.board-cell.valid-move::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #66BB6A;
  border-radius: 50%;
  opacity: 0.6;
  z-index: 5;
}

.piece:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
}

/* 控制面板 */
.control-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.control-btn {
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.reset-btn {
  background: linear-gradient(135deg, #B62B2B 0%, #8B0000 100%);
  color: white;
}

.reset-btn:hover {
  background: linear-gradient(135deg, #D63031 0%, #B62B2B 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.undo-btn {
  background: linear-gradient(135deg, #2A568D 0%, #1C3F6B 100%);
  color: white;
}

.undo-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3A6FAD 0%, #2A568D 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

.undo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.move-counter {
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #B87333;
  border-radius: 10px;
  color: #FFD700;
  font-size: 18px;
  font-weight: bold;
}

/* 移动历史 */
.history-panel {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid #B87333;
  border-radius: 10px;
  padding: 20px;
}

.history-panel h3 {
  color: #FFD700;
  margin-bottom: 15px;
  text-align: center;
  font-size: 24px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 15px;
  border-radius: 5px;
  color: #F5F5DC;
  font-size: 16px;
  display: flex;
  gap: 10px;
}

.move-number {
  color: #B87333;
  font-weight: bold;
  min-width: 30px;
}

.move-detail {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 1600px) {
  .game-container {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 900px) {
  .chinese-grid {
    width: 400px;
    height: 450px;
  }

  .chinese-grid .board-cell {
    width: 40px;
    height: 40px;
  }

  .chinese-grid .piece {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }

  .international-grid {
    width: 400px;
    height: 400px;
  }

  .international-grid .board-cell {
    width: 50px;
    height: 50px;
  }

  .international-grid .piece {
    font-size: 32px;
    width: 45px;
    height: 45px;
  }

  .game-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .chinese-grid {
    width: 320px;
    height: 360px;
  }

  .international-grid {
    width: 320px;
    height: 320px;
  }

  .game-title {
    font-size: 20px;
  }

  .control-btn {
    padding: 12px 24px;
    font-size: 16px;
  }
}
</style>
