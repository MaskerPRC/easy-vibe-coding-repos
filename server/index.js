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

// 读取数据文件的辅助函数
async function readData() {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('读取数据失败:', error);
    return {
      destinations: [],
      jobTypes: [],
      messages: []
    };
  }
}

// 写入数据文件的辅助函数
async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('写入数据失败:', error);
    return false;
  }
}

// API 路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取所有数字游民数据
app.get('/api/data', async (req, res) => {
  try {
    const data = await readData();
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取数据失败: ' + error.message
    });
  }
});

// 获取所有目的地
app.get('/api/destinations', async (req, res) => {
  try {
    const data = await readData();
    res.json({
      success: true,
      data: data.destinations || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取目的地失败: ' + error.message
    });
  }
});

// 获取所有工作类型
app.get('/api/job-types', async (req, res) => {
  try {
    const data = await readData();
    res.json({
      success: true,
      data: data.jobTypes || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取工作类型失败: ' + error.message
    });
  }
});

// 获取所有留言
app.get('/api/messages', async (req, res) => {
  try {
    const data = await readData();
    res.json({
      success: true,
      data: data.messages || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取留言失败: ' + error.message
    });
  }
});

// 添加新留言
app.post('/api/messages', async (req, res) => {
  try {
    const { username, content } = req.body;

    if (!username || !content) {
      return res.status(400).json({
        success: false,
        message: '用户名和内容不能为空'
      });
    }

    const data = await readData();
    const newMessage = {
      id: (data.messages.length > 0 ? Math.max(...data.messages.map(m => m.id)) + 1 : 1),
      username: username,
      content: content,
      timestamp: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    data.messages.push(newMessage);
    const saved = await writeData(data);

    if (saved) {
      res.json({
        success: true,
        message: '留言添加成功',
        data: newMessage
      });
    } else {
      res.status(500).json({
        success: false,
        message: '保存留言失败'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加留言失败: ' + error.message
    });
  }
});

// 获取配置
app.get('/api/config', (req, res) => {
  res.json({
    appName: '数字游民生活指南',
    version: '1.0.0',
    features: ['目的地推荐', '工作类型', '社区留言']
  });
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
  console.log(`数字游民生活指南后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`数据文件路径: ${DATA_FILE}`);
});
