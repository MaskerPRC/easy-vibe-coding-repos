// 中国象棋引擎
// 棋子颜色
export const COLORS = {
  RED: 'red',
  BLACK: 'black'
}

// 棋子类型
export const PIECE_TYPES = {
  KING: 'king',         // 将/帅
  ADVISOR: 'advisor',   // 士/仕
  ELEPHANT: 'elephant', // 象/相
  HORSE: 'horse',       // 马
  CHARIOT: 'chariot',   // 车
  CANNON: 'cannon',     // 炮
  PAWN: 'pawn'          // 卒/兵
}

// 棋子名称映射
export const PIECE_NAMES = {
  [COLORS.RED]: {
    [PIECE_TYPES.KING]: '帅',
    [PIECE_TYPES.ADVISOR]: '仕',
    [PIECE_TYPES.ELEPHANT]: '相',
    [PIECE_TYPES.HORSE]: '马',
    [PIECE_TYPES.CHARIOT]: '车',
    [PIECE_TYPES.CANNON]: '炮',
    [PIECE_TYPES.PAWN]: '兵'
  },
  [COLORS.BLACK]: {
    [PIECE_TYPES.KING]: '将',
    [PIECE_TYPES.ADVISOR]: '士',
    [PIECE_TYPES.ELEPHANT]: '象',
    [PIECE_TYPES.HORSE]: '马',
    [PIECE_TYPES.CHARIOT]: '車',
    [PIECE_TYPES.CANNON]: '砲',
    [PIECE_TYPES.PAWN]: '卒'
  }
}

// 创建棋子
function createPiece(type, color) {
  return { type, color }
}

// 初始化棋盘（10行9列，棋子在交叉点上）
export function createInitialBoard() {
  const board = Array(10).fill(null).map(() => Array(9).fill(null))

  // 黑方（上方，0-4行）
  // 第0行：車 马 象 士 将 士 象 马 車
  board[0][0] = createPiece(PIECE_TYPES.CHARIOT, COLORS.BLACK)
  board[0][1] = createPiece(PIECE_TYPES.HORSE, COLORS.BLACK)
  board[0][2] = createPiece(PIECE_TYPES.ELEPHANT, COLORS.BLACK)
  board[0][3] = createPiece(PIECE_TYPES.ADVISOR, COLORS.BLACK)
  board[0][4] = createPiece(PIECE_TYPES.KING, COLORS.BLACK)
  board[0][5] = createPiece(PIECE_TYPES.ADVISOR, COLORS.BLACK)
  board[0][6] = createPiece(PIECE_TYPES.ELEPHANT, COLORS.BLACK)
  board[0][7] = createPiece(PIECE_TYPES.HORSE, COLORS.BLACK)
  board[0][8] = createPiece(PIECE_TYPES.CHARIOT, COLORS.BLACK)

  // 第2行：砲
  board[2][1] = createPiece(PIECE_TYPES.CANNON, COLORS.BLACK)
  board[2][7] = createPiece(PIECE_TYPES.CANNON, COLORS.BLACK)

  // 第3行：卒
  board[3][0] = createPiece(PIECE_TYPES.PAWN, COLORS.BLACK)
  board[3][2] = createPiece(PIECE_TYPES.PAWN, COLORS.BLACK)
  board[3][4] = createPiece(PIECE_TYPES.PAWN, COLORS.BLACK)
  board[3][6] = createPiece(PIECE_TYPES.PAWN, COLORS.BLACK)
  board[3][8] = createPiece(PIECE_TYPES.PAWN, COLORS.BLACK)

  // 红方（下方，5-9行）
  // 第6行：兵
  board[6][0] = createPiece(PIECE_TYPES.PAWN, COLORS.RED)
  board[6][2] = createPiece(PIECE_TYPES.PAWN, COLORS.RED)
  board[6][4] = createPiece(PIECE_TYPES.PAWN, COLORS.RED)
  board[6][6] = createPiece(PIECE_TYPES.PAWN, COLORS.RED)
  board[6][8] = createPiece(PIECE_TYPES.PAWN, COLORS.RED)

  // 第7行：炮
  board[7][1] = createPiece(PIECE_TYPES.CANNON, COLORS.RED)
  board[7][7] = createPiece(PIECE_TYPES.CANNON, COLORS.RED)

  // 第9行：车 马 相 仕 帅 仕 相 马 车
  board[9][0] = createPiece(PIECE_TYPES.CHARIOT, COLORS.RED)
  board[9][1] = createPiece(PIECE_TYPES.HORSE, COLORS.RED)
  board[9][2] = createPiece(PIECE_TYPES.ELEPHANT, COLORS.RED)
  board[9][3] = createPiece(PIECE_TYPES.ADVISOR, COLORS.RED)
  board[9][4] = createPiece(PIECE_TYPES.KING, COLORS.RED)
  board[9][5] = createPiece(PIECE_TYPES.ADVISOR, COLORS.RED)
  board[9][6] = createPiece(PIECE_TYPES.ELEPHANT, COLORS.RED)
  board[9][7] = createPiece(PIECE_TYPES.HORSE, COLORS.RED)
  board[9][8] = createPiece(PIECE_TYPES.CHARIOT, COLORS.RED)

  return board
}

