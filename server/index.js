import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储的模拟搜索数据（不使用任何外部文件或数据库）
const searchDatabase = [
  {
    title: '百度百科_全球领先的中文百科全书',
    url: 'https://baike.baidu.com/',
    description: '百度百科是一部内容开放、自由的网络百科全书，旨在创造一个涵盖所有领域知识，服务所有互联网用户的中文知识性百科全书。'
  },
  {
    title: '百度知道 - 全球领先中文互动问答平台',
    url: 'https://zhidao.baidu.com/',
    description: '百度知道是由全球领先的中文搜索引擎百度自主研发、基于搜索的互动式知识问答分享平台。用户可以提出问题、解决问题。'
  },
  {
    title: '百度贴吧——全球领先的中文社区',
    url: 'https://tieba.baidu.com/',
    description: '百度贴吧是全球领先的中文社区，拥有超过10亿用户，是基于关键词的主题交流社区。贴吧让志同道合的人相聚。'
  },
  {
    title: 'Vue.js - 渐进式 JavaScript 框架',
    url: 'https://cn.vuejs.org/',
    description: 'Vue.js是一套用于构建用户界面的渐进式JavaScript框架。易学易用，性能出色，适用场景丰富的 Web 前端框架。'
  },
  {
    title: 'JavaScript | MDN Web 文档',
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript',
    description: 'JavaScript (JS) 是一种具有函数优先特性的轻量级、解释型或者说即时编译型的编程语言。'
  },
  {
    title: 'Node.js 中文网',
    url: 'https://nodejs.cn/',
    description: 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境。Node.js 使用高效、轻量级的事件驱动、非阻塞 I/O 模型。'
  },
  {
    title: 'GitHub - 全球最大的代码托管平台',
    url: 'https://github.com/',
    description: 'GitHub是全球最大的代码托管平台，为开发者提供代码托管服务，也是开源协作社区。数百万开发者在这里构建软件。'
  },
  {
    title: 'Stack Overflow - 程序员问答社区',
    url: 'https://stackoverflow.com/',
    description: 'Stack Overflow是一个与程序相关的IT技术问答网站。用户可以在网站免费提交问题，浏览问题，索引相关内容。'
  },
  {
    title: 'React - 用于构建用户界面的 JavaScript 库',
    url: 'https://react.dev/',
    description: 'React 是一个用于构建 Web 和原生交互界面的库。由 Facebook 开发，已成为最流行的前端框架之一。'
  },
  {
    title: 'TypeScript - JavaScript的超集',
    url: 'https://www.typescriptlang.org/',
    description: 'TypeScript 是 JavaScript 的超集，添加了可选的静态类型和基于类的面向对象编程。由微软开发和维护。'
  },
  {
    title: 'CSS-Tricks - CSS技巧和前端开发',
    url: 'https://css-tricks.com/',
    description: 'CSS-Tricks 是一个关于CSS、HTML、JavaScript等前端技术的网站，提供教程、技巧和最新的前端开发资讯。'
  },
  {
    title: 'W3School - 学习 Web 技术',
    url: 'https://www.w3school.com.cn/',
    description: 'W3School 是因特网上最大的WEB开发者资源，提供全面的网站建设教程，完全免费。'
  },
  {
    title: '掘金 - 代码不止，掘金不停',
    url: 'https://juejin.cn/',
    description: '掘金是一个帮助开发者成长的社区，是给开发者用的Hacker News，技术文章由稀土上聚集的技术大牛和开发者共同编辑为你筛选出最优质的干货。'
  },
  {
    title: 'SegmentFault 思否 - 技术问答社区',
    url: 'https://segmentfault.com/',
    description: 'SegmentFault 思否是中国领先的开发者技术社区。我们以技术问答、技术专栏、技术课程、技术资讯为核心的产品形态。'
  },
  {
    title: 'Vite - 下一代前端开发与构建工具',
    url: 'https://cn.vitejs.dev/',
    description: 'Vite是下一代前端开发与构建工具。利用浏览器原生 ES 模块特性，提供了极速的开发体验。'
  },
  {
    title: 'NPM - Node包管理器',
    url: 'https://www.npmjs.com/',
    description: 'npm 是 JavaScript 世界的包管理工具，也是 Node.js 平台的默认包管理工具。'
  },
  {
    title: 'Express - Node.js Web应用框架',
    url: 'https://expressjs.com/',
    description: 'Express 是一个保持最小规模的灵活的 Node.js Web 应用程序开发框架，为 Web 和移动应用程序提供一组强大的功能。'
  },
  {
    title: 'Axios - 基于Promise的HTTP客户端',
    url: 'https://axios-http.com/',
    description: 'Axios 是一个基于 promise 的网络请求库，可以用于浏览器和 node.js。'
  },
  {
    title: 'Webpack - 静态模块打包工具',
    url: 'https://webpack.js.org/',
    description: 'webpack 是一个现代 JavaScript 应用程序的静态模块打包器。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图。'
  },
  {
    title: 'Babel - JavaScript 编译器',
    url: 'https://babeljs.io/',
    description: 'Babel 是一个 JavaScript 编译器，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法。'
  },
  {
    title: 'Vue Router - Vue.js 官方路由',
    url: 'https://router.vuejs.org/',
    description: 'Vue Router 是 Vue.js 的官方路由。它与 Vue.js 核心深度集成，让用 Vue.js 构建单页应用变得轻而易举。'
  },
  {
    title: 'Pinia - Vue 状态管理库',
    url: 'https://pinia.vuejs.org/',
    description: 'Pinia 是 Vue 的状态管理库，支持 Vue 2 和 Vue 3，提供了更简单的 API 和更好的 TypeScript 支持。'
  },
  {
    title: '前端开发者手册 2023',
    url: 'https://frontendmasters.com/handbook/',
    description: '这是一本可以供任何人使用的指南，用于学习前端开发的实践。它概述并讨论了前端工程的实践。'
  },
  {
    title: 'Can I Use - 浏览器兼容性查询',
    url: 'https://caniuse.com/',
    description: 'Can I Use 提供最新的浏览器支持表，支持桌面和移动Web浏览器上的前端Web技术。'
  },
  {
    title: 'MDN Web Docs - Web开发者资源',
    url: 'https://developer.mozilla.org/zh-CN/',
    description: 'MDN Web Docs 为开发者提供开放网络（Open Web）技术有关的信息，包括用于网站和渐进式网络应用的 HTML、CSS 和 API。'
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

// 搜索 API
app.get('/api/search', (req, res) => {
  try {
    const { q, page = 1 } = req.query;

    // 验证查询参数
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        error: '请提供搜索关键词',
        results: [],
        total: 0
      });
    }

    const searchTerm = q.toLowerCase().trim();
    const pageNum = parseInt(page, 10) || 1;
    const pageSize = 10;

    // 在内存数据中搜索（匹配标题、URL或描述）
    const filteredResults = searchDatabase.filter(item => {
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.url.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    });

    // 计算分页
    const totalResults = filteredResults.length;
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    // 返回搜索结果
    res.json({
      results: paginatedResults,
      total: totalResults,
      page: pageNum,
      pageSize: pageSize,
      query: q
    });
  } catch (error) {
    console.error('搜索错误:', error);
    res.status(500).json({
      error: '搜索服务暂时不可用',
      results: [],
      total: 0
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

