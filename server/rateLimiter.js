// 频率限制器 - 实现频控和封禁功能

class RateLimiter {
  constructor() {
    // IP频率计数（内存）
    // 格式: { ip: { count: number, resetTime: Date } }
    this.ipCounts = new Map();

    // 会话频率计数（内存）
    // 格式: { session_id: { count: number, resetTime: Date } }
    this.sessionCounts = new Map();

    // 封禁列表（内存）
    // 格式: { ip_or_session: { bannedUntil: Date, permanent: boolean } }
    this.bannedList = new Map();

    // 频率限制配置
    this.limits = {
      ip: {
        maxRequests: 10,    // 每分钟最多10次请求
        windowMs: 60 * 1000  // 1分钟窗口
      },
      session: {
        maxRequests: 6,      // 每分钟最多6次请求
        windowMs: 60 * 1000  // 1分钟窗口
      },
      banDuration: 60 * 60 * 1000  // 封禁60分钟
    };

    // 定期清理过期计数
    setInterval(() => {
      this.cleanupExpiredCounts();
      this.cleanupExpiredBans();
    }, 60 * 1000); // 每分钟清理一次
  }

  /**
   * 检查是否允许请求
   * @param {string} ip - 客户端IP
   * @param {string} sessionId - 会话ID
   * @returns {object} - {allowed: boolean, reason?: string}
   */
  check(ip, sessionId) {
    const now = Date.now();

    // 检查IP限制
    const ipResult = this.checkLimit(ip, this.ipCounts, this.limits.ip, now);
    if (!ipResult.allowed) {
      // 如果超过限制次数较多，自动封禁
      if (ipResult.exceedCount > 5) {
        this.ban(ip, false); // 临时封禁
      }
      return { allowed: false, reason: `IP频率限制：每分钟最多${this.limits.ip.maxRequests}次请求` };
    }

    // 检查会话限制
    const sessionResult = this.checkLimit(sessionId, this.sessionCounts, this.limits.session, now);
    if (!sessionResult.allowed) {
      if (sessionResult.exceedCount > 3) {
        this.ban(sessionId, false); // 临时封禁
      }
      return { allowed: false, reason: `会话频率限制：每分钟最多${this.limits.session.maxRequests}次请求` };
    }

    return { allowed: true };
  }

  /**
   * 检查单个维度的限制
   * @param {string} key - IP或会话ID
   * @param {Map} countsMap - 计数Map
   * @param {object} limit - 限制配置
   * @param {number} now - 当前时间戳
   * @returns {object} - {allowed: boolean, exceedCount?: number}
   */
  checkLimit(key, countsMap, limit, now) {
    let record = countsMap.get(key);

    // 如果记录不存在或已过期，创建新记录
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + limit.windowMs,
        exceedCount: 0
      };
      countsMap.set(key, record);
      return { allowed: true };
    }

    // 增加计数
    record.count++;

    // 检查是否超过限制
    if (record.count > limit.maxRequests) {
      record.exceedCount = (record.exceedCount || 0) + 1;
      return { allowed: false, exceedCount: record.exceedCount };
    }

    return { allowed: true };
  }

  /**
   * 检查是否被封禁
   * @param {string} ipOrSession - IP或会话ID
   * @returns {boolean}
   */
  isBanned(ipOrSession) {
    const ban = this.bannedList.get(ipOrSession);
    if (!ban) return false;

    // 永久封禁
    if (ban.permanent) return true;

    // 检查临时封禁是否过期
    if (Date.now() < ban.bannedUntil) {
      return true;
    }

    // 封禁已过期，移除记录
    this.bannedList.delete(ipOrSession);
    return false;
  }

  /**
   * 封禁IP或会话
   * @param {string} ipOrSession - IP或会话ID
   * @param {boolean} permanent - 是否永久封禁（默认false）
   */
  ban(ipOrSession, permanent = false) {
    if (permanent) {
      this.bannedList.set(ipOrSession, {
        permanent: true,
        bannedAt: new Date()
      });
      console.log(`永久封禁：${ipOrSession}`);
    } else {
      this.bannedList.set(ipOrSession, {
        permanent: false,
        bannedUntil: Date.now() + this.limits.banDuration,
        bannedAt: new Date()
      });
      console.log(`临时封禁：${ipOrSession}，持续 ${this.limits.banDuration / 60000} 分钟`);
    }
  }

  /**
   * 解封IP或会话
   * @param {string} ipOrSession - IP或会话ID
   */
  unban(ipOrSession) {
    const deleted = this.bannedList.delete(ipOrSession);
    if (deleted) {
      console.log(`解封：${ipOrSession}`);
    }
    return deleted;
  }

  /**
   * 清理过期的计数记录
   */
  cleanupExpiredCounts() {
    const now = Date.now();
    let cleaned = 0;

    // 清理IP计数
    for (const [key, record] of this.ipCounts.entries()) {
      if (now > record.resetTime + 60000) { // 过期1分钟后清理
        this.ipCounts.delete(key);
        cleaned++;
      }
    }

    // 清理会话计数
    for (const [key, record] of this.sessionCounts.entries()) {
      if (now > record.resetTime + 60000) {
        this.sessionCounts.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`清理了 ${cleaned} 个过期计数记录`);
    }
  }

  /**
   * 清理过期的封禁记录
   */
  cleanupExpiredBans() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, ban] of this.bannedList.entries()) {
      // 仅清理过期的临时封禁
      if (!ban.permanent && now > ban.bannedUntil) {
        this.bannedList.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`清理了 ${cleaned} 个过期封禁记录`);
    }
  }

  /**
   * 获取当前封禁数量
   * @returns {number}
   */
  getBannedCount() {
    return this.bannedList.size;
  }

  /**
   * 获取所有封禁列表
   * @returns {Array}
   */
  getBannedList() {
    const list = [];
    for (const [key, ban] of this.bannedList.entries()) {
      list.push({
        target: key,
        permanent: ban.permanent,
        bannedUntil: ban.bannedUntil ? new Date(ban.bannedUntil) : null,
        bannedAt: ban.bannedAt
      });
    }
    return list;
  }
}

export const rateLimiter = new RateLimiter();
