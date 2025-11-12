// DSL执行引擎 - 前端安全执行器

/**
 * 安全地执行DSL补丁，只允许白名单内的操作
 */
export class DSLExecutor {
  constructor() {
    this.appliedChanges = [];
    this.originalStates = new Map();
  }

  /**
   * 执行DSL
   */
  execute(dsl) {
    if (!dsl || !Array.isArray(dsl.changes)) {
      throw new Error('无效的DSL格式');
    }

    const results = [];

    for (const change of dsl.changes) {
      try {
        const result = this.executeChange(change);
        results.push({ success: true, change, result });
      } catch (error) {
        results.push({ success: false, change, error: error.message });
        console.error('执行变更失败:', change, error);
      }
    }

    return results;
  }

  /**
   * 执行单个变更
   */
  executeChange(change) {
    switch (change.op) {
      case 'set_text':
        return this.setText(change);

      case 'set_style_var':
        return this.setStyleVar(change);

      case 'toggle':
        return this.toggle(change);

      case 'reorder':
        return this.reorder(change);

      case 'set_prop':
        return this.setProp(change);

      default:
        throw new Error(`不支持的操作: ${change.op}`);
    }
  }

  /**
   * 设置文本内容
   */
  setText(change) {
    const element = document.querySelector(change.selector);
    if (!element) {
      throw new Error(`未找到元素: ${change.selector}`);
    }

    // 保存原始状态
    if (!this.originalStates.has(change.selector)) {
      this.originalStates.set(change.selector, {
        textContent: element.textContent,
        type: 'text'
      });
    }

    // HTML转义，防止XSS
    const safeText = this.escapeHTML(change.text);
    element.textContent = safeText;

    this.appliedChanges.push(change);
    return { selector: change.selector, newText: safeText };
  }

  /**
   * 设置CSS变量
   */
  setStyleVar(change) {
    const target = change.selector === ':root'
      ? document.documentElement
      : document.querySelector(change.selector);

    if (!target) {
      throw new Error(`未找到元素: ${change.selector}`);
    }

    // 保存原始状态
    const key = `${change.selector}:${change.var}`;
    if (!this.originalStates.has(key)) {
      const currentValue = getComputedStyle(target).getPropertyValue(change.var);
      this.originalStates.set(key, {
        value: currentValue,
        type: 'style_var'
      });
    }

    // 验证CSS变量值
    const safeValue = this.sanitizeCSSValue(change.value);
    target.style.setProperty(change.var, safeValue);

    this.appliedChanges.push(change);
    return { selector: change.selector, var: change.var, value: safeValue };
  }

  /**
   * 切换显示/隐藏
   */
  toggle(change) {
    const element = document.querySelector(change.selector);
    if (!element) {
      throw new Error(`未找到元素: ${change.selector}`);
    }

    // 保存原始状态
    if (!this.originalStates.has(change.selector)) {
      this.originalStates.set(change.selector, {
        display: element.style.display,
        type: 'toggle'
      });
    }

    element.style.display = change.enabled ? '' : 'none';

    this.appliedChanges.push(change);
    return { selector: change.selector, enabled: change.enabled };
  }

  /**
   * 重新排序子元素
   */
  reorder(change) {
    const container = document.querySelector(change.selector);
    if (!container) {
      throw new Error(`未找到容器: ${change.selector}`);
    }

    const children = Array.from(container.children);

    // 保存原始状态
    if (!this.originalStates.has(change.selector)) {
      this.originalStates.set(change.selector, {
        order: children.map(c => c.cloneNode(true)),
        type: 'reorder'
      });
    }

    // 验证顺序数组
    if (change.order.length !== children.length) {
      throw new Error('排序数组长度不匹配');
    }

    // 重新排序
    const fragment = document.createDocumentFragment();
    change.order.forEach(index => {
      if (index >= 0 && index < children.length) {
        fragment.appendChild(children[index]);
      }
    });

    container.innerHTML = '';
    container.appendChild(fragment);

    this.appliedChanges.push(change);
    return { selector: change.selector, newOrder: change.order };
  }

  /**
   * 设置组件属性
   */
  setProp(change) {
    const element = document.querySelector(change.selector);
    if (!element) {
      throw new Error(`未找到元素: ${change.selector}`);
    }

    const key = `${change.selector}:${change.prop}`;

    // 保存原始状态
    if (!this.originalStates.has(key)) {
      this.originalStates.set(key, {
        value: element.getAttribute(`data-${change.prop}`),
        type: 'prop'
      });
    }

    // 设置data属性
    element.setAttribute(`data-${change.prop}`, change.value);

    this.appliedChanges.push(change);
    return { selector: change.selector, prop: change.prop, value: change.value };
  }

  /**
   * 恢复原始状态
   */
  restore() {
    for (const [key, state] of this.originalStates.entries()) {
      try {
        if (state.type === 'text') {
          const element = document.querySelector(key);
          if (element) {
            element.textContent = state.textContent;
          }
        } else if (state.type === 'style_var') {
          const [selector, varName] = key.split(':');
          const target = selector === ':root'
            ? document.documentElement
            : document.querySelector(selector);
          if (target) {
            target.style.setProperty(varName, state.value);
          }
        } else if (state.type === 'toggle') {
          const element = document.querySelector(key);
          if (element) {
            element.style.display = state.display;
          }
        } else if (state.type === 'reorder') {
          const container = document.querySelector(key);
          if (container) {
            container.innerHTML = '';
            state.order.forEach(child => {
              container.appendChild(child);
            });
          }
        } else if (state.type === 'prop') {
          const [selector, prop] = key.split(':');
          const element = document.querySelector(selector);
          if (element) {
            if (state.value) {
              element.setAttribute(`data-${prop}`, state.value);
            } else {
              element.removeAttribute(`data-${prop}`);
            }
          }
        }
      } catch (error) {
        console.error('恢复状态失败:', key, error);
      }
    }

    this.originalStates.clear();
    this.appliedChanges = [];
  }

  /**
   * HTML转义，防止XSS
   */
  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.textContent;
  }

  /**
   * 清理CSS值，只允许安全的值
   */
  sanitizeCSSValue(value) {
    // 只允许颜色、数字和长度单位
    const safePattern = /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|[0-9.]+(?:px|em|rem|%)?|[a-z-]+)$/;

    if (!safePattern.test(value)) {
      throw new Error('不安全的CSS值');
    }

    return value;
  }

  /**
   * 清除所有应用的变更
   */
  clear() {
    this.restore();
  }

  /**
   * 获取已应用的变更列表
   */
  getAppliedChanges() {
    return [...this.appliedChanges];
  }
}

export default DSLExecutor;
