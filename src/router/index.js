import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import DinosaurGame from '../pages/DinosaurGame.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game',
    name: 'DinosaurGame',
    component: DinosaurGame
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
