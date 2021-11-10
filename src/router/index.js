import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/portfolio',
    name: 'UNDP SIDS Portfolio',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Portfolio.vue')
  },
  {
    path: '/development-indicators',
    name: 'Development Indicators',
    component: () => import(/* webpackChunkName: "about" */ '../views/DevelopmentIndicators.vue')
  },
  {
    path: '/vulnerability',
    name: 'Vulnerability',
    component: () => import(/* webpackChunkName: "about" */ '../views/Vulnerability.vue')
  },
  {
    path: '/country-profiles',
    name: 'Country Profiles',
    component: () => import(/* webpackChunkName: "about" */ '../views/CountryProfiles.vue')
  },
  {
    path: '/geospatial-data',
    name: 'Geospatial Data',
    component: () => import(/* webpackChunkName: "about" */ '../views/GeospatialData.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export { router, routes }
