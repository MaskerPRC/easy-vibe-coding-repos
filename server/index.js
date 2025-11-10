import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import fsSync from 'fs';
import axios from 'axios';
import os from 'os';

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

// 文件浏览器API - 列出目录内容
app.get('/api/files', async (req, res) => {
  try {
    // 获取查询参数中的路径，默认为用户home目录
    let requestedPath = req.query.path || os.homedir();

    console.log('请求路径:', requestedPath);

    // 安全检查：解析真实路径
    const realPath = path.resolve(requestedPath);
    console.log('真实路径:', realPath);

    // 检查路径是否存在
    try {
      await fs.access(realPath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: '路径不存在',
        path: requestedPath
      });
    }

    // 获取路径信息
    const stats = await fs.stat(realPath);

    // 如果是文件，返回文件信息
    if (stats.isFile()) {
      return res.json({
        success: true,
        type: 'file',
        path: realPath,
        name: path.basename(realPath),
        size: stats.size,
        modified: stats.mtime,
        timestamp: new Date().toISOString()
      });
    }

    // 如果是目录，列出内容
    const files = await fs.readdir(realPath);
    const fileList = [];

    for (const file of files) {
      try {
        const filePath = path.join(realPath, file);
        const fileStats = await fs.stat(filePath);

        fileList.push({
          name: file,
          path: filePath,
          type: fileStats.isDirectory() ? 'directory' : 'file',
          size: fileStats.size,
          modified: fileStats.mtime,
          isHidden: file.startsWith('.')
        });
      } catch (error) {
        // 跳过无法访问的文件
        console.log('无法访问文件:', file, error.message);
      }
    }

    // 排序：目录在前，然后按名称排序
    fileList.sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });

    res.json({
      success: true,
      type: 'directory',
      path: realPath,
      parent: path.dirname(realPath),
      files: fileList,
      totalFiles: fileList.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('读取目录失败:', error);
    res.status(500).json({
      success: false,
      error: '读取目录失败',
      message: error.message
    });
  }
});

// 读取文件内容API
app.get('/api/files/read', async (req, res) => {
  try {
    const requestedPath = req.query.path;

    if (!requestedPath) {
      return res.status(400).json({
        success: false,
        error: '未提供文件路径'
      });
    }

    const realPath = path.resolve(requestedPath);

    // 检查文件是否存在
    try {
      await fs.access(realPath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: '文件不存在',
        path: requestedPath
      });
    }

    const stats = await fs.stat(realPath);

    if (!stats.isFile()) {
      return res.status(400).json({
        success: false,
        error: '路径不是文件'
      });
    }

    // 限制文件大小为1MB
    if (stats.size > 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: '文件太大，无法读取（限制1MB）'
      });
    }

    const content = await fs.readFile(realPath, 'utf-8');

    res.json({
      success: true,
      path: realPath,
      name: path.basename(realPath),
      content: content,
      size: stats.size,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('读取文件失败:', error);
    res.status(500).json({
      success: false,
      error: '读取文件失败',
      message: error.message
    });
  }
});

