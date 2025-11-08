import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 3002; // 后端端口 3002，前端 5173

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // 增加限制以支持图片上传
app.use(express.json({ limit: '50mb' }));

// IP 跟踪中间件
app.use(async (req, res, next) => {
  // 获取真实 IP 地址（考虑代理情况）
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
             req.headers['x-real-ip'] ||
             req.connection.remoteAddress ||
             req.socket.remoteAddress;

  // 只记录页面访问，不记录 API 请求
  if (!req.path.startsWith('/api')) {
    try {
      // 读取现有数据
      let currentData = { count: 0, items: [], ratings: [], visitors: [] };
      try {
        const fileData = await fs.readFile(DATA_FILE, 'utf-8');
        currentData = JSON.parse(fileData);
        if (!currentData.visitors) {
          currentData.visitors = [];
        }
      } catch (error) {
        // 文件不存在，使用默认数据
      }

      // 记录访问信息
      const visitorInfo = {
        ip: ip,
        timestamp: new Date().toISOString(),
        path: req.path,
        userAgent: req.headers['user-agent']
      };

      currentData.visitors.push(visitorInfo);

      // 保存到文件
      await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存访问记录失败:', error);
    }
  }

  next();
});

// API 路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
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

// 获取模型信息
app.get('/api/model-info', (req, res) => {
  res.json({
    modelName: 'Claude Sonnet 4.5',
    modelId: 'claude-sonnet-4-5-20250929',
    knowledgeCutoff: 'January 2025',
    capabilities: [
      '代码生成与分析',
      '自然语言处理',
      '问题解答',
      '创意写作',
      '数据分析'
    ],
    version: '4.5',
    family: 'Claude',
    provider: 'Anthropic',
    timestamp: new Date().toISOString()
  });
});

// 获取评分数据
app.get('/api/ratings', async (req, res) => {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(fileData);

    // 确保 ratings 字段存在
    if (!parsedData.ratings) {
      parsedData.ratings = [];
    }

    res.json({
      ratings: parsedData.ratings,
      userRating: parsedData.userRating || null
    });
  } catch (error) {
    console.error('读取评分数据失败:', error);
    res.json({
      ratings: [],
      userRating: null
    });
  }
});

// 提交评分
app.post('/api/ratings', async (req, res) => {
  try {
    const { score } = req.body;

    // 验证评分
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: '评分必须在1-5之间'
      });
    }

    console.log('收到评分:', score);

    // 读取现有数据
    let currentData = { count: 0, items: [], ratings: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
      if (!currentData.ratings) {
        currentData.ratings = [];
      }
    } catch (error) {
      console.log('初始化数据文件');
    }

    // 添加新评分
    const newRating = {
      score: parseInt(score),
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    currentData.ratings.push(newRating);
    currentData.userRating = parseInt(score);

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log('评分已保存');

    res.json({
      success: true,
      message: '评分提交成功',
      data: newRating
    });
  } catch (error) {
    console.error('保存评分失败:', error);
    res.status(500).json({
      success: false,
      message: '保存评分失败: ' + error.message
    });
  }
});

// 获取访问者列表
app.get('/api/visitors', async (req, res) => {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(fileData);

    // 确保 visitors 字段存在
    if (!parsedData.visitors) {
      parsedData.visitors = [];
    }

    // 获取唯一 IP 列表及其访问次数
    const ipStats = {};
    parsedData.visitors.forEach(visitor => {
      if (!ipStats[visitor.ip]) {
        ipStats[visitor.ip] = {
          ip: visitor.ip,
          count: 0,
          firstVisit: visitor.timestamp,
          lastVisit: visitor.timestamp
        };
      }
      ipStats[visitor.ip].count++;
      ipStats[visitor.ip].lastVisit = visitor.timestamp;
    });

    // 转换为数组并按访问次数排序
    const visitorsList = Object.values(ipStats).sort((a, b) => b.count - a.count);

    res.json({
      visitors: visitorsList,
      total: visitorsList.length,
      totalVisits: parsedData.visitors.length
    });
  } catch (error) {
    console.error('读取访问者数据失败:', error);
    res.json({
      visitors: [],
      total: 0,
      totalVisits: 0
    });
  }
});

