// 速率限制和配额系统

import { store } from './store.js';

/**
 * 速率限制配置
 */
const RATE_LIMIT_CONFIG = {
  // 每IP限制
  perIP: {
    perMinute: 10,  // 每分钟10次
    perHour: 200,   // 每小时200次
    concurrent: 2    // 最大并发2个
  },

  // 每会话限制
  perSession: {
    perMinute: 6,    // 每分钟6次
    maxRounds: 20    // 最多20轮对话
  },

  // 封禁配置
  ban: {
    duration: 60 * 60 * 1000, // 封禁1小时
    threshold: 3              // 超限3次后封禁
  }
};

/**
 * 检查IP是否被封禁
 */
export function isIPBanned(ip) {
  return store.banned.has(ip);
}

/**
 * 检查会话是否被封禁
 */
export function isSessionBanned(sessionId) {
  return store.banned.has(sessionId);
}

/**
 * 封禁IP
 */
export function banIP(ip, reason = '违反使用规则') {
  const now = Date.now();
  store.banned.set(ip, {
    reason,
    bannedAt: now,
    expiresAt: now + RATE_LIMIT_CONFIG.ban.duration
  });

  store.audit.add({
    level: 'warn',
    event: 'ip_banned',
    sessionId: null,
    data: { ip: maskIP(ip), reason }
  });

  return true;
}

/**
 * 封禁会话
 */
export function banSession(sessionId, reason = '违反使用规则') {
  const now = Date.now();
  store.banned.set(sessionId, {
    reason,
    bannedAt: now,
    expiresAt: now + RATE_LIMIT_CONFIG.ban.duration
  });

  store.audit.add({
    level: 'warn',
    event: 'session_banned',
    sessionId,
    data: { reason }
  });

  return true;
}

/**
 * 解封IP
 */
export function unbanIP(ip) {
  const removed = store.banned.delete(ip);
  if (removed) {
    store.audit.add({
      level: 'info',
      event: 'ip_unbanned',
      sessionId: null,
      data: { ip: maskIP(ip) }
    });
  }
  return removed;
}

/**
 * 解封会话
 */
export function unbanSession(sessionId) {
  const removed = store.banned.delete(sessionId);
  if (removed) {
    store.audit.add({
      level: 'info',
      event: 'session_unbanned',
      sessionId,
      data: {}
    });
  }
  return removed;
}

/**
 * 检查并更新速率限制（IP级别）
 */
export function checkIPRateLimit(ip) {
  // 检查是否被封禁
  if (isIPBanned(ip)) {
    const ban = store.banned.get(ip);
    return {
      allowed: false,
      reason: '您的IP已被封禁',
      banInfo: ban
    };
  }

  const now = Date.now();
  let limit = store.rateLimit.get(ip);

  // 初始化或重置窗口
  if (!limit || (now - limit.windowStart) > 60000) {
    limit = {
      count: 0,
      windowStart: now,
      violations: 0
    };
  }

  // 检查是否超限
  if (limit.count >= RATE_LIMIT_CONFIG.perIP.perMinute) {
    limit.violations = (limit.violations || 0) + 1;

    // 超限次数过多，封禁
    if (limit.violations >= RATE_LIMIT_CONFIG.ban.threshold) {
      banIP(ip, '频繁超限请求');
      return {
        allowed: false,
        reason: '请求过于频繁，您的IP已被封禁'
      };
    }

    store.rateLimit.set(ip, limit);
    return {
      allowed: false,
      reason: `请求过于频繁，请稍后再试（每分钟最多${RATE_LIMIT_CONFIG.perIP.perMinute}次）`,
      retryAfter: 60 - Math.floor((now - limit.windowStart) / 1000)
    };
  }

  // 允许请求，增加计数
  limit.count++;
  store.rateLimit.set(ip, limit);

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.perIP.perMinute - limit.count
  };
}

/**
 * 检查会话配额
 */
export function checkSessionQuota(sessionId) {
  // 检查是否被封禁
  if (isSessionBanned(sessionId)) {
    const ban = store.banned.get(sessionId);
    return {
      allowed: false,
      reason: '该会话已被封禁',
      banInfo: ban
    };
  }

  const session = store.sessions.get(sessionId);
  if (!session) {
    return { allowed: true }; // 新会话
  }

  // 检查会话请求次数
  const requests = store.requests.getBySession(sessionId);
  const now = Date.now();
  const recentRequests = requests.filter(r => (now - r.createdAt) < 60000);

  if (recentRequests.length >= RATE_LIMIT_CONFIG.perSession.perMinute) {
    return {
      allowed: false,
      reason: `会话请求过于频繁（每分钟最多${RATE_LIMIT_CONFIG.perSession.perMinute}次）`
    };
  }

  // 检查总轮数
  if (requests.length >= RATE_LIMIT_CONFIG.perSession.maxRounds) {
    return {
      allowed: false,
      reason: `已达到会话最大轮数（${RATE_LIMIT_CONFIG.perSession.maxRounds}轮）`
    };
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.perSession.maxRounds - requests.length
  };
}

/**
 * 综合速率检查
 */
export function checkRateLimit(ip, sessionId) {
  // IP级别检查
  const ipCheck = checkIPRateLimit(ip);
  if (!ipCheck.allowed) {
    return ipCheck;
  }

  // 会话级别检查
  const sessionCheck = checkSessionQuota(sessionId);
  if (!sessionCheck.allowed) {
    return sessionCheck;
  }

  return {
    allowed: true,
    ipRemaining: ipCheck.remaining,
    sessionRemaining: sessionCheck.remaining
  };
}

/**
 * 获取客户端IP（从请求中提取）
 */
export function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         '127.0.0.1';
}

/**
 * IP脱敏
 */
function maskIP(ip) {
  if (!ip) return '***';
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.***.***`;
  }
  return ip.substring(0, 8) + '***';
}

/**
 * 创建或获取会话
 */
export function getOrCreateSession(sessionId, ip, ua) {
  let session = store.sessions.get(sessionId);

  if (!session) {
    const now = Date.now();
    const TTL = 30 * 60 * 1000; // 30分钟

    session = {
      id: sessionId,
      ipHash: hashString(ip),
      uaHash: hashString(ua || ''),
      createdAt: now,
      ttlAt: now + TTL,
      quota: {
        requests: 0,
        transforms: 0
      }
    };

    store.sessions.set(sessionId, session);

    store.audit.add({
      level: 'info',
      event: 'session_created',
      sessionId,
      data: { ttl: TTL }
    });
  }

  return session;
}

/**
 * 简单哈希函数
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * 更新会话活跃时间
 */
export function touchSession(sessionId) {
  const session = store.sessions.get(sessionId);
  if (session) {
    const now = Date.now();
    const TTL = 30 * 60 * 1000;
    session.ttlAt = now + TTL;
    store.sessions.set(sessionId, session);
  }
}

/**
 * 获取速率限制配置
 */
export function getRateLimitConfig() {
  return RATE_LIMIT_CONFIG;
}

export { RATE_LIMIT_CONFIG, maskIP };
