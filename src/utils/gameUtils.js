/**
 * 格式化游戏时间
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串 (mm:ss)
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * 计算 K/D 比率
 * @param {number} kills - 击杀数
 * @param {number} deaths - 死亡数
 * @returns {string} K/D 比率
 */
export const calculateKDRatio = (kills, deaths) => {
  if (deaths === 0) return kills.toFixed(2)
  return (kills / deaths).toFixed(2)
}

/**
 * 计算准确率
 * @param {number} shotsHit - 命中数
 * @param {number} shotsFired - 发射数
 * @returns {string} 准确率百分比
 */
export const calculateAccuracy = (shotsHit, shotsFired) => {
  if (shotsFired === 0) return '0'
  return ((shotsHit / shotsFired) * 100).toFixed(1)
}

/**
 * 限制值在指定范围内
 * @param {number} value - 值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的值
 */
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value))
}
