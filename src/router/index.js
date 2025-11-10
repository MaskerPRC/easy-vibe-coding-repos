import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'StarGallery',
    component: () => import('../views/StarGallery.vue'),
    meta: { title: '明星写真展示 - Star Gallery' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '明星写真展示';
  next();
});

export default router;
