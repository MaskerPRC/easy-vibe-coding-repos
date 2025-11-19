import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 游戏状态（内存存储）
let gameState = {
  // 中国象棋棋盘（9x10）
  chineseBoard: initChineseBoard(),
  // 国际象棋棋盘（8x8）
  internationalBoard: initInternationalBoard(),
  // 当前回合（'red' 中国象棋红方, 'black' 中国象棋黑方, 'white' 国际象棋白方, 'dark' 国际象棋黑方）
  currentTurn: 'red',
  // 选中的棋子
  selectedPiece: null,
  // 游戏状态
  gameStatus: 'playing', // 'playing', 'checkmate', 'stalemate'
  // 移动历史
  moveHistory: []
};

// 初始化中国象棋棋盘
function initChineseBoard() {
  const board = Array(10).fill(null).map(() => Array(9).fill(null));

  // 红方棋子（下方，0-4行）
  board[0][0] = { type: 'chariot', side: 'red', name: '車' }; // 车
  board[0][1] = { type: 'horse', side: 'red', name: '馬' }; // 马
  board[0][2] = { type: 'elephant', side: 'red', name: '相' }; // 相
  board[0][3] = { type: 'advisor', side: 'red', name: '仕' }; // 仕
  board[0][4] = { type: 'general', side: 'red', name: '帥' }; // 帅
  board[0][5] = { type: 'advisor', side: 'red', name: '仕' }; // 仕
  board[0][6] = { type: 'elephant', side: 'red', name: '相' }; // 相
  board[0][7] = { type: 'horse', side: 'red', name: '馬' }; // 马
  board[0][8] = { type: 'chariot', side: 'red', name: '車' }; // 车

  board[2][1] = { type: 'cannon', side: 'red', name: '炮' }; // 炮
  board[2][7] = { type: 'cannon', side: 'red', name: '炮' }; // 炮

  board[3][0] = { type: 'soldier', side: 'red', name: '兵' }; // 兵
  board[3][2] = { type: 'soldier', side: 'red', name: '兵' };
  board[3][4] = { type: 'soldier', side: 'red', name: '兵' };
  board[3][6] = { type: 'soldier', side: 'red', name: '兵' };
  board[3][8] = { type: 'soldier', side: 'red', name: '兵' };

  // 黑方棋子（上方，5-9行）
  board[9][0] = { type: 'chariot', side: 'black', name: '車' }; // 车
  board[9][1] = { type: 'horse', side: 'black', name: '馬' }; // 马
  board[9][2] = { type: 'elephant', side: 'black', name: '象' }; // 象
  board[9][3] = { type: 'advisor', side: 'black', name: '士' }; // 士
  board[9][4] = { type: 'general', side: 'black', name: '將' }; // 将
  board[9][5] = { type: 'advisor', side: 'black', name: '士' }; // 士
  board[9][6] = { type: 'elephant', side: 'black', name: '象' }; // 象
  board[9][7] = { type: 'horse', side: 'black', name: '馬' }; // 马
  board[9][8] = { type: 'chariot', side: 'black', name: '車' }; // 车

  board[7][1] = { type: 'cannon', side: 'black', name: '炮' }; // 炮
  board[7][7] = { type: 'cannon', side: 'black', name: '炮' }; // 炮

  board[6][0] = { type: 'soldier', side: 'black', name: '卒' }; // 卒
  board[6][2] = { type: 'soldier', side: 'black', name: '卒' };
  board[6][4] = { type: 'soldier', side: 'black', name: '卒' };
  board[6][6] = { type: 'soldier', side: 'black', name: '卒' };
  board[6][8] = { type: 'soldier', side: 'black', name: '卒' };

  return board;
}

