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

// 读取模特数据
async function readModelsData() {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(fileData);
    return parsedData.models || [];
  } catch (error) {
    console.error('读取数据失败:', error);
    return [];
  }
}

// 保存模特数据
async function saveModelsData(models) {
  try {
    const data = { models };
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
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

// 获取所有模特列表
app.get('/api/models', async (req, res) => {
  try {
    const { category, gender } = req.query;
    let models = await readModelsData();

    // 根据分类筛选
    if (category && category !== 'all') {
      models = models.filter(model => model.category === category);
    }

    // 根据性别筛选
    if (gender && gender !== 'all') {
      models = models.filter(model => model.gender === gender);
    }

    res.json({
      success: true,
      data: models,
      total: models.length
    });
  } catch (error) {
    console.error('获取模特列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取模特列表失败',
      details: error.message
    });
  }
});

// 获取单个模特详情
app.get('/api/models/:id', async (req, res) => {
  try {
    const modelId = parseInt(req.params.id);
    const models = await readModelsData();
    const model = models.find(m => m.id === modelId);

    if (!model) {
      return res.status(404).json({
        success: false,
        error: '未找到该模特'
      });
    }

    res.json({
      success: true,
      data: model
    });
  } catch (error) {
    console.error('获取模特详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取模特详情失败',
      details: error.message
    });
  }
});

// 获取模特分类列表
app.get('/api/categories', async (req, res) => {
  try {
    const models = await readModelsData();
    const categories = [...new Set(models.map(m => m.category))];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取分类列表失败'
    });
  }
});

// 获取配置
app.get('/api/config', (req, res) => {
  res.json({
    appName: '模特管理平台',
    version: '1.0.0',
    features: ['模特展示', '分类筛选', '详情查看']
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
  console.log(`模特管理平台后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`数据文件路径: ${DATA_FILE}`);
});
