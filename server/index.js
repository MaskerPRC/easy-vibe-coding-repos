import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ============ 内存数据存储 ============
// 在线用户列表 {socketId: userInfo}
const onlineUsers = new Map();
// 等待匹配的用户队列
const matchQueue = [];
// 进行中的游戏 {gameId: gameData}
const activeGames = new Map();
// 历史对局（最近100局）
const gameHistory = [];
// 观战者 {gameId: [socketIds]}
const spectators = new Map();

// ============ 工具函数 ============
// 随机用户名生成
const adjectives = ['莽撞的', '沉思的', '勇敢的', '狡猾的', '憨厚的', '机智的', '淡定的', '激动的', '冷静的', '热情的', '呆萌的', '灵动的', '慵懒的', '活泼的', '严肃的', '幽默的', '神秘的', '开朗的', '忧郁的', '豪迈的'];
const animals = ['企鹅', '芋头', '熊猫', '狐狸', '海豹', '考拉', '松鼠', '浣熊', '猫头鹰', '仓鼠', '树懒', '水獭', '刺猬', '兔子', '企鹅', '猴子', '袋鼠', '河马', '长颈鹿', '海豚'];

function generateUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj}${animal}`;
}

// 生成游戏ID
function generateGameId() {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 获取浏览器图标
function getBrowserIcon(userAgent) {
  if (!userAgent) return '🌐';
  if (userAgent.includes('Firefox')) return '🦊';
  if (userAgent.includes('Chrome')) return '🌐';
  if (userAgent.includes('Safari')) return '🧭';
  if (userAgent.includes('Edge')) return '🌊';
  return '🌐';
}

// 模拟IP归属地（实际应用中应使用IP数据库）
const provinces = ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '山东', '河南', '福建'];
function getProvince() {
  return provinces[Math.floor(Math.random() * provinces.length)];
}

// ============ 游戏逻辑 ============
// 检查五连
function checkWin(board, row, col, color) {
  const directions = [
    [[0, 1], [0, -1]],   // 横向
    [[1, 0], [-1, 0]],   // 纵向
    [[1, 1], [-1, -1]],  // 主对角线
    [[1, -1], [-1, 1]]   // 副对角线
  ];

  for (const direction of directions) {
    let count = 1;
    for (const [dx, dy] of direction) {
      let x = row + dx;
      let y = col + dy;
      while (x >= 0 && x < 15 && y >= 0 && y < 15 && board[x][y] === color) {
        count++;
        x += dx;
        y += dy;
      }
    }
    if (count >= 5) return true;
  }
  return false;
}

// 创建新游戏
function createGame(player1, player2) {
  const gameId = generateGameId();
  const game = {
    id: gameId,
    players: {
      black: player1,
      white: player2
    },
    board: Array(15).fill(null).map(() => Array(15).fill(null)),
    currentTurn: 'black',
    moves: [],
    skills: {
      black: {
        points: 3,
        used: {
          '飞沙走石': 0,
          '力拔山兮': 0,
          '静如止水': 0,
          '两级反转': 0,
          '时光倒流': 0,
          '暗度陈仓': 0
        },
        cooldowns: {},
        selectedSkills: player1.selectedSkills || []
      },
      white: {
        points: 3,
        used: {
          '飞沙走石': 0,
          '力拔山兮': 0,
          '静如止水': 0,
          '两级反转': 0,
          '时光倒流': 0,
          '暗度陈仓': 0
        },
        cooldowns: {},
        selectedSkills: player2.selectedSkills || []
      }
    },
    status: 'playing',
    startTime: Date.now(),
    turnStartTime: Date.now(),
    frozenUntil: null,
    randomEventCounter: 0
  };

  activeGames.set(gameId, game);
  spectators.set(gameId, []);
  return game;
}

// 技能效果实现
function applySkill(game, skillName, playerColor, targetData) {
  const skill = game.skills[playerColor];

  switch (skillName) {
    case '飞沙走石':
      // 移除对手的一枚棋子
      if (targetData && targetData.row !== undefined && targetData.col !== undefined) {
        game.board[targetData.row][targetData.col] = null;
        skill.used['飞沙走石']++;
        skill.cooldowns['飞沙走石'] = game.moves.length + 2;
      }
      break;

    case '力拔山兮':
      // 掀翻棋盘，平局
      game.status = 'draw';
      game.drawReason = '力拔山兮 - 掀翻棋盘';
      skill.used['力拔山兮']++;
      break;

    case '静如止水':
      // 冻结对手10秒
      game.frozenUntil = Date.now() + 10000;
      skill.used['静如止水']++;
      skill.cooldowns['静如止水'] = game.moves.length + 3;
      break;

    case '两级反转':
      // 翻转棋盘180度
      const newBoard = Array(15).fill(null).map(() => Array(15).fill(null));
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          newBoard[i][j] = game.board[14 - i][14 - j];
        }
      }
      game.board = newBoard;
      skill.used['两级反转']++;
      break;

    case '时光倒流':
      // 回退一步（双方各退一步）
      if (game.moves.length >= 2) {
        const lastMove1 = game.moves.pop();
        const lastMove2 = game.moves.pop();
        if (lastMove1) game.board[lastMove1.row][lastMove1.col] = null;
        if (lastMove2) game.board[lastMove2.row][lastMove2.col] = null;
        game.currentTurn = lastMove2 ? lastMove2.color : game.currentTurn;
      }
      skill.used['时光倒流']++;
      skill.cooldowns['时光倒流'] = game.moves.length + 2;
      break;

    case '暗度陈仓':
      // 下一次落子可以覆盖已有棋子（通过标记实现）
      skill.canOverride = true;
      skill.used['暗度陈仓']++;
      skill.cooldowns['暗度陈仓'] = game.moves.length + 4;
      break;
  }

  return game;
}

// ============ Socket.IO 事件处理 ============
io.on('connection', (socket) => {
  console.log(`新连接: ${socket.id}`);

  // 用户连接
  socket.on('user:connect', (userData) => {
    const userInfo = {
      socketId: socket.id,
      username: userData.username || generateUsername(),
      province: getProvince(),
      browserIcon: getBrowserIcon(socket.handshake.headers['user-agent']),
      connectedAt: Date.now(),
      status: 'online'
    };

    onlineUsers.set(socket.id, userInfo);
    socket.emit('user:info', userInfo);

    // 广播在线人数
    io.emit('stats:update', {
      onlineUsers: onlineUsers.size,
      activeGames: activeGames.size,
      queueLength: matchQueue.length
    });
  });

  // 快速匹配
  socket.on('match:quick', (data) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    // 添加用户到匹配队列
    user.selectedSkills = data.selectedSkills || [];
    matchQueue.push(socket.id);

    // 尝试匹配
    if (matchQueue.length >= 2) {
      const player1Id = matchQueue.shift();
      const player2Id = matchQueue.shift();

      const player1 = onlineUsers.get(player1Id);
      const player2 = onlineUsers.get(player2Id);

      if (player1 && player2) {
        const game = createGame(player1, player2);

        // 通知双方玩家
        io.to(player1Id).emit('match:found', {
          gameId: game.id,
          color: 'black',
          opponent: player2,
          game: game
        });

        io.to(player2Id).emit('match:found', {
          gameId: game.id,
          color: 'white',
          opponent: player1,
          game: game
        });

        // 将玩家加入游戏房间
        io.sockets.sockets.get(player1Id)?.join(game.id);
        io.sockets.sockets.get(player2Id)?.join(game.id);
      }
    } else {
      socket.emit('match:waiting');
    }

    // 更新统计
    io.emit('stats:update', {
      onlineUsers: onlineUsers.size,
      activeGames: activeGames.size,
      queueLength: matchQueue.length
    });
  });

  // 落子
  socket.on('game:move', ({ gameId, row, col }) => {
    const game = activeGames.get(gameId);
    if (!game || game.status !== 'playing') return;

    const user = onlineUsers.get(socket.id);
    const playerColor = game.players.black.socketId === socket.id ? 'black' : 'white';

    // 检查是否轮到该玩家
    if (game.currentTurn !== playerColor) {
      socket.emit('game:error', { message: '还没轮到你' });
      return;
    }

    // 检查是否被冻结
    if (game.frozenUntil && Date.now() < game.frozenUntil && playerColor === game.currentTurn) {
      socket.emit('game:error', { message: '你被冻结了' });
      return;
    }

    // 检查位置是否有效
    const canOverride = game.skills[playerColor].canOverride;
    if (!canOverride && game.board[row][col] !== null) {
      socket.emit('game:error', { message: '该位置已有棋子' });
      return;
    }

    // 落子
    game.board[row][col] = playerColor;
    game.moves.push({ row, col, color: playerColor, timestamp: Date.now() });

    // 重置覆盖标记
    if (canOverride) {
      game.skills[playerColor].canOverride = false;
    }

    // 检查是否获胜
    if (checkWin(game.board, row, col, playerColor)) {
      game.status = 'finished';
      game.winner = playerColor;
      game.endTime = Date.now();

      // 保存到历史
      gameHistory.unshift({
        ...game,
        savedAt: Date.now()
      });

      // 只保留最近100局
      if (gameHistory.length > 100) {
        gameHistory.pop();
      }

      // 通知所有人游戏结束
      io.to(gameId).emit('game:end', {
        winner: playerColor,
        game: game
      });

      // 通知观众
      const watchers = spectators.get(gameId) || [];
      watchers.forEach(watcherId => {
        io.to(watcherId).emit('game:end', {
          winner: playerColor,
          game: game
        });
      });

      return;
    }

    // 切换回合
    game.currentTurn = playerColor === 'black' ? 'white' : 'black';
    game.turnStartTime = Date.now();
    game.randomEventCounter++;

    // 随机事件：每15手触发一次
    if (game.randomEventCounter % 15 === 0) {
      const emptySpots = [];
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          if (game.board[i][j] === null) {
            emptySpots.push({ row: i, col: j });
          }
        }
      }

      if (emptySpots.length > 0) {
        const randomSpot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        const randomColor = Math.random() > 0.5 ? 'black' : 'white';
        game.board[randomSpot.row][randomSpot.col] = randomColor;

        io.to(gameId).emit('game:random-event', {
          row: randomSpot.row,
          col: randomSpot.col,
          color: randomColor
        });
      }
    }

    // 广播游戏状态
    io.to(gameId).emit('game:update', game);

    // 通知观众
    const watchers = spectators.get(gameId) || [];
    watchers.forEach(watcherId => {
      io.to(watcherId).emit('game:update', game);
    });
  });

  // 使用技能
  socket.on('game:skill', ({ gameId, skillName, targetData }) => {
    const game = activeGames.get(gameId);
    if (!game || game.status !== 'playing') return;

    const playerColor = game.players.black.socketId === socket.id ? 'black' : 'white';
    const skill = game.skills[playerColor];

    // 检查技能点
    const skillCosts = {
      '飞沙走石': 1,
      '力拔山兮': 3,
      '静如止水': 1,
      '两级反转': 2,
      '时光倒流': 1,
      '暗度陈仓': 1
    };

    const cost = skillCosts[skillName] || 0;
    if (skill.points < cost) {
      socket.emit('game:error', { message: '技能点不足' });
      return;
    }

    // 检查使用次数限制
    const useLimits = {
      '飞沙走石': 2,
      '力拔山兮': 1,
      '静如止水': 1,
      '两级反转': 1,
      '时光倒流': 2,
      '暗度陈仓': 1
    };

    if (skill.used[skillName] >= useLimits[skillName]) {
      socket.emit('game:error', { message: '该技能已达使用上限' });
      return;
    }

    // 检查冷却
    if (skill.cooldowns[skillName] && game.moves.length < skill.cooldowns[skillName]) {
      socket.emit('game:error', { message: '技能冷却中' });
      return;
    }

    // 扣除技能点
    skill.points -= cost;

    // 应用技能效果
    applySkill(game, skillName, playerColor, targetData);

    // 广播技能使用
    io.to(gameId).emit('game:skill-used', {
      playerColor,
      skillName,
      game
    });

    // 通知观众
    const watchers = spectators.get(gameId) || [];
    watchers.forEach(watcherId => {
      io.to(watcherId).emit('game:skill-used', {
        playerColor,
        skillName,
        game
      });
    });

    // 如果技能导致游戏结束
    if (game.status === 'draw') {
      game.endTime = Date.now();

      gameHistory.unshift({
        ...game,
        savedAt: Date.now()
      });

      if (gameHistory.length > 100) {
        gameHistory.pop();
      }

      io.to(gameId).emit('game:end', {
        winner: null,
        game: game
      });

      watchers.forEach(watcherId => {
        io.to(watcherId).emit('game:end', {
          winner: null,
          game: game
        });
      });
    }
  });

  // 观战
  socket.on('spectate:join', ({ gameId }) => {
    const game = activeGames.get(gameId);
    if (!game) {
      socket.emit('spectate:error', { message: '游戏不存在' });
      return;
    }

    const watchers = spectators.get(gameId) || [];
    if (!watchers.includes(socket.id)) {
      watchers.push(socket.id);
      spectators.set(gameId, watchers);
    }

    socket.join(gameId);
    socket.emit('spectate:joined', { game });
  });

  // 发送弹幕
  socket.on('chat:message', ({ gameId, message }) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    const chatMessage = {
      username: user.username,
      province: user.province,
      message: message,
      timestamp: Date.now()
    };

    // 广播给游戏房间的所有人
    io.to(gameId).emit('chat:message', chatMessage);
  });

  // 获取游戏列表
  socket.on('games:list', () => {
    const gamesList = Array.from(activeGames.values()).map(game => ({
      id: game.id,
      players: {
        black: game.players.black.username,
        white: game.players.white.username
      },
      status: game.status,
      moves: game.moves.length,
      spectators: spectators.get(game.id)?.length || 0
    }));

    socket.emit('games:list', gamesList);
  });

  // 获取历史对局
  socket.on('history:list', () => {
    const historyList = gameHistory.slice(0, 50).map(game => ({
      id: game.id,
      players: {
        black: game.players.black.username,
        white: game.players.white.username
      },
      winner: game.winner,
      moves: game.moves.length,
      duration: game.endTime - game.startTime,
      savedAt: game.savedAt
    }));

    socket.emit('history:list', historyList);
  });

  // 获取历史对局详情
  socket.on('history:get', ({ gameId }) => {
    const game = gameHistory.find(g => g.id === gameId);
    if (game) {
      socket.emit('history:game', game);
    }
  });

  // 断线处理
  socket.on('disconnect', () => {
    console.log(`断开连接: ${socket.id}`);

    // 从匹配队列中移除
    const queueIndex = matchQueue.indexOf(socket.id);
    if (queueIndex !== -1) {
      matchQueue.splice(queueIndex, 1);
    }

    // 从在线用户中移除
    onlineUsers.delete(socket.id);

    // 处理游戏中断线
    activeGames.forEach((game, gameId) => {
      if (game.players.black.socketId === socket.id || game.players.white.socketId === socket.id) {
        const disconnectedColor = game.players.black.socketId === socket.id ? 'black' : 'white';
        const winner = disconnectedColor === 'black' ? 'white' : 'black';

        game.status = 'finished';
        game.winner = winner;
        game.endTime = Date.now();
        game.disconnected = true;

        io.to(gameId).emit('game:end', {
          winner: winner,
          game: game,
          reason: 'opponent_disconnected'
        });
      }
    });

    // 更新统计
    io.emit('stats:update', {
      onlineUsers: onlineUsers.size,
      activeGames: activeGames.size,
      queueLength: matchQueue.length
    });
  });
});

// ============ HTTP API ============
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString(),
    stats: {
      onlineUsers: onlineUsers.size,
      activeGames: activeGames.size,
      queueLength: matchQueue.length,
      historyGames: gameHistory.length
    }
  });
});

// 获取游戏列表API
app.get('/api/games', (req, res) => {
  const gamesList = Array.from(activeGames.values()).map(game => ({
    id: game.id,
    players: {
      black: game.players.black.username,
      white: game.players.white.username
    },
    status: game.status,
    moves: game.moves.length,
    spectators: spectators.get(game.id)?.length || 0
  }));
  res.json(gamesList);
});

// 获取历史对局API
app.get('/api/history', (req, res) => {
  const historyList = gameHistory.slice(0, 50).map(game => ({
    id: game.id,
    players: {
      black: game.players.black.username,
      white: game.players.white.username
    },
    winner: game.winner,
    moves: game.moves.length,
    duration: game.endTime - game.startTime,
    savedAt: game.savedAt
  }));
  res.json(historyList);
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

httpServer.listen(PORT, () => {
  console.log(`🎮 技能五子棋服务器运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
});
