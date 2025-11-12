/**
 * Pinia 状态管理配置
 */

import { defineStore } from 'pinia';
import axios from 'axios';

// 配置 axios
axios.defaults.baseURL = '';  // 使用相对路径，通过 vite 代理
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 用户 Store
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/auth/test-login', credentials);
        this.user = response.data.user;
        this.token = response.data.token;
        this.isAuthenticated = true;

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    },

    async fetchUser() {
      try {
        const response = await axios.get('/api/user/me');
        this.user = response.data.user;
        return { success: true };
      } catch (error) {
        this.logout();
        return { success: false };
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

// 项目 Store
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
        const response = await axios.get('/api/projects');
        this.projects = response.data.projects;
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      } finally {
        this.loading = false;
      }
    },

    async createProject(projectData) {
      try {
        const response = await axios.post('/api/projects', projectData);
        this.projects.push(response.data.project);
        return { success: true, project: response.data.project };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    },

    async updateProject(id, updates) {
      try {
        const response = await axios.put(`/api/projects/${id}`, updates);
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          this.projects[index] = response.data.project;
        }
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    },

    async deleteProject(id) {
      try {
        await axios.delete(`/api/projects/${id}`);
        this.projects = this.projects.filter(p => p.id !== id);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    }
  }
});

// 信息源 Store
export const useSourceStore = defineStore('source', {
  state: () => ({
    sources: [],
    loading: false
  }),

  actions: {
    async fetchSources() {
      this.loading = true;
      try {
        const response = await axios.get('/api/sources');
        this.sources = response.data.sources;
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      } finally {
        this.loading = false;
      }
    },

    async createSource(sourceData) {
      try {
        const response = await axios.post('/api/sources', sourceData);
        this.sources.push(response.data.source);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    },

    async batchCreateSources(urls) {
      try {
        const response = await axios.post('/api/sources/batch', { urls });
        this.sources.push(...response.data.sources);
        return { success: true, count: response.data.count };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    },

    async updateSource(id, updates) {
      try {
        const response = await axios.put(`/api/sources/${id}`, updates);
        const index = this.sources.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sources[index] = response.data.source;
        }
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    },

    async deleteSource(id) {
      try {
        await axios.delete(`/api/sources/${id}`);
        this.sources = this.sources.filter(s => s.id !== id);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    }
  }
});

// 消息 Store
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
        const params = new URLSearchParams(filters).toString();
        const response = await axios.get(`/api/projects/${projectId}/messages?${params}`);
        this.messages = response.data.messages;
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      } finally {
        this.loading = false;
      }
    },

    async fetchStats(projectId) {
      try {
        const response = await axios.get(`/api/projects/${projectId}/messages/stats`);
        this.stats = response.data.stats;
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    },

    async markAsRead(id) {
      try {
        await axios.put(`/api/messages/${id}/read`);
        const message = this.messages.find(m => m.id === id);
        if (message) message.isRead = true;
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    },

    async markAsImportant(id, important = true) {
      try {
        await axios.put(`/api/messages/${id}/important`, { important });
        const message = this.messages.find(m => m.id === id);
        if (message) message.isImportant = important;
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    },

    async deleteMessage(id) {
      try {
        await axios.delete(`/api/messages/${id}`);
        this.messages = this.messages.filter(m => m.id !== id);
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    }
  }
});

// 系统 Store
export const useSystemStore = defineStore('system', {
  state: () => ({
    stats: {
      users: 0,
      projects: 0,
      sources: 0,
      messages: 0
    },
    taskStatus: null,
    aiConfig: null
  }),

  actions: {
    async fetchSystemStats() {
      try {
        const response = await axios.get('/api/system/stats');
        this.stats = response.data.stats;
        this.taskStatus = response.data.taskStatus;
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    },

    async runTask() {
      try {
        const response = await axios.post('/api/system/run-task');
        return { success: true, result: response.data.result };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    },

    async getAIConfig() {
      try {
        const response = await axios.get('/api/system/ai-config');
        this.aiConfig = response.data.status;
        return { success: true };
      } catch (error) {
        return { success: false };
      }
    },

    async setAIConfig(config) {
      try {
        const response = await axios.post('/api/system/ai-config', config);
        this.aiConfig = response.data.status;
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.error || error.message
        };
      }
    }
  }
});
