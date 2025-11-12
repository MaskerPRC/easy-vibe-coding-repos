/**
 * 内存数据存储模块
 * 所有数据存储在内存中,重启后数据会丢失
 */

import { generateSeedData } from './seedData.js';

// 用户数据存储
const users = new Map();

// 项目数据存储
const projects = new Map();

// 信息源数据存储
const sources = new Map();

// 消息数据存储
const messages = new Map();

// ID 计数器
let userIdCounter = 1;
let projectIdCounter = 1;
let sourceIdCounter = 1;
let messageIdCounter = 1;

// ==================== 用户管理 ====================

export const userStorage = {
  // 创建用户
  create(userData) {
    const id = userIdCounter++;
    const user = {
      id,
      githubId: userData.githubId,
      username: userData.username,
      email: userData.email,
      avatar: userData.avatar,
      createdAt: new Date().toISOString(),
      ...userData
    };
    users.set(id, user);
    return user;
  },

  // 通过ID查找用户
  findById(id) {
    return users.get(id);
  },

  // 通过GitHub ID查找用户
  findByGithubId(githubId) {
    for (const user of users.values()) {
      if (user.githubId === githubId) {
        return user;
      }
    }
    return null;
  },

  // 获取所有用户
  getAll() {
    return Array.from(users.values());
  },

  // 更新用户
  update(id, updates) {
    const user = users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates };
    users.set(id, updated);
    return updated;
  },

  // 删除用户
  delete(id) {
    return users.delete(id);
  }
};

// ==================== 项目管理 ====================

export const projectStorage = {
  // 创建项目
  create(userId, projectData) {
    const id = projectIdCounter++;
    const project = {
      id,
      userId,
      name: projectData.name,
      description: projectData.description || '',
      keywords: projectData.keywords || [],
      context: projectData.context || '',
      priority: projectData.priority || 3,
      threshold: projectData.threshold || 0.6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...projectData
    };
    projects.set(id, project);
    return project;
  },

  // 通过ID查找项目
  findById(id) {
    return projects.get(id);
  },

  // 获取用户的所有项目
  findByUserId(userId) {
    const userProjects = [];
    for (const project of projects.values()) {
      if (project.userId === userId) {
        userProjects.push(project);
      }
    }
    return userProjects;
  },

  // 获取所有项目
  getAll() {
    return Array.from(projects.values());
  },

  // 更新项目
  update(id, updates) {
    const project = projects.get(id);
    if (!project) return null;
    const updated = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    projects.set(id, updated);
    return updated;
  },

  // 删除项目
  delete(id) {
    return projects.delete(id);
  }
};

// ==================== 信息源管理 ====================

