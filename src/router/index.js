import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import DigitalNomad from '../views/DigitalNomad.vue';

const routes = [
  {
    path: '/',
    name: 'DigitalNomad',
    component: DigitalNomad
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
