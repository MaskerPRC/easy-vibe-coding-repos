import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// 获取文章的所有评论
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username avatar')
      .populate('parentComment')
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ error: '获取评论失败' });
  }
});

// 创建评论
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ error: '请提供评论内容和文章ID' });
    }

    // 验证文章是否存在
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: '文章不存在' });
    }

    // 如果是回复评论，验证父评论是否存在
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ error: '父评论不存在' });
      }
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId,
      parentComment: parentCommentId || null
    });

    await comment.save();
    await comment.populate('author', 'username avatar');

    res.status(201).json({
      message: '评论创建成功',
      comment
    });
  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({ error: '创建评论失败' });
  }
});

// 删除评论
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }

    // 检查权限：只有评论作者或管理员可以删除
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权删除此评论' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: '评论删除成功' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ error: '删除评论失败' });
  }
});

// 更新评论
router.put('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }

    // 检查权限：只有评论作者可以修改
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: '无权修改此评论' });
    }

    const { content } = req.body;
    if (content) {
      comment.content = content;
      await comment.save();
      await comment.populate('author', 'username avatar');
    }

    res.json({
      message: '评论更新成功',
      comment
    });
  } catch (error) {
    console.error('更新评论错误:', error);
    res.status(500).json({ error: '更新评论失败' });
  }
});

export default router;
