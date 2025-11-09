import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '服务正常运行',
    timestamp: new Date().toISOString()
  });
});

// 搜索接口（示例）
app.get('/api/search', (req, res) => {
  const keyword = req.query.keyword || '';
  res.json({
    success: true,
    keyword: keyword,
    message: '这是一个演示接口，实际搜索功能需要接入真实的搜索服务'
  });
});

app.listen(PORT, () => {
  console.log(`后端服务运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}/api/health`);
});
