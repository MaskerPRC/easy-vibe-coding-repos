import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import DigitalNomad from '../views/DigitalNomad.vue';
import TodoList from '../views/TodoList.vue';
import MedicineReminder from '../views/MedicineReminder.vue';
import Timer from '../views/Timer.vue';

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
  },
  {
    path: '/medicine',
    name: 'MedicineReminder',
    component: MedicineReminder
  },
  {
    path: '/timer',
    name: 'Timer',
    component: Timer
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
