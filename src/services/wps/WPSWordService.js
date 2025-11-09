/**
 * WPS Word 文档服务
 * 提供 Word 文档操作的前端接口
 */

const API_BASE = '/api/wps/word';

export class WPSWordService {
  /**
   * 获取文档内容
   */
  async getContent() {
    const response = await fetch(`${API_BASE}/get-content`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '获取文档内容失败');
    }
    return response.json();
  }

  /**
   * 插入文本
   * @param {string} text - 要插入的文本
   * @param {string} location - 插入位置 ('start', 'end', 'replace')
   */
  async insertText(text, location = 'end') {
    const response = await fetch(`${API_BASE}/insert-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, location })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '插入文本失败');
    }
    return response.json();
  }

  /**
   * 查找并替换文本
   * @param {string} findText - 要查找的文本
   * @param {string} replaceText - 替换后的文本
   * @param {boolean} matchCase - 是否区分大小写
   */
  async findReplace(findText, replaceText, matchCase = false) {
    const response = await fetch(`${API_BASE}/find-replace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ findText, replaceText, matchCase })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '查找替换失败');
    }
    return response.json();
  }

  /**
   * 设置段落格式
   * @param {Object} format - 格式参数
   * @param {string} format.alignment - 对齐方式 ('left', 'center', 'right', 'justify')
   * @param {number} format.lineSpacing - 行距
   * @param {number} format.firstLineIndent - 首行缩进
   */
  async formatParagraph(format) {
    const response = await fetch(`${API_BASE}/format-paragraph`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(format)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '设置段落格式失败');
    }
    return response.json();
  }

  /**
   * 设置字体格式
   * @param {Object} format - 格式参数
   * @param {boolean} format.bold - 粗体
   * @param {boolean} format.italic - 斜体
   * @param {number} format.size - 字号
   * @param {string} format.color - 颜色 (hex, 如 '#FF0000')
   * @param {string} format.name - 字体名称
   */
  async formatFont(format) {
    const response = await fetch(`${API_BASE}/format-font`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(format)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '设置字体格式失败');
    }
    return response.json();
  }

  /**
   * 插入表格
   * @param {number} rows - 行数
   * @param {number} cols - 列数
   */
  async insertTable(rows, cols) {
    const response = await fetch(`${API_BASE}/insert-table`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows, cols })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '插入表格失败');
    }
    return response.json();
  }

  /**
   * 获取可用的标题样式
   */
  async getHeadingStyles() {
    const response = await fetch(`${API_BASE}/heading-styles`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '获取标题样式失败');
    }
    return response.json();
  }

  /**
   * 应用标题样式
   * @param {number} level - 标题级别 (1-9)
   */
  async applyHeading(level) {
    const response = await fetch(`${API_BASE}/apply-heading`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '应用标题样式失败');
    }
    return response.json();
  }
}

export default new WPSWordService();
