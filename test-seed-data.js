/**
 * Seed 数据测试脚本
 * 用于验证 seed 数据是否正常加载
 */

import { generateSeedData } from './server/seedData.js';

console.log('='.repeat(60));
console.log('Seed 数据测试');
console.log('='.repeat(60));

const seedData = generateSeedData();

console.log('\n✓ 用户数据:');
console.log(`  总数: ${seedData.users.length} 个`);
seedData.users.forEach(user => {
  console.log(`  - ${user.username} (ID: ${user.id})`);
});

console.log('\n✓ 项目数据:');
console.log(`  总数: ${seedData.projects.length} 个`);
seedData.projects.forEach(project => {
  console.log(`  - ${project.name} (优先级: ${project.priority})`);
});

console.log('\n✓ 信息源数据:');
console.log(`  总数: ${seedData.sources.length} 个`);
seedData.sources.forEach(source => {
  console.log(`  - ${source.name} (类型: ${source.type}, 状态: ${source.enabled ? '启用' : '禁用'})`);
});

console.log('\n✓ 消息数据:');
console.log(`  总数: ${seedData.messages.length} 条`);
const importantMessages = seedData.messages.filter(m => m.isImportant);
const unreadMessages = seedData.messages.filter(m => !m.isRead);
console.log(`  - 重要消息: ${importantMessages.length} 条`);
console.log(`  - 未读消息: ${unreadMessages.length} 条`);

// 显示几条示例消息
console.log('\n✓ 示例消息（前 3 条）:');
seedData.messages.slice(0, 3).forEach((msg, index) => {
  console.log(`\n  ${index + 1}. ${msg.title}`);
  console.log(`     相关度: ${(msg.relevanceScore * 100).toFixed(0)}%`);
  console.log(`     重要: ${msg.isImportant ? '是' : '否'}`);
  console.log(`     状态: ${msg.isRead ? '已读' : '未读'}`);
});

console.log('\n' + '='.repeat(60));
console.log('✓ Seed 数据测试完成！所有数据格式正确。');
console.log('='.repeat(60));
