import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// 内存存储的搜索数据库（模拟搜索引擎的索引）
const searchDatabase = [
  {
    title: 'Vue.js - 渐进式 JavaScript 框架',
    url: 'https://cn.vuejs.org',
    link: 'https://cn.vuejs.org',
    description: 'Vue.js - 渐进式 JavaScript 框架。易学易用，性能出色，适用场景丰富的 Web 前端框架。',
    keywords: ['vue', 'javascript', '前端', '框架', 'web']
  },
  {
    title: 'React - 用于构建用户界面的 JavaScript 库',
    url: 'https://react.dev',
    link: 'https://react.dev',
    description: 'React 是一个用于构建用户界面的 JavaScript 库。由 Facebook 开发和维护，是目前最流行的前端框架之一。',
    keywords: ['react', 'javascript', '前端', '框架', 'facebook']
  },
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/zh-CN/',
    link: 'https://developer.mozilla.org/zh-CN/',
    description: 'MDN Web Docs 是一个提供开放网络(Open Web)技术有关的信息,包括 HTML、CSS 和 JavaScript 的网站。',
    keywords: ['mdn', 'javascript', 'html', 'css', 'web', '文档', '教程']
  },
  {
    title: 'GitHub - 开发者的代码托管平台',
    url: 'https://github.com',
    link: 'https://github.com',
    description: 'GitHub 是世界上最大的代码托管平台,拥有超过 1 亿开发者。在这里你可以找到各种开源项目,参与协作开发。',
    keywords: ['github', 'git', '代码', '开源', '协作']
  },
  {
    title: 'Stack Overflow - 程序员问答社区',
    url: 'https://stackoverflow.com',
    link: 'https://stackoverflow.com',
    description: 'Stack Overflow 是全球最大的程序员问答社区,你可以在这里提问、回答问题,学习编程知识。',
    keywords: ['stackoverflow', '问答', '编程', '社区', '学习']
  },
  {
    title: 'Node.js - JavaScript 运行时环境',
    url: 'https://nodejs.org',
    link: 'https://nodejs.org',
    description: 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境,可以让 JavaScript 运行在服务器端。',
    keywords: ['nodejs', 'javascript', '后端', '服务器', 'v8']
  },
  {
    title: 'TypeScript - JavaScript 的超集',
    url: 'https://www.typescriptlang.org',
    link: 'https://www.typescriptlang.org',
    description: 'TypeScript 是 JavaScript 的一个超集,它添加了可选的静态类型和基于类的面向对象编程。',
    keywords: ['typescript', 'javascript', '类型', '编程语言']
  },
  {
    title: 'Webpack - 现代 JavaScript 应用程序的静态模块打包工具',
    url: 'https://webpack.js.org',
    link: 'https://webpack.js.org',
    description: 'webpack 是一个用于现代 JavaScript 应用程序的静态模块打包工具。当 webpack 处理应用程序时,它会在内部构建一个依赖图。',
    keywords: ['webpack', 'javascript', '打包', '构建工具', '模块']
  },
  {
    title: 'Vite - 下一代前端开发与构建工具',
    url: 'https://vitejs.dev',
    link: 'https://vitejs.dev',
    description: 'Vite 是一种新型前端构建工具,能够显著提升前端开发体验。它主要由两部分组成:开发服务器和构建命令。',
    keywords: ['vite', 'javascript', '构建工具', '前端', '开发']
  },
  {
    title: 'Express - 快速、开放、极简的 Node.js Web 框架',
    url: 'https://expressjs.com',
    link: 'https://expressjs.com',
    description: 'Express 是一个保持最小规模的灵活的 Node.js Web 应用程序开发框架,为 Web 和移动应用程序提供一组强大的功能。',
    keywords: ['express', 'nodejs', 'web', '框架', '后端']
  },
  {
    title: 'MongoDB - 面向文档的 NoSQL 数据库',
    url: 'https://www.mongodb.com',
    link: 'https://www.mongodb.com',
    description: 'MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写,旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。',
    keywords: ['mongodb', '数据库', 'nosql', '文档数据库']
  },
  {
    title: 'Redis - 开源的内存数据结构存储',
    url: 'https://redis.io',
    link: 'https://redis.io',
    description: 'Redis 是一个开源的使用 ANSI C 语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value 数据库。',
    keywords: ['redis', '数据库', '缓存', '内存数据库']
  },
  {
    title: 'Docker - 容器化应用程序平台',
    url: 'https://www.docker.com',
    link: 'https://www.docker.com',
    description: 'Docker 是一个开源的应用容器引擎,让开发者可以打包他们的应用以及依赖包到一个可移植的容器中。',
    keywords: ['docker', '容器', '虚拟化', 'devops']
  },
  {
    title: 'Python - 简单易学的编程语言',
    url: 'https://www.python.org',
    link: 'https://www.python.org',
    description: 'Python 是一种解释型、面向对象、动态数据类型的高级程序设计语言。Python 的设计哲学强调代码的可读性。',
    keywords: ['python', '编程语言', '脚本', '数据分析']
  },
  {
    title: 'Java - 面向对象的编程语言',
    url: 'https://www.java.com',
    link: 'https://www.java.com',
    description: 'Java 是一门面向对象编程语言,不仅吸收了 C++ 语言的各种优点,还摒弃了 C++ 里难以理解的多继承、指针等概念。',
    keywords: ['java', '编程语言', '面向对象', 'jvm']
  },
  {
    title: 'Google - 全球最大的搜索引擎',
    url: 'https://www.google.com',
    link: 'https://www.google.com',
    description: 'Google 是全球最大的搜索引擎,提供网页搜索、图片搜索、视频搜索等多种搜索服务。',
    keywords: ['google', '搜索引擎', '搜索', '互联网']
  },
  {
    title: '百度 - 全球最大的中文搜索引擎',
    url: 'https://www.baidu.com',
    link: 'https://www.baidu.com',
    description: '百度是全球最大的中文搜索引擎,致力于让网民更便捷地获取信息,找到所求。',
    keywords: ['百度', '搜索引擎', '中文搜索', '互联网']
  },
  {
    title: '维基百科 - 自由的百科全书',
    url: 'https://zh.wikipedia.org',
    link: 'https://zh.wikipedia.org',
    description: '维基百科是一个自由内容、公开编辑且多语言的网络百科全书协作计划,通过Wiki技术使得所有人都可以简单地使用网页浏览器修改其中的内容。',
    keywords: ['维基百科', '百科全书', '知识', '百科']
  },
  {
    title: 'ChatGPT - OpenAI 的 AI 对话助手',
    url: 'https://chat.openai.com',
    link: 'https://chat.openai.com',
    description: 'ChatGPT 是由 OpenAI 开发的人工智能聊天机器人程序,于2022年11月推出。该程序使用基于GPT-3.5和GPT-4架构的大型语言模型。',
    keywords: ['chatgpt', 'ai', '人工智能', 'openai', '对话']
  },
  {
    title: 'VS Code - 强大的代码编辑器',
    url: 'https://code.visualstudio.com',
    link: 'https://code.visualstudio.com',
    description: 'Visual Studio Code 是一个轻量且强大的代码编辑器,支持 Windows、macOS 和 Linux。内置 JavaScript、TypeScript 和 Node.js 支持。',
    keywords: ['vscode', '编辑器', 'ide', '开发工具']
  }
];

