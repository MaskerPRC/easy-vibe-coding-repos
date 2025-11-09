import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import ChatRoom from '../pages/ChatRoom.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/chat',
    name: 'ChatRoom',
    component: ChatRoom
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
