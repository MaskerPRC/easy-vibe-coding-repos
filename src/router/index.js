import { createRouter, createWebHistory } from 'vue-router';
import SearchHome from '../components/SearchHome.vue';
import SearchResults from '../components/SearchResults.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SearchHome
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchResults
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
