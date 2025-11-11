import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3002;

// 内存存储 - 存储 bash 历史记录
let bashHistoryCache = {
  commands: [],
  lastUpdated: null,
  error: null
};

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 读取 bash_history 文件的函数
function readBashHistory() {
  const historyPath = '/root/.bash_history';

  try {
    // 检查文件是否存在
    if (!fs.existsSync(historyPath)) {
      bashHistoryCache.error = '文件不存在';
      bashHistoryCache.commands = [];
      bashHistoryCache.lastUpdated = new Date().toISOString();
      return;
    }

    // 读取文件内容
    const content = fs.readFileSync(historyPath, 'utf-8');

    // 按行分割，过滤空行
    const commands = content
      .split('\n')
      .filter(line => line.trim() !== '')
      .map((cmd, index) => ({
        id: index + 1,
        command: cmd,
        timestamp: null // bash_history 通常不包含时间戳
      }));

    // 更新内存缓存
    bashHistoryCache.commands = commands;
    bashHistoryCache.lastUpdated = new Date().toISOString();
    bashHistoryCache.error = null;

    console.log(`成功读取 ${commands.length} 条命令历史`);
  } catch (error) {
    console.error('读取 bash_history 失败:', error.message);
    bashHistoryCache.error = error.message;
    bashHistoryCache.commands = [];
    bashHistoryCache.lastUpdated = new Date().toISOString();
  }
}

// API: 导入/刷新 bash 历史记录
app.post('/api/bash-history/import', (req, res) => {
  try {
    readBashHistory();

    res.json({
      success: true,
      message: '历史记录已导入',
      count: bashHistoryCache.commands.length,
      lastUpdated: bashHistoryCache.lastUpdated,
      error: bashHistoryCache.error
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API: 获取 bash 历史记录
app.get('/api/bash-history', (req, res) => {
  res.json({
    commands: bashHistoryCache.commands,
    lastUpdated: bashHistoryCache.lastUpdated,
    count: bashHistoryCache.commands.length,
    error: bashHistoryCache.error
  });
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