// 获取外部网站源码
app.get('/api/fetch-source', async (req, res) => {
  try {
    console.log('正在请求 https://play.apexstone.ai/ ...');
    const response = await axios.get('https://play.apexstone.ai/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10秒超时
    });

    console.log('成功获取源码，长度:', response.data.length);

    res.json({
      success: true,
      source: response.data,
      url: 'https://play.apexstone.ai/',
      length: response.data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取源码失败:', error.message);
    res.status(500).json({
      success: false,
      error: '获取源码失败',
      message: error.message,
      url: 'https://play.apexstone.ai/',
      timestamp: new Date().toISOString()
    });
  }
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

// 2025年英雄联盟全球总决赛数据接口
app.get('/api/lol/worlds-2025', (req, res) => {
  // 2025年世界赛冠军和赛程数据
  const worldsData = {
    success: true,
    champion: {
      name: 'T1',
      region: 'LCK (韩国)',
      members: [
        { name: 'Zeus', realName: '최우제', role: '上单 (Top)' },
        { name: 'Oner', realName: '문현준', role: '打野 (Jungle)' },
        { name: 'Faker', realName: '이상혁', role: '中单 (Mid)' },
        { name: 'Gumayusi', realName: '이민형', role: 'ADC (Bot)' },
        { name: 'Keria', realName: '류민석', role: '辅助 (Support)' }
      ]
    },
    schedule: [
      // 入围赛
      {
        id: 1,
        date: '2025-09-25',
        time: '17:00 CST',
        stage: '入围赛',
        team1: 'PSG',
        team2: 'R7',
        score1: 3,
        score2: 0,
        location: '柏林 - 奔驰竞技场'
      },
      {
        id: 2,
        date: '2025-09-26',
        time: '17:00 CST',
        stage: '入围赛',
        team1: 'VCS',
        team2: 'LLA',
        score1: 3,
        score2: 1,
        location: '柏林 - 奔驰竞技场'
      },
      {
        id: 3,
        date: '2025-09-27',
        time: '17:00 CST',
        stage: '入围赛',
        team1: 'PSG',
        team2: 'VCS',
        score1: 3,
        score2: 2,
        location: '柏林 - 奔驰竞技场'
      },
      // 小组赛
      {
        id: 4,
        date: '2025-10-01',
        time: '17:00 CST',
        stage: '小组赛 A组',
        team1: 'T1',
        team2: 'G2',
        score1: 1,
        score2: 0,
        location: '柏林 - 奔驰竞技场'
      },
      {
        id: 5,
        date: '2025-10-02',
        time: '17:00 CST',
        stage: '小组赛 A组',
        team1: 'BLG',
        team2: 'TL',
        score1: 1,
        score2: 0,
        location: '柏林 - 奔驰竞技场'
      },
      {
        id: 6,
        date: '2025-10-03',
        time: '17:00 CST',
        stage: '小组赛 B组',
        team1: 'GEN',
        team2: 'FNC',
        score1: 1,
        score2: 0,
        location: '柏林 - 奔驰竞技场'
      },
      {
        id: 7,
        date: '2025-10-04',
        time: '17:00 CST',
        stage: '小组赛 B组',
        team1: 'JDG',
        team2: 'C9',
        score1: 1,
        score2: 0,
        location: '柏林 - 奔驰竞技场'
      },
      {
        id: 8,
        date: '2025-10-05',
        time: '17:00 CST',
        stage: '小组赛 C组',
        team1: 'WBG',
        team2: 'DK',
        score1: 0,
        score2: 1,
        location: '柏林 - 奔驰竞技场'
      },
      {
        id: 9,
        date: '2025-10-06',
        time: '17:00 CST',
        stage: '小组赛 D组',
        team1: 'LNG',
        team2: 'MAD',
        score1: 1,
        score2: 0,
        location: '柏林 - 奔驰竞技场'
      },
      // 八强赛
      {
        id: 10,
        date: '2025-10-17',
        time: '19:00 CST',
        stage: '八强赛',
        team1: 'T1',
        team2: 'DK',
        score1: 3,
        score2: 1,
        location: '巴黎 - 天顶体育馆'
      },
      {
        id: 11,
        date: '2025-10-18',
        time: '19:00 CST',
        stage: '八强赛',
        team1: 'BLG',
        team2: 'GEN',
        score1: 3,
        score2: 2,
        location: '巴黎 - 天顶体育馆'
      },
      {
        id: 12,
        date: '2025-10-19',
        time: '19:00 CST',
        stage: '八强赛',
        team1: 'JDG',
        team2: 'G2',
        score1: 2,
        score2: 3,
        location: '巴黎 - 天顶体育馆'
      },
      {
        id: 13,
        date: '2025-10-20',
        time: '19:00 CST',
        stage: '八强赛',
        team1: 'LNG',
        team2: 'FNC',
        score1: 3,
        score2: 1,
        location: '巴黎 - 天顶体育馆'
      },
      // 半决赛
      {
        id: 14,
        date: '2025-10-26',
        time: '20:00 CST',
        stage: '半决赛',
        team1: 'T1',
        team2: 'BLG',
        score1: 3,
        score2: 1,
        location: '伦敦 - O2体育馆'
      },
      {
        id: 15,
        date: '2025-10-27',
        time: '20:00 CST',
        stage: '半决赛',
        team1: 'G2',
        team2: 'LNG',
        score1: 2,
        score2: 3,
        location: '伦敦 - O2体育馆'
      },
      // 决赛
      {
        id: 16,
        date: '2025-11-02',
        time: '21:00 CST',
        stage: '决赛',
        team1: 'T1',
        team2: 'LNG',
        score1: 3,
        score2: 2,
        location: '伦敦 - O2体育馆'
      }
    ],
    timestamp: new Date().toISOString()
  };

  res.json(worldsData);
});

// 数码猫咪接口

// 初始化猫咪数据
let digitalCats = [
  {
    id: 1,
    name: 'CyberNeko',
    level: 5,
    hp: 85,
    maxHp: 100,
    energy: 70,
    maxEnergy: 100,
    exp: 320,
    maxExp: 500,
    type: 'cyber',
    color: '#00ffff',
    skills: ['数据冲击', '电磁护盾', '量子跳跃'],
    lastFeedTime: null,
    lastPlayTime: null,
    lastTrainTime: null
  },
  {
    id: 2,
    name: 'CodeKitty',
    level: 3,
    hp: 95,
    maxHp: 100,
    energy: 60,
    maxEnergy: 100,
    exp: 150,
    maxExp: 300,
    type: 'code',
    color: '#ff00ff',
    skills: ['代码生成', '调试模式', 'Git跳跃'],
    lastFeedTime: null,
    lastPlayTime: null,
    lastTrainTime: null
  },
  {
    id: 3,
    name: 'NeonPaw',
    level: 7,
    hp: 90,
    maxHp: 100,
    energy: 80,
    maxEnergy: 100,
    exp: 580,
    maxExp: 700,
    type: 'neon',
    color: '#00ff00',
    skills: ['霓虹闪烁', '光速移动', '能量脉冲'],
    lastFeedTime: null,
    lastPlayTime: null,
    lastTrainTime: null
  },
  {
    id: 4,
    name: 'PixelMeow',
    level: 4,
    hp: 100,
    maxHp: 100,
    energy: 50,
    maxEnergy: 100,
    exp: 240,
    maxExp: 400,
    type: 'pixel',
    color: '#ffff00',
    skills: ['像素化', '8位跳跃', '复古冲刺'],
    lastFeedTime: null,
    lastPlayTime: null,
    lastTrainTime: null
  }
];

// 获取所有数码猫咪
app.get('/api/cats', (req, res) => {
  res.json({
    success: true,
    cats: digitalCats,
    timestamp: new Date().toISOString()
  });
});

// 获取单只猫咪
app.get('/api/cats/:id', (req, res) => {
  const catId = parseInt(req.params.id);
  const cat = digitalCats.find(c => c.id === catId);

  if (!cat) {
    return res.status(404).json({
      success: false,
      message: '猫咪不存在'
    });
  }

  res.json({
    success: true,
    cat: cat,
    timestamp: new Date().toISOString()
  });
});

// 喂食猫咪
app.post('/api/cats/:id/feed', (req, res) => {
  const catId = parseInt(req.params.id);
  const cat = digitalCats.find(c => c.id === catId);

  if (!cat) {
    return res.status(404).json({
      success: false,
      message: '猫咪不存在'
    });
  }

  // 检查冷却时间（30秒）
  const now = Date.now();
  if (cat.lastFeedTime && (now - cat.lastFeedTime) < 30000) {
    const remainingTime = Math.ceil((30000 - (now - cat.lastFeedTime)) / 1000);
    return res.json({
      success: false,
      message: `猫咪还不饿，请等待${remainingTime}秒`,
      cat: cat
    });
  }

  // 恢复HP
  const hpGain = Math.floor(Math.random() * 15) + 10;
  cat.hp = Math.min(cat.hp + hpGain, cat.maxHp);
  cat.lastFeedTime = now;

  res.json({
    success: true,
    message: `喂食成功！恢复了${hpGain}点HP`,
    hpGain: hpGain,
    cat: cat,
    timestamp: new Date().toISOString()
  });
});

// 与猫咪玩耍
app.post('/api/cats/:id/play', (req, res) => {
  const catId = parseInt(req.params.id);
  const cat = digitalCats.find(c => c.id === catId);

  if (!cat) {
    return res.status(404).json({
      success: false,
      message: '猫咪不存在'
    });
  }

  // 检查能量
  if (cat.energy < 20) {
    return res.json({
      success: false,
      message: '猫咪能量不足，需要休息',
      cat: cat
    });
  }

  // 检查冷却时间（20秒）
  const now = Date.now();
  if (cat.lastPlayTime && (now - cat.lastPlayTime) < 20000) {
    const remainingTime = Math.ceil((20000 - (now - cat.lastPlayTime)) / 1000);
    return res.json({
      success: false,
      message: `猫咪需要休息，请等待${remainingTime}秒`,
      cat: cat
    });
  }

  // 消耗能量，增加经验
  const energyCost = 15;
  const expGain = Math.floor(Math.random() * 30) + 20;
  cat.energy = Math.max(0, cat.energy - energyCost);
  cat.exp += expGain;
  cat.lastPlayTime = now;

  // 检查升级
  let levelUp = false;
  if (cat.exp >= cat.maxExp) {
    cat.level += 1;
    cat.exp = cat.exp - cat.maxExp;
    cat.maxExp = Math.floor(cat.maxExp * 1.5);
    cat.maxHp += 10;
    cat.maxEnergy += 10;
    cat.hp = cat.maxHp;
    cat.energy = cat.maxEnergy;
    levelUp = true;
  }

  res.json({
    success: true,
    message: levelUp ? `玩耍成功！获得${expGain}经验，升级到${cat.level}级！` : `玩耍成功！获得${expGain}经验`,
    expGain: expGain,
    levelUp: levelUp,
    cat: cat,
    timestamp: new Date().toISOString()
  });
});

// 训练猫咪
app.post('/api/cats/:id/train', (req, res) => {
  const catId = parseInt(req.params.id);
  const cat = digitalCats.find(c => c.id === catId);

  if (!cat) {
    return res.status(404).json({
      success: false,
      message: '猫咪不存在'
    });
  }

  // 检查能量
  if (cat.energy < 30) {
    return res.json({
      success: false,
      message: '猫咪能量不足，需要至少30点能量',
      cat: cat
    });
  }

  // 检查冷却时间（40秒）
  const now = Date.now();
  if (cat.lastTrainTime && (now - cat.lastTrainTime) < 40000) {
    const remainingTime = Math.ceil((40000 - (now - cat.lastTrainTime)) / 1000);
    return res.json({
      success: false,
      message: `训练需要冷却，请等待${remainingTime}秒`,
      cat: cat
    });
  }

  // 消耗能量，增加大量经验
  const energyCost = 30;
  const expGain = Math.floor(Math.random() * 60) + 50;
  cat.energy = Math.max(0, cat.energy - energyCost);
  cat.exp += expGain;
  cat.lastTrainTime = now;

  // 检查升级
  let levelUp = false;
  if (cat.exp >= cat.maxExp) {
    cat.level += 1;
    cat.exp = cat.exp - cat.maxExp;
    cat.maxExp = Math.floor(cat.maxExp * 1.5);
    cat.maxHp += 10;
    cat.maxEnergy += 10;
    cat.hp = cat.maxHp;
    cat.energy = cat.maxEnergy;
    levelUp = true;
  }

  res.json({
    success: true,
    message: levelUp ? `训练成功！获得${expGain}经验，升级到${cat.level}级！` : `训练成功！获得${expGain}经验`,
    expGain: expGain,
    levelUp: levelUp,
    cat: cat,
    timestamp: new Date().toISOString()
  });
});

// 恢复猫咪能量（自动恢复接口）
app.post('/api/cats/:id/recover', (req, res) => {
  const catId = parseInt(req.params.id);
  const cat = digitalCats.find(c => c.id === catId);

  if (!cat) {
    return res.status(404).json({
      success: false,
      message: '猫咪不存在'
    });
  }

  // 每次恢复5点能量
  const energyGain = 5;
  cat.energy = Math.min(cat.energy + energyGain, cat.maxEnergy);

  res.json({
    success: true,
    message: `恢复${energyGain}点能量`,
    energyGain: energyGain,
    cat: cat,
    timestamp: new Date().toISOString()
  });
});

// 生成小学数学题接口
app.get('/api/math/questions', (req, res) => {
  // 运算符类型
  const operators = ['+', '-', '×', '÷'];
  const questions = [];

  // 生成10道题
  for (let i = 0; i < 10; i++) {
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, answer;

    switch (operator) {
      case '+':
        // 加法：1-100之间的数字
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        answer = num1 + num2;
        break;
      case '-':
        // 减法：确保结果为正数
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case '×':
        // 乘法：1-12之间的数字（乘法口诀表）
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      case '÷':
        // 除法：确保整除
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = Math.floor(Math.random() * 12) + 1;
        num1 = num2 * answer;
        break;
    }

    questions.push({
      id: i + 1,
      question: `${num1} ${operator} ${num2} = ?`,
      num1: num1,
      num2: num2,
      operator: operator,
      answer: answer
    });
  }

  res.json({
    success: true,
    questions: questions,
    timestamp: new Date().toISOString()
  });
});

// 重启服务器接口
app.post('/api/restart', (req, res) => {
  console.log('收到重启服务器请求');
  res.json({
    success: true,
    message: '服务器正在重启...',
    timestamp: new Date().toISOString()
  });

  // 延迟1秒后退出进程，让响应有时间发送给客户端
  setTimeout(() => {
    console.log('服务器即将重启...');
    process.exit(0);
  }, 1000);
});

// 结婚纪念帖接口

// 初始化留言数据
let weddingMessages = [
  {
    id: 1,
    name: '张三',
    content: '祝新婚快乐，白头偕老！',
    timestamp: Date.now() - 3600000 // 1小时前
  },
  {
    id: 2,
    name: '李四',
    content: '愿你们的爱情永远甜蜜，幸福美满！',
    timestamp: Date.now() - 7200000 // 2小时前
  },
  {
    id: 3,
    name: '王五',
    content: '祝福这对新人，百年好合，早生贵子！',
    timestamp: Date.now() - 10800000 // 3小时前
  }
];
let nextMessageId = 4;

// 获取留言列表
app.get('/api/wedding/messages', (req, res) => {
  res.json({
    success: true,
    messages: weddingMessages.sort((a, b) => b.timestamp - a.timestamp), // 按时间倒序
    timestamp: new Date().toISOString()
  });
});

// 提交留言
app.post('/api/wedding/messages', (req, res) => {
  const { name, content } = req.body;

  // 验证输入
  if (!name || !content) {
    return res.status(400).json({
      success: false,
      message: '姓名和内容不能为空'
    });
  }

  if (name.length > 20) {
    return res.status(400).json({
      success: false,
      message: '姓名长度不能超过20个字符'
    });
  }

  if (content.length > 200) {
    return res.status(400).json({
      success: false,
      message: '留言内容不能超过200个字符'
    });
  }

  // 创建新留言
  const newMessage = {
    id: nextMessageId++,
    name: name.trim(),
    content: content.trim(),
    timestamp: Date.now()
  };

  weddingMessages.push(newMessage);

  res.json({
    success: true,
    message: '留言提交成功',
    messages: weddingMessages.sort((a, b) => b.timestamp - a.timestamp),
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
  console.log(`数据文件路径: ${DATA_FILE}`);
  console.log(`__dirname: ${__dirname}`);
});

