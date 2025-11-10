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

// 存储在线用户
const onlineUsers = new Map(); // socketId -> { username, joinTime }
const chatHistory = []; // 存储聊天历史记录 (最多保留100条)
const MAX_HISTORY = 100;

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log(`新用户连接: ${socket.id}`);

  // 用户加入聊天室
  socket.on('join', (username) => {
    const user = {
      id: socket.id,
      username: username || `用户${socket.id.substr(0, 6)}`,
      joinTime: new Date().toISOString()
    };

    onlineUsers.set(socket.id, user);

    // 广播用户加入消息
    const joinMessage = {
      id: Date.now() + Math.random(),
      type: 'system',
      content: `${user.username} 加入了聊天室`,
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };

    io.emit('message', joinMessage);

    // 发送当前在线用户列表
    io.emit('users', Array.from(onlineUsers.values()));

    // 发送聊天历史记录给新用户
    socket.emit('history', chatHistory);

    console.log(`用户 ${user.username} 加入聊天室，当前在线: ${onlineUsers.size}`);
  });

  // 接收消息
  socket.on('message', (data) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now() + Math.random(),
      type: 'user',
      username: user.username,
      userId: socket.id,
      content: data.content,
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };

    // 保存到历史记录
    chatHistory.push(message);
    if (chatHistory.length > MAX_HISTORY) {
      chatHistory.shift();
    }

    // 广播消息给所有用户
    io.emit('message', message);

    console.log(`消息来自 ${user.username}: ${data.content}`);
  });

  // 用户正在输入
  socket.on('typing', (isTyping) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    socket.broadcast.emit('userTyping', {
      username: user.username,
      isTyping
    });
  });

  // 用户断开连接
  socket.on('disconnect', () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);

      // 广播用户离开消息
      const leaveMessage = {
        id: Date.now() + Math.random(),
        type: 'system',
        content: `${user.username} 离开了聊天室`,
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
      };

      io.emit('message', leaveMessage);
      io.emit('users', Array.from(onlineUsers.values()));

      console.log(`用户 ${user.username} 离开聊天室，当前在线: ${onlineUsers.size}`);
    }
  });
});

// REST API 接口

// 获取在线用户
app.get('/api/chat/users', (req, res) => {
  res.json({
    success: true,
    users: Array.from(onlineUsers.values()),
    count: onlineUsers.size
  });
});

// 获取聊天历史
app.get('/api/chat/history', (req, res) => {
  res.json({
    success: true,
    messages: chatHistory,
    count: chatHistory.length
  });
});

// 清空聊天历史
app.post('/api/chat/clear', (req, res) => {
  chatHistory.length = 0;
  io.emit('clearHistory');
  res.json({
    success: true,
    message: '聊天记录已清空'
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'Chat Server is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    onlineUsers: onlineUsers.size
  });
});

// 获取服务器统计信息
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      onlineUsers: onlineUsers.size,
      totalMessages: chatHistory.length,
      serverUptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    path: req.path
  });
});

// 错误处理
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    message: error.message
  });
});

// 启动服务器
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('💬 多人在线聊天室服务器启动成功!');
  console.log('='.repeat(60));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`👥 在线用户: ${onlineUsers.size}`);
  console.log(`💾 聊天记录: ${chatHistory.length} 条`);
  console.log('='.repeat(60) + '\n');
});
