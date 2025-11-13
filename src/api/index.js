import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 计件相关接口
export const pieceworkAPI = {
  getRecords: (year, month) => api.get('/piecework', { params: { year, month } }),
  addRecord: (data) => api.post('/piecework', data),
  deleteRecord: (id) => api.delete(`/piecework/${id}`)
};

// 计时相关接口
export const timeworkAPI = {
  getRecords: (year, month) => api.get('/timework', { params: { year, month } }),
  addRecord: (data) => api.post('/timework', data),
  deleteRecord: (id) => api.delete(`/timework/${id}`)
};

// 产品管理接口
export const productAPI = {
  getAll: () => api.get('/products'),
  add: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

// 工种管理接口
export const jobAPI = {
  getAll: () => api.get('/jobs'),
  add: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`)
};

// 统计接口
export const statisticsAPI = {
  get: (year, month) => api.get('/statistics', { params: { year, month } })
};

// 用户信息接口
export const userAPI = {
  get: () => api.get('/user'),
  update: (data) => api.put('/user', data)
};

export default api;
