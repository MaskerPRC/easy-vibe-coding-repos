// 审计日志 - 记录所有操作和安全事件

class AuditLogger {
  constructor() {
    // 审计日志存储（内存）
    // 格式: Array of log entries
    this.logs = [];

    // 最大日志条数（保留最近的记录）
    this.maxLogs = 10000;

    // 日志保留时间（7天）
    this.retentionMs = 7 * 24 * 60 * 60 * 1000;

    // 定期清理过期日志
    setInterval(() => {
      this.cleanupExpiredLogs();
    }, 60 * 60 * 1000); // 每小时清理一次
  }

  /**
   * 记录日志
   * @param {object} entry - 日志条目
   */
  log(entry) {
    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...this.sanitizeEntry(entry)
    };

    this.logs.push(logEntry);

    // 如果超过最大条数，删除最旧的记录
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 输出到控制台（仅在开发环境）
    if (process.env.NODE_ENV !== 'production') {
      console.log('[AUDIT]', JSON.stringify(logEntry));
    }
  }

  /**
   * 脱敏日志条目
   * @param {object} entry - 原始日志条目
   * @returns {object} - 脱敏后的日志条目
   */
  sanitizeEntry(entry) {
    const sanitized = { ...entry };

    // 脱敏IP地址（保留前3段）
    if (sanitized.ip) {
      const parts = sanitized.ip.split('.');
      if (parts.length === 4) {
        sanitized.ip = `${parts[0]}.${parts[1]}.${parts[2]}.***`;
      }
    }

    // 脱敏会话ID（只保留前8位）
    if (sanitized.session_id && sanitized.session_id.length > 8) {
      sanitized.session_id = sanitized.session_id.substring(0, 8) + '***';
    }

    // 脱敏用户输入（如果包含敏感信息）
    if (sanitized.input) {
      sanitized.input = this.sanitizeText(sanitized.input);
    }

    // 如果DSL中包含文本，也进行脱敏
    if (sanitized.dsl && sanitized.dsl.changes) {
      sanitized.dsl = { ...sanitized.dsl };
      sanitized.dsl.changes = sanitized.dsl.changes.map(change => {
        if (change.text) {
          return { ...change, text: this.sanitizeText(change.text) };
        }
        return change;
      });
    }

    return sanitized;
  }

  /**
   * 脱敏文本中的敏感信息
   * @param {string} text - 原始文本
   * @returns {string} - 脱敏后的文本
   */
  sanitizeText(text) {
    if (!text || typeof text !== 'string') return text;

    let sanitized = text;

    // 脱敏手机号
    sanitized = sanitized.replace(/1[3-9]\d{9}/g, '1********');

    // 脱敏邮箱
    sanitized = sanitized.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, user, domain) => {
      const maskedUser = user.length > 3 ? user.substring(0, 3) + '***' : '***';
      return `${maskedUser}@${domain}`;
    });

    // 脱敏身份证号
    sanitized = sanitized.replace(/\d{17}[\dXx]/g, '******************');

    // 脱敏长字符串（可能是密钥）
    sanitized = sanitized.replace(/[A-Za-z0-9]{32,}/g, '***KEY***');

    return sanitized;
  }

  /**
   * 获取日志列表
   * @param {number} limit - 返回的最大条数
   * @param {object} filters - 过滤条件
   * @returns {Array} - 日志数组
   */
  getLogs(limit = 200, filters = {}) {
    let filteredLogs = [...this.logs];

    // 应用过滤条件
    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }

    if (filters.status) {
      filteredLogs = filteredLogs.filter(log => log.status === filters.status);
    }

    if (filters.session_id) {
      filteredLogs = filteredLogs.filter(log =>
        log.session_id && log.session_id.startsWith(filters.session_id.substring(0, 8))
      );
    }

    // 按时间倒序排序（最新的在前）
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // 限制返回数量
    return filteredLogs.slice(0, limit);
  }

  /**
   * 获取统计信息
   * @returns {object} - 统计数据
   */
  getStats() {
    const stats = {
      total: this.logs.length,
      byAction: {},
      byStatus: {},
      recentErrors: 0,
      recentRejections: 0
    };

    // 最近1小时的日志
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    for (const log of this.logs) {
      // 按action统计
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

      // 按status统计
      stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;

      // 最近错误和拒绝统计
      const logTime = new Date(log.timestamp).getTime();
      if (logTime > oneHourAgo) {
        if (log.status === 'error') stats.recentErrors++;
        if (log.status === 'rejected' || log.status === 'policy_rejected') {
          stats.recentRejections++;
        }
      }
    }

    return stats;
  }

  /**
   * 清理过期日志（超过保留时间）
   */
  cleanupExpiredLogs() {
    const now = Date.now();
    const cutoffTime = now - this.retentionMs;

    const originalLength = this.logs.length;
    this.logs = this.logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime > cutoffTime;
    });

    const cleaned = originalLength - this.logs.length;
    if (cleaned > 0) {
      console.log(`清理了 ${cleaned} 条过期日志`);
    }
  }

  /**
   * 清空所有日志（仅供测试使用）
   */
  clear() {
    this.logs = [];
  }
}

export const auditLogger = new AuditLogger();
