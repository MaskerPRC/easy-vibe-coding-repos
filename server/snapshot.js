// 快照和回滚系统

import { store, generateId } from './store.js';
import crypto from 'crypto';

/**
 * 创建快照
 */
export function createSnapshot(sessionId, dsl, metadata = {}) {
  const snapshotId = generateId();
  const now = Date.now();

  const snapshot = {
    id: snapshotId,
    sessionId,
    dsl: dsl || null,
    metadata: {
      ...metadata,
      timestamp: now
    },
    createdAt: now
  };

  store.snapshots.set(snapshotId, snapshot);
  store.history.push(sessionId, snapshotId);

  store.audit.add({
    level: 'info',
    event: 'snapshot_created',
    sessionId,
    data: { snapshotId }
  });

  return snapshot;
}

/**
 * 获取快照
 */
export function getSnapshot(snapshotId) {
  return store.snapshots.get(snapshotId);
}

/**
 * 获取会话的所有快照
 */
export function getSessionSnapshots(sessionId) {
  const history = store.history.get(sessionId);
  return history.map(id => store.snapshots.get(id)).filter(Boolean);
}

/**
 * 获取最新快照
 */
export function getLatestSnapshot(sessionId) {
  const history = store.history.get(sessionId);
  if (!history || history.length === 0) return null;

  const latestId = history[history.length - 1];
  return store.snapshots.get(latestId);
}

/**
 * 回滚到指定快照
 */
export function rollbackToSnapshot(sessionId, snapshotId) {
  const snapshot = store.snapshots.get(snapshotId);

  if (!snapshot) {
    throw new Error('快照不存在');
  }

  if (snapshot.sessionId !== sessionId) {
    throw new Error('快照不属于该会话');
  }

  store.audit.add({
    level: 'info',
    event: 'rollback',
    sessionId,
    data: { snapshotId }
  });

  return snapshot;
}

/**
 * 撤销最后N步
 */
export function undo(sessionId, steps = 1) {
  const history = store.history.get(sessionId);

  if (!history || history.length === 0) {
    throw new Error('没有可撤销的操作');
  }

  if (steps > history.length) {
    steps = history.length;
  }

  // 移除最后N个快照
  const removed = [];
  for (let i = 0; i < steps; i++) {
    const snapshotId = store.history.pop(sessionId);
    if (snapshotId) {
      removed.push(snapshotId);
      // 注意：我们不删除快照本身，以便日后审计
    }
  }

  // 获取回滚后的当前快照
  const currentSnapshot = getLatestSnapshot(sessionId);

  store.audit.add({
    level: 'info',
    event: 'undo',
    sessionId,
    data: { steps, removed }
  });

  return {
    removed,
    current: currentSnapshot
  };
}

/**
 * 恢复到初始状态
 */
export function resetToInitial(sessionId) {
  const history = store.history.get(sessionId);

  if (!history || history.length === 0) {
    throw new Error('没有历史记录');
  }

  const allSnapshots = [...history];
  store.history.clear(sessionId);

  store.audit.add({
    level: 'info',
    event: 'reset_to_initial',
    sessionId,
    data: { removed: allSnapshots.length }
  });

  return {
    removed: allSnapshots,
    current: null
  };
}

/**
 * 生成DSL哈希（用于预览验证）
 */
export function generateDSLHash(dsl) {
  const dslString = JSON.stringify(dsl);
  return crypto.createHash('sha256').update(dslString).digest('hex').substring(0, 16);
}

/**
 * 验证DSL哈希
 */
export function verifyDSLHash(dsl, hash) {
  const computedHash = generateDSLHash(dsl);
  return computedHash === hash;
}

/**
 * 获取会话状态
 */
export function getSessionState(sessionId) {
  const session = store.sessions.get(sessionId);
  if (!session) {
    return null;
  }

  const snapshots = getSessionSnapshots(sessionId);
  const latest = getLatestSnapshot(sessionId);

  const now = Date.now();
  const ttl = session.ttlAt - now;

  return {
    sessionId,
    createdAt: session.createdAt,
    ttl: Math.max(0, ttl),
    ttlMs: Math.max(0, ttl),
    snapshotCount: snapshots.length,
    currentSnapshot: latest ? latest.id : null,
    canUndo: snapshots.length > 0
  };
}

/**
 * 清理会话的所有快照
 */
export function cleanupSession(sessionId) {
  const snapshots = getSessionSnapshots(sessionId);

  for (const snapshot of snapshots) {
    store.snapshots.delete(snapshot.id);
  }

  store.history.clear(sessionId);

  store.audit.add({
    level: 'info',
    event: 'session_cleanup',
    sessionId,
    data: { removed: snapshots.length }
  });

  return snapshots.length;
}

/**
 * 计算差异补丁
 */
export function calculateDiff(oldDSL, newDSL) {
  // 简化版差异计算
  return {
    added: newDSL ? newDSL.changes : [],
    removed: oldDSL ? oldDSL.changes : [],
    timestamp: Date.now()
  };
}

export {
  generateId
};
