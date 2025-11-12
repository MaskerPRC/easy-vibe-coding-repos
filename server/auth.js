/**
 * 认证中间件和服务
 * 支持 GitHub OAuth 和 JWT 认证
 */

import { userStorage } from './storage.js';

// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * 简单的 JWT 实现（生产环境应使用 jsonwebtoken 库）
 */
export function generateToken(payload) {
  // 注意：这是一个简化的实现，生产环境应该使用 jsonwebtoken 库
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 天
  })).toString('base64');

  const signature = Buffer.from(`${header}.${body}.${JWT_SECRET}`).toString('base64');

  return `${header}.${body}.${signature}`;
}

/**
 * 验证 JWT Token
 */
export function verifyToken(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const body = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    // 检查是否过期
    if (body.exp && body.exp < Date.now()) {
      return null;
    }

    // 验证签名
    const expectedSignature = Buffer.from(`${parts[0]}.${parts[1]}.${JWT_SECRET}`).toString('base64');
    if (parts[2] !== expectedSignature) {
      return null;
    }

    return body;
  } catch (error) {
    console.error('验证 token 失败:', error.message);
    return null;
  }
}

/**
 * 认证中间件
 */
export function authMiddleware(req, res, next) {
  try {
    // 从 header 中获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未提供认证令牌' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: '无效或已过期的令牌' });
    }

    // 获取用户信息
    const user = userStorage.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    // 将用户信息附加到请求对象
    req.user = user;
    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    res.status(500).json({ error: '认证失败' });
  }
}

/**
 * 可选认证中间件（允许匿名访问）
 */
export function optionalAuthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (decoded) {
        const user = userStorage.findById(decoded.userId);
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    console.error('可选认证中间件错误:', error);
    next();
  }
}

/**
 * GitHub OAuth 配置
 */
export const githubOAuthConfig = {
  clientId: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5173/auth/github/callback',
  enabled: false
};

/**
 * 设置 GitHub OAuth 配置
 */
export function setGitHubOAuthConfig(config) {
  Object.assign(githubOAuthConfig, config);
  githubOAuthConfig.enabled = !!(config.clientId && config.clientSecret);
}

/**
 * GitHub OAuth 回调处理
 */
export async function handleGitHubCallback(code) {
  try {
    if (!githubOAuthConfig.enabled) {
      throw new Error('GitHub OAuth 未配置');
    }

    // 1. 用 code 换取 access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: githubOAuthConfig.clientId,
        client_secret: githubOAuthConfig.clientSecret,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const accessToken = tokenData.access_token;

    // 2. 用 access token 获取用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    const githubUser = await userResponse.json();

    // 3. 查找或创建用户
    let user = userStorage.findByGithubId(githubUser.id);

    if (!user) {
      user = userStorage.create({
        githubId: githubUser.id,
        username: githubUser.login,
        email: githubUser.email,
        avatar: githubUser.avatar_url,
        name: githubUser.name
      });
    } else {
      // 更新用户信息
      user = userStorage.update(user.id, {
        username: githubUser.login,
        email: githubUser.email,
        avatar: githubUser.avatar_url,
        name: githubUser.name
      });
    }

    // 4. 生成 JWT token
    const token = generateToken({ userId: user.id });

    return {
      success: true,
      user,
      token
    };
  } catch (error) {
    console.error('GitHub OAuth 失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 创建测试用户（开发环境）
 */
export function createTestUser() {
  // 优先使用 seed 数据中的演示用户
  const demoUser = userStorage.findById('demo-user-1');
  if (demoUser) {
    const token = generateToken({ userId: demoUser.id });
    return { user: demoUser, token };
  }

  // 兜底：查找或创建测试用户
  const existingUser = userStorage.findByGithubId('test-user');

  if (existingUser) {
    const token = generateToken({ userId: existingUser.id });
    return { user: existingUser, token };
  }

  const user = userStorage.create({
    githubId: 'test-user',
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'https://avatars.githubusercontent.com/u/0',
    name: '测试用户'
  });

  const token = generateToken({ userId: user.id });

  return { user, token };
}
