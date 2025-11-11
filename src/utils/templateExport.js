/**
 * 模板导出工具函数
 */

/**
 * 导出商业计划为Markdown文件
 * @param {Array} templateItems - 模板项目列表
 * @param {Array} userAnswers - 用户填写的答案列表
 */
export function exportPlan(templateItems, userAnswers) {
  let content = '# 商业计划 - 一页纸\n\n';

  templateItems.forEach((item, index) => {
    content += `## ${index + 1}. ${item.title}\n\n`;
    content += `${userAnswers[index] || '(待填写)'}\n\n`;
  });

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `商业计划_${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 清空用户答案
 * @param {number} count - 答案数量
 * @returns {Array} 空答案数组
 */
export function clearAnswers(count) {
  if (confirm('确定要清空所有内容吗?')) {
    return Array(count).fill('');
  }
  return null;
}
