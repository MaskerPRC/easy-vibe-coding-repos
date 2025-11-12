/**
 * AI 新闻去重推送系统 - 后端服务器
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// 导入模块
import { userStorage, projectStorage, sourceStorage, messageStorage, getSystemStats } from './storage.js';
import { authMiddleware, optionalAuthMiddleware, generateToken, createTestUser, handleGitHubCallback, setGitHubOAuthConfig } from './auth.js';
import { analyzeRelevance, setAIConfig, getAIConfigStatus } from './aiService.js';
import { fetchSource, detectUrlType } from './fetchService.js';
import { runScheduledTask, getTaskStatus, initScheduler } from './scheduler.js';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 初始化调度器
initScheduler();

// ==================== 公开路由 ====================

// 健康检查
app.get('/api/health', (req, res) => {
  const stats = getSystemStats();
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString(),
    stats
  });
});

// 测试登录（开发环境）
app.post('/api/auth/test-login', (req, res) => {
  try {
    const { user, token } = createTestUser();
    res.json({
      success: true,
      user,
      token
    });
  } catch (error) {
    res.status(500).json({
      error: '登录失败',
      message: error.message
    });
  }
});

// GitHub OAuth 回调
app.get('/api/auth/github/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: '缺少授权码' });
    }

    const result = await handleGitHubCallback(code);

    if (result.success) {
      res.json({
        success: true,
        user: result.user,
        token: result.token
      });
    } else {
      res.status(400).json({
        error: 'GitHub 认证失败',
        message: result.error
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'GitHub 认证失败',
      message: error.message
    });
  }
});

// ==================== 认证保护的路由 ====================

// 获取当前用户信息
app.get('/api/user/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// ==================== 项目管理 ====================

// 获取用户的所有项目
app.get('/api/projects', authMiddleware, (req, res) => {
  try {
    const projects = projectStorage.findByUserId(req.user.id);
    res.json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({
      error: '获取项目失败',
      message: error.message
    });
  }
});

// 获取单个项目
app.get('/api/projects/:id', authMiddleware, (req, res) => {
  try {
    const project = projectStorage.findById(parseInt(req.params.id));

    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: '无权访问此项目' });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      error: '获取项目失败',
      message: error.message
    });
  }
});

// 创建项目
app.post('/api/projects', authMiddleware, (req, res) => {
  try {
    const { name, description, keywords, context, priority, threshold } = req.body;

    if (!name) {
      return res.status(400).json({ error: '项目名称不能为空' });
    }

    const project = projectStorage.create(req.user.id, {
      name,
      description,
      keywords: keywords || [],
      context,
      priority: priority || 3,
      threshold: threshold || 0.6
    });

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      error: '创建项目失败',
      message: error.message
    });
  }
});

// 更新项目
app.put('/api/projects/:id', authMiddleware, (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = projectStorage.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: '无权修改此项目' });
    }

    const updated = projectStorage.update(projectId, req.body);

    res.json({
      success: true,
      project: updated
    });
  } catch (error) {
    res.status(500).json({
      error: '更新项目失败',
      message: error.message
    });
  }
});

// 删除项目
app.delete('/api/projects/:id', authMiddleware, (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = projectStorage.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: '无权删除此项目' });
    }

    projectStorage.delete(projectId);

    res.json({
      success: true,
      message: '项目已删除'
    });
  } catch (error) {
    res.status(500).json({
      error: '删除项目失败',
      message: error.message
    });
  }
});

// ==================== 信息源管理 ====================

// 获取用户的所有信息源
app.get('/api/sources', authMiddleware, (req, res) => {
  try {
    const sources = sourceStorage.findByUserId(req.user.id);
    res.json({
      success: true,
      sources
    });
  } catch (error) {
    res.status(500).json({
      error: '获取信息源失败',
      message: error.message
    });
  }
});

// 创建信息源
app.post('/api/sources', authMiddleware, (req, res) => {
  try {
    const { name, type, url, config, interval, enabled } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: '信息源名称和 URL 不能为空' });
    }

    const source = sourceStorage.create(req.user.id, {
      name,
      type: type || detectUrlType(url),
      url,
      config: config || {},
      interval: interval || 3600,
      enabled: enabled !== false
    });

    res.json({
      success: true,
      source
    });
  } catch (error) {
    res.status(500).json({
      error: '创建信息源失败',
      message: error.message
    });
  }
});

// 批量创建信息源
app.post('/api/sources/batch', authMiddleware, (req, res) => {
  try {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'URLs 必须是非空数组' });
    }

    const sources = [];

    for (const url of urls) {
      const type = detectUrlType(url);
      const name = url.replace(/^https?:\/\//, '').substring(0, 50);

      const source = sourceStorage.create(req.user.id, {
        name,
        type,
        url,
        config: {},
        interval: 3600,
        enabled: true
      });

      sources.push(source);
    }

    res.json({
      success: true,
      sources,
      count: sources.length
    });
  } catch (error) {
    res.status(500).json({
      error: '批量创建信息源失败',
      message: error.message
    });
  }
});

// 更新信息源
app.put('/api/sources/:id', authMiddleware, (req, res) => {
  try {
    const sourceId = parseInt(req.params.id);
    const source = sourceStorage.findById(sourceId);

    if (!source) {
      return res.status(404).json({ error: '信息源不存在' });
    }

    if (source.userId !== req.user.id) {
      return res.status(403).json({ error: '无权修改此信息源' });
    }

    const updated = sourceStorage.update(sourceId, req.body);

    res.json({
      success: true,
      source: updated
    });
  } catch (error) {
    res.status(500).json({
      error: '更新信息源失败',
      message: error.message
    });
  }
});

// 删除信息源
app.delete('/api/sources/:id', authMiddleware, (req, res) => {
  try {
    const sourceId = parseInt(req.params.id);
    const source = sourceStorage.findById(sourceId);

    if (!source) {
      return res.status(404).json({ error: '信息源不存在' });
    }

    if (source.userId !== req.user.id) {
      return res.status(403).json({ error: '无权删除此信息源' });
    }

    sourceStorage.delete(sourceId);

    res.json({
      success: true,
      message: '信息源已删除'
    });
  } catch (error) {
    res.status(500).json({
      error: '删除信息源失败',
      message: error.message
    });
  }
});

// 手动抓取信息源
app.post('/api/sources/:id/fetch', authMiddleware, async (req, res) => {
  try {
    const sourceId = parseInt(req.params.id);
    const source = sourceStorage.findById(sourceId);

    if (!source) {
      return res.status(404).json({ error: '信息源不存在' });
    }

    if (source.userId !== req.user.id) {
      return res.status(403).json({ error: '无权操作此信息源' });
    }

    const result = await fetchSource(source);

    res.json({
      success: result.success,
      items: result.items || [],
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      error: '抓取失败',
      message: error.message
    });
  }
});

// ==================== 消息管理 ====================

// 获取项目的消息
app.get('/api/projects/:id/messages', authMiddleware, (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = projectStorage.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: '无权访问此项目' });
    }

    const options = {
      onlyUnread: req.query.unread === 'true',
      onlyImportant: req.query.important === 'true',
      minScore: req.query.minScore ? parseFloat(req.query.minScore) : undefined
    };

    const messages = messageStorage.findByProjectId(projectId, options);

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    res.status(500).json({
      error: '获取消息失败',
      message: error.message
    });
  }
});

// 获取消息统计
app.get('/api/projects/:id/messages/stats', authMiddleware, (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = projectStorage.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: '无权访问此项目' });
    }

    const stats = messageStorage.getStats(projectId);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      error: '获取统计失败',
      message: error.message
    });
  }
});

// 标记消息为已读
app.put('/api/messages/:id/read', authMiddleware, (req, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const message = messageStorage.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: '消息不存在' });
    }

    const project = projectStorage.findById(message.projectId);
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: '无权操作此消息' });
    }

    const updated = messageStorage.markAsRead(messageId);

    res.json({
      success: true,
      message: updated
    });
  } catch (error) {
    res.status(500).json({
      error: '标记失败',
      message: error.message
    });
  }
});

// 标记消息为重要
app.put('/api/messages/:id/important', authMiddleware, (req, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const { important } = req.body;

    const message = messageStorage.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: '消息不存在' });
    }

    const project = projectStorage.findById(message.projectId);
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: '无权操作此消息' });
    }

    const updated = messageStorage.markAsImportant(messageId, important !== false);

    res.json({
      success: true,
      message: updated
    });
  } catch (error) {
    res.status(500).json({
      error: '标记失败',
      message: error.message
    });
  }
});

// 删除消息
app.delete('/api/messages/:id', authMiddleware, (req, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const message = messageStorage.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: '消息不存在' });
    }

    const project = projectStorage.findById(message.projectId);
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: '无权删除此消息' });
    }

    messageStorage.delete(messageId);

    res.json({
      success: true,
      message: '消息已删除'
    });
  } catch (error) {
    res.status(500).json({
      error: '删除失败',
      message: error.message
    });
  }
});

// ==================== 系统管理 ====================

// 手动触发定时任务
app.post('/api/system/run-task', authMiddleware, async (req, res) => {
  try {
    const result = await runScheduledTask();

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: '运行任务失败',
      message: error.message
    });
  }
});

// 获取任务状态
app.get('/api/system/task-status', authMiddleware, (req, res) => {
  try {
    const status = getTaskStatus();

    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({
      error: '获取状态失败',
      message: error.message
    });
  }
});

// 获取系统统计
app.get('/api/system/stats', authMiddleware, (req, res) => {
  try {
    const stats = getSystemStats();
    const taskStatus = getTaskStatus();

    res.json({
      success: true,
      stats,
      taskStatus
    });
  } catch (error) {
    res.status(500).json({
      error: '获取统计失败',
      message: error.message
    });
  }
});

// 设置 AI 配置
app.post('/api/system/ai-config', authMiddleware, (req, res) => {
  try {
    const { apiKey, apiEndpoint, model } = req.body;

    setAIConfig({
      apiKey,
      apiEndpoint,
      model
    });

    res.json({
      success: true,
      status: getAIConfigStatus()
    });
  } catch (error) {
    res.status(500).json({
      error: '设置 AI 配置失败',
      message: error.message
    });
  }
});

// 获取 AI 配置状态
app.get('/api/system/ai-config', authMiddleware, (req, res) => {
  try {
    const status = getAIConfigStatus();

    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({
      error: '获取 AI 配置失败',
      message: error.message
    });
  }
});

// ==================== 错误处理 ====================

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到资源',
    path: req.path
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
