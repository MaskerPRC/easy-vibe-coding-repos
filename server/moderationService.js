/**
 * 安全审查服务
 * 实现内容过滤、速率限制、黑白名单等安全机制
 */

import crypto from 'crypto';

// ==================== 内存存储 ====================

// IP 请求记录（内存中）
const ipRequestLog = new Map();

// IP 黑名单（内存中）
const ipBlacklist = new Set();

// 会话请求记录（内存中）
const sessionRequestLog = new Map();

// 审计日志（内存中，保留最近1000条）
const auditLog = [];
const MAX_AUDIT_LOG = 1000;

// ==================== 配置 ====================

// 速率限制配置
const RATE_LIMITS = {
  perIpPerMinute: 10,
  perIpPerDay: 200,
  perSessionPerMinute: 6,
  maxConcurrent: 2
};

// 内容限制
const CONTENT_LIMITS = {
  maxTextLength: 800,
  maxChanges: 50
};

// 清理间隔
const CLEANUP_INTERVAL = 60000; // 1分钟

// ==================== 工具函数 ====================

/**
 * 生成 IP 哈希
 */
function hashIP(ip) {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

/**
 * 记录审计日志
 */
function addAuditLog(event, level, sessionId, data = {}) {
  const log = {
    timestamp: new Date().toISOString(),
    event,
    level, // info, warning, error, critical
    sessionId: sessionId || 'unknown',
    ...data
  };

  auditLog.push(log);

  // 限制日志数量
  if (auditLog.length > MAX_AUDIT_LOG) {
    auditLog.shift();
  }

  // 高级别事件打印到控制台
  if (level === 'error' || level === 'critical') {
    console.error(`[安全审计-${level.toUpperCase()}]`, event, data);
  } else if (level === 'warning') {
    console.warn(`[安全审计-${level.toUpperCase()}]`, event, data);
  }

  return log;
}

// ==================== 速率限制 ====================

/**
 * 检查 IP 速率限制
 */
function checkIPRateLimit(ip) {
  const ipHash = hashIP(ip);

  // 检查黑名单
  if (ipBlacklist.has(ipHash)) {
    return {
      allowed: false,
      reason: 'IP 已被封禁',
      remainingRequests: 0
    };
  }

  const now = Date.now();
  const oneMinute = 60 * 1000;
  const oneDay = 24 * 60 * 60 * 1000;

  if (!ipRequestLog.has(ipHash)) {
    ipRequestLog.set(ipHash, {
      requests: [],
      dailyCount: 0,
      dailyResetAt: now + oneDay
    });
  }

  const log = ipRequestLog.get(ipHash);

  // 重置每日计数
  if (now > log.dailyResetAt) {
    log.dailyCount = 0;
    log.dailyResetAt = now + oneDay;
  }

  // 清理旧请求记录（超过1分钟）
  log.requests = log.requests.filter(t => now - t < oneMinute);

  // 检查每分钟限制
  if (log.requests.length >= RATE_LIMITS.perIpPerMinute) {
    addAuditLog('rate_limit_exceeded', 'warning', null, {
      ipHash: ipHash.substring(0, 8) + '***',
      type: 'per_minute'
    });

    return {
      allowed: false,
      reason: `每分钟请求次数超限（限制：${RATE_LIMITS.perIpPerMinute}次）`,
      remainingRequests: 0,
      resetIn: oneMinute - (now - log.requests[0])
    };
  }

  // 检查每日限制
  if (log.dailyCount >= RATE_LIMITS.perIpPerDay) {
    addAuditLog('rate_limit_exceeded', 'warning', null, {
      ipHash: ipHash.substring(0, 8) + '***',
      type: 'per_day'
    });

    return {
      allowed: false,
      reason: `每日请求次数超限（限制：${RATE_LIMITS.perIpPerDay}次）`,
      remainingRequests: 0,
      resetIn: log.dailyResetAt - now
    };
  }

  // 记录请求
  log.requests.push(now);
  log.dailyCount++;

  return {
    allowed: true,
    remainingRequests: RATE_LIMITS.perIpPerMinute - log.requests.length,
    dailyRemaining: RATE_LIMITS.perIpPerDay - log.dailyCount
  };
}

/**
 * 检查会话速率限制
 */
function checkSessionRateLimit(sessionId) {
  const now = Date.now();
  const oneMinute = 60 * 1000;

  if (!sessionRequestLog.has(sessionId)) {
    sessionRequestLog.set(sessionId, {
      requests: []
    });
  }

  const log = sessionRequestLog.get(sessionId);

  // 清理旧请求记录
  log.requests = log.requests.filter(t => now - t < oneMinute);

  // 检查限制
  if (log.requests.length >= RATE_LIMITS.perSessionPerMinute) {
    return {
      allowed: false,
      reason: `会话每分钟请求次数超限（限制：${RATE_LIMITS.perSessionPerMinute}次）`,
      remainingRequests: 0
    };
  }

  // 记录请求
  log.requests.push(now);

  return {
    allowed: true,
    remainingRequests: RATE_LIMITS.perSessionPerMinute - log.requests.length
  };
}

// ==================== 内容审查 ====================

/**
 * 审查文本内容
 */
function moderateContent(text, sessionId) {
  const risks = [];

  // 检查长度
  if (text.length > CONTENT_LIMITS.maxTextLength) {
    risks.push({
      type: 'length_exceeded',
      severity: 'medium',
      message: `文本长度超限（${text.length}/${CONTENT_LIMITS.maxTextLength}）`
    });
  }

  // 检查危险关键词
  const dangerousKeywords = [
    'rm -rf', 'format', 'shutdown', 'reboot', 'kill', 'exec', 'eval',
    '<script', 'javascript:', 'onerror', 'onload', 'onclick',
    'fetch(', 'XMLHttpRequest', 'ajax', 'import(',
    'innerHTML', 'outerHTML', 'document.write', '__proto__',
    'DROP TABLE', 'DELETE FROM', 'UPDATE SET', 'INSERT INTO'
  ];

  const lowerText = text.toLowerCase();
  for (const keyword of dangerousKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      risks.push({
        type: 'dangerous_keyword',
        severity: 'high',
        keyword,
        message: `检测到危险关键词: ${keyword}`
      });
    }
  }

  // 检查提示注入
  const promptInjectionKeywords = [
    'ignore previous', 'forget instructions', 'new instructions',
    '忽略之前', '忘记指令', '新指令', '系统提示',
    'system prompt', 'override', 'bypass', '绕过'
  ];

  for (const keyword of promptInjectionKeywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      risks.push({
        type: 'prompt_injection',
        severity: 'high',
        keyword,
        message: `检测到提示注入尝试: ${keyword}`
      });
    }
  }

  // 检查 HTML 注入
  if (/<[^>]+>/.test(text)) {
    risks.push({
      type: 'html_injection',
      severity: 'high',
      message: '检测到 HTML 标签'
    });
  }

  // 检查 SQL 注入
  if (/SELECT\s+.*\s+FROM|DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO/i.test(text)) {
    risks.push({
      type: 'sql_injection',
      severity: 'critical',
      message: '检测到 SQL 注入模式'
    });
  }

  // 检查敏感词汇（简化版）
  const sensitivePhrases = ['暴力', '色情', '赌博'];
  for (const phrase of sensitivePhrases) {
    if (text.includes(phrase)) {
      risks.push({
        type: 'sensitive_content',
        severity: 'high',
        message: `检测到敏感词汇: ${phrase}`
      });
    }
  }

  // 记录审计
  if (risks.length > 0) {
    const highSeverity = risks.some(r => r.severity === 'critical' || r.severity === 'high');
    addAuditLog('content_moderation_failed', highSeverity ? 'error' : 'warning', sessionId, {
      risksCount: risks.count,
      risks: risks.map(r => r.type)
    });
  }

  return {
    passed: risks.filter(r => r.severity === 'critical' || r.severity === 'high').length === 0,
    risks,
    action: risks.some(r => r.severity === 'critical') ? 'block' :
            risks.some(r => r.severity === 'high') ? 'block' : 'allow'
  };
}