// 初始化国际象棋棋盘
function initInternationalBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));

  // 白方棋子（下方，0-1行）
  board[0][0] = { type: 'rook', side: 'white', name: '♜' };
  board[0][1] = { type: 'knight', side: 'white', name: '♞' };
  board[0][2] = { type: 'bishop', side: 'white', name: '♝' };
  board[0][3] = { type: 'queen', side: 'white', name: '♛' };
  board[0][4] = { type: 'king', side: 'white', name: '♚' };
  board[0][5] = { type: 'bishop', side: 'white', name: '♝' };
  board[0][6] = { type: 'knight', side: 'white', name: '♞' };
  board[0][7] = { type: 'rook', side: 'white', name: '♜' };

  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', side: 'white', name: '♟' };
  }

  // 黑方棋子（上方，6-7行）
  for (let i = 0; i < 8; i++) {
    board[6][i] = { type: 'pawn', side: 'dark', name: '♟' };
  }

  board[7][0] = { type: 'rook', side: 'dark', name: '♜' };
  board[7][1] = { type: 'knight', side: 'dark', name: '♞' };
  board[7][2] = { type: 'bishop', side: 'dark', name: '♝' };
  board[7][3] = { type: 'queen', side: 'dark', name: '♛' };
  board[7][4] = { type: 'king', side: 'dark', name: '♚' };
  board[7][5] = { type: 'bishop', side: 'dark', name: '♝' };
  board[7][6] = { type: 'knight', side: 'dark', name: '♞' };
  board[7][7] = { type: 'rook', side: 'dark', name: '♜' };

  return board;
}

// 获取游戏状态
app.get('/api/game/state', (req, res) => {
  res.json(gameState);
});

// 重置游戏
app.post('/api/game/reset', (req, res) => {
  gameState = {
    chineseBoard: initChineseBoard(),
    internationalBoard: initInternationalBoard(),
    currentTurn: 'red',
    selectedPiece: null,
    gameStatus: 'playing',
    moveHistory: []
  };
  res.json({ success: true, state: gameState });
});

// 移动棋子
app.post('/api/game/move', (req, res) => {
  const { boardType, from, to } = req.body;

  if (!boardType || !from || !to) {
    return res.status(400).json({ error: '参数不完整' });
  }

  const board = boardType === 'chinese' ? gameState.chineseBoard : gameState.internationalBoard;
  const piece = board[from.row][from.col];

  if (!piece) {
    return res.status(400).json({ error: '起始位置没有棋子' });
  }

  // 检查是否是当前回合的棋子
  if (piece.side !== gameState.currentTurn) {
    return res.status(400).json({ error: '不是该方回合' });
  }

  // 执行移动
  const targetPiece = board[to.row][to.col];
  board[to.row][to.col] = piece;
  board[from.row][from.col] = null;

  // 记录移动历史
  gameState.moveHistory.push({
    boardType,
    from,
    to,
    piece,
    captured: targetPiece,
    timestamp: new Date().toISOString()
  });

  // 切换回合
  const turnOrder = ['red', 'white', 'black', 'dark'];
  const currentIndex = turnOrder.indexOf(gameState.currentTurn);
  gameState.currentTurn = turnOrder[(currentIndex + 1) % turnOrder.length];

  res.json({ success: true, state: gameState });
});

// 获取可移动位置
app.post('/api/game/valid-moves', (req, res) => {
  const { boardType, row, col } = req.body;

  if (!boardType || row === undefined || col === undefined) {
    return res.status(400).json({ error: '参数不完整' });
  }

  const board = boardType === 'chinese' ? gameState.chineseBoard : gameState.internationalBoard;
  const piece = board[row][col];

  if (!piece) {
    return res.json({ validMoves: [] });
  }

  // 这里简化处理，返回所有空位置或敌方棋子位置
  const validMoves = [];
  const maxRow = boardType === 'chinese' ? 10 : 8;
  const maxCol = boardType === 'chinese' ? 9 : 8;

  for (let r = 0; r < maxRow; r++) {
    for (let c = 0; c < maxCol; c++) {
      const target = board[r][c];
      if (!target || target.side !== piece.side) {
        validMoves.push({ row: r, col: c });
      }
    }
  }

  res.json({ validMoves });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到资源',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`应用项目后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
});
