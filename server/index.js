import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import schedule from 'node-schedule';

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

// 获取服务器配置信息
app.get('/api/server-info', (req, res) => {
  const os = require('os');

  res.json({
    server: {
      platform: os.platform(),
      architecture: os.arch(),
      cpuCount: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || 'Unknown',
      totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
      hostname: os.hostname(),
      nodeVersion: process.version
    },
    application: {
      name: '应用项目',
      version: '1.0.0',
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      features: ['Vue 3 前端', 'Express 后端', 'RESTful API', '路由系统']
    },
    timestamp: new Date().toISOString()
  });
});

// Todo 相关 API
const TODOS_FILE = path.join(__dirname, 'todos.json');

// 搜索历史相关 API
const SEARCH_HISTORY_FILE = path.join(__dirname, 'search-history.json');

// WHV 素材相关 API
const WHV_MATERIALS_FILE = path.join(__dirname, 'whv-materials.json');

// 获取所有待办事项
app.get('/api/todos', async (req, res) => {
  try {
    const fileData = await fs.readFile(TODOS_FILE, 'utf-8');
    const todos = JSON.parse(fileData);
    res.json({
      success: true,
      todos
    });
  } catch (error) {
    // 文件不存在时返回空数组
    if (error.code === 'ENOENT') {
      res.json({
        success: true,
        todos: []
      });
    } else {
      console.error('读取 todos 失败:', error);
      res.status(500).json({
        success: false,
        message: '读取数据失败'
      });
    }
  }
});

// 保存待办事项
app.post('/api/todos', async (req, res) => {
  try {
    const { todos } = req.body;
    await fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), 'utf-8');
    res.json({
      success: true,
      message: '待办事项已保存'
    });
  } catch (error) {
    console.error('保存 todos 失败:', error);
    res.status(500).json({
      success: false,
      message: '保存数据失败'
    });
  }
});

// 获取搜索历史
app.get('/api/search-history', async (req, res) => {
  try {
    const fileData = await fs.readFile(SEARCH_HISTORY_FILE, 'utf-8');
    const history = JSON.parse(fileData);
    res.json(history);
  } catch (error) {
    // 文件不存在时返回空数组
    if (error.code === 'ENOENT') {
      res.json([]);
    } else {
      console.error('读取搜索历史失败:', error);
      res.status(500).json({
        success: false,
        message: '读取数据失败'
      });
    }
  }
});

