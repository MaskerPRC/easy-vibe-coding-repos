import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 计时器状态（存储在内存中）
let timerState = {
  startTime: null,        // 开始时间戳
  pausedTime: 0,          // 暂停时累计的时间（毫秒）
  isRunning: false,       // 是否正在运行
  lastPauseTime: null     // 最后一次暂停的时间
};

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取计时器状态
app.get('/api/timer/status', (req, res) => {
  let elapsedTime = 0;

  if (timerState.startTime) {
    if (timerState.isRunning) {
      // 正在运行：当前时间 - 开始时间 + 之前暂停累计的时间
      elapsedTime = Date.now() - timerState.startTime + timerState.pausedTime;
    } else {
      // 已暂停：使用暂停时记录的时间
      elapsedTime = timerState.pausedTime;
    }
  }

  res.json({
    isRunning: timerState.isRunning,
    startTime: timerState.startTime,
    elapsedTime: Math.floor(elapsedTime), // 返回毫秒数
    timestamp: Date.now()
  });
});

// 开始计时
app.post('/api/timer/start', (req, res) => {
  if (!timerState.isRunning) {
    if (timerState.startTime === null) {
      // 第一次开始
      timerState.startTime = Date.now();
      timerState.pausedTime = 0;
    } else {
      // 从暂停恢复：重新设置开始时间
      timerState.startTime = Date.now();
    }
    timerState.isRunning = true;
    timerState.lastPauseTime = null;
  }

  res.json({
    success: true,
    message: '计时器已开始',
    startTime: timerState.startTime,
    isRunning: timerState.isRunning
  });
});

// 暂停计时
app.post('/api/timer/pause', (req, res) => {
  if (timerState.isRunning) {
    // 计算当前已经过的时间并累加到 pausedTime
    const currentElapsed = Date.now() - timerState.startTime;
    timerState.pausedTime += currentElapsed;
    timerState.isRunning = false;
    timerState.lastPauseTime = Date.now();
  }

  res.json({
    success: true,
    message: '计时器已暂停',
    isRunning: timerState.isRunning,
    elapsedTime: timerState.pausedTime
  });
});

// 重置计时
app.post('/api/timer/reset', (req, res) => {
  timerState = {
    startTime: null,
    pausedTime: 0,
    isRunning: false,
    lastPauseTime: null
  };

  res.json({
    success: true,
    message: '计时器已重置',
    isRunning: false,
    elapsedTime: 0
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

