/**
 * 系统管理路由
 */

import express from 'express';
import { getSystemStats } from '../storage.js';
import { runScheduledTask, getTaskStatus } from '../scheduler.js';
import { setAIConfig, getAIConfig } from '../aiService.js';

const router = express.Router();

/**
 * 手动触发定时任务
 */
router.post('/run-task', async (req, res) => {
  try {
    console.log('手动触发定时任务');

    const result = await runScheduledTask();

    res.json({
      result
    });
  } catch (error) {
    console.error('执行任务失败:', error);
    res.status(500).json({
      error: '执行任务失败',
      message: error.message
    });
  }
});

/**
 * 获取任务状态
 */
router.get('/task-status', (req, res) => {
  try {
    const status = getTaskStatus();

    res.json({
      status
    });
  } catch (error) {
    console.error('获取任务状态失败:', error);
    res.status(500).json({
      error: '获取任务状态失败',
      message: error.message
    });
  }
});

/**
 * 获取系统统计
 */
router.get('/stats', (req, res) => {
  try {
    const stats = getSystemStats();
    const taskStatus = getTaskStatus();

    res.json({
      stats,
      taskStatus
    });
  } catch (error) {
    console.error('获取系统统计失败:', error);
    res.status(500).json({
      error: '获取系统统计失败',
      message: error.message
    });
  }
});

/**
 * 设置 AI 配置
 */
router.post('/ai-config', (req, res) => {
  try {
    const { apiKey, apiEndpoint, model } = req.body;

    setAIConfig({
      enabled: !!apiKey,
      apiKey,
      apiEndpoint,
      model
    });

    res.json({
      status: 'AI 配置已更新'
    });
  } catch (error) {
    console.error('设置 AI 配置失败:', error);
    res.status(500).json({
      error: '设置 AI 配置失败',
      message: error.message
    });
  }
});

/**
 * 获取 AI 配置状态
 */
router.get('/ai-config', (req, res) => {
  try {
    const config = getAIConfig();

    res.json({
      status: config
    });
  } catch (error) {
    console.error('获取 AI 配置失败:', error);
    res.status(500).json({
      error: '获取 AI 配置失败',
      message: error.message
    });
  }
});

export default router;
