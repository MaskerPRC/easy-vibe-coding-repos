// 意图解析和DSL编译器 - 将自然语言转换为安全DSL

import { createEmptyDSL } from './dsl.js';

/**
 * 意图类型定义
 */
const INTENT_TYPES = {
  CHANGE_TEXT: 'change_text',       // 修改文本
  CHANGE_THEME: 'change_theme',     // 修改主题
  TOGGLE_ELEMENT: 'toggle_element', // 显示/隐藏元素
  REORDER: 'reorder',               // 重新排序
  SET_PROP: 'set_prop',             // 设置属性
  UNKNOWN: 'unknown'                // 未知意图
};

/**
 * 关键词匹配规则
 */
const INTENT_PATTERNS = {
  // 修改文本相关
  change_text: [
    /修改|更改|改成|变成|换成/,
    /标题|文字|文案|内容/,
    /改为|设置为|显示为/
  ],

  // 修改主题相关
  change_theme: [
    /主题|颜色|配色|色调/,
    /深色|浅色|黑色|白色|蓝色|红色|绿色/,
    /背景色|前景色|主色调/
  ],

  // 显示隐藏相关
  toggle_element: [
    /显示|隐藏|展示|关闭|打开/,
    /横幅|通知|公告|模块|部分/
  ],

  // 排序相关
  reorder: [
    /排序|顺序|调整|交换/,
    /第一|第二|第三|最前|最后/
  ],

  // 属性设置相关
  set_prop: [
    /间隔|速度|样式|风格/,
    /轮播|卡片|徽章/
  ]
};

/**
 * 元素映射（自然语言 -> 选择器）
 */
const ELEMENT_MAPPING = {
  '标题': '#hero-title',
  '主标题': '#hero-title',
  '副标题': '#hero-subtitle',
  '描述': '#hero-description',
  '公告': '.promo-banner',
  '横幅': '.promo-banner',
  '通知栏': '.announcement',
  '轮播': '#carousel',
  '页脚': '.footer',
  '底部文字': '#footer-text'
};

/**
 * 主题颜色映射
 */
const THEME_COLORS = {
  '蓝色': '#4a90e2',
  '红色': '#e74c3c',
  '绿色': '#2ecc71',
  '紫色': '#9b59b6',
  '橙色': '#f39c12',
  '黑色': '#2c3e50',
  '白色': '#ecf0f1',
  '灰色': '#95a5a6'
};

/**
 * 解析用户输入的意图
 */
