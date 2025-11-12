import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { intentParser } from './intentParser.js';
import { securityValidator } from './securityValidator.js';
import { sessionManager } from './sessionManager.js';
import { rateLimiter } from './rateLimiter.js';
import { auditLogger } from './auditLogger.js';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 设置安全响应头
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'");
  next();
});

// 获取客户端IP
function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         'unknown';
}

// POST /mvp/compile - 编译自然语言为DSL
app.post('/api/mvp/compile', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const clientIp = getClientIp(req);
  const { text, session_id } = req.body;

  try {
    // 验证输入
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        request_id: requestId,
        status: 'error',
        error: '请求参数无效：缺少text字段'
      });
    }

    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({
        request_id: requestId,
        status: 'error',
        error: '请求参数无效：缺少session_id字段'
      });
    }

    // 检查频率限制
    const rateLimitResult = rateLimiter.check(clientIp, session_id);
    if (!rateLimitResult.allowed) {
      auditLogger.log({
        request_id: requestId,
        session_id,
        ip: clientIp,
        action: 'compile',
        status: 'rate_limited',
        reason: rateLimitResult.reason
      });

      return res.status(429).json({
        request_id: requestId,
        status: 'error',
        error: `频率限制：${rateLimitResult.reason}`
      });
    }

    // 检查封禁状态
    if (rateLimiter.isBanned(clientIp) || rateLimiter.isBanned(session_id)) {
      auditLogger.log({
        request_id: requestId,
        session_id,
        ip: clientIp,
        action: 'compile',
        status: 'banned',
        reason: '已被封禁'
      });

      return res.status(403).json({
        request_id: requestId,
        status: 'error',
        error: '访问被拒绝：您已被封禁'
      });
    }

    // 第一步：文本安全审查
    const textValidation = securityValidator.validateText(text);
    if (!textValidation.safe) {
      auditLogger.log({
        request_id: requestId,
        session_id,
        ip: clientIp,
        action: 'compile',
        status: 'rejected',
        reason: textValidation.reason,
        input: text
      });

      return res.json({
        request_id: requestId,
        status: 'error',
        error: `因安全策略未通过，未执行任何更改：${textValidation.reason}`
      });
    }

    // 第二步：意图解析，生成DSL
    const parseResult = intentParser.parse(textValidation.sanitizedText || text);
    if (!parseResult.success) {
      auditLogger.log({
        request_id: requestId,
        session_id,
        ip: clientIp,
        action: 'compile',
        status: 'parse_failed',
        reason: parseResult.error,
        input: text
      });

      return res.json({
        request_id: requestId,
        status: 'error',
        error: `无法理解您的需求：${parseResult.error}`
      });
    }

    const dsl = parseResult.dsl;

    // 第三步：DSL策略校验
    const policyValidation = securityValidator.validateDSL(dsl);
    if (!policyValidation.valid) {
      auditLogger.log({
        request_id: requestId,
        session_id,
        ip: clientIp,
        action: 'compile',
        status: 'policy_rejected',
        reason: policyValidation.reason,
        dsl: dsl
      });

      return res.json({
        request_id: requestId,
        status: 'error',
        error: `因安全策略未通过，未执行任何更改：${policyValidation.reason}`
      });
    }

    // 生成预览补丁（前端执行指令）
    const previewPatch = dsl.changes;
    const previewHash = Buffer.from(JSON.stringify(previewPatch)).toString('base64').substr(0, 16);

    // 记录成功
    auditLogger.log({
      request_id: requestId,
      session_id,
      ip: clientIp,
      action: 'compile',
      status: 'success',
      dsl: dsl
    });

    res.json({
      request_id: requestId,
      status: 'ok',
      data: {
        dsl,
        preview_patch: previewPatch,
        preview_hash: previewHash,
        warnings: policyValidation.warnings || []
      }
    });

  } catch (error) {
    console.error('编译错误:', error);
    auditLogger.log({
      request_id: requestId,
      session_id,
      ip: clientIp,
      action: 'compile',
      status: 'error',
      error: error.message
    });

    res.status(500).json({
      request_id: requestId,
      status: 'error',
      error: '服务器内部错误'
    });
  }
});

