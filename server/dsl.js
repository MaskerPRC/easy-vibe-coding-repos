// 安全DSL系统 - 定义和验证声明式改造指令

/**
 * 安全DSL Schema定义
 * 只允许预定义的、安全的操作
 */
const DSL_SCHEMA = {
  version: '1.0',

  // 支持的操作类型
  operations: {
    // 设置文本内容
    set_text: {
      required: ['op', 'selector', 'text'],
      schema: {
        op: { type: 'const', value: 'set_text' },
        selector: { type: 'string', pattern: /^(#|\.)[a-zA-Z0-9_-]+$/ },
        text: { type: 'string', maxLength: 500 }
      }
    },

    // 设置CSS变量
    set_style_var: {
      required: ['op', 'selector', 'var', 'value'],
      schema: {
        op: { type: 'const', value: 'set_style_var' },
        selector: { type: 'string', enum: [':root', 'body'] },
        var: { type: 'string', pattern: /^--[a-z0-9-]+$/ },
        value: { type: 'string', maxLength: 32 }
      }
    },

    // 切换显示/隐藏
    toggle: {
      required: ['op', 'selector', 'enabled'],
      schema: {
        op: { type: 'const', value: 'toggle' },
        selector: { type: 'string', pattern: /^(#|\.)[a-zA-Z0-9_-]+$/ },
        enabled: { type: 'boolean' }
      }
    },

    // 重新排序子元素
    reorder: {
      required: ['op', 'selector', 'order'],
      schema: {
        op: { type: 'const', value: 'reorder' },
        selector: { type: 'string', pattern: /^(#|\.)[a-zA-Z0-9_-]+$/ },
        order: { type: 'array', items: { type: 'integer', minimum: 0 }, maxItems: 50 }
      }
    },

    // 设置组件属性
    set_prop: {
      required: ['op', 'selector', 'prop', 'value'],
      schema: {
        op: { type: 'const', value: 'set_prop' },
        selector: { type: 'string', pattern: /^(#|\.)[a-zA-Z0-9_-]+$/ },
        prop: {
          type: 'string',
          enum: [
            'carousel.interval',
            'card.variant',
            'badge.tone',
            'section.collapsible'
          ]
        },
        value: { type: 'any' } // 根据prop类型进一步验证
      }
    }
  }
};

/**
 * 组件属性的详细Schema
 */
const PROP_SCHEMAS = {
  'carousel.interval': { type: 'integer', minimum: 2, maximum: 10 },
  'card.variant': { type: 'string', enum: ['default', 'bordered', 'elevated', 'filled'] },
  'badge.tone': { type: 'string', enum: ['info', 'success', 'warning', 'error', 'neutral'] },
  'section.collapsible': { type: 'boolean' }
};

/**
 * 验证单个变更操作
 */
function validateChange(change) {
  const errors = [];

  if (!change || typeof change !== 'object') {
    return { valid: false, errors: ['变更必须是对象'] };
  }

  const { op } = change;
  if (!op) {
    return { valid: false, errors: ['缺少操作类型(op)'] };
  }

  const opDef = DSL_SCHEMA.operations[op];
  if (!opDef) {
    return { valid: false, errors: [`不支持的操作类型: ${op}`] };
  }

  // 检查必需字段
  for (const field of opDef.required) {
    if (!(field in change)) {
      errors.push(`缺少必需字段: ${field}`);
    }
  }

  // 验证每个字段
  for (const [field, value] of Object.entries(change)) {
    const fieldSchema = opDef.schema[field];
    if (!fieldSchema) {
      errors.push(`未知字段: ${field}`);
      continue;
    }

    const fieldErrors = validateField(field, value, fieldSchema);
    errors.push(...fieldErrors);
  }

  // 特殊验证：set_prop的value需要根据prop类型验证
  if (op === 'set_prop' && !errors.length) {
    const propSchema = PROP_SCHEMAS[change.prop];
    if (propSchema) {
      const propErrors = validateField('value', change.value, propSchema);
      errors.push(...propErrors.map(e => `属性值验证失败: ${e}`));
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * 验证字段值
 */
function validateField(name, value, schema) {
  const errors = [];

  // 类型检查
  if (schema.type === 'const') {
    if (value !== schema.value) {
      errors.push(`${name} 必须等于 "${schema.value}"`);
    }
  } else if (schema.type === 'string') {
    if (typeof value !== 'string') {
      errors.push(`${name} 必须是字符串`);
    } else {
      // 长度检查
      if (schema.maxLength && value.length > schema.maxLength) {
        errors.push(`${name} 超过最大长度 ${schema.maxLength}`);
      }

      // 正则检查
      if (schema.pattern && !schema.pattern.test(value)) {
        errors.push(`${name} 格式不符合要求`);
      }

      // 枚举检查
      if (schema.enum && !schema.enum.includes(value)) {
        errors.push(`${name} 必须是以下值之一: ${schema.enum.join(', ')}`);
      }
    }
  } else if (schema.type === 'boolean') {
    if (typeof value !== 'boolean') {
      errors.push(`${name} 必须是布尔值`);
    }
  } else if (schema.type === 'integer') {
    if (!Number.isInteger(value)) {
      errors.push(`${name} 必须是整数`);
    } else {
      if (schema.minimum !== undefined && value < schema.minimum) {
        errors.push(`${name} 不能小于 ${schema.minimum}`);
      }
      if (schema.maximum !== undefined && value > schema.maximum) {
        errors.push(`${name} 不能大于 ${schema.maximum}`);
      }
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${name} 必须是数组`);
    } else {
      if (schema.maxItems && value.length > schema.maxItems) {
        errors.push(`${name} 数组长度不能超过 ${schema.maxItems}`);
      }

      // 验证数组项
      if (schema.items) {
        value.forEach((item, index) => {
          const itemErrors = validateField(`${name}[${index}]`, item, schema.items);
          errors.push(...itemErrors);
        });
      }
    }
  }

  return errors;
}

/**
 * 验证完整的DSL文档
 */
export function validateDSL(dsl) {
  const errors = [];

  if (!dsl || typeof dsl !== 'object') {
    return { valid: false, errors: ['DSL必须是对象'] };
  }

  // 验证版本
  if (dsl.version !== DSL_SCHEMA.version) {
    errors.push(`不支持的DSL版本: ${dsl.version}`);
  }

  // 验证changes
  if (!Array.isArray(dsl.changes)) {
    errors.push('changes必须是数组');
    return { valid: false, errors };
  }

  if (dsl.changes.length === 0) {
    errors.push('changes不能为空');
  }

  if (dsl.changes.length > 20) {
    errors.push('单次改造不能超过20个变更');
  }

  // 验证每个变更
  dsl.changes.forEach((change, index) => {
    const result = validateChange(change);
    if (!result.valid) {
      errors.push(`变更[${index}]: ${result.errors.join(', ')}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * 创建空的DSL模板
 */
export function createEmptyDSL() {
  return {
    version: '1.0',
    changes: []
  };
}

/**
 * 添加变更到DSL
 */
export function addChange(dsl, change) {
  const result = validateChange(change);
  if (!result.valid) {
    throw new Error(`无效的变更: ${result.errors.join(', ')}`);
  }

  dsl.changes.push(change);
  return dsl;
}

/**
 * 获取支持的操作列表
 */
export function getSupportedOperations() {
  return Object.keys(DSL_SCHEMA.operations);
}

/**
 * 获取操作的Schema定义
 */
export function getOperationSchema(op) {
  return DSL_SCHEMA.operations[op];
}

export { DSL_SCHEMA, PROP_SCHEMAS };
