import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

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

// IP信息查询接口
app.get('/api/ip-info', async (req, res) => {
  try {
    const { ip } = req.query;

    // 使用免费的IP查询API：ip-api.com
    // 如果没有提供IP地址，则查询请求者的IP
    const targetIP = ip || '';
    const apiUrl = targetIP
      ? `http://ip-api.com/json/${targetIP}?lang=zh-CN`
      : `http://ip-api.com/json/?lang=zh-CN`;

    // 使用axios请求IP信息
    const response = await axios.get(apiUrl);
    const data = response.data;

    // 检查查询状态
    if (data.status === 'fail') {
      return res.json({
        success: false,
        message: data.message || 'IP地址无效或查询失败'
      });
    }

    // 返回成功结果
    res.json({
      success: true,
      data: {
        query: data.query,
        country: data.country,
        regionName: data.regionName,
        city: data.city,
        isp: data.isp,
        org: data.org,
        as: data.as,
        timezone: data.timezone,
        lat: data.lat,
        lon: data.lon
      }
    });
  } catch (error) {
    console.error('IP查询错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器查询失败，请稍后再试'
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

