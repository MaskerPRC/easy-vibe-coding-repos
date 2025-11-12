/**
 * 公开路由 - 认证、健康检查等
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { userStorage } from '../storage.js';

const router = express.Router();

// JWT 密钥(内存存储)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

/**
 * 生成 JWT Token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * 健康检查
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    port: process.env.PORT || 3002,
    timestamp: new Date().toISOString()
  });
});

/**
 * 测试登录(开发环境)
 * 使用默认演示用户登录
 */
router.post('/auth/test-login', (req, res) => {
  try {
    // 获取或创建演示用户
    let user = userStorage.findById(1);

    if (!user) {
      user = userStorage.create({
        githubId: 'demo-user-1',
        username: '演示用户',
        email: 'demo@example.com',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4'
      });
    }

    const token = generateToken(user);

    res.json({
      user,
      token
    });
  } catch (error) {
    console.error('测试登录失败:', error);
    res.status(500).json({
      error: '登录失败',
      message: error.message
    });
  }
});

/**
 * 获取当前用户信息
 */
router.get('/user/me', (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        error: '未认证'
      });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      error: '获取用户信息失败',
      message: error.message
    });
  }
});

export default router;
