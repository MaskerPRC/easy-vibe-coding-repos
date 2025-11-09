/**
 * WPS 服务统一导出
 */

import WPSWordService from './WPSWordService.js';
import WPSExcelService from './WPSExcelService.js';
import WPSPowerPointService from './WPSPowerPointService.js';

/**
 * 检测 WPS Office 安装状态
 */
export async function detectWPS() {
  const response = await fetch('/api/wps/detect');
  if (!response.ok) {
    throw new Error('WPS 检测失败');
  }
  return response.json();
}

/**
 * 检查 WPS Bridge 健康状态
 */
export async function checkBridgeHealth() {
  const response = await fetch('/api/wps/bridge/health');
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'WPS Bridge 服务不可用');
  }
  return response.json();
}

/**
 * 重启 WPS Bridge 服务
 */
export async function restartBridge() {
  const response = await fetch('/api/wps/bridge/restart', {
    method: 'POST'
  });
  if (!response.ok) {
    throw new Error('重启服务失败');
  }
  return response.json();
}

export {
  WPSWordService,
  WPSExcelService,
  WPSPowerPointService
};

export default {
  word: WPSWordService,
  excel: WPSExcelService,
  powerpoint: WPSPowerPointService,
  detectWPS,
  checkBridgeHealth,
  restartBridge
};