// 获取荒谬数据
app.get('/api/absurd-data', (req, res) => {
  const absurdValues = ['∞', '404', '42', '3.14', '999+', '0', '???', '¯\\_(ツ)_/¯', '-273.15', '9.81'];
  const absurdLabels = [
    '无限的可能性',
    '找不到的页面数',
    '宇宙的终极答案',
    '困惑的用户数',
    '无意义的数据',
    '有意义的内容',
    '已解决的问题',
    '未解决的问题',
    '绝对零度℃',
    '重力加速度m/s²'
  ];

  const stats = [];
  for (let i = 0; i < 4; i++) {
    stats.push({
      id: i + 1,
      value: absurdValues[Math.floor(Math.random() * absurdValues.length)],
      label: absurdLabels[Math.floor(Math.random() * absurdLabels.length)]
    });
  }

  const chaosIcons = ['🎯', '🚀', '💎', '🎪', '🎨', '🌟', '🎭', '🎸', '🎮', '🎲'];
  const chaosTitles = [
    '精准定位', '快速增长', '卓越品质', '创新思维', '设计美学', '用户体验',
    '团队协作', '战略规划', '品牌价值', '市场营销', '客户服务', '产品研发'
  ];
  const chaosDescriptions = [
    '我们精准地不知道自己在做什么',
    '混乱程度每天增长200%',
    '保证让你看不懂',
    '思维已经突破了逻辑的边界',
    '美到你怀疑人生',
    '体验从困惑到更困惑的旅程',
    '大家一起迷茫',
    '没有计划就是最好的计划',
    '价值观就是没有价值观',
    '营销策略:随机应变',
    '客户永远是对的(即使他们也不知道)',
    '研发方向:探索未知的未知'
  ];

  const chaosItems = [];
  for (let i = 0; i < 6; i++) {
    chaosItems.push({
      id: i + 1,
      icon: chaosIcons[Math.floor(Math.random() * chaosIcons.length)],
      title: chaosTitles[Math.floor(Math.random() * chaosTitles.length)],
      description: chaosDescriptions[Math.floor(Math.random() * chaosDescriptions.length)],
      rotation: Math.random() * 20 - 10
    });
  }

  res.json({
    stats: stats,
    chaosItems: chaosItems,
    timestamp: new Date().toISOString()
  });
});

// 获取新加坡信息
app.get('/api/singapore-info', (req, res) => {
  res.json({
    stats: {
      area: '728',
      population: '564',
      languages: '4',
      rank: 'Top 5'
    },
    attractions: [
      {
        id: 1,
        name: '滨海湾金沙',
        description: '标志性的综合度假胜地，拥有空中花园和无边际泳池',
        category: '地标',
        image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop'
      },
      {
        id: 2,
        name: '鱼尾狮公园',
        description: '新加坡的象征，眺望城市天际线的最佳位置',
        category: '地标',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop'
      },
      {
        id: 3,
        name: '滨海湾花园',
        description: '未来主义的花园，以其超级树和云雾林而闻名',
        category: '自然',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop'
      },
      {
        id: 4,
        name: '圣淘沙岛',
        description: '度假胜地，拥有海滩、主题公园和娱乐设施',
        category: '休闲',
        image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&h=600&fit=crop'
      },
      {
        id: 5,
        name: '牛车水',
        description: '充满活力的唐人街，体验传统文化和美食',
        category: '文化',
        image: 'https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&h=600&fit=crop'
      },
      {
        id: 6,
        name: '小印度',
        description: '色彩斑斓的印度区，感受浓郁的印度文化氛围',
        category: '文化',
        image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800&h=600&fit=crop'
      },
      {
        id: 7,
        name: '乌节路',
        description: '新加坡的购物天堂，汇集了世界顶级品牌',
        category: '购物',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
      },
      {
        id: 8,
        name: '新加坡动物园',
        description: '世界一流的开放式动物园，与动物亲密接触',
        category: '休闲',
        image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop'
      }
    ],
    culture: [
      {
        id: 1,
        icon: '🍜',
        title: '海南鸡饭',
        description: '新加坡国菜，鲜嫩多汁的鸡肉配上香喷喷的米饭'
      },
      {
        id: 2,
        icon: '🥘',
        title: '叻沙',
        description: '香浓的椰浆咖喱汤面，融合马来和华人风味'
      },
      {
        id: 3,
        icon: '🎭',
        title: '多元文化',
        description: '华人、马来、印度等多族裔文化和谐共存'
      },
      {
        id: 4,
        icon: '🎉',
        title: '传统节日',
        description: '春节、开斋节、屠妖节等节日丰富多彩'
      },
      {
        id: 5,
        icon: '🏛️',
        title: '历史建筑',
        description: '殖民时期建筑与现代摩天大楼完美融合'
      },
      {
        id: 6,
        icon: '🎨',
        title: '艺术文化',
        description: '世界级博物馆和艺术画廊，丰富的艺术活动'
      },
      {
        id: 7,
        icon: '🍛',
        title: '肉骨茶',
        description: '传统药膳汤，以猪肉和中药材熬制而成'
      },
      {
        id: 8,
        icon: '🥟',
        title: '云吞面',
        description: '经典的港式云吞面，是新加坡小贩中心的必吃美食'
      }
    ],
    timestamp: new Date().toISOString()
  });
});

