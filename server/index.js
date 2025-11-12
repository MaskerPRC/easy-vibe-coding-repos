import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { store, generateId } from './store.js';
import { validateDSL } from './dsl.js';
import { performSecurityCheck, validateDSLSecurity, getRiskLevel } from './policy.js';
import { checkRateLimit, getClientIP, getOrCreateSession, touchSession, banIP, banSession, unbanIP, unbanSession } from './rateLimit.js';
import { parseIntent, compileToDSL, getSupportedElements, getSupportedColors } from './intentParser.js';
import { createSnapshot, getSessionState, undo, resetToInitial, generateDSLHash, verifyDSLHash } from './snapshot.js';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.json());

// 请求ID中间件
app.use((req, res, next) => {
  req.requestId = generateId();
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// 日志中间件
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.requestId}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// ==================== 意图解析API ====================

/**
 * POST /api/v1/intent/parse
 * 解析用户输入的意图
 */
app.post('/api/v1/intent/parse', async (req, res) => {
  try {
    const { text, session_id } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '缺少必需参数: text'
      });
    }

    // 安全检查
    const securityCheck = performSecurityCheck(text);
    if (!securityCheck.safe) {
      store.audit.add({
        level: 'warn',
        event: 'security_check_failed',
        sessionId: session_id,
        data: { reasons: securityCheck.reasons }
      });

      return res.status(403).json({
        request_id: req.requestId,
        status: 'rejected',
        error: '输入内容不符合安全要求',
        reasons: securityCheck.reasons
      });
    }

    // 解析意图
    const intents = parseIntent(text);

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: {
        intents,
        masked_text: securityCheck.masked
      }
    });

  } catch (error) {
    console.error('意图解析错误:', error);
    res.status(500).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

// ==================== DSL编译API ====================

/**
 * POST /api/v1/transform/compile
 * 编译自然语言为DSL
 */
app.post('/api/v1/transform/compile', async (req, res) => {
  try {
    const { text, session_id, dry_run = true } = req.body;

    if (!text) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '缺少必需参数: text'
      });
    }

    if (!session_id) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '缺少必需参数: session_id'
      });
    }

    // 获取客户端IP
    const clientIP = getClientIP(req);

    // 速率限制检查
    const rateCheck = checkRateLimit(clientIP, session_id);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        request_id: req.requestId,
        status: 'rate_limited',
        error: rateCheck.reason,
        retry_after: rateCheck.retryAfter
      });
    }

    // 创建或获取会话
    const session = getOrCreateSession(session_id, clientIP, req.headers['user-agent']);

    // 安全检查
    const securityCheck = performSecurityCheck(text);
    if (!securityCheck.safe) {
      // 记录请求
      store.requests.set(req.requestId, {
        id: req.requestId,
        sessionId: session_id,
        textMasked: securityCheck.masked,
        riskLevel: 'high',
        status: 'rejected',
        createdAt: Date.now()
      });

      return res.status(403).json({
        request_id: req.requestId,
        status: 'rejected',
        error: '输入内容不符合安全要求',
        reasons: securityCheck.reasons
      });
    }

    // 编译为DSL
    const compileResult = compileToDSL(text);

    if (!compileResult.success) {
      return res.json({
        request_id: req.requestId,
        status: 'failed',
        error: compileResult.error || '无法理解您的请求',
        suggestions: compileResult.suggestions
      });
    }

    // DSL验证
    const dslValidation = validateDSL(compileResult.dsl);
    if (!dslValidation.valid) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'validation_failed',
        error: 'DSL验证失败',
        errors: dslValidation.errors
      });
    }

    // 策略安全检查
    const policyCheck = validateDSLSecurity(compileResult.dsl);
    if (!policyCheck.safe) {
      return res.status(403).json({
        request_id: req.requestId,
        status: 'policy_rejected',
        error: 'DSL不符合安全策略',
        errors: policyCheck.errors
      });
    }

    // 生成预览哈希
    const previewHash = generateDSLHash(compileResult.dsl);

    // 记录请求
    const riskLevel = getRiskLevel(securityCheck.checks);
    store.requests.set(req.requestId, {
      id: req.requestId,
      sessionId: session_id,
      textMasked: securityCheck.masked,
      riskLevel,
      status: 'passed',
      createdAt: Date.now()
    });

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: {
        dsl: compileResult.dsl,
        preview_hash: previewHash,
        intent: compileResult.intent,
        warnings: []
      }
    });

  } catch (error) {
    console.error('编译错误:', error);
    res.status(500).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

// ==================== 应用改造API ====================

/**
 * POST /api/v1/transform/apply
 * 应用DSL改造
 */
app.post('/api/v1/transform/apply', async (req, res) => {
  try {
    const { session_id, dsl, preview_hash } = req.body;

    if (!session_id || !dsl || !preview_hash) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '缺少必需参数'
      });
    }

    // 验证哈希
    if (!verifyDSLHash(dsl, preview_hash)) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: 'DSL哈希验证失败'
      });
    }

    // 再次验证DSL
    const dslValidation = validateDSL(dsl);
    if (!dslValidation.valid) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'validation_failed',
        errors: dslValidation.errors
      });
    }

    // 再次策略检查
    const policyCheck = validateDSLSecurity(dsl);
    if (!policyCheck.safe) {
      return res.status(403).json({
        request_id: req.requestId,
        status: 'policy_rejected',
        errors: policyCheck.errors
      });
    }

    // 创建快照
    const snapshot = createSnapshot(session_id, dsl, {
      requestId: req.requestId,
      appliedAt: Date.now()
    });

    // 记录改造
    store.transforms.set(generateId(), {
      id: req.requestId,
      sessionId: session_id,
      dsl,
      previewHash: preview_hash,
      approvedAt: Date.now()
    });

    // 更新会话活跃时间
    touchSession(session_id);

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: {
        applied: true,
        snapshot_id: snapshot.id
      }
    });

  } catch (error) {
    console.error('应用错误:', error);
    res.status(500).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

// ==================== 撤销API ====================

/**
 * POST /api/v1/transform/undo
 * 撤销改造
 */
app.post('/api/v1/transform/undo', async (req, res) => {
  try {
    const { session_id, steps = 1 } = req.body;

    if (!session_id) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '缺少必需参数: session_id'
      });
    }

    const result = undo(session_id, steps);

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: {
        restored: true,
        snapshot_id: result.current ? result.current.id : null,
        removed_count: result.removed.length
      }
    });

  } catch (error) {
    res.status(400).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

/**
 * POST /api/v1/transform/reset
 * 重置到初始状态
 */
app.post('/api/v1/transform/reset', async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '缺少必需参数: session_id'
      });
    }

    const result = resetToInitial(session_id);

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: {
        restored: true,
        removed_count: result.removed.length
      }
    });

  } catch (error) {
    res.status(400).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

// ==================== 会话状态API ====================

/**
 * GET /api/v1/session/state
 * 获取会话状态
 */
app.get('/api/v1/session/state', (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '缺少必需参数: session_id'
      });
    }

    const state = getSessionState(session_id);

    if (!state) {
      return res.json({
        request_id: req.requestId,
        status: 'success',
        data: {
          exists: false
        }
      });
    }

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: {
        exists: true,
        ...state
      }
    });

  } catch (error) {
    res.status(500).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

// ==================== 管理端API ====================

/**
 * GET /api/v1/admin/metrics
 * 获取系统指标
 */
app.get('/api/v1/admin/metrics', (req, res) => {
  try {
    const stats = store.stats.get();
    const rateLimits = store.rateLimit.getAll();
    const banned = store.banned.getAll();

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: {
        stats,
        rate_limits: {
          total: rateLimits.length,
          active: rateLimits.filter(([_, r]) => r.count > 0).length
        },
        banned: {
          total: banned.length,
          ips: banned.filter(([k]) => k.includes('.')).length,
          sessions: banned.filter(([k]) => !k.includes('.')).length
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

/**
 * POST /api/v1/admin/ban
 * 封禁IP或会话
 */
app.post('/api/v1/admin/ban', (req, res) => {
  try {
    const { target, type, reason } = req.body;

    if (!target || !type) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '缺少必需参数'
      });
    }

    if (type === 'ip') {
      banIP(target, reason);
    } else if (type === 'session') {
      banSession(target, reason);
    } else {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '无效的封禁类型'
      });
    }

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: { banned: true }
    });

  } catch (error) {
    res.status(500).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

/**
 * POST /api/v1/admin/unban
 * 解封IP或会话
 */
app.post('/api/v1/admin/unban', (req, res) => {
  try {
    const { target, type } = req.body;

    if (!target || !type) {
      return res.status(400).json({
        request_id: req.requestId,
        status: 'error',
        error: '缺少必需参数'
      });
    }

    let success = false;
    if (type === 'ip') {
      success = unbanIP(target);
    } else if (type === 'session') {
      success = unbanSession(target);
    }

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: { unbanned: success }
    });

  } catch (error) {
    res.status(500).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

/**
 * GET /api/v1/admin/audit
 * 获取审计日志
 */
app.get('/api/v1/admin/audit', (req, res) => {
  try {
    const { limit = 100 } = req.query;
    const logs = store.audit.getRecent(parseInt(limit));

    res.json({
      request_id: req.requestId,
      status: 'success',
      data: {
        logs,
        total: logs.length
      }
    });

  } catch (error) {
    res.status(500).json({
      request_id: req.requestId,
      status: 'error',
      error: error.message
    });
  }
});

/**
 * GET /api/v1/info
 * 获取系统信息
 */
app.get('/api/v1/info', (req, res) => {
  res.json({
    request_id: req.requestId,
    status: 'success',
    data: {
      version: '1.0',
      supported_elements: getSupportedElements(),
      supported_colors: getSupportedColors(),
      features: [
        'change_text',
        'change_theme',
        'toggle_element',
        'undo',
        'reset'
      ]
    }
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    request_id: req.requestId,
    status: 'error',
    error: '服务器内部错误',
    message: err.message
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    request_id: req.requestId,
    status: 'error',
    error: '未找到资源',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`应用项目后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`系统信息: http://localhost:${PORT}/api/v1/info`);
});

