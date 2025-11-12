// 策略引擎 - 安全审查、白名单验证、危险指令检测

/**
 * 选择器白名单 - 只允许预定义的安全选择器
 */
const SELECTOR_WHITELIST = [
  // 页面主要区域
  '#hero-title',
  '#hero-subtitle',
  '#hero-description',
  '.hero-section',

  // 功能区域
  '.feature-list',
  '.feature-item',
  '#features-title',

  // 导航和布局
  '.promo-banner',
  '.announcement',
  '#main-content',
  '.sidebar',

  // 组件
  '#carousel',
  '.card',
  '.badge',
  '.section',

  // 页脚
  '.footer',
  '#footer-text'
];

/**
 * 允许的CSS变量白名单
 */
const CSS_VAR_WHITELIST = [
  '--color-primary',
  '--color-secondary',
  '--color-accent',
  '--color-background',
  '--color-text',
  '--color-border',
  '--font-size-base',
  '--spacing-unit',
  '--border-radius'
];

/**
 * 危险指令黑名单（用于文本内容检测）
 */
const DANGEROUS_COMMANDS = [
  // 系统命令
  'rm -rf', 'shutdown', 'reboot', 'kill', 'pkill',
  'dd if=', 'mkfs', 'format', ':(){:|:&};:',

  // 脚本注入
  '<script', 'javascript:', 'onerror=', 'onclick=',
  'onload=', 'eval(', 'setTimeout(', 'setInterval(',

  // SQL注入
  'DROP TABLE', 'DELETE FROM', 'UPDATE SET', 'INSERT INTO',
  'UNION SELECT', '--', '/*', '*/',

  // 命令注入
  '$(', '`', '&&', '||', '|', ';',

  // 路径遍历
  '../', '..\\', '/etc/passwd', '/etc/shadow',
  'C:\\Windows', 'C:\\Program Files',

  // 网络请求
  'curl ', 'wget ', 'fetch(', 'XMLHttpRequest',
  'axios.', 'http://', 'https://', 'ftp://'
];

/**
 * 提示注入检测模式
 */
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(previous|above|all)\s+instructions?/i,
  /forget\s+(everything|all|previous)/i,
  /你是|你现在是|你的角色是/i,
  /system\s*:\s*/i,
  /override\s+instructions?/i,
  /new\s+instructions?/i,
  /disregard\s+(previous|above)/i,
  /作为.*助手/i,
  /模拟|扮演|假装/i
];

/**
 * 敏感信息检测模式（用于脱敏）
 */
const SENSITIVE_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b1[3-9]\d{9}\b/g,
  idCard: /\b\d{17}[\dXx]\b/g,
  apiKey: /\b(sk-[a-zA-Z0-9]{32,}|[a-f0-9]{32})\b/gi,
  jwt: /\beyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g,
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
};

/**
 * 违禁内容关键词
 */
const PROHIBITED_KEYWORDS = [
  // 暴力相关
  '暴力', '血腥', '杀人', '自杀', '爆炸',

  // 色情相关
  '色情', '裸体', '性交', '成人内容',

  // 政治敏感
  // (根据实际需求添加)

  // 违法内容
  '贩毒', '走私', '洗钱', '诈骗', '黑客攻击',
  '数据泄露', '盗号', '钓鱼',

  // 仇恨言论
  '种族歧视', '性别歧视', '仇恨言论'
];

/**
 * 检查选择器是否在白名单内
 */
export function isSelectorAllowed(selector) {
  return SELECTOR_WHITELIST.includes(selector);
}

/**
 * 检查CSS变量是否在白名单内
 */
export function isCSSVarAllowed(varName) {
  return CSS_VAR_WHITELIST.includes(varName);
}

/**
 * 检测危险指令
 */
export function detectDangerousCommands(text) {
  if (!text || typeof text !== 'string') return { safe: true };

  const found = [];
  const lowerText = text.toLowerCase();

  for (const cmd of DANGEROUS_COMMANDS) {
    if (lowerText.includes(cmd.toLowerCase())) {
      found.push(cmd);
    }
  }

  return {
    safe: found.length === 0,
    detected: found,
    reason: found.length > 0 ? `检测到危险指令: ${found.join(', ')}` : null
  };
}

/**
 * 检测提示注入
 */
export function detectPromptInjection(text) {
  if (!text || typeof text !== 'string') return { safe: true };

  const found = [];

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      found.push(pattern.source);
    }
  }

  return {
    safe: found.length === 0,
    detected: found,
    reason: found.length > 0 ? '检测到可能的提示注入攻击' : null
  };
}

/**
 * 检测违禁内容
 */
