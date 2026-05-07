import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dersler' },
    { path: '/dersler', component: HomeView, meta: { tab: 'dersler' } },
    { path: '/rapor', component: HomeView, meta: { tab: 'rapor' } },
    { path: '/bolumler', component: HomeView, meta: { tab: 'bolumler' } },
    { path: '/mekanlar', component: HomeView, meta: { tab: 'derslikler' } },
    { path: '/personeller', component: HomeView, meta: { tab: 'personeller' } },
    { path: '/yeni-ders', component: HomeView, meta: { tab: 'yeniDers' } }
  ]
})

export default router
