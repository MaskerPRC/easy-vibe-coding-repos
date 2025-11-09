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

// 随机生成网站描述和配置
app.get('/api/random-site', async (req, res) => {
  try {
    // 网站主题列表（排除不当内容）
    const themes = [
      '宠物收养平台',
      '环保生活指南',
      '美食菜谱分享',
      '旅游景点推荐',
      '读书笔记社区',
      '健康运动助手',
      '手工艺品展示',
      '音乐学习平台',
      '摄影作品欣赏',
      '科技新闻资讯',
      '在线教育课程',
      '园艺种植指南',
      '电影评论社区',
      '编程学习社区',
      '数字艺术画廊',
      '智能家居展示',
      '咖啡文化分享',
      '户外探险日志',
      '瑜伽冥想指导',
      '古诗词鉴赏'
    ];

    // 颜色方案
    const colorSchemes = [
      { primary: '#3498db', secondary: '#2ecc71', accent: '#e74c3c', bg: '#ecf0f1' },
      { primary: '#9b59b6', secondary: '#f39c12', accent: '#1abc9c', bg: '#f5f5f5' },
      { primary: '#e67e22', secondary: '#16a085', accent: '#c0392b', bg: '#fafafa' },
      { primary: '#34495e', secondary: '#95a5a6', accent: '#d35400', bg: '#fff' },
      { primary: '#27ae60', secondary: '#2980b9', accent: '#8e44ad', bg: '#f0f3f4' },
      { primary: '#e91e63', secondary: '#00bcd4', accent: '#ff9800', bg: '#fafafa' },
      { primary: '#607d8b', secondary: '#4caf50', accent: '#ff5722', bg: '#eceff1' }
    ];

    // 布局风格
    const layouts = ['卡片式', '列表式', '瀑布流', '网格式', '杂志式'];

    // 功能特性
    const features = [
      ['搜索功能', '用户评论', '分享按钮'],
      ['收藏功能', '在线聊天', '订阅通知'],
      ['标签分类', '评分系统', '推荐算法'],
      ['多语言支持', '深色模式', '无障碍访问'],
      ['数据可视化', '实时更新', '社交登录']
    ];

    // 随机选择
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const selectedColors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    const selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
    const selectedFeatures = features[Math.floor(Math.random() * features.length)];

    // 生成描述
    const description = `一个现代化的${selectedTheme}，采用${selectedLayout}布局，配色清新雅致。网站提供${selectedFeatures.join('、')}等核心功能，致力于为用户提供优质的浏览体验。`;

    // 生成网站配置
    const siteConfig = {
      theme: selectedTheme,
      description,
      colors: selectedColors,
      layout: selectedLayout,
      features: selectedFeatures,
      timestamp: new Date().toISOString(),
      // 生成随机内容
      content: generateContent(selectedTheme, selectedFeatures)
    };

    res.json({
      success: true,
      data: siteConfig
    });
  } catch (error) {
    console.error('生成随机网站失败:', error);
    res.status(500).json({
      success: false,
      message: '生成随机网站失败',
      error: error.message
    });
  }
});

// 生成网站内容的辅助函数
function generateContent(theme, features) {
  const contentTemplates = {
    title: `欢迎来到${theme}`,
    subtitle: `发现精彩，分享生活`,
    sections: [
      {
        title: '特色功能',
        items: features.map(feature => ({
          name: feature,
          description: `强大的${feature}，让您的体验更加完美`
        }))
      },
      {
        title: '精选推荐',
        items: Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          title: `精选内容 ${i + 1}`,
          description: '这是一段精彩的内容描述，吸引用户点击了解更多',
          image: `https://picsum.photos/400/300?random=${i + 1}`
        }))
      },
      {
        title: '用户评价',
        items: [
          { user: '用户A', comment: '非常好用，界面简洁美观！', rating: 5 },
          { user: '用户B', comment: '功能齐全，体验很棒！', rating: 5 },
          { user: '用户C', comment: '推荐大家使用，值得拥有！', rating: 4 }
        ]
      }
    ],
    footer: {
      copyright: `© ${new Date().getFullYear()} ${theme}. 保留所有权利。`,
      links: ['关于我们', '联系方式', '隐私政策', '使用条款']
    }
  };

  return contentTemplates;
}

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
