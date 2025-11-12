import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import CaseDetail from './views/CaseDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/case/:id',
    name: 'CaseDetail',
    component: CaseDetail
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