// 检查位置是否在棋盘范围内
function isInBoard(row, col) {
  return row >= 0 && row <= 9 && col >= 0 && col <= 8
}

// 检查是否在九宫格内
function isInPalace(row, col, color) {
  if (col < 3 || col > 5) return false
  if (color === COLORS.RED) {
    return row >= 7 && row <= 9
  } else {
    return row >= 0 && row <= 2
  }
}

// 检查是否过河
function hasCrossedRiver(row, color) {
  if (color === COLORS.RED) {
    return row <= 4
  } else {
    return row >= 5
  }
}

// 获取棋子的所有合法移动
export function getValidMoves(board, row, col) {
  const piece = board[row][col]
  if (!piece) return []

  const moves = []
  const { type, color } = piece

  switch (type) {
    case PIECE_TYPES.KING:
      // 将/帅：在九宫格内移动一步
      const kingDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
      for (const [dr, dc] of kingDirs) {
        const nr = row + dr
        const nc = col + dc
        if (isInPalace(nr, nc, color)) {
          const target = board[nr][nc]
          if (!target || target.color !== color) {
            moves.push({ row: nr, col: nc })
          }
        }
      }
      break

    case PIECE_TYPES.ADVISOR:
      // 士/仕：在九宫格内斜走一步
      const advisorDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
      for (const [dr, dc] of advisorDirs) {
        const nr = row + dr
        const nc = col + dc
        if (isInPalace(nr, nc, color)) {
          const target = board[nr][nc]
          if (!target || target.color !== color) {
            moves.push({ row: nr, col: nc })
          }
        }
      }
      break

    case PIECE_TYPES.ELEPHANT:
      // 象/相：走田字，不能过河，不能被塞象眼
      const elephantDirs = [[2, 2], [2, -2], [-2, 2], [-2, -2]]
      const elephantBlocks = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
      for (let i = 0; i < elephantDirs.length; i++) {
        const [dr, dc] = elephantDirs[i]
        const [br, bc] = elephantBlocks[i]
        const nr = row + dr
        const nc = col + dc
        if (isInBoard(nr, nc) && !hasCrossedRiver(nr, color)) {
          // 检查象眼是否被堵
          if (!board[row + br][col + bc]) {
            const target = board[nr][nc]
            if (!target || target.color !== color) {
              moves.push({ row: nr, col: nc })
            }
          }
        }
      }
      break

    case PIECE_TYPES.HORSE:
      // 马：走日字，注意蹩马腿
      const horseMoves = [
        { dr: -2, dc: -1, br: -1, bc: 0 },
        { dr: -2, dc: 1, br: -1, bc: 0 },
        { dr: -1, dc: -2, br: 0, bc: -1 },
        { dr: -1, dc: 2, br: 0, bc: 1 },
        { dr: 1, dc: -2, br: 0, bc: -1 },
        { dr: 1, dc: 2, br: 0, bc: 1 },
        { dr: 2, dc: -1, br: 1, bc: 0 },
        { dr: 2, dc: 1, br: 1, bc: 0 }
      ]
      for (const move of horseMoves) {
        const nr = row + move.dr
        const nc = col + move.dc
        if (isInBoard(nr, nc)) {
          // 检查马腿是否被堵
          if (!board[row + move.br][col + move.bc]) {
            const target = board[nr][nc]
            if (!target || target.color !== color) {
              moves.push({ row: nr, col: nc })
            }
          }
        }
      }
      break

    case PIECE_TYPES.CHARIOT:
      // 车：直线移动
      const chariotDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
      for (const [dr, dc] of chariotDirs) {
        for (let i = 1; i <= 9; i++) {
          const nr = row + dr * i
          const nc = col + dc * i
          if (!isInBoard(nr, nc)) break
          const target = board[nr][nc]
          if (!target) {
            moves.push({ row: nr, col: nc })
          } else {
            if (target.color !== color) {
              moves.push({ row: nr, col: nc })
            }
            break
          }
        }
      }
      break

    case PIECE_TYPES.CANNON:
      // 炮：直线移动，吃子需要跳过一个棋子
      const cannonDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
      for (const [dr, dc] of cannonDirs) {
        let jumped = false
        for (let i = 1; i <= 9; i++) {
          const nr = row + dr * i
          const nc = col + dc * i
          if (!isInBoard(nr, nc)) break
          const target = board[nr][nc]
          if (!jumped) {
            if (!target) {
              moves.push({ row: nr, col: nc })
            } else {
              jumped = true
            }
          } else {
            if (target) {
              if (target.color !== color) {
                moves.push({ row: nr, col: nc })
              }
              break
            }
          }
        }
      }
      break

    case PIECE_TYPES.PAWN:
      // 兵/卒：未过河只能前进，过河后可以左右
      const forward = color === COLORS.RED ? -1 : 1
      const forwardPos = { row: row + forward, col: col }
      if (isInBoard(forwardPos.row, forwardPos.col)) {
        const target = board[forwardPos.row][forwardPos.col]
        if (!target || target.color !== color) {
          moves.push(forwardPos)
        }
      }
      // 过河后可以左右移动
      if (hasCrossedRiver(row, color)) {
        for (const dc of [-1, 1]) {
          const nc = col + dc
          if (isInBoard(row, nc)) {
            const target = board[row][nc]
            if (!target || target.color !== color) {
              moves.push({ row: row, col: nc })
            }
          }
        }
      }
      break
  }

  // 过滤掉会导致自己被将军的移动
  return moves.filter(move => {
    const newBoard = makeMove(board, row, col, move.row, move.col)
    return !isInCheck(newBoard, color)
  })
}

