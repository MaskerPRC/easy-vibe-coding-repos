/**
 * 信息源管理路由
 */

import express from 'express';
import { sourceStorage } from '../storage.js';
import { authMiddleware } from '../auth.js';
import { fetchSource, detectUrlType } from '../fetchService.js';

const router = express.Router();

// 获取用户的所有信息源
router.get('/', authMiddleware, (req, res) => {
  try {
    const sources = sourceStorage.findByUserId(req.user.id);
    res.json({
      success: true,
      sources
    });
  } catch (error) {
    res.status(500).json({
      error: '获取信息源失败',
      message: error.message
    });
  }
});

// 创建信息源
router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, type, url, config, interval, enabled } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: '信息源名称和 URL 不能为空' });
    }

    const source = sourceStorage.create(req.user.id, {
      name,
      type: type || detectUrlType(url),
      url,
      config: config || {},
      interval: interval || 3600,
      enabled: enabled !== false
    });

    res.json({
      success: true,
      source
    });
  } catch (error) {
    res.status(500).json({
      error: '创建信息源失败',
      message: error.message
    });
  }
});

// 批量创建信息源
router.post('/batch', authMiddleware, (req, res) => {
  try {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'URLs 必须是非空数组' });
    }

    const sources = [];

    for (const url of urls) {
      const type = detectUrlType(url);
      const name = url.replace(/^https?:\/\//, '').substring(0, 50);

      const source = sourceStorage.create(req.user.id, {
        name,
        type,
        url,
        config: {},
        interval: 3600,
        enabled: true
      });

      sources.push(source);
    }

    res.json({
      success: true,
      sources,
      count: sources.length
    });
  } catch (error) {
    res.status(500).json({
      error: '批量创建信息源失败',
      message: error.message
    });
  }
});

// 更新信息源
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const sourceId = parseInt(req.params.id);
    const source = sourceStorage.findById(sourceId);

    if (!source) {
      return res.status(404).json({ error: '信息源不存在' });
    }

    if (source.userId !== req.user.id) {
      return res.status(403).json({ error: '无权修改此信息源' });
    }

    const updated = sourceStorage.update(sourceId, req.body);

    res.json({
      success: true,
      source: updated
    });
  } catch (error) {
    res.status(500).json({
      error: '更新信息源失败',
      message: error.message
    });
  }
});

// 删除信息源
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const sourceId = parseInt(req.params.id);
    const source = sourceStorage.findById(sourceId);

    if (!source) {
      return res.status(404).json({ error: '信息源不存在' });
    }

    if (source.userId !== req.user.id) {
      return res.status(403).json({ error: '无权删除此信息源' });
    }

    sourceStorage.delete(sourceId);

    res.json({
      success: true,
      message: '信息源已删除'
    });
  } catch (error) {
    res.status(500).json({
      error: '删除信息源失败',
      message: error.message
    });
  }
});

// 手动抓取信息源
router.post('/:id/fetch', authMiddleware, async (req, res) => {
  try {
    const sourceId = parseInt(req.params.id);
    const source = sourceStorage.findById(sourceId);

    if (!source) {
      return res.status(404).json({ error: '信息源不存在' });
    }

    if (source.userId !== req.user.id) {
      return res.status(403).json({ error: '无权操作此信息源' });
    }

    const result = await fetchSource(source);

    res.json({
      success: result.success,
      items: result.items || [],
      error: result.error
    });
  } catch (error) {
    res.status(500).json({
      error: '抓取失败',
      message: error.message
    });
  }
});

export default router;
