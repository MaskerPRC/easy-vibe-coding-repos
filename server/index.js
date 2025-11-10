import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

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

// 获取系统平台信息
app.get('/api/system/platform', (req, res) => {
  try {
    const platformInfo = {
      platform: os.platform(),
      type: os.type(),
      release: os.release(),
      arch: os.arch(),
      hostname: os.hostname(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length
    };
    res.json({
      success: true,
      data: platformInfo
    });
  } catch (error) {
    console.error('获取系统信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统信息失败: ' + error.message
    });
  }
});

// 获取进程内存使用信息
app.get('/api/system/memory', (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    // 将字节转换为 MB 以便阅读
    const memoryInfo = {
      rss: {
        bytes: memoryUsage.rss,
        mb: (memoryUsage.rss / 1024 / 1024).toFixed(2),
        description: '常驻集大小(RSS) - 进程占用的主内存空间'
      },
      heapTotal: {
        bytes: memoryUsage.heapTotal,
        mb: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
        description: '堆总大小 - V8分配的总内存'
      },
      heapUsed: {
        bytes: memoryUsage.heapUsed,
        mb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
        description: '已使用的堆内存'
      },
      external: {
        bytes: memoryUsage.external,
        mb: (memoryUsage.external / 1024 / 1024).toFixed(2),
        description: 'C++对象绑定到JavaScript对象的内存'
      },
      arrayBuffers: {
        bytes: memoryUsage.arrayBuffers,
        mb: (memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2),
        description: 'ArrayBuffers和SharedArrayBuffers的内存'
      }
    };
    res.json({
      success: true,
      data: memoryInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取内存信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取内存信息失败: ' + error.message
    });
  }
});

// Ping google.com
app.get('/api/ping', async (req, res) => {
  try {
    // 根据操作系统选择合适的 ping 命令
    const platform = os.platform();
    let pingCommand;

    if (platform === 'win32') {
      // Windows 系统
      pingCommand = 'ping -n 4 google.com';
    } else {
      // Linux/Mac 系统
      pingCommand = 'ping -c 4 google.com';
    }

    console.log('执行 ping 命令:', pingCommand);
    const { stdout, stderr } = await execPromise(pingCommand);

    res.json({
      success: true,
      data: {
        output: stdout,
        error: stderr,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Ping 失败:', error);
    res.json({
      success: false,
      message: 'Ping google.com 失败',
      data: {
        output: error.stdout || '',
        error: error.stderr || error.message,
        timestamp: new Date().toISOString()
      }
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

