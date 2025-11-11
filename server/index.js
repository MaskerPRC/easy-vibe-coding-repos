import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储 - B站视频列表数据
const bilibiliVideos = [
  {
    id: 1,
    bvid: 'BV1xx411c7mD',
    title: '【编程教程】Vue3 + Vite 快速入门指南',
    cover: 'https://picsum.photos/seed/1/320/200',
    author: '前端技术分享',
    avatar: 'https://picsum.photos/seed/a1/50/50',
    views: 125600,
    likes: 8900,
    duration: '15:32',
    publishTime: '2024-01-15',
  },
  {
    id: 2,
    bvid: 'BV1xx411c7mE',
    title: '【音乐MV】热门歌曲精选合集 2024',
    cover: 'https://picsum.photos/seed/2/320/200',
    author: '音乐推荐官',
    avatar: 'https://picsum.photos/seed/a2/50/50',
    views: 2345000,
    likes: 156000,
    duration: '3:45',
    publishTime: '2024-02-20',
  },
  {
    id: 3,
    bvid: 'BV1xx411c7mF',
    title: '【游戏实况】原神新版本剧情攻略',
    cover: 'https://picsum.photos/seed/3/320/200',
    author: '游戏解说君',
    avatar: 'https://picsum.photos/seed/a3/50/50',
    views: 876000,
    likes: 42000,
    duration: '25:18',
    publishTime: '2024-03-10',
  },
  {
    id: 4,
    bvid: 'BV1xx411c7mG',
    title: '【美食制作】教你做正宗重庆火锅',
    cover: 'https://picsum.photos/seed/4/320/200',
    author: '美食探索家',
    avatar: 'https://picsum.photos/seed/a4/50/50',
    views: 654000,
    likes: 38000,
    duration: '12:45',
    publishTime: '2024-03-25',
  },
  {
    id: 5,
    bvid: 'BV1xx411c7mH',
    title: '【科技评测】2024年最值得购买的手机推荐',
    cover: 'https://picsum.photos/seed/5/320/200',
    author: '科技数码',
    avatar: 'https://picsum.photos/seed/a5/50/50',
    views: 1234000,
    likes: 67000,
    duration: '18:23',
    publishTime: '2024-04-05',
  },
  {
    id: 6,
    bvid: 'BV1xx411c7mI',
    title: '【动画MAD】经典动漫混剪燃向',
    cover: 'https://picsum.photos/seed/6/320/200',
    author: '动漫剪辑师',
    avatar: 'https://picsum.photos/seed/a6/50/50',
    views: 987000,
    likes: 52000,
    duration: '4:56',
    publishTime: '2024-04-18',
  },
  {
    id: 7,
    bvid: 'BV1xx411c7mJ',
    title: '【旅行Vlog】日本东京一日游攻略',
    cover: 'https://picsum.photos/seed/7/320/200',
    author: '旅行记录者',
    avatar: 'https://picsum.photos/seed/a7/50/50',
    views: 543000,
    likes: 28000,
    duration: '20:15',
    publishTime: '2024-05-02',
  },
  {
    id: 8,
    bvid: 'BV1xx411c7mK',
    title: '【知识分享】人工智能的发展历程',
    cover: 'https://picsum.photos/seed/8/320/200',
    author: '知识科普',
    avatar: 'https://picsum.photos/seed/a8/50/50',
    views: 432000,
    likes: 21000,
    duration: '22:40',
    publishTime: '2024-05-15',
  },
  {
    id: 9,
    bvid: 'BV1xx411c7mL',
    title: '【运动健身】30天练出腹肌计划',
    cover: 'https://picsum.photos/seed/9/320/200',
    author: '健身教练',
    avatar: 'https://picsum.photos/seed/a9/50/50',
    views: 765000,
    likes: 45000,
    duration: '16:30',
    publishTime: '2024-06-01',
  },
  {
    id: 10,
    bvid: 'BV1xx411c7mM',
    title: '【搞笑日常】沙雕视频合集笑到停不下来',
    cover: 'https://picsum.photos/seed/10/320/200',
    author: '快乐源泉',
    avatar: 'https://picsum.photos/seed/a10/50/50',
    views: 3456000,
    likes: 234000,
    duration: '8:25',
    publishTime: '2024-06-20',
  },
  {
    id: 11,
    bvid: 'BV1xx411c7mN',
    title: '【时尚穿搭】夏季流行服装搭配技巧',
    cover: 'https://picsum.photos/seed/11/320/200',
    author: '时尚博主',
    avatar: 'https://picsum.photos/seed/a11/50/50',
    views: 345000,
    likes: 18000,
    duration: '11:20',
    publishTime: '2024-07-05',
  },
  {
    id: 12,
    bvid: 'BV1xx411c7mO',
    title: '【历史解说】中国古代四大发明的故事',
    cover: 'https://picsum.photos/seed/12/320/200',
    author: '历史讲堂',
    avatar: 'https://picsum.photos/seed/a12/50/50',
    views: 234000,
    likes: 12000,
    duration: '19:45',
    publishTime: '2024-07-18',
  },
];

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取B站视频列表
app.get('/api/bilibili/videos', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 12;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginatedVideos = bilibiliVideos.slice(start, end);

    res.json({
      success: true,
      data: {
        videos: paginatedVideos,
        total: bilibiliVideos.length,
        page,
        pageSize,
        totalPages: Math.ceil(bilibiliVideos.length / pageSize),
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取视频列表失败',
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

