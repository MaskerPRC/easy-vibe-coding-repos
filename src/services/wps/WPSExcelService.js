/**
 * WPS Excel 工作表服务
 * 提供 Excel 表格操作的前端接口
 */

const API_BASE = '/api/wps/excel';

export class WPSExcelService {
  /**
   * 读取单元格内容
   * @param {string} cell - 单元格地址 (如 'A1')
   */
  async getCell(cell) {
    const response = await fetch(`${API_BASE}/get-cell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cell })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '读取单元格失败');
    }
    return response.json();
  }

  /**
   * 写入单元格内容
   * @param {string} cell - 单元格地址 (如 'A1')
   * @param {any} value - 单元格值
   */
  async setCell(cell, value) {
    const response = await fetch(`${API_BASE}/set-cell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cell, value })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '写入单元格失败');
    }
    return response.json();
  }

  /**
   * 读取单元格区域
   * @param {string} range - 单元格区域 (如 'A1:C3')
   */
  async getRange(range) {
    const response = await fetch(`${API_BASE}/get-range`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ range })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '读取区域失败');
    }
    return response.json();
  }

  /**
   * 批量写入数据到单元格区域
   * @param {string} startCell - 起始单元格 (如 'A1')
   * @param {Array<Array>} data - 二维数组数据
   */
  async setRange(startCell, data) {
    // 计算结束单元格
    const rows = data.length;
    const cols = data[0]?.length || 0;

    // 写入每个单元格
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cellAddress = this._getCellAddress(startCell, i, j);
        await this.setCell(cellAddress, data[i][j]);
      }
    }

    return {
      success: true,
      message: `成功写入 ${rows}x${cols} 数据`
    };
  }

  /**
   * 计算单元格地址
   * @private
   */
  _getCellAddress(startCell, rowOffset, colOffset) {
    const match = startCell.match(/([A-Z]+)(\d+)/);
    if (!match) return startCell;

    const col = match[1];
    const row = parseInt(match[2]);

    // 计算列
    let colNum = 0;
    for (let i = 0; i < col.length; i++) {
      colNum = colNum * 26 + (col.charCodeAt(i) - 64);
    }
    colNum += colOffset;

    // 转换回列字母
    let newCol = '';
    while (colNum > 0) {
      const remainder = (colNum - 1) % 26;
      newCol = String.fromCharCode(65 + remainder) + newCol;
      colNum = Math.floor((colNum - 1) / 26);
    }

    const newRow = row + rowOffset;
    return `${newCol}${newRow}`;
  }
}

export default new WPSExcelService();