// POST /mvp/apply - 应用变更
app.post('/api/mvp/apply', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const clientIp = getClientIp(req);
  const { session_id, dsl, preview_hash } = req.body;

  try {
    // 验证输入
    if (!session_id || !dsl || !preview_hash) {
      return res.status(400).json({
        request_id: requestId,
        status: 'error',
        error: '请求参数无效'
      });
    }

    // 检查频率限制
    const rateLimitResult = rateLimiter.check(clientIp, session_id);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        request_id: requestId,
        status: 'error',
        error: `频率限制：${rateLimitResult.reason}`
      });
    }

    // 再次校验DSL（防止篡改）
    const policyValidation = securityValidator.validateDSL(dsl);
    if (!policyValidation.valid) {
      auditLogger.log({
        request_id: requestId,
        session_id,
        ip: clientIp,
        action: 'apply',
        status: 'policy_rejected',
        reason: policyValidation.reason
      });

      return res.json({
        request_id: requestId,
        status: 'error',
        error: `因安全策略未通过：${policyValidation.reason}`
      });
    }

    // 保存快照到会话
    const snapshotId = sessionManager.saveSnapshot(session_id, dsl);

    // 记录应用
    auditLogger.log({
      request_id: requestId,
      session_id,
      ip: clientIp,
      action: 'apply',
      status: 'success',
      snapshot_id: snapshotId,
      dsl: dsl
    });

    res.json({
      request_id: requestId,
      status: 'ok',
      data: {
        applied: true,
        snapshot_id: snapshotId
      }
    });

  } catch (error) {
    console.error('应用错误:', error);
    auditLogger.log({
      request_id: requestId,
      session_id,
      ip: clientIp,
      action: 'apply',
      status: 'error',
      error: error.message
    });

    res.status(500).json({
      request_id: requestId,
      status: 'error',
      error: '服务器内部错误'
    });
  }
});

// POST /mvp/undo - 撤销变更
app.post('/api/mvp/undo', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const clientIp = getClientIp(req);
  const { session_id } = req.body;

  try {
    if (!session_id) {
      return res.status(400).json({
        request_id: requestId,
        status: 'error',
        error: '请求参数无效：缺少session_id'
      });
    }

    // 清除会话快照
    const cleared = sessionManager.clearSnapshot(session_id);

    auditLogger.log({
      request_id: requestId,
      session_id,
      ip: clientIp,
      action: 'undo',
      status: 'success',
      cleared
    });

    res.json({
      request_id: requestId,
      status: 'ok',
      data: {
        undone: true
      }
    });

  } catch (error) {
    console.error('撤销错误:', error);
    res.status(500).json({
      request_id: requestId,
      status: 'error',
      error: '服务器内部错误'
    });
  }
});

// GET /mvp/admin/audit - 获取审计日志（管理端）
app.get('/api/mvp/admin/audit', (req, res) => {
  const limit = parseInt(req.query.limit) || 200;
  const logs = auditLogger.getLogs(limit);

  res.json({
    status: 'ok',
    data: {
      logs,
      total: logs.length
    }
  });
});

// POST /mvp/admin/ban - 封禁IP或会话
app.post('/api/mvp/admin/ban', (req, res) => {
  const { ip_or_session } = req.body;

  if (!ip_or_session) {
    return res.status(400).json({
      status: 'error',
      error: '请求参数无效'
    });
  }

  rateLimiter.ban(ip_or_session);
  auditLogger.log({
    action: 'admin_ban',
    status: 'success',
    target: ip_or_session
  });

  res.json({
    status: 'ok',
    data: {
      banned: ip_or_session
    }
  });
});

// POST /mvp/admin/unban - 解封IP或会话
app.post('/api/mvp/admin/unban', (req, res) => {
  const { ip_or_session } = req.body;

  if (!ip_or_session) {
    return res.status(400).json({
      status: 'error',
      error: '请求参数无效'
    });
  }

  rateLimiter.unban(ip_or_session);
  auditLogger.log({
    action: 'admin_unban',
    status: 'success',
    target: ip_or_session
  });

  res.json({
    status: 'ok',
    data: {
      unbanned: ip_or_session
    }
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'mvp-backend',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到资源',
    path: req.path
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`MVP后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
});
