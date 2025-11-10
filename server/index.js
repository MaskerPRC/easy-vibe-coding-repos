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

// 猫图数据存储文件
const CATS_FILE = path.join(__dirname, 'cats-data.json');

// 初始化猫图数据
const initCatsData = async () => {
  try {
    await fs.access(CATS_FILE);
  } catch {
    // 文件不存在，创建初始数据
    const initialCats = [
      { id: 1, url: 'https://cataas.com/cat/1', breed: '橘猫', likes: 42, liked: false },
      { id: 2, url: 'https://cataas.com/cat/2', breed: '英短', likes: 38, liked: false },
      { id: 3, url: 'https://cataas.com/cat/3', breed: '暹罗猫', likes: 55, liked: false },
      { id: 4, url: 'https://cataas.com/cat/4', breed: '布偶猫', likes: 68, liked: false },
      { id: 5, url: 'https://cataas.com/cat/5', breed: '波斯猫', likes: 45, liked: false },
      { id: 6, url: 'https://cataas.com/cat/6', breed: '美短', likes: 52, liked: false },
      { id: 7, url: 'https://cataas.com/cat/cute', breed: '可爱猫', likes: 88, liked: false },
      { id: 8, url: 'https://cataas.com/cat/says/hello', breed: '打招呼', likes: 73, liked: false },
      { id: 9, url: 'https://cataas.com/cat/cute/says/喵', breed: '说喵', likes: 91, liked: false },
      { id: 10, url: 'https://cataas.com/cat/gif', breed: '动态猫', likes: 105, liked: false },
      { id: 11, url: 'https://cataas.com/cat/11', breed: '小猫咪', likes: 62, liked: false },
      { id: 12, url: 'https://cataas.com/cat/12', breed: '大橘', likes: 77, liked: false }
    ];
    await fs.writeFile(CATS_FILE, JSON.stringify(initialCats, null, 2), 'utf-8');
  }
};

// 初始化猫图数据
initCatsData();

// 获取猫图列表
app.get('/api/cats', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;

    const fileData = await fs.readFile(CATS_FILE, 'utf-8');
    let allCats = JSON.parse(fileData);

    // 随机打乱顺序（让"换一批"有效果）
    if (page === 1) {
      allCats = allCats.sort(() => Math.random() - 0.5);
    }

    // 分页
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const cats = allCats.slice(start, end);

    res.json({
      cats,
      page,
      pageSize,
      total: allCats.length
    });
  } catch (error) {
    console.error('获取猫图失败:', error);
    res.status(500).json({
      error: '获取猫图失败',
      message: error.message
    });
  }
});

// 点赞猫图
app.post('/api/cats/like', async (req, res) => {
  try {
    const { catId, liked } = req.body;

    const fileData = await fs.readFile(CATS_FILE, 'utf-8');
    const cats = JSON.parse(fileData);

    const cat = cats.find(c => c.id === catId);
    if (cat) {
      cat.liked = liked;
      cat.likes = Math.max(0, cat.likes + (liked ? 1 : -1));

      await fs.writeFile(CATS_FILE, JSON.stringify(cats, null, 2), 'utf-8');

      res.json({
        success: true,
        cat
      });
    } else {
      res.status(404).json({
        success: false,
        message: '未找到该猫图'
      });
    }
  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({
      success: false,
      error: '点赞失败',
      message: error.message
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

