import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'StarGallery',
    component: () => import('../views/StarGallery.vue'),
    meta: { title: '狗' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '狗';
  next();
});

export default router;
