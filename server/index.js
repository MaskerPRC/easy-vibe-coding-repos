import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储商品数据
let products = [
  {
    id: 1,
    name: '[慢严舒柠]咽炎片',
    spec: '0.25g*15片*2板/盒',
    price: 22,
    discountPrice: 16.92,
    quantity: 1,
    isPrescription: false
  },
  {
    id: 2,
    name: '[济川药业]蒲地蓝消炎口服液',
    spec: '10ml*10支/盒',
    price: 49,
    discountPrice: 37.6,
    quantity: 1,
    isPrescription: false
  },
  {
    id: 3,
    name: '[三金]西瓜霜润喉片',
    spec: '1.2g*12片/盒',
    price: 12.8,
    discountPrice: 12.54,
    quantity: 1,
    isPrescription: false
  },
  {
    id: 4,
    name: '[仁和]阿莫西林胶囊',
    spec: '0.25g*10粒*4板/盒',
    price: 15.8,
    discountPrice: 15.48,
    quantity: 1,
    isPrescription: true
  },
  {
    id: 5,
    name: '[999]抗病毒口服液',
    spec: '10ml*10支/盒',
    price: 29.9,
    discountPrice: 11.14,
    quantity: 1,
    isPrescription: false
  },
  {
    id: 6,
    name: '[三精]双黄连口服液',
    spec: '10ml*16支/盒',
    price: 39.8,
    discountPrice: 39,
    quantity: 1,
    isPrescription: false
  },
  {
    id: 7,
    name: '[仁和]多种维生素泡腾片(甜橙味)固体饮料',
    spec: '40g(4g*10片)/支',
    price: 9.8,
    discountPrice: 7.96,
    quantity: 1,
    isPrescription: false
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

// 获取所有商品
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products
  });
});

// 更新商品数量
app.put('/api/products/:id/quantity', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const product = products.find(p => p.id === parseInt(id));
  if (!product) {
    return res.status(404).json({
      success: false,
      message: '商品未找到'
    });
  }

  if (quantity < 1) {
    return res.status(400).json({
      success: false,
      message: '数量必须大于0'
    });
  }

  product.quantity = quantity;
  res.json({
    success: true,
    data: product
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

