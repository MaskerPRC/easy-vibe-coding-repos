import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
