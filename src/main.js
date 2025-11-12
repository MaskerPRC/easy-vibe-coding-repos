import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Admin from './Admin.vue';

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: App
    },
    {
      path: '/admin',
      component: Admin
    }
  ]
});

const app = createApp({
  template: '<router-view />'
});

app.use(router);
app.mount('#app');


