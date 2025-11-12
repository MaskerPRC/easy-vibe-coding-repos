import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储的AI编程失败案例数据
const failureCases = [
  {
    id: 1,
    title: '充满AI味道的产品介绍文案',
    prompt: '写一个产品介绍页面，突出我们的技术优势',
    failureReason: '过度使用"赋能"、"生态"、"闭环"等AI常用词汇，完全不符合人类真实写作习惯',
    category: 'ai-taste',
    categoryLabel: 'AI味道',
    demoType: 'text',
    demoData: {
      content: '欢迎体验我们的革命性产品！我们致力于为企业赋能，打造完整的生态闭环，通过底层逻辑的重构，实现降本增效的颗粒度管理。我们的核心竞争力在于深度赋能B端客户，打通全链路数字化转型，助力企业实现指数级增长。让我们一起拥抱数字化浪潮，共创美好未来！',
      highlightWords: ['赋能', '生态闭环', '底层逻辑', '降本增效', '颗粒度', '全链路', '指数级增长', '数字化浪潮']
    }
  },
  {
    id: 2,
    title: '过度使用渐变和阴影的AI审美',
    prompt: '设计一个现代化的按钮组件，要求美观、有科技感',
    failureReason: 'AI倾向于堆砌渐变色、发光效果、大圆角，导致视觉过于花哨，缺乏实用性',
    category: 'ai-taste',
    categoryLabel: 'AI味道',
    demoType: 'button',
    demoData: {
      text: '立即体验',
      style: 'ai-style'
    }
  },
  {
    id: 3,
    title: '机械理解"删除空格"需求',
    prompt: '实现一个功能：删除文本中的所有空格',
    failureReason: 'AI机械地删除了所有空格，包括单词之间的空格，导致文本完全不可读',
    category: 'mechanical',
    categoryLabel: '机械理解',
    demoType: 'text-processor',
    demoData: {
      original: 'Hello World! This is a test message with spaces.',
      processed: 'HelloWorld!Thisisatestmessagewithspaces.'
    }
  },
  {
    id: 4,
    title: '缺乏现实体验的表单验证',
    prompt: '创建一个注册表单，包含姓名、身份证号、手机号等字段',
    failureReason: 'AI设计的验证规则完全脱离现实，比如要求姓名必须2-4个字（外国人呢？），身份证号固定18位（15位老身份证呢？），手机号必须1开头（国际号码呢？）',
    category: 'reality',
    categoryLabel: '缺乏现实体验',
    demoType: 'form',
    demoData: {
      fields: [
        { label: '姓名', rule: '必须2-4个汉字', examples: ['张三 ✓', 'Mike ✗', '欧阳复姓名 ✗'] },
        { label: '身份证号', rule: '必须恰好18位数字', examples: ['110101199001011234 ✓', '老15位身份证 ✗'] },
        { label: '手机号', rule: '必须11位且1开头', examples: ['13800138000 ✓', '+86开头 ✗', '国际号码 ✗'] }
      ]
    }
  },
  {
    id: 5,
    title: '过度友好的错误提示',
    prompt: '实现错误提示功能，要求友好、温馨',
    failureReason: 'AI把错误提示写得过于冗长和"温暖"，在严肃场景下显得不专业且啰嗦',
    category: 'ai-taste',
    categoryLabel: 'AI味道',
    demoType: 'error',
    demoData: {
      errors: [
        {
          scenario: '登录密码错误',
          aiVersion: '亲爱的用户，非常抱歉地通知您，您输入的密码似乎不太正确呢~请您再仔细回忆一下，然后重新尝试输入哦！我们相信您一定能够成功的！如果您忘记了密码，也不要担心，点击下方的"忘记密码"按钮，我们会帮助您找回的💕',
          normalVersion: '密码错误'
        },
        {
          scenario: '网络连接失败',
          aiVersion: '哎呀！看起来网络小精灵跑丢了呢~请您检查一下您的网络连接，确保WiFi或移动数据处于开启状态。不要着急，稍等片刻再试一次，相信很快就能恢复正常的！',
          normalVersion: '网络连接失败，请检查网络设置'
        }
      ]
    }
  },
  {
    id: 6,
    title: '字面理解"用户友好"的日期选择器',
    prompt: '实现一个用户友好的日期选择器',
    failureReason: 'AI机械地把所有可能的选项都展示出来，导致界面极其复杂难用',
    category: 'mechanical',
    categoryLabel: '机械理解',
    demoType: 'date-picker',
    demoData: {
      description: '提供了年、月、日、时、分、秒、毫秒的选择，并且每个都是独立的下拉框',
      fields: ['年(1900-2100)', '月(1-12)', '日(1-31)', '时(0-23)', '分(0-59)', '秒(0-59)', '毫秒(0-999)']
    }
  },
  {
    id: 7,
    title: '不理解上下文的智能回复',
    prompt: '实现一个客服智能回复功能',
    failureReason: 'AI给出的回复虽然语法正确，但完全不理解上下文，答非所问',
    category: 'reality',
    categoryLabel: '缺乏现实体验',
    demoType: 'chat',
    demoData: {
      conversations: [
        { user: '我的订单什么时候发货？', ai: '感谢您的咨询！我们提供多种支付方式，包括微信、支付宝和银行卡。' },
        { user: '可以退款吗？', ai: '我们的产品质量上乘，采用进口原材料制作，欢迎购买！' },
        { user: '你在说什么？', ai: '非常感谢您的反馈，我们会继续努力改进服务质量！' }
      ]
    }
  },
  {
    id: 8,
    title: 'AI生成的"随机"用户头像',
    prompt: '生成一组多样化的用户头像',
    failureReason: 'AI生成的头像都有明显的AI特征：过于完美的对称、诡异的光影、相似的构图',
    category: 'ai-taste',
    categoryLabel: 'AI味道',
    demoType: 'avatars',
    demoData: {
      description: '所有头像都是居中、正面、完美光照的构图，缺乏真实照片的随意性和多样性',
      features: ['完美的面部对称', '统一的柔和光照', '相似的微笑角度', '过于干净的背景', '缺少真实照片的"不完美"']
    }
  }
];

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取所有失败案例列表
app.get('/api/cases', (req, res) => {
  const { category } = req.query;

  let cases = failureCases;

  // 如果指定了分类，进行筛选
  if (category && category !== 'all') {
    cases = failureCases.filter(c => c.category === category);
  }

  // 返回列表视图（不包含详细的演示数据）
  const caseList = cases.map(c => ({
    id: c.id,
    title: c.title,
    prompt: c.prompt,
    failureReason: c.failureReason,
    category: c.category,
    categoryLabel: c.categoryLabel
  }));

  res.json({
    success: true,
    data: caseList,
    total: caseList.length
  });
});

// 获取单个案例详情
app.get('/api/cases/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const caseDetail = failureCases.find(c => c.id === id);

  if (!caseDetail) {
    return res.status(404).json({
      success: false,
      error: '案例不存在'
    });
  }

  res.json({
    success: true,
    data: caseDetail
  });
});

// 获取分类统计
app.get('/api/stats', (req, res) => {
  const stats = {
    total: failureCases.length,
    byCategory: {
      'ai-taste': failureCases.filter(c => c.category === 'ai-taste').length,
      'mechanical': failureCases.filter(c => c.category === 'mechanical').length,
      'reality': failureCases.filter(c => c.category === 'reality').length
    }
  };

  res.json({
    success: true,
    data: stats
  });
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
  console.log(`案例数据已加载: ${failureCases.length} 个失败案例`);
});

