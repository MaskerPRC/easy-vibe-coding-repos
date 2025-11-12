/**
 * 站点转换服务 - 安全 DSL 生成与验证
 * 实现自然语言到安全声明式转换的核心逻辑
 */

// ==================== 选择器白名单 ====================

// 允许的选择器（仅命名锚点）
const SELECTOR_WHITELIST = [
  '#hero-title',
  '#hero-subtitle',
  '#hero-description',
  '.feature-list',
  '.promo-banner',
  '#carousel',
  '.card-container',
  '.stats-section',
  '#footer-text',
  '.nav-menu',
  '#page-title',
  '.content-section',
  'body',
  ':root'
];

// 允许的 CSS 变量
const STYLE_VAR_WHITELIST = [
  '--color-primary',
  '--color-secondary',
  '--color-background',
  '--color-text',
  '--font-size-base',
  '--spacing-unit',
  '--border-radius'
];

// 允许的组件属性
const COMPONENT_PROPS_SCHEMA = {
  'carousel.interval': { type: 'number', min: 2, max: 10 },
  'card.variant': { type: 'enum', values: ['default', 'bordered', 'shadow', 'plain'] },
  'badge.tone': { type: 'enum', values: ['success', 'warning', 'danger', 'info'] },
  'section.collapsible': { type: 'boolean' }
};

// ==================== 危险词汇黑名单 ====================

const DANGEROUS_KEYWORDS = [
  // 系统命令
  'rm', 'delete', 'format', 'shutdown', 'reboot', 'kill', 'exec', 'eval',
  // 脚本注入
  '<script', 'javascript:', 'onerror', 'onload', 'onclick',
  // 网络相关
  'fetch(', 'XMLHttpRequest', 'ajax', 'import(',
  // 危险操作
  'innerHTML', 'outerHTML', 'document.write', '__proto__',
  // SQL 注入
  'DROP TABLE', 'DELETE FROM', 'UPDATE SET', 'INSERT INTO',
  // 系统路径
  '/etc/passwd', '/etc/shadow', 'C:\\Windows',
  // 敏感词汇（示例，实际应更完善）
  '暴力', '色情', '赌博'
];

// 提示注入关键词
const PROMPT_INJECTION_KEYWORDS = [
  'ignore previous', 'forget instructions', 'new instructions',
  '忽略之前', '忘记指令', '新指令', '系统提示',
  'system prompt', 'override', 'bypass', '绕过'
];

// ==================== DSL 验证 ====================

/**
 * 验证 DSL 结构
 */
