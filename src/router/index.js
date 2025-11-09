import { createRouter, createWebHistory } from 'vue-router';
import ChatRoom from '../pages/ChatRoom.vue';
import PromptViewer from '../pages/PromptViewer.vue';

const routes = [
  {
    path: '/',
    name: 'ChatRoom',
    component: ChatRoom
  },
  {
    path: '/prompt',
    name: 'PromptViewer',
    component: PromptViewer
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
