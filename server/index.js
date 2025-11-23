import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储数据（重启后数据会丢失，这是正常的）
let products = [
  {
    id: 1,
    name: '时尚运动鞋',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: '鞋类',
    description: '舒适透气，适合日常运动和休闲穿着。采用优质材料制作，耐磨耐用。',
    stock: 100,
    sales: 1234,
    isHot: true
  },
  {
    id: 2,
    name: '无线蓝牙耳机',
    price: 199,
    originalPrice: 299,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: '数码',
    description: '高品质音质，降噪效果出色。续航时间长，支持快速充电。',
    stock: 50,
    sales: 856,
    isHot: true
  },
  {
    id: 3,
    name: '简约双肩包',
    price: 159,
    originalPrice: 229,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    category: '箱包',
    description: '大容量设计，多层收纳。防水面料，适合日常通勤和旅行。',
    stock: 80,
    sales: 567,
    isHot: false
  },
  {
    id: 4,
    name: '智能手表',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: '数码',
    description: '健康监测，运动追踪。支持多种运动模式，防水防尘。',
    stock: 30,
    sales: 423,
    isHot: true
  },
  {
    id: 5,
    name: '经典T恤',
    price: 79,
    originalPrice: 129,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: '服装',
    description: '纯棉面料，舒适亲肤。多色可选，百搭基础款。',
    stock: 200,
    sales: 2341,
    isHot: false
  },
  {
    id: 6,
    name: '便携水杯',
    price: 59,
    originalPrice: 99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    category: '生活',
    description: '保温保冷，304不锈钢内胆。便携设计，适合外出携带。',
    stock: 150,
    sales: 1876,
    isHot: false
  },
  {
    id: 7,
    name: '时尚太阳镜',
    price: 189,
    originalPrice: 289,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    category: '配饰',
    description: 'UV400防护，时尚造型。轻量化设计，佩戴舒适。',
    stock: 60,
    sales: 432,
    isHot: false
  },
  {
    id: 8,
    name: '机械键盘',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    category: '数码',
    description: '青轴手感，RGB背光。人体工学设计，打字更舒适。',
    stock: 40,
    sales: 654,
    isHot: true
  }
];

// 购物车数据（每个用户一个购物车，这里简化为单一购物车）
let cart = [];

// 订单数据
let orders = [];
let orderId = 1;

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 获取所有商品
app.get('/api/products', (req, res) => {
  const { category, search, sort } = req.query;
  let result = [...products];

  // 分类筛选
  if (category) {
    result = result.filter(p => p.category === category);
  }

  // 搜索
  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  // 排序
  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'sales') {
    result.sort((a, b) => b.sales - a.sales);
  }

  res.json({ success: true, data: result });
});

// 获取热门商品
app.get('/api/products/hot', (req, res) => {
  const hotProducts = products.filter(p => p.isHot);
  res.json({ success: true, data: hotProducts });
});

// 获取商品分类
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ success: true, data: categories });
});

// 获取单个商品详情
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, message: '商品不存在' });
  }
});

// 获取购物车
app.get('/api/cart', (req, res) => {
  res.json({ success: true, data: cart });
});

// 添加到购物车
app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: '商品不存在' });
  }

  // 检查库存
  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: '库存不足' });
  }

  // 检查购物车中是否已有该商品
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    // 更新数量
    existingItem.quantity += quantity;
  } else {
    // 添加新商品
    cart.push({
      id: Date.now(),
      productId,
      quantity,
      product
    });
  }

  res.json({ success: true, data: cart, message: '已添加到购物车' });
});

// 更新购物车商品数量
app.put('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity } = req.body;

  const item = cart.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: '购物车商品不存在' });
  }

  // 检查库存
  if (item.product.stock < quantity) {
    return res.status(400).json({ success: false, message: '库存不足' });
  }

  item.quantity = quantity;
  res.json({ success: true, data: cart });
});

// 删除购物车商品
app.delete('/api/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  cart = cart.filter(item => item.id !== id);
  res.json({ success: true, data: cart });
});

// 清空购物车
app.delete('/api/cart', (req, res) => {
  cart = [];
  res.json({ success: true, data: cart });
});

// 创建订单
app.post('/api/orders', (req, res) => {
  const { items, totalAmount, address, phone, name } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: '订单不能为空' });
  }

  // 验证库存并扣减
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: `商品 ${item.productId} 不存在` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ success: false, message: `商品 ${product.name} 库存不足` });
    }
    // 扣减库存
    product.stock -= item.quantity;
    // 增加销量
    product.sales += item.quantity;
  }

  const order = {
    id: orderId++,
    orderNo: `ORD${Date.now()}`,
    items,
    totalAmount,
    address,
    phone,
    name,
    status: 'pending', // pending, paid, shipped, completed, cancelled
    createTime: new Date().toISOString()
  };

  orders.push(order);

  // 清空购物车
  cart = [];

  res.json({ success: true, data: order, message: '订单创建成功' });
});

// 获取订单列表
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

// 获取订单详情
app.get('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);

  if (order) {
    res.json({ success: true, data: order });
  } else {
    res.status(404).json({ success: false, message: '订单不存在' });
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
  console.log(`商品数量: ${products.length}`);
});