export function parseIntent(text) {
  if (!text || typeof text !== 'string') {
    return [{ type: INTENT_TYPES.UNKNOWN, confidence: 0 }];
  }

  const intents = [];
  const lowerText = text.toLowerCase();

  // 检查每种意图类型
  for (const [intentType, patterns] of Object.entries(INTENT_PATTERNS)) {
    let matchCount = 0;

    for (const pattern of patterns) {
      if (pattern.test(lowerText) || pattern.test(text)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      intents.push({
        type: intentType,
        confidence: matchCount / patterns.length,
        matchCount
      });
    }
  }

  // 按置信度排序
  intents.sort((a, b) => b.confidence - a.confidence);

  // 如果没有匹配到任何意图
  if (intents.length === 0) {
    intents.push({ type: INTENT_TYPES.UNKNOWN, confidence: 0 });
  }

  return intents;
}

/**
 * 编译DSL - 将自然语言转换为DSL
 */
export function compileToDSL(text) {
  const dsl = createEmptyDSL();
  const intents = parseIntent(text);
  const primaryIntent = intents[0];

  if (!primaryIntent || primaryIntent.type === INTENT_TYPES.UNKNOWN) {
    // 提供一些示例建议
    return {
      success: false,
      dsl: null,
      suggestions: [
        '修改标题为"欢迎访问"',
        '将主题改为蓝色',
        '隐藏公告横幅',
        '显示通知栏'
      ]
    };
  }

  try {
    switch (primaryIntent.type) {
      case INTENT_TYPES.CHANGE_TEXT:
        compileChangeText(text, dsl);
        break;

      case INTENT_TYPES.CHANGE_THEME:
        compileChangeTheme(text, dsl);
        break;

      case INTENT_TYPES.TOGGLE_ELEMENT:
        compileToggleElement(text, dsl);
        break;

      default:
        return {
          success: false,
          dsl: null,
          suggestions: ['暂不支持该类型的操作']
        };
    }

    return {
      success: dsl.changes.length > 0,
      dsl,
      intent: primaryIntent.type
    };
  } catch (error) {
    return {
      success: false,
      dsl: null,
      error: error.message
    };
  }
}

/**
 * 编译文本修改指令
 */
function compileChangeText(text, dsl) {
  // 尝试提取目标元素和新文本
  let targetElement = null;
  let newText = null;

  // 匹配模式: "修改XXX为YYY" 或 "将XXX改为YYY"
  const patterns = [
    /(?:修改|更改|改|将)(.+?)(?:为|成|是|改为|变为|设置为)["']?(.+?)["']?$/,
    /(?:把|让)(.+?)(?:显示|改为|变成|变为)["']?(.+?)["']?$/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const elementName = match[1].trim();
      newText = match[2].trim().replace(/["']/g, '');

      // 查找元素映射
      for (const [key, selector] of Object.entries(ELEMENT_MAPPING)) {
        if (elementName.includes(key)) {
          targetElement = selector;
          break;
        }
      }

      if (targetElement && newText) {
        break;
      }
    }
  }

  if (targetElement && newText) {
    dsl.changes.push({
      op: 'set_text',
      selector: targetElement,
      text: newText
    });
  } else {
    throw new Error('无法识别要修改的元素或新文本');
  }
}

/**
 * 编译主题修改指令
 */
function compileChangeTheme(text, dsl) {
  // 查找颜色关键词
  let color = null;

  for (const [colorName, colorValue] of Object.entries(THEME_COLORS)) {
    if (text.includes(colorName)) {
      color = colorValue;
      break;
    }
  }

  if (color) {
    dsl.changes.push({
      op: 'set_style_var',
      selector: ':root',
      var: '--color-primary',
      value: color
    });
  } else {
    throw new Error('无法识别颜色');
  }
}

/**
 * 编译显示/隐藏指令
 */
function compileToggleElement(text, dsl) {
  let targetElement = null;
  let enabled = true;

  // 判断是显示还是隐藏
  if (/隐藏|关闭|不显示/.test(text)) {
    enabled = false;
  }

  // 查找目标元素
  for (const [key, selector] of Object.entries(ELEMENT_MAPPING)) {
    if (text.includes(key)) {
      targetElement = selector;
      break;
    }
  }

  if (targetElement) {
    dsl.changes.push({
      op: 'toggle',
      selector: targetElement,
      enabled
    });
  } else {
    throw new Error('无法识别要操作的元素');
  }
}

/**
 * 生成示例DSL
 */
export function generateExamples() {
  return [
    {
      description: '修改标题文本',
      dsl: {
        version: '1.0',
        changes: [
          { op: 'set_text', selector: '#hero-title', text: '欢迎来到互动站点' }
        ]
      }
    },
    {
      description: '更改主题颜色为蓝色',
      dsl: {
        version: '1.0',
        changes: [
          { op: 'set_style_var', selector: ':root', var: '--color-primary', value: '#4a90e2' }
        ]
      }
    },
    {
      description: '隐藏公告横幅',
      dsl: {
        version: '1.0',
        changes: [
          { op: 'toggle', selector: '.promo-banner', enabled: false }
        ]
      }
    }
  ];
}

/**
 * 获取支持的元素列表
 */
export function getSupportedElements() {
  return Object.keys(ELEMENT_MAPPING);
}

/**
 * 获取支持的颜色列表
 */
export function getSupportedColors() {
  return Object.keys(THEME_COLORS);
}

export { INTENT_TYPES, ELEMENT_MAPPING, THEME_COLORS };
