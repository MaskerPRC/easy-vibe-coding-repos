// Seed 数据 - 用于功能演示
// 所有数据存储在内存中，重启后会重置

/**
 * 生成真实的 seed 数据
 */
function generateSeedData() {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  // 1. 创建演示用户
  const users = [
    {
      id: 'demo-user-1',
      githubId: 'demo123',
      username: '演示用户',
      email: 'demo@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      createdAt: now - 30 * dayInMs
    }
  ];

  // 2. 创建项目（信息筛选项目）
  const projects = [
    {
      id: 'project-1',
      userId: 'demo-user-1',
      name: 'AI 技术动态',
      description: '关注人工智能领域的最新技术进展、研究成果和产品发布',
      keywords: ['AI', '人工智能', 'Machine Learning', 'Deep Learning', 'GPT', 'LLM', '大模型', 'ChatGPT', 'Claude'],
      context: '我是一名 AI 工程师，关注 AI 领域的技术突破、新模型发布、应用案例和行业趋势',
      priority: 'high',
      threshold: 0.7,
      createdAt: now - 20 * dayInMs,
      updatedAt: now - 5 * dayInMs
    },
    {
      id: 'project-2',
      userId: 'demo-user-1',
      name: '前端开发资讯',
      description: '前端框架、工具、最佳实践和性能优化相关的资讯',
      keywords: ['Vue', 'React', 'JavaScript', 'TypeScript', 'Vite', 'Webpack', '前端', 'CSS', 'Web开发'],
      context: '我是前端开发者，需要了解前端技术栈的更新、新工具发布和开发最佳实践',
      priority: 'medium',
      threshold: 0.6,
      createdAt: now - 15 * dayInMs,
      updatedAt: now - 3 * dayInMs
    },
    {
      id: 'project-3',
      userId: 'demo-user-1',
      name: '开源项目趋势',
      description: '跟踪热门开源项目的更新和新兴项目',
      keywords: ['GitHub', 'Open Source', '开源', 'Star', 'Repository', '项目'],
      context: '关注 GitHub 上的热门项目、新兴技术栈和开源社区动态',
      priority: 'low',
      threshold: 0.5,
      createdAt: now - 10 * dayInMs,
      updatedAt: now - 2 * dayInMs
    }
  ];

  // 3. 创建信息源
  const sources = [
    {
      id: 'source-1',
      userId: 'demo-user-1',
      name: 'Hacker News',
      type: 'rss',
      url: 'https://hnrss.org/frontpage',
      config: {
        headers: {},
        parseOptions: {}
      },
      interval: 60,
      enabled: true,
      lastFetchedAt: now - 2 * 60 * 60 * 1000, // 2小时前
      createdAt: now - 20 * dayInMs,
      updatedAt: now - 2 * 60 * 60 * 1000
    },
    {
      id: 'source-2',
      userId: 'demo-user-1',
      name: 'TechCrunch AI',
      type: 'rss',
      url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
      config: {
        headers: {},
        parseOptions: {}
      },
      interval: 120,
      enabled: true,
      lastFetchedAt: now - 3 * 60 * 60 * 1000,
      createdAt: now - 18 * dayInMs,
      updatedAt: now - 3 * 60 * 60 * 1000
    },
    {
      id: 'source-3',
      userId: 'demo-user-1',
      name: 'Vue.js 官方博客',
      type: 'rss',
      url: 'https://blog.vuejs.org/feed.rss',
      config: {
        headers: {},
        parseOptions: {}
      },
      interval: 240,
      enabled: true,
      lastFetchedAt: now - 5 * 60 * 60 * 1000,
      createdAt: now - 15 * dayInMs,
      updatedAt: now - 5 * 60 * 60 * 1000
    },
    {
      id: 'source-4',
      userId: 'demo-user-1',
      name: 'GitHub Trending',
      type: 'github',
      url: 'https://github.com/trending',
      config: {
        language: 'javascript',
        since: 'daily'
      },
      interval: 180,
      enabled: true,
      lastFetchedAt: now - 4 * 60 * 60 * 1000,
      createdAt: now - 12 * dayInMs,
      updatedAt: now - 4 * 60 * 60 * 1000
    },
    {
      id: 'source-5',
      userId: 'demo-user-1',
      name: 'Medium - AI Topics',
      type: 'rss',
      url: 'https://medium.com/feed/tag/artificial-intelligence',
      config: {
        headers: {},
        parseOptions: {}
      },
      interval: 180,
      enabled: false, // 暂时禁用
      lastFetchedAt: now - 24 * 60 * 60 * 1000,
      createdAt: now - 8 * dayInMs,
      updatedAt: now - 1 * dayInMs
    }
  ];

  // 4. 创建消息（AI 分析后的新闻）
  const messages = [
    {
      id: 'msg-1',
      sourceId: 'source-2',
      projectId: 'project-1',
      title: 'OpenAI 发布 GPT-4 Turbo 模型，性能提升价格降低',
      content: 'OpenAI 在其首届开发者大会上发布了 GPT-4 Turbo 模型。新模型支持 128K 上下文窗口，知识更新至 2024 年 4 月，价格降低了 3 倍。此外，还推出了 Assistants API、DALL-E 3 API 和文本转语音 API。',
      url: 'https://techcrunch.com/2024/11/06/openai-announces-gpt-4-turbo/',
      originalContent: 'OpenAI held its first developer conference today, announcing GPT-4 Turbo with 128K context, updated knowledge through April 2024, and significantly reduced pricing...',
      relevanceScore: 0.95,
      scores: {
        topicMatch: 0.98,
        contextRelevance: 0.95,
        actionability: 0.92,
        urgency: 0.95
      },
      analysis: '这是 AI 领域的重大更新，GPT-4 Turbo 的发布将影响大量 AI 应用的开发。更长的上下文窗口和更低的价格使得更多复杂应用成为可能。',
      isRead: false,
      isImportant: true,
      isDuplicate: false,
      publishedAt: now - 6 * 60 * 60 * 1000, // 6小时前
      createdAt: now - 6 * 60 * 60 * 1000
    },
    {
      id: 'msg-2',
      sourceId: 'source-1',
      projectId: 'project-1',
      title: 'Meta 开源 Code Llama：专为编程优化的大语言模型',
      content: 'Meta 发布了 Code Llama，这是基于 Llama 2 的专门用于代码生成和理解的大语言模型。该模型提供了三个版本：基础版、Python 专用版和指令版，参数规模从 7B 到 34B。',
      url: 'https://news.ycombinator.com/item?id=37248494',
      originalContent: 'Meta has released Code Llama, a family of large language models for code based on Llama 2. Code Llama is available in three variants: foundation, Python specialized, and instruction-tuned...',
      relevanceScore: 0.92,
      scores: {
        topicMatch: 0.95,
        contextRelevance: 0.90,
        actionability: 0.88,
        urgency: 0.85
      },
      analysis: 'Code Llama 的开源为开发者提供了强大的代码辅助工具。34B 参数的模型在代码生成和补全任务上表现出色，可以集成到 IDE 中提升开发效率。',
      isRead: false,
      isImportant: true,
      isDuplicate: false,
      publishedAt: now - 12 * 60 * 60 * 1000,
      createdAt: now - 12 * 60 * 60 * 1000
    },
    {
      id: 'msg-3',
      sourceId: 'source-3',
      projectId: 'project-2',
      title: 'Vue 3.4 "Slam Dunk" 版本发布：响应式性能提升',
      content: 'Vue 3.4 正式发布，代号 "Slam Dunk"。此版本对响应式系统进行了重大重构，computed 属性性能提升 2 倍，大型数组性能提升 10 倍。同时改进了模板解析器和 SFC 编译性能。',
      url: 'https://blog.vuejs.org/posts/vue-3-4.html',
      originalContent: 'Vue 3.4 "Slam Dunk" is here! This release includes substantial internal improvements with a focus on reactivity performance...',
      relevanceScore: 0.88,
      scores: {
        topicMatch: 0.92,
        contextRelevance: 0.85,
        actionability: 0.90,
        urgency: 0.85
      },
      analysis: 'Vue 3.4 的性能提升对大型应用特别重要。响应式系统的优化将显著改善应用的运行时性能，建议尽快升级。',
      isRead: true,
      isImportant: false,
      isDuplicate: false,
      publishedAt: now - 18 * 60 * 60 * 1000,
      createdAt: now - 18 * 60 * 60 * 1000
    },
    {
      id: 'msg-4',
      sourceId: 'source-4',
      projectId: 'project-3',
      title: 'shadcn/ui - 基于 Radix UI 和 Tailwind CSS 的组件集合',
      content: '一个快速增长的开源项目，提供了可复制粘贴的精美 UI 组件。不是传统的组件库，而是可以直接复制到项目中的组件代码，完全可定制。已获得超过 40K stars。',
      url: 'https://github.com/shadcn/ui',
      originalContent: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source...',
      relevanceScore: 0.78,
      scores: {
        topicMatch: 0.80,
        contextRelevance: 0.75,
        actionability: 0.82,
        urgency: 0.70
      },
      analysis: '这个项目提供了一种新的组件库使用方式。通过直接复制代码而非安装依赖，开发者可以完全控制组件的实现和样式。',
      isRead: false,
      isImportant: false,
      isDuplicate: false,
      publishedAt: now - 24 * 60 * 60 * 1000,
      createdAt: now - 24 * 60 * 60 * 1000
    },
    {
      id: 'msg-5',
      sourceId: 'source-2',
      projectId: 'project-1',
      title: 'Google DeepMind 发布 Gemini Pro：多模态 AI 模型',
      content: 'Google DeepMind 推出 Gemini Pro，这是一个原生多模态的 AI 模型，可以无缝理解和处理文本、代码、音频、图像和视频。在多个基准测试中超越了 GPT-4。',
      url: 'https://techcrunch.com/2023/12/06/google-deepmind-gemini/',
      originalContent: 'Google DeepMind today announced Gemini, its most capable and general AI model to date. Gemini is natively multimodal...',
      relevanceScore: 0.94,
      scores: {
        topicMatch: 0.97,
        contextRelevance: 0.93,
        actionability: 0.90,
        urgency: 0.96
      },
      analysis: 'Gemini 的发布标志着多模态 AI 的重要进展。原生多模态设计使其在处理复杂任务时更加高效，对 AI 应用开发具有重要意义。',
      isRead: false,
      isImportant: true,
      isDuplicate: false,
      publishedAt: now - 30 * 60 * 60 * 1000,
      createdAt: now - 30 * 60 * 60 * 1000
    },
    {
      id: 'msg-6',
      sourceId: 'source-1',
      projectId: 'project-2',
      title: 'Vite 5.0 正式发布：更快的开发体验',
      content: 'Vite 5.0 版本发布，带来了显著的性能改进和新特性。包括对 Rollup 4 的支持、更快的冷启动、改进的 HMR 性能，以及更好的 TypeScript 支持。',
      url: 'https://news.ycombinator.com/item?id=38274136',
      originalContent: 'Vite 5.0 is out! This major release brings Rollup 4 support, faster cold starts, improved HMR performance...',
      relevanceScore: 0.85,
      scores: {
        topicMatch: 0.88,
        contextRelevance: 0.83,
        actionability: 0.85,
        urgency: 0.80
      },
      analysis: 'Vite 5.0 继续提升开发体验。更快的启动速度和 HMR 性能将进一步提高开发效率，对于使用 Vite 的项目建议升级。',
      isRead: true,
      isImportant: false,
      isDuplicate: false,
      publishedAt: now - 36 * 60 * 60 * 1000,
      createdAt: now - 36 * 60 * 60 * 1000
    },
    {
      id: 'msg-7',
      sourceId: 'source-2',
      projectId: 'project-1',
      title: 'Anthropic 推出 Claude 3 系列：Opus、Sonnet 和 Haiku',
      content: 'Anthropic 发布了 Claude 3 系列模型，包括 Opus、Sonnet 和 Haiku 三个版本。Claude 3 Opus 在多项基准测试中超越了 GPT-4，同时大幅提升了处理速度和降低了成本。',
      url: 'https://techcrunch.com/2024/03/04/anthropic-claude-3/',
      originalContent: 'Anthropic has launched Claude 3, a new family of AI models consisting of three variants: Opus, Sonnet, and Haiku...',
      relevanceScore: 0.96,
      scores: {
        topicMatch: 0.98,
        contextRelevance: 0.96,
        actionability: 0.94,
        urgency: 0.97
      },
      analysis: 'Claude 3 系列的发布为 AI 应用开发者提供了更多选择。三个不同级别的模型可以满足从高性能到高性价比的不同需求。',
      isRead: false,
      isImportant: true,
      isDuplicate: false,
      publishedAt: now - 2 * dayInMs,
      createdAt: now - 2 * dayInMs
    },
    {
      id: 'msg-8',
      sourceId: 'source-4',
      projectId: 'project-3',
      title: 'Bun 1.0 发布：全新的 JavaScript 运行时',
      content: 'Bun 1.0 正式发布，这是一个全新的 JavaScript 运行时，旨在替代 Node.js。Bun 原生支持 TypeScript、JSX，内置打包器、测试运行器和包管理器，启动速度比 Node.js 快 4 倍。',
      url: 'https://github.com/oven-sh/bun',
      originalContent: 'Bun 1.0 is officially here. Bun is a fast JavaScript runtime, bundler, transpiler, and package manager — all in one...',
      relevanceScore: 0.82,
      scores: {
        topicMatch: 0.85,
        contextRelevance: 0.80,
        actionability: 0.85,
        urgency: 0.78
      },
      analysis: 'Bun 的发布为 JavaScript 生态系统带来了新的选择。其出色的性能和一体化的工具链值得关注，适合在新项目中尝试。',
      isRead: false,
      isImportant: false,
      isDuplicate: false,
      publishedAt: now - 3 * dayInMs,
      createdAt: now - 3 * dayInMs
    },
    {
      id: 'msg-9',
      sourceId: 'source-1',
      projectId: 'project-1',
      title: 'Stability AI 开源 Stable Diffusion XL：图像生成新标准',
      content: 'Stability AI 开源了 Stable Diffusion XL (SDXL)，这是迄今为止最强大的开源图像生成模型。SDXL 生成的图像质量显著提升，细节更丰富，文字渲染更准确。',
      url: 'https://news.ycombinator.com/item?id=36826496',
      originalContent: 'Stable Diffusion XL is now open source. SDXL generates images of higher quality and more detailed compositions...',
      relevanceScore: 0.87,
      scores: {
        topicMatch: 0.90,
        contextRelevance: 0.85,
        actionability: 0.88,
        urgency: 0.85
      },
      analysis: 'SDXL 的开源为图像生成应用提供了更强大的基础。改进的图像质量和文字渲染能力使其在更多场景中可用。',
      isRead: false,
      isImportant: false,
      isDuplicate: false,
      publishedAt: now - 4 * dayInMs,
      createdAt: now - 4 * dayInMs
    },
    {
      id: 'msg-10',
      sourceId: 'source-3',
      projectId: 'project-2',
      title: 'Vue 3.3 "Rurouni Kenshin" 发布：TypeScript 支持增强',
      content: 'Vue 3.3 版本发布，主要改进了 TypeScript 支持。新增了 defineOptions、泛型组件、外部类型导入等特性，显著提升了 TypeScript 开发体验。',
      url: 'https://blog.vuejs.org/posts/vue-3-3.html',
      originalContent: 'Vue 3.3 has landed! This release is focused on improving the developer experience, especially for TypeScript users...',
      relevanceScore: 0.83,
      scores: {
        topicMatch: 0.86,
        contextRelevance: 0.82,
        actionability: 0.85,
        urgency: 0.78
      },
      analysis: 'Vue 3.3 的 TypeScript 改进使得类型安全的开发更加便捷。新增的特性简化了常见的开发模式，提升了代码质量。',
      isRead: true,
      isImportant: false,
      isDuplicate: false,
      publishedAt: now - 5 * dayInMs,
      createdAt: now - 5 * dayInMs
    },
    {
      id: 'msg-11',
      sourceId: 'source-2',
      projectId: 'project-1',
      title: 'OpenAI 推出 GPT-4 Vision API：多模态能力开放',
      content: 'OpenAI 正式开放 GPT-4 Vision API，允许开发者在应用中集成图像理解能力。API 可以分析图片内容、识别物体、阅读文本，并与用户进行多模态对话。',
      url: 'https://techcrunch.com/2023/09/25/openai-gpt-4-vision-api/',
      originalContent: 'OpenAI has opened access to GPT-4 with vision (GPT-4V) via API. The multimodal model can accept images and answer questions about them...',
      relevanceScore: 0.91,
      scores: {
        topicMatch: 0.94,
        contextRelevance: 0.90,
        actionability: 0.92,
        urgency: 0.88
      },
      analysis: 'GPT-4 Vision API 的开放使得构建多模态 AI 应用变得更加容易。图像理解能力可以应用于教育、医疗、设计等多个领域。',
      isRead: false,
      isImportant: true,
      isDuplicate: false,
      publishedAt: now - 6 * dayInMs,
      createdAt: now - 6 * dayInMs
    },
    {
      id: 'msg-12',
      sourceId: 'source-4',
      projectId: 'project-3',
      title: 'Tauri 2.0 Beta：使用 Rust 构建跨平台桌面应用',
      content: 'Tauri 2.0 进入 Beta 阶段，这是一个使用 Web 技术构建轻量级桌面应用的框架。与 Electron 相比，Tauri 应用体积更小，内存占用更低，同时提供了更好的安全性。',
      url: 'https://github.com/tauri-apps/tauri',
      originalContent: 'Tauri 2.0 Beta is now available. Build smaller, faster, and more secure desktop applications with a web frontend...',
      relevanceScore: 0.76,
      scores: {
        topicMatch: 0.78,
        contextRelevance: 0.75,
        actionability: 0.80,
        urgency: 0.72
      },
      analysis: 'Tauri 2.0 为桌面应用开发提供了一个轻量级的替代方案。对于需要构建跨平台桌面应用的项目，Tauri 是值得考虑的选择。',
      isRead: false,
      isImportant: false,
      isDuplicate: false,
      publishedAt: now - 7 * dayInMs,
      createdAt: now - 7 * dayInMs
    }
  ];

  return {
    users,
    projects,
    sources,
    messages
  };
}

export {
  generateSeedData
};
