import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'DevArsenal',
    component: () => import('../views/DevArsenal.vue'),
    meta: { title: '独立开发者工具库 - Dev Arsenal' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '独立开发者工具库';
  next();
});

export default router;
