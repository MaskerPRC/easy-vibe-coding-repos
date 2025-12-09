import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储排行榜数据（重启后数据会丢失）
let leaderboardData = [];

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取排行榜
app.get('/api/leaderboard', (req, res) => {
  try {
    // 返回按分数降序排列的前10名
    const topScores = leaderboardData
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json(topScores);
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({
      error: '获取排行榜失败',
      message: error.message
    });
  }
});

// 提交分数
app.post('/api/leaderboard', (req, res) => {
  try {
    const { name, score } = req.body;

    // 验证数据
    if (!name || typeof score !== 'number') {
      return res.status(400).json({
        error: '无效的数据',
        message: '请提供有效的姓名和分数'
      });
    }

    // 添加到排行榜
    leaderboardData.push({
      name,
      score,
      timestamp: new Date().toISOString()
    });

    // 保持排行榜只保存最近的100条记录
    if (leaderboardData.length > 100) {
      leaderboardData = leaderboardData
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);
    }

    res.json({
      success: true,
      message: '分数已提交',
      rank: leaderboardData.filter(entry => entry.score > score).length + 1
    });
  } catch (error) {
    console.error('提交分数失败:', error);
    res.status(500).json({
      error: '提交分数失败',
      message: error.message
    });
  }
});

// 清空排行榜（可选的管理功能）
app.delete('/api/leaderboard', (req, res) => {
  try {
    leaderboardData = [];
    res.json({
      success: true,
      message: '排行榜已清空'
    });
  } catch (error) {
    console.error('清空排行榜失败:', error);
    res.status(500).json({
      error: '清空排行榜失败',
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
  console.log(`排行榜API: http://localhost:${PORT}/api/leaderboard`);
  console.log('注意：使用内存存储，重启后数据会丢失');
});
