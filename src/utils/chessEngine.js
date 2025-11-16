/**
 * 中国象棋游戏引擎
 * 包含棋子移动规则、AI逻辑等核心功能
 */

// 棋子类型定义
export const PIECE_TYPES = {
  KING: 'king',      // 将/帅
  ADVISOR: 'advisor', // 士/仕
  ELEPHANT: 'elephant', // 象/相
  HORSE: 'horse',    // 马
  CHARIOT: 'chariot', // 车
  CANNON: 'cannon',  // 炮
  PAWN: 'pawn'       // 兵/卒
}

// 棋子颜色
export const COLORS = {
  RED: 'red',
  BLACK: 'black'
}

// 棋子名称映射（中文显示）
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
    [PIECE_TYPES.HORSE]: '馬',
    [PIECE_TYPES.CHARIOT]: '車',
    [PIECE_TYPES.CANNON]: '砲',
    [PIECE_TYPES.PAWN]: '卒'
  }
}

// 棋子价值（用于AI评估）
export const PIECE_VALUES = {
  [PIECE_TYPES.KING]: 10000,
  [PIECE_TYPES.ADVISOR]: 20,
  [PIECE_TYPES.ELEPHANT]: 25,
  [PIECE_TYPES.HORSE]: 40,
  [PIECE_TYPES.CHARIOT]: 90,
  [PIECE_TYPES.CANNON]: 45,
  [PIECE_TYPES.PAWN]: 10
}

// 创建初始棋盘
export function createInitialBoard() {
  const board = Array(10).fill(null).map(() => Array(9).fill(null))

  // 黑方棋子（上方，行0-4）
  // 车
  board[0][0] = { type: PIECE_TYPES.CHARIOT, color: COLORS.BLACK }
  board[0][8] = { type: PIECE_TYPES.CHARIOT, color: COLORS.BLACK }
  // 马
  board[0][1] = { type: PIECE_TYPES.HORSE, color: COLORS.BLACK }
  board[0][7] = { type: PIECE_TYPES.HORSE, color: COLORS.BLACK }
  // 象
  board[0][2] = { type: PIECE_TYPES.ELEPHANT, color: COLORS.BLACK }
  board[0][6] = { type: PIECE_TYPES.ELEPHANT, color: COLORS.BLACK }
  // 士
  board[0][3] = { type: PIECE_TYPES.ADVISOR, color: COLORS.BLACK }
  board[0][5] = { type: PIECE_TYPES.ADVISOR, color: COLORS.BLACK }
  // 将
  board[0][4] = { type: PIECE_TYPES.KING, color: COLORS.BLACK }
  // 炮
  board[2][1] = { type: PIECE_TYPES.CANNON, color: COLORS.BLACK }
  board[2][7] = { type: PIECE_TYPES.CANNON, color: COLORS.BLACK }
  // 卒
  board[3][0] = { type: PIECE_TYPES.PAWN, color: COLORS.BLACK }
  board[3][2] = { type: PIECE_TYPES.PAWN, color: COLORS.BLACK }
  board[3][4] = { type: PIECE_TYPES.PAWN, color: COLORS.BLACK }
  board[3][6] = { type: PIECE_TYPES.PAWN, color: COLORS.BLACK }
  board[3][8] = { type: PIECE_TYPES.PAWN, color: COLORS.BLACK }

  // 红方棋子（下方，行5-9）
  // 车
  board[9][0] = { type: PIECE_TYPES.CHARIOT, color: COLORS.RED }
  board[9][8] = { type: PIECE_TYPES.CHARIOT, color: COLORS.RED }
  // 马
  board[9][1] = { type: PIECE_TYPES.HORSE, color: COLORS.RED }
  board[9][7] = { type: PIECE_TYPES.HORSE, color: COLORS.RED }
  // 相
  board[9][2] = { type: PIECE_TYPES.ELEPHANT, color: COLORS.RED }
  board[9][6] = { type: PIECE_TYPES.ELEPHANT, color: COLORS.RED }
  // 仕
  board[9][3] = { type: PIECE_TYPES.ADVISOR, color: COLORS.RED }
  board[9][5] = { type: PIECE_TYPES.ADVISOR, color: COLORS.RED }
  // 帅
  board[9][4] = { type: PIECE_TYPES.KING, color: COLORS.RED }
  // 炮
  board[7][1] = { type: PIECE_TYPES.CANNON, color: COLORS.RED }
  board[7][7] = { type: PIECE_TYPES.CANNON, color: COLORS.RED }
  // 兵
  board[6][0] = { type: PIECE_TYPES.PAWN, color: COLORS.RED }
  board[6][2] = { type: PIECE_TYPES.PAWN, color: COLORS.RED }
  board[6][4] = { type: PIECE_TYPES.PAWN, color: COLORS.RED }
  board[6][6] = { type: PIECE_TYPES.PAWN, color: COLORS.RED }
  board[6][8] = { type: PIECE_TYPES.PAWN, color: COLORS.RED }

  return board
}

