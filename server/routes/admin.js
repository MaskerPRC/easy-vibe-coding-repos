/**
 * 管理端 API 路由
 */

import express from 'express';
import { authMiddleware } from '../auth.js';
import { getStats as getSessionStats, getAllSessions } from '../sessionService.js';
import {
  banIP,
  unbanIP,
  getBlacklist,
  getSecurityStats,
  getAuditLogs
} from '../moderationService.js';

const router = express.Router();

// 获取转换统计
router.get('/transform/metrics', authMiddleware, (req, res) => {
  try {
    const sessionStats = getSessionStats();
    const securityStats = getSecurityStats();
    const auditLogs = getAuditLogs(50);

    res.json({
      success: true,
      metrics: {
        sessions: sessionStats,
        security: securityStats,
        recentLogs: auditLogs
      }
    });
  } catch (error) {
    res.status(500).json({
      error: '获取统计失败',
      message: error.message
    });
  }
});

// 获取所有会话
router.get('/transform/sessions', authMiddleware, (req, res) => {
  try {
    const sessions = getAllSessions();

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    res.status(500).json({
      error: '获取会话列表失败',
      message: error.message
    });
  }
});

// 封禁 IP
router.post('/transform/ban', authMiddleware, (req, res) => {
  try {
    const { ip, reason } = req.body;

    if (!ip) {
      return res.status(400).json({ error: '缺少 IP 地址' });
    }

    banIP(ip, reason || '管理员手动封禁');

    res.json({
      success: true,
      message: 'IP 已封禁'
    });
  } catch (error) {
    res.status(500).json({
      error: '封禁失败',
      message: error.message
    });
  }
});

// 解封 IP
router.post('/transform/unban', authMiddleware, (req, res) => {
  try {
    const { ip } = req.body;

    if (!ip) {
      return res.status(400).json({ error: '缺少 IP 地址' });
    }

    const removed = unbanIP(ip);

    res.json({
      success: true,
      removed,
      message: removed ? 'IP 已解封' : 'IP 不在黑名单中'
    });
  } catch (error) {
    res.status(500).json({
      error: '解封失败',
      message: error.message
    });
  }
});

// 获取黑名单
router.get('/transform/blacklist', authMiddleware, (req, res) => {
  try {
    const blacklist = getBlacklist();

    res.json({
      success: true,
      blacklist
    });
  } catch (error) {
    res.status(500).json({
      error: '获取黑名单失败',
      message: error.message
    });
  }
});

export default router;
