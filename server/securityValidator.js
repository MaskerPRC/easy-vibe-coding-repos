// 安全校验器 - 文本审查和DSL策略校验

export const securityValidator = {
  // 危险命令词黑名单
  dangerousCommands: [
    'reboot', 'shutdown', 'rm -rf', 'rm -f', 'curl', 'wget', 'eval',
    '<script', '</script>', 'javascript:', 'onerror=', 'onload=',
    'document.cookie', 'window.location', 'exec', 'system',
    'base64', 'atob', 'btoa', '__proto__', 'constructor',
    'process.env', 'require(', 'import(', 'fetch('
  ],

  // 敏感信息正则表达式
  sensitivePatterns: [
    // 手机号
    { regex: /1[3-9]\d{9}/g, name: '手机号' },
    // 邮箱
    { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, name: '邮箱' },
    // API Key格式（典型特征：长字符串，包含大小写字母和数字）
    { regex: /[A-Za-z0-9]{20,}/g, name: 'API密钥' },
    // JWT Token
    { regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, name: 'JWT令牌' },
    // 身份证号
    { regex: /\d{17}[\dXx]/g, name: '身份证号' }
  ],

  // 违规内容关键词
  illegalKeywords: [
    '暴力', '恐怖', '血腥', '色情', '赌博', '毒品',
    '仇恨', '歧视', '非法', '枪支', '爆炸', '自杀'
  ],

  // 允许的选择器白名单
  allowedSelectors: ['#hero-title', '#sub-title', '.promo-banner', ':root', 'body'],

  // 允许的CSS变量白名单
  allowedVars: ['--color-primary'],

  // 允许的颜色值白名单
  allowedColors: ['blue', 'green', 'amber'],

  // 允许的操作白名单
  allowedOps: ['set_text', 'set_style_var', 'toggle'],

  /**
   * 验证文本安全性
   * @param {string} text - 用户输入的文本
   * @returns {object} - {safe: boolean, reason?: string, sanitizedText?: string}
   */
  validateText(text) {
    if (!text || typeof text !== 'string') {
      return { safe: false, reason: '文本无效' };
    }

    // 1. 检查长度限制
    if (text.length > 200) {
      return { safe: false, reason: '输入文本过长（最多200字符）' };
    }

    const lowerText = text.toLowerCase();

    // 2. 检查危险命令词
    for (const cmd of this.dangerousCommands) {
      if (lowerText.includes(cmd.toLowerCase())) {
        return { safe: false, reason: `包含危险命令：${cmd}` };
      }
    }

    // 3. 检查违规内容
    for (const keyword of this.illegalKeywords) {
      if (text.includes(keyword)) {
        return { safe: false, reason: `包含违规内容关键词` };
      }
    }

    // 4. 检查并脱敏敏感信息
    let sanitizedText = text;
    let hasSensitiveInfo = false;

    for (const pattern of this.sensitivePatterns) {
      if (pattern.regex.test(sanitizedText)) {
        sanitizedText = sanitizedText.replace(pattern.regex, '***');
        hasSensitiveInfo = true;
      }
    }

    if (hasSensitiveInfo) {
      return {
        safe: true,
        sanitizedText: sanitizedText,
        warning: '检测到敏感信息已脱敏处理'
      };
    }

    return { safe: true };
  },

  /**
   * 验证DSL的策略合规性
   * @param {object} dsl - DSL对象
   * @returns {object} - {valid: boolean, reason?: string, warnings?: array}
   */
  validateDSL(dsl) {
    if (!dsl || typeof dsl !== 'object') {
      return { valid: false, reason: 'DSL格式无效' };
    }

    // 1. 验证版本
    if (dsl.version !== '0.1') {
      return { valid: false, reason: 'DSL版本不支持' };
    }

    // 2. 验证changes数组
    if (!Array.isArray(dsl.changes)) {
      return { valid: false, reason: 'changes必须是数组' };
    }

    // 3. 验证changes长度
    if (dsl.changes.length === 0) {
      return { valid: false, reason: 'changes不能为空' };
    }

    if (dsl.changes.length > 5) {
      return { valid: false, reason: '单次变更不能超过5项' };
    }

    // 4. 逐项验证每个change
    for (let i = 0; i < dsl.changes.length; i++) {
      const change = dsl.changes[i];
      const validation = this.validateChange(change);

      if (!validation.valid) {
        return { valid: false, reason: `第${i + 1}项变更无效：${validation.reason}` };
      }
    }

    return { valid: true, warnings: [] };
  },

  /**
   * 验证单个change项
   * @param {object} change - 单个变更项
   * @returns {object} - {valid: boolean, reason?: string}
   */
  validateChange(change) {
    if (!change || typeof change !== 'object') {
      return { valid: false, reason: '变更项格式无效' };
    }

    // 验证op字段
    if (!change.op || !this.allowedOps.includes(change.op)) {
      return { valid: false, reason: `操作类型${change.op}不被允许` };
    }

    // 验证selector字段
    if (!change.selector || !this.allowedSelectors.includes(change.selector)) {
      return { valid: false, reason: `选择器${change.selector}不在白名单中` };
    }

    // 根据不同操作类型进行特定验证
    switch (change.op) {
      case 'set_text':
        return this.validateSetText(change);

      case 'set_style_var':
        return this.validateSetStyleVar(change);

      case 'toggle':
        return this.validateToggle(change);

      default:
        return { valid: false, reason: '未知操作类型' };
    }
  },

  /**
   * 验证set_text操作
   */
  validateSetText(change) {
    // 验证选择器
    if (!['#hero-title', '#sub-title'].includes(change.selector)) {
      return { valid: false, reason: 'set_text操作仅允许#hero-title和#sub-title' };
    }

    // 验证text字段
    if (typeof change.text !== 'string') {
      return { valid: false, reason: 'text必须是字符串' };
    }

    if (change.text.length === 0) {
      return { valid: false, reason: 'text不能为空' };
    }

    if (change.text.length > 40) {
      return { valid: false, reason: 'text长度不能超过40字符' };
    }

    // 检查HTML标签
    if (/<[^>]+>/g.test(change.text)) {
      return { valid: false, reason: 'text不能包含HTML标签' };
    }

    return { valid: true };
  },

  /**
   * 验证set_style_var操作
   */
  validateSetStyleVar(change) {
    // 验证选择器
    if (![':root', 'body'].includes(change.selector)) {
      return { valid: false, reason: 'set_style_var操作仅允许:root和body选择器' };
    }

    // 验证var字段
    if (!change.var || !this.allowedVars.includes(change.var)) {
      return { valid: false, reason: `CSS变量${change.var}不在白名单中` };
    }

    // 验证value字段
    if (!change.value || !this.allowedColors.includes(change.value)) {
      return { valid: false, reason: `颜色值${change.value}不在白名单中（允许：blue, green, amber）` };
    }

    return { valid: true };
  },

  /**
   * 验证toggle操作
   */
  validateToggle(change) {
    // 验证选择器
    if (change.selector !== '.promo-banner') {
      return { valid: false, reason: 'toggle操作仅允许.promo-banner选择器' };
    }

    // 验证enabled字段
    if (typeof change.enabled !== 'boolean') {
      return { valid: false, reason: 'enabled必须是布尔值' };
    }

    return { valid: true };
  }
};