export const sourceStorage = {
  // 创建信息源
  create(userId, sourceData) {
    const id = sourceIdCounter++;
    const source = {
      id,
      userId,
      name: sourceData.name,
      type: sourceData.type, // rss, api, website, github, twitter
      url: sourceData.url,
      config: sourceData.config || {},
      interval: sourceData.interval || 3600, // 轮询间隔(秒)
      enabled: sourceData.enabled !== false,
      lastFetchedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...sourceData
    };
    sources.set(id, source);
    return source;
  },

  // 通过ID查找信息源
  findById(id) {
    return sources.get(id);
  },

  // 获取用户的所有信息源
  findByUserId(userId) {
    const userSources = [];
    for (const source of sources.values()) {
      if (source.userId === userId) {
        userSources.push(source);
      }
    }
    return userSources;
  },

  // 获取启用的信息源
  findEnabled() {
    const enabled = [];
    for (const source of sources.values()) {
      if (source.enabled) {
        enabled.push(source);
      }
    }
    return enabled;
  },

  // 获取所有信息源
  getAll() {
    return Array.from(sources.values());
  },

  // 更新信息源
  update(id, updates) {
    const source = sources.get(id);
    if (!source) return null;
    const updated = {
      ...source,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    sources.set(id, updated);
    return updated;
  },

  // 删除信息源
  delete(id) {
    return sources.delete(id);
  },

  // 更新最后抓取时间
  updateLastFetched(id) {
    const source = sources.get(id);
    if (!source) return null;
    source.lastFetchedAt = new Date().toISOString();
    sources.set(id, source);
    return source;
  }
};

// ==================== 消息管理 ====================

export const messageStorage = {
  // 创建消息
  create(messageData) {
    const id = messageIdCounter++;
    const message = {
      id,
      sourceId: messageData.sourceId,
      projectId: messageData.projectId,
      title: messageData.title,
      content: messageData.content,
      url: messageData.url,
      author: messageData.author || '',
      publishedAt: messageData.publishedAt || new Date().toISOString(),
      // AI分析结果
      relevanceScore: messageData.relevanceScore || 0,
      scores: messageData.scores || {
        topicMatch: 0,
        contextRelevance: 0,
        actionability: 0,
        urgency: 0
      },
      analysis: messageData.analysis || '',
      // 消息状态
      isRead: false,
      isImportant: false,
      isDuplicate: false,
      createdAt: new Date().toISOString(),
      ...messageData
    };
    messages.set(id, message);
    return message;
  },

  // 通过ID查找消息
  findById(id) {
    return messages.get(id);
  },

  // 获取项目的所有消息
  findByProjectId(projectId, options = {}) {
    const projectMessages = [];
    for (const message of messages.values()) {
      if (message.projectId === projectId) {
        // 应用过滤器
        if (options.onlyUnread && message.isRead) continue;
        if (options.onlyImportant && !message.isImportant) continue;
        if (options.minScore && message.relevanceScore < options.minScore) continue;

        projectMessages.push(message);
      }
    }

    // 按时间倒序排序
    return projectMessages.sort((a, b) =>
      new Date(b.publishedAt) - new Date(a.publishedAt)
    );
  },

  // 获取信息源的所有消息
  findBySourceId(sourceId) {
    const sourceMessages = [];
    for (const message of messages.values()) {
      if (message.sourceId === sourceId) {
        sourceMessages.push(message);
      }
    }
    return sourceMessages.sort((a, b) =>
      new Date(b.publishedAt) - new Date(a.publishedAt)
    );
  },

  // 检查重复消息(基于URL)
  findDuplicateByUrl(url) {
    for (const message of messages.values()) {
      if (message.url === url) {
        return message;
      }
    }
    return null;
  },

  // 获取所有消息
  getAll() {
    return Array.from(messages.values());
  },

  // 更新消息
  update(id, updates) {
    const message = messages.get(id);
    if (!message) return null;
    const updated = { ...message, ...updates };
    messages.set(id, updated);
    return updated;
  },

  // 标记为已读
  markAsRead(id) {
    return this.update(id, { isRead: true });
  },

  // 标记为重要
  markAsImportant(id, important = true) {
    return this.update(id, { isImportant: important });
  },

  // 删除消息
  delete(id) {
    return messages.delete(id);
  },

  // 获取统计信息
  getStats(projectId) {
    let total = 0;
    let unread = 0;
    let important = 0;

    for (const message of messages.values()) {
      if (projectId && message.projectId !== projectId) continue;

      total++;
      if (!message.isRead) unread++;
      if (message.isImportant) important++;
    }

    return { total, unread, important };
  }
};

// ==================== 导出清理函数(用于测试) ====================

export function clearAllData() {
  users.clear();
  projects.clear();
  sources.clear();
  messages.clear();
  userIdCounter = 1;
  projectIdCounter = 1;
  sourceIdCounter = 1;
  messageIdCounter = 1;
}

// 导出获取统计信息的函数
export function getSystemStats() {
  return {
    users: users.size,
    projects: projects.size,
    sources: sources.size,
    messages: messages.size
  };
}

// ==================== 加载 Seed 数据 ====================

/**
 * 加载演示数据到内存中
 * 在服务器启动时调用,用于功能演示
 */
export function loadSeedData() {
  // 如果已有数据,跳过加载
  if (users.size > 0 || projects.size > 0 || sources.size > 0 || messages.size > 0) {
    console.log('检测到现有数据,跳过 seed 数据加载');
    return;
  }

  console.log('开始加载 seed 数据...');

  const seedData = generateSeedData();

  // 加载用户数据
  seedData.users.forEach(user => {
    users.set(user.id, user);
    if (user.id >= userIdCounter) userIdCounter = user.id + 1;
  });
  console.log(`✓ 加载了 ${seedData.users.length} 个用户`);

  // 加载项目数据
  seedData.projects.forEach(project => {
    projects.set(project.id, project);
    if (project.id >= projectIdCounter) projectIdCounter = project.id + 1;
  });
  console.log(`✓ 加载了 ${seedData.projects.length} 个项目`);

  // 加载信息源数据
  seedData.sources.forEach(source => {
    sources.set(source.id, source);
    if (source.id >= sourceIdCounter) sourceIdCounter = source.id + 1;
  });
  console.log(`✓ 加载了 ${seedData.sources.length} 个信息源`);

  // 加载消息数据
  seedData.messages.forEach(message => {
    messages.set(message.id, message);
    if (message.id >= messageIdCounter) messageIdCounter = message.id + 1;
  });
  console.log(`✓ 加载了 ${seedData.messages.length} 条消息`);

  console.log('✓ Seed 数据加载完成！');
  console.log('提示：可以使用测试用户登录 (用户名: 演示用户, ID: demo-user-1)');
}
