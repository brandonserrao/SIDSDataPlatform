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
      year: route.query.year || 'all',
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
          fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources')
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
          fundingSource: decodeURIComponent(route.query.fundingSource || 'All Funding Sources')
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
    path: '/development-indicators/:indicator?/:chartType?',
    link: '/development-indicators',
    name: 'Development Indicators',
    desctopOnly:true,
    component: () => import(/* webpackChunkName: "about" */ '../views/DevelopmentIndicators.vue'),
    beforeEnter: async (to, from, next) => {
      if(window.innerWidth < 960) {
        next('/')
      }

      if(!to.params.chartType) {
        next({ path: `/development-indicators/region/choro`})
      }
      if(!to.params.indicator) {
        next({ path: `/development-indicators/region/choro`})
      }
      await store.dispatch('indicators/getCategories');
      await store.dispatch('indicators/getMeta');
      await store.dispatch('indicators/getProfileData');
      next()
    },
    props: (to) => (
      {
        chartType: to.params.chartType,
        indicator: to.params.indicator,
        page: 'devIdictors'
      }
    ),
  },
  {
    path: '/vulnerability/:indicator?/:chartType?',
    link: '/vulnerability',
    name: 'Vulnerability',
    desctopOnly:true,
    component: () => import(/* webpackChunkName: "about" */ '../views/DevelopmentIndicators.vue'),
    beforeEnter: async (to, from, next) => {
      if(window.innerWidth < 960) {
        next('/')
      }
      if(!to.params.chartType) {
        next({ path: `/vulnerability/mvi/spider`})
      }
      if(!to.params.indicator) {
        next({ path: `/vulnerability/mvi/spider`})
      }
      await store.dispatch('indicators/getCategories');
      await store.dispatch('indicators/getMeta');
      await store.dispatch('indicators/getProfileData');
      next()
    },
    props: (to) => (
      {
        chartType: to.params.chartType,
        indicator: 'mvi',
        page: 'mvi'
      }
    ),
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
        next({ path: `/country-profiles/caboVerde`})
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
    redirect: function() {
      return window.innerWidth < 960 ? '/country-profiles' : '/portfolio'
    }
  }

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,

  routes
})
export { router, routes }
