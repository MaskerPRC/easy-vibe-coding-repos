/**
 * 消息管理路由
 */

import express from 'express';
import { messageStorage } from '../storage.js';

const router = express.Router();

/**
 * 获取项目的消息列表
 */
router.get('/projects/:projectId/messages', (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const { unread, important, minScore } = req.query;

    const options = {
      onlyUnread: unread === 'true',
      onlyImportant: important === 'true',
      minScore: minScore ? parseFloat(minScore) : undefined
    };

    const messages = messageStorage.findByProjectId(projectId, options);

    res.json({
      messages
    });
  } catch (error) {
    console.error('获取消息列表失败:', error);
    res.status(500).json({
      error: '获取消息列表失败',
      message: error.message
    });
  }
});

/**
 * 获取项目的消息统计
 */
router.get('/projects/:projectId/stats', (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const stats = messageStorage.getStats(projectId);

    res.json({
      stats
    });
  } catch (error) {
    console.error('获取消息统计失败:', error);
    res.status(500).json({
      error: '获取消息统计失败',
      message: error.message
    });
  }
});

/**
 * 标记消息为已读
 */
router.put('/messages/:id/read', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const message = messageStorage.markAsRead(id);

    if (!message) {
      return res.status(404).json({
        error: '消息不存在'
      });
    }

    res.json({
      message
    });
  } catch (error) {
    console.error('标记已读失败:', error);
    res.status(500).json({
      error: '标记已读失败',
      message: error.message
    });
  }
});

/**
 * 标记消息重要性
 */
router.put('/messages/:id/important', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { important } = req.body;

    const message = messageStorage.markAsImportant(id, important);

    if (!message) {
      return res.status(404).json({
        error: '消息不存在'
      });
    }

    res.json({
      message
    });
  } catch (error) {
    console.error('标记重要性失败:', error);
    res.status(500).json({
      error: '标记重要性失败',
      message: error.message
    });
  }
});

/**
 * 删除消息
 */
router.delete('/messages/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = messageStorage.delete(id);

    if (!success) {
      return res.status(404).json({
        error: '消息不存在'
      });
    }

    res.json({
      message: '消息已删除'
    });
  } catch (error) {
    console.error('删除消息失败:', error);
    res.status(500).json({
      error: '删除消息失败',
      message: error.message
    });
  }
});

export default router;
