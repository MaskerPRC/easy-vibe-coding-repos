import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 3002; // 后端端口 3002，前端 5173

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// API 路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取数据示例
app.get('/api/data', async (req, res) => {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(fileData);
    res.json({
      message: '这是来自后端的数据',
      data: parsedData
    });
  } catch (error) {
    console.error('读取数据失败:', error);
    // 如果文件不存在或读取失败，返回默认数据
    res.json({
      message: '这是来自后端的数据',
      data: {
        count: 0,
        items: []
      }
    });
  }
});

// 更新数据示例
app.post('/api/data', async (req, res) => {
  try {
    const { count } = req.body;
    console.log('收到更新请求，count =', count);
    console.log('数据文件路径:', DATA_FILE);

    // 读取现有数据
    let currentData = { count: 0, items: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
      console.log('读取到现有数据:', currentData);
    } catch (error) {
      // 文件不存在或读取失败，使用默认数据
      console.log('使用默认数据, 错误:', error.message);
    }

    // 更新 count 值
    currentData.count = count;
    console.log('准备保存的数据:', currentData);

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log('数据已写入文件');

    // 验证写入
    const savedData = await fs.readFile(DATA_FILE, 'utf-8');
    console.log('验证写入后的文件内容:', savedData);

    res.json({
      success: true,
      message: '数据已更新并保存',
      data: currentData
    });
  } catch (error) {
    console.error('保存数据失败:', error);
    res.status(500).json({
      success: false,
      message: '保存数据失败: ' + error.message
    });
  }
});

// 获取配置
app.get('/api/config', (req, res) => {
  res.json({
    appName: '应用项目',
    version: '1.0.0',
    features: ['前端', '后端', 'API']
  });
});

// 随机数学模型参数生成
app.get('/api/math-model/random', (req, res) => {
  // 生成随机的洛伦兹吸引子参数
  const params = {
    sigma: 8 + Math.random() * 4,  // 8-12
    rho: 20 + Math.random() * 20,  // 20-40
    beta: 2 + Math.random() * 2    // 2-4
  };

  res.json({
    name: '洛伦兹吸引子',
    description: '一个经典的混沌系统，展示了确定性系统中的混沌行为',
    params: params,
    timestamp: new Date().toISOString()
  });
});

// FPS 游戏统计数据接口
app.get('/api/fps/stats', (req, res) => {
  // 模拟返回 FPS 游戏统计数据
  const gameStats = {
    success: true,
    playerStats: {
      totalKills: Math.floor(Math.random() * 1000) + 500,
      totalDeaths: Math.floor(Math.random() * 800) + 300,
      totalMatches: Math.floor(Math.random() * 200) + 50,
      winRate: (45 + Math.random() * 20).toFixed(1),
      headShotRate: (15 + Math.random() * 25).toFixed(1),
      accuracy: (35 + Math.random() * 30).toFixed(1),
      favoriteWeapon: 'AK-47'
    },
    leaderboard: [
      { rank: 1, name: 'ProGamer123', kills: 2847, kd: 3.2 },
      { rank: 2, name: 'SniperKing', kills: 2654, kd: 2.9 },
      { rank: 3, name: 'HeadShot_Master', kills: 2431, kd: 2.7 },
      { rank: 4, name: 'TacticalPlayer', kills: 2298, kd: 2.5 },
      { rank: 5, name: 'RushB_Expert', kills: 2145, kd: 2.3 }
    ],
    weapons: [
      { name: 'AK-47', damage: 36, fireRate: 600, accuracy: 70 },
      { name: 'M4A1', damage: 33, fireRate: 666, accuracy: 75 },
      { name: 'AWP', damage: 115, fireRate: 41, accuracy: 98 },
      { name: 'Desert Eagle', damage: 63, fireRate: 267, accuracy: 65 },
      { name: 'MP5', damage: 26, fireRate: 800, accuracy: 68 }
    ],
    maps: [
      { name: 'Dust 2', playCount: 156, winRate: 52 },
      { name: 'Inferno', playCount: 134, winRate: 48 },
      { name: 'Mirage', playCount: 128, winRate: 51 },
      { name: 'Nuke', playCount: 98, winRate: 45 }
    ],
    timestamp: new Date().toISOString()
  };

  res.json(gameStats);
});

