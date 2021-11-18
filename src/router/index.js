import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'


Vue.use(VueRouter)

const routes = [
  {
    path: '/portfolio',
    name: 'UNDP SIDS Portfolio',
    props: (route) => ({
      year: route.query.year || '2021',
      fundingCategory: decodeURIComponent(route.query.fundingCategory || 'All') ,
      fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources')
    }),
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Portfolio.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('getAllKeyData');
      await store.dispatch('setSIDSData');
      await store.dispatch('setFundingCategories');
      next()
    },
    children: [
      {
        path: 'samoa',
        name: 'SAMOA',
        component: () => import(/* webpackChunkName: "about" */ '../views/SAMOA.vue'),
        props: (route) => ({
          year: route.query.year || 'all',
          fundingCategory: decodeURIComponent(route.query.fundingCategory || 'All') ,
          fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources')
        }),
      },
      {
        path: 'sdgs',
        name: 'SDGS',
        component: () => import(/* webpackChunkName: "about" */ '../views/SDGS.vue'),
        props: (route) => ({
          year: route.query.year || 'all',
          fundingCategory: decodeURIComponent(route.query.fundingCategory || 'All') ,
          fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources')
        }),
      },
      {
        path: 'signature-solutions',
        name: 'SignatureSolutions',
        component: () => import(/* webpackChunkName: "about" */ '../views/SignatureSolutions.vue'),
        props: (route) => ({
          year: route.query.year || 'all',
          fundingCategory: decodeURIComponent(route.query.fundingCategory || 'All') ,
          fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources')
        }),
      },
      {
        path: '*',
        redirect: 'sdgs'
      },
      {
        path: '',
        redirect: 'sdgs'
      }
    ]
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
    component: () => import(/* webpackChunkName: "about" */ '../views/CountryProfiles.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('getMetaData');
      await store.dispatch('getAllKeyData');
      next()
    }
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
    redirect: '/about'
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
export { router, routes }
