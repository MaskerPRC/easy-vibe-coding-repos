import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/piecework'
  },
  {
    path: '/piecework',
    name: 'Piecework',
    component: () => import('../views/Piecework.vue')
  },
  {
    path: '/timework',
    name: 'Timework',
    component: () => import('../views/Timework.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('../views/Statistics.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/product-management',
    name: 'ProductManagement',
    component: () => import('../views/ProductManagement.vue')
  },
  {
    path: '/job-management',
    name: 'JobManagement',
    component: () => import('../views/JobManagement.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