function validateDSL(dsl) {
  const errors = [];

  // 检查基本结构
  if (!dsl || typeof dsl !== 'object') {
    errors.push('DSL 必须是一个对象');
    return { valid: false, errors };
  }

  if (dsl.version !== '1.0') {
    errors.push('不支持的 DSL 版本');
  }

  if (!Array.isArray(dsl.changes)) {
    errors.push('changes 必须是数组');
    return { valid: false, errors };
  }

  if (dsl.changes.length > 50) {
    errors.push('单次改造操作不能超过 50 个');
  }

  // 验证每个变更
  dsl.changes.forEach((change, index) => {
    const changeErrors = validateChange(change);
    if (changeErrors.length > 0) {
      errors.push(`变更 [${index}]: ${changeErrors.join(', ')}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 验证单个变更操作
 */
function validateChange(change) {
  const errors = [];

  if (!change.op) {
    errors.push('缺少 op 字段');
    return errors;
  }

  if (!change.selector) {
    errors.push('缺少 selector 字段');
    return errors;
  }

  // 验证选择器白名单
  if (!SELECTOR_WHITELIST.includes(change.selector)) {
    errors.push(`选择器 "${change.selector}" 不在白名单中`);
  }

  // 根据操作类型验证
  switch (change.op) {
    case 'set_text':
      if (typeof change.text !== 'string') {
        errors.push('text 必须是字符串');
      } else if (change.text.length > 500) {
        errors.push('文本长度不能超过 500 字符');
      }
      break;

    case 'set_style_var':
      if (!STYLE_VAR_WHITELIST.includes(change.var)) {
        errors.push(`CSS 变量 "${change.var}" 不在白名单中`);
      }
      if (typeof change.value !== 'string' || change.value.length > 32) {
        errors.push('样式值长度不能超过 32 字符');
      }
      break;

    case 'toggle':
      if (typeof change.enabled !== 'boolean') {
        errors.push('enabled 必须是布尔值');
      }
      break;

    case 'reorder':
      if (!Array.isArray(change.order)) {
        errors.push('order 必须是数组');
      } else if (change.order.length > 50) {
        errors.push('排序项不能超过 50 个');
      }
      break;

    case 'set_prop':
      if (!change.prop || !COMPONENT_PROPS_SCHEMA[change.prop]) {
        errors.push(`属性 "${change.prop}" 不在允许的属性列表中`);
      } else {
        const schema = COMPONENT_PROPS_SCHEMA[change.prop];
        const valueErrors = validatePropValue(change.value, schema);
        if (valueErrors.length > 0) {
          errors.push(...valueErrors);
        }
      }
      break;

    default:
      errors.push(`不支持的操作: ${change.op}`);
  }

  return errors;
}

/**
 * 验证属性值
 */
function validatePropValue(value, schema) {
  const errors = [];

  switch (schema.type) {
    case 'number':
      if (typeof value !== 'number') {
        errors.push('值必须是数字');
      } else if (schema.min !== undefined && value < schema.min) {
        errors.push(`值不能小于 ${schema.min}`);
      } else if (schema.max !== undefined && value > schema.max) {
        errors.push(`值不能大于 ${schema.max}`);
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push('值必须是布尔值');
      }
      break;

    case 'enum':
      if (!schema.values.includes(value)) {
        errors.push(`值必须是以下之一: ${schema.values.join(', ')}`);
      }
      break;
  }

  return errors;
}

// ==================== 意图解析 ====================

/**
 * 解析用户意图（简化版本，模拟 AI 理解）
 */
function parseIntent(text) {
  const intents = [];

  const lowerText = text.toLowerCase();

  // 检测改变文案
  if (lowerText.includes('改') && (lowerText.includes('标题') || lowerText.includes('文字') || lowerText.includes('文案'))) {
    intents.push({
      type: 'change_text',
      confidence: 0.85,
      examples: ['将标题改为"欢迎"', '修改页面标题']
    });
  }

  // 检测改变主题
  if (lowerText.includes('主题') || lowerText.includes('颜色') || lowerText.includes('配色')) {
    intents.push({
      type: 'change_theme',
      confidence: 0.8,
      examples: ['切换为深色主题', '改变主色调']
    });
  }

  // 检测显示/隐藏
  if (lowerText.includes('隐藏') || lowerText.includes('显示') || lowerText.includes('关闭') || lowerText.includes('打开')) {
    intents.push({
      type: 'toggle_visibility',
      confidence: 0.75,
      examples: ['隐藏横幅', '显示统计部分']
    });
  }

  // 检测重新排序
  if (lowerText.includes('排序') || lowerText.includes('顺序') || lowerText.includes('调整位置')) {
    intents.push({
      type: 'reorder',
      confidence: 0.7,
      examples: ['调整卡片顺序', '重新排列功能列表']
    });
  }

  return intents;
}

/**
 * 从自然语言生成 DSL（简化版本）
 */
function generateDSL(text) {
  const dsl = {
    version: '1.0',
    changes: []
  };

  const lowerText = text.toLowerCase();

  // 规则1: 改变标题
  if (lowerText.includes('标题') && lowerText.includes('改')) {
    // 提取引号中的文本
    const match = text.match(/["「『]([^"」』]+)["」』]/);
    if (match) {
      dsl.changes.push({
        op: 'set_text',
        selector: '#hero-title',
        text: match[1]
      });
    } else {
      dsl.changes.push({
        op: 'set_text',
        selector: '#hero-title',
        text: '欢迎来到更安全的互动站点'
      });
    }
  }

  // 规则2: 改变颜色/主题
  if (lowerText.includes('颜色') || lowerText.includes('主题')) {
    if (lowerText.includes('蓝') || lowerText.includes('blue')) {
      dsl.changes.push({
        op: 'set_style_var',
        selector: 'body',
        var: '--color-primary',
        value: '#4a90e2'
      });
    } else if (lowerText.includes('绿') || lowerText.includes('green')) {
      dsl.changes.push({
        op: 'set_style_var',
        selector: 'body',
        var: '--color-primary',
        value: '#52c41a'
      });
    } else if (lowerText.includes('红') || lowerText.includes('red')) {
      dsl.changes.push({
        op: 'set_style_var',
        selector: 'body',
        var: '--color-primary',
        value: '#f5222d'
      });
    } else if (lowerText.includes('紫') || lowerText.includes('purple')) {
      dsl.changes.push({
        op: 'set_style_var',
        selector: 'body',
        var: '--color-primary',
        value: '#722ed1'
      });
    }
  }

  // 规则3: 隐藏/显示元素
  if (lowerText.includes('隐藏')) {
    if (lowerText.includes('横幅') || lowerText.includes('banner')) {
      dsl.changes.push({
        op: 'toggle',
        selector: '.promo-banner',
        enabled: false
      });
    }
  }

  if (lowerText.includes('显示')) {
    if (lowerText.includes('横幅') || lowerText.includes('banner')) {
      dsl.changes.push({
        op: 'toggle',
        selector: '.promo-banner',
        enabled: true
      });
    }
  }

  // 规则4: 轮播间隔
  if (lowerText.includes('轮播') && lowerText.includes('间隔')) {
    const match = text.match(/(\d+)/);
    if (match) {
      const interval = parseInt(match[1]);
      if (interval >= 2 && interval <= 10) {
        dsl.changes.push({
          op: 'set_prop',
          selector: '#carousel',
          prop: 'carousel.interval',
          value: interval
        });
      }
    }
  }

  return dsl;
}

// ==================== 安全检查 ====================

/**
 * 检查文本中的危险内容
 */
function checkDangerousContent(text) {
  const risks = [];

  // 检查危险关键词
  for (const keyword of DANGEROUS_KEYWORDS) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      risks.push({
        type: 'dangerous_keyword',
        keyword,
        severity: 'high'
      });
    }
  }

  // 检查提示注入
  for (const keyword of PROMPT_INJECTION_KEYWORDS) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      risks.push({
        type: 'prompt_injection',
        keyword,
        severity: 'high'
      });
    }
  }

  // 检查 HTML 标签
  if (/<[^>]+>/.test(text)) {
    risks.push({
      type: 'html_injection',
      severity: 'high'
    });
  }

  // 检查 SQL 模式
  if (/SELECT\s+.*\s+FROM|DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO/i.test(text)) {
    risks.push({
      type: 'sql_injection',
      severity: 'high'
    });
  }

  return risks;
}

/**
 * 数据脱敏
 */
function sanitizeData(data) {
  if (typeof data !== 'string') {
    return data;
  }

  let result = data;

  // 邮箱脱敏
  result = result.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    (match, user, domain) => `${user.substring(0, 2)}***@${domain}`);

  // 手机号脱敏
  result = result.replace(/1[3-9]\d{9}/g, (match) =>
    `${match.substring(0, 3)}****${match.substring(7)}`);

  // API Key 脱敏
  result = result.replace(/([a-zA-Z0-9]{8,})(key|token|secret)/gi, '***$2');

  return result;
}

// ==================== 导出 ====================

export {
  parseIntent,
  generateDSL,
  validateDSL,
  checkDangerousContent,
  sanitizeData,
  SELECTOR_WHITELIST,
  STYLE_VAR_WHITELIST,
  COMPONENT_PROPS_SCHEMA
};
