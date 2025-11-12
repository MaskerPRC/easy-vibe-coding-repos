import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ============ 内存数据存储 ============
// 所有分类
const categories = [
  '人工智能', '生产力', '营销', '开发者工具', '设计', 'SEO',
  '聊天机器人', '社交媒体', '内容创作', '无代码', '写作',
  '客户支持', '博客', '销售', '产品化服务', '网站构建器',
  '分析', 'iOS', '开发者API', '视频', '产品开发', 'Mac',
  '反馈工具', '教育', '电子邮件'
];

// 标签类型
const tagTypes = ['热门', '优惠', '新品', '推荐', ''];

// AI工具名称前缀和后缀，用于生成多样化的工具名
const toolPrefixes = [
  'AI', 'Smart', 'Auto', 'Neural', 'Deep', 'Quantum', 'Cognitive', 'Intelligent',
  'Fast', 'Quick', 'Pro', 'Super', 'Ultra', 'Mega', 'Hyper', 'Meta',
  'Digital', 'Cloud', 'Next', 'Future', 'Power', 'Easy', 'Simple', 'Swift'
];

const toolSuffixes = [
  'AI', 'Bot', 'Hub', 'Lab', 'Studio', 'Pro', 'Suite', 'Toolkit',
  'Genius', 'Master', 'Expert', 'Wizard', 'Assistant', 'Helper', 'Builder',
  'Creator', 'Generator', 'Optimizer', 'Analyzer', 'Manager', 'Platform',
  'Engine', 'System', 'Solution', 'Service', 'Tool', 'App', 'Forge'
];

const toolNames = [
  'ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Copilot', 'Jasper',
  'Copy.ai', 'Writesonic', 'Rytr', 'QuillBot', 'Grammarly', 'Notion AI',
  'Canva AI', 'Adobe Firefly', 'Runway ML', 'Synthesia', 'Descript',
  'Otter.ai', 'Fireflies.ai', 'Beautiful.ai', 'Tome', 'Gamma', 'Slides AI',
  'ChatPDF', 'Perplexity', 'You.com', 'Phind', 'Anthropic', 'Cohere',
  'HuggingFace', 'Stability AI', 'Replicate', 'LangChain', 'Pinecone',
  'Weaviate', 'Milvus', 'Chroma', 'LlamaIndex', 'Semantic Kernel'
];

// 功能描述模板
const descriptionTemplates = [
  '强大的AI工具，帮助您{功能}，提升{领域}效率',
  '智能{功能}平台，为{领域}专业人士量身定制',
  '使用先进AI技术实现{功能}，革新{领域}工作流程',
  '一站式{功能}解决方案，简化{领域}复杂任务',
  '基于深度学习的{功能}工具，优化{领域}体验',
  '自动化{功能}助手，加速{领域}项目交付',
  '智能{功能}系统，为{领域}提供创新解决方案',
  '企业级{功能}平台，助力{领域}数字化转型'
];

const functions = [
  '内容生成', '图像创作', '视频编辑', '代码开发', '数据分析',
  '文本写作', '语音转文字', '翻译', '总结', '对话交互',
  '设计辅助', '营销优化', 'SEO优化', '客户服务', '项目管理',
  '邮件撰写', '社交媒体管理', '演示文稿制作', '文档处理', '研究辅助'
];

const domains = [
  '工作', '创意', '业务', '团队协作', '内容营销',
  '开发', '设计', '研究', '教育', '电商',
  '客户关系', '销售', '运营', '产品管理', '数据科学'
];

// 知名域名列表
const knownDomains = [
  'openai.com', 'anthropic.com', 'midjourney.com', 'stability.ai', 'jasper.ai',
  'copy.ai', 'writesonic.com', 'rytr.me', 'quillbot.com', 'grammarly.com',
  'notion.so', 'canva.com', 'adobe.com', 'runwayml.com', 'synthesia.io',
  'descript.com', 'otter.ai', 'fireflies.ai', 'beautiful.ai', 'tome.app',
  'gamma.app', 'slidesai.io', 'chatpdf.com', 'perplexity.ai', 'you.com',
  'phind.com', 'cohere.ai', 'huggingface.co', 'replicate.com', 'langchain.com',
  'pinecone.io', 'weaviate.io', 'trychroma.com', 'llamaindex.ai'
];

// 生成随机工具名称
function generateToolName(index) {
  if (index < toolNames.length) {
    return toolNames[index];
  }

  const prefix = toolPrefixes[Math.floor(Math.random() * toolPrefixes.length)];
  const suffix = toolSuffixes[Math.floor(Math.random() * toolSuffixes.length)];
  const number = index > 100 ? ` ${Math.floor(Math.random() * 100)}` : '';

  // 随机决定使用哪种命名方式
  const nameType = Math.floor(Math.random() * 3);
  if (nameType === 0) return `${prefix}${suffix}${number}`;
  if (nameType === 1) return `${prefix} ${suffix}${number}`;
  return `${suffix} ${prefix}${number}`;
}