// 获取新闻数据
app.get('/api/news', (req, res) => {
  // 模拟全球新闻数据
  const newsData = {
    news: [
      {
        id: 1,
        title: '人工智能技术取得重大突破，新算法提升效率300%',
        description: '研究团队开发出新型机器学习算法，在图像识别和自然语言处理领域展现出卓越性能，为AI技术发展开辟新方向。',
        category: 'technology',
        source: 'Tech News',
        author: '张伟',
        url: 'https://example.com/news/1',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: '全球经济论坛召开，多国领导人共商合作发展',
        description: '世界经济论坛在瑞士达沃斯举行，各国领导人就气候变化、数字经济、可持续发展等议题展开深入讨论。',
        category: 'business',
        source: 'Global Business',
        author: '李明',
        url: 'https://example.com/news/2',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: '世界杯预选赛精彩对决，卫冕冠军险胜',
        description: '在昨晚进行的世界杯预选赛中，卫冕冠军在主场以2比1险胜对手，暂时领跑小组积分榜，球迷欢呼雀跃。',
        category: 'sports',
        source: 'Sports Daily',
        author: '王强',
        url: 'https://example.com/news/3',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        title: '新型疫苗研发成功，预防效果显著',
        description: '医学研究团队宣布成功研发出新一代疫苗，临床试验显示其预防效果达95%，为全球公共卫生事业带来希望。',
        category: 'health',
        source: 'Health Today',
        author: '陈医生',
        url: 'https://example.com/news/4',
        image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800',
        publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        title: '好莱坞大片即将上映，特效技术震撼眼球',
        description: '备受期待的科幻大片将于下月全球同步上映，采用最新视觉特效技术，为观众带来前所未有的视听体验。',
        category: 'entertainment',
        source: 'Entertainment Weekly',
        author: '刘娜',
        url: 'https://example.com/news/5',
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 6,
        title: '量子计算机实现新突破，计算能力提升千倍',
        description: '科学家团队在量子计算领域取得重大进展，新型量子芯片成功运行复杂算法，为未来科技发展奠定基础。',
        category: 'science',
        source: 'Science Journal',
        author: '赵博士',
        url: 'https://example.com/news/6',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        publishedAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 7,
        title: '5G技术全面普及，智慧城市建设加速推进',
        description: '随着5G网络覆盖率不断提升，智慧交通、远程医疗、智能制造等应用场景迅速发展，城市生活更加便捷高效。',
        category: 'technology',
        source: 'Tech World',
        author: '孙工程师',
        url: 'https://example.com/news/7',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 8,
        title: '绿色能源投资激增，可再生能源占比创新高',
        description: '全球多国加大绿色能源投资力度，太阳能、风能等可再生能源发电量占比首次突破40%，环保事业取得重要进展。',
        category: 'business',
        source: 'Green Finance',
        author: '周环保',
        url: 'https://example.com/news/8',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 9,
        title: '奥运健儿刷新世界纪录，体育精神激励全球',
        description: '在最近的国际田径大奖赛上，多位运动员打破世界纪录，展现出人类运动潜能的无限可能，激励着全球体育爱好者。',
        category: 'sports',
        source: 'Olympic News',
        author: '吴教练',
        url: 'https://example.com/news/9',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 10,
        title: '火星探测任务传回新发现，生命迹象值得关注',
        description: '最新火星探测器传回的数据显示，在火星地表下可能存在液态水，这一发现为寻找地外生命提供了新线索。',
        category: 'science',
        source: 'Space Exploration',
        author: '郑航天',
        url: 'https://example.com/news/10',
        image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800',
        publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 11,
        title: '虚拟现实技术革新教育模式，沉浸式学习效果显著',
        description: 'VR技术在教育领域的应用日益广泛，学生可以通过虚拟现实体验历史事件、探索微观世界，学习效率大幅提升。',
        category: 'technology',
        source: 'EduTech News',
        author: '黄老师',
        url: 'https://example.com/news/11',
        image: 'https://images.unsplash.com/photo-1617802690658-1173a812650d?w=800',
        publishedAt: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 12,
        title: '国际音乐节盛大开幕，顶级艺术家齐聚一堂',
        description: '年度国际音乐节在维也纳拉开帷幕，来自世界各地的音乐家将在未来一周为观众献上精彩演出，共享艺术盛宴。',
        category: 'entertainment',
        source: 'Arts & Culture',
        author: '冯艺术家',
        url: 'https://example.com/news/12',
        image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
        publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      }
    ],
    total: 12,
    timestamp: new Date().toISOString()
  };

  res.json(newsData);
});

