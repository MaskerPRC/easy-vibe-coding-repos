import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AdminPage from '../views/AdminPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
