import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TodoList from '../views/TodoList.vue'
import FishTracker from '../views/FishTracker.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/todo',
    name: 'TodoList',
    component: TodoList
  },
  {
    path: '/fish',
    name: 'FishTracker',
    component: FishTracker
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
