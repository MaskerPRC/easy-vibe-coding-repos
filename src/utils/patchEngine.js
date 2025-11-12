/**
 * DSL 补丁应用引擎
 * 安全地将 DSL 变更应用到 DOM
 */

// 存储原始状态（用于回滚）
const originalState = new Map();

/**
 * HTML 转义（防止 XSS）
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 应用 DSL 补丁
 */
export function applyDSLPatch(dsl) {
  if (!dsl || !dsl.changes || !Array.isArray(dsl.changes)) {
    throw new Error('无效的 DSL 格式');
  }

  const results = [];

  for (const change of dsl.changes) {
    try {
      const result = applyChange(change);
      results.push({
        success: true,
        change,
        result
      });
    } catch (error) {
      console.error('应用变更失败:', change, error);
      results.push({
        success: false,
        change,
        error: error.message
      });
    }
  }

  return {
    success: results.every(r => r.success),
    results
  };
}

/**
 * 应用单个变更
 */
function applyChange(change) {
  switch (change.op) {
    case 'set_text':
      return setTextContent(change.selector, change.text);
    case 'set_style_var':
      return setStyleVariable(change.selector, change.var, change.value);
    case 'toggle':
      return toggleElement(change.selector, change.enabled);
    case 'reorder':
      return reorderElements(change.selector, change.order);
    case 'set_prop':
      return setProperty(change.selector, change.prop, change.value);
    default:
      throw new Error(`不支持的操作: ${change.op}`);
  }
}

/**
 * 设置文本内容
 */
function setTextContent(selector, text) {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`找不到元素: ${selector}`);
  }

  // 保存原始值
  if (!originalState.has(selector + ':text')) {
    originalState.set(selector + ':text', element.textContent);
  }

  // 转义文本（防止 XSS）
  const escapedText = escapeHtml(text);
  element.textContent = text; // 使用 textContent 是安全的

  return {
    selector,
    oldValue: originalState.get(selector + ':text'),
    newValue: text
  };
}

/**
 * 设置 CSS 变量
 */
function setStyleVariable(selector, varName, value) {
  let element;

  if (selector === ':root') {
    element = document.documentElement;
  } else if (selector === 'body') {
    element = document.body;
  } else {
    element = document.querySelector(selector);
  }

  if (!element) {
    throw new Error(`找不到元素: ${selector}`);
  }

  const key = `${selector}:${varName}`;

  // 保存原始值
  if (!originalState.has(key)) {
    const computedStyle = getComputedStyle(element);
    originalState.set(key, computedStyle.getPropertyValue(varName));
  }

  // 设置样式变量
  element.style.setProperty(varName, value);

  return {
    selector,
    varName,
    oldValue: originalState.get(key),
    newValue: value
  };
}

/**
 * 显示/隐藏元素
 */
function toggleElement(selector, enabled) {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`找不到元素: ${selector}`);
  }

  const key = `${selector}:display`;

  // 保存原始值
  if (!originalState.has(key)) {
    originalState.set(key, element.style.display || '');
  }

  // 设置显示状态
  element.style.display = enabled ? (originalState.get(key) || '') : 'none';

  return {
    selector,
    enabled,
    oldValue: originalState.get(key)
  };
}

/**
 * 重新排序子元素
 */
function reorderElements(selector, order) {
  const container = document.querySelector(selector);
  if (!container) {
    throw new Error(`找不到容器: ${selector}`);
  }

  const children = Array.from(container.children);
  const key = `${selector}:order`;

  // 保存原始顺序
  if (!originalState.has(key)) {
    originalState.set(key, children.map((_, i) => i));
  }

  // 验证顺序数组
  if (order.length !== children.length) {
    throw new Error('排序数组长度与子元素数量不匹配');
  }

  // 重新排序
  const fragment = document.createDocumentFragment();
  for (const index of order) {
    if (index < 0 || index >= children.length) {
      throw new Error(`无效的索引: ${index}`);
    }
    fragment.appendChild(children[index]);
  }

  container.appendChild(fragment);

  return {
    selector,
    oldOrder: originalState.get(key),
    newOrder: order
  };
}

/**
 * 设置组件属性
 */
