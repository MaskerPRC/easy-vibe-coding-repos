import express from 'express';
import Post from '../models/Post.js';
import { authenticate, requireAuthor } from '../middleware/auth.js';

const router = express.Router();

// 获取所有文章（支持分页和筛选）
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, author, status = 'published' } = req.query;
    const skip = (page - 1) * limit;

    const query = { status };
    if (category) query.category = category;
    if (author) query.author = author;

    const posts = await Post.find(query)
      .populate('author', 'username avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取文章列表错误:', error);
    res.status(500).json({ error: '获取文章列表失败' });
  }
});

// 获取单篇文章
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar bio');

    if (!post) {
      return res.status(404).json({ error: '文章不存在' });
    }

    // 增加浏览次数
    post.views += 1;
    await post.save();

    res.json({ post });
  } catch (error) {
    console.error('获取文章错误:', error);
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 创建文章（需要作者权限）
router.post('/', authenticate, requireAuthor, async (req, res) => {
  try {
    const { title, content, tags, category, status, coverImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: '请提供标题和内容' });
    }

    const post = new Post({
      title,
      content,
      author: req.user._id,
      tags: tags || [],
      category: category || '未分类',
      status: status || 'published',
      coverImage: coverImage || ''
    });

    await post.save();
    await post.populate('author', 'username avatar bio');

    res.status(201).json({
      message: '文章创建成功',
      post
    });
  } catch (error) {
    console.error('创建文章错误:', error);
    res.status(500).json({ error: '创建文章失败' });
  }
});

// 更新文章
router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: '文章不存在' });
    }

    // 检查权限：只有作者本人或管理员可以修改
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权修改此文章' });
    }

    const { title, content, tags, category, status, coverImage } = req.body;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;
    if (category !== undefined) post.category = category;
    if (status !== undefined) post.status = status;
    if (coverImage !== undefined) post.coverImage = coverImage;

    await post.save();
    await post.populate('author', 'username avatar bio');

    res.json({
      message: '文章更新成功',
      post
    });
  } catch (error) {
    console.error('更新文章错误:', error);
    res.status(500).json({ error: '更新文章失败' });
  }
});

// 删除文章
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: '文章不存在' });
    }

    // 检查权限：只有作者本人或管理员可以删除
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权删除此文章' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: '文章删除成功' });
  } catch (error) {
    console.error('删除文章错误:', error);
    res.status(500).json({ error: '删除文章失败' });
  }
});

// 点赞文章
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: '文章不存在' });
    }

    const userId = req.user._id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // 已点赞，取消点赞
      post.likes.splice(likeIndex, 1);
    } else {
      // 未点赞，添加点赞
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      message: likeIndex > -1 ? '取消点赞成功' : '点赞成功',
      likes: post.likes.length
    });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ error: '操作失败' });
  }
});

export default router;