// FPS 游戏保存比赛记录
app.post('/api/fps/match', (req, res) => {
  const { kills, deaths, damage, accuracy } = req.body;

  res.json({
    success: true,
    message: '比赛记录已保存',
    data: {
      kills,
      deaths,
      damage,
      accuracy,
      kd: deaths > 0 ? (kills / deaths).toFixed(2) : kills,
      timestamp: new Date().toISOString()
    }
  });
});

// 英雄联盟总决赛数据接口
app.get('/api/lol/match-data', (req, res) => {
  // 模拟返回英雄联盟总决赛数据
  const matchData = {
    success: true,
    currentMatch: {
      teamA: {
        name: 'T1',
        region: 'LCK',
        logo: 'https://via.placeholder.com/80/003057/FFFFFF?text=T1'
      },
      teamB: {
        name: 'BLG',
        region: 'LPL',
        logo: 'https://via.placeholder.com/80/C8102E/FFFFFF?text=BLG'
      },
      scoreA: 3,
      scoreB: 2,
      status: 'finished'
    },
    stats: {
      totalKills: 1247 + Math.floor(Math.random() * 100),
      totalGames: 73,
      avgGameTime: '32:15',
      firstBloodRate: 65 + Math.floor(Math.random() * 10)
    },
    metrics: [
      { label: '场均击杀', teamA: 15.2, teamB: 14.8, name: 'kills' },
      { label: '场均死亡', teamA: 12.3, teamB: 13.1, name: 'deaths' },
      { label: '场均助攻', teamA: 34.5, teamB: 32.8, name: 'assists' },
      { label: '场均推塔', teamA: 7.2, teamB: 6.9, name: 'towers' },
      { label: '场均经济', teamA: 58.2, teamB: 56.7, name: 'gold' },
      { label: '场均大龙', teamA: 1.8, teamB: 1.5, name: 'baron' }
    ],
    players: [
      {
        id: 1,
        name: 'Faker',
        team: 'T1',
        role: '中单',
        kda: (8 + Math.random() * 2).toFixed(1),
        avatar: 'https://via.placeholder.com/60/4169E1/FFFFFF?text=FK'
      },
      {
        id: 2,
        name: 'Elk',
        team: 'BLG',
        role: 'ADC',
        kda: (7 + Math.random() * 2).toFixed(1),
        avatar: 'https://via.placeholder.com/60/DC143C/FFFFFF?text=EK'
      },
      {
        id: 3,
        name: 'Zeus',
        team: 'T1',
        role: '上单',
        kda: (6 + Math.random() * 2).toFixed(1),
        avatar: 'https://via.placeholder.com/60/4169E1/FFFFFF?text=ZS'
      },
      {
        id: 4,
        name: 'Knight',
        team: 'BLG',
        role: '中单',
        kda: (6 + Math.random() * 2).toFixed(1),
        avatar: 'https://via.placeholder.com/60/DC143C/FFFFFF?text=KT'
      },
      {
        id: 5,
        name: 'Gumayusi',
        team: 'T1',
        role: 'ADC',
        kda: (5.5 + Math.random() * 2).toFixed(1),
        avatar: 'https://via.placeholder.com/60/4169E1/FFFFFF?text=GM'
      }
    ],
    matchHistory: [
      { id: 1, date: '11-02', teamA: 'T1', teamB: 'BLG', scoreA: 3, scoreB: 2, winner: 'A', stage: '决赛' },
      { id: 2, date: '10-30', teamA: 'T1', teamB: 'GEN', scoreA: 3, scoreB: 1, winner: 'A', stage: '半决赛' },
      { id: 3, date: '10-27', teamA: 'BLG', teamB: 'WBG', scoreA: 3, scoreB: 1, winner: 'A', stage: '半决赛' },
      { id: 4, date: '10-24', teamA: 'T1', teamB: 'DK', scoreA: 3, scoreB: 0, winner: 'A', stage: '8强赛' },
      { id: 5, date: '10-23', teamA: 'BLG', teamB: 'HLE', scoreA: 3, scoreB: 2, winner: 'A', stage: '8强赛' }
    ],
    timestamp: new Date().toISOString()
  };

  res.json(matchData);
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
  console.log(`数据文件路径: ${DATA_FILE}`);
  console.log(`__dirname: ${__dirname}`);
});

