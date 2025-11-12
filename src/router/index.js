import { createRouter, createWebHistory } from 'vue-router'
import AirplaneCanvas from '../components/AirplaneCanvas.vue'

const routes = [
  {
    path: '/',
    name: 'Airplane',
    component: AirplaneCanvas
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
