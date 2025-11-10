#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, chmodSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const gitHooksDir = join(projectRoot, '.git', 'hooks');
const preCommitSource = join(__dirname, 'pre-commit');
const preCommitTarget = join(gitHooksDir, 'pre-commit');

console.log('\n🔧 设置Git Hooks...\n');

// 检查是否是Git仓库
if (!existsSync(join(projectRoot, '.git'))) {
  console.log('⚠️  警告: 当前目录不是Git仓库。');
  console.log('📝 请先运行: git init');
  console.log('然后运行: npm run setup-hooks\n');
  process.exit(0);
}

// 确保hooks目录存在
if (!existsSync(gitHooksDir)) {
  mkdirSync(gitHooksDir, { recursive: true });
  console.log('✅ 创建了 .git/hooks 目录');
}

// 复制pre-commit hook
try {
  copyFileSync(preCommitSource, preCommitTarget);
  // 设置执行权限 (chmod +x)
  chmodSync(preCommitTarget, '755');
  console.log('✅ 已安装 pre-commit hook');
  console.log('📚 现在每次提交代码前都需要回答一道大学数学题！\n');
  console.log('💡 提示: 你可以运行 "node scripts/math-challenge.js" 来测试数学题。\n');
} catch (error) {
  console.error('❌ 安装hooks时出错:', error.message);
  process.exit(1);
}
