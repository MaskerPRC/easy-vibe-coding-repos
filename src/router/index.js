import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import DigitalNomad from '../views/DigitalNomad.vue';
import TodoList from '../views/TodoList.vue';
import MedicineReminder from '../views/MedicineReminder.vue';
import Timer from '../views/Timer.vue';
import RetroNav from '../views/RetroNav.vue';
import SearchEngine from '../views/SearchEngine.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import About from '../views/About.vue';
import ClockOutReminder from '../views/ClockOutReminder.vue';
import WHVMaterials from '../views/WHVMaterials.vue';

const routes = [
  {
    path: '/',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/retro',
    name: 'RetroNav',
    component: RetroNav
  },
  {
    path: '/digital-nomad',
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
  },
  {
    path: '/search',
    name: 'SearchEngine',
    component: SearchEngine
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/clock-out',
    name: 'ClockOutReminder',
    component: ClockOutReminder
  },
  {
    path: '/whv',
    name: 'WHVMaterials',
    component: WHVMaterials
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
