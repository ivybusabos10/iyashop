import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import NProgress from 'nprogress'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Home
    },
    {
      path: '/admin-panel',
      name: 'admin-panel',
      component: () => import('./views/AdminPanel.vue')
    },
    {
      path: '/admin-panel/:target',
      name: 'admin-panel',
      component: () => import('./views/AdminPanel.vue')
    },
    {
      path: '/complaints',
      name: 'complaints',
      component: () => import('./views/Complaints.vue')
    }
  ]
})

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
      // Start the route progress bar.
      NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router