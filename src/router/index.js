/**
 * Vue Router 配置
 */

import { createRouter, createWebHistory } from 'vue-router';

// 导入页面组件
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Projects from '../views/Projects.vue';
import Sources from '../views/Sources.vue';
import Messages from '../views/Messages.vue';
import Statistics from '../views/Statistics.vue';
import Settings from '../views/Settings.vue';
import TransformMonitor from '../views/TransformMonitor.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: { requiresAuth: true }
  },
  {
    path: '/sources',
    name: 'Sources',
    component: Sources,
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/transform-monitor',
    name: 'TransformMonitor',
    component: TransformMonitor,
    meta: { requiresAuth: true }
  },
  // 404 页面 - 必须放在最后，捕获所有未匹配的路由
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !token) {
    // 需要认证但未登录，跳转到登录页
    next('/login');
  } else if (to.path === '/login' && token) {
    // 已登录但访问登录页，跳转到首页
    next('/');
  } else {
    next();
  }
});

export default router;
