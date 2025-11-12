/**
 * 站点转换 API 路由
 */

import express from 'express';
import { parseIntent, generateDSL, validateDSL, checkDangerousContent } from '../transformService.js';
import {
  createSession,
  getSession,
  renewSession,
  incrementRequestCount,
  createSnapshot,
  applySnapshot,
  undoSnapshot,
  getCurrentSnapshot,
  getSessionSnapshots
} from '../sessionService.js';
import {
  checkIPRateLimit,
  checkSessionRateLimit,
  moderateContent,
  addAuditLog,
  hashIP
} from '../moderationService.js';

const router = express.Router();

// 创建或获取会话
router.post('/session', (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const ipHash = hashIP(ip);
    const userAgent = req.headers['user-agent'] || 'unknown';

    // 检查速率限制
    const rateCheck = checkIPRateLimit(ip);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: rateCheck.reason,
        remainingRequests: rateCheck.remainingRequests
      });
    }

    // 创建新会话
    const session = createSession(ipHash, userAgent);

    addAuditLog('session_created', 'info', session.id, { ipHash: ipHash.substring(0, 8) + '***' });

    res.json({
      success: true,
      sessionId: session.id,
      expiresAt: new Date(session.expiresAt).toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: '创建会话失败',
      message: error.message
    });
  }
});

// 解析意图
router.post('/intent/parse', (req, res) => {
  try {
    const { text, sessionId } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    if (!text || !sessionId) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 检查会话
    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: '会话不存在或已过期' });
    }

    // 速率限制
    const ipCheck = checkIPRateLimit(ip);
    const sessionCheck = checkSessionRateLimit(sessionId);

    if (!ipCheck.allowed) {
      return res.status(429).json({ error: ipCheck.reason });
    }

    if (!sessionCheck.allowed) {
      return res.status(429).json({ error: sessionCheck.reason });
    }

    // 内容审查
    const moderation = moderateContent(text, sessionId);
    if (!moderation.passed) {
      addAuditLog('intent_parse_blocked', 'warning', sessionId, {
        reason: 'content_moderation_failed',
        risks: moderation.risks.map(r => r.type)
      });

      return res.status(400).json({
        error: '内容审查未通过',
        risks: moderation.risks,
        message: '您的请求包含不允许的内容，请修改后重试'
      });
    }

    // 解析意图
    const intents = parseIntent(text);

    incrementRequestCount(sessionId);
    renewSession(sessionId);

    res.json({
      success: true,
      intents
    });
  } catch (error) {
    res.status(500).json({
      error: '解析意图失败',
      message: error.message
    });
  }
});

// 编译 DSL（预览模式）
router.post('/compile', (req, res) => {
  try {
    const { text, sessionId, dryRun = true } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    if (!text || !sessionId) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 检查会话
    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: '会话不存在或已过期' });
    }

    // 速率限制
    const ipCheck = checkIPRateLimit(ip);
    const sessionCheck = checkSessionRateLimit(sessionId);

    if (!ipCheck.allowed) {
      return res.status(429).json({ error: ipCheck.reason });
    }

    if (!sessionCheck.allowed) {
      return res.status(429).json({ error: sessionCheck.reason });
    }

    // 内容审查
    const moderation = moderateContent(text, sessionId);
    if (!moderation.passed) {
      addAuditLog('compile_blocked', 'warning', sessionId, {
        reason: 'content_moderation_failed'
      });

      return res.status(400).json({
        error: '内容审查未通过',
        risks: moderation.risks
      });
    }

    // 生成 DSL
    const dsl = generateDSL(text);
    dsl.session_id = sessionId;

    // 验证 DSL
    const validation = validateDSL(dsl);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'DSL 验证失败',
        errors: validation.errors
      });
    }

    // 检查危险内容
    const risks = checkDangerousContent(text);
    if (risks.length > 0) {
      addAuditLog('compile_risks_detected', 'warning', sessionId, {
        risksCount: risks.length
      });
    }

    incrementRequestCount(sessionId);
    renewSession(sessionId);

    res.json({
      success: true,
      dsl,
      previewPatch: dsl, // 简化版本，直接使用 DSL
      warnings: risks.length > 0 ? ['检测到潜在风险'] : []
    });
  } catch (error) {
    res.status(500).json({
      error: '编译失败',
      message: error.message
    });
  }
});

// 应用转换
router.post('/apply', (req, res) => {
  try {
    const { sessionId, dsl } = req.body;

    if (!sessionId || !dsl) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 检查会话
    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: '会话不存在或已过期' });
    }

    // 验证 DSL
    const validation = validateDSL(dsl);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'DSL 验证失败',
        errors: validation.errors
      });
    }

    // 创建快照
    const snapshot = createSnapshot(sessionId, dsl, '用户应用转换');
    applySnapshot(snapshot.id);

    addAuditLog('transform_applied', 'info', sessionId, {
      snapshotId: snapshot.id,
      changesCount: dsl.changes.length
    });

    renewSession(sessionId);

    res.json({
      success: true,
      applied: true,
      snapshotId: snapshot.id
    });
  } catch (error) {
    res.status(500).json({
      error: '应用转换失败',
      message: error.message
    });
  }
});

// 撤销转换
router.post('/undo', (req, res) => {
  try {
    const { sessionId, steps = 1 } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: '缺少会话 ID' });
    }

    // 检查会话
    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: '会话不存在或已过期' });
    }

    // 撤销
    const snapshot = undoSnapshot(sessionId, steps);

    addAuditLog('transform_undone', 'info', sessionId, {
      steps
    });

    renewSession(sessionId);

    res.json({
      success: true,
      restored: true,
      snapshotId: snapshot ? snapshot.id : null,
      dsl: snapshot ? snapshot.dsl : null
    });
  } catch (error) {
    res.status(500).json({
      error: '撤销失败',
      message: error.message
    });
  }
});

// 获取会话状态
router.get('/session/state', (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: '缺少会话 ID' });
    }

    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: '会话不存在或已过期' });
    }

    const currentSnapshot = getCurrentSnapshot(sessionId);
    const snapshots = getSessionSnapshots(sessionId);

    res.json({
      success: true,
      currentSnapshot: currentSnapshot ? currentSnapshot.id : null,
      historySize: snapshots.length,
      ttlMs: session.expiresAt - Date.now()
    });
  } catch (error) {
    res.status(500).json({
      error: '获取会话状态失败',
      message: error.message
    });
  }
});

export default router;
