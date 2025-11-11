import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 名言数据（内存存储）
const quotes = [
  { id: 1, text: '生命的意义在于不断探索和成长', author: '佚名' },
  { id: 2, text: '唯一不变的是变化本身', author: '赫拉克利特' },
  { id: 3, text: '认识你自己', author: '苏格拉底' },
  { id: 4, text: '我思故我在', author: '笛卡尔' },
  { id: 5, text: '存在先于本质', author: '萨特' },
  { id: 6, text: '人生天地之间，若白驹过隙，忽然而已', author: '庄子' },
  { id: 7, text: '上善若水，水善利万物而不争', author: '老子' },
  { id: 8, text: '未经审视的人生不值得过', author: '苏格拉底' },
  { id: 9, text: '人是万物的尺度', author: '普罗泰戈拉' },
  { id: 10, text: '凡是存在的，都是合理的', author: '黑格尔' }
];

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取每日名言
app.get('/api/quotes/daily', (req, res) => {
  // 基于日期获取名言，确保每天返回相同的名言
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const quoteIndex = dayOfYear % quotes.length;

  res.json({
    success: true,
    quote: quotes[quoteIndex]
  });
});

// 获取所有名言
app.get('/api/quotes', (req, res) => {
  res.json({
    success: true,
    quotes: quotes,
    total: quotes.length
  });
});

// 获取随机名言
app.get('/api/quotes/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  res.json({
    success: true,
    quote: quotes[randomIndex]
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
  console.log(`应用项目后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
});

