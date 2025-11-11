import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '../components/MainMenu.vue'
import GameArena from '../components/GameArena.vue'

const routes = [
  {
    path: '/',
    name: 'MainMenu',
    component: MainMenu
  },
  {
    path: '/game',
    name: 'Game',
    component: GameArena
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
