import { createRouter, createWebHistory } from 'vue-router';
import RetroNav from '../views/RetroNav.vue';
import Landing from '../views/Landing.vue';
import V2exHot from '../views/V2exHot.vue';
import Fortune from '../views/Fortune.vue';
import Products from '../views/Products.vue';
import Blog from '../views/Blog.vue';
import Login from '../views/Login.vue';
import OpsCoffee from '../views/OpsCoffee.vue';
import SearchEngine from '../views/SearchEngine.vue';
import RandomSite from '../views/RandomSite.vue';
import FluidArt from '../views/FluidArt.vue';
import CanvaEditor from '../views/CanvaEditor.vue';

const routes = [
  {
    path: '/',
    name: 'RetroNav',
    component: RetroNav
  },
  {
    path: '/landing',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/v2ex',
    name: 'V2exHot',
    component: V2exHot
  },
  {
    path: '/fortune',
    name: 'Fortune',
    component: Fortune
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/ops-coffee',
    name: 'OpsCoffee',
    component: OpsCoffee
  },
  {
    path: '/search',
    name: 'SearchEngine',
    component: SearchEngine
  },
  {
    path: '/random-site',
    name: 'RandomSite',
    component: RandomSite
  },
  {
    path: '/fluid-art',
    name: 'FluidArt',
    component: FluidArt
  },
  {
    path: '/canva',
    name: 'CanvaEditor',
    component: CanvaEditor
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
