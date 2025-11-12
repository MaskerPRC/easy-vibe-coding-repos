/**
 * AI 新闻去重推送系统 - 后端服务器
 * 重构后的主文件 - 仅负责应用初始化和路由注册
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// 导入调度器初始化
import { initScheduler } from './scheduler.js';

// 导入 seed 数据加载函数
import { loadSeedData } from './storage.js';

// 导入路由模块
import publicRoutes from './routes/public.js';
import projectRoutes from './routes/projects.js';
import sourceRoutes from './routes/sources.js';
import messageRoutes from './routes/messages.js';
import transformRoutes from './routes/transform.js';
import adminRoutes from './routes/admin.js';
import systemRoutes from './routes/system.js';

const app = express();
const PORT = process.env.PORT || 3002;

// ==================== 中间件配置 ====================
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ==================== 加载演示数据 ====================
loadSeedData();

// ==================== 初始化调度器 ====================
initScheduler();

// ==================== 路由注册 ====================

// 公开路由（健康检查、认证、用户信息）
app.use('/api', publicRoutes);

// 项目管理路由
app.use('/api/projects', projectRoutes);

// 信息源管理路由
app.use('/api/sources', sourceRoutes);

// 消息管理路由（包含项目消息和消息操作）
app.use('/api', messageRoutes);

// 站点转换 API 路由
app.use('/api/transform', transformRoutes);

// 管理端 API 路由
app.use('/api/admin', adminRoutes);

// 系统管理路由
app.use('/api/system', systemRoutes);

// ==================== 错误处理 ====================

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到资源',
    path: req.path
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

// ==================== 启动服务器 ====================

app.listen(PORT, () => {
  console.log('==========================================');
  console.log('AI 新闻去重推送系统 - 后端服务器');
  console.log('==========================================');
  console.log(`端口: ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`测试登录: POST http://localhost:${PORT}/api/auth/test-login`);
  console.log('==========================================');
});
