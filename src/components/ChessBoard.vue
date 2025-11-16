<template>
  <div class="chess-game">
    <!-- 游戏信息区 -->
    <div class="game-info">
      <div class="player-info ai-info">
        <div class="player-avatar">AI</div>
        <div class="player-details">
          <div class="player-name">AI 对手</div>
          <div class="player-level">简单难度</div>
        </div>
        <div class="thinking-indicator" v-if="isAIThinking">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>

      <div class="game-status">
        <div class="turn-indicator" :class="{ 'red-turn': currentPlayer === 'red', 'black-turn': currentPlayer === 'black' }">
          {{ currentPlayer === 'red' ? '红方回合' : '黑方回合' }}
        </div>
        <div class="game-message" v-if="gameMessage">{{ gameMessage }}</div>
      </div>

      <div class="player-info user-info">
        <div class="player-avatar">玩</div>
        <div class="player-details">
          <div class="player-name">玩家</div>
          <div class="player-color">执红先行</div>
        </div>
      </div>
    </div>

    <!-- 棋盘区域 -->
    <div class="board-container">
      <div class="board">
        <!-- 棋盘线条 - SVG viewBox 与实际尺寸匹配，确保对齐 -->
        <svg class="board-lines" viewBox="0 0 320 360">
          <!-- 横线（10条，对应10行交叉点）-->
          <line v-for="i in 10" :key="'h'+i"
                :x1="0" :y1="(i-1)*40"
                :x2="320" :y2="(i-1)*40" />
          <!-- 竖线（9条，对应9列交叉点）-->
          <line v-for="i in 9" :key="'v'+i"
                :x1="(i-1)*40" :y1="0"
                :x2="(i-1)*40" :y2="160" />
          <line v-for="i in 9" :key="'vb'+i"
                :x1="(i-1)*40" :y1="200"
                :x2="(i-1)*40" :y2="360" />
          <!-- 边框竖线贯穿楚河汉界 -->
          <line x1="0" y1="0" x2="0" y2="360" />
          <line x1="320" y1="0" x2="320" y2="360" />
          <!-- 九宫格斜线（黑方）-->
          <line x1="120" y1="0" x2="200" y2="80" />
          <line x1="200" y1="0" x2="120" y2="80" />
          <!-- 九宫格斜线（红方）-->
          <line x1="120" y1="280" x2="200" y2="360" />
          <line x1="200" y1="280" x2="120" y2="360" />
          <!-- 楚河汉界 -->
          <rect x="1" y="161" width="318" height="38" class="river" />
          <text x="80" y="185" class="river-text">楚 河</text>
          <text x="200" y="185" class="river-text">汉 界</text>
        </svg>

        <!-- 棋子层 - 使用绝对定位确保与线条交叉点对齐 -->
        <div class="pieces-layer">
          <div
            v-for="(row, rowIndex) in board"
            :key="rowIndex"
            class="board-row"
          >
            <div
              v-for="(piece, colIndex) in row"
              :key="colIndex"
              class="board-cell"
              :class="{
                'valid-move': isValidMoveTarget(rowIndex, colIndex),
                'selected': selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex
              }"
              @click="handleCellClick(rowIndex, colIndex)"
            >
              <div
                v-if="piece"
                class="piece"
                :class="[
                  piece.color,
                  { 'can-select': canSelectPiece(piece) }
                ]"
              >
                {{ getPieceName(piece) }}
              </div>
              <div v-if="isValidMoveTarget(rowIndex, colIndex)" class="move-indicator"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="controls">
      <button class="btn btn-restart" @click="restartGame">
        重新开始
      </button>
      <button class="btn btn-undo" @click="undoMove" :disabled="moveHistory.length === 0 || isAIThinking">
        悔棋
      </button>
    </div>

    <!-- 游戏结束弹窗 -->
    <div v-if="showGameOverModal" class="modal-overlay" @click="showGameOverModal = false">
      <div class="modal" @click.stop>
        <h2 class="modal-title">{{ gameOverTitle }}</h2>
        <p class="modal-message">{{ gameOverMessage }}</p>
        <button class="btn btn-modal" @click="restartGame">再来一局</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  createInitialBoard,
  getValidMoves,
  makeMove,
  isInCheck,
  isCheckmate,
  getAIMove,
  COLORS,
  PIECE_NAMES
} from '../utils/chessEngine.js'

