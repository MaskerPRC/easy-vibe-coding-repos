import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { loadSeedData } from './storage.js';
import { startScheduler } from './scheduler.js';

// 导入路由
import publicRoutes from './routes/public.js';
import projectRoutes from './routes/projects.js';
import sourceRoutes from './routes/sources.js';
import messageRoutes from './routes/messages.js';
import systemRoutes from './routes/system.js';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 简单的认证中间件(用于演示)
app.use((req, res, next) => {
  // 对于公开路由,跳过认证
  if (req.path.startsWith('/api/health') || req.path.startsWith('/api/auth')) {
    return next();
  }

  // 演示环境:自动使用演示用户
  req.user = {
    id: 1,
    username: '演示用户'
  };

  next();
});

// 注册路由
app.use('/api', publicRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api', messageRoutes);  // 消息路由包含 /projects/:id/messages
app.use('/api/system', systemRoutes);

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

// 启动服务器
app.listen(PORT, () => {
  console.log('========================================');
  console.log('🚀 应用项目后端启动成功！');
  console.log(`📡 端口: ${PORT}`);
  console.log(`🏥 健康检查: http://localhost:${PORT}/api/health`);
  console.log('========================================\n');

  // 加载演示数据
  loadSeedData();

  // 启动任务调度器(60分钟间隔)
  // 如果想更频繁测试,可以设置更短的间隔,例如 startScheduler(5) 表示5分钟
  console.log('启动定时任务调度器...\n');
  startScheduler(60);
});
