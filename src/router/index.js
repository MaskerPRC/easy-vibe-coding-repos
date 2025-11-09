import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../views/Landing.vue';
import V2exHot from '../views/V2exHot.vue';
import Fortune from '../views/Fortune.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/v2ex',
    name: 'V2exHot',
    component: V2exHot
  },
  {
    path: '/fortune',
    name: 'Fortune',
    component: Fortune
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