// 执行移动（返回新棋盘）
export function makeMove(board, fromRow, fromCol, toRow, toCol) {
  const newBoard = board.map(row => [...row])
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol]
  newBoard[fromRow][fromCol] = null
  return newBoard
}

// 找到将/帅的位置
function findKing(board, color) {
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col]
      if (piece && piece.type === PIECE_TYPES.KING && piece.color === color) {
        return { row, col }
      }
    }
  }
  return null
}

// 检查是否被将军
export function isInCheck(board, color) {
  const kingPos = findKing(board, color)
  if (!kingPos) return true

  const opponentColor = color === COLORS.RED ? COLORS.BLACK : COLORS.RED

  // 检查对方所有棋子是否能攻击到将/帅
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col]
      if (piece && piece.color === opponentColor) {
        const moves = getBasicMoves(board, row, col)
        if (moves.some(m => m.row === kingPos.row && m.col === kingPos.col)) {
          return true
        }
      }
    }
  }

  // 检查将帅对脸
  const opponentKingPos = findKing(board, opponentColor)
  if (opponentKingPos && kingPos.col === opponentKingPos.col) {
    let blocked = false
    const minRow = Math.min(kingPos.row, opponentKingPos.row)
    const maxRow = Math.max(kingPos.row, opponentKingPos.row)
    for (let row = minRow + 1; row < maxRow; row++) {
      if (board[row][kingPos.col]) {
        blocked = true
        break
      }
    }
    if (!blocked) return true
  }

  return false
}

