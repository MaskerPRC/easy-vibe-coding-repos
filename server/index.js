import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 在内存中存储API key（每次启动时生成新的）
let apiKey = null;

// 生成随机API key
function generateApiKey() {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `app_${timestamp}_${randomStr}`;
}

// 初始化API key
if (!apiKey) {
  apiKey = generateApiKey();
}

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取base64加密后的API key
app.get('/api/apikey', (req, res) => {
  try {
    // 将API key转换为base64编码
    const base64ApiKey = Buffer.from(apiKey).toString('base64');

    res.json({
      success: true,
      data: {
        originalKey: apiKey,
        base64Key: base64ApiKey,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '生成API key失败',
      message: error.message
    });
  }
});

// 重新生成API key
app.post('/api/apikey/regenerate', (req, res) => {
  try {
    apiKey = generateApiKey();
    const base64ApiKey = Buffer.from(apiKey).toString('base64');

    res.json({
      success: true,
      data: {
        originalKey: apiKey,
        base64Key: base64ApiKey,
        generatedAt: new Date().toISOString()
      },
      message: 'API key已重新生成'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '重新生成API key失败',
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

