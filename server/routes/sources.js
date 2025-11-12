/**
 * 信息源管理路由
 */

import express from 'express';
import { sourceStorage } from '../storage.js';
import { detectUrlType } from '../fetchService.js';

const router = express.Router();

/**
 * 获取用户的所有信息源
 */
router.get('/', (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const sources = sourceStorage.findByUserId(userId);

    res.json({
      sources
    });
  } catch (error) {
    console.error('获取信息源列表失败:', error);
    res.status(500).json({
      error: '获取信息源列表失败',
      message: error.message
    });
  }
});

/**
 * 创建信息源
 */
router.post('/', (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { name, type, url, config, interval, enabled } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'URL 不能为空'
      });
    }

    // 自动检测类型
    const detectedType = type || detectUrlType(url);

    const source = sourceStorage.create(userId, {
      name: name || url,
      type: detectedType,
      url,
      config: config || {},
      interval: interval || 3600,
      enabled: enabled !== false
    });

    res.status(201).json({
      source
    });
  } catch (error) {
    console.error('创建信息源失败:', error);
    res.status(500).json({
      error: '创建信息源失败',
      message: error.message
    });
  }
});

/**
 * 批量创建信息源
 */
router.post('/batch', (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        error: 'URLs 必须是非空数组'
      });
    }

    const sources = [];

    for (const url of urls) {
      const detectedType = detectUrlType(url);

      const source = sourceStorage.create(userId, {
        name: url,
        type: detectedType,
        url,
        config: {},
        interval: 3600,
        enabled: true
      });

      sources.push(source);
    }

    res.status(201).json({
      sources,
      count: sources.length
    });
  } catch (error) {
    console.error('批量创建信息源失败:', error);
    res.status(500).json({
      error: '批量创建信息源失败',
      message: error.message
    });
  }
});

/**
 * 更新信息源
 */
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    const source = sourceStorage.update(id, updates);

    if (!source) {
      return res.status(404).json({
        error: '信息源不存在'
      });
    }

    res.json({
      source
    });
  } catch (error) {
    console.error('更新信息源失败:', error);
    res.status(500).json({
      error: '更新信息源失败',
      message: error.message
    });
  }
});

/**
 * 删除信息源
 */
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = sourceStorage.delete(id);

    if (!success) {
      return res.status(404).json({
        error: '信息源不存在'
      });
    }

    res.json({
      message: '信息源已删除'
    });
  } catch (error) {
    console.error('删除信息源失败:', error);
    res.status(500).json({
      error: '删除信息源失败',
      message: error.message
    });
  }
});

export default router;
