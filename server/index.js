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

// 获取 SpaceX 下次发射信息
app.get('/api/spacex/next-launch', async (req, res) => {
  try {
    const response = await fetch('https://api.spacexdata.com/v5/launches/next');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('获取 SpaceX 发射数据失败:', error);
    res.status(500).json({
      error: '获取发射数据失败',
      message: error.message
    });
  }
});

// 获取天气预报（使用 Open-Meteo API，以肯尼迪航天中心为例：纬度 28.5728，经度 -80.6489）
app.get('/api/weather', async (req, res) => {
  try {
    // 默认使用肯尼迪航天中心的坐标
    const latitude = req.query.lat || 28.5728;
    const longitude = req.query.lon || -80.6489;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=America/New_York`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('获取天气数据失败:', error);
    res.status(500).json({
      error: '获取天气数据失败',
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
});

