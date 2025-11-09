import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取 V2EX 热门主题
app.get('/api/v2ex/hot', async (req, res) => {
  try {
    const response = await fetch('https://www.v2ex.com/api/topics/hot.json');

    if (!response.ok) {
      throw new Error(`V2EX API 返回错误: ${response.status}`);
    }

    const data = await response.json();

    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取 V2EX 热门主题失败:', error);
    res.status(500).json({
      success: false,
      message: '获取 V2EX 热门主题失败',
      error: error.message
    });
  }
});

// 获取 V2EX 最新主题
app.get('/api/v2ex/latest', async (req, res) => {
  try {
    const response = await fetch('https://www.v2ex.com/api/topics/latest.json');

    if (!response.ok) {
      throw new Error(`V2EX API 返回错误: ${response.status}`);
    }

    const data = await response.json();

    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取 V2EX 最新主题失败:', error);
    res.status(500).json({
      success: false,
      message: '获取 V2EX 最新主题失败',
      error: error.message
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
  console.log(`V2EX 热门贴后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
});
