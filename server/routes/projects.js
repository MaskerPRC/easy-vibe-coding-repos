/**
 * 项目管理路由
 */

import express from 'express';
import { projectStorage } from '../storage.js';

const router = express.Router();

/**
 * 获取用户的所有项目
 */
router.get('/', (req, res) => {
  try {
    const userId = req.user?.id || 1; // 使用演示用户ID
    const projects = projectStorage.findByUserId(userId);

    res.json({
      projects
    });
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({
      error: '获取项目列表失败',
      message: error.message
    });
  }
});

/**
 * 获取单个项目
 */
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = projectStorage.findById(id);

    if (!project) {
      return res.status(404).json({
        error: '项目不存在'
      });
    }

    res.json({
      project
    });
  } catch (error) {
    console.error('获取项目失败:', error);
    res.status(500).json({
      error: '获取项目失败',
      message: error.message
    });
  }
});

/**
 * 创建项目
 */
router.post('/', (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { name, description, keywords, context, priority, threshold } = req.body;

    if (!name) {
      return res.status(400).json({
        error: '项目名称不能为空'
      });
    }

    const project = projectStorage.create(userId, {
      name,
      description,
      keywords: keywords || [],
      context,
      priority: priority || 3,
      threshold: threshold || 0.6
    });

    res.status(201).json({
      project
    });
  } catch (error) {
    console.error('创建项目失败:', error);
    res.status(500).json({
      error: '创建项目失败',
      message: error.message
    });
  }
});

/**
 * 更新项目
 */
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    const project = projectStorage.update(id, updates);

    if (!project) {
      return res.status(404).json({
        error: '项目不存在'
      });
    }

    res.json({
      project
    });
  } catch (error) {
    console.error('更新项目失败:', error);
    res.status(500).json({
      error: '更新项目失败',
      message: error.message
    });
  }
});

/**
 * 删除项目
 */
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = projectStorage.delete(id);

    if (!success) {
      return res.status(404).json({
        error: '项目不存在'
      });
    }

    res.json({
      message: '项目已删除'
    });
  } catch (error) {
    console.error('删除项目失败:', error);
    res.status(500).json({
      error: '删除项目失败',
      message: error.message
    });
  }
});

export default router;
