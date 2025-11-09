import { createRouter, createWebHistory } from 'vue-router';
import V2exHot from '../views/V2exHot.vue';

const routes = [
  {
    path: '/',
    name: 'V2exHot',
    component: V2exHot
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
