import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 3002; // 后端端口 3002，前端 5173

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Google 搜索函数
async function searchGoogle(query, page = 1) {
  return new Promise((resolve, reject) => {
    const start = (page - 1) * 10;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&start=${start}&num=10`;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    };

    https.get(searchUrl, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const results = parseGoogleResults(data);
          resolve(results);
        } catch (error) {
          console.error('解析搜索结果失败:', error);
          reject(error);
        }
      });
    }).on('error', (error) => {
      console.error('搜索请求失败:', error);
      reject(error);
    });
  });
}

// 简单的 HTML 解析函数
function parseGoogleResults(html) {
  const results = [];

  // 简化的正则表达式匹配搜索结果
  // 这是一个基本实现，实际使用中可能需要更复杂的解析
  const titleRegex = /<h3[^>]*>([^<]+)<\/h3>/g;
  const urlRegex = /<a[^>]+href="\/url\?q=([^&"]+)&/g;
  const snippetRegex = /<div[^>]*data-sncf="[^"]*"[^>]*>([^<]+)<\/div>/g;

  // 提取标题
  const titles = [];
  let titleMatch;
  while ((titleMatch = titleRegex.exec(html)) !== null) {
    titles.push(titleMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
  }

  // 提取 URL
  const urls = [];
  let urlMatch;
  while ((urlMatch = urlRegex.exec(html)) !== null) {
    const url = decodeURIComponent(urlMatch[1]);
    if (url.startsWith('http')) {
      urls.push(url);
    }
  }

  // 提取摘要
  const snippets = [];
  let snippetMatch;
  while ((snippetMatch = snippetRegex.exec(html)) !== null) {
    snippets.push(snippetMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
  }

  // 组合结果
  const maxLength = Math.min(titles.length, urls.length);
  for (let i = 0; i < maxLength && i < 10; i++) {
    if (urls[i]) {
      try {
        const urlObj = new URL(urls[i]);
        results.push({
          title: titles[i] || '无标题',
          link: urls[i],
          displayLink: urlObj.hostname,
          snippet: snippets[i] || '无摘要'
        });
      } catch (e) {
        // 跳过无效的 URL
      }
    }
  }

  // 如果没有解析到结果，返回模拟数据
  if (results.length === 0) {
    return [
      {
        title: '搜索结果示例 1',
        link: 'https://www.example.com/1',
        displayLink: 'www.example.com',
        snippet: '这是搜索结果的摘要内容。由于网络限制或解析问题，当前显示的是模拟数据。'
      },
      {
        title: '搜索结果示例 2',
        link: 'https://www.example.com/2',
        displayLink: 'www.example.com',
        snippet: '这是第二个搜索结果的摘要。实际环境中会显示真实的 Google 搜索结果。'
      },
      {
        title: '搜索结果示例 3',
        link: 'https://www.example.com/3',
        displayLink: 'www.example.com',
        snippet: '第三个搜索结果示例。您可以点击链接查看详细内容。'
      }
    ];
  }

  return results;
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

// Google 搜索 API
app.post('/api/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.body;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: '请提供搜索关键词'
      });
    }

    console.log(`搜索请求: "${query}", 页码: ${page}`);

    const results = await searchGoogle(query.trim(), page);

    res.json({
      success: true,
      results: results,
      totalResults: results.length > 0 ? 1000000 : 0,
      hasMore: results.length >= 10,
      page: page,
      query: query
    });
  } catch (error) {
    console.error('搜索失败:', error);
    res.status(500).json({
      success: false,
      error: '搜索服务暂时不可用，请稍后再试',
      details: error.message
    });
  }
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

