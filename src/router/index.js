import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AdminPanel from '../views/AdminPanel.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'World App - 首页'
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel,
    meta: {
      title: 'World App - 服务器管理'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 更新页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
