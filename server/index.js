import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储 - 画廊作品数据
const artworks = [
  {
    id: 1,
    title: '星空下的梦境',
    artist: '李明',
    category: '油画',
    price: 58000,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    description: '这幅作品捕捉了夜空中星辰的璀璨与梦幻，通过细腻的笔触和丰富的色彩，营造出一种超现实的宁静氛围。艺术家运用独特的技法，将星空与人类的梦想融为一体，引人深思。',
    dimensions: '120cm × 90cm',
    year: '2023',
    medium: '布面油画'
  },
  {
    id: 2,
    title: '城市印象',
    artist: '王芳',
    category: '抽象',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    description: '以现代城市为灵感，通过抽象的线条和鲜明的色块，表达了都市生活的快节奏与多样性。作品充满动感，展现了城市的活力与矛盾。',
    dimensions: '100cm × 100cm',
    year: '2024',
    medium: '丙烯画'
  },
  {
    id: 3,
    title: '静物与光影',
    artist: '张伟',
    category: '写实',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
    description: '这幅写实作品以精湛的技艺再现了日常静物在自然光线下的美态。艺术家通过对光影的细致观察和描绘，赋予了普通物品以诗意的美感。',
    dimensions: '80cm × 60cm',
    year: '2023',
    medium: '布面油画'
  },
  {
    id: 4,
    title: '山水意境',
    artist: '陈静',
    category: '国画',
    price: 68000,
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
    description: '传统山水画的现代演绎，融合了传统笔墨技法与当代审美。作品意境悠远，墨色变化丰富，展现了东方美学的独特魅力。',
    dimensions: '180cm × 96cm',
    year: '2024',
    medium: '纸本水墨'
  },
  {
    id: 5,
    title: '几何构成',
    artist: '刘洋',
    category: '抽象',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800',
    description: '运用几何图形和纯色块的组合，探索形式与色彩的关系。作品简洁而富有张力，体现了现代主义的设计理念。',
    dimensions: '90cm × 90cm',
    year: '2023',
    medium: '布面丙烯'
  },
  {
    id: 6,
    title: '花开时节',
    artist: '赵雪',
    category: '水彩',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    description: '水彩画的轻盈与透明感完美诠释了春天花朵的娇美。色彩柔和，层次丰富，充满了生命的活力与自然的芬芳。',
    dimensions: '60cm × 80cm',
    year: '2024',
    medium: '纸本水彩'
  },
  {
    id: 7,
    title: '工业遗迹',
    artist: '孙强',
    category: '摄影',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?w=800',
    description: '通过镜头记录了废弃工业建筑的残破之美。黑白摄影的运用强化了历史感与沧桑感，引发观者对工业文明的反思。',
    dimensions: '70cm × 50cm',
    year: '2023',
    medium: '收藏级照片'
  },
  {
    id: 8,
    title: '海浪',
    artist: '周敏',
    category: '油画',
    price: 52000,
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
    description: '捕捉了大海的力量与动态。厚重的笔触和丰富的蓝色调表现了海浪的翻滚与澎湃，让人仿佛能感受到海风的呼啸。',
    dimensions: '140cm × 100cm',
    year: '2024',
    medium: '布面油画'
  },
  {
    id: 9,
    title: '肖像研究',
    artist: '吴凯',
    category: '写实',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
    description: '人物肖像的深入刻画，不仅展现了外在形象，更通过眼神和表情传达了内心世界。写实技法娴熟，情感表达细腻。',
    dimensions: '70cm × 90cm',
    year: '2023',
    medium: '布面油画'
  },
  {
    id: 10,
    title: '色彩交响',
    artist: '郑美',
    category: '抽象',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800',
    description: '纯粹的色彩语言，如同音乐般流动。各种颜色在画布上自由碰撞，创造出富有节奏感的视觉效果，传达了积极向上的情感。',
    dimensions: '110cm × 110cm',
    year: '2024',
    medium: '布面丙烯'
  },
  {
    id: 11,
    title: '竹林深处',
    artist: '林青',
    category: '国画',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    description: '以竹为题材，展现了竹子的挺拔与清雅。墨色浓淡相宜，构图疏密有致，体现了文人画的审美情趣和精神追求。',
    dimensions: '136cm × 68cm',
    year: '2023',
    medium: '纸本水墨'
  },
  {
    id: 12,
    title: '都市夜景',
    artist: '黄涛',
    category: '摄影',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=800',
    description: '夜幕下的城市灯火辉煌，高楼大厦的轮廓与霓虹灯光交织成一幅现代都市的光影画卷。作品展现了城市的繁华与魅力。',
    dimensions: '80cm × 60cm',
    year: '2024',
    medium: '收藏级照片'
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

// 获取所有作品
app.get('/api/artworks', (req, res) => {
  try {
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: '获取作品列表失败' });
  }
});

// 获取单个作品详情
app.get('/api/artworks/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const artwork = artworks.find(a => a.id === id);

    if (!artwork) {
      return res.status(404).json({ error: '作品不存在' });
    }

    res.json(artwork);
  } catch (error) {
    res.status(500).json({ error: '获取作品详情失败' });
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

