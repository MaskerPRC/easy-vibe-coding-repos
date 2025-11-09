/**
 * WPS PowerPoint 演示文稿服务
 * 提供 PowerPoint 幻灯片操作的前端接口
 */

const API_BASE = '/api/wps/powerpoint';

export class WPSPowerPointService {
  /**
   * 获取演示文稿信息
   */
  async getInfo() {
    const response = await fetch(`${API_BASE}/get-info`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '获取演示文稿信息失败');
    }
    return response.json();
  }

  /**
   * 添加新幻灯片
   * @param {number} layout - 布局类型 (默认 12 = 空白)
   */
  async addSlide(layout = 12) {
    const response = await fetch(`${API_BASE}/add-slide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ layout })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '添加幻灯片失败');
    }
    return response.json();
  }

  /**
   * 添加文本框
   * @param {string} text - 文本内容
   * @param {number} left - 左边距
   * @param {number} top - 上边距
   * @param {number} width - 宽度
   * @param {number} height - 高度
   */
  async addTextbox(text, left = 100, top = 100, width = 400, height = 100) {
    const response = await fetch(`${API_BASE}/add-textbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, left, top, width, height })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '添加文本框失败');
    }
    return response.json();
  }
}

export default new WPSPowerPointService();
