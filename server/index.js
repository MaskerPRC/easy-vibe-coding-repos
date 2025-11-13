import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ========== 内存数据存储 ==========
// 计件记录 { id, date, productName, quantity, unitPrice, totalPrice }
let pieceworkRecords = [];
let pieceworkIdCounter = 1;

// 计时记录 { id, date, jobName, hours, hourlyRate, totalPrice }
let timeRecords = [];
let timeIdCounter = 1;

// 工序产品 { id, name, unitPrice }
let products = [
  { id: 1, name: '工序产品', unitPrice: 1 }
];
let productIdCounter = 2;

// 工种 { id, name, hourlyRate }
let jobs = [
  { id: 1, name: '工种', hourlyRate: 2 },
  { id: 2, name: '工种2', hourlyRate: 5 }
];
let jobIdCounter = 3;

// 用户信息
let userInfo = {
  memberExpiry: '2055-12-31',
  enterpriseName: '志丰'
};

// ========== 计件相关接口 ==========

// 获取计件记录
app.get('/api/piecework', (req, res) => {
  const { year, month } = req.query;
  let records = [...pieceworkRecords];

  // 按日期过滤
  if (year && month) {
    records = records.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getFullYear() === parseInt(year) &&
             recordDate.getMonth() + 1 === parseInt(month);
    });
  }

  // 按日期分组
  const groupedRecords = records.reduce((acc, record) => {
    const date = record.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  res.json({
    success: true,
    data: groupedRecords,
    records: records
  });
});

// 添加计件记录
app.post('/api/piecework', (req, res) => {
  const { date, productId, productName, quantity, unitPrice } = req.body;

  const record = {
    id: pieceworkIdCounter++,
    date: date || new Date().toISOString(),
    productId,
    productName,
    quantity: parseFloat(quantity),
    unitPrice: parseFloat(unitPrice),
    totalPrice: parseFloat(quantity) * parseFloat(unitPrice)
  };

  pieceworkRecords.push(record);

  res.json({
    success: true,
    data: record
  });
});

// 删除计件记录
app.delete('/api/piecework/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = pieceworkRecords.findIndex(r => r.id === id);

  if (index !== -1) {
    pieceworkRecords.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: '记录不存在' });
  }
});

// ========== 计时相关接口 ==========

// 获取计时记录
app.get('/api/timework', (req, res) => {
  const { year, month } = req.query;
  let records = [...timeRecords];

  // 按日期过滤
  if (year && month) {
    records = records.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getFullYear() === parseInt(year) &&
             recordDate.getMonth() + 1 === parseInt(month);
    });
  }

  // 按日期分组
  const groupedRecords = records.reduce((acc, record) => {
    const date = record.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  res.json({
    success: true,
    data: groupedRecords,
    records: records
  });
});

// 添加计时记录
app.post('/api/timework', (req, res) => {
  const { date, jobId, jobName, hours, hourlyRate } = req.body;

  const record = {
    id: timeIdCounter++,
    date: date || new Date().toISOString(),
    jobId,
    jobName,
    hours: parseFloat(hours),
    hourlyRate: parseFloat(hourlyRate),
    totalPrice: parseFloat(hours) * parseFloat(hourlyRate)
  };

  timeRecords.push(record);

  res.json({
    success: true,
    data: record
  });
});

// 删除计时记录
app.delete('/api/timework/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = timeRecords.findIndex(r => r.id === id);

  if (index !== -1) {
    timeRecords.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: '记录不存在' });
  }
});

// ========== 产品管理接口 ==========

// 获取产品列表
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: products
  });
});

// 添加产品
app.post('/api/products', (req, res) => {
  const { name, unitPrice } = req.body;

  const product = {
    id: productIdCounter++,
    name,
    unitPrice: parseFloat(unitPrice)
  };

  products.push(product);

  res.json({
    success: true,
    data: product
  });
});

// 更新产品
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, unitPrice } = req.body;
  const index = products.findIndex(p => p.id === id);

  if (index !== -1) {
    products[index] = {
      ...products[index],
      name,
      unitPrice: parseFloat(unitPrice)
    };
    res.json({ success: true, data: products[index] });
  } else {
    res.status(404).json({ success: false, message: '产品不存在' });
  }
});

// 删除产品
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index !== -1) {
    products.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: '产品不存在' });
  }
});

// ========== 工种管理接口 ==========

// 获取工种列表
app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    data: jobs
  });
});

// 添加工种
app.post('/api/jobs', (req, res) => {
  const { name, hourlyRate } = req.body;

  const job = {
    id: jobIdCounter++,
    name,
    hourlyRate: parseFloat(hourlyRate)
  };

  jobs.push(job);

  res.json({
    success: true,
    data: job
  });
});

// 更新工种
app.put('/api/jobs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, hourlyRate } = req.body;
  const index = jobs.findIndex(j => j.id === id);

  if (index !== -1) {
    jobs[index] = {
      ...jobs[index],
      name,
      hourlyRate: parseFloat(hourlyRate)
    };
    res.json({ success: true, data: jobs[index] });
  } else {
    res.status(404).json({ success: false, message: '工种不存在' });
  }
});

// 删除工种
app.delete('/api/jobs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = jobs.findIndex(j => j.id === id);

  if (index !== -1) {
    jobs.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: '工种不存在' });
  }
});

// ========== 统计接口 ==========

// 获取统计数据
app.get('/api/statistics', (req, res) => {
  const { year, month } = req.query;

  // 过滤指定月份的记录
  let pieceworkFiltered = pieceworkRecords;
  let timeFiltered = timeRecords;

  if (year && month) {
    pieceworkFiltered = pieceworkRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getFullYear() === parseInt(year) &&
             recordDate.getMonth() + 1 === parseInt(month);
    });

    timeFiltered = timeRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getFullYear() === parseInt(year) &&
             recordDate.getMonth() + 1 === parseInt(month);
    });
  }

  // 计算总计
  const pieceworkTotal = pieceworkFiltered.reduce((sum, r) => sum + r.totalPrice, 0);
  const timeTotal = timeFiltered.reduce((sum, r) => sum + r.totalPrice, 0);
  const pieceworkCount = pieceworkFiltered.reduce((sum, r) => sum + r.quantity, 0);
  const timeHours = timeFiltered.reduce((sum, r) => sum + r.hours, 0);

  res.json({
    success: true,
    data: {
      pieceworkIncome: pieceworkTotal,
      timeIncome: timeTotal,
      totalIncome: pieceworkTotal + timeTotal,
      basicSalary: 0,
      socialSecurity: {
        total: 0,
        pension: 0,
        medical: 0,
        unemployment: 0,
        injury: 0
      },
      pieceworkCount,
      timeHours
    }
  });
});

// ========== 用户信息接口 ==========

// 获取用户信息
app.get('/api/user', (req, res) => {
  res.json({
    success: true,
    data: userInfo
  });
});

// 更新用户信息
app.put('/api/user', (req, res) => {
  const { memberExpiry, enterpriseName } = req.body;

  userInfo = {
    ...userInfo,
    memberExpiry: memberExpiry || userInfo.memberExpiry,
    enterpriseName: enterpriseName || userInfo.enterpriseName
  };

  res.json({
    success: true,
    data: userInfo
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