function setProperty(selector, prop, value) {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`找不到元素: ${selector}`);
  }

  const key = `${selector}:${prop}`;

  // 保存原始值
  if (!originalState.has(key)) {
    originalState.set(key, element.getAttribute(`data-${prop}`) || '');
  }

  // 设置属性（使用 data-* 属性）
  element.setAttribute(`data-${prop}`, String(value));

  // 触发自定义事件（让组件知道属性已更改）
  element.dispatchEvent(new CustomEvent('prop-changed', {
    detail: { prop, value }
  }));

  return {
    selector,
    prop,
    oldValue: originalState.get(key),
    newValue: value
  };
}

/**
 * 重置到初始状态
 */
export function resetToInitial() {
  const results = [];

  for (const [key, originalValue] of originalState.entries()) {
    try {
      const [selector, type] = key.split(':');

      if (type === 'text') {
        const element = document.querySelector(selector);
        if (element) {
          element.textContent = originalValue;
        }
      } else if (type === 'display') {
        const element = document.querySelector(selector);
        if (element) {
          element.style.display = originalValue;
        }
      } else if (type === 'order') {
        const container = document.querySelector(selector);
        if (container) {
          const children = Array.from(container.children);
          const fragment = document.createDocumentFragment();
          for (const index of originalValue) {
            fragment.appendChild(children[index]);
          }
          container.appendChild(fragment);
        }
      } else if (type.startsWith('--')) {
        // CSS 变量
        let element;
        if (selector === ':root') {
          element = document.documentElement;
        } else if (selector === 'body') {
          element = document.body;
        } else {
          element = document.querySelector(selector);
        }
        if (element) {
          element.style.setProperty(type, originalValue);
        }
      } else {
        // 属性
        const element = document.querySelector(selector);
        if (element) {
          if (originalValue) {
            element.setAttribute(`data-${type}`, originalValue);
          } else {
            element.removeAttribute(`data-${type}`);
          }
        }
      }

      results.push({ success: true, key });
    } catch (error) {
      console.error('重置失败:', key, error);
      results.push({ success: false, key, error: error.message });
    }
  }

  // 清空原始状态
  originalState.clear();

  return {
    success: results.every(r => r.success),
    results
  };
}

/**
 * 撤销上一次应用
 */
export function undoDSLPatch(dsl) {
  if (!dsl || !dsl.changes || !Array.isArray(dsl.changes)) {
    // 如果没有 DSL，重置到初始状态
    return resetToInitial();
  }

  // 反向应用变更
  const results = [];

  for (const change of dsl.changes.slice().reverse()) {
    try {
      const key = getStateKey(change);
      const originalValue = originalState.get(key);

      if (originalValue !== undefined) {
        const result = restoreChange(change, originalValue);
        results.push({
          success: true,
          change,
          result
        });
      }
    } catch (error) {
      console.error('撤销变更失败:', change, error);
      results.push({
        success: false,
        change,
        error: error.message
      });
    }
  }

  return {
    success: results.every(r => r.success),
    results
  };
}

/**
 * 获取状态键
 */
function getStateKey(change) {
  switch (change.op) {
    case 'set_text':
      return `${change.selector}:text`;
    case 'set_style_var':
      return `${change.selector}:${change.var}`;
    case 'toggle':
      return `${change.selector}:display`;
    case 'reorder':
      return `${change.selector}:order`;
    case 'set_prop':
      return `${change.selector}:${change.prop}`;
    default:
      return '';
  }
}

/**
 * 恢复变更
 */
function restoreChange(change, originalValue) {
  switch (change.op) {
    case 'set_text':
      return setTextContent(change.selector, originalValue);
    case 'set_style_var':
      return setStyleVariable(change.selector, change.var, originalValue);
    case 'toggle':
      return toggleElement(change.selector, originalValue !== 'none');
    case 'reorder':
      return reorderElements(change.selector, originalValue);
    case 'set_prop':
      return setProperty(change.selector, change.prop, originalValue);
    default:
      throw new Error(`不支持的操作: ${change.op}`);
  }
}

/**
 * 获取当前状态摘要
 */
export function getStateSummary() {
  return {
    modifiedCount: originalState.size,
    keys: Array.from(originalState.keys())
  };
}
