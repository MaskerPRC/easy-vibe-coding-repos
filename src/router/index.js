import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Test from '../views/Test.vue';
import Result from '../views/Result.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/result/:code',
    name: 'Result',
    component: Result,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
