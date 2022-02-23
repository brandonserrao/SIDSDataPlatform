import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import vuetify from '@/plugins/vuetify';


Vue.use(VueRouter)

const routes = [
  {
    path: '/portfolio/:goalsType?',
    link: '/portfolio',
    name: 'UNDP SIDS Portfolio',
    props: (to) => ({
      region: to.query.region || 'All',
      year: to.query.year || 'all',
      fundingCategory: decodeURIComponent(to.query.fundingCategory || 'All') ,
      fundingSource: decodeURIComponent(to.query.fundingSource || 'All Funding Sources'),
      goalsType: to.params.goalsType || 'sdgs'
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
    }
  },
  {
    path: '/development-indicators/:indicator?/:year?/:chartType?',
    link: '/development-indicators',
    name: 'Development Indicators',
    component: () => import(/* webpackChunkName: "about" */ '../views/DevelopmentIndicators.vue'),
    beforeEnter: async (to, from, next) => {
      let chartType = to.params.chartType || 'choro',
      indicator = to.params.indicator || 'region',
      year = to.params.year || 'recentValue';
      if((vuetify.framework.breakpoint.xs || vuetify.framework.breakpoint.sm)
        && chartType !== 'series'
      ) {
        chartType = 'bars'
      }
      await store.dispatch('indicators/getDatasetsList');
      await store.dispatch('indicators/getCategories');
      await store.dispatch('indicators/getMeta');
      await store.dispatch('indicators/getProfileData');
      if(
        indicator === to.params.indicator &&
        year === to.params.year &&
        chartType === to.params.chartType
      ) {
        next()
      } else {
        next({ path: `/development-indicators/${indicator}/${year}/${chartType}`})
      }
    },
    props: (to) => (
      {
        chartType: to.params.chartType,
        indicator: to.params.indicator,
        year: to.params.year,
        page: 'devIdictors'
      }
    ),
  },
  {
    path: '/vulnerability/:indicator?/:chartType?',
    link: '/vulnerability',
    name: 'Vulnerability',
    component: () => import(/* webpackChunkName: "about" */ '../views/DevelopmentIndicators.vue'),
    beforeEnter: async (to, from, next) => {
      console.log(vuetify)
      let chartType = to.params.chartType || 'spider'
      if((vuetify.framework.breakpoint.xs || vuetify.framework.breakpoint.sm)
        && chartType !== 'series'
      ) {
        chartType = 'bars'
      }
      await store.dispatch('indicators/getCategories');
      await store.dispatch('indicators/getMeta');
      await store.dispatch('indicators/getProfileData');
      if(chartType === to.params.chartType) {
        next()
      } else {
        next({ path: `/vulnerability/mvi-index/${chartType}`})
      }
    },
    props: (to) => (
      {
        chartType: to.params.chartType,
        indicator: 'mvi-index',
        page: 'mvi',
        year: 'recentValue',
      }
    ),
  },
  {
    path: '/country-profiles/:country?',
    link: '/country-profiles',
    name: 'Country Profiles',
    component: () => import(/* webpackChunkName: "about" */ '../views/CountryProfiles.vue'),
    beforeEnter: async (to, from, next) => {
      await store.dispatch('profiles/getIndicatorsMetadata');
      if(!to.params.country) {
        next({ path: `/country-profiles/caboVerde`})
      }
      next();
    },
    props: (route) => ({
      activeCountryId: route.params.country || '',
      compareIdsList: route.query.compare && route.query.compare.split(',') || []
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
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((toRoute, fromRoute, next) => {
  let pagetitle = toRoute && toRoute.name ? toRoute.name : 'Home';
  window.document.title = `${pagetitle} - UNDP SIDS Data Platform`
  next();
})
export { router, routes }
