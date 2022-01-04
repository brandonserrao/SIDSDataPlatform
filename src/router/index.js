import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'


Vue.use(VueRouter)

const routes = [
  {
    path: '/portfolio',
    link: '/portfolio',
    name: 'UNDP SIDS Portfolio',
    props: (route) => ({
      region: route.query.region || 'All',
      year: route.query.year || '2021',
      fundingCategory: decodeURIComponent(route.query.fundingCategory || 'All') ,
      fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources')
    }),
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Portfolio.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('sids/getAllKeyData');
      await store.dispatch('sids/setSIDSData');
      await store.dispatch('sids/setFundingCategories');
      next()
    },
    children: [
      {
        path: 'samoa',
        name: 'SAMOA',
        component: () => import(/* webpackChunkName: "about" */ '../views/SAMOA.vue'),
        props: (route) => ({
          region: route.query.region || 'All',
          year: route.query.year || 'all',
          fundingCategory: decodeURIComponent(route.query.fundingCategory || 'All') ,
          fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources'),
          goalNumber: parseInt(route.query.goalNumber) || 1
        }),
      },
      {
        path: 'sdgs',
        name: 'SDGS',
        component: () => import(/* webpackChunkName: "about" */ '../views/SDGS.vue'),
        props: (route) => ({
          region: route.query.region || 'All',
          year: route.query.year || 'all',
          fundingCategory: decodeURIComponent(route.query.fundingCategory || 'All') ,
          fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources'),
          goalNumber: parseInt(route.query.goalNumber) || 1
        }),
      },
      {
        path: 'signature-solutions',
        name: 'SignatureSolutions',
        component: () => import(/* webpackChunkName: "about" */ '../views/SignatureSolutions.vue'),
        props: (route) => ({
          region: route.query.region || 'All',
          year: route.query.year || 'all',
          fundingCategory: decodeURIComponent(route.query.fundingCategory || 'All') ,
          fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources'),
          goalNumber: parseInt(route.query.goalNumber) || 1
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
    link: '/development-indicators',
    name: 'Development Indicators',
    component: () => import(/* webpackChunkName: "about" */ '../views/DevelopmentIndicators.vue'),
    props: () => ({
      view: 'indicators',
    }),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('indicators/getCategories');
      await store.dispatch('indicators/getMeta');
      next()
    },
  },
  {
    path: '/vulnerability',
    link: '/vulnerability',
    name: 'Vulnerability',
    component: () => import(/* webpackChunkName: "about" */ '../views/DevelopmentIndicators.vue'),
    props: () => ({
      view: 'vulnerability',
    }),
  },
  {
    path: '/country-profiles/:country?',
    link: '/country-profiles',
    name: 'Country Profiles',
    component: () => import(/* webpackChunkName: "about" */ '../views/CountryProfiles.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('sids/getMetaData');
      await store.dispatch('sids/getAllKeyData');
      if(!to.params.country) {
        next({ path: `/country-profiles/${store.state.sids.countryList[0].id}`})
      }
      next()
    },
    props: (route) => ({
      country: route.params.country || '',
      compare: route.query.compare && route.query.compare.split(',') || []
    }),
  },
  {
    path: '/geospatial-data',
    link: '/geospatial-data',
    name: 'Geospatial Data',
    component: () => import(/* webpackChunkName: "about" */ '../views/GeospatialData.vue')
  },
  {
    path: '/about',
    link: '/about',
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
