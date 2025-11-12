/**
 * Vue Router 配置
 */

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { title: '仪表盘' }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../views/Messages.vue'),
    meta: { title: '消息盒子' }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Projects.vue'),
    meta: { title: '项目管理' }
  },
  {
    path: '/sources',
    name: 'Sources',
    component: () => import('../views/Sources.vue'),
    meta: { title: '信息源' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - AI新闻去重推送` : 'AI新闻去重推送';
  next();
});

export default router;