// 检查位置是否在棋盘内
export function isInBoard(row, col) {
  return row >= 0 && row < 10 && col >= 0 && col < 9
}

// 检查位置是否在九宫格内
export function isInPalace(row, col, color) {
  if (color === COLORS.RED) {
    return row >= 7 && row <= 9 && col >= 3 && col <= 5
  } else {
    return row >= 0 && row <= 2 && col >= 3 && col <= 5
  }
}

// 检查位置是否在己方半场
export function isInOwnHalf(row, color) {
  if (color === COLORS.RED) {
    return row >= 5
  } else {
    return row <= 4
  }
}

// 获取棋子所有合法移动
export function getValidMoves(board, row, col) {
  const piece = board[row][col]
  if (!piece) return []

  const moves = []

  switch (piece.type) {
    case PIECE_TYPES.KING:
      moves.push(...getKingMoves(board, row, col, piece.color))
      break
    case PIECE_TYPES.ADVISOR:
      moves.push(...getAdvisorMoves(board, row, col, piece.color))
      break
    case PIECE_TYPES.ELEPHANT:
      moves.push(...getElephantMoves(board, row, col, piece.color))
      break
    case PIECE_TYPES.HORSE:
      moves.push(...getHorseMoves(board, row, col))
      break
    case PIECE_TYPES.CHARIOT:
      moves.push(...getChariotMoves(board, row, col))
      break
    case PIECE_TYPES.CANNON:
      moves.push(...getCannonMoves(board, row, col))
      break
    case PIECE_TYPES.PAWN:
      moves.push(...getPawnMoves(board, row, col, piece.color))
      break
  }

  // 过滤掉会导致自己被将军的移动
  return moves.filter(move => {
    const newBoard = makeMove(board, row, col, move.row, move.col)
    return !isInCheck(newBoard, piece.color)
  })
}

// 将/帅移动规则
function getKingMoves(board, row, col, color) {
  const moves = []
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

  for (const [dr, dc] of directions) {
    const newRow = row + dr
    const newCol = col + dc
    if (isInPalace(newRow, newCol, color)) {
      const target = board[newRow][newCol]
      if (!target || target.color !== color) {
        moves.push({ row: newRow, col: newCol })
      }
    }
  }

  // 检查对面将帅（飞将规则）
  const opponentColor = color === COLORS.RED ? COLORS.BLACK : COLORS.RED
  let opponentKingRow = -1
  let opponentKingCol = -1

  // 找到对方将帅位置
  for (let r = 0; r < 10; r++) {
    for (let c = 3; c <= 5; c++) {
      const p = board[r][c]
      if (p && p.type === PIECE_TYPES.KING && p.color === opponentColor) {
        opponentKingRow = r
        opponentKingCol = c
        break
      }
    }
    if (opponentKingRow !== -1) break
  }

  // 如果在同一列，检查是否可以飞将吃掉对方
  if (opponentKingCol === col && opponentKingRow !== -1) {
    let blocked = false
    const minRow = Math.min(row, opponentKingRow)
    const maxRow = Math.max(row, opponentKingRow)
    for (let r = minRow + 1; r < maxRow; r++) {
      if (board[r][col]) {
        blocked = true
        break
      }
    }
    if (!blocked) {
      moves.push({ row: opponentKingRow, col: opponentKingCol })
    }
  }

  return moves
}

// 士/仕移动规则
function getAdvisorMoves(board, row, col, color) {
  const moves = []
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]

  for (const [dr, dc] of directions) {
    const newRow = row + dr
    const newCol = col + dc
    if (isInPalace(newRow, newCol, color)) {
      const target = board[newRow][newCol]
      if (!target || target.color !== color) {
        moves.push({ row: newRow, col: newCol })
      }
    }
  }

  return moves
}

// 象/相移动规则
function getElephantMoves(board, row, col, color) {
  const moves = []
  const directions = [[-2, -2], [-2, 2], [2, -2], [2, 2]]
  const blocks = [[-1, -1], [-1, 1], [1, -1], [1, 1]]

  for (let i = 0; i < directions.length; i++) {
    const [dr, dc] = directions[i]
    const [br, bc] = blocks[i]
    const newRow = row + dr
    const newCol = col + dc
    const blockRow = row + br
    const blockCol = col + bc

    // 检查是否在棋盘内且在己方半场
    if (isInBoard(newRow, newCol) && isInOwnHalf(newRow, color)) {
      // 检查象眼是否被阻挡
      if (!board[blockRow][blockCol]) {
        const target = board[newRow][newCol]
        if (!target || target.color !== color) {
          moves.push({ row: newRow, col: newCol })
        }
      }
    }
  }

  return moves
}