// 生成描述
function generateDescription() {
  const template = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];
  const func = functions[Math.floor(Math.random() * functions.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return template.replace('{功能}', func).replace('{领域}', domain);
}

// 生成网站URL
function generateWebsite(toolName, index) {
  if (index < knownDomains.length) {
    return `https://${knownDomains[index]}`;
  }

  // 生成域名
  const cleanName = toolName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
  const domains = ['.ai', '.io', '.com', '.co', '.app', '.tech'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `https://${cleanName}${domain}`;
}

// 生成1000个AI工具数据（存储在内存中）
const aiTools = [];
for (let i = 0; i < 1000; i++) {
  const name = generateToolName(i);
  const website = generateWebsite(name, i);
  const domain = website.replace('https://', '').replace('http://', '');

  const tool = {
    id: i + 1,
    name: name,
    description: generateDescription(),
    website: website,
    logo: `https://logo.clearbit.com/${domain}`,
    screenshot: `https://image.thum.io/get/width/400/crop/600/${website}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    tag: tagTypes[Math.floor(Math.random() * tagTypes.length)],
    popularity: Math.floor(Math.random() * 10000) + 100,
    featured: i < 6, // 前6个作为"今日产品"
    submittedAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
  };

  aiTools.push(tool);
}

// 用户提交的工具（存储在内存中）
const userSubmittedTools = [];

console.log(`已生成 ${aiTools.length} 个AI工具数据（存储在内存中）`);

// ============ API 路由 ============

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString(),
    toolsCount: aiTools.length
  });
});

// 获取所有分类
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

// 获取工具列表（支持分页、搜索、分类筛选、排序）
app.get('/api/tools', (req, res) => {
  try {
    const {
      page = 1,
      limit = 24,
      search = '',
      category = '',
      sort = 'popularity'
    } = req.query;

    let filteredTools = [...aiTools];

    // 搜索过滤
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTools = filteredTools.filter(tool =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower)
      );
    }

    // 分类过滤
    if (category && category !== '全部') {
      filteredTools = filteredTools.filter(tool => tool.category === category);
    }

    // 排序
    if (sort === 'popularity') {
      filteredTools.sort((a, b) => b.popularity - a.popularity);
    } else if (sort === 'newest') {
      filteredTools.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    } else if (sort === 'name') {
      filteredTools.sort((a, b) => a.name.localeCompare(b.name));
    }

    // 分页
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedTools = filteredTools.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        tools: paginatedTools,
        total: filteredTools.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredTools.length / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取工具列表失败',
      message: error.message
    });
  }
});

// 获取今日产品（特色工具）
app.get('/api/tools/featured', (req, res) => {
  try {
    const featuredTools = aiTools.filter(tool => tool.featured);
    res.json({
      success: true,
      data: featuredTools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取今日产品失败',
      message: error.message
    });
  }
});

// 获取单个工具详情
app.get('/api/tools/:id', (req, res) => {
  try {
    const toolId = parseInt(req.params.id);
    const tool = aiTools.find(t => t.id === toolId);

    if (!tool) {
      return res.status(404).json({
        success: false,
        error: '工具未找到'
      });
    }

    res.json({
      success: true,
      data: tool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取工具详情失败',
      message: error.message
    });
  }
});

// 用户提交新工具
app.post('/api/tools/submit', (req, res) => {
  try {
    const { name, description, website, category } = req.body;

    // 验证必填字段
    if (!name || !description || !website || !category) {
      return res.status(400).json({
        success: false,
        error: '请填写所有必填字段'
      });
    }

    // 验证分类是否有效
    if (!categories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: '无效的分类'
      });
    }

    // 生成新工具数据
    const domain = website.replace('https://', '').replace('http://', '');
    const newTool = {
      id: aiTools.length + userSubmittedTools.length + 1,
      name,
      description,
      website,
      logo: `https://logo.clearbit.com/${domain}`,
      screenshot: `https://image.thum.io/get/width/400/crop/600/${website}`,
      category,
      tag: '新品',
      popularity: 0,
      featured: false,
      submittedAt: new Date().toISOString(),
      userSubmitted: true
    };

    // 添加到用户提交列表（内存存储）
    userSubmittedTools.push(newTool);

    // 也添加到主工具列表
    aiTools.push(newTool);

    res.json({
      success: true,
      message: '工具提交成功',
      data: newTool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '提交工具失败',
      message: error.message
    });
  }
});

// 获取统计信息
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalTools: aiTools.length,
      totalCategories: categories.length,
      userSubmittedCount: userSubmittedTools.length,
      featuredCount: aiTools.filter(t => t.featured).length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取统计信息失败',
      message: error.message
    });
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    message: err.message
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '未找到资源',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`应用项目后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`已加载 ${aiTools.length} 个AI工具（内存存储）`);
});
