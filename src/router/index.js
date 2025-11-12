import { createRouter, createWebHistory } from 'vue-router'
import Gallery from '../views/Gallery.vue'
import ArtworkDetail from '../views/ArtworkDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Gallery',
    component: Gallery
  },
  {
    path: '/artwork/:id',
    name: 'ArtworkDetail',
    component: ArtworkDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
