import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '../views/NotFound.vue'
import ChromeGame from '../views/ChromeGame.vue'
import BlankPage from '../views/BlankPage.vue'
import BrowserGameLauncher from '../views/BrowserGameLauncher.vue'

const routes = [
  {
    path: '/',
    name: 'BrowserGameLauncher',
    component: BrowserGameLauncher,
    meta: {
      title: '浏览器游戏启动器'
    }
  },
  {
    path: '/chrome-game',
    name: 'ChromeGame',
    component: ChromeGame,
    meta: {
      title: 'Chrome Game'
    }
  },
  {
    path: '/blank',
    name: 'BlankPage',
    component: BlankPage,
    meta: {
      title: ''
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404 Not Found'
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
