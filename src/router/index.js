import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'PMFIntro',
    component: () => import('../views/PMFIntro.vue'),
    meta: { title: 'PMF（Product Market Fit）与产品管理' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'PMF介绍';
  next();
});

export default router;
