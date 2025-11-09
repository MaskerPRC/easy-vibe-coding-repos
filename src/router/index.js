import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ZiWei from '../views/ZiWei.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ziwei',
    name: 'ZiWei',
    component: ZiWei
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
