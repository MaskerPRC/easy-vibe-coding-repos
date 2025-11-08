import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

async function generateTasks() {
  try {
    // 读取现有数据
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(fileData);

    // 生成 1000 个任务
    const tasks = [];
    for (let i = 1; i <= 1000; i++) {
      tasks.push({
        id: i,
        title: `任务 ${i}`,
        description: `这是第 ${i} 个任务的描述`,
        completed: false,
        createdAt: new Date().toISOString()
      });
    }

    // 更新数据
    data.tasks = tasks;

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('成功生成 1000 个任务！');
  } catch (error) {
    console.error('生成任务失败:', error);
  }
}

generateTasks();