// 马移动规则
function getHorseMoves(board, row, col) {
  const moves = []
  const directions = [
    [-2, -1, -1, 0], [-2, 1, -1, 0],
    [2, -1, 1, 0], [2, 1, 1, 0],
    [-1, -2, 0, -1], [1, -2, 0, -1],
    [-1, 2, 0, 1], [1, 2, 0, 1]
  ]

  const piece = board[row][col]

  for (const [dr, dc, br, bc] of directions) {
    const newRow = row + dr
    const newCol = col + dc
    const blockRow = row + br
    const blockCol = col + bc

    if (isInBoard(newRow, newCol)) {
      // 检查马脚是否被阻挡
      if (!board[blockRow][blockCol]) {
        const target = board[newRow][newCol]
        if (!target || target.color !== piece.color) {
          moves.push({ row: newRow, col: newCol })
        }
      }
    }
  }

  return moves
}

// 车移动规则
function getChariotMoves(board, row, col) {
  const moves = []
  const piece = board[row][col]
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

  for (const [dr, dc] of directions) {
    let newRow = row + dr
    let newCol = col + dc

    while (isInBoard(newRow, newCol)) {
      const target = board[newRow][newCol]
      if (!target) {
        moves.push({ row: newRow, col: newCol })
      } else {
        if (target.color !== piece.color) {
          moves.push({ row: newRow, col: newCol })
        }
        break
      }
      newRow += dr
      newCol += dc
    }
  }

  return moves
}

// 炮移动规则
function getCannonMoves(board, row, col) {
  const moves = []
  const piece = board[row][col]
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

  for (const [dr, dc] of directions) {
    let newRow = row + dr
    let newCol = col + dc
    let hasJumped = false

    while (isInBoard(newRow, newCol)) {
      const target = board[newRow][newCol]
      if (!hasJumped) {
        if (!target) {
          moves.push({ row: newRow, col: newCol })
        } else {
          hasJumped = true
        }
      } else {
        if (target) {
          if (target.color !== piece.color) {
            moves.push({ row: newRow, col: newCol })
          }
          break
        }
      }
      newRow += dr
      newCol += dc
    }
  }

  return moves
}

// 兵/卒移动规则
function getPawnMoves(board, row, col, color) {
  const moves = []
  const piece = board[row][col]

  if (color === COLORS.RED) {
    // 红方向上走
    if (row > 0) {
      const target = board[row - 1][col]
      if (!target || target.color !== color) {
        moves.push({ row: row - 1, col: col })
      }
    }
    // 过河后可以横走
    if (row <= 4) {
      if (col > 0) {
        const target = board[row][col - 1]
        if (!target || target.color !== color) {
          moves.push({ row: row, col: col - 1 })
        }
      }
      if (col < 8) {
        const target = board[row][col + 1]
        if (!target || target.color !== color) {
          moves.push({ row: row, col: col + 1 })
        }
      }
    }
  } else {
    // 黑方向下走
    if (row < 9) {
      const target = board[row + 1][col]
      if (!target || target.color !== color) {
        moves.push({ row: row + 1, col: col })
      }
    }
    // 过河后可以横走
    if (row >= 5) {
      if (col > 0) {
        const target = board[row][col - 1]
        if (!target || target.color !== color) {
          moves.push({ row: row, col: col - 1 })
        }
      }
      if (col < 8) {
        const target = board[row][col + 1]
        if (!target || target.color !== color) {
          moves.push({ row: row, col: col + 1 })
        }
      }
    }
  }

  return moves
}

// 执行移动（返回新棋盘，不修改原棋盘）
export function makeMove(board, fromRow, fromCol, toRow, toCol) {
  const newBoard = board.map(row => [...row])
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol]
  newBoard[fromRow][fromCol] = null
  return newBoard
}

// 检查是否被将军
export function isInCheck(board, color) {
  // 找到将/帅位置
  let kingRow = -1
  let kingCol = -1

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c]
      if (piece && piece.type === PIECE_TYPES.KING && piece.color === color) {
        kingRow = r
        kingCol = c
        break
      }
    }
    if (kingRow !== -1) break
  }

  if (kingRow === -1) return true // 将/帅不存在，已被吃

  // 检查对方所有棋子是否能攻击到将/帅
  const opponentColor = color === COLORS.RED ? COLORS.BLACK : COLORS.RED

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c]
      if (piece && piece.color === opponentColor) {
        const moves = getRawMoves(board, r, c)
        if (moves.some(m => m.row === kingRow && m.col === kingCol)) {
          return true
        }
      }
    }
  }

  return false
}