// 获取任务列表
app.get('/api/tasks', async (req, res) => {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(fileData);

    // 确保 tasks 字段存在
    if (!parsedData.tasks) {
      parsedData.tasks = [];
    }

    res.json({
      tasks: parsedData.tasks,
      total: parsedData.tasks.length
    });
  } catch (error) {
    console.error('读取任务数据失败:', error);
    res.json({
      tasks: [],
      total: 0
    });
  }
});

// 初始化任务（生成 1000 个任务）
app.post('/api/tasks/init', async (req, res) => {
  try {
    console.log('开始初始化任务...');

    // 读取现有数据
    let currentData = { count: 0, items: [], ratings: [], tasks: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
    } catch (error) {
      console.log('初始化数据文件');
    }

    // 生成 1000 个任务
    const tasks = [];
    for (let i = 1; i <= 1000; i++) {
      tasks.push({
        id: i,
        title: `任务 ${i}`,
        description: `这是第 ${i} 个任务的描述`,
        completed: false,
        createdAt: new Date().toISOString()
      });
    }

    currentData.tasks = tasks;

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log('成功生成 1000 个任务');

    res.json({
      success: true,
      message: '成功生成 1000 个任务',
      total: tasks.length
    });
  } catch (error) {
    console.error('初始化任务失败:', error);
    res.status(500).json({
      success: false,
      message: '初始化任务失败: ' + error.message
    });
  }
});

// 完成任务
app.post('/api/tasks/:id/complete', async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    console.log('收到完成任务请求, ID:', taskId);

    // 读取现有数据
    let currentData = { count: 0, items: [], tasks: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
      if (!currentData.tasks) {
        currentData.tasks = [];
      }
    } catch (error) {
      console.log('初始化数据文件');
    }

    // 查找并更新任务状态
    const taskIndex = currentData.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '任务不存在'
      });
    }

    currentData.tasks[taskIndex].completed = true;
    currentData.tasks[taskIndex].completedAt = new Date().toISOString();

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log('任务已完成');

    res.json({
      success: true,
      message: '任务已完成',
      task: currentData.tasks[taskIndex]
    });
  } catch (error) {
    console.error('完成任务失败:', error);
    res.status(500).json({
      success: false,
      message: '完成任务失败: ' + error.message
    });
  }
});

// 删除所有任务
app.delete('/api/tasks', async (req, res) => {
  try {
    console.log('收到删除所有任务请求');

    // 读取现有数据
    let currentData = { count: 0, items: [], ratings: [], tasks: [], visitors: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
    } catch (error) {
      console.log('初始化数据文件');
    }

    // 记录删除前的任务数量
    const deletedCount = currentData.tasks ? currentData.tasks.length : 0;

    // 清空任务数组
    currentData.tasks = [];

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log(`成功删除 ${deletedCount} 个任务`);

    res.json({
      success: true,
      message: `成功删除 ${deletedCount} 个任务`,
      deletedCount: deletedCount
    });
  } catch (error) {
    console.error('删除任务失败:', error);
    res.status(500).json({
      success: false,
      message: '删除任务失败: ' + error.message
    });
  }
});

