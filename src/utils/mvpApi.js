// MVP API 客户端

import { transformExecutor } from './transformExecutor';

const API_BASE = '/api';

class MvpApi {
  /**
   * 编译自然语言为DSL
   * @param {string} text - 用户输入的自然语言
   * @returns {Promise<object>} - API响应
   */
  async compile(text) {
    try {
      const response = await fetch(`${API_BASE}/mvp/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          session_id: transformExecutor.getSessionId()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('编译请求失败:', error);
      throw error;
    }
  }

  /**
   * 应用变更
   * @param {object} dsl - DSL对象
   * @param {string} previewHash - 预览哈希
   * @returns {Promise<object>} - API响应
   */
  async apply(dsl, previewHash) {
    try {
      const response = await fetch(`${API_BASE}/mvp/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: transformExecutor.getSessionId(),
          dsl: dsl,
          preview_hash: previewHash
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('应用请求失败:', error);
      throw error;
    }
  }

  /**
   * 撤销变更
   * @returns {Promise<object>} - API响应
   */
  async undo() {
    try {
      const response = await fetch(`${API_BASE}/mvp/undo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: transformExecutor.getSessionId()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('撤销请求失败:', error);
      throw error;
    }
  }

  /**
   * 获取审计日志（管理端）
   * @param {number} limit - 返回的最大条数
   * @returns {Promise<object>} - API响应
   */
  async getAuditLogs(limit = 200) {
    try {
      const response = await fetch(`${API_BASE}/mvp/admin/audit?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取审计日志失败:', error);
      throw error;
    }
  }

  /**
   * 封禁IP或会话
   * @param {string} ipOrSession - IP地址或会话ID
   * @returns {Promise<object>} - API响应
   */
  async ban(ipOrSession) {
    try {
      const response = await fetch(`${API_BASE}/mvp/admin/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ip_or_session: ipOrSession
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('封禁请求失败:', error);
      throw error;
    }
  }

  /**
   * 解封IP或会话
   * @param {string} ipOrSession - IP地址或会话ID
   * @returns {Promise<object>} - API响应
   */
  async unban(ipOrSession) {
    try {
      const response = await fetch(`${API_BASE}/mvp/admin/unban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ip_or_session: ipOrSession
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('解封请求失败:', error);
      throw error;
    }
  }
}

export const mvpApi = new MvpApi();
