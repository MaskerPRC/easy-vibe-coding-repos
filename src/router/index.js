import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/meaning',
    name: 'Meaning',
    component: () => import('../views/Meaning.vue')
  },
  {
    path: '/wisdom',
    name: 'Wisdom',
    component: () => import('../views/Wisdom.vue')
  },
  {
    path: '/philosophy',
    name: 'Philosophy',
    component: () => import('../views/Philosophy.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
