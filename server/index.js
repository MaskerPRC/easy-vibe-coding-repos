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