// 棋盘状态
const board = ref(createInitialBoard())
const currentPlayer = ref(COLORS.RED)
const selectedPiece = ref(null)
const validMoves = ref([])
const moveHistory = ref([])
const gameOver = ref(false)
const gameMessage = ref('')
const isAIThinking = ref(false)
const showGameOverModal = ref(false)
const gameOverTitle = ref('')
const gameOverMessage = ref('')

// AI 设置
const aiColor = COLORS.BLACK

// 获取棋子显示名称
function getPieceName(piece) {
  return PIECE_NAMES[piece.color][piece.type]
}

// 检查是否可以选择棋子
function canSelectPiece(piece) {
  return !gameOver.value && !isAIThinking.value && piece.color === currentPlayer.value && currentPlayer.value === COLORS.RED
}

// 检查是否是有效移动目标
function isValidMoveTarget(row, col) {
  return validMoves.value.some(move => move.row === row && move.col === col)
}

// 处理点击事件
function handleCellClick(row, col) {
  if (gameOver.value || isAIThinking.value) return
  if (currentPlayer.value !== COLORS.RED) return

  const clickedPiece = board.value[row][col]

  // 如果点击的是有效移动位置
  if (selectedPiece.value && isValidMoveTarget(row, col)) {
    executeMove(selectedPiece.value.row, selectedPiece.value.col, row, col)
    return
  }

  // 如果点击的是己方棋子
  if (clickedPiece && clickedPiece.color === COLORS.RED) {
    selectedPiece.value = { row, col }
    validMoves.value = getValidMoves(board.value, row, col)
  } else {
    selectedPiece.value = null
    validMoves.value = []
  }
}

// 执行移动
function executeMove(fromRow, fromCol, toRow, toCol) {
  // 保存历史记录用于悔棋
  moveHistory.value.push({
    board: board.value.map(row => row.map(cell => cell ? { ...cell } : null)),
    currentPlayer: currentPlayer.value
  })

  // 执行移动
  board.value = makeMove(board.value, fromRow, fromCol, toRow, toCol)

  // 清除选择
  selectedPiece.value = null
  validMoves.value = []

  // 检查游戏状态
  const opponentColor = currentPlayer.value === COLORS.RED ? COLORS.BLACK : COLORS.RED

  if (isCheckmate(board.value, opponentColor)) {
    gameOver.value = true
    if (currentPlayer.value === COLORS.RED) {
      gameOverTitle.value = '恭喜获胜！'
      gameOverMessage.value = '您成功将死了对手！'
    } else {
      gameOverTitle.value = '游戏结束'
      gameOverMessage.value = 'AI 获胜了，再接再厉！'
    }
    showGameOverModal.value = true
    return
  }

  if (isInCheck(board.value, opponentColor)) {
    gameMessage.value = opponentColor === COLORS.RED ? '红方被将军！' : '黑方被将军！'
  } else {
    gameMessage.value = ''
  }

  // 切换玩家
  currentPlayer.value = opponentColor

  // 如果轮到AI
  if (currentPlayer.value === aiColor && !gameOver.value) {
    setTimeout(() => {
      makeAIMove()
    }, 500)
  }
}

// AI移动
async function makeAIMove() {
  isAIThinking.value = true
  gameMessage.value = 'AI 正在思考...'

  await new Promise(resolve => setTimeout(resolve, 100))

  const move = getAIMove(board.value, aiColor)

  if (move) {
    executeMove(move.fromRow, move.fromCol, move.toRow, move.toCol)
  } else {
    gameOver.value = true
    gameOverTitle.value = '恭喜获胜！'
    gameOverMessage.value = 'AI 无法移动，您获胜了！'
    showGameOverModal.value = true
  }

  isAIThinking.value = false
}

// 重新开始游戏
function restartGame() {
  board.value = createInitialBoard()
  currentPlayer.value = COLORS.RED
  selectedPiece.value = null
  validMoves.value = []
  moveHistory.value = []
  gameOver.value = false
  gameMessage.value = ''
  showGameOverModal.value = false
}

// 悔棋
function undoMove() {
  if (moveHistory.value.length < 2) return

  // 撤销AI的移动
  moveHistory.value.pop()
  // 撤销玩家的移动
  const lastState = moveHistory.value.pop()

  board.value = lastState.board
  currentPlayer.value = lastState.currentPlayer
  selectedPiece.value = null
  validMoves.value = []
  gameMessage.value = ''
}
</script>

