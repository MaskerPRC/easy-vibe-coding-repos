// 内存存储模块 - 所有数据仅存储在内存中，重启后会丢失
// 符合Vercel等无服务器环境的部署要求

/**
 * 会话存储
 * 结构: { sessionId: { id, ipHash, uaHash, createdAt, ttlAt, quota } }
 */
const sessions = new Map();

/**
 * 请求记录存储
 * 结构: { requestId: { id, sessionId, textMasked, riskLevel, status, createdAt } }
 */
const requests = new Map();

/**
 * 改造记录存储
 * 结构: { transformId: { id, sessionId, dsl, previewHash, approvedAt } }
 */
const transforms = new Map();

/**
 * 快照存储
 * 结构: { snapshotId: { id, sessionId, baseRev, patch, createdAt } }
 */
const snapshots = new Map();

/**
 * 审计日志存储（脱敏后的）
 * 结构: { logId: { id, level, event, sessionId, data, createdAt } }
 */
const auditLogs = [];

/**
 * IP速率限制存储
 * 结构: { ip: { count, windowStart, banned, banUntil } }
 */
const rateLimits = new Map();

/**
 * 封禁列表
 * 结构: { ip/sessionId: { reason, bannedAt, expiresAt } }
 */
const bannedList = new Map();

/**
 * 会话历史存储（用于撤销功能）
 * 结构: { sessionId: [snapshotId1, snapshotId2, ...] }
 */
const sessionHistory = new Map();

// 统计数据
const stats = {
  totalRequests: 0,
  passedRequests: 0,
  rejectedRequests: 0,
  totalTransforms: 0,
  totalSessions: 0,
  startTime: Date.now()
};

// 导出存储访问接口
export const store = {
  // 会话管理
  sessions: {
    get: (id) => sessions.get(id),
    set: (id, data) => {
      sessions.set(id, data);
      stats.totalSessions = sessions.size;
    },
    delete: (id) => {
      sessions.delete(id);
      sessionHistory.delete(id);
    },
    getAll: () => Array.from(sessions.values()),
    size: () => sessions.size
  },

  // 请求管理
  requests: {
    get: (id) => requests.get(id),
    set: (id, data) => {
      requests.set(id, data);
      stats.totalRequests++;
      if (data.status === 'passed') stats.passedRequests++;
      if (data.status === 'rejected') stats.rejectedRequests++;
    },
    getAll: () => Array.from(requests.values()),
    getBySession: (sessionId) => {
      return Array.from(requests.values()).filter(r => r.sessionId === sessionId);
    }
  },

  // 改造管理
  transforms: {
    get: (id) => transforms.get(id),
    set: (id, data) => {
      transforms.set(id, data);
      stats.totalTransforms++;
    },
    getAll: () => Array.from(transforms.values()),
    getBySession: (sessionId) => {
      return Array.from(transforms.values()).filter(t => t.sessionId === sessionId);
    }
  },

  // 快照管理
  snapshots: {
    get: (id) => snapshots.get(id),
    set: (id, data) => snapshots.set(id, data),
    delete: (id) => snapshots.delete(id),
    getAll: () => Array.from(snapshots.values()),
    getBySession: (sessionId) => {
      return Array.from(snapshots.values()).filter(s => s.sessionId === sessionId);
    }
  },

  // 会话历史管理
  history: {
    get: (sessionId) => sessionHistory.get(sessionId) || [],
    push: (sessionId, snapshotId) => {
      const history = sessionHistory.get(sessionId) || [];
      history.push(snapshotId);
      // 限制历史记录数量为5个
      if (history.length > 5) {
        const removed = history.shift();
        snapshots.delete(removed);
      }
      sessionHistory.set(sessionId, history);
    },
    pop: (sessionId) => {
      const history = sessionHistory.get(sessionId) || [];
      return history.pop();
    },
    clear: (sessionId) => sessionHistory.delete(sessionId)
  },

  // 审计日志
  audit: {
    add: (log) => {
      auditLogs.push({ ...log, id: generateId(), createdAt: Date.now() });
      // 限制日志数量，保留最近1000条
      if (auditLogs.length > 1000) {
        auditLogs.shift();
      }
    },
    getAll: () => auditLogs,
    getRecent: (limit = 100) => auditLogs.slice(-limit)
  },

  // 速率限制
  rateLimit: {
    get: (ip) => rateLimits.get(ip),
    set: (ip, data) => rateLimits.set(ip, data),
    delete: (ip) => rateLimits.delete(ip),
    getAll: () => Array.from(rateLimits.entries())
  },

  // 封禁管理
  banned: {
    get: (key) => bannedList.get(key),
    set: (key, data) => bannedList.set(key, data),
    delete: (key) => bannedList.delete(key),
    has: (key) => {
      const ban = bannedList.get(key);
      if (!ban) return false;
      // 检查是否过期
      if (ban.expiresAt && ban.expiresAt < Date.now()) {
        bannedList.delete(key);
        return false;
      }
      return true;
    },
    getAll: () => Array.from(bannedList.entries())
  },

  // 统计数据
  stats: {
    get: () => ({
      ...stats,
      uptime: Date.now() - stats.startTime,
      activeSessions: sessions.size,
      totalSnapshots: snapshots.size
    }),
    increment: (key) => {
      if (key in stats) stats[key]++;
    }
  },

  // 清理过期数据
  cleanup: () => {
    const now = Date.now();
    const TTL = 30 * 60 * 1000; // 30分钟

    // 清理过期会话
    for (const [id, session] of sessions.entries()) {
      if (session.ttlAt && session.ttlAt < now) {
        sessions.delete(id);
        sessionHistory.delete(id);
        // 清理相关快照
        const sessionSnapshots = Array.from(snapshots.entries())
          .filter(([_, s]) => s.sessionId === id);
        sessionSnapshots.forEach(([sid]) => snapshots.delete(sid));
      }
    }

    // 清理过期的速率限制记录
    for (const [ip, data] of rateLimits.entries()) {
      if (now - data.windowStart > 60000) { // 1分钟窗口
        rateLimits.delete(ip);
      }
    }

    // 清理过期的封禁
    for (const [key, ban] of bannedList.entries()) {
      if (ban.expiresAt && ban.expiresAt < now) {
        bannedList.delete(key);
      }
    }
  }
};

// 工具函数：生成唯一ID
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 定期清理过期数据（每5分钟）
setInterval(() => {
  store.cleanup();
}, 5 * 60 * 1000);

export { generateId };
