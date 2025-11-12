// 前端变换执行器 - 安全地执行DSL变更并管理会话

class TransformExecutor {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.snapshot = null;
    this.ttl = 15 * 60 * 1000; // 15分钟
    this.checkInterval = null;
    this.eventHandlers = {};
  }

  /**
   * 初始化执行器
   */
  init(options = {}) {
    // 恢复之前的变更（如果存在且未过期）
    this.restoreFromLocalStorage();

    // 启动TTL检查
    this.startTTLCheck();

    // 保存回调
    if (options.onRestore) {
      this.on('restore', options.onRestore);
    }
  }

  /**
   * 获取或创建会话ID
   */
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('mvp_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('mvp_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * 执行变更
   * @param {Array} changes - DSL changes数组
   * @returns {object} - {success: boolean, error?: string}
   */
  execute(changes) {
    if (!Array.isArray(changes)) {
      return { success: false, error: '变更格式无效' };
    }

    try {
      // 保存快照（用于撤销）
      this.saveSnapshot(changes);

      // 逐项执行变更
      for (const change of changes) {
        this.executeChange(change);
      }

      // 保存到localStorage
      this.saveToLocalStorage(changes);

      return { success: true };
    } catch (error) {
      console.error('执行变更失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 执行单个变更
   * @param {object} change - 单个变更项
   */
  executeChange(change) {
    switch (change.op) {
      case 'set_text':
        this.setTextContent(change.selector, change.text);
        break;

      case 'set_style_var':
        this.setStyleVariable(change.selector, change.var, change.value);
        break;

      case 'toggle':
        this.toggleElement(change.selector, change.enabled);
        break;

      default:
        console.warn('未知操作类型:', change.op);
    }
  }

  /**
   * 设置文本内容（安全方式）
   * @param {string} selector - CSS选择器
   * @param {string} text - 文本内容
   */
  setTextContent(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
      // 使用textContent而不是innerHTML，防止XSS
      element.textContent = this.escapeHtml(text);
    } else {
      console.warn('元素不存在:', selector);
    }
  }

  /**
   * 设置CSS变量
   * @param {string} selector - CSS选择器
   * @param {string} varName - CSS变量名
   * @param {string} value - 变量值
   */
  setStyleVariable(selector, varName, value) {
    // 映射颜色值到实际颜色
    const colorMap = {
      blue: '#4a90e2',
      green: '#10b981',
      amber: '#eab308'
    };

    const actualColor = colorMap[value] || value;

    // 设置body的data-theme属性（用于主题切换）
    document.body.setAttribute('data-theme', value);

    // 设置CSS变量
    if (selector === ':root' || selector === 'body') {
      document.body.style.setProperty(varName, actualColor);
    }
  }

  /**
   * 切换元素显示/隐藏
   * @param {string} selector - CSS选择器
   * @param {boolean} enabled - 是否显示
   */
  toggleElement(selector, enabled) {
    const element = document.querySelector(selector);
    if (element) {
      if (enabled) {
        element.classList.remove('is-hidden');
        element.removeAttribute('hidden');
      } else {
        element.classList.add('is-hidden');
      }
    } else {
      console.warn('元素不存在:', selector);
    }
  }

  /**
   * HTML实体转义（防止XSS）
   * @param {string} text - 原始文本
   * @returns {string} - 转义后的文本
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 保存快照（用于撤销）
   * @param {Array} changes - 变更数组
   */
  saveSnapshot(changes) {
    this.snapshot = {
      changes: changes,
      timestamp: Date.now()
    };
  }

  /**
   * 撤销变更
   */
  undo() {
    if (!this.snapshot) {
      console.warn('没有可撤销的变更');
      return;
    }

    // 撤销所有变更（恢复初始状态）
    for (const change of this.snapshot.changes) {
      this.undoChange(change);
    }

    // 清除快照
    this.snapshot = null;

    // 清除localStorage
    this.clearLocalStorage();

    console.log('已撤销变更');
  }

  /**
   * 撤销单个变更
   * @param {object} change - 单个变更项
   */
  undoChange(change) {
    switch (change.op) {
      case 'set_text':
        // 恢复到原始文本（需要从DOM获取初始值）
        // 这里简化处理，通过刷新页面或重新设置
        break;

      case 'set_style_var':
        // 恢复默认主题色
        document.body.removeAttribute('data-theme');
        document.body.style.removeProperty(change.var);
        break;

      case 'toggle':
        // 恢复显示
        const element = document.querySelector(change.selector);
        if (element) {
          element.classList.remove('is-hidden');
          element.removeAttribute('hidden');
        }
        break;
    }
  }

  /**
   * 保存到localStorage
   * @param {Array} changes - 变更数组
   */
  saveToLocalStorage(changes) {
    const data = {
      sessionId: this.sessionId,
      changes: changes,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.ttl
    };
    localStorage.setItem('mvp_transform', JSON.stringify(data));
  }

  /**
   * 从localStorage恢复
   */
  restoreFromLocalStorage() {
    try {
      const stored = localStorage.getItem('mvp_transform');
      if (!stored) return;

      const data = JSON.parse(stored);

      // 检查是否过期
      if (Date.now() > data.expiresAt) {
        console.log('变更已过期，恢复初始状态');
        this.clearLocalStorage();
        this.emit('restore');
        return;
      }

      // 恢复变更
      this.execute(data.changes);
      console.log('已恢复之前的变更');
    } catch (error) {
      console.error('恢复失败:', error);
      this.clearLocalStorage();
    }
  }

  /**
   * 清除localStorage
   */
  clearLocalStorage() {
    localStorage.removeItem('mvp_transform');
  }

  /**
   * 启动TTL检查
   */
  startTTLCheck() {
    // 每分钟检查一次
    this.checkInterval = setInterval(() => {
      this.checkExpiration();
    }, 60 * 1000);

    // 页面可见性变化时也检查
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkExpiration();
      }
    });
  }

  /**
   * 检查是否过期
   */
  checkExpiration() {
    try {
      const stored = localStorage.getItem('mvp_transform');
      if (!stored) return;

      const data = JSON.parse(stored);

      if (Date.now() > data.expiresAt) {
        console.log('变更已过期，恢复初始状态');
        this.undo();
        this.clearLocalStorage();
        this.emit('restore');

        // 刷新页面以完全恢复
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('检查过期失败:', error);
    }
  }

  /**
   * 检查是否有激活的变换
   */
  hasActiveTransform() {
    try {
      const stored = localStorage.getItem('mvp_transform');
      if (!stored) return false;

      const data = JSON.parse(stored);
      return Date.now() <= data.expiresAt;
    } catch (error) {
      return false;
    }
  }

  /**
   * 事件处理
   */
  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  off(event, handler) {
    if (!this.eventHandlers[event]) return;
    if (handler) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
    } else {
      delete this.eventHandlers[event];
    }
  }

  emit(event, data) {
    if (!this.eventHandlers[event]) return;
    for (const handler of this.eventHandlers[event]) {
      handler(data);
    }
  }

  /**
   * 获取会话ID
   */
  getSessionId() {
    return this.sessionId;
  }
}

export const transformExecutor = new TransformExecutor();