export function detectProhibitedContent(text) {
  if (!text || typeof text !== 'string') return { safe: true };

  const found = [];
  const lowerText = text.toLowerCase();

  for (const keyword of PROHIBITED_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      found.push(keyword);
    }
  }

  return {
    safe: found.length === 0,
    detected: found,
    reason: found.length > 0 ? `包含违禁内容: ${found.join(', ')}` : null
  };
}

/**
 * 脱敏处理
 */
export function maskSensitiveInfo(text) {
  if (!text || typeof text !== 'string') return text;

  let masked = text;

  // 邮箱脱敏
  masked = masked.replace(SENSITIVE_PATTERNS.email, (email) => {
    const [user, domain] = email.split('@');
    return `${user.slice(0, 2)}***@${domain}`;
  });

  // 手机号脱敏
  masked = masked.replace(SENSITIVE_PATTERNS.phone, (phone) => {
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
  });

  // 身份证脱敏
  masked = masked.replace(SENSITIVE_PATTERNS.idCard, (id) => {
    return `${id.slice(0, 6)}********${id.slice(-4)}`;
  });

  // API Key脱敏
  masked = masked.replace(SENSITIVE_PATTERNS.apiKey, () => '***KEY_REDACTED***');

  // JWT脱敏
  masked = masked.replace(SENSITIVE_PATTERNS.jwt, () => '***TOKEN_REDACTED***');

  // 信用卡脱敏
  masked = masked.replace(SENSITIVE_PATTERNS.creditCard, (card) => {
    return `****-****-****-${card.slice(-4)}`;
  });

  return masked;
}

/**
 * 综合安全审查
 */
export function performSecurityCheck(text) {
  const checks = [];
  let safe = true;
  const reasons = [];

  // 1. 危险指令检测
  const cmdCheck = detectDangerousCommands(text);
  checks.push({ type: 'dangerous_commands', ...cmdCheck });
  if (!cmdCheck.safe) {
    safe = false;
    reasons.push(cmdCheck.reason);
  }

  // 2. 提示注入检测
  const injectionCheck = detectPromptInjection(text);
  checks.push({ type: 'prompt_injection', ...injectionCheck });
  if (!injectionCheck.safe) {
    safe = false;
    reasons.push(injectionCheck.reason);
  }

  // 3. 违禁内容检测
  const contentCheck = detectProhibitedContent(text);
  checks.push({ type: 'prohibited_content', ...contentCheck });
  if (!contentCheck.safe) {
    safe = false;
    reasons.push(contentCheck.reason);
  }

  // 4. 长度检查
  if (text.length > 800) {
    safe = false;
    reasons.push('输入文本过长（最大800字符）');
  }

  return {
    safe,
    checks,
    reasons,
    masked: maskSensitiveInfo(text)
  };
}

/**
 * 验证DSL的安全性（策略级别）
 */
export function validateDSLSecurity(dsl) {
  const errors = [];

  if (!dsl || !Array.isArray(dsl.changes)) {
    return { safe: false, errors: ['无效的DSL格式'] };
  }

  for (const [index, change] of dsl.changes.entries()) {
    // 检查选择器白名单
    if (change.selector && !isSelectorAllowed(change.selector)) {
      errors.push(`变更[${index}]: 选择器 "${change.selector}" 不在白名单内`);
    }

    // 检查CSS变量白名单
    if (change.var && !isCSSVarAllowed(change.var)) {
      errors.push(`变更[${index}]: CSS变量 "${change.var}" 不在白名单内`);
    }

    // 检查文本内容安全性
    if (change.text) {
      const textCheck = performSecurityCheck(change.text);
      if (!textCheck.safe) {
        errors.push(`变更[${index}]: 文本内容不安全 - ${textCheck.reasons.join(', ')}`);
      }
    }

    // 检查值的安全性
    if (change.value && typeof change.value === 'string') {
      const valueCheck = performSecurityCheck(change.value);
      if (!valueCheck.safe) {
        errors.push(`变更[${index}]: 值不安全 - ${valueCheck.reasons.join(', ')}`);
      }
    }
  }

  return {
    safe: errors.length === 0,
    errors
  };
}

/**
 * 获取风险等级
 */
export function getRiskLevel(checks) {
  if (!checks || checks.length === 0) return 'low';

  const failedChecks = checks.filter(c => !c.safe);
  if (failedChecks.length === 0) return 'low';
  if (failedChecks.length === 1) return 'medium';
  return 'high';
}

export {
  SELECTOR_WHITELIST,
  CSS_VAR_WHITELIST,
  DANGEROUS_COMMANDS,
  PROMPT_INJECTION_PATTERNS,
  PROHIBITED_KEYWORDS
};
