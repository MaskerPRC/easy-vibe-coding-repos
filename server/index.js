import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储 - 用户保存的计划（重启后会丢失）
const userPlans = new Map();
let planIdCounter = 1;

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString(),
    message: '商业规划框架API运行正常'
  });
});

// 获取所有计划
app.get('/api/plans', (req, res) => {
  const plans = Array.from(userPlans.values());
  res.json({
    success: true,
    count: plans.length,
    data: plans
  });
});

// 获取单个计划
app.get('/api/plans/:id', (req, res) => {
  const { id } = req.params;
  const plan = userPlans.get(id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: '计划不存在'
    });
  }

  res.json({
    success: true,
    data: plan
  });
});

// 创建新计划
app.post('/api/plans', (req, res) => {
  const { title, answers } = req.body;

  if (!title || !answers) {
    return res.status(400).json({
      success: false,
      message: '缺少必要字段: title 和 answers'
    });
  }

  const newPlan = {
    id: `plan_${planIdCounter++}`,
    title,
    answers,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  userPlans.set(newPlan.id, newPlan);

  res.status(201).json({
    success: true,
    message: '计划创建成功',
    data: newPlan
  });
});

// 更新计划
app.put('/api/plans/:id', (req, res) => {
  const { id } = req.params;
  const { title, answers } = req.body;

  const plan = userPlans.get(id);

  if (!plan) {
    return res.status(404).json({
      success: false,
      message: '计划不存在'
    });
  }

  const updatedPlan = {
    ...plan,
    title: title || plan.title,
    answers: answers || plan.answers,
    updatedAt: new Date().toISOString()
  };

  userPlans.set(id, updatedPlan);

  res.json({
    success: true,
    message: '计划更新成功',
    data: updatedPlan
  });
});

// 删除计划
app.delete('/api/plans/:id', (req, res) => {
  const { id } = req.params;

  if (!userPlans.has(id)) {
    return res.status(404).json({
      success: false,
      message: '计划不存在'
    });
  }

  userPlans.delete(id);

  res.json({
    success: true,
    message: '计划删除成功'
  });
});

// 获取框架数据
app.get('/api/frameworks', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        title: '你在做的东西有什么价值?',
        items: [
          { label: '经济价值', content: '能赚多少钱 / 节省多少钱 / 多快能看到回报' },
          { label: '技术价值', content: '技术是不是有门槛,有没有壁垒' },
          { label: '核心要素', content: '必然性和信息差' }
        ]
      },
      {
        title: '时间维度怎么规划?',
        items: [
          { label: '起步时间', content: '冷启动需要多长时间' },
          { label: '数据验证', content: '多久能看到清晰的数据' },
          { label: '盈利周期', content: '什么时候考虑盈利或下一轮融资' }
        ]
      },
      {
        title: '人和钱从哪里来?',
        items: [
          { label: '团队背景', content: '技术团队的经验和能力' },
          { label: '资金来源', content: '天使投资人、个人投资者' },
          { label: '创业经验', content: '连续创业者的优势' }
        ]
      },
      {
        title: '商业模式和用户路径是否完整?',
        items: [
          { label: '目标客户', content: '2C / 2B / 2VC / 卖给大厂?' },
          { label: '盈利模式', content: '怎么赚钱,壁垒在哪' },
          { label: '用户获取', content: '用户在哪里,怎么找到,怎么转化' }
        ]
      }
    ]
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
  console.log(`商业规划框架后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`使用内存存储 - 数据在重启后会丢失`);
});