// 保存搜索历史
app.post('/api/search-history', async (req, res) => {
  try {
    const history = req.body;
    await fs.writeFile(SEARCH_HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
    res.json({
      success: true,
      message: '搜索历史已保存'
    });
  } catch (error) {
    console.error('保存搜索历史失败:', error);
    res.status(500).json({
      success: false,
      message: '保存数据失败'
    });
  }
});

// WHV 素材搜集函数
async function collectWHVMaterials() {
  try {
    console.log('开始搜集WHV素材...');

    // 模拟从小红书搜集WHV相关内容
    // 实际应用中需要使用小红书API或爬虫
    const newMaterials = [
      {
        id: Date.now() + Math.random(),
        title: `WHV澳洲申请攻略 - ${new Date().toLocaleDateString()}`,
        content: '详细介绍WHV澳洲签证申请流程、所需材料和注意事项...',
        author: '小红书用户' + Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 200),
        tags: ['WHV', '澳洲', '打工度假', '签证攻略'],
        imageUrl: 'https://via.placeholder.com/400x300?text=WHV+Australia',
        sourceUrl: 'https://www.xiaohongshu.com/explore/...',
        collectedAt: new Date().toISOString()
      },
      {
        id: Date.now() + Math.random() + 1,
        title: `新西兰WHV生活分享 - ${new Date().toLocaleDateString()}`,
        content: '分享在新西兰打工度假的真实生活体验，工作、住宿、旅行...',
        author: '小红书用户' + Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 200),
        tags: ['WHV', '新西兰', '打工度假', '生活分享'],
        imageUrl: 'https://via.placeholder.com/400x300?text=WHV+New+Zealand',
        sourceUrl: 'https://www.xiaohongshu.com/explore/...',
        collectedAt: new Date().toISOString()
      },
      {
        id: Date.now() + Math.random() + 2,
        title: `日本WHV工作经验 - ${new Date().toLocaleDateString()}`,
        content: '在日本打工度假的工作经验分享，包括找工作技巧、工资待遇等...',
        author: '小红书用户' + Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 200),
        tags: ['WHV', '日本', '打工度假', '工作经验'],
        imageUrl: 'https://via.placeholder.com/400x300?text=WHV+Japan',
        sourceUrl: 'https://www.xiaohongshu.com/explore/...',
        collectedAt: new Date().toISOString()
      }
    ];

    // 读取现有数据
    let materials = [];
    try {
      const fileData = await fs.readFile(WHV_MATERIALS_FILE, 'utf-8');
      materials = JSON.parse(fileData);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('读取WHV素材文件失败:', error);
      }
    }

    // 添加新素材到列表开头
    materials = [...newMaterials, ...materials];

    // 限制最多保存500条记录
    if (materials.length > 500) {
      materials = materials.slice(0, 500);
    }

    // 保存更新后的数据
    await fs.writeFile(WHV_MATERIALS_FILE, JSON.stringify(materials, null, 2), 'utf-8');

    console.log(`成功搜集 ${newMaterials.length} 条WHV素材，总计 ${materials.length} 条`);

    return {
      success: true,
      collected: newMaterials.length,
      total: materials.length
    };
  } catch (error) {
    console.error('搜集WHV素材失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 获取WHV素材列表
app.get('/api/whv-materials', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const fileData = await fs.readFile(WHV_MATERIALS_FILE, 'utf-8');
    const allMaterials = JSON.parse(fileData);

    // 分页处理
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const materials = allMaterials.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: materials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allMaterials.length,
        totalPages: Math.ceil(allMaterials.length / limitNum)
      }
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      });
    } else {
      console.error('读取WHV素材失败:', error);
      res.status(500).json({
        success: false,
        message: '读取数据失败'
      });
    }
  }
});

// 手动触发搜集WHV素材
app.post('/api/whv-materials/collect', async (req, res) => {
  try {
    const result = await collectWHVMaterials();
    res.json(result);
  } catch (error) {
    console.error('手动搜集WHV素材失败:', error);
    res.status(500).json({
      success: false,
      message: '搜集失败: ' + error.message
    });
  }
});

// 获取搜集统计信息
app.get('/api/whv-materials/stats', async (req, res) => {
  try {
    const fileData = await fs.readFile(WHV_MATERIALS_FILE, 'utf-8');
    const materials = JSON.parse(fileData);

    // 按日期统计
    const dateStats = {};
    materials.forEach(item => {
      const date = new Date(item.collectedAt).toLocaleDateString();
      dateStats[date] = (dateStats[date] || 0) + 1;
    });

    // 按标签统计
    const tagStats = {};
    materials.forEach(item => {
      item.tags.forEach(tag => {
        tagStats[tag] = (tagStats[tag] || 0) + 1;
      });
    });

    res.json({
      success: true,
      stats: {
        total: materials.length,
        byDate: dateStats,
        byTag: tagStats,
        latestCollectedAt: materials[0]?.collectedAt || null
      }
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json({
        success: true,
        stats: {
          total: 0,
          byDate: {},
          byTag: {},
          latestCollectedAt: null
        }
      });
    } else {
      console.error('获取统计信息失败:', error);
      res.status(500).json({
        success: false,
        message: '获取统计失败'
      });
    }
  }
});

// 设置定时任务：每天凌晨2点自动搜集
const dailyCollectionJob = schedule.scheduleJob('0 2 * * *', async () => {
  console.log('定时任务开始：每日WHV素材搜集');
  await collectWHVMaterials();
});

console.log('WHV素材定时搜集任务已启动（每天凌晨2点执行）');

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