// 获取基本移动（不检查将军）
function getBasicMoves(board, row, col) {
  const piece = board[row][col]
  if (!piece) return []

  const moves = []
  const { type, color } = piece

  // 简化版本，只用于检查是否能攻击到某位置
  switch (type) {
    case PIECE_TYPES.KING:
      const kingDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
      for (const [dr, dc] of kingDirs) {
        const nr = row + dr
        const nc = col + dc
        if (isInPalace(nr, nc, color)) {
          moves.push({ row: nr, col: nc })
        }
      }
      break

    case PIECE_TYPES.ADVISOR:
      const advisorDirs = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
      for (const [dr, dc] of advisorDirs) {
        const nr = row + dr
        const nc = col + dc
        if (isInPalace(nr, nc, color)) {
          moves.push({ row: nr, col: nc })
        }
      }
      break

    case PIECE_TYPES.ELEPHANT:
      const elephantDirs = [[2, 2], [2, -2], [-2, 2], [-2, -2]]
      const elephantBlocks = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
      for (let i = 0; i < elephantDirs.length; i++) {
        const [dr, dc] = elephantDirs[i]
        const [br, bc] = elephantBlocks[i]
        const nr = row + dr
        const nc = col + dc
        if (isInBoard(nr, nc) && !hasCrossedRiver(nr, color)) {
          if (!board[row + br][col + bc]) {
            moves.push({ row: nr, col: nc })
          }
        }
      }
      break

    case PIECE_TYPES.HORSE:
      const horseMoves = [
        { dr: -2, dc: -1, br: -1, bc: 0 },
        { dr: -2, dc: 1, br: -1, bc: 0 },
        { dr: -1, dc: -2, br: 0, bc: -1 },
        { dr: -1, dc: 2, br: 0, bc: 1 },
        { dr: 1, dc: -2, br: 0, bc: -1 },
        { dr: 1, dc: 2, br: 0, bc: 1 },
        { dr: 2, dc: -1, br: 1, bc: 0 },
        { dr: 2, dc: 1, br: 1, bc: 0 }
      ]
      for (const move of horseMoves) {
        const nr = row + move.dr
        const nc = col + move.dc
        if (isInBoard(nr, nc) && !board[row + move.br][col + move.bc]) {
          moves.push({ row: nr, col: nc })
        }
      }
      break

    case PIECE_TYPES.CHARIOT:
      const chariotDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
      for (const [dr, dc] of chariotDirs) {
        for (let i = 1; i <= 9; i++) {
          const nr = row + dr * i
          const nc = col + dc * i
          if (!isInBoard(nr, nc)) break
          moves.push({ row: nr, col: nc })
          if (board[nr][nc]) break
        }
      }
      break

    case PIECE_TYPES.CANNON:
      const cannonDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
      for (const [dr, dc] of cannonDirs) {
        let jumped = false
        for (let i = 1; i <= 9; i++) {
          const nr = row + dr * i
          const nc = col + dc * i
          if (!isInBoard(nr, nc)) break
          if (!jumped) {
            if (board[nr][nc]) jumped = true
          } else {
            moves.push({ row: nr, col: nc })
            if (board[nr][nc]) break
          }
        }
      }
      break

    case PIECE_TYPES.PAWN:
      const forward = color === COLORS.RED ? -1 : 1
      moves.push({ row: row + forward, col: col })
      if (hasCrossedRiver(row, color)) {
        moves.push({ row: row, col: col - 1 })
        moves.push({ row: row, col: col + 1 })
      }
      break
  }

  return moves.filter(m => isInBoard(m.row, m.col))
}

// 检查是否将死
export function isCheckmate(board, color) {
  if (!isInCheck(board, color)) return false

  // 检查是否有任何合法移动
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col]
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, row, col)
        if (moves.length > 0) return false
      }
    }
  }

  return true
}

// 简单的AI：随机选择一个合法移动
export function getAIMove(board, color) {
  const allMoves = []

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col]
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, row, col)
        for (const move of moves) {
          allMoves.push({
            fromRow: row,
            fromCol: col,
            toRow: move.row,
            toCol: move.col
          })
        }
      }
    }
  }

  if (allMoves.length === 0) return null

  // 优先选择吃子的移动
  const captureMoves = allMoves.filter(m => board[m.toRow][m.toCol] !== null)
  if (captureMoves.length > 0) {
    return captureMoves[Math.floor(Math.random() * captureMoves.length)]
  }

  return allMoves[Math.floor(Math.random() * allMoves.length)]
}
