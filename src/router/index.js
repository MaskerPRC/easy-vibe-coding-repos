import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import MedicineDetail from '../views/MedicineDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/medicine/:id',
    name: 'MedicineDetail',
    component: MedicineDetail,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
