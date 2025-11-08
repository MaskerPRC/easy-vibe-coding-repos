import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import DigitalNomad from '../views/DigitalNomad.vue';
import TodoList from '../views/TodoList.vue';

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
  },
  {
    path: '/todo',
    name: 'TodoList',
    component: TodoList
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
