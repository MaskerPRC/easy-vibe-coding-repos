// 会话管理器 - 使用内存存储管理会话和快照

class SessionManager {
  constructor() {
    // 会话快照存储（内存）
    // 格式: { session_id: { snapshot: dsl, timestamp: Date, snapshot_id: string } }
    this.sessions = new Map();

    // 定期清理过期会话（24小时）
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 60 * 60 * 1000); // 每小时清理一次
  }

  /**
   * 保存快照到会话
   * @param {string} sessionId - 会话ID
   * @param {object} dsl - DSL对象
   * @returns {string} - 快照ID
   */
  saveSnapshot(sessionId, dsl) {
    const snapshotId = `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.sessions.set(sessionId, {
      snapshot: dsl,
      timestamp: new Date(),
      snapshot_id: snapshotId
    });

    return snapshotId;
  }

  /**
   * 获取会话快照
   * @param {string} sessionId - 会话ID
   * @returns {object|null} - 快照对象或null
   */
  getSnapshot(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * 清除会话快照（撤销操作）
   * @param {string} sessionId - 会话ID
   * @returns {boolean} - 是否成功清除
   */
  clearSnapshot(sessionId) {
    return this.sessions.delete(sessionId);
  }

  /**
   * 清理过期会话（超过24小时的会话）
   */
  cleanupExpiredSessions() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24小时

    let cleaned = 0;
    for (const [sessionId, data] of this.sessions.entries()) {
      if (now - data.timestamp.getTime() > maxAge) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`清理了 ${cleaned} 个过期会话`);
    }
  }

  /**
   * 获取当前会话数量
   * @returns {number}
   */
  getSessionCount() {
    return this.sessions.size;
  }
}

export const sessionManager = new SessionManager();
