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

// 用户注册接口
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '请填写完整的注册信息'
      });
    }

    // 验证密码长度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为6位'
      });
    }

    res.json({
      success: true,
      message: '注册成功',
      data: {
        username,
        email,
        id: Math.random().toString(36).substr(2, 9)
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: error.message
    });
  }
});

// 用户登录接口
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请填写完整的登录信息'
      });
    }

    res.json({
      success: true,
      message: '登录成功',
      data: {
        email,
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
        username: '测试用户'
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message
    });
  }
});

// 获取产品列表
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;

    const allProducts = [
      {
        id: 1,
        name: '智能办公套件',
        price: 99,
        category: 'software',
        description: '提升团队协作效率的一站式办公解决方案'
      },
      {
        id: 2,
        name: '云存储服务',
        price: 49,
        category: 'service',
        description: '安全可靠的企业级云存储服务'
      }
    ];

    const products = category && category !== 'all'
      ? allProducts.filter(p => p.category === category)
      : allProducts;

    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error('获取产品列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取产品列表失败',
      error: error.message
    });
  }
});

// 获取博客文章列表
app.get('/api/blog/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allPosts = [
      {
        id: 1,
        title: 'Vue 3 组合式 API 完全指南',
        author: '张三',
        date: '2024-01-15',
        category: '前端开发',
        views: 1200
      },
      {
        id: 2,
        title: 'Node.js 性能优化实战',
        author: '李四',
        date: '2024-01-12',
        category: '后端开发',
        views: 980
      }
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: allPosts.length,
        totalPages: Math.ceil(allPosts.length / limit)
      }
    });
  } catch (error) {
    console.error('获取博客文章失败:', error);
    res.status(500).json({
      success: false,
      message: '获取博客文章失败',
      error: error.message
    });
  }
});

// 联系表单提交
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: '请填写完整的联系信息'
      });
    }

    console.log('收到联系表单:', { name, email, message });

    res.json({
      success: true,
      message: '感谢您的留言，我们会尽快与您联系！'
    });
  } catch (error) {
    console.error('提交联系表单失败:', error);
    res.status(500).json({
      success: false,
      message: '提交失败',
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
