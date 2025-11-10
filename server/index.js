import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 3002; // 后端端口 3002，前端 5173

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// API 路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取数据示例
app.get('/api/data', async (req, res) => {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(fileData);
    res.json({
      message: '这是来自后端的数据',
      data: parsedData
    });
  } catch (error) {
    console.error('读取数据失败:', error);
    // 如果文件不存在或读取失败，返回默认数据
    res.json({
      message: '这是来自后端的数据',
      data: {
        count: 0,
        items: []
      }
    });
  }
});

// 更新数据示例
app.post('/api/data', async (req, res) => {
  try {
    const { count } = req.body;
    console.log('收到更新请求，count =', count);
    console.log('数据文件路径:', DATA_FILE);

    // 读取现有数据
    let currentData = { count: 0, items: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
      console.log('读取到现有数据:', currentData);
    } catch (error) {
      // 文件不存在或读取失败，使用默认数据
      console.log('使用默认数据, 错误:', error.message);
    }

    // 更新 count 值
    currentData.count = count;
    console.log('准备保存的数据:', currentData);

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log('数据已写入文件');

    // 验证写入
    const savedData = await fs.readFile(DATA_FILE, 'utf-8');
    console.log('验证写入后的文件内容:', savedData);

    res.json({
      success: true,
      message: '数据已更新并保存',
      data: currentData
    });
  } catch (error) {
    console.error('保存数据失败:', error);
    res.status(500).json({
      success: false,
      message: '保存数据失败: ' + error.message
    });
  }
});

// 获取配置
app.get('/api/config', (req, res) => {
  res.json({
    appName: '应用项目',
    version: '1.0.0',
    features: ['前端', '后端', 'API']
  });
});

// TODO API 接口

// 获取所有 TODO
app.get('/api/todos', async (req, res) => {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(fileData);
    res.json({
      success: true,
      todos: parsedData.todos || []
    });
  } catch (error) {
    console.error('读取 TODO 失败:', error);
    res.json({
      success: true,
      todos: []
    });
  }
});

// 创建新 TODO
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'TODO 内容不能为空'
      });
    }

    let currentData = { count: 0, items: [], todos: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
    } catch (error) {
      console.log('初始化新的数据文件');
    }

    if (!currentData.todos) {
      currentData.todos = [];
    }

    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    currentData.todos.push(newTodo);
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');

    res.json({
      success: true,
      todo: newTodo
    });
  } catch (error) {
    console.error('创建 TODO 失败:', error);
    res.status(500).json({
      success: false,
      message: '创建 TODO 失败: ' + error.message
    });
  }
});

// 更新 TODO
app.put('/api/todos/:id', async (req, res) => {
  try {
    const todoId = parseInt(req.params.id);
    const { completed, text } = req.body;

    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const currentData = JSON.parse(fileData);

    if (!currentData.todos) {
      return res.status(404).json({
        success: false,
        message: 'TODO 不存在'
      });
    }

    const todoIndex = currentData.todos.findIndex(t => t.id === todoId);
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'TODO 不存在'
      });
    }

    if (completed !== undefined) {
      currentData.todos[todoIndex].completed = completed;
    }
    if (text !== undefined && text.trim()) {
      currentData.todos[todoIndex].text = text.trim();
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');

    res.json({
      success: true,
      todo: currentData.todos[todoIndex]
    });
  } catch (error) {
    console.error('更新 TODO 失败:', error);
    res.status(500).json({
      success: false,
      message: '更新 TODO 失败: ' + error.message
    });
  }
});

// 删除 TODO
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const todoId = parseInt(req.params.id);

    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const currentData = JSON.parse(fileData);

    if (!currentData.todos) {
      return res.status(404).json({
        success: false,
        message: 'TODO 不存在'
      });
    }

    const todoIndex = currentData.todos.findIndex(t => t.id === todoId);
    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'TODO 不存在'
      });
    }

    currentData.todos.splice(todoIndex, 1);
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');

    res.json({
      success: true,
      message: 'TODO 已删除'
    });
  } catch (error) {
    console.error('删除 TODO 失败:', error);
    res.status(500).json({
      success: false,
      message: '删除 TODO 失败: ' + error.message
    });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到资源',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`应用项目后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`数据文件路径: ${DATA_FILE}`);
  console.log(`__dirname: ${__dirname}`);
});

