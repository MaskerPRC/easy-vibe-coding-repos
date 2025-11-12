/**
 * 消息管理路由
 */

import express from 'express';
import { projectStorage, messageStorage } from '../storage.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

// 获取项目的消息
router.get('/projects/:id/messages', authMiddleware, (req, res) => {
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
router.get('/projects/:id/messages/stats', authMiddleware, (req, res) => {
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
router.put('/messages/:id/read', authMiddleware, (req, res) => {
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
router.put('/messages/:id/important', authMiddleware, (req, res) => {
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
router.delete('/messages/:id', authMiddleware, (req, res) => {
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

export default router;
