import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储 - 牌桌数据
const tablesStore = new Map();

// 初始化默认牌桌
const initializeTables = () => {
  const defaultTables = [
    { id: 101, baseScore: 100, players: 2, maxPlayers: 3, status: 'waiting', hasAI: false, createdAt: Date.now() },
    { id: 102, baseScore: 200, players: 3, maxPlayers: 3, status: 'playing', hasAI: false, createdAt: Date.now() },
    { id: 103, baseScore: 50, players: 1, maxPlayers: 3, status: 'waiting', hasAI: true, createdAt: Date.now() },
    { id: 104, baseScore: 500, players: 0, maxPlayers: 3, status: 'waiting', hasAI: false, createdAt: Date.now() },
    { id: 105, baseScore: 100, players: 2, maxPlayers: 3, status: 'waiting', hasAI: true, createdAt: Date.now() },
    { id: 106, baseScore: 1000, players: 1, maxPlayers: 3, status: 'waiting', hasAI: false, createdAt: Date.now() }
  ];

  defaultTables.forEach(table => {
    tablesStore.set(table.id, table);
  });
};

initializeTables();

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取所有牌桌
app.get('/api/tables', (req, res) => {
  const tables = Array.from(tablesStore.values()).sort((a, b) => b.createdAt - a.createdAt);
  res.json(tables);
});

// 创建新牌桌
app.post('/api/tables', (req, res) => {
  const { baseScore = 100, maxPlayers = 3 } = req.body;

  const newTable = {
    id: Date.now() % 100000,
    baseScore: parseInt(baseScore),
    players: 1,
    maxPlayers: parseInt(maxPlayers),
    status: 'waiting',
    hasAI: false,
    createdAt: Date.now()
  };

  tablesStore.set(newTable.id, newTable);
  res.status(201).json(newTable);
});

// 加入牌桌
app.post('/api/tables/:id/join', (req, res) => {
  const tableId = parseInt(req.params.id);
  const table = tablesStore.get(tableId);

  if (!table) {
    return res.status(404).json({ error: '牌桌不存在' });
  }

  if (table.players >= table.maxPlayers) {
    return res.status(400).json({ error: '牌桌已满' });
  }

  table.players += 1;
  if (table.players >= table.maxPlayers) {
    table.status = 'playing';
  }

  tablesStore.set(tableId, table);
  res.json(table);
});

// 离开牌桌
app.post('/api/tables/:id/leave', (req, res) => {
  const tableId = parseInt(req.params.id);
  const table = tablesStore.get(tableId);

  if (!table) {
    return res.status(404).json({ error: '牌桌不存在' });
  }

  table.players = Math.max(0, table.players - 1);
  table.status = 'waiting';

  // 如果牌桌空了，删除它
  if (table.players === 0) {
    tablesStore.delete(tableId);
    return res.json({ message: '牌桌已解散' });
  }

  tablesStore.set(tableId, table);
  res.json(table);
});

// 删除牌桌
app.delete('/api/tables/:id', (req, res) => {
  const tableId = parseInt(req.params.id);

  if (!tablesStore.has(tableId)) {
    return res.status(404).json({ error: '牌桌不存在' });
  }

  tablesStore.delete(tableId);
  res.json({ message: '牌桌已删除' });
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

