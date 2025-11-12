/**
 * 项目管理路由
 */

import express from 'express';
import { projectStorage } from '../storage.js';
import { authMiddleware } from '../auth.js';

const router = express.Router();

// 获取用户的所有项目
router.get('/', authMiddleware, (req, res) => {
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
router.get('/:id', authMiddleware, (req, res) => {
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
router.post('/', authMiddleware, (req, res) => {
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
router.put('/:id', authMiddleware, (req, res) => {
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
router.delete('/:id', authMiddleware, (req, res) => {
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

export default router;
