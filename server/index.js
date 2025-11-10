import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import fsSync from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SPY_DATA_FILE = path.join(__dirname, 'spy-data.json');

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// 安全中间件：禁用 iframe 嵌入
app.use((req, res, next) => {
  // 防止页面被嵌入到 iframe 中
  res.setHeader('X-Frame-Options', 'DENY');
  // CSP 策略：禁止任何来源将此页面嵌入到 frame/iframe 中
  res.setHeader('Content-Security-Policy', "frame-ancestors 'none'; frame-src 'none'");
  next();
});

// Spy记录存储（内存）
let spyRecords = [];
const MAX_RECORDS = 10000;

// 加载spy数据
const loadSpyData = async () => {
  try {
    if (fsSync.existsSync(SPY_DATA_FILE)) {
      const data = await fs.readFile(SPY_DATA_FILE, 'utf8');
      spyRecords = JSON.parse(data);
      console.log(`✅ 已加载 ${spyRecords.length} 条spy记录`);
    }
  } catch (error) {
    console.error('❌ 加载spy数据失败:', error.message);
    spyRecords = [];
  }
};

// 保存spy数据
const saveSpyData = async () => {
  try {
    await fs.writeFile(SPY_DATA_FILE, JSON.stringify(spyRecords, null, 2));
    console.log(`💾 已保存 ${spyRecords.length} 条spy记录`);
  } catch (error) {
    console.error('❌ 保存spy数据失败:', error.message);
  }
};

// 初始化时加载数据
loadSpyData();

// ==================== Spy API ====================

/**
 * 获取所有spy记录
 */
app.get('/api/spy/records', (req, res) => {
  const { type, limit = 1000 } = req.query;

  let records = spyRecords;

  // 按类型过滤
  if (type) {
    records = records.filter(r => r.type === type);
  }

  // 限制返回数量
  records = records.slice(0, parseInt(limit));

  res.json({
    success: true,
    data: records,
    total: spyRecords.length
  });
});

/**
 * 添加spy记录
 */
app.post('/api/spy/records', (req, res) => {
  try {
    const record = req.body;

    // 验证记录
    if (!record.type || !record.method) {
      return res.status(400).json({
        success: false,
        message: '缺少必要字段: type, method'
      });
    }

    // 添加记录
    record.id = Date.now() + Math.random();
    record.timestamp = record.timestamp || new Date().toISOString();

    spyRecords.unshift(record);

    // 限制记录数量
    if (spyRecords.length > MAX_RECORDS) {
      spyRecords = spyRecords.slice(0, MAX_RECORDS);
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 批量添加spy记录
 */
app.post('/api/spy/records/batch', (req, res) => {
  try {
    const records = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: '请求体必须是数组'
      });
    }

    // 添加记录
    records.forEach(record => {
      record.id = Date.now() + Math.random();
      record.timestamp = record.timestamp || new Date().toISOString();
      spyRecords.unshift(record);
    });

    // 限制记录数量
    if (spyRecords.length > MAX_RECORDS) {
      spyRecords = spyRecords.slice(0, MAX_RECORDS);
    }

    res.json({
      success: true,
      count: records.length,
      total: spyRecords.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 清空spy记录
 */
app.delete('/api/spy/records', async (req, res) => {
  try {
    spyRecords = [];
    await saveSpyData();

    res.json({
      success: true,
      message: '已清空所有记录'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 导出spy记录
 */
app.get('/api/spy/export', (req, res) => {
  try {
    const { format = 'json' } = req.query;

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=spy-records-${Date.now()}.json`);
      res.send(JSON.stringify(spyRecords, null, 2));
    } else {
      res.status(400).json({
        success: false,
        message: '不支持的格式'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 获取spy统计信息
 */
app.get('/api/spy/stats', (req, res) => {
  try {
    const stats = {
      total: spyRecords.length,
      byType: {},
      byMethod: {},
      recentActivity: []
    };

    // 按类型统计
    spyRecords.forEach(record => {
      stats.byType[record.type] = (stats.byType[record.type] || 0) + 1;
      stats.byMethod[record.method] = (stats.byMethod[record.method] || 0) + 1;
    });

    // 最近活动（最近10条）
    stats.recentActivity = spyRecords.slice(0, 10);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * 保存spy记录到文件
 */
app.post('/api/spy/save', async (req, res) => {
  try {
    await saveSpyData();
    res.json({
      success: true,
      message: '记录已保存到文件',
      count: spyRecords.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ==================== 其他API ====================

/**
 * 获取目标网站源码
 */
app.get('/api/fetch-site', async (req, res) => {
  try {
    const targetUrl = 'https://play.apexstone.ai/';

    // 使用 fetch 请求目标网站
    const response = await fetch(targetUrl);
    const html = await response.text();

    // 获取前100个字符
    const preview = html.substring(0, 100);

    res.json({
      success: true,
      preview: preview,
      url: targetUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '请求失败: ' + error.message
    });
  }
});

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'JSpspy Server is running',
    timestamp: new Date().toISOString(),
    records: spyRecords.length,
    port: PORT
  });
});

/**
 * 获取配置
 */
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    appName: 'JSpspy - JavaScript Spy Tool',
    version: '1.0.0',
    config: {
      maxRecords: MAX_RECORDS,
      features: [
        'fetch-hook',
        'xhr-hook',
        'localStorage-hook',
        'sessionStorage-hook',
        'cookie-hook',
        'console-hook',
        'setTimeout-hook',
        'setInterval-hook',
        'eval-hook',
        'Function-hook'
      ]
    }
  });
});

/**
 * 项目检测API - 综合检测项目健康状态
 */
app.get('/api/project/detect', (req, res) => {
  try {
    const detection = {
      success: true,
      timestamp: new Date().toISOString(),
      server: {
        status: 'running',
        port: PORT,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      },
      data: {
        totalRecords: spyRecords.length,
        maxRecords: MAX_RECORDS,
        dataFileExists: fsSync.existsSync(SPY_DATA_FILE),
        dataFilePath: SPY_DATA_FILE
      },
      features: {
        apiEndpoints: [
          '/api/health',
          '/api/config',
          '/api/spy/records',
          '/api/spy/stats',
          '/api/project/detect'
        ],
        hooks: [
          'fetch', 'xhr', 'localStorage', 'sessionStorage',
          'cookie', 'console', 'setTimeout', 'setInterval',
          'eval', 'Function'
        ]
      },
      health: {
        status: 'healthy',
        checks: {
          memoryUsage: process.memoryUsage().heapUsed < 500 * 1024 * 1024, // <500MB
          recordsLimit: spyRecords.length < MAX_RECORDS,
          dataStorage: fsSync.existsSync(SPY_DATA_FILE)
        }
      }
    };

    res.json(detection);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '项目检测失败',
      message: error.message
    });
  }
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
  console.log('🚀 JSpspy Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Current Records: ${spyRecords.length}/${MAX_RECORDS}`);
  console.log(`💾 Data File: ${SPY_DATA_FILE}`);
  console.log('='.repeat(60) + '\n');
});

// 定期保存数据（每5分钟）
setInterval(() => {
  if (spyRecords.length > 0) {
    saveSpyData();
  }
}, 5 * 60 * 1000);

// 进程退出时保存数据
process.on('SIGINT', async () => {
  console.log('\n💾 正在保存数据...');
  await saveSpyData();
  console.log('✅ 数据已保存，服务器关闭');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n💾 正在保存数据...');
  await saveSpyData();
  console.log('✅ 数据已保存，服务器关闭');
  process.exit(0);
});
