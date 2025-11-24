import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 内存存储 - 游戏最高分数据
let gameHighScore = 0;

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

// 获取最高分
app.get('/api/scores', (req, res) => {
  res.json({
    highScore: gameHighScore
  });
});

// 保存分数
app.post('/api/scores', (req, res) => {
  const { score } = req.body;

  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({
      error: '无效的分数',
      message: '分数必须是非负数'
    });
  }

  // 更新最高分
  if (score > gameHighScore) {
    gameHighScore = score;
    res.json({
      success: true,
      highScore: gameHighScore,
      isNewRecord: true,
      message: '恭喜!新纪录!'
    });
  } else {
    res.json({
      success: true,
      highScore: gameHighScore,
      isNewRecord: false,
      message: '分数已保存'
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
});