// 获取系统信息
app.get('/api/system-info', async (req, res) => {
  try {
    console.log('收到获取系统信息请求');

    // 获取当前执行路径
    const currentPath = process.cwd();
    console.log('当前执行路径:', currentPath);

    // 执行 ls /usr/bin 命令
    let usrBinList = [];
    try {
      const { stdout } = await execPromise('ls /usr/bin');
      usrBinList = stdout.split('\n').filter(item => item.trim() !== '');
      console.log(`/usr/bin 目录包含 ${usrBinList.length} 个项目`);
    } catch (error) {
      console.error('执行 ls /usr/bin 失败:', error);
      usrBinList = ['执行失败: ' + error.message];
    }

    res.json({
      success: true,
      data: {
        currentPath: currentPath,
        usrBinList: usrBinList,
        usrBinCount: usrBinList.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取系统信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取系统信息失败: ' + error.message
    });
  }
});

// 重启服务器
app.post('/api/restart', (req, res) => {
  console.log('收到重启请求');

  // 先返回成功响应
  res.json({
    success: true,
    message: '服务器将在 1 秒后重启',
    timestamp: new Date().toISOString()
  });

  // 延迟 1 秒后退出进程，nodemon 会自动重启
  setTimeout(() => {
    console.log('正在重启服务器...');
    process.exit(0);
  }, 1000);
});

// 关机
app.post('/api/shutdown', (req, res) => {
  console.log('收到关机请求');

  // 先返回成功响应
  res.json({
    success: true,
    message: '系统将在 2 秒后关闭',
    timestamp: new Date().toISOString()
  });

  // 延迟 2 秒后执行关机命令
  setTimeout(() => {
    console.log('正在关闭系统...');

    // 根据操作系统执行不同的关机命令
    const platform = process.platform;
    let shutdownCommand = '';

    if (platform === 'linux' || platform === 'darwin') {
      shutdownCommand = 'sudo shutdown -h now';
    } else if (platform === 'win32') {
      shutdownCommand = 'shutdown /s /t 0';
    }

    if (shutdownCommand) {
      exec(shutdownCommand, (error, stdout, stderr) => {
        if (error) {
          console.error('关机命令执行失败:', error);
          // 即使关机失败，也退出进程
          process.exit(1);
        } else {
          console.log('关机命令已执行');
        }
      });
    } else {
      console.error('不支持的操作系统平台:', platform);
      process.exit(1);
    }
  }, 2000);
});

// 获取 Google Pixel 产品列表
app.get('/api/products', (req, res) => {
  const products = [
    {
      id: 1,
      name: 'Pixel 8 Pro',
      tagline: 'The most advanced Pixel phone',
      price: 'From $999',
      isNew: true,
      colors: ['#4285f4', '#202124', '#f8f9fa', '#c5221f'],
      type: 'phone',
      description: 'Google Tensor G3 chip, Pro camera system, 6.7" Super Actua display',
      features: ['50MP main camera', '48MP ultrawide', '48MP telephoto', 'Magic Editor']
    },
    {
      id: 2,
      name: 'Pixel 8',
      tagline: 'The helpful phone',
      price: 'From $699',
      isNew: true,
      colors: ['#1a73e8', '#202124', '#f8f9fa', '#ea8f95'],
      type: 'phone',
      description: 'Google Tensor G3 chip, Advanced camera, 6.2" Actua display',
      features: ['50MP main camera', 'Magic Editor', 'Best Take', 'Audio Magic Eraser']
    },
    {
      id: 3,
      name: 'Pixel Watch 2',
      tagline: 'Help by Google. Health by Fitbit.',
      price: 'From $349',
      isNew: true,
      colors: ['#5f6368', '#e8eaed', '#fbbc04'],
      type: 'watch',
      description: 'Advanced health tracking, safety features, and Google apps on your wrist',
      features: ['Heart rate monitoring', 'ECG app', 'Stress management', 'Emergency SOS']
    },
    {
      id: 4,
      name: 'Pixel Buds Pro',
      tagline: 'Premium sound. Smart features.',
      price: '$199',
      isNew: false,
      colors: ['#202124', '#f8f9fa', '#1a73e8', '#34a853', '#ea4335'],
      type: 'earbuds',
      description: 'Active Noise Cancellation, transparency mode, spatial audio',
      features: ['Active Noise Cancellation', 'Transparency mode', '31 hours battery', 'Spatial audio']
    },
    {
      id: 5,
      name: 'Pixel Tablet',
      tagline: 'The tablet that does it all',
      price: 'From $499',
      isNew: false,
      colors: ['#f8f9fa', '#34a853', '#ea8f95'],
      type: 'tablet',
      description: '11-inch display, Google Tensor G2, charging speaker dock included',
      features: ['11" screen', 'Tensor G2 chip', 'Speaker dock', 'Hub mode']
    },
    {
      id: 6,
      name: 'Nest Hub Max',
      tagline: 'Your smart display',
      price: '$229',
      isNew: false,
      colors: ['#5f6368', '#f8f9fa'],
      type: 'nest',
      description: '10-inch HD display, Nest Cam, stereo speakers',
      features: ['10" HD display', 'Built-in Nest Cam', 'Stereo sound', 'Smart home control']
    },
    {
      id: 7,
      name: 'Nest Wifi Pro 6E',
      tagline: 'Fast. Reliable. Secure.',
      price: 'From $199',
      isNew: false,
      colors: ['#f8f9fa', '#9aa0a6', '#e8eaed'],
      type: 'nest',
      description: 'Wi-Fi 6E, covers up to 2200 sq ft per router',
      features: ['Wi-Fi 6E', 'Up to 5.4 Gbps', 'Covers 2200 sq ft', 'Built-in security']
    },
    {
      id: 8,
      name: 'Nest Doorbell',
      tagline: 'Know who\'s there',
      price: '$179',
      isNew: false,
      colors: ['#f8f9fa', '#5f6368', '#9aa0a6'],
      type: 'nest',
      description: 'Battery or wired, HDR video, smart alerts',
      features: ['HDR video', 'Smart alerts', '24/7 recording', 'Person detection']
    }
  ];

  res.json({
    products: products,
    total: products.length,
    timestamp: new Date().toISOString()
  });
});

// 获取随机猫咪图片
app.get('/api/cat', (req, res) => {
  // 猫咪图片数据
  const catImages = [
    'https://cataas.com/cat?timestamp=' + Date.now(),
    'https://cataas.com/cat/cute?timestamp=' + Date.now(),
    'https://cataas.com/cat/kitten?timestamp=' + Date.now()
  ];

  const catFacts = [
    '猫咪每天要睡12-16个小时',
    '猫咪有超过100种不同的发声方式',
    '猫咪的听觉比人类和狗都要灵敏',
    '猫咪的鼻纹就像人类的指纹一样独一无二',
    '猫咪可以旋转耳朵180度',
    '猫咪的胡须可以帮助它们感知周围环境',
    '猫咪一生中有70%的时间在睡觉',
    '猫咪无法尝到甜味',
    '猫咪的心跳速度是人类的两倍',
    '成年猫咪只会对人类喵喵叫，而不会对其他猫咪这样'
  ];

  const randomImageUrl = catImages[Math.floor(Math.random() * catImages.length)];
  const randomFact = catFacts[Math.floor(Math.random() * catFacts.length)];

  res.json({
    success: true,
    image: randomImageUrl,
    fact: randomFact,
    timestamp: new Date().toISOString()
  });
});

// 获取视频列表
app.get('/api/videos', (req, res) => {
  // 生成虚假视频数据，使用各种诱人的标题
  const videos = [
    {
      id: 1,
      title: "Amazing Cooking Tutorial - Master Chef Secrets Revealed",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "3:33",
      views: 1247893,
      rating: 95,
      uploadDate: "2 days ago",
      description: "Learn the secret techniques that professional chefs don't want you to know!"
    },
    {
      id: 2,
      title: "Cute Puppies Playing in the Park - Compilation 2024",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      duration: "3:33",
      views: 892456,
      rating: 98,
      uploadDate: "1 week ago",
      description: "The cutest puppies you've ever seen playing together!"
    },
    {
      id: 3,
      title: "Top 10 Life Hacks That Will Change Your Life",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg",
      duration: "3:33",
      views: 2341567,
      rating: 92,
      uploadDate: "3 days ago",
      description: "These amazing life hacks will make your daily routine so much easier!"
    },
    {
      id: 4,
      title: "Unboxing the Latest Gaming Console - Full Review",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      duration: "3:33",
      views: 1567234,
      rating: 94,
      uploadDate: "5 days ago",
      description: "Complete unboxing and review of the newest gaming console on the market!"
    },
    {
      id: 5,
      title: "Fitness Workout - Get Fit in 30 Days Challenge",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      duration: "3:33",
      views: 678934,
      rating: 89,
      uploadDate: "1 week ago",
      description: "Transform your body with this 30-day fitness challenge!"
    },
    {
      id: 6,
      title: "Travel Vlog - Exploring Beautiful Islands",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "3:33",
      views: 934521,
      rating: 96,
      uploadDate: "4 days ago",
      description: "Join me as I explore the most beautiful islands in the world!"
    },
    {
      id: 7,
      title: "DIY Home Improvement - Bathroom Renovation",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg",
      duration: "3:33",
      views: 445678,
      rating: 91,
      uploadDate: "6 days ago",
      description: "Complete bathroom renovation on a budget!"
    },
    {
      id: 8,
      title: "Music Production Tutorial - Make Beats Like a Pro",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      duration: "3:33",
      views: 1123456,
      rating: 93,
      uploadDate: "2 weeks ago",
      description: "Learn professional music production techniques from scratch!"
    },
    {
      id: 9,
      title: "Funny Moments Compilation - Try Not to Laugh",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      duration: "3:33",
      views: 3456789,
      rating: 97,
      uploadDate: "1 day ago",
      description: "The funniest moments compilation - warning: you will laugh!"
    },
    {
      id: 10,
      title: "Photography Tips - Take Professional Photos with Your Phone",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "3:33",
      views: 567890,
      rating: 90,
      uploadDate: "1 week ago",
      description: "Take stunning professional-quality photos with just your smartphone!"
    },
    {
      id: 11,
      title: "Science Experiment - Mind-Blowing Physics Tricks",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg",
      duration: "3:33",
      views: 789123,
      rating: 95,
      uploadDate: "3 days ago",
      description: "Amazing physics experiments that will blow your mind!"
    },
    {
      id: 12,
      title: "Street Food Tour - Best Food in Asia",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      duration: "3:33",
      views: 1890234,
      rating: 98,
      uploadDate: "5 days ago",
      description: "Discovering the most delicious street food across Asia!"
    }
  ];

  res.json(videos);
});

// 宇泽玲纱个人主页 - 获取统计数据
app.get('/api/reisa/stats', async (req, res) => {
  try {
    let currentData = { count: 0, items: [], ratings: [], visitors: [], reisaStats: { total: 0, today: 0, likes: 0 } };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);

      // 如果没有 reisaStats，初始化
      if (!currentData.reisaStats) {
        currentData.reisaStats = {
          total: 1024,
          today: 42,
          likes: 888
        };
      }
    } catch (error) {
      // 文件不存在，使用默认数据
      currentData.reisaStats = {
        total: 1024,
        today: 42,
        likes: 888
      };
    }

    // 更新总访问量和今日访问量
    currentData.reisaStats.total = (currentData.reisaStats.total || 1024) + 1;
    currentData.reisaStats.today = (currentData.reisaStats.today || 42) + 1;

    // 保存更新后的数据
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');

    res.json(currentData.reisaStats);
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.json({
      total: 1024,
      today: 42,
      likes: 888
    });
  }
});

