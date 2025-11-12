/**
 * 公开路由 - 健康检查、认证、用户信息
 */

import express from 'express';
import { getSystemStats } from '../storage.js';
import { authMiddleware, createTestUser, handleGitHubCallback } from '../auth.js';

const router = express.Router();

// ==================== 公开路由 ====================

// 健康检查
router.get('/health', (req, res) => {
  const stats = getSystemStats();
  res.json({
    status: 'ok',
    port: process.env.PORT || 3002,
    timestamp: new Date().toISOString(),
    stats
  });
});

// 测试登录（开发环境）
router.post('/auth/test-login', (req, res) => {
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
router.get('/auth/github/callback', async (req, res) => {
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
router.get('/user/me', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;
