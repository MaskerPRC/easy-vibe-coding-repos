import express from 'express';
import User from '../models/User.js';
import { generateToken, authenticate } from '../middleware/auth.js';

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ error: '请提供完整的注册信息' });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: '用户名或邮箱已被使用' });
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      role: role || 'user'
    });

    await user.save();

    // 生成 Token
    const token = generateToken(user._id);

    res.status(201).json({
      message: '注册成功',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '注册失败，请稍后再试' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ error: '请提供用户名和密码' });
    }

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 生成 Token
    const token = generateToken(user._id);

    res.json({
      message: '登录成功',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '登录失败，请稍后再试' });
  }
});

// 获取当前用户信息
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

// 更新用户信息
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    const user = req.user;

    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      message: '个人信息更新成功',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('更新个人信息错误:', error);
    res.status(500).json({ error: '更新失败，请稍后再试' });
  }
});

export default router;