// ==================== 黑名单管理 ====================

/**
 * 添加 IP 到黑名单
 */
function banIP(ip, reason = '') {
  const ipHash = hashIP(ip);
  ipBlacklist.add(ipHash);

  addAuditLog('ip_banned', 'warning', null, {
    ipHash: ipHash.substring(0, 8) + '***',
    reason
  });

  return true;
}

/**
 * 从黑名单移除 IP
 */
function unbanIP(ip) {
  const ipHash = hashIP(ip);
  const removed = ipBlacklist.delete(ipHash);

  if (removed) {
    addAuditLog('ip_unbanned', 'info', null, {
      ipHash: ipHash.substring(0, 8) + '***'
    });
  }

  return removed;
}

/**
 * 检查 IP 是否被封禁
 */
function isIPBanned(ip) {
  const ipHash = hashIP(ip);
  return ipBlacklist.has(ipHash);
}

/**
 * 获取黑名单列表
 */
function getBlacklist() {
  return Array.from(ipBlacklist).map(hash => ({
    ipHash: hash.substring(0, 8) + '***'
  }));
}

// ==================== 清理任务 ====================

/**
 * 清理过期的请求日志
 */
function cleanupRequestLogs() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  let cleanedCount = 0;

  // 清理 IP 请求日志
  for (const [ipHash, log] of ipRequestLog.entries()) {
    if (now > log.dailyResetAt + oneDay) {
      ipRequestLog.delete(ipHash);
      cleanedCount++;
    }
  }

  // 清理会话请求日志
  for (const [sessionId, log] of sessionRequestLog.entries()) {
    if (log.requests.length === 0 || now - log.requests[log.requests.length - 1] > oneDay) {
      sessionRequestLog.delete(sessionId);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`[日志清理] 清理了 ${cleanedCount} 条过期日志`);
  }

  return cleanedCount;
}

// 启动定期清理
setInterval(cleanupRequestLogs, CLEANUP_INTERVAL);

// ==================== 统计信息 ====================

/**
 * 获取安全统计
 */
function getSecurityStats() {
  const recentLogs = auditLog.slice(-100);

  return {
    totalAuditLogs: auditLog.length,
    bannedIPs: ipBlacklist.size,
    activeIPTracking: ipRequestLog.size,
    activeSessionTracking: sessionRequestLog.size,
    recentIncidents: recentLogs.filter(log =>
      log.level === 'error' || log.level === 'critical'
    ).length,
    recentWarnings: recentLogs.filter(log =>
      log.level === 'warning'
    ).length
  };
}

/**
 * 获取审计日志
 */
function getAuditLogs(limit = 100) {
  return auditLog.slice(-limit).reverse();
}

// ==================== 导出 ====================

export {
  checkIPRateLimit,
  checkSessionRateLimit,
  moderateContent,
  banIP,
  unbanIP,
  isIPBanned,
  getBlacklist,
  getSecurityStats,
  getAuditLogs,
  addAuditLog,
  hashIP
};
