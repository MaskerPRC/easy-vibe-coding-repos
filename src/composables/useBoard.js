// 棋盘绘制管理
import { ref, onUnmounted } from 'vue';
import {
  CELL_SIZE,
  BOARD_PADDING,
  BOARD_SIZE,
  STAR_POSITIONS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT
} from '@/constants/board';

export function useBoard(game, myColor, isSpectating) {
  const boardCanvas = ref(null);
  const hoverPos = ref(null);
  const isFrozen = ref(false);
  const frozenRemaining = ref(0);
  const frozenTimer = ref(null);

  // 初始化棋盘
  function initBoard() {
    if (!boardCanvas.value) return;
    const canvas = boardCanvas.value;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  // 绘制棋盘
  function drawBoard() {
    if (!boardCanvas.value || !game.value) return;

    const canvas = boardCanvas.value;
    const ctx = canvas.getContext('2d');

    // 清空画布
    ctx.fillStyle = '#3d2817';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制木纹效果
    ctx.strokeStyle = '#2d1807';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * canvas.height);
      ctx.lineTo(canvas.width, Math.random() * canvas.height);
      ctx.lineWidth = Math.random() * 2;
      ctx.globalAlpha = 0.1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 绘制网格
    drawGrid(ctx);

    // 绘制星位
    drawStars(ctx);

    // 绘制棋子
    drawPieces(ctx);

    // 绘制悬停提示
    drawHover(ctx);

    // 绘制最后一手标记
    drawLastMove(ctx);
  }

  // 绘制网格
  function drawGrid(ctx) {
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;

    for (let i = 0; i < BOARD_SIZE; i++) {
      // 横线
      ctx.beginPath();
      ctx.moveTo(BOARD_PADDING, BOARD_PADDING + i * CELL_SIZE);
      ctx.lineTo(BOARD_PADDING + 14 * CELL_SIZE, BOARD_PADDING + i * CELL_SIZE);
      ctx.stroke();

      // 竖线
      ctx.beginPath();
      ctx.moveTo(BOARD_PADDING + i * CELL_SIZE, BOARD_PADDING);
      ctx.lineTo(BOARD_PADDING + i * CELL_SIZE, BOARD_PADDING + 14 * CELL_SIZE);
      ctx.stroke();
    }
  }

  // 绘制星位
  function drawStars(ctx) {
    ctx.fillStyle = '#1a1a1a';
    STAR_POSITIONS.forEach(([row, col]) => {
      ctx.beginPath();
      ctx.arc(
        BOARD_PADDING + col * CELL_SIZE,
        BOARD_PADDING + row * CELL_SIZE,
        3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  }

  // 绘制棋子
  function drawPieces(ctx) {
    const board = game.value.board;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j]) {
          drawPiece(ctx, i, j, board[i][j]);
        }
      }
    }
  }

  // 绘制单个棋子
  function drawPiece(ctx, row, col, color) {
    const x = BOARD_PADDING + col * CELL_SIZE;
    const y = BOARD_PADDING + row * CELL_SIZE;

    // 阴影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // 绘制棋子
    const gradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, 15);
    if (color === 'black') {
      gradient.addColorStop(0, '#4a4a4a');
      gradient.addColorStop(1, '#000000');
    } else {
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#e0e0e0');
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    // 重置阴影
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // 边框
    ctx.strokeStyle = color === 'black' ? '#333' : '#ccc';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 绘制悬停提示
  function drawHover(ctx) {
    if (hoverPos.value && game.value.currentTurn === myColor.value && !isSpectating.value) {
      const { row, col } = hoverPos.value;
      if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
        ctx.fillStyle = myColor.value === 'black' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(
          BOARD_PADDING + col * CELL_SIZE,
          BOARD_PADDING + row * CELL_SIZE,
          15,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  // 绘制最后一手标记
  function drawLastMove(ctx) {
    if (game.value.moves.length > 0) {
      const lastMove = game.value.moves[game.value.moves.length - 1];
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        BOARD_PADDING + lastMove.col * CELL_SIZE,
        BOARD_PADDING + lastMove.row * CELL_SIZE,
        18,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
  }

  // 处理棋盘点击
  function handleBoardClick(e, socket, selectingSkillTarget) {
    if (!game.value || game.value.status !== 'playing') return;
    if (isSpectating.value) return;
    if (game.value.currentTurn !== myColor.value) return;

    const rect = boardCanvas.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.round((x - BOARD_PADDING) / CELL_SIZE);
    const row = Math.round((y - BOARD_PADDING) / CELL_SIZE);

    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;

    // 如果在选择技能目标模式
    if (selectingSkillTarget.value === '飞沙走石') {
      const opponentColor = myColor.value === 'black' ? 'white' : 'black';
      if (game.value.board[row][col] === opponentColor) {
        socket.value.emit('game:skill', {
          gameId: game.value.id,
          skillName: '飞沙走石',
          targetData: { row, col }
        });
        selectingSkillTarget.value = null;
      }
      return;
    }

    // 正常落子
    socket.value.emit('game:move', {
      gameId: game.value.id,
      row,
      col
    });
  }

  // 处理棋盘悬停
  function handleBoardHover(e) {
    if (!boardCanvas.value) return;

    const rect = boardCanvas.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.round((x - BOARD_PADDING) / CELL_SIZE);
    const row = Math.round((y - BOARD_PADDING) / CELL_SIZE);

    hoverPos.value = { row, col };
    drawBoard();
  }

  // 开始冻结计时器
  function startFrozenTimer(frozenUntil) {
    isFrozen.value = true;

    if (frozenTimer.value) {
      clearInterval(frozenTimer.value);
    }

    frozenTimer.value = setInterval(() => {
      const remaining = Math.ceil((frozenUntil - Date.now()) / 1000);
      frozenRemaining.value = remaining;

      if (remaining <= 0) {
        isFrozen.value = false;
        clearInterval(frozenTimer.value);
      }
    }, 100);
  }

  // 清理定时器
  onUnmounted(() => {
    if (frozenTimer.value) {
      clearInterval(frozenTimer.value);
    }
  });

  return {
    boardCanvas,
    hoverPos,
    isFrozen,
    frozenRemaining,
    initBoard,
    drawBoard,
    handleBoardClick,
    handleBoardHover,
    startFrozenTimer
  };
}