// 搜索 API
app.get('/api/search', (req, res) => {
  try {
    const query = req.query.q;

    if (!query || !query.trim()) {
      return res.json({
        results: [],
        total: 0,
        query: ''
      });
    }

    const searchTerm = query.trim().toLowerCase();

    // 搜索算法：在标题、描述和关键词中查找匹配
    const results = searchDatabase
      .map(item => {
        let score = 0;

        // 标题匹配（权重最高）
        if (item.title.toLowerCase().includes(searchTerm)) {
          score += 10;
        }

        // 描述匹配
        if (item.description.toLowerCase().includes(searchTerm)) {
          score += 5;
        }

        // 关键词匹配
        const keywordMatch = item.keywords.some(keyword =>
          keyword.toLowerCase().includes(searchTerm) ||
          searchTerm.includes(keyword.toLowerCase())
        );
        if (keywordMatch) {
          score += 7;
        }

        // URL 匹配
        if (item.url.toLowerCase().includes(searchTerm)) {
          score += 3;
        }

        return { ...item, score };
      })
      .filter(item => item.score > 0)  // 只返回有匹配的结果
      .sort((a, b) => b.score - a.score)  // 按相关性排序
      .slice(0, 10)  // 最多返回10条结果
      .map(({ score, ...item }) => item);  // 移除 score 字段

    res.json({
      results,
      total: results.length > 0 ? Math.floor(Math.random() * 90000000) + 10000000 : 0,  // 模拟总结果数
      query: query.trim()
    });
  } catch (error) {
    console.error('搜索错误:', error);
    res.status(500).json({
      error: '搜索失败',
      message: error.message,
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

