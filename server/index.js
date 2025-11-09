import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;
const WPS_BRIDGE_PORT = 23334;

// WPS Bridge 子进程管理
let wpsBridgeProcess = null;
let isShuttingDown = false;
let restartAttempts = 0;
const MAX_RESTART_ATTEMPTS = 5;

// 启动 WPS Bridge 服务
function startWPSBridge() {
  if (wpsBridgeProcess) {
    console.log('[WPS Bridge] 进程已在运行中');
    return;
  }

  console.log('[WPS Bridge] 正在启动 Python 服务...');

  const scriptPath = path.join(__dirname, '../packages/wps-bridge/app.py');

  wpsBridgeProcess = spawn('python', [scriptPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
      PYTHONUTF8: '1'
    }
  });

  // 输出日志
  wpsBridgeProcess.stdout.on('data', (data) => {
    console.log(`[WPS Bridge] ${data.toString().trim()}`);
  });

  wpsBridgeProcess.stderr.on('data', (data) => {
    console.error(`[WPS Bridge Error] ${data.toString().trim()}`);
  });

  // 进程退出处理
  wpsBridgeProcess.on('exit', (code, signal) => {
    console.log(`[WPS Bridge] 进程退出 - 代码: ${code}, 信号: ${signal}`);
    wpsBridgeProcess = null;

    if (!isShuttingDown && restartAttempts < MAX_RESTART_ATTEMPTS) {
      restartAttempts++;
      console.log(`[WPS Bridge] 5秒后自动重启 (尝试 ${restartAttempts}/${MAX_RESTART_ATTEMPTS})...`);
      setTimeout(startWPSBridge, 5000);
    } else if (restartAttempts >= MAX_RESTART_ATTEMPTS) {
      console.error(`[WPS Bridge] 已达到最大重启次数，请检查配置`);
    }
  });

  wpsBridgeProcess.on('error', (error) => {
    console.error(`[WPS Bridge] 启动失败:`, error.message);
    wpsBridgeProcess = null;
  });

  // 重置重启计数（如果成功运行一段时间）
  setTimeout(() => {
    if (wpsBridgeProcess) {
      restartAttempts = 0;
    }
  }, 30000); // 30秒后重置
}

// 停止 WPS Bridge 服务
function stopWPSBridge() {
  if (wpsBridgeProcess) {
    isShuttingDown = true;
    console.log('[WPS Bridge] 正在停止服务...');
    wpsBridgeProcess.kill('SIGTERM');
    wpsBridgeProcess = null;
  }
}

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '服务正常运行',
    timestamp: new Date().toISOString()
  });
});

// 搜索接口（示例）
app.get('/api/search', (req, res) => {
  const keyword = req.query.keyword || '';
  res.json({
    success: true,
    keyword: keyword,
    message: '这是一个演示接口，实际搜索功能需要接入真实的搜索服务'
  });
});

// 聊天室功能 - 内存存储
const chatMessages = [];
const MAX_MESSAGES = 100; // 最多保存100条消息
let onlineUsers = new Set();

// 获取聊天消息
app.get('/api/chat/messages', (req, res) => {
  res.json({
    success: true,
    messages: chatMessages
  });
});

// 发送消息
app.post('/api/chat/send', (req, res) => {
  const { userId, username, content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      message: '消息内容不能为空'
    });
  }

  if (content.length > 500) {
    return res.status(400).json({
      success: false,
      message: '消息长度不能超过500字符'
    });
  }

  const message = {
    userId: userId || 'anonymous',
    username: username || '匿名用户',
    content: content.trim(),
    timestamp: new Date().toISOString()
  };

  chatMessages.push(message);

  // 只保留最新的消息
  if (chatMessages.length > MAX_MESSAGES) {
    chatMessages.shift();
  }

  // 更新在线用户
  if (userId) {
    onlineUsers.add(userId);
  }

  res.json({
    success: true,
    message: '发送成功',
    data: message
  });
});

// 获取在线人数
app.get('/api/chat/online', (req, res) => {
  // 清理30分钟未活动的用户
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;

  res.json({
    success: true,
    count: Math.max(1, onlineUsers.size)
  });
});

// WPS Bridge 健康检查
app.get('/api/wps/bridge/health', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:${WPS_BRIDGE_PORT}/health`);
    const data = await response.json();
    res.json({
      success: true,
      bridgeStatus: data
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: 'WPS Bridge 服务未运行',
      message: error.message
    });
  }
});

// WPS Bridge 重启
app.post('/api/wps/bridge/restart', (req, res) => {
  console.log('[WPS Bridge] 收到重启请求');
  stopWPSBridge();
  setTimeout(() => {
    restartAttempts = 0;
    startWPSBridge();
    res.json({
      success: true,
      message: 'WPS Bridge 正在重启'
    });
  }, 1000);
});

// 代理 WPS Bridge 所有 API 请求
app.use('/api/wps', createProxyMiddleware({
  target: `http://localhost:${WPS_BRIDGE_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/wps': '/api/wps'
  },
  onError: (err, req, res) => {
    console.error('[Proxy Error]', err.message);
    res.status(503).json({
      success: false,
      error: 'WPS Bridge 服务不可用',
      message: '请确保 Python 环境已安装且 WPS Office 已运行'
    });
  }
}));

app.listen(PORT, () => {
  console.log(`后端服务运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}/api/health`);

  // 启动 WPS Bridge 服务
  startWPSBridge();
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务...');
  stopWPSBridge();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n正在关闭服务...');
  stopWPSBridge();
  process.exit(0);
});