// 获取原始移动（不检查是否被将军）
function getRawMoves(board, row, col) {
  const piece = board[row][col]
  if (!piece) return []

  switch (piece.type) {
    case PIECE_TYPES.KING:
      return getKingMoves(board, row, col, piece.color)
    case PIECE_TYPES.ADVISOR:
      return getAdvisorMoves(board, row, col, piece.color)
    case PIECE_TYPES.ELEPHANT:
      return getElephantMoves(board, row, col, piece.color)
    case PIECE_TYPES.HORSE:
      return getHorseMoves(board, row, col)
    case PIECE_TYPES.CHARIOT:
      return getChariotMoves(board, row, col)
    case PIECE_TYPES.CANNON:
      return getCannonMoves(board, row, col)
    case PIECE_TYPES.PAWN:
      return getPawnMoves(board, row, col, piece.color)
    default:
      return []
  }
}

// 检查是否将死
export function isCheckmate(board, color) {
  // 如果没有被将军，就不是将死
  if (!isInCheck(board, color)) return false

  // 检查是否有任何合法移动
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c]
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, r, c)
        if (moves.length > 0) return false
      }
    }
  }

  return true
}

// AI评估棋盘局势
export function evaluateBoard(board, color) {
  let score = 0

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c]
      if (piece) {
        const value = PIECE_VALUES[piece.type]
        // 位置加成
        let positionBonus = 0

        // 兵/卒过河加分
        if (piece.type === PIECE_TYPES.PAWN) {
          if (piece.color === COLORS.RED && r <= 4) {
            positionBonus = 10
          } else if (piece.color === COLORS.BLACK && r >= 5) {
            positionBonus = 10
          }
        }

        // 车、马、炮在中心位置加分
        if (piece.type === PIECE_TYPES.CHARIOT ||
            piece.type === PIECE_TYPES.HORSE ||
            piece.type === PIECE_TYPES.CANNON) {
          const centerCol = Math.abs(c - 4)
          positionBonus = (4 - centerCol) * 2
        }

        if (piece.color === color) {
          score += value + positionBonus
        } else {
          score -= value + positionBonus
        }
      }
    }
  }

  // 将军加分
  const opponentColor = color === COLORS.RED ? COLORS.BLACK : COLORS.RED
  if (isInCheck(board, opponentColor)) {
    score += 50
  }
  if (isInCheck(board, color)) {
    score -= 50
  }

  return score
}

// AI获取最佳移动（使用极小极大算法）
export function getAIMove(board, color, depth = 3) {
  const moves = getAllMoves(board, color)
  if (moves.length === 0) return null

  let bestMove = null
  let bestScore = -Infinity

  for (const move of moves) {
    const newBoard = makeMove(board, move.fromRow, move.fromCol, move.toRow, move.toCol)
    const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false, color)

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

// 极小极大算法
function minimax(board, depth, alpha, beta, isMaximizing, aiColor) {
  if (depth === 0) {
    return evaluateBoard(board, aiColor)
  }

  const currentColor = isMaximizing ? aiColor : (aiColor === COLORS.RED ? COLORS.BLACK : COLORS.RED)
  const moves = getAllMoves(board, currentColor)

  if (moves.length === 0) {
    if (isInCheck(board, currentColor)) {
      return isMaximizing ? -10000 : 10000
    }
    return 0
  }

  if (isMaximizing) {
    let maxEval = -Infinity
    for (const move of moves) {
      const newBoard = makeMove(board, move.fromRow, move.fromCol, move.toRow, move.toCol)
      const eval_ = minimax(newBoard, depth - 1, alpha, beta, false, aiColor)
      maxEval = Math.max(maxEval, eval_)
      alpha = Math.max(alpha, eval_)
      if (beta <= alpha) break
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const move of moves) {
      const newBoard = makeMove(board, move.fromRow, move.fromCol, move.toRow, move.toCol)
      const eval_ = minimax(newBoard, depth - 1, alpha, beta, true, aiColor)
      minEval = Math.min(minEval, eval_)
      beta = Math.min(beta, eval_)
      if (beta <= alpha) break
    }
    return minEval
  }
}

// 获取所有合法移动
export function getAllMoves(board, color) {
  const moves = []

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c]
      if (piece && piece.color === color) {
        const pieceMoves = getValidMoves(board, r, c)
        for (const move of pieceMoves) {
          moves.push({
            fromRow: r,
            fromCol: c,
            toRow: move.row,
            toCol: move.col
          })
        }
      }
    }
  }

  return moves
}
