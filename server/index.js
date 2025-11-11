import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储的新闻数据
const newsData = [
  {
    id: 1,
    title: '我国成功发射新一代人造卫星 科技实力再创新高',
    summary: '今日凌晨，我国在酒泉卫星发射中心成功发射新一代通信卫星，标志着我国航天科技水平迈上新台阶。',
    category: '科技',
    source: '新华社',
    time: '2小时前',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=240&fit=crop',
    isHot: true,
    views: 12580
  },
  {
    id: 2,
    title: '国内首个AI医疗诊断系统正式上线 准确率达95%',
    summary: '该系统利用深度学习技术，可快速准确地诊断多种常见疾病，为患者提供更便捷的医疗服务。',
    category: '科技',
    source: '科技日报',
    time: '3小时前',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=240&fit=crop',
    isHot: true,
    views: 9870
  },
  {
    id: 3,
    title: '央行宣布降低存款准备金率 释放长期资金约1万亿元',
    summary: '此次降准旨在保持流动性合理充裕，支持实体经济发展，降低企业融资成本。',
    category: '财经',
    source: '中国新闻网',
    time: '5小时前',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=240&fit=crop',
    isHot: false,
    views: 8560
  },
  {
    id: 4,
    title: '全国多地气温创新低 寒潮预警持续发布',
    summary: '中央气象台继续发布寒潮蓝色预警，提醒公众注意防寒保暖，谨防感冒和心脑血管疾病。',
    category: '社会',
    source: '中国天气网',
    time: '6小时前',
    image: 'https://images.unsplash.com/photo-1457269449834-928af64c684d?w=400&h=240&fit=crop',
    isHot: false,
    views: 7234
  },
  {
    id: 5,
    title: '新能源汽车销量持续增长 市场渗透率突破30%',
    summary: '今年前10个月，我国新能源汽车销量同比增长超过40%，产业发展势头强劲。',
    category: '汽车',
    source: '汽车之家',
    time: '7小时前',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=240&fit=crop',
    isHot: true,
    views: 6789
  },
  {
    id: 6,
    title: '教育部发布新政策 全面加强中小学生心理健康教育',
    summary: '新政策要求各地学校配备专职心理健康教师，建立完善的心理健康服务体系。',
    category: '教育',
    source: '教育部',
    time: '8小时前',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=240&fit=crop',
    isHot: false,
    views: 5432
  },
  {
    id: 7,
    title: '国足备战世界杯预选赛 主教练公布最新集训名单',
    summary: '新一期国家队集训名单公布，多名年轻球员入选，球队将进行为期两周的封闭集训。',
    category: '体育',
    source: '新浪体育',
    time: '10小时前',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=240&fit=crop',
    isHot: false,
    views: 4567
  },
  {
    id: 8,
    title: '热播剧《繁花》收视率破3 网络播放量超20亿',
    summary: '由王家卫执导的电视剧《繁花》持续热播，凭借精良的制作和演员的出色表演获得观众好评。',
    category: '娱乐',
    source: '娱乐周刊',
    time: '12小时前',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=240&fit=crop',
    isHot: true,
    views: 11234
  },
  {
    id: 9,
    title: '国际油价大幅下跌 布伦特原油跌破80美元',
    summary: '受全球经济增长放缓预期影响，国际油价今日大幅下跌，创近期新低。',
    category: '财经',
    source: '财经网',
    time: '14小时前',
    image: 'https://images.unsplash.com/photo-1611975558844-82c0fb2c0cb2?w=400&h=240&fit=crop',
    isHot: false,
    views: 3456
  },
  {
    id: 10,
    title: '全国铁路今日迎来客流高峰 预计发送旅客超千万',
    summary: '随着春运临近，全国铁路客流量持续攀升，各大车站加强服务保障措施。',
    category: '社会',
    source: '中国铁路',
    time: '16小时前',
    image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=240&fit=crop',
    isHot: false,
    views: 2890
  }
];

// 新闻分类
const categories = [
  { id: 'all', name: '全部', active: true },
  { id: 'hot', name: '热点', active: false },
  { id: 'tech', name: '科技', active: false },
  { id: 'finance', name: '财经', active: false },
  { id: 'society', name: '社会', active: false },
  { id: 'sports', name: '体育', active: false },
  { id: 'entertainment', name: '娱乐', active: false },
  { id: 'auto', name: '汽车', active: false },
  { id: 'education', name: '教育', active: false }
];

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取新闻列表
app.get('/api/news', (req, res) => {
  const { category, page = 1, pageSize = 10 } = req.query;

  let filteredNews = [...newsData];

  // 按分类筛选
  if (category && category !== 'all') {
    if (category === 'hot') {
      filteredNews = filteredNews.filter(news => news.isHot);
    } else {
      const categoryMap = {
        tech: '科技',
        finance: '财经',
        society: '社会',
        sports: '体育',
        entertainment: '娱乐',
        auto: '汽车',
        education: '教育'
      };
      const categoryName = categoryMap[category];
      if (categoryName) {
        filteredNews = filteredNews.filter(news => news.category === categoryName);
      }
    }
  }

  // 分页
  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const paginatedNews = filteredNews.slice(start, end);

  res.json({
    success: true,
    data: paginatedNews,
    total: filteredNews.length,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  });
});

// 获取分类列表
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

// 获取单条新闻详情
app.get('/api/news/:id', (req, res) => {
  const { id } = req.params;
  const news = newsData.find(item => item.id === parseInt(id));

  if (news) {
    res.json({
      success: true,
      data: news
    });
  } else {
    res.status(404).json({
      success: false,
      error: '新闻不存在'
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

