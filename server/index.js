import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存数据存储
const nodes = [
  { id: 1, name: 'Python', title: 'Python', topics: 12453 },
  { id: 2, name: 'JavaScript', title: 'JavaScript', topics: 10234 },
  { id: 3, name: 'Vue.js', title: 'Vue.js', topics: 8567 },
  { id: 4, name: 'React', title: 'React', topics: 9234 },
  { id: 5, name: 'Node.js', title: 'Node.js', topics: 7654 },
  { id: 6, name: '程序员', title: '程序员', topics: 15678 },
  { id: 7, name: '分享发现', title: '分享发现', topics: 6543 },
  { id: 8, name: '酷工作', title: '酷工作', topics: 5432 },
];

const topics = [
  {
    id: 1,
    title: 'Vue 3.4 发布,新增性能优化特性',
    content: 'Vue 3.4 正式发布,带来了许多性能优化和新特性。包括响应式系统的进一步优化,编译器性能提升等...',
    node: 'Vue.js',
    nodeId: 3,
    author: 'yyx990803',
    avatar: 'https://avatars.githubusercontent.com/u/499550?v=4',
    replies: 45,
    views: 2345,
    lastReplyTime: '3 分钟前',
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    title: 'Vite 5.0 正式版发布',
    content: 'Vite 5.0 正式版已经发布,带来了更快的冷启动速度和更好的插件 API...',
    node: 'JavaScript',
    nodeId: 2,
    author: 'patak',
    avatar: 'https://avatars.githubusercontent.com/u/6551528?v=4',
    replies: 23,
    views: 1567,
    lastReplyTime: '15 分钟前',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: '分享一个开源的技术社区项目',
    content: '最近开发了一个类似 V2EX 的技术社区项目,使用 Vue 3 + Node.js 开发,欢迎大家提建议...',
    node: '分享发现',
    nodeId: 7,
    author: 'developer',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    replies: 67,
    views: 3456,
    lastReplyTime: '25 分钟前',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    title: '求推荐一款好用的代码编辑器',
    content: '最近在寻找一款适合前端开发的代码编辑器,VSCode 用腻了,想换个新鲜的...',
    node: '程序员',
    nodeId: 6,
    author: 'coder123',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    replies: 89,
    views: 4567,
    lastReplyTime: '1 小时前',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    title: 'Node.js 21 新特性一览',
    content: 'Node.js 21 带来了许多新特性,包括性能提升、新的 API 等...',
    node: 'Node.js',
    nodeId: 5,
    author: 'nodejs',
    avatar: 'https://avatars.githubusercontent.com/u/9950313?v=4',
    replies: 34,
    views: 2134,
    lastReplyTime: '2 小时前',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    title: 'Python 异步编程最佳实践',
    content: '分享一些 Python 异步编程的最佳实践和常见陷阱...',
    node: 'Python',
    nodeId: 1,
    author: 'pythonista',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    replies: 56,
    views: 3210,
    lastReplyTime: '3 小时前',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 7,
    title: 'React Server Components 深度解析',
    content: 'React Server Components 是 React 18 引入的新特性,让我们深入了解它的工作原理...',
    node: 'React',
    nodeId: 4,
    author: 'reactdev',
    avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
    replies: 41,
    views: 2890,
    lastReplyTime: '4 小时前',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 8,
    title: '招聘前端工程师 (远程)',
    content: '我们是一家创业公司,正在寻找有经验的前端工程师,支持远程工作...',
    node: '酷工作',
    nodeId: 8,
    author: 'hr_tech',
    avatar: 'https://avatars.githubusercontent.com/u/5?v=4',
    replies: 12,
    views: 1234,
    lastReplyTime: '5 小时前',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
];

// 热门节点 (前6个)
const hotNodes = nodes.slice(0, 6);

// API路由
// 获取所有节点
app.get('/api/nodes', (req, res) => {
  res.json(nodes);
});

// 获取热门节点
app.get('/api/nodes/hot', (req, res) => {
  res.json(hotNodes);
});

// 获取所有主题
app.get('/api/topics', (req, res) => {
  const { nodeId } = req.query;
  let filteredTopics = topics;

  if (nodeId) {
    filteredTopics = topics.filter(t => t.nodeId === parseInt(nodeId));
  }

  res.json(filteredTopics);
});

// 获取单个主题
app.get('/api/topics/:id', (req, res) => {
  const topic = topics.find(t => t.id === parseInt(req.params.id));
  if (topic) {
    res.json(topic);
  } else {
    res.status(404).json({ error: '主题不存在' });
  }
});

// 获取网站统计
app.get('/api/stats', (req, res) => {
  res.json({
    members: 3567,
    topics: topics.length,
    nodes: nodes.length
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