// 宇泽玲纱个人主页 - 点赞
app.post('/api/reisa/like', async (req, res) => {
  try {
    let currentData = { count: 0, items: [], ratings: [], visitors: [], reisaStats: { total: 0, today: 0, likes: 0 } };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);

      // 如果没有 reisaStats，初始化
      if (!currentData.reisaStats) {
        currentData.reisaStats = {
          total: 1024,
          today: 42,
          likes: 888
        };
      }
    } catch (error) {
      // 文件不存在，使用默认数据
      currentData.reisaStats = {
        total: 1024,
        today: 42,
        likes: 888
      };
    }

    // 点赞数加1
    currentData.reisaStats.likes = (currentData.reisaStats.likes || 888) + 1;

    // 保存更新后的数据
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');

    res.json({
      success: true,
      likes: currentData.reisaStats.likes
    });
  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({
      success: false,
      error: '点赞失败'
    });
  }
});

// DAW API - 保存项目
app.post('/api/daw/save', async (req, res) => {
  try {
    console.log('收到 DAW 项目保存请求');
    const project = req.body;

    // 读取现有数据
    let currentData = { count: 0, items: [], ratings: [], visitors: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
    } catch (error) {
      console.log('初始化数据文件');
    }

    // 保存 DAW 项目
    currentData.dawProject = {
      ...project,
      savedAt: new Date().toISOString()
    };

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log('DAW 项目已保存');

    res.json({
      success: true,
      message: '项目保存成功',
      savedAt: currentData.dawProject.savedAt
    });
  } catch (error) {
    console.error('保存 DAW 项目失败:', error);
    res.status(500).json({
      success: false,
      message: '保存项目失败: ' + error.message
    });
  }
});

