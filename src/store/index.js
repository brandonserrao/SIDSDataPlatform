import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import sids from '@/store/sids.store'
import indicators from '@/store/indicators.store'

export default new Vuex.Store({
  modules: {
    sids,
    indicators
  }
});
