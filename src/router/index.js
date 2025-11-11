import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Achievements from '../views/Achievements.vue';
import Timeline from '../views/Timeline.vue';
import Fans from '../views/Fans.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: Achievements
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: Timeline
  },
  {
    path: '/fans',
    name: 'Fans',
    component: Fans
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