<style scoped>
.chess-game {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
  background: linear-gradient(135deg, #F0F0E0 0%, #FFFFFF 100%);
  min-height: 100vh;
}

/* 游戏信息区 */
.game-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(74, 46, 26, 0.05);
  border-radius: 12px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-avatar {
  width: 48px;
  height: 48px;
  background: #4A2E1A;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.player-name {
  font-size: 16px;
  font-weight: bold;
  color: #2C2C2C;
}

.player-level,
.player-color {
  font-size: 12px;
  color: #A0A0A0;
}

.thinking-indicator {
  display: flex;
  gap: 4px;
  margin-left: 8px;
}

.thinking-indicator .dot {
  width: 8px;
  height: 8px;
  background: #4CAF50;
  border-radius: 50%;
  animation: pulse 1.4s infinite ease-in-out;
}

.thinking-indicator .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.thinking-indicator .dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.game-status {
  text-align: center;
}

.turn-indicator {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
}

.red-turn {
  background: #D92B2B;
  color: #F5F5DC;
}

.black-turn {
  background: #2C2C2C;
  color: #F5F5DC;
}

.game-message {
  margin-top: 8px;
  font-size: 12px;
  color: #D92B2B;
  font-weight: bold;
}

/* 棋盘容器 */
.board-container {
  background: #4A2E1A;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(74, 46, 26, 0.3);
  margin-bottom: 24px;
}

.board {
  position: relative;
  width: 360px;
  height: 400px;
  margin: 0 auto;
  background: #D4A574;
}

/* 关键：SVG线条定位，与棋子层对齐 */
.board-lines {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 320px;
  height: 360px;
  pointer-events: none;
}

.board-lines line {
  stroke: #4A2E1A;
  stroke-width: 1;
}

.board-lines .river {
  fill: #D4A574;
}

.board-lines .river-text {
  font-size: 20px;
  fill: #4A2E1A;
  font-family: 'KaiTi', serif;
  font-weight: bold;
}

/* 关键：棋子层定位，确保棋子中心与线条交叉点对齐 */
.pieces-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.board-row {
  display: flex;
  position: relative;
}

/* 关键：每个格子40x40，棋子在格子中心，格子中心对应线条交叉点 */
.board-cell {
  width: 40px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.board-cell.selected::before {
  content: '';
  position: absolute;
  width: 44px;
  height: 44px;
  border: 3px solid #D92B2B;
  border-radius: 50%;
  animation: selectedPulse 1.5s infinite;
}

@keyframes selectedPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.move-indicator {
  position: absolute;
  width: 16px;
  height: 16px;
  background: rgba(217, 43, 43, 0.5);
  border-radius: 50%;
  pointer-events: none;
}

.board-cell.valid-move::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(217, 43, 43, 0.3);
  border-radius: 50%;
}

/* 棋子样式 */
.piece {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  font-family: 'KaiTi', serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  user-select: none;
  z-index: 10;
}

.piece.red {
  background: radial-gradient(circle at 30% 30%, #F5F5DC, #E8E8D0);
  color: #D92B2B;
  border: 2px solid #D92B2B;
}

.piece.black {
  background: radial-gradient(circle at 30% 30%, #4A4A4A, #2C2C2C);
  color: #F5F5DC;
  border: 2px solid #1A1A1A;
}

.piece.can-select:hover {
  transform: scale(1.1);
  cursor: pointer;
}

/* 控制按钮 */
.controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-restart {
  background: #4CAF50;
  color: white;
}

.btn-restart:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.btn-undo {
  background: #589A8D;
  color: white;
}

.btn-undo:hover:not(:disabled) {
  background: #4a8a7d;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #F5F5DC;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
}

.modal-title {
  font-size: 24px;
  color: #4A2E1A;
  margin-bottom: 16px;
}

.modal-message {
  font-size: 16px;
  color: #2C2C2C;
  margin-bottom: 24px;
}

.btn-modal {
  background: #D92B2B;
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-modal:hover {
  background: #c02020;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .chess-game {
    padding: 12px;
  }

  .board-container {
    padding: 16px;
  }

  .board {
    transform: scale(0.85);
    transform-origin: center;
  }

  .game-info {
    flex-direction: column;
    gap: 16px;
  }

  .controls {
    gap: 12px;
  }

  .btn {
    padding: 10px 16px;
    font-size: 12px;
  }
}
</style>