// DAW API - 加载项目
app.get('/api/daw/load', async (req, res) => {
  try {
    console.log('收到 DAW 项目加载请求');

    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const currentData = JSON.parse(fileData);

    if (!currentData.dawProject) {
      return res.status(404).json({
        success: false,
        message: '未找到保存的项目'
      });
    }

    res.json(currentData.dawProject);
  } catch (error) {
    console.error('加载 DAW 项目失败:', error);
    res.status(500).json({
      success: false,
      message: '加载项目失败: ' + error.message
    });
  }
});

// 手机互动 API - 保存互动数据
app.post('/api/mobile-interaction', async (req, res) => {
  try {
    console.log('收到手机互动数据保存请求');

    const { stats, logs, timestamp } = req.body;

    // 验证数据
    if (!stats || !logs) {
      return res.status(400).json({
        success: false,
        message: '缺少必要的数据字段'
      });
    }

    // 读取现有数据
    let currentData = { count: 0, items: [], ratings: [], visitors: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
    } catch (error) {
      // 文件不存在，使用默认数据
      console.log('数据文件不存在，创建新文件');
    }

    // 初始化手机互动数据数组
    if (!currentData.mobileInteractions) {
      currentData.mobileInteractions = [];
    }

    // 添加新的互动数据
    const interactionData = {
      stats,
      logs,
      timestamp: timestamp || Date.now(),
      savedAt: new Date().toISOString()
    };

    currentData.mobileInteractions.push(interactionData);

    // 只保留最近 100 条记录
    if (currentData.mobileInteractions.length > 100) {
      currentData.mobileInteractions = currentData.mobileInteractions.slice(-100);
    }

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');

    console.log('手机互动数据保存成功');
    res.json({
      success: true,
      message: '互动数据保存成功',
      totalRecords: currentData.mobileInteractions.length
    });
  } catch (error) {
    console.error('保存手机互动数据失败:', error);
    res.status(500).json({
      success: false,
      message: '保存失败: ' + error.message
    });
  }
});

