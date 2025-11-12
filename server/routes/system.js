/**
 * 系统管理路由
 */

import express from 'express';
import { getSystemStats } from '../storage.js';
import { authMiddleware } from '../auth.js';
import { runScheduledTask, getTaskStatus } from '../scheduler.js';
import { setAIConfig, getAIConfigStatus } from '../aiService.js';

const router = express.Router();

// 手动触发定时任务
router.post('/run-task', authMiddleware, async (req, res) => {
  try {
    const result = await runScheduledTask();

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: '运行任务失败',
      message: error.message
    });
  }
});

// 获取任务状态
router.get('/task-status', authMiddleware, (req, res) => {
  try {
    const status = getTaskStatus();

    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({
      error: '获取状态失败',
      message: error.message
    });
  }
});

// 获取系统统计
router.get('/stats', authMiddleware, (req, res) => {
  try {
    const stats = getSystemStats();
    const taskStatus = getTaskStatus();

    res.json({
      success: true,
      stats,
      taskStatus
    });
  } catch (error) {
    res.status(500).json({
      error: '获取统计失败',
      message: error.message
    });
  }
});

// 设置 AI 配置
router.post('/ai-config', authMiddleware, (req, res) => {
  try {
    const { apiKey, apiEndpoint, model } = req.body;

    setAIConfig({
      apiKey,
      apiEndpoint,
      model
    });

    res.json({
      success: true,
      status: getAIConfigStatus()
    });
  } catch (error) {
    res.status(500).json({
      error: '设置 AI 配置失败',
      message: error.message
    });
  }
});

// 获取 AI 配置状态
router.get('/ai-config', authMiddleware, (req, res) => {
  try {
    const status = getAIConfigStatus();

    res.json({
      success: true,
      status
    });
  } catch (error) {
    res.status(500).json({
      error: '获取 AI 配置失败',
      message: error.message
    });
  }
});

export default router;
