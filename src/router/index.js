import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Game from '../pages/Game.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
