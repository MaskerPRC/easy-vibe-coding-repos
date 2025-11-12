/**
 * Pinia 状态管理
 * 管理用户、项目、信息源、消息和系统状态
 */

import { defineStore } from 'pinia';
import axios from 'axios';

// API 基础路径
const API_BASE = '/api';

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000
});

// ==================== 用户 Store ====================

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  actions: {
    async login() {
      try {
        const response = await api.post('/auth/test-login');
        this.user = response.data.user;
        this.token = response.data.token;
        this.isAuthenticated = true;
        return response.data;
      } catch (error) {
        console.error('登录失败:', error);
        throw error;
      }
    },

    async fetchUser() {
      try {
        const response = await api.get('/user/me');
        this.user = response.data.user;
        this.isAuthenticated = true;
        return response.data;
      } catch (error) {
        console.error('获取用户失败:', error);
        this.isAuthenticated = false;
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
    }
  }
});

// ==================== 项目 Store ====================

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
    loading: false
  }),

  actions: {
    async fetchProjects() {
      this.loading = true;
      try {
        const response = await api.get('/projects');
        this.projects = response.data.projects;
        return response.data;
      } catch (error) {
        console.error('获取项目失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createProject(projectData) {
      try {
        const response = await api.post('/projects', projectData);
        this.projects.push(response.data.project);
        return { success: true, project: response.data.project };
      } catch (error) {
        console.error('创建项目失败:', error);
        return { success: false, error: error.message };
      }
    },

    async updateProject(id, updates) {
      try {
        const response = await api.put(`/projects/${id}`, updates);
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          this.projects[index] = response.data.project;
        }
        return { success: true, project: response.data.project };
      } catch (error) {
        console.error('更新项目失败:', error);
        return { success: false, error: error.message };
      }
    },

    async deleteProject(id) {
      try {
        await api.delete(`/projects/${id}`);
        this.projects = this.projects.filter(p => p.id !== id);
        return { success: true };
      } catch (error) {
        console.error('删除项目失败:', error);
        return { success: false, error: error.message };
      }
    }
  }
});

// ==================== 信息源 Store ====================

export const useSourceStore = defineStore('source', {
  state: () => ({
    sources: [],
    loading: false
  }),

  actions: {
    async fetchSources() {
      this.loading = true;
      try {
        const response = await api.get('/sources');
        this.sources = response.data.sources;
        return response.data;
      } catch (error) {
        console.error('获取信息源失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createSource(sourceData) {
      try {
        const response = await api.post('/sources', sourceData);
        this.sources.push(response.data.source);
        return { success: true, source: response.data.source };
      } catch (error) {
        console.error('创建信息源失败:', error);
        return { success: false, error: error.message };
      }
    },

    async batchCreateSources(urls) {
      try {
        const response = await api.post('/sources/batch', { urls });
        this.sources.push(...response.data.sources);
        return { success: true, sources: response.data.sources };
      } catch (error) {
        console.error('批量创建信息源失败:', error);
        return { success: false, error: error.message };
      }
    },

    async updateSource(id, updates) {
      try {
        const response = await api.put(`/sources/${id}`, updates);
        const index = this.sources.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sources[index] = response.data.source;
        }
        return { success: true, source: response.data.source };
      } catch (error) {
        console.error('更新信息源失败:', error);
        return { success: false, error: error.message };
      }
    },

    async deleteSource(id) {
      try {
        await api.delete(`/sources/${id}`);
        this.sources = this.sources.filter(s => s.id !== id);
        return { success: true };
      } catch (error) {
        console.error('删除信息源失败:', error);
        return { success: false, error: error.message };
      }
    }
  }
});

// ==================== 消息 Store ====================

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [],
    stats: {
      total: 0,
      unread: 0,
      important: 0
    },
    loading: false
  }),

  actions: {
    async fetchMessages(projectId, filters = {}) {
      this.loading = true;
      try {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/projects/${projectId}/messages?${params}`);
        this.messages = response.data.messages;
        return response.data;
      } catch (error) {
        console.error('获取消息失败:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStats(projectId) {
      try {
        const response = await api.get(`/projects/${projectId}/stats`);
        this.stats = response.data.stats;
        return response.data;
      } catch (error) {
        console.error('获取消息统计失败:', error);
        throw error;
      }
    },

    async markAsRead(id) {
      try {
        const response = await api.put(`/messages/${id}/read`);
        const index = this.messages.findIndex(m => m.id === id);
        if (index !== -1) {
          this.messages[index] = response.data.message;
        }
        return { success: true, message: response.data.message };
      } catch (error) {
        console.error('标记已读失败:', error);
        return { success: false, error: error.message };
      }
    },

    async markAsImportant(id, important) {
      try {
        const response = await api.put(`/messages/${id}/important`, { important });
        const index = this.messages.findIndex(m => m.id === id);
        if (index !== -1) {
          this.messages[index] = response.data.message;
        }
        return { success: true, message: response.data.message };
      } catch (error) {
        console.error('标记重要失败:', error);
        return { success: false, error: error.message };
      }
    },

    async deleteMessage(id) {
      try {
        await api.delete(`/messages/${id}`);
        this.messages = this.messages.filter(m => m.id !== id);
        return { success: true };
      } catch (error) {
        console.error('删除消息失败:', error);
        return { success: false, error: error.message };
      }
    }
  }
});

// ==================== 系统 Store ====================

export const useSystemStore = defineStore('system', {
  state: () => ({
    stats: {
      users: 0,
      projects: 0,
      sources: 0,
      messages: 0
    },
    taskStatus: {
      isRunning: false,
      lastRunTime: null,
      stats: {
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
        messagesProcessed: 0,
        messagesCreated: 0
      }
    },
    aiConfig: {
      enabled: false,
      hasApiKey: false,
      model: ''
    }
  }),

  actions: {
    async fetchSystemStats() {
      try {
        const response = await api.get('/system/stats');
        this.stats = response.data.stats;
        this.taskStatus = response.data.taskStatus;
        return response.data;
      } catch (error) {
        console.error('获取系统统计失败:', error);
        throw error;
      }
    },

    async runTask() {
      try {
        const response = await api.post('/system/run-task');
        await this.fetchSystemStats();
        return response.data.result;
      } catch (error) {
        console.error('执行任务失败:', error);
        throw error;
      }
    },

    async getAIConfig() {
      try {
        const response = await api.get('/system/ai-config');
        this.aiConfig = response.data.status;
        return response.data;
      } catch (error) {
        console.error('获取AI配置失败:', error);
        throw error;
      }
    },

    async setAIConfig(config) {
      try {
        const response = await api.post('/system/ai-config', config);
        await this.getAIConfig();
        return { success: true };
      } catch (error) {
        console.error('设置AI配置失败:', error);
        return { success: false, error: error.message };
      }
    }
  }
});
