/**
 * 种子数据生成模块
 * 用于在开发环境中提供演示数据
 */

export function generateSeedData() {
  // 演示用户
  const users = [
    {
      id: 1,
      githubId: 'demo-user-1',
      username: '演示用户',
      email: 'demo@example.com',
      avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
      createdAt: new Date('2024-01-01').toISOString()
    }
  ];

  // 演示项目
  const projects = [
    {
      id: 1,
      userId: 1,
      name: 'AI与机器学习',
      description: '关注最新的AI、机器学习和深度学习技术进展',
      keywords: ['AI', '机器学习', '深度学习', 'GPT', 'LLM', 'Transformer'],
      context: '我是一名AI研究人员,关注最新的AI技术进展,特别是大语言模型和生成式AI',
      priority: 5,
      threshold: 0.7,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 2,
      userId: 1,
      name: '前端开发',
      description: '前端开发相关的新技术和最佳实践',
      keywords: ['Vue', 'React', 'JavaScript', 'TypeScript', 'CSS', '前端'],
      context: '我是一名前端工程师,想了解最新的前端框架和工具',
      priority: 4,
      threshold: 0.6,
      createdAt: new Date('2024-01-02').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString()
    },
    {
      id: 3,
      userId: 1,
      name: '开源项目',
      description: '有趣的开源项目和社区动态',
      keywords: ['开源', 'GitHub', 'Git', 'Linux', 'Docker'],
      context: '我喜欢参与开源项目,关注开源社区的发展',
      priority: 3,
      threshold: 0.5,
      createdAt: new Date('2024-01-03').toISOString(),
      updatedAt: new Date('2024-01-03').toISOString()
    }
  ];

  // 演示信息源
  const sources = [
    {
      id: 1,
      userId: 1,
      name: 'Hacker News RSS',
      type: 'rss',
      url: 'https://hnrss.org/frontpage',
      config: {},
      interval: 3600,
      enabled: true,
      lastFetchedAt: null,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 2,
      userId: 1,
      name: 'Vue.js GitHub',
      type: 'github',
      url: 'https://github.com/vuejs/core',
      config: {},
      interval: 7200,
      enabled: true,
      lastFetchedAt: null,
      createdAt: new Date('2024-01-02').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString()
    },
    {
      id: 3,
      userId: 1,
      name: 'CSS Tricks Feed',
      type: 'rss',
      url: 'https://css-tricks.com/feed/',
      config: {},
      interval: 3600,
      enabled: true,
      lastFetchedAt: null,
      createdAt: new Date('2024-01-03').toISOString(),
      updatedAt: new Date('2024-01-03').toISOString()
    }
  ];

  // 演示消息 (一些模拟数据)
  const messages = [
    {
      id: 1,
      sourceId: 1,
      projectId: 1,
      title: 'GPT-4.5发布：更强大的语言理解能力',
      content: 'OpenAI今天宣布推出GPT-4.5,在多项基准测试中表现出色,尤其是在代码生成和逻辑推理方面有显著提升。新模型采用了改进的训练方法,能够更好地理解上下文和执行复杂任务。',
      url: 'https://example.com/gpt45-release',
      author: 'OpenAI Team',
      publishedAt: new Date('2024-11-10T10:00:00Z').toISOString(),
      relevanceScore: 0.92,
      scores: {
        topicMatch: 0.95,
        contextRelevance: 0.90,
        actionability: 0.88,
        urgency: 0.85
      },
      analysis: '这篇文章高度相关,讨论了最新的GPT模型发布,对于AI研究人员来说是重要的技术更新。',
      isRead: false,
      isImportant: true,
      isDuplicate: false,
      createdAt: new Date('2024-11-10T10:30:00Z').toISOString()
    },
    {
      id: 2,
      sourceId: 2,
      projectId: 2,
      title: 'Vue 3.4发布说明',
      content: 'Vue 3.4版本带来了性能优化和新的组合式API功能。此版本包含更好的TypeScript支持、改进的响应式系统性能,以及新的生命周期钩子。',
      url: 'https://github.com/vuejs/core/releases/tag/v3.4.0',
      author: 'Evan You',
      publishedAt: new Date('2024-11-09T14:00:00Z').toISOString(),
      relevanceScore: 0.88,
      scores: {
        topicMatch: 0.92,
        contextRelevance: 0.85,
        actionability: 0.90,
        urgency: 0.75
      },
      analysis: 'Vue.js的重要版本更新,包含多项性能优化和新特性,对前端开发者很有价值。',
      isRead: false,
      isImportant: false,
      isDuplicate: false,
      createdAt: new Date('2024-11-09T14:30:00Z').toISOString()
    },
    {
      id: 3,
      sourceId: 3,
      projectId: 2,
      title: 'CSS容器查询完全指南',
      content: '容器查询(Container Queries)是CSS的一个革命性特性,允许元素根据其容器的大小而不是视口大小来应用样式。本文详细介绍了容器查询的使用方法和最佳实践。',
      url: 'https://css-tricks.com/container-queries-guide',
      author: 'CSS Tricks',
      publishedAt: new Date('2024-11-08T09:00:00Z').toISOString(),
      relevanceScore: 0.75,
      scores: {
        topicMatch: 0.80,
        contextRelevance: 0.70,
        actionability: 0.75,
        urgency: 0.60
      },
      analysis: 'CSS新特性的实用指南,对于前端开发者了解现代CSS技术很有帮助。',
      isRead: true,
      isImportant: false,
      isDuplicate: false,
      createdAt: new Date('2024-11-08T09:30:00Z').toISOString()
    },
    {
      id: 4,
      sourceId: 1,
      projectId: 1,
      title: 'Transformer模型的最新改进',
      content: '研究人员提出了一种新的Transformer变体,在保持性能的同时大幅降低了计算成本。这项研究可能会影响未来的大语言模型设计。',
      url: 'https://example.com/transformer-improvements',
      author: 'AI Research Lab',
      publishedAt: new Date('2024-11-07T16:00:00Z').toISOString(),
      relevanceScore: 0.85,
      scores: {
        topicMatch: 0.90,
        contextRelevance: 0.82,
        actionability: 0.75,
        urgency: 0.70
      },
      analysis: '关于Transformer架构的重要研究,对AI研究人员很有参考价值。',
      isRead: true,
      isImportant: true,
      isDuplicate: false,
      createdAt: new Date('2024-11-07T16:30:00Z').toISOString()
    },
    {
      id: 5,
      sourceId: 2,
      projectId: 3,
      title: 'GitHub Copilot企业版更新',
      content: 'GitHub宣布为企业版Copilot添加新功能,包括自定义模型训练和更好的代码审查集成。',
      url: 'https://github.com/features/copilot/enterprise',
      author: 'GitHub',
      publishedAt: new Date('2024-11-06T11:00:00Z').toISOString(),
      relevanceScore: 0.68,
      scores: {
        topicMatch: 0.70,
        contextRelevance: 0.65,
        actionability: 0.70,
        urgency: 0.60
      },
      analysis: 'GitHub Copilot的企业功能更新,对开源开发者和团队协作有一定参考价值。',
      isRead: false,
      isImportant: false,
      isDuplicate: false,
      createdAt: new Date('2024-11-06T11:30:00Z').toISOString()
    }
  ];

  return {
    users,
    projects,
    sources,
    messages
  };
}
