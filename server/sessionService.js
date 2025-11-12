/**
 * 会话管理服务 - 内存存储
 * 管理用户会话、快照和改造历史
 */

// ==================== 内存存储 ====================

// 会话存储（内存中）
const sessions = new Map();

// 快照存储（内存中）
const snapshots = new Map();

// 会话清理间隔（毫秒）
const CLEANUP_INTERVAL = 60000; // 1分钟
const SESSION_TTL = 30 * 60 * 1000; // 30分钟

// ==================== 会话管理 ====================

/**
 * 生成会话 ID
 */
function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * 创建新会话
 */
function createSession(ipHash, userAgent) {
  const sessionId = generateSessionId();
  const now = Date.now();

  const session = {
    id: sessionId,
    ipHash,
    userAgent,
    createdAt: now,
    expiresAt: now + SESSION_TTL,
    requestCount: 0,
    snapshots: [],
    currentSnapshotIndex: -1
  };

  sessions.set(sessionId, session);

  return session;
}

/**
 * 获取会话
 */
function getSession(sessionId) {
  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  // 检查是否过期
  if (Date.now() > session.expiresAt) {
    // 清理过期会话
    sessions.delete(sessionId);
    // 清理相关快照
    session.snapshots.forEach(snapshotId => {
      snapshots.delete(snapshotId);
    });
    return null;
  }

  return session;
}

/**
 * 更新会话过期时间
 */
function renewSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) {
    session.expiresAt = Date.now() + SESSION_TTL;
    return true;
  }
  return false;
}

/**
 * 删除会话
 */
function deleteSession(sessionId) {
  const session = sessions.get(sessionId);
  if (session) {
    // 清理相关快照
    session.snapshots.forEach(snapshotId => {
      snapshots.delete(snapshotId);
    });
    sessions.delete(sessionId);
    return true;
  }
  return false;
}

/**
 * 增加会话请求计数
 */
function incrementRequestCount(sessionId) {
  const session = sessions.get(sessionId);
  if (session) {
    session.requestCount++;
    return session.requestCount;
  }
  return 0;
}

// ==================== 快照管理 ====================

/**
 * 生成快照 ID
 */
function generateSnapshotId() {
  return `snap_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * 创建快照
 */
function createSnapshot(sessionId, dsl, description = '') {
  const session = getSession(sessionId);
  if (!session) {
    throw new Error('会话不存在或已过期');
  }

  const snapshotId = generateSnapshotId();
  const now = Date.now();

  const snapshot = {
    id: snapshotId,
    sessionId,
    dsl,
    description,
    createdAt: now,
    appliedAt: null
  };

  snapshots.set(snapshotId, snapshot);

  // 添加到会话的快照列表
  session.snapshots.push(snapshotId);
  session.currentSnapshotIndex = session.snapshots.length - 1;

  return snapshot;
}

/**
 * 获取快照
 */
function getSnapshot(snapshotId) {
  return snapshots.get(snapshotId) || null;
}

/**
 * 应用快照
 */
function applySnapshot(snapshotId) {
  const snapshot = snapshots.get(snapshotId);
  if (snapshot) {
    snapshot.appliedAt = Date.now();
    return snapshot;
  }
  return null;
}

/**
 * 获取会话的所有快照
 */
function getSessionSnapshots(sessionId) {
  const session = getSession(sessionId);
  if (!session) {
    return [];
  }

  return session.snapshots
    .map(id => snapshots.get(id))
    .filter(s => s !== undefined);
}

/**
 * 撤销到上一个快照
 */
function undoSnapshot(sessionId, steps = 1) {
  const session = getSession(sessionId);
  if (!session) {
    throw new Error('会话不存在或已过期');
  }

  if (session.currentSnapshotIndex < 0) {
    throw new Error('没有可撤销的快照');
  }

  const newIndex = Math.max(-1, session.currentSnapshotIndex - steps);
  session.currentSnapshotIndex = newIndex;

  if (newIndex === -1) {
    return null; // 返回到初始状态
  }

  const snapshotId = session.snapshots[newIndex];
  return snapshots.get(snapshotId);
}

/**
 * 获取当前快照
 */
function getCurrentSnapshot(sessionId) {
  const session = getSession(sessionId);
  if (!session) {
    return null;
  }

  if (session.currentSnapshotIndex < 0) {
    return null;
  }

  const snapshotId = session.snapshots[session.currentSnapshotIndex];
  return snapshots.get(snapshotId);
}

// ==================== 清理任务 ====================

/**
 * 清理过期会话
 */
function cleanupExpiredSessions() {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      // 清理快照
      session.snapshots.forEach(snapshotId => {
        snapshots.delete(snapshotId);
      });
      sessions.delete(sessionId);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`[会话清理] 清理了 ${cleanedCount} 个过期会话`);
  }

  return cleanedCount;
}

// 启动定期清理
setInterval(cleanupExpiredSessions, CLEANUP_INTERVAL);

// ==================== 统计信息 ====================

/**
 * 获取会话统计
 */
function getStats() {
  return {
    totalSessions: sessions.size,
    totalSnapshots: snapshots.size,
    activeSessions: Array.from(sessions.values()).filter(s => Date.now() <= s.expiresAt).length
  };
}

/**
 * 获取所有会话（用于管理端）
 */
function getAllSessions() {
  return Array.from(sessions.values()).map(session => ({
    id: session.id,
    ipHash: session.ipHash.substring(0, 8) + '***', // 部分脱敏
    createdAt: new Date(session.createdAt).toISOString(),
    expiresAt: new Date(session.expiresAt).toISOString(),
    requestCount: session.requestCount,
    snapshotCount: session.snapshots.length,
    isExpired: Date.now() > session.expiresAt
  }));
}

// ==================== 导出 ====================

export {
  createSession,
  getSession,
  renewSession,
  deleteSession,
  incrementRequestCount,
  createSnapshot,
  getSnapshot,
  applySnapshot,
  getSessionSnapshots,
  undoSnapshot,
  getCurrentSnapshot,
  cleanupExpiredSessions,
  getStats,
  getAllSessions
};
