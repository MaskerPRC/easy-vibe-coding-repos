import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储 - 明星写真数据
const starPhotos = [
  {
    id: 1,
    name: '艾玛·沃森',
    category: '时尚',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
    description: '优雅迷人的时尚写真',
    tags: ['时尚', '优雅', '知性']
  },
  {
    id: 2,
    name: '克里斯·海姆斯沃斯',
    category: '运动',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    description: '充满力量感的运动风格',
    tags: ['运动', '阳光', '健康']
  },
  {
    id: 3,
    name: '斯嘉丽·约翰逊',
    category: '时尚',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
    description: '高贵典雅的红毯造型',
    tags: ['高贵', '魅力', '经典']
  },
  {
    id: 4,
    name: '汤姆·希德勒斯顿',
    category: '商务',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop',
    description: '绅士风度的商务写真',
    tags: ['绅士', '优雅', '专业']
  },
  {
    id: 5,
    name: '娜塔莉·波特曼',
    category: '艺术',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop',
    description: '艺术感十足的个性写真',
    tags: ['艺术', '文艺', '清新']
  },
  {
    id: 6,
    name: '迈克尔·B·乔丹',
    category: '时尚',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop',
    description: '潮流时尚的街拍风格',
    tags: ['时尚', '潮流', '个性']
  },
  {
    id: 7,
    name: '玛格特·罗比',
    category: '时尚',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop',
    description: '甜美可爱的时尚造型',
    tags: ['甜美', '时尚', '活力']
  },
  {
    id: 8,
    name: '瑞恩·高斯林',
    category: '复古',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop',
    description: '复古魅力的经典造型',
    tags: ['复古', '经典', '魅力']
  },
  {
    id: 9,
    name: '盖尔·加朵',
    category: '时尚',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop',
    description: '高贵优雅的女神风范',
    tags: ['优雅', '高贵', '女神']
  }
];

// 获取所有明星写真
app.get('/api/photos', (req, res) => {
  res.json({
    success: true,
    data: starPhotos
  });
});

// 根据ID获取单个写真详情
app.get('/api/photos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const photo = starPhotos.find(p => p.id === id);

  if (photo) {
    res.json({
      success: true,
      data: photo
    });
  } else {
    res.status(404).json({
      success: false,
      message: '未找到该写真'
    });
  }
});

// 根据分类筛选
app.get('/api/photos/category/:category', (req, res) => {
  const category = req.params.category;
  const filtered = starPhotos.filter(p => p.category === category);

  res.json({
    success: true,
    data: filtered
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
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
});