// 手机互动 API - 获取互动统计
app.get('/api/mobile-interaction/stats', async (req, res) => {
  try {
    console.log('收到手机互动统计请求');

    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const currentData = JSON.parse(fileData);

    if (!currentData.mobileInteractions || currentData.mobileInteractions.length === 0) {
      return res.json({
        success: true,
        totalSessions: 0,
        totalStats: {
          taps: 0,
          longPress: 0,
          swipes: 0,
          doubleTaps: 0
        },
        recentInteractions: []
      });
    }

    // 计算总计统计
    const totalStats = currentData.mobileInteractions.reduce((acc, interaction) => {
      acc.taps += interaction.stats.taps || 0;
      acc.longPress += interaction.stats.longPress || 0;
      acc.swipes += interaction.stats.swipes || 0;
      acc.doubleTaps += interaction.stats.doubleTaps || 0;
      return acc;
    }, { taps: 0, longPress: 0, swipes: 0, doubleTaps: 0 });

    res.json({
      success: true,
      totalSessions: currentData.mobileInteractions.length,
      totalStats,
      recentInteractions: currentData.mobileInteractions.slice(-10).reverse()
    });
  } catch (error) {
    console.error('获取手机互动统计失败:', error);
    res.status(500).json({
      success: false,
      message: '获取统计失败: ' + error.message
    });
  }
});

// 图片裁剪 API - 保存裁剪后的图片
app.post('/api/image-crop/save', async (req, res) => {
  try {
    console.log('收到图片裁剪保存请求');

    const { image, width, height, timestamp } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: '缺少图片数据'
      });
    }

    // 读取现有数据
    let currentData = { count: 0, items: [], ratings: [], visitors: [], croppedImages: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
      if (!currentData.croppedImages) {
        currentData.croppedImages = [];
      }
    } catch (error) {
      // 文件不存在，使用默认数据
    }

    // 保存裁剪图片信息
    const croppedImageInfo = {
      id: Date.now().toString(),
      width,
      height,
      timestamp: timestamp || Date.now(),
      savedAt: new Date().toISOString()
    };

    currentData.croppedImages.push(croppedImageInfo);

    // 保留最近 100 张图片记录
    if (currentData.croppedImages.length > 100) {
      currentData.croppedImages = currentData.croppedImages.slice(-100);
    }

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');

    console.log('图片裁剪信息保存成功');

    res.json({
      success: true,
      message: '图片保存成功',
      data: croppedImageInfo
    });
  } catch (error) {
    console.error('保存图片裁剪信息失败:', error);
    res.status(500).json({
      success: false,
      error: '保存失败: ' + error.message
    });
  }
});

// 图片裁剪 API - 获取裁剪历史
app.get('/api/image-crop/history', async (req, res) => {
  try {
    console.log('收到图片裁剪历史请求');

    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const currentData = JSON.parse(fileData);

    if (!currentData.croppedImages || currentData.croppedImages.length === 0) {
      return res.json({
        success: true,
        total: 0,
        images: []
      });
    }

    res.json({
      success: true,
      total: currentData.croppedImages.length,
      images: currentData.croppedImages.slice(-20).reverse()
    });
  } catch (error) {
    console.error('获取图片裁剪历史失败:', error);
    res.status(500).json({
      success: false,
      error: '获取历史失败: ' + error.message
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
  console.log(`数据文件路径: ${DATA_FILE}`);
  console.log(`__dirname: ${__dirname}`);
});

