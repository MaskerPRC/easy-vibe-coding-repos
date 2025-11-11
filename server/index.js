import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// =====================================================
// 内存存储 - 玩家数据
// =====================================================
// 使用内存Map存储玩家统计数据（重启后数据会丢失，这是正常的）
const playerStats = new Map();

// =====================================================
// 内存存储 - IP 访问记录
// =====================================================
// 使用数组存储 IP 访问记录，最多保存 200 条
const ipRecords = [];

// 初始化默认玩家数据
const initializePlayerStats = () => {
  if (!playerStats.has('default')) {
    playerStats.set('default', {
      wins: 0,
      losses: 0,
      kills: 0,
      deaths: 0,
      accuracy: 0,
      rank: 'Silver I',
      gamesPlayed: 0,
      totalShots: 0,
      totalHits: 0
    });
  }
};

// 计算排名
const calculateRank = (wins) => {
  if (wins >= 50) return 'Global Elite';
  if (wins >= 40) return 'Supreme Master';
  if (wins >= 30) return 'Legendary Eagle';
  if (wins >= 20) return 'Master Guardian';
  if (wins >= 10) return 'Gold Nova';
  if (wins >= 5) return 'Silver Elite';
  return 'Silver I';
};

// =====================================================
// API 路由
// =====================================================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString(),
    playersInMemory: playerStats.size
  });
});

// 获取玩家统计数据
app.get('/api/player/stats', (req, res) => {
  initializePlayerStats();
  const stats = playerStats.get('default');

  res.json({
    wins: stats.wins,
    losses: stats.losses,
    kills: stats.kills,
    deaths: stats.deaths,
    accuracy: stats.accuracy,
    rank: stats.rank,
    gamesPlayed: stats.gamesPlayed
  });
});

// 保存游戏结果
app.post('/api/player/stats', (req, res) => {
  initializePlayerStats();

  const { kills, deaths, accuracy, won } = req.body;
  const stats = playerStats.get('default');

  // 更新统计数据
  stats.kills += kills || 0;
  stats.deaths += deaths || 0;
  stats.gamesPlayed += 1;

  if (won) {
    stats.wins += 1;
  } else {
    stats.losses += 1;
  }

  // 更新精确度（加权平均）
  if (accuracy && stats.gamesPlayed > 0) {
    stats.accuracy = ((stats.accuracy * (stats.gamesPlayed - 1)) + parseFloat(accuracy)) / stats.gamesPlayed;
    stats.accuracy = Math.round(stats.accuracy * 10) / 10; // 保留一位小数
  }

  // 更新排名
  stats.rank = calculateRank(stats.wins);

  // 保存回Map
  playerStats.set('default', stats);

  res.json({
    success: true,
    stats: {
      wins: stats.wins,
      losses: stats.losses,
      kills: stats.kills,
      deaths: stats.deaths,
      accuracy: stats.accuracy,
      rank: stats.rank
    }
  });
});

// 重置玩家统计数据
app.post('/api/player/reset', (req, res) => {
  playerStats.set('default', {
    wins: 0,
    losses: 0,
    kills: 0,
    deaths: 0,
    accuracy: 0,
    rank: 'Silver I',
    gamesPlayed: 0,
    totalShots: 0,
    totalHits: 0
  });

  res.json({
    success: true,
    message: 'Player stats reset successfully'
  });
});

// 获取排行榜（扩展功能 - 目前只有一个玩家）
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = [];

  playerStats.forEach((stats, playerId) => {
    leaderboard.push({
      playerId,
      wins: stats.wins,
      kills: stats.kills,
      rank: stats.rank,
      kdRatio: stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats.kills.toFixed(2)
    });
  });

  // 按胜场排序
  leaderboard.sort((a, b) => b.wins - a.wins);

  res.json({
    leaderboard,
    totalPlayers: leaderboard.length
  });
});

// =====================================================
// IP 访问记录 API
// =====================================================

// 保存 IP 访问记录
app.post('/api/ip-records', (req, res) => {
  try {
    const { publicIp, localIp, userAgent } = req.body;

    // 获取客户端真实IP（考虑代理情况）
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] ||
                     req.headers['x-real-ip'] ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress;

    const timestamp = new Date().toISOString();

    // 创建唯一标识（基于公网IP和内网IP的组合）
    const uniqueKey = `${publicIp || 'unknown'}_${localIp || 'unknown'}`;

    // 去重：如果已存在相同的IP组合，删除旧记录
    const existingIndex = ipRecords.findIndex(record =>
      record.uniqueKey === uniqueKey
    );

    if (existingIndex !== -1) {
      ipRecords.splice(existingIndex, 1);
    }

    // 添加新记录到开头
    ipRecords.unshift({
      uniqueKey,
      publicIp: publicIp || 'N/A',
      localIp: localIp || 'N/A',
      serverIp: clientIp,
      userAgent: userAgent || 'Unknown',
      timestamp
    });

    // 限制最多保存 200 条记录
    if (ipRecords.length > 200) {
      ipRecords.length = 200;
    }

    res.json({
      success: true,
      message: 'IP record saved successfully',
      totalRecords: ipRecords.length
    });
  } catch (error) {
    console.error('Error saving IP record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save IP record',
      message: error.message
    });
  }
});

// 获取 IP 访问记录列表
app.get('/api/ip-records', (req, res) => {
  try {
    // 返回所有记录，已按访问时间排序（最新的在前面）
    res.json({
      success: true,
      records: ipRecords,
      totalRecords: ipRecords.length
    });
  } catch (error) {
    console.error('Error fetching IP records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch IP records',
      message: error.message
    });
  }
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
  console.log(`======================================`);
  console.log(`Counter-Strike: Web Edition - Server`);
  console.log(`======================================`);
  console.log(`Server running on port: ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Player stats: http://localhost:${PORT}/api/player/stats`);
  console.log(`======================================`);
  console.log(`Data storage: In-Memory (resets on restart)`);
  console.log(`======================================`);
});

